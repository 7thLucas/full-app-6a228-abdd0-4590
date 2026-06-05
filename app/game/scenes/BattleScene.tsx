import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import type { ElementId } from "../data/types";
import { getEnemy } from "../data/enemies";
import { getSkill } from "../data/skills";
import { getItem } from "../data/items";
import { useGame } from "../engine/store";
import { applyExp } from "../engine/state";
import { effectiveStats } from "../engine/state";
import {
  makeEnemyRuntime,
  computeDamageToEnemy,
  computeDamageToPlayer,
  pickEnemySkill,
  affinityOf,
  fleeChance,
  MOMENTUM_BONUS,
  MAX_MOMENTUM,
  type EnemyRuntime,
} from "../engine/combat";
import { Sprite } from "../visual/Sprite";
import { Panel, Heading, StatBar, GoldButton } from "../ui/primitives";
import { sfx } from "../engine/sfx";
import { ELEMENT_META } from "../data/elements";

type CommandTab = "root" | "skills" | "item" | "momentum";

interface FloatNum {
  id: number;
  text: string;
  color: string;
  side: "player" | "enemy";
  big?: boolean;
}

interface BattleSceneProps {
  enemyId: string;
  isBoss: boolean;
  onEnd: (result: "victory" | "defeat" | "flee", playerHp: number, playerSp: number) => void;
}

