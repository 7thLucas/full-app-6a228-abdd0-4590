import { useState } from "react";
import { useGame } from "../engine/store";
import { SHOP_STOCK, getItem } from "../data/items";
import { Heading, GoldButton, Panel } from "../ui/primitives";
import { sfx } from "../engine/sfx";

export function ShopOverlay({ onClose }: { onClose: () => void }) {
  const game = useGame();
  const p = game.state.player;
  const [flash, setFlash] = useState<string | null>(null);

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 80 }} className="flex items-center justify-center coer-fade-in">
      <div style={{ position: "absolute", inset: 0, background: "rgba(2,4,10,0.82)" }} onClick={onClose} />
      <Panel className="relative z-10 w-full max-w-md p-5">
        <div className="flex items-center justify-between mb-1">
          <Heading className="text-xl">Merchant's Wares</Heading>
          <span className="text-sm text-[#e9cf86]">⛃ {p.coins}</span>
        </div>
        <p className="text-[12px] text-[#bfb59c] italic mb-4">
          "Coin and no questions — my favorite kind of traveler."
        </p>

        <div className="space-y-2">
          {SHOP_STOCK.map((id) => {
            const item = getItem(id);
            const afford = p.coins >= item.price;
            return (
              <div
                key={id}
                className="flex items-center justify-between p-2.5 rounded border border-white/5 bg-black/20"
              >
                <div className="min-w-0">
                  <div className="text-sm text-[#ece6d6]">{item.name}</div>
                  <div className="text-[11px] text-[#9a917c] truncate">{item.description}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span className="text-xs text-[#e9cf86] w-12 text-right">{item.price}c</span>
                  <GoldButton
                    disabled={!afford}
                    className="px-3 py-1 text-xs"
                    onClick={() => {
                      if (game.buyItem(id)) {
                        sfx("item");
                        setFlash(`Bought ${item.name}.`);
                      } else {
                        sfx("error");
                        setFlash("Not enough coin.");
                      }
                    }}
                  >
                    Buy
                  </GoldButton>
                </div>
              </div>
            );
          })}
        </div>

        {flash && <p className="text-[12px] text-[#7ee08a] mt-3">{flash}</p>}

        <div className="mt-5 text-center">
          <GoldButton active onClick={() => { sfx("select"); onClose(); }} className="px-6">
            Leave
          </GoldButton>
        </div>
      </Panel>
    </div>
  );
}
