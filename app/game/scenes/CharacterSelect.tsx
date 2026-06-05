import { useState } from "react";
import { CHARACTERS } from "../data/characters";
import { ELEMENT_META } from "../data/elements";
import { Heading, GoldButton, Panel } from "../ui/primitives";
import { Sprite, type SpriteKind } from "../visual/Sprite";
import { sfx } from "../engine/sfx";

// Eight lore cards. Kael is selectable; the rest show as "Coming Soon".
export function CharacterSelect({
  onChoose,
  onBack,
}: {
  onChoose: () => void;
  onBack: () => void;
}) {
  const [selected, setSelected] = useState("kael");
  const active = CHARACTERS.find((c) => c.id === selected)!;

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 50% 0%, #1a2440 0%, #0a0f1f 60%, #05070f 100%)",
        }}
      />
      <div className="coer-vignette" style={{ position: "absolute", inset: 0 }} />

      <div style={{ position: "absolute", inset: 0, zIndex: 30 }} className="flex flex-col p-5">
        <Heading as="h1" className="text-2xl text-center mb-1">
          Choose Your Traveler
        </Heading>
        <p className="text-center text-xs text-[#bfb59c] mb-4">
          Eight roads, eight oaths. For this chapter, only the Exiled Knight walks.
        </p>

        <div className="flex gap-4 flex-1 min-h-0">
          {/* card grid */}
          <div className="grid grid-cols-4 gap-2.5 flex-1 content-start coer-scroll" style={{ overflowY: "auto" }}>
            {CHARACTERS.map((c) => {
              const isSel = c.id === selected;
              return (
                <button
                  key={c.id}
                  type="button"
                  onMouseEnter={() => sfx("advance")}
                  onClick={() => {
                    sfx("select");
                    setSelected(c.id);
                  }}
                  className="text-left"
                  style={{ opacity: c.playable ? 1 : 0.62 }}
                >
                  <Panel
                    frame={false}
                    className="p-2.5 h-full transition-all"
                  >
                    <div
                      style={{
                        borderColor: isSel ? "#e9cf86" : "transparent",
                        boxShadow: isSel ? "0 0 18px rgba(216,178,90,0.3)" : "none",
                        borderWidth: 1,
                        borderStyle: "solid",
                        borderRadius: 4,
                      }}
                      className="p-1"
                    >
                      <div className="flex justify-center mb-1">
                        <Sprite kind={portraitFor(c.id)} size={48} />
                      </div>
                      <div className="coer-heading text-[12px] text-center truncate">{c.name}</div>
                      <div className="text-[9px] text-center text-[#bfb59c] truncate">
                        {c.title}
                      </div>
                      <div className="flex justify-center mt-1">
                        {c.playable ? (
                          <span className="text-[8px] px-1.5 py-0.5 rounded-full border border-[rgba(216,178,90,0.5)] text-[#e9cf86]">
                            PLAYABLE
                          </span>
                        ) : (
                          <span className="text-[8px] px-1.5 py-0.5 rounded-full border border-[rgba(255,255,255,0.15)] text-[#7c745f]">
                            COMING SOON
                          </span>
                        )}
                      </div>
                    </div>
                  </Panel>
                </button>
              );
            })}
          </div>

          {/* detail panel */}
          <Panel className="w-[280px] p-4 shrink-0 flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="rounded coer-flicker"
                style={{
                  width: 64,
                  height: 64,
                  border: "1px solid rgba(216,178,90,0.5)",
                  background: "radial-gradient(circle, rgba(30,40,70,0.9), rgba(5,8,18,1))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Sprite kind={portraitFor(active.id)} size={52} />
              </div>
              <div>
                <div className="coer-heading text-lg leading-tight">{active.name}</div>
                <div className="text-[11px] text-[#bfb59c]">{active.title}</div>
              </div>
            </div>

            <Row label="Role" value={active.role} />
            <Row label="Weapon" value={active.weapon} />
            <Row
              label="Element"
              value={`${ELEMENT_META[active.element].icon} ${ELEMENT_META[active.element].name}`}
            />
            <Row label="Home" value={active.hometown} />

            <p className="text-[12px] text-[#cdbf9a] italic mt-2 mb-3 leading-relaxed">
              {active.motive}
            </p>

            <div className="grid grid-cols-3 gap-1.5 text-center mb-3">
              {(["hp", "sp", "atk", "def", "mag", "spd"] as const).map((k) => (
                <div key={k} className="rounded bg-black/30 py-1 border border-white/5">
                  <div className="text-[9px] uppercase text-[#bfb59c]">{k}</div>
                  <div className="text-sm text-[#e9cf86]">{active.baseStats[k]}</div>
                </div>
              ))}
            </div>

            <div className="mt-auto">
              {active.playable ? (
                <GoldButton
                  active
                  onClick={() => {
                    sfx("select");
                    onChoose();
                  }}
                  className="w-full"
                >
                  Begin the Ashen Oath
                </GoldButton>
              ) : (
                <div className="text-center text-[11px] text-[#7c745f] italic py-2">
                  This traveler's road awaits a future chapter.
                </div>
              )}
            </div>
          </Panel>
        </div>

        <div className="mt-3">
          <GoldButton onClick={() => { sfx("select"); onBack(); }}>← Back to Title</GoldButton>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-[11px] py-0.5 border-b border-white/5">
      <span className="text-[#bfb59c]">{label}</span>
      <span className="text-[#ece6d6] text-right ml-2">{value}</span>
    </div>
  );
}

function portraitFor(id: string): SpriteKind {
  switch (id) {
    case "kael":
      return "kael";
    case "elian":
      return "edrin";
    case "rowan":
      return "merchant";
    case "nyra":
      return "banditScout";
    case "orin":
      return "iceWisp";
    default:
      return "townsfolk";
  }
}
