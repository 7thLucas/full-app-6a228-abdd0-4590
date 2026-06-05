import { useEffect, useRef } from "react";

export interface InputState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  dash: boolean;
}

export type ActionKey = "interact" | "menu" | "advance" | "cancel";

interface UseInputOpts {
  onAction?: (action: ActionKey) => void;
  enabled?: boolean;
}

// Keyboard input: held movement keys tracked in a ref (read by the game loop),
// discrete actions dispatched via callback.
export function useInput({ onAction, enabled = true }: UseInputOpts) {
  const state = useRef<InputState>({
    up: false,
    down: false,
    left: false,
    right: false,
    dash: false,
  });
  const actionRef = useRef(onAction);
  actionRef.current = onAction;

  useEffect(() => {
    if (!enabled) {
      state.current = { up: false, down: false, left: false, right: false, dash: false };
      return;
    }

    function down(e: KeyboardEvent) {
      const k = e.key.toLowerCase();
      switch (k) {
        case "w":
        case "arrowup":
          state.current.up = true;
          e.preventDefault();
          break;
        case "s":
        case "arrowdown":
          state.current.down = true;
          e.preventDefault();
          break;
        case "a":
        case "arrowleft":
          state.current.left = true;
          e.preventDefault();
          break;
        case "d":
        case "arrowright":
          state.current.right = true;
          e.preventDefault();
          break;
        case "shift":
          state.current.dash = true;
          break;
        case "e":
        case "enter":
          actionRef.current?.("interact");
          break;
        case " ":
          actionRef.current?.("advance");
          e.preventDefault();
          break;
        case "escape":
          actionRef.current?.("menu");
          break;
        case "backspace":
          actionRef.current?.("cancel");
          e.preventDefault();
          break;
        default:
          break;
      }
    }

    function up(e: KeyboardEvent) {
      const k = e.key.toLowerCase();
      switch (k) {
        case "w":
        case "arrowup":
          state.current.up = false;
          break;
        case "s":
        case "arrowdown":
          state.current.down = false;
          break;
        case "a":
        case "arrowleft":
          state.current.left = false;
          break;
        case "d":
        case "arrowright":
          state.current.right = false;
          break;
        case "shift":
          state.current.dash = false;
          break;
        default:
          break;
      }
    }

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [enabled]);

  return state;
}
