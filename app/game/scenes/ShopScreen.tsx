import { useState } from "react";
import { useGame } from "../engine/store";
import { SHOP_ITEMS } from "../data/gameData";
import { MenuShell } from "./Wordbook";
import { GoldButton } from "../ui/primitives";
import { Sprite } from "../visual/Sprite";
import { sfx } from "../engine/sfx";

// Fantasy village shop — in-game coins only, no real money.
export function ShopScreen({ onClose }: { onClose: () => void }) {
  const game = useGame();
  const { progress } = game;
  const [flash, setFlash] = useState<string | null>(null);

  function buy(id: string, price: number, kind: string) {
    const ok = game.buyShopItem(id, price, kind);
    if (ok) {
      sfx("item");
      setFlash(id);
      window.setTimeout(() => setFlash(null), 900);
    } else {
      sfx("error");
    }
  }

  return (
    <MenuShell title="Village Shop" onClose={onClose}>
      <div className="flex items-center gap-2 mb-4 justify-center">
        <Sprite kind="shopkeeper" size={40} />
        <span className="text-sm text-[#ffd98a]">"Welcome, traveler. Coin only — spend wisely!"</span>
      </div>
      <div className="text-center mb-4 text-[#e9cf86]">◈ {progress.coins} coins</div>

      <div className="grid sm:grid-cols-2 gap-2.5">
        {SHOP_ITEMS.map((it) => {
          const owned = progress.inventory[it.id] ?? 0;
          const afford = progress.coins >= it.price;
          return (
            <div key={it.id} className={`coer-panel p-3 ${flash === it.id ? "ring-1 ring-emerald-400" : ""}`}>
              <div className="flex justify-between items-start mb-1">
                <span className="text-[#e9cf86] text-sm font-semibold">{it.name}</span>
                {owned > 0 && <span className="text-[11px] text-[#bfb59c]">x{owned}</span>}
              </div>
              <p className="text-[12px] text-[#bfb59c] min-h-[32px]">{it.description}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-[#caa24e]">◈ {it.price}</span>
                <GoldButton className="!px-3 !py-1 text-xs" disabled={!afford} onClick={() => buy(it.id, it.price, it.kind)}>
                  {afford ? "Buy" : "Need coins"}
                </GoldButton>
              </div>
            </div>
          );
        })}
      </div>
      <div className="text-center text-[11px] text-[#bfb59c] mt-3">
        Bori affection: {"♥".repeat(Math.min(5, progress.boriAffection)) || "—"}
      </div>
    </MenuShell>
  );
}
