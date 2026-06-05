import { useState } from "react";
import { DIALOGUES } from "../data/dialogue";
import { DialogueBox } from "../ui/DialogueBox";
import { Heading, GoldButton } from "../ui/primitives";
import { Sprite } from "../visual/Sprite";
import { sfx } from "../engine/sfx";

// Ending cutscene: black-sun mark sears onto Kael's hand, a voice speaks,
// then "End of Prototype".
export function EndingScene({
  textSpeed,
  onReturnTitle,
}: {
  textSpeed: "slow" | "normal" | "fast";
  onReturnTitle: () => void;
}) {
  const [phase, setPhase] = useState<"dialogue" | "card">("dialogue");
  const [markVisible, setMarkVisible] = useState(false);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: markVisible
            ? "radial-gradient(ellipse at 50% 45%, #2a0f3a 0%, #100620 55%, #03020a 100%)"
            : "radial-gradient(ellipse at 50% 45%, #14203a 0%, #0a0f1f 60%, #03040c 100%)",
          transition: "background 1.2s ease",
        }}
      />

      {/* Kael silhouette with the black-sun mark */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "40%",
          transform: "translate(-50%,-50%)",
          zIndex: 20,
        }}
        className={markVisible ? "coer-shake" : "coer-breathe"}
      >
        <Sprite kind="kael" size={160} facing="down" />
        {markVisible && (
          <div
            className="coer-shatter-flash"
            style={{
              position: "absolute",
              left: "62%",
              top: "55%",
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(199,91,255,0.9), transparent 65%)",
            }}
          />
        )}
        {markVisible && (
          <div
            className="coer-pulse-glow"
            style={{
              position: "absolute",
              left: "64%",
              top: "58%",
              width: 18,
              height: 18,
              borderRadius: "50%",
              background: "#0a0710",
              border: "2px solid #c75bff",
              boxShadow: "0 0 16px #c75bff",
            }}
          />
        )}
      </div>

      <div className="coer-vignette" style={{ position: "absolute", inset: 0 }} />

      {phase === "dialogue" && (
        <DialogueBox
          sequence={DIALOGUES.ending}
          textSpeed={textSpeed}
          onComplete={() => {
            sfx("quest");
            setPhase("card");
          }}
        />
      )}

      {/* reveal mark partway through (after a beat) */}
      <RevealTrigger onReveal={() => setMarkVisible(true)} />

      {phase === "card" && (
        <div
          style={{ position: "absolute", inset: 0, zIndex: 60, background: "rgba(2,1,6,0.7)" }}
          className="flex flex-col items-center justify-center text-center coer-fade-in px-6"
        >
          <Heading as="h1" className="text-3xl mb-2">
            End of Prototype
          </Heading>
          <p className="text-sm tracking-[0.3em] uppercase text-[#bfb59c] mb-4">
            Chapter 1 Continues Soon
          </p>
          <p className="text-[#cdbf9a] italic max-w-md mb-8">
            One oath has awakened. Seven roads remain — and Kael's true story has only
            just begun.
          </p>
          <GoldButton onClick={() => { sfx("select"); onReturnTitle(); }} active className="px-8">
            Return to Title
          </GoldButton>
        </div>
      )}
    </div>
  );
}

// Tiny helper that flips the mark on after mount delay.
function RevealTrigger({ onReveal }: { onReveal: () => void }) {
  useState(() => {
    if (typeof window !== "undefined") {
      setTimeout(onReveal, 1800);
    }
    return null;
  });
  return null;
}