export function BattleScene({ enemyId, isBoss, onEnd }: BattleSceneProps) {
  const game = useGame();
  const player = game.state.player;
  const eff = effectiveStats(player);

  const enemyRef = useRef<EnemyRuntime>(makeEnemyRuntime(enemyId));
  const enemy = enemyRef.current;

  // local combat state (HP/SP mutate; mirror into store on end)
  const hpRef = useRef(player.hp);
  const spRef = useRef(player.sp);
  const [, force] = useReducer((n) => n + 1, 0);

  const [turn, setTurn] = useState<"player" | "enemy">(
    eff.spd >= enemy.def.stats.spd ? "player" : "enemy",
  );
  const [tab, setTab] = useState<CommandTab>("root");
  const [momentum, setMomentum] = useState(eff.spd >= enemy.def.stats.spd ? 1 : 0);
  const [spendLevel, setSpendLevel] = useState(0);
  const [pendingAction, setPendingAction] = useState<
    | { kind: "attack" }
    | { kind: "skill"; id: string }
    | null
  >(null);
  const [defUpTurns, setDefUpTurns] = useState(0);
  const [log, setLog] = useState<string[]>([
    `A ${enemy.def.name} blocks the path!`,
  ]);
  const [floats, setFloats] = useState<FloatNum[]>([]);
  const [shake, setShake] = useState(0);
  const [shatterFx, setShatterFx] = useState(0);
  const [enemyHurt, setEnemyHurt] = useState(false);
  const [playerHurt, setPlayerHurt] = useState(false);
  const [ended, setEnded] = useState<"victory" | "defeat" | "flee" | null>(null);
  const [busy, setBusy] = useState(false);
  const floatId = useRef(0);
  const logRef = useRef<HTMLDivElement>(null);

  const pushLog = useCallback((msg: string) => {
    setLog((l) => [...l, msg].slice(-40));
  }, []);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [log]);

  const addFloat = useCallback((f: Omit<FloatNum, "id">) => {
    const id = floatId.current++;
    setFloats((arr) => [...arr, { ...f, id }]);
    setTimeout(() => setFloats((arr) => arr.filter((x) => x.id !== id)), 1100);
  }, []);

  // ── Player actions ─────────────────────────────────────────────────────────
  const doDamage = useCallback(
    (element: ElementId, power: number, label: string) => {
      const res = computeDamageToEnemy({
        atkStat: eff.atk,
        power,
        element,
        critChance: eff.crit,
        enemy,
        momentumLevel: spendLevel,
      });
      enemy.hp = Math.max(0, enemy.hp - res.damage);
      sfx("hit");
      setEnemyHurt(true);
      setTimeout(() => setEnemyHurt(false), 220);
      setShake((s) => s + 1);
      addFloat({
        id: 0,
        text: `${res.damage}${res.crit ? "!" : ""}`,
        color: res.affinity === "weak" ? "#ffd76a" : res.crit ? "#ff8a5a" : "#ffffff",
        side: "enemy",
        big: res.crit || res.affinity === "weak",
      } as FloatNum);

      let msg = `Kael's ${label} hits ${enemy.def.name} for ${res.damage}.`;
      if (res.affinity === "weak") msg += " Weakness struck!";
      if (res.affinity === "resist") msg += " It resisted.";
      if (res.crit) msg += " Critical!";
      pushLog(msg);

      if (res.shatteredNow) {
        sfx("shatter");
        setShatterFx((s) => s + 1);
        setShake((s) => s + 3);
        pushLog(`GUARD SHATTERED! ${enemy.def.name} is staggered — it will take +50% damage and lose its next turn!`);
      } else if (res.affinity === "weak" && enemy.maxGuardPoints > 0 && !enemy.shattered) {
        pushLog(`Guard Point removed (${enemy.guardPoints} remaining).`);
      }
      force();
      return res;
    },
    [eff.atk, eff.crit, enemy, spendLevel, addFloat, pushLog],
  );

  const endPlayerTurn = useCallback(() => {
    setSpendLevel(0);
    setPendingAction(null);
    setTab("root");
    if (enemy.hp <= 0) {
      finishVictory();
      return;
    }
    // gain momentum next turn happens at player's next turn start
    setTimeout(() => setTurn("enemy"), 450);
  }, [enemy]);

  const performAttack = useCallback(() => {
    setBusy(true);
    doDamage("sword", 1, "strike");
    setMomentum((m) => Math.max(0, m - spendLevel));
    setTimeout(() => {
      setBusy(false);
      endPlayerTurn();
    }, 350);
  }, [doDamage, spendLevel, endPlayerTurn]);

  const performSkill = useCallback(
    (skillId: string) => {
      const skill = getSkill(skillId);
      if (spRef.current < skill.spCost) {
        sfx("error");
        pushLog("Not enough SP.");
        return;
      }
      setBusy(true);
      spRef.current -= skill.spCost;
      if (skill.effect === "defUp") {
        setDefUpTurns(2);
        pushLog("Kael raises a Defiant Guard. DEF surges for 2 turns.");
        sfx("item");
        setMomentum((m) => Math.max(0, m - spendLevel));
        setTimeout(() => {
          setBusy(false);
          endPlayerTurn();
        }, 350);
        return;
      }
      const res = doDamage(skill.element, skill.power, skill.name);
      if (skill.effect === "stun" && Math.random() < 0.4 && !enemy.shattered) {
        enemy.shatterTurns = 1;
        enemy.shattered = true;
        pushLog(`${enemy.def.name} is staggered by the bash!`);
        setShatterFx((s) => s + 1);
      }
      void res;
      setMomentum((m) => Math.max(0, m - spendLevel));
      setTimeout(() => {
        setBusy(false);
        endPlayerTurn();
      }, 350);
    },
    [doDamage, spendLevel, endPlayerTurn, enemy, pushLog],
  );

  const performItem = useCallback(
    (itemId: string) => {
      const item = getItem(itemId);
      const res = game.useConsumable(itemId);
      if (!res) {
        sfx("error");
        return;
      }
      sfx("item");
      if (res.healedHp) {
        hpRef.current = Math.min(player.maxHp, hpRef.current + res.healedHp);
        addFloat({ id: 0, text: `+${res.healedHp}`, color: "#7ee08a", side: "player" } as FloatNum);
      }
      if (res.healedSp) {
        spRef.current = Math.min(player.maxSp, spRef.current + res.healedSp);
        addFloat({ id: 0, text: `+${res.healedSp} SP`, color: "#7fb4d6", side: "player" } as FloatNum);
      }
      pushLog(`Kael uses ${item.name}.`);
      setBusy(true);
      setTimeout(() => {
        setBusy(false);
        endPlayerTurn();
      }, 350);
    },
    [game, player.maxHp, player.maxSp, addFloat, pushLog, endPlayerTurn],
  );

  const performGuard = useCallback(() => {
    setDefUpTurns(1);
    pushLog("Kael guards, bracing against the next blow.");
    setMomentum((m) => Math.min(MAX_MOMENTUM, m + 1));
    sfx("select");
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      endPlayerTurn();
    }, 300);
  }, [pushLog, endPlayerTurn]);

  const performAnalyze = useCallback(() => {
    const weak = enemy.def.weaknesses.map((w) => ELEMENT_META[w].name).join(", ");
    const resist = enemy.def.resists.map((w) => ELEMENT_META[w].name).join(", ") || "none";
    pushLog(`Analyze — ${enemy.def.name}: HP ${enemy.hp}/${enemy.maxHp}. Weak to ${weak}. Resists ${resist}.`);
    sfx("select");
    setTab("root");
  }, [enemy, pushLog]);

  const performFlee = useCallback(() => {
    if (isBoss) {
      sfx("error");
      pushLog("There is no fleeing the Hollow Guard.");
      return;
    }
    const chance = fleeChance(eff.spd, enemy.def.stats.spd);
    if (Math.random() < chance) {
      pushLog("Kael breaks away into the snow.");
      sfx("advance");
      setEnded("flee");
      setTimeout(() => onEnd("flee", hpRef.current, spRef.current), 700);
    } else {
      pushLog("Couldn't escape!");
      sfx("error");
      setBusy(true);
      setTimeout(() => {
        setBusy(false);
        endPlayerTurn();
      }, 300);
    }
  }, [isBoss, eff.spd, enemy, pushLog, onEnd, endPlayerTurn]);

  // ── Victory ──────────────────────────────────────────────────────────────
  const finishVictory = useCallback(() => {
    setEnded("victory");
    sfx("victory");
  }, []);

  // ── Enemy turn ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (turn !== "enemy" || ended) return;
    let cancelled = false;
    const run = async () => {
      await wait(550);
      if (cancelled) return;
      // tick defUp
      setDefUpTurns((d) => Math.max(0, d - 1));
      if (enemy.shattered) {
        pushLog(`${enemy.def.name} is Shattered and loses its turn.`);
        enemy.shatterTurns -= 1;
        if (enemy.shatterTurns <= 0) enemy.shattered = false;
        force();
        await wait(600);
        if (cancelled) return;
        startPlayerTurn();
        return;
      }
      const skill = pickEnemySkill(enemy);
      const dmg = computeDamageToPlayer({
        enemy,
        skill,
        playerDef: eff.def,
        playerDefUp: defUpTurns > 0,
      }).damage;
      hpRef.current = Math.max(0, hpRef.current - dmg);
      sfx("hit");
      setPlayerHurt(true);
      setShake((s) => s + 1);
      setTimeout(() => setPlayerHurt(false), 220);
      addFloat({ id: 0, text: `${dmg}`, color: "#ff6a6a", side: "player" } as FloatNum);
      pushLog(`${enemy.def.name}${skill ? ` uses ${skill.name} and` : ""} hits Kael for ${dmg}.`);
      force();
      await wait(500);
      if (cancelled) return;
      if (hpRef.current <= 0) {
        pushLog("Kael falls to one knee... darkness takes him.");
        setEnded("defeat");
        sfx("error");
        return;
      }
      startPlayerTurn();
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [turn, ended]);

  const startPlayerTurn = useCallback(() => {
    setMomentum((m) => Math.min(MAX_MOMENTUM, m + 1));
    setTab("root");
    setSpendLevel(0);
    setTurn("player");
  }, []);

  // turn order display
  const order = useMemo(() => {
    const list = [
      { name: "Kael", spd: eff.spd, you: true },
      { name: enemy.def.name, spd: enemy.def.stats.spd, you: false },
    ].sort((a, b) => b.spd - a.spd);
    return list;
  }, []);

  const skillList = player.unlockedSkills.map((id) => getSkill(id));
  const consumables = Object.entries(player.inventory).filter(
    ([id]) => getItem(id)?.category === "consumable",
  );

  return (
    <div
      style={{ position: "absolute", inset: 0, zIndex: 70, overflow: "hidden" }}
      className={shake ? "coer-shake" : undefined}
      key={`battle-shake-${shake}`}
    >
      {/* battle backdrop */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: isBoss
            ? "radial-gradient(ellipse at 50% 35%, #2a1840 0%, #120a22 60%, #05030c 100%)"
            : "radial-gradient(ellipse at 50% 40%, #16243a 0%, #0c1424 60%, #05080f 100%)",
        }}
      />
      {/* vignette */}
      <div className="coer-vignette" style={{ position: "absolute", inset: 0 }} />

      {/* turn order bar */}
      <div
        style={{ position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", zIndex: 75 }}
        className="flex items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-widest text-[#bfb59c] mr-1">Order</span>
        {order.map((o, i) => (
          <div
            key={o.name + i}
            className="px-2.5 py-1 rounded-full border text-[11px]"
            style={{
              borderColor:
                (turn === "player") === o.you ? "#e9cf86" : "rgba(216,178,90,0.3)",
              color: (turn === "player") === o.you ? "#e9cf86" : "#9a917c",
              background: (turn === "player") === o.you ? "rgba(216,178,90,0.12)" : "transparent",
            }}
          >
            {o.name}
          </div>
        ))}
      </div>

      {/* Enemy */}
      <div
        style={{
          position: "absolute",
          top: "16%",
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          zIndex: 72,
        }}
      >
        <div className="relative">
          <div className={`${enemyHurt ? "opacity-60" : ""} ${enemy.shattered ? "coer-shake" : "coer-bob"}`}>
            <Sprite kind={enemy.def.spriteKind} size={isBoss ? 168 : 120} />
          </div>
          {shatterFx > 0 && (
            <div
              key={`sf-${shatterFx}`}
              className="coer-shatter-flash"
              style={{
                position: "absolute",
                inset: -20,
                background: "radial-gradient(circle, rgba(199,91,255,0.7), transparent 65%)",
                pointerEvents: "none",
              }}
            />
          )}
          {/* enemy floats */}
          {floats
            .filter((f) => f.side === "enemy")
            .map((f) => (
              <span
                key={f.id}
                className="coer-dmg"
                style={{
                  position: "absolute",
                  left: "50%",
                  top: 10,
                  transform: "translateX(-50%)",
                  color: f.color,
                  fontWeight: 800,
                  fontSize: f.big ? 32 : 22,
                  textShadow: "0 2px 6px rgba(0,0,0,0.8)",
                  fontFamily: "'Cinzel', serif",
                }}
              >
                {f.text}
              </span>
            ))}
        </div>

        {/* enemy nameplate */}
        <div className="mt-2 mx-auto" style={{ width: isBoss ? 280 : 220 }}>
          <Panel className="px-3 py-2">
            <div className="flex items-center justify-between mb-1">
              <span className="coer-heading text-xs">{enemy.def.name}</span>
              {enemy.shattered && (
                <span className="text-[10px] font-bold text-[#c75bff] coer-blink">SHATTERED</span>
              )}
            </div>
            <StatBar value={enemy.hp} max={enemy.maxHp} color="hp" compact />
            <div className="flex items-center justify-between mt-1.5">
              {/* guard pips */}
              {enemy.maxGuardPoints > 0 && (
                <div className="flex items-center gap-1">
                  <span className="text-[9px] text-[#bfb59c] uppercase">Guard</span>
                  {Array.from({ length: enemy.maxGuardPoints }).map((_, i) => (
                    <span
                      key={i}
                      style={{
                        width: 9,
                        height: 9,
                        borderRadius: "50%",
                        background: i < enemy.guardPoints ? "#e9cf86" : "transparent",
                        border: "1px solid rgba(216,178,90,0.6)",
                        boxShadow: i < enemy.guardPoints ? "0 0 6px #e9cf86" : "none",
                      }}
                    />
                  ))}
                </div>
              )}
              {/* weakness icons */}
              <div className="flex items-center gap-1 ml-auto">
                {enemy.def.weaknesses.map((w) => (
                  <span
                    key={w}
                    title={`Weak: ${ELEMENT_META[w].name}`}
                    style={{ fontSize: 12 }}
                  >
                    {ELEMENT_META[w].icon}
                  </span>
                ))}
              </div>
            </div>
          </Panel>
        </div>
      </div>

      {/* Player sprite */}
      <div
        style={{
          position: "absolute",
          bottom: "26%",
          left: "16%",
          zIndex: 71,
        }}
      >
        <div className={`relative ${playerHurt ? "opacity-60" : "coer-breathe"}`}>
          <Sprite kind="kael" size={104} facing="right" />
          {floats
            .filter((f) => f.side === "player")
            .map((f) => (
              <span
                key={f.id}
                className="coer-dmg"
                style={{
                  position: "absolute",
                  left: "50%",
                  top: -4,
                  transform: "translateX(-50%)",
                  color: f.color,
                  fontWeight: 800,
                  fontSize: 22,
                  textShadow: "0 2px 6px rgba(0,0,0,0.8)",
                  fontFamily: "'Cinzel', serif",
                }}
              >
                {f.text}
              </span>
            ))}
        </div>
      </div>

      {/* Combat log */}
      <div
        ref={logRef}
        className="coer-scroll"
        style={{
          position: "absolute",
          right: 14,
          top: 70,
          width: 220,
          maxHeight: 150,
          overflowY: "auto",
          zIndex: 73,
        }}
      >
        <Panel className="px-3 py-2">
          {log.map((l, i) => (
            <p key={i} className="text-[11px] leading-snug text-[#cdbf9a] mb-1 last:mb-0">
              {l}
            </p>
          ))}
        </Panel>
      </div>

      {/* Player HUD + commands */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 76 }}>
        <Panel frame={false} className="m-2 px-4 py-3">
          <div className="flex items-end gap-4">
            {/* stats */}
            <div style={{ width: 200 }}>
              <div className="coer-heading text-sm mb-1">Kael · Lv {player.level}</div>
              <StatBar value={hpRef.current} max={player.maxHp} color="hp" label="HP" />
              <div className="h-1.5" />
              <StatBar value={spRef.current} max={player.maxSp} color="sp" label="SP" />
              {/* Momentum meter */}
              <div className="mt-2">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-[#bfb59c] mb-0.5">
                  <span>Momentum</span>
                  <span>{momentum}/{MAX_MOMENTUM}</span>
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: MAX_MOMENTUM }).map((_, i) => (
                    <span
                      key={i}
                      style={{
                        flex: 1,
                        height: 7,
                        borderRadius: 3,
                        background: i < momentum
                          ? "linear-gradient(90deg,#e07a3c,#e9cf86)"
                          : "rgba(255,255,255,0.08)",
                        boxShadow: i < momentum ? "0 0 6px rgba(224,122,60,0.6)" : "none",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* command area */}
            <div className="flex-1 min-h-[96px]">
              {turn === "player" && !busy && !ended ? (
                <CommandPanel
                  tab={tab}
                  setTab={setTab}
                  skills={skillList}
                  consumables={consumables}
                  momentum={momentum}
                  spendLevel={spendLevel}
                  setSpendLevel={setSpendLevel}
                  pendingAction={pendingAction}
                  setPendingAction={setPendingAction}
                  onAttack={performAttack}
                  onSkill={performSkill}
                  onItem={performItem}
                  onGuard={performGuard}
                  onAnalyze={performAnalyze}
                  onFlee={performFlee}
                  isBoss={isBoss}
                  playerSp={spRef.current}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-[#9a917c] text-sm italic">
                  {ended ? "" : turn === "enemy" ? "The enemy moves..." : "..."}
                </div>
              )}
            </div>
          </div>
        </Panel>
      </div>

      {/* Victory / Defeat overlays */}
      {ended === "victory" && (
        <VictoryOverlay
          enemyId={enemyId}
          isBoss={isBoss}
          onContinue={() => onEnd("victory", hpRef.current, spRef.current)}
        />
      )}
      {ended === "defeat" && (
        <DefeatOverlay onChoice={() => onEnd("defeat", 0, spRef.current)} />
      )}
    </div>
  );
}

// ── Command panel ────────────────────────────────────────────────────────────
function CommandPanel(props: {
  tab: CommandTab;
  setTab: (t: CommandTab) => void;
  skills: ReturnType<typeof getSkill>[];
  consumables: [string, number][];
  momentum: number;
  spendLevel: number;
  setSpendLevel: (n: number) => void;
  pendingAction: { kind: "attack" } | { kind: "skill"; id: string } | null;
  setPendingAction: (a: { kind: "attack" } | { kind: "skill"; id: string } | null) => void;
  onAttack: () => void;
  onSkill: (id: string) => void;
  onItem: (id: string) => void;
  onGuard: () => void;
  onAnalyze: () => void;
  onFlee: () => void;
  isBoss: boolean;
  playerSp: number;
}) {
  const {
    tab,
    setTab,
    skills,
    consumables,
    momentum,
    spendLevel,
    setSpendLevel,
    pendingAction,
    setPendingAction,
    onAttack,
    onSkill,
    onItem,
    onGuard,
    onAnalyze,
    onFlee,
    isBoss,
    playerSp,
  } = props;

  // momentum chooser before committing an attack/skill
  if (tab === "momentum" && pendingAction) {
    return (
      <div>
        <div className="text-xs text-[#bfb59c] mb-2">
          Spend Momentum for a damage bonus, then strike:
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: momentum + 1 }).map((_, lvl) => (
            <GoldButton
              key={lvl}
              active={spendLevel === lvl}
              onClick={() => setSpendLevel(lvl)}
              className="px-3 py-1.5"
            >
              {lvl === 0 ? "None" : `${lvl} ▸ +${Math.round(MOMENTUM_BONUS[lvl] * 100)}%`}
            </GoldButton>
          ))}
        </div>
        <div className="flex gap-2 mt-3">
          <GoldButton
            onClick={() => {
              if (pendingAction.kind === "attack") onAttack();
              else onSkill(pendingAction.id);
            }}
            active
          >
            Strike{spendLevel === MAX_MOMENTUM ? " ✦" : ""}
          </GoldButton>
          <GoldButton
            onClick={() => {
              setSpendLevel(0);
              setPendingAction(null);
              setTab("root");
            }}
          >
            Back
          </GoldButton>
        </div>
      </div>
    );
  }

  if (tab === "skills") {
    return (
      <div>
        <div className="grid grid-cols-2 gap-2">
          {skills.map((s) => (
            <GoldButton
              key={s.id}
              disabled={playerSp < s.spCost}
              title={s.description}
              onClick={() => {
                if (s.effect === "defUp") {
                  onSkill(s.id);
                  return;
                }
                setPendingAction({ kind: "skill", id: s.id });
                setTab("momentum");
              }}
              className="justify-start text-left"
            >
              <span className="flex justify-between w-full">
                <span>{s.name}</span>
                <span className="text-[#7fb4d6] text-xs ml-2">{s.spCost} SP</span>
              </span>
            </GoldButton>
          ))}
        </div>
        <div className="mt-2">
          <GoldButton onClick={() => setTab("root")} className="px-3 py-1">
            Back
          </GoldButton>
        </div>
      </div>
    );
  }

  if (tab === "item") {
    return (
      <div>
        {consumables.length === 0 ? (
          <div className="text-sm text-[#9a917c] italic mb-2">No usable items.</div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {consumables.map(([id, qty]) => (
              <GoldButton key={id} onClick={() => onItem(id)} className="justify-start text-left">
                <span className="flex justify-between w-full">
                  <span>{getItem(id).name}</span>
                  <span className="text-[#bfb59c] text-xs ml-2">×{qty}</span>
                </span>
              </GoldButton>
            ))}
          </div>
        )}
        <div className="mt-2">
          <GoldButton onClick={() => setTab("root")} className="px-3 py-1">
            Back
          </GoldButton>
        </div>
      </div>
    );
  }

  // root commands
  return (
    <div className="grid grid-cols-3 gap-2">
      <GoldButton
        onClick={() => {
          setPendingAction({ kind: "attack" });
          setSpendLevel(0);
          setTab("momentum");
        }}
      >
        Attack
      </GoldButton>
      <GoldButton onClick={() => setTab("skills")}>Skills</GoldButton>
      <GoldButton onClick={onGuard}>Guard</GoldButton>
      <GoldButton onClick={() => setTab("item")}>Item</GoldButton>
      <GoldButton onClick={onAnalyze}>Analyze</GoldButton>
      <GoldButton onClick={onFlee} disabled={isBoss}>
        Flee
      </GoldButton>
    </div>
  );
}

