import { useState } from "react";
import { useGame } from "../engine/store";
import { effectiveStats } from "../engine/state";
import { getItem, ITEMS } from "../data/items";
import { getSkill } from "../data/skills";
import { KAEL } from "../data/characters";
import { MAIN_QUEST } from "../data/quests";
import { ELEMENT_META } from "../data/elements";
import { Heading, GoldButton, Panel, StatBar } from "../ui/primitives";
import { Sprite } from "../visual/Sprite";
import { SettingsScreen } from "../scenes/SettingsScreen";
import { sfx } from "../engine/sfx";

type Tab =
  | "party"
  | "inventory"
  | "equipment"
  | "skills"
  | "quests"
  | "settings"
  | "save"
  | "title";

const TABS: { id: Tab; label: string }[] = [
  { id: "party", label: "Party" },
  { id: "inventory", label: "Inventory" },
  { id: "equipment", label: "Equipment" },
  { id: "skills", label: "Skills" },
  { id: "quests", label: "Quests" },
  { id: "settings", label: "Settings" },
  { id: "save", label: "Save / Load" },
  { id: "title", label: "Return to Title" },
];

export function PauseMenu({
  onClose,
  onReturnTitle,
}: {
  onClose: () => void;
  onReturnTitle: () => void;
}) {
  const game = useGame();
  const [tab, setTab] = useState<Tab>("party");

  if (tab === "settings") {
    return <SettingsScreen onBack={() => setTab("party")} />;
  }

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 80 }} className="flex coer-fade-in">
      <div style={{ position: "absolute", inset: 0, background: "rgba(2,4,10,0.82)" }} />

      {/* side tabs */}
      <div
        className="relative z-10 flex flex-col gap-1.5 p-4 border-r border-[rgba(216,178,90,0.25)]"
        style={{ width: 200, background: "rgba(8,12,26,0.6)" }}
      >
        <Heading className="text-lg mb-3">Menu</Heading>
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            data-active={tab === t.id}
            onClick={() => {
              sfx("select");
              if (t.id === "title") return onReturnTitle();
              setTab(t.id);
            }}
            className="coer-menu-item text-left text-sm py-1.5 text-[#ece6d6]"
          >
            {t.label}
          </button>
        ))}
        <div className="mt-auto pt-3">
          <GoldButton onClick={onClose} className="w-full">
            Resume (Esc)
          </GoldButton>
        </div>
      </div>

      {/* content */}
      <div className="relative z-10 flex-1 p-6 overflow-auto coer-scroll">
        {tab === "party" && <PartyTab />}
        {tab === "inventory" && <InventoryTab />}
        {tab === "equipment" && <EquipmentTab />}
        {tab === "skills" && <SkillsTab />}
        {tab === "quests" && <QuestsTab />}
        {tab === "save" && <SaveTab onLoaded={onClose} />}
      </div>
    </div>
  );
}

