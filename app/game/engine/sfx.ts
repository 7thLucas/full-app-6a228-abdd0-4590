// Lightweight WebAudio SFX synth. No external/copyrighted audio — every sound
// is generated procedurally. Volume is read from a module-level setting that the
// Settings UI updates.

export type SfxName =
  | "select"
  | "advance"
  | "hit"
  | "shatter"
  | "item"
  | "quest"
  | "levelup"
  | "victory"
  | "save"
  | "error";

let ctx: AudioContext | null = null;
let masterVol = 0.7;
let sfxVol = 0.8;

export function setAudioLevels(master: number, sfx: number) {
  masterVol = master / 100;
  sfxVol = sfx / 100;
}

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(freq: number, dur: number, type: OscillatorType, vol: number, when = 0) {
  const a = ac();
  if (!a) return;
  const gain = masterVol * sfxVol * vol;
  if (gain <= 0) return;
  const t0 = a.currentTime + when;
  const osc = a.createOscillator();
  const g = a.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(a.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

function noise(dur: number, vol: number, when = 0) {
  const a = ac();
  if (!a) return;
  const gain = masterVol * sfxVol * vol;
  if (gain <= 0) return;
  const t0 = a.currentTime + when;
  const len = Math.floor(a.sampleRate * dur);
  const buf = a.createBuffer(1, len, a.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = a.createBufferSource();
  const g = a.createGain();
  g.gain.setValueAtTime(gain, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.buffer = buf;
  src.connect(g).connect(a.destination);
  src.start(t0);
}

export function sfx(name: SfxName) {
  switch (name) {
    case "select":
      tone(520, 0.08, "triangle", 0.3);
      break;
    case "advance":
      tone(380, 0.05, "square", 0.18);
      break;
    case "hit":
      noise(0.12, 0.25);
      tone(160, 0.1, "sawtooth", 0.2);
      break;
    case "shatter":
      noise(0.3, 0.4);
      tone(90, 0.35, "sawtooth", 0.3);
      tone(700, 0.2, "triangle", 0.2, 0.02);
      break;
    case "item":
      tone(660, 0.08, "sine", 0.3);
      tone(880, 0.1, "sine", 0.25, 0.07);
      break;
    case "quest":
      tone(523, 0.1, "triangle", 0.3);
      tone(659, 0.12, "triangle", 0.3, 0.1);
      break;
    case "levelup":
      tone(523, 0.1, "triangle", 0.3);
      tone(659, 0.1, "triangle", 0.3, 0.1);
      tone(784, 0.18, "triangle", 0.35, 0.2);
      break;
    case "victory":
      tone(523, 0.12, "square", 0.3);
      tone(659, 0.12, "square", 0.3, 0.12);
      tone(784, 0.12, "square", 0.3, 0.24);
      tone(1046, 0.25, "square", 0.32, 0.36);
      break;
    case "save":
      tone(740, 0.12, "sine", 0.3);
      tone(988, 0.18, "sine", 0.25, 0.1);
      break;
    case "error":
      tone(180, 0.15, "sawtooth", 0.25);
      break;
    default:
      break;
  }
}