// ── Victory overlay (applies exp/coins/level-up) ─────────────────────────────
function VictoryOverlay({
  enemyId,
  isBoss,
  onContinue,
}: {
  enemyId: string;
  isBoss: boolean;
  onContinue: () => void;
}) {
  const game = useGame();
  const def = getEnemy(enemyId);
  const appliedRef = useRef(false);
  const [levelUp, setLevelUp] = useState<ReturnType<typeof applyExp> | null>(null);
  const [showLevel, setShowLevel] = useState(false);

  useEffect(() => {
    if (appliedRef.current) return;
    appliedRef.current = true;
    const p = game.state.player;
    p.coins += def.coinReward;
    const lu = applyExp(p, def.expReward);
    // Unlock Ashen Strike after the boss.
    if (isBoss) game.unlockSkill("ashenStrike");
    setLevelUp(lu);
    if (lu.leveled) {
      sfx("levelup");
      setTimeout(() => setShowLevel(true), 900);
    }
    game.forceUpdate();
  }, []);

  return (
    <div
      style={{ position: "absolute", inset: 0, zIndex: 90, background: "rgba(0,0,0,0.6)" }}
      className="flex items-center justify-center coer-fade-in"
    >
      <Panel className="px-8 py-6 text-center" >
        <Heading className="text-2xl mb-3">Victory</Heading>
        <p className="text-sm text-[#cdbf9a] mb-1">{def.name} defeated.</p>
        <div className="flex justify-center gap-6 my-4 text-sm">
          <div>
            <div className="text-[#e9cf86] text-xl coer-heading">+{def.expReward}</div>
            <div className="text-[10px] uppercase tracking-wider text-[#bfb59c]">EXP</div>
          </div>
          <div>
            <div className="text-[#e9cf86] text-xl coer-heading">+{def.coinReward}</div>
            <div className="text-[10px] uppercase tracking-wider text-[#bfb59c]">Coins</div>
          </div>
        </div>

        {isBoss && (
          <p className="text-xs text-[#c75bff] mb-3 coer-flicker">
            New skill learned: Ashen Strike.
          </p>
        )}

        {showLevel && levelUp?.leveled && (
          <div className="coer-fade-in mb-3 p-3 rounded border border-[rgba(216,178,90,0.4)] bg-[rgba(216,178,90,0.06)]">
            <div className="coer-heading text-lg mb-1">Level Up! → Lv {levelUp.newLevel}</div>
            <div className="text-xs text-[#cdbf9a] flex justify-center gap-3 flex-wrap">
              <span>+{levelUp.gains.hp} HP</span>
              <span>+{levelUp.gains.sp} SP</span>
              <span>+{levelUp.gains.atk} ATK</span>
              <span>+{levelUp.gains.def} DEF</span>
            </div>
          </div>
        )}

        <GoldButton onClick={onContinue} active className="mt-1 px-6">
          Continue
        </GoldButton>
      </Panel>
    </div>
  );
}

function DefeatOverlay({ onChoice }: { onChoice: () => void }) {
  return (
    <div
      style={{ position: "absolute", inset: 0, zIndex: 90, background: "rgba(0,0,0,0.85)" }}
      className="flex items-center justify-center coer-fade-in"
    >
      <Panel className="px-8 py-6 text-center">
        <Heading className="text-2xl mb-2" >Fallen</Heading>
        <p className="text-sm text-[#9a917c] mb-5 italic">
          The snow closes over the exile... but his story is not finished.
        </p>
        <GoldButton onClick={onChoice} active className="px-6">
          Return to safety
        </GoldButton>
      </Panel>
    </div>
  );
}

function wait(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

// re-export to satisfy unused import lint awareness
void affinityOf;