function PartyTab() {
  const game = useGame();
  const p = game.state.player;
  const eff = effectiveStats(p);
  return (
    <div>
      <Heading className="text-xl mb-4">Party</Heading>
      <Panel className="p-4 max-w-md">
        <div className="flex items-center gap-4 mb-3">
          <div
            className="rounded coer-flicker"
            style={{
              width: 72,
              height: 72,
              border: "1px solid rgba(216,178,90,0.5)",
              background: "radial-gradient(circle, rgba(30,40,70,0.9), rgba(5,8,18,1))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Sprite kind="kael" size={56} />
          </div>
          <div className="flex-1">
            <div className="coer-heading text-lg">{KAEL.name} · Lv {p.level}</div>
            <div className="text-[11px] text-[#bfb59c] mb-1">{KAEL.title}</div>
            <StatBar value={p.hp} max={p.maxHp} color="hp" label="HP" />
            <div className="h-1" />
            <StatBar value={p.sp} max={p.maxSp} color="sp" label="SP" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          {(["atk", "def", "mag", "spd", "crit"] as const).map((k) => (
            <Stat key={k} label={k} value={eff[k]} />
          ))}
          <Stat label="coins" value={p.coins} />
        </div>
        <div className="mt-3 text-[11px] text-[#bfb59c]">
          EXP: {p.exp} / {p.expToNext}
        </div>
      </Panel>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded bg-black/30 py-1.5 border border-white/5">
      <div className="text-[9px] uppercase text-[#bfb59c]">{label}</div>
      <div className="text-sm text-[#e9cf86]">{value}</div>
    </div>
  );
}

function InventoryTab() {
  const game = useGame();
  const p = game.state.player;
  const entries = Object.entries(p.inventory);
  return (
    <div>
      <Heading className="text-xl mb-4">Inventory</Heading>
      {entries.length === 0 ? (
        <p className="text-sm text-[#9a917c] italic">Your pack is empty.</p>
      ) : (
        <div className="grid grid-cols-2 gap-2 max-w-2xl">
          {entries.map(([id, qty]) => {
            const item = getItem(id);
            if (!item) return null;
            const usable = item.category === "consumable";
            return (
              <Panel key={id} className="p-3 flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm text-[#ece6d6]">
                    {item.name} <span className="text-[#bfb59c] text-xs">×{qty}</span>
                  </div>
                  <div className="text-[11px] text-[#9a917c] mt-0.5">{item.description}</div>
                </div>
                {usable && (
                  <GoldButton
                    className="px-2 py-1 text-xs shrink-0"
                    onClick={() => {
                      const r = game.useConsumable(id);
                      if (r) sfx("item");
                    }}
                  >
                    Use
                  </GoldButton>
                )}
              </Panel>
            );
          })}
        </div>
      )}
    </div>
  );
}

function EquipmentTab() {
  const game = useGame();
  const p = game.state.player;
  const slots: { slot: "weapon" | "shield" | "armor" | "accessory"; label: string }[] = [
    { slot: "weapon", label: "Weapon" },
    { slot: "shield", label: "Shield" },
    { slot: "armor", label: "Armor" },
    { slot: "accessory", label: "Accessory" },
  ];
  return (
    <div>
      <Heading className="text-xl mb-4">Equipment</Heading>
      <div className="grid gap-2 max-w-xl">
        {slots.map(({ slot, label }) => {
          const equippedId = p.equipment[slot];
          const equipped = equippedId ? getItem(equippedId) : null;
          // owned items for this slot (equipment held in inventory or known)
          const owned = Object.values(ITEMS).filter(
            (it) => it.slot === slot && (p.inventory[it.id] || equippedId === it.id || it.price === 0),
          );
          return (
            <Panel key={slot} className="p-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] uppercase tracking-wider text-[#bfb59c]">{label}</span>
                <span className="text-sm text-[#e9cf86]">
                  {equipped ? equipped.name : "— empty —"}
                </span>
              </div>
              {equipped?.bonus && (
                <div className="text-[11px] text-[#9fd6b0] mb-1.5">
                  {Object.entries(equipped.bonus)
                    .map(([k, v]) => `+${v} ${k.toUpperCase()}`)
                    .join("  ")}
                </div>
              )}
              <div className="flex flex-wrap gap-1.5">
                {owned.map((it) => (
                  <button
                    key={it.id}
                    type="button"
                    onClick={() => { game.equip(it.id); sfx("select"); }}
                    className="text-[11px] px-2 py-1 rounded border border-[rgba(216,178,90,0.3)] hover:border-[#e9cf86] text-[#cdbf9a] hover:text-[#e9cf86]"
                    data-active={equippedId === it.id}
                    style={equippedId === it.id ? { borderColor: "#e9cf86", color: "#e9cf86" } : undefined}
                  >
                    {it.name}
                  </button>
                ))}
              </div>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}

function SkillsTab() {
  const game = useGame();
  const p = game.state.player;
  return (
    <div>
      <Heading className="text-xl mb-4">Skills</Heading>
      <div className="grid gap-2 max-w-xl">
        {KAEL.skillIds.map((id) => {
          const s = getSkill(id);
          const unlocked = p.unlockedSkills.includes(id);
          return (
            <Panel key={id} className="p-3" frame={false}>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${unlocked ? "text-[#ece6d6]" : "text-[#7c745f]"}`}>
                  {s.name} {!unlocked && <span className="text-[10px]">(locked)</span>}
                </span>
                <span className="text-xs text-[#7fb4d6]">
                  {s.spCost} SP · {ELEMENT_META[s.element].icon} {ELEMENT_META[s.element].name}
                </span>
              </div>
              <div className="text-[11px] text-[#9a917c] mt-1">{s.description}</div>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}

function QuestsTab() {
  const game = useGame();
  const idx = game.state.questIndex;
  return (
    <div>
      <Heading className="text-xl mb-1">Quest Journal</Heading>
      <Panel className="p-4 max-w-xl mt-3">
        <div className="coer-heading text-base mb-1">{MAIN_QUEST.name}</div>
        <p className="text-[12px] text-[#bfb59c] italic mb-3">{MAIN_QUEST.description}</p>
        <ol className="space-y-1.5">
          {MAIN_QUEST.objectives.map((o, i) => {
            const done = i < idx;
            const current = i === idx;
            return (
              <li
                key={o.id}
                className="flex items-start gap-2 text-[13px]"
                style={{
                  color: done ? "#7ee08a" : current ? "#e9cf86" : "#9a917c",
                }}
              >
                <span className="mt-0.5">
                  {done ? "✔" : current ? "▸" : "○"}
                </span>
                <span style={{ textDecoration: done ? "line-through" : undefined }}>
                  {o.text}
                </span>
              </li>
            );
          })}
        </ol>
      </Panel>
    </div>
  );
}

function SaveTab({ onLoaded }: { onLoaded: () => void }) {
  const game = useGame();
  const [msg, setMsg] = useState<string | null>(null);
  const saved = game.state.savedAt;
  return (
    <div>
      <Heading className="text-xl mb-4">Save / Load</Heading>
      <Panel className="p-4 max-w-md">
        <p className="text-[12px] text-[#bfb59c] mb-3">
          Your journey is preserved in this realm's memory (browser storage). You may also
          save at the blue crystal in Veyrhold.
        </p>
        {saved && (
          <p className="text-[11px] text-[#9a917c] mb-3">
            Last saved: {new Date(saved).toLocaleString()}
          </p>
        )}
        <div className="flex gap-2">
          <GoldButton
            active
            onClick={() => {
              game.saveNow();
              sfx("save");
              setMsg("Progress saved.");
            }}
          >
            Save
          </GoldButton>
          <GoldButton
            onClick={() => {
              const ok = game.continueGame();
              if (ok) {
                sfx("select");
                setMsg("Loaded last save.");
                onLoaded();
              } else {
                sfx("error");
                setMsg("No save found.");
              }
            }}
          >
            Load
          </GoldButton>
        </div>
        {msg && <p className="text-[12px] text-[#7ee08a] mt-3">{msg}</p>}
      </Panel>
    </div>
  );
}
