import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronRight,
  ChevronLeft,
  Mic,
  MicOff,
  Sparkles,
  Heart,
  Brain,
  Eye,
  Droplets,
  Zap,
  Salad,
  Sun,
  Activity,
  Cloud,
  Hand,
  Gem,
  RotateCcw,
  Repeat,
  Scissors,
  SkipForward,
  Check,
  X,
  BookOpen,
  Wand2,
  ShieldCheck,
} from "lucide-react";

/* =========================================================================
   CELLULAR HEALING OS — Proxy Cell + Crystal Healing Protocol Trainer
   Inspired by GMCKS / Master Marilag Cellular Healing teachings.
   Private educational guided practice. Not medical advice or treatment.
   ========================================================================= */

type ProtocolId =
  | "full-body"
  | "nervous"
  | "muscular"
  | "heart"
  | "digestive"
  | "kidneys"
  | "brain"
  | "eyes"
  | "pain"
  | "emotional";

type ColorTone =
  | "violet"
  | "gold"
  | "green"
  | "orange"
  | "blue"
  | "greenish-gold"
  | "rose-gold"
  | "green-violet";

type MovementKind =
  | "sweep-down"
  | "circle-cw"
  | "beam-in"
  | "pulse"
  | "alternate"
  | "expand";

type StepKind =
  | "disconnect"
  | "appreciation"
  | "lag"
  | "blue-coat"
  | "cleanse"
  | "energize"
  | "stabilize"
  | "install"
  | "integrate";

type Step = {
  id: string;
  kind: StepKind;
  title: string;
  purpose: string;
  instruction: string;
  voice: string;
  color: ColorTone;
  movement: MovementKind;
  duration: number; // seconds
  body: string; // body region for proxy label
  note?: string;
};

type Protocol = {
  id: ProtocolId;
  name: string;
  oneLine: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  gentle: boolean;
  warning?: string;
  systemPhrase: string; // for proxy statement, e.g. "nervous system"
  buildSteps: () => Step[];
  primaryColors: ColorTone[];
  teaching: string[];
};

const colorMap: Record<ColorTone, { from: string; to: string; label: string; ring: string }> = {
  violet: { from: "#cdb4ff", to: "#7a3cff", label: "Electric Violet", ring: "rgba(160,110,255,0.55)" },
  gold: { from: "#ffe9b0", to: "#d9a648", label: "Gold", ring: "rgba(232,194,106,0.55)" },
  green: { from: "#c8ffd6", to: "#3fbf6e", label: "Green", ring: "rgba(120,220,150,0.55)" },
  orange: { from: "#ffd9a8", to: "#ff8a3c", label: "Orange", ring: "rgba(255,170,90,0.55)" },
  blue: { from: "#bfe2ff", to: "#3c8cff", label: "Light Blue", ring: "rgba(100,170,255,0.55)" },
  "greenish-gold": { from: "#e8f3b0", to: "#c9a64b", label: "Greenish Gold", ring: "rgba(210,190,90,0.55)" },
  "rose-gold": { from: "#ffd0c8", to: "#d9728a", label: "Rose Gold", ring: "rgba(220,140,150,0.55)" },
  "green-violet": { from: "#c8ffd6", to: "#7a3cff", label: "Green + Violet", ring: "rgba(140,160,220,0.55)" },
};

const movementLabel: Record<MovementKind, string> = {
  "sweep-down": "Sweep gently downward through the proxy cell",
  "circle-cw": "Small clockwise circles around the proxy cell",
  "beam-in": "Hold the crystal steady — beam light into the proxy cell",
  pulse: "Tiny soft pulses near the proxy cell",
  alternate: "Alternate two colors — one wave, then the other",
  expand: "Expand light outward from the proxy cell",
};

/* ----------------------------------------------------------------------------
   PROTOCOL MATRIX
   ---------------------------------------------------------------------------- */

const baseDisconnect = (body: string, system: string): Step => ({
  id: "disconnect",
  kind: "disconnect",
  title: "Disconnect",
  purpose: "Release energetic cords, projections, and stress that don't belong.",
  instruction: `Hold the proxy cell. Say firmly: "Disconnect all unwanted and unauthorized connections to the ${system}. Cut now."`,
  voice: `Disconnect all unwanted connections to the ${system}. Cut now.`,
  color: "violet",
  movement: "sweep-down",
  duration: 45,
  body,
});

const baseStabilize = (body: string): Step => ({
  id: "stabilize",
  kind: "stabilize",
  title: "Stabilize with Gold",
  purpose: "Seal and stabilize after cleansing.",
  instruction: "Hold the crystal steady. Visualize gold sunlight infusing the proxy cell.",
  voice: "Stabilize with gold. Allow the system to settle.",
  color: "gold",
  movement: "beam-in",
  duration: 45,
  body,
});

const PROTOCOLS: Protocol[] = [
  {
    id: "full-body",
    name: "Full Body Cellular Healing",
    oneLine: "Complete clear and restore for every cell of the body.",
    icon: Sparkles,
    gentle: false,
    systemPhrase: "every single cell of the body",
    primaryColors: ["green-violet", "gold"],
    teaching: [
      "Disconnect unwanted connections first.",
      "Cleanse with Green + Violet over scalp, skin, bones, muscles, nerves, organs, immune, digestive, hair, nails, gums, teeth.",
      "Exclude the eyes from Green/Violet sweep — eyes need their own protocol.",
      "Energize and stabilize with Gold.",
      "Finish with Golden Sun Integration.",
    ],
    buildSteps: () => [
      baseDisconnect("whole body", "whole body"),
      {
        id: "cleanse",
        kind: "cleanse",
        title: "Cleanse — Green + Violet",
        purpose: "Sweep heaviness from every system of the body.",
        instruction: "Move the crystal in gentle clockwise circles. Imagine Green + Violet light washing through the proxy cell. Exclude the eyes.",
        voice: "Apply Green and Violet to the proxy cell. Exclude the eyes.",
        color: "green-violet",
        movement: "circle-cw",
        duration: 90,
        body: "whole body",
        note: "Excludes the eyes — use the Eyes protocol for those.",
      },
      {
        id: "energize",
        kind: "energize",
        title: "Energize — Gold",
        purpose: "Restore every cell with golden light.",
        instruction: "Hold the crystal steady. Project Gold light into the proxy cell.",
        voice: "Energize with gold. Every cell receives golden restorative energy.",
        color: "gold",
        movement: "beam-in",
        duration: 60,
        body: "whole body",
      },
      {
        id: "integrate",
        kind: "integrate",
        title: "Golden Sun Integration",
        purpose: "Seal and shine like a golden sun.",
        instruction: "Expand the gold light outward from the proxy cell. See yourself shining like the golden sun.",
        voice: "See yourself shining like the golden sun. Allow the body to receive what it needs.",
        color: "gold",
        movement: "expand",
        duration: 60,
        body: "whole body",
      },
    ],
  },
  {
    id: "nervous",
    name: "Nervous System",
    oneLine: "Settle and support nerves with gentle Electric Violet.",
    icon: Zap,
    gentle: true,
    warning: "Gentle Mode by default. Do not force.",
    systemPhrase: "nervous system",
    primaryColors: ["violet", "gold"],
    teaching: [
      "Electric Violet cleanses and energizes the nervous system.",
      "Gold stabilizes at the end.",
      "Keep intensity gentle.",
    ],
    buildSteps: () => [
      baseDisconnect("nervous system", "nervous system"),
      {
        id: "cleanse",
        kind: "cleanse",
        title: "Cleanse — Electric Violet",
        purpose: "Clear heaviness from the nerves.",
        instruction: "Tiny gentle pulses of Electric Violet into the proxy cell.",
        voice: "Apply Electric Violet to the proxy cell. Let the nervous system receive gently.",
        color: "violet",
        movement: "pulse",
        duration: 60,
        body: "nervous system",
      },
      {
        id: "energize",
        kind: "energize",
        title: "Energize — Electric Violet",
        purpose: "Restore nerve flow.",
        instruction: "Hold the crystal steady. Beam Electric Violet softly.",
        voice: "Energize the nervous system with Electric Violet. Do not force.",
        color: "violet",
        movement: "beam-in",
        duration: 60,
        body: "nervous system",
      },
      baseStabilize("nervous system"),
    ],
  },
  {
    id: "muscular",
    name: "Muscular System",
    oneLine: "Release tightness. Soothe pain. Restore strength.",
    icon: Activity,
    gentle: false,
    systemPhrase: "muscle cells affected by pain",
    primaryColors: ["blue", "green", "orange", "gold"],
    teaching: [
      "If pain is present, apply Blue first as a cooling wave.",
      "Cleanse with alternating Green + Orange.",
      "Stabilize with Gold.",
    ],
    buildSteps: () => [
      {
        id: "appreciation",
        kind: "appreciation",
        title: "Appreciation",
        purpose: "Repair relationship with the body.",
        instruction: "Place hands on heart. Thank the muscles for carrying you.",
        voice: "Thank you muscles and legs for carrying the body. I appreciate you.",
        color: "gold",
        movement: "pulse",
        duration: 30,
        body: "muscles",
      },
      {
        id: "blue-coat",
        kind: "blue-coat",
        title: "Soothe Pain — Light Blue",
        purpose: "Cool pain sensation energetically.",
        instruction: "Sweep a soft Light Blue wave through the proxy cell.",
        voice: "Apply Light Blue. Allow the muscles to cool and relax.",
        color: "blue",
        movement: "sweep-down",
        duration: 45,
        body: "muscles",
      },
      {
        id: "cleanse",
        kind: "cleanse",
        title: "Cleanse — Green + Orange",
        purpose: "Clear density from the muscles.",
        instruction: "Alternate Green and Orange waves into the proxy cell.",
        voice: "Apply Green and Orange. Clear the heaviness.",
        color: "orange",
        movement: "alternate",
        duration: 60,
        body: "muscles",
      },
      {
        id: "energize",
        kind: "energize",
        title: "Energize — Green + Orange",
        purpose: "Restore strength and circulation.",
        instruction: "Continue alternating colors, slightly slower now.",
        voice: "Energize the muscles. Allow strength to return.",
        color: "green",
        movement: "alternate",
        duration: 45,
        body: "muscles",
      },
      baseStabilize("muscles"),
    ],
  },
  {
    id: "heart",
    name: "Heart / Cardiovascular",
    oneLine: "Begin with appreciation. Release heaviness. Receive love.",
    icon: Heart,
    gentle: false,
    systemPhrase: "heart and cardiovascular system",
    primaryColors: ["gold", "green-violet"],
    teaching: [
      "L.A.G. = Love, Appreciation, Gratitude — relationship repair with the heart.",
      "Cleanse with Green + Violet.",
      "Energize with Gold + Electric Violet, stabilize with Gold.",
    ],
    buildSteps: () => [
      {
        id: "lag",
        kind: "lag",
        title: "L.A.G. — Love, Appreciation, Gratitude",
        purpose: "Shift from criticism into cooperation with the heart.",
        instruction: "Speak inwardly, line by line. Let the heart receive.",
        voice: "Thank you, heart, for beating since the beginning of life. Thank you for circulating blood and oxygen. I am sorry for ignoring you. I appreciate you. I send love, appreciation, and gratitude to every cell.",
        color: "rose-gold",
        movement: "pulse",
        duration: 90,
        body: "heart",
      },
      {
        id: "cleanse",
        kind: "cleanse",
        title: "Cleanse — Green + Violet",
        purpose: "Release sadness, self-judgment, heaviness.",
        instruction: "Circle Green + Violet gently around the proxy cell of the heart.",
        voice: "Cleanse the heart with Green and Violet. Release sadness and self judgment.",
        color: "green-violet",
        movement: "circle-cw",
        duration: 60,
        body: "heart",
      },
      {
        id: "energize",
        kind: "energize",
        title: "Energize — Gold + Electric Violet",
        purpose: "Fill the heart and cardiovascular field with light.",
        instruction: "Alternate Gold and Electric Violet beams into the proxy cell.",
        voice: "Energize the heart with Gold and Electric Violet.",
        color: "gold",
        movement: "alternate",
        duration: 60,
        body: "heart",
      },
      baseStabilize("heart"),
    ],
  },
  {
    id: "digestive",
    name: "Digestive System",
    oneLine: "Protect first. Then clear upper and lower GI.",
    icon: Salad,
    gentle: false,
    systemPhrase: "digestive system",
    primaryColors: ["blue", "green", "orange", "gold"],
    teaching: [
      "Lower GI: Light Blue protective coating FIRST, then Green + Orange.",
      "Upper GI: Green + Orange directly.",
      "Stabilize with Gold.",
    ],
    buildSteps: () => [
      baseDisconnect("digestive system", "digestive system"),
      {
        id: "blue-coat",
        kind: "blue-coat",
        title: "Light Blue Coating (Lower GI first)",
        purpose: "Protective coating before deeper clearing.",
        instruction: "Sweep Light Blue along the proxy cell, coating it gently.",
        voice: "Apply Light Blue coating first. Protect before clearing.",
        color: "blue",
        movement: "sweep-down",
        duration: 45,
        body: "lower GI",
      },
      {
        id: "cleanse",
        kind: "cleanse",
        title: "Cleanse — Green + Orange",
        purpose: "Clear density from upper and lower GI.",
        instruction: "Alternate Green and Orange into the proxy cell.",
        voice: "Apply Green and Orange. Clear the digestive system.",
        color: "orange",
        movement: "alternate",
        duration: 75,
        body: "digestive system",
      },
      {
        id: "energize",
        kind: "energize",
        title: "Energize — Green + Orange",
        purpose: "Restore digestive vitality.",
        instruction: "Continue softer waves of Green and Orange.",
        voice: "Energize the digestive system. Allow restoration.",
        color: "green",
        movement: "alternate",
        duration: 45,
        body: "digestive system",
      },
      baseStabilize("digestive system"),
    ],
  },
  {
    id: "kidneys",
    name: "Kidneys / Urinary",
    oneLine: "Disconnect first. Then clear and regenerate vitality.",
    icon: Droplets,
    gentle: false,
    systemPhrase: "urinary system and kidneys",
    primaryColors: ["violet", "green", "orange", "gold"],
    teaching: [
      "Always Disconnect first — left kidney, right kidney, bladder, urinary system.",
      "Cleanse with Green + Orange.",
      "Stabilize with Gold for vitality and strength.",
    ],
    buildSteps: () => [
      {
        ...baseDisconnect("kidneys", "kidneys, bladder, and urinary system"),
        duration: 60,
      },
      {
        id: "appreciation",
        kind: "appreciation",
        title: "Appreciation",
        purpose: "Thank the kidneys for supporting vitality.",
        instruction: "Place attention on the kidneys. Speak inwardly.",
        voice: "Thank you kidneys for supporting vitality and strength.",
        color: "gold",
        movement: "pulse",
        duration: 30,
        body: "kidneys",
      },
      {
        id: "cleanse",
        kind: "cleanse",
        title: "Cleanse — Green + Orange",
        purpose: "Clear density from the urinary system.",
        instruction: "Alternate Green and Orange into the proxy cell.",
        voice: "Apply Green and Orange to the kidneys.",
        color: "green",
        movement: "alternate",
        duration: 60,
        body: "kidneys",
      },
      {
        id: "energize",
        kind: "energize",
        title: "Regenerate — Gold",
        purpose: "Restore strength and vitality.",
        instruction: "Beam Gold steadily into the proxy cell.",
        voice: "Regenerate the kidneys with gold.",
        color: "gold",
        movement: "beam-in",
        duration: 60,
        body: "kidneys",
      },
      baseStabilize("kidneys"),
    ],
  },
  {
    id: "brain",
    name: "Brain / Neurological",
    oneLine: "Very gentle support for both hemispheres.",
    icon: Brain,
    gentle: true,
    warning: "Gentle Mode required. Do not overdo.",
    systemPhrase: "brain, both hemispheres",
    primaryColors: ["greenish-gold", "gold"],
    teaching: [
      "Use only Greenish Gold — Gold with a touch of Green.",
      "No harsh clearing. Soft rhythm.",
      "Stabilize with Gold.",
    ],
    buildSteps: () => [
      {
        id: "cleanse",
        kind: "cleanse",
        title: "Gentle Cleanse — Greenish Gold",
        purpose: "Balance both hemispheres softly.",
        instruction: "Tiny soft pulses of Greenish Gold into the proxy cell.",
        voice: "Apply Greenish Gold gently. Balance right and left hemispheres.",
        color: "greenish-gold",
        movement: "pulse",
        duration: 60,
        body: "brain",
      },
      {
        id: "energize",
        kind: "energize",
        title: "Energize — Greenish Gold",
        purpose: "Allow the brain to receive softly.",
        instruction: "Hold the crystal steady. Beam Greenish Gold.",
        voice: "Allow the brain to receive softly.",
        color: "greenish-gold",
        movement: "beam-in",
        duration: 45,
        body: "brain",
      },
      baseStabilize("brain"),
    ],
  },
  {
    id: "eyes",
    name: "Eyes",
    oneLine: "Electric Violet ONLY. Very gentle. Short.",
    icon: Eye,
    gentle: true,
    warning: "Electric Violet only. Do not use Green or Orange. Stop before overdoing.",
    systemPhrase: "both eyes",
    primaryColors: ["violet"],
    teaching: [
      "Electric Violet only.",
      "Disconnect unwanted cords to both eyes first.",
      "Use very gentle, low intensity, short duration.",
    ],
    buildSteps: () => [
      { ...baseDisconnect("eyes", "both eyes"), duration: 30 },
      {
        id: "cleanse",
        kind: "cleanse",
        title: "Gentle Cleanse — Electric Violet",
        purpose: "Soft clearing for the eyes.",
        instruction: "Tiny violet pulses. Both eyes together. Do not strain.",
        voice: "Apply Electric Violet only. Gentle, loving, soft.",
        color: "violet",
        movement: "pulse",
        duration: 30,
        body: "eyes",
      },
      {
        id: "energize",
        kind: "energize",
        title: "Energize — Electric Violet",
        purpose: "Restore softly.",
        instruction: "Continue soft pulses. Short.",
        voice: "Energize the eyes. Stop before overdoing.",
        color: "violet",
        movement: "pulse",
        duration: 30,
        body: "eyes",
      },
    ],
  },
  {
    id: "pain",
    name: "Pain Relief",
    oneLine: "Soothe with Light Blue cooling wave.",
    icon: Cloud,
    gentle: false,
    systemPhrase: "all cells affected by pain",
    primaryColors: ["blue", "gold"],
    teaching: [
      "Blue is cooling and soothing.",
      "Continue with the relevant system protocol if needed.",
    ],
    buildSteps: () => [
      {
        id: "blue-coat",
        kind: "blue-coat",
        title: "Soothe — Light Blue",
        purpose: "Cool the affected cells.",
        instruction: "Sweep Light Blue through the proxy cell.",
        voice: "Apply Light Blue. Soothe and cool the pain.",
        color: "blue",
        movement: "sweep-down",
        duration: 90,
        body: "affected area",
      },
      baseStabilize("affected area"),
    ],
  },
  {
    id: "emotional",
    name: "Emotional Heaviness",
    oneLine: "Release patterns. Install positive qualities.",
    icon: Wand2,
    gentle: false,
    systemPhrase: "every cell of the body",
    primaryColors: ["violet", "gold"],
    teaching: [
      "Disconnect first.",
      "Cleanse with Electric Violet.",
      "Install positive qualities like Peace, Love, Joy, Courage.",
      "Stabilize with Gold.",
    ],
    buildSteps: () => [
      baseDisconnect("emotional body", "emotional body"),
      {
        id: "cleanse",
        kind: "cleanse",
        title: "Cleanse — Electric Violet",
        purpose: "Remove sadness, fear, anger, inertia, stress.",
        instruction: "Sweep Electric Violet through the proxy cell.",
        voice: "Remove what no longer serves. Apply Electric Violet.",
        color: "violet",
        movement: "sweep-down",
        duration: 75,
        body: "emotional body",
      },
      {
        id: "install",
        kind: "install",
        title: "Install Qualities — Gold",
        purpose: "Fill the system with positive qualities.",
        instruction: "Choose qualities, then beam Gold into the proxy cell carrying those qualities.",
        voice: "Install what supports the soul and body. Fill the system with positive qualities.",
        color: "gold",
        movement: "beam-in",
        duration: 60,
        body: "emotional body",
      },
      baseStabilize("emotional body"),
    ],
  },
];

const QUALITIES = [
  "Peace",
  "Love",
  "Joy",
  "Courage",
  "Prosperity",
  "Faith",
  "Trust",
  "Motivation",
  "Confidence",
  "Creativity",
  "Gratitude",
  "Harmony",
  "Abundance",
  "Good Health",
  "Long Life",
  "Success",
];

/* ----------------------------------------------------------------------------
   AUDIO SYSTEM — ambient ocean (procedural) + voice (SpeechSynthesis)
   ---------------------------------------------------------------------------- */

function useOceanAmbience(enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{ gain: GainNode; lfo?: OscillatorNode; lfoGain?: GainNode; src?: AudioBufferSourceNode } | null>(null);

  useEffect(() => {
    if (!enabled) {
      if (nodesRef.current && ctxRef.current) {
        try {
          nodesRef.current.src?.stop();
          nodesRef.current.lfo?.stop();
        } catch {}
        nodesRef.current = null;
        ctxRef.current.close().catch(() => {});
        ctxRef.current = null;
      }
      return;
    }
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AC();
      ctxRef.current = ctx;
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuf = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = noiseBuf.getChannelData(0);
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        lastOut = (lastOut + 0.02 * white) / 1.02;
        data[i] = lastOut * 3.5;
      }
      const src = ctx.createBufferSource();
      src.buffer = noiseBuf;
      src.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 600;
      const gain = ctx.createGain();
      gain.gain.value = 0.0;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.12;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.06;
      lfo.connect(lfoGain).connect(gain.gain);
      gain.gain.setValueAtTime(0.0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 1.5);
      src.connect(filter).connect(gain).connect(ctx.destination);
      src.start();
      lfo.start();
      nodesRef.current = { gain, lfo, lfoGain, src };
    } catch {
      // ignore audio errors
    }
    return () => {
      try {
        nodesRef.current?.src?.stop();
        nodesRef.current?.lfo?.stop();
      } catch {}
      ctxRef.current?.close().catch(() => {});
      ctxRef.current = null;
      nodesRef.current = null;
    };
  }, [enabled]);
}

function speak(text: string, enabled: boolean) {
  if (!enabled) return;
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.92;
    u.pitch = 1.0;
    u.volume = 0.9;
    const voices = window.speechSynthesis.getVoices();
    const pref = voices.find((v) => /en-?US/i.test(v.lang) && /female|samantha|victoria|google us english/i.test(v.name)) ||
      voices.find((v) => /en/i.test(v.lang));
    if (pref) u.voice = pref;
    window.speechSynthesis.speak(u);
  } catch {}
}

function chime() {
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AC();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = 880;
    g.gain.setValueAtTime(0, ctx.currentTime);
    g.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 1.2);
    setTimeout(() => ctx.close().catch(() => {}), 1500);
  } catch {}
}

/* ----------------------------------------------------------------------------
   ROOT
   ---------------------------------------------------------------------------- */

type Screen =
  | "welcome"
  | "recipient"
  | "protocol"
  | "tutorial"
  | "session"
  | "complete";

type AppMode = "guided" | "practitioner" | "teacher";

export default function Index() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [mode, setMode] = useState<AppMode>("guided");
  const [recipientName, setRecipientName] = useState<string>("");
  const [forSelf, setForSelf] = useState<boolean>(true);
  const [intention, setIntention] = useState<string>("");
  const [protocolId, setProtocolId] = useState<ProtocolId | null>(null);
  const [installedQualities, setInstalledQualities] = useState<string[]>([]);
  const [reflection, setReflection] = useState<string[]>([]);

  const [ambient, setAmbient] = useState<boolean>(true);
  const [voice, setVoice] = useState<boolean>(true);

  useOceanAmbience(ambient && screen !== "welcome" && screen !== "complete");

  const protocol = useMemo(
    () => PROTOCOLS.find((p) => p.id === protocolId) ?? null,
    [protocolId]
  );

  // Preload voices
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }
    return () => window.speechSynthesis?.cancel();
  }, []);

  return (
    <div className="min-h-screen cho-bg relative overflow-hidden text-foreground">
      <div className="cho-stars absolute inset-0 pointer-events-none" />
      <TopBar
        screen={screen}
        ambient={ambient}
        voice={voice}
        toggleAmbient={() => setAmbient((v) => !v)}
        toggleVoice={() => setVoice((v) => !v)}
        onBack={() => {
          if (screen === "recipient") setScreen("welcome");
          else if (screen === "protocol") setScreen("recipient");
          else if (screen === "tutorial") setScreen("protocol");
          else if (screen === "session") setScreen("tutorial");
          else if (screen === "complete") setScreen("welcome");
        }}
      />

      <main className="relative max-w-md mx-auto px-5 pb-24 pt-2">
        {screen === "welcome" && (
          <Welcome
            mode={mode}
            setMode={setMode}
            onStart={() => setScreen("recipient")}
          />
        )}
        {screen === "recipient" && (
          <RecipientSetup
            name={recipientName}
            setName={setRecipientName}
            forSelf={forSelf}
            setForSelf={setForSelf}
            intention={intention}
            setIntention={setIntention}
            onContinue={() => setScreen("protocol")}
          />
        )}
        {screen === "protocol" && (
          <ProtocolSelect
            onSelect={(id) => {
              setProtocolId(id);
              setScreen("tutorial");
            }}
            mode={mode}
          />
        )}
        {screen === "tutorial" && protocol && (
          <HandCrystalTutorial
            protocol={protocol}
            recipientName={recipientName || "you"}
            onStart={() => setScreen("session")}
          />
        )}
        {screen === "session" && protocol && (
          <SessionTrainer
            protocol={protocol}
            recipientName={recipientName || "you"}
            mode={mode}
            voice={voice}
            installedQualities={installedQualities}
            setInstalledQualities={setInstalledQualities}
            onComplete={() => setScreen("complete")}
          />
        )}
        {screen === "complete" && protocol && (
          <CompletionReflection
            protocol={protocol}
            recipientName={recipientName || "you"}
            reflection={reflection}
            setReflection={setReflection}
            onDone={() => {
              setScreen("welcome");
              setReflection([]);
              setInstalledQualities([]);
            }}
          />
        )}
      </main>
    </div>
  );
}

/* ----------------------------------------------------------------------------
   TOP BAR
   ---------------------------------------------------------------------------- */

function TopBar({
  screen,
  ambient,
  voice,
  toggleAmbient,
  toggleVoice,
  onBack,
}: {
  screen: Screen;
  ambient: boolean;
  voice: boolean;
  toggleAmbient: () => void;
  toggleVoice: () => void;
  onBack: () => void;
}) {
  const showBack = screen !== "welcome";
  return (
    <div className="relative max-w-md mx-auto px-5 pt-6 pb-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {showBack ? (
          <button
            onClick={onBack}
            className="btn-ghost rounded-full p-2"
            aria-label="Back"
          >
            <ChevronLeft size={18} />
          </button>
        ) : (
          <div className="w-9" />
        )}
        <div className="text-[11px] uppercase tracking-[0.22em] text-white/55">
          Cellular Healing OS
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={toggleAmbient}
          className="btn-ghost rounded-full p-2"
          aria-label="Toggle ambient"
        >
          {ambient ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
        <button
          onClick={toggleVoice}
          className="btn-ghost rounded-full p-2"
          aria-label="Toggle voice"
        >
          {voice ? <Mic size={16} /> : <MicOff size={16} />}
        </button>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------------
   WELCOME
   ---------------------------------------------------------------------------- */

function Welcome({
  mode,
  setMode,
  onStart,
}: {
  mode: AppMode;
  setMode: (m: AppMode) => void;
  onStart: () => void;
}) {
  return (
    <section className="anim-fade-up pt-6">
      <div className="flex flex-col items-center text-center">
        <div className="relative w-44 h-44 mb-6">
          <div className="absolute inset-0 rounded-full orb-core" />
          <div className="absolute -inset-3 rounded-full border border-white/10 ring-pulse" />
        </div>
        <h1 className="text-3xl font-semibold gold-text tracking-tight">
          Cellular Healing OS
        </h1>
        <div className="mt-2 text-white/65 text-sm">
          Proxy Cell + Crystal Healing Trainer
        </div>
        <div className="mt-1 text-[11px] text-white/40 uppercase tracking-[0.22em]">
          Private educational guided practice
        </div>

        <div className="glass rounded-3xl mt-8 p-5 w-full text-left">
          <div className="text-xs uppercase tracking-[0.18em] text-white/55 mb-3">
            How this practice works
          </div>
          <ul className="space-y-3 text-sm text-white/85">
            <li className="flex gap-3">
              <div className="mt-0.5 w-6 h-6 rounded-full bg-white/8 flex items-center justify-center text-[11px] text-white/70">1</div>
              <div>
                <div className="font-medium">Form a proxy cell</div>
                <div className="text-white/55 text-[12px]">Touch thumb to index finger — a tiny circle. This is one cell.</div>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="mt-0.5 w-6 h-6 rounded-full bg-white/8 flex items-center justify-center text-[11px] text-white/70">2</div>
              <div>
                <div className="font-medium">Name the cell</div>
                <div className="text-white/55 text-[12px]">"This cell represents all cells of [system] of [name], wherever affected."</div>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="mt-0.5 w-6 h-6 rounded-full bg-white/8 flex items-center justify-center text-[11px] text-white/70">3</div>
              <div>
                <div className="font-medium">Apply color with the crystal</div>
                <div className="text-white/55 text-[12px]">Follow the on-screen color, movement, and timing.</div>
              </div>
            </li>
          </ul>
        </div>

        <div className="glass rounded-3xl mt-4 p-3 w-full">
          <div className="text-[11px] uppercase tracking-[0.18em] text-white/55 px-1 mb-2">Mode</div>
          <div className="grid grid-cols-3 gap-2">
            {(["guided", "practitioner", "teacher"] as AppMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`rounded-2xl py-2.5 text-[12px] capitalize transition ${
                  mode === m
                    ? "bg-white/14 border border-white/15 text-white"
                    : "bg-white/4 border border-white/8 text-white/65"
                }`}
              >
                {m === "guided" ? "Guided" : m === "practitioner" ? "Practitioner" : "Teacher"}
              </button>
            ))}
          </div>
          <div className="text-[11px] text-white/45 mt-2 px-1">
            {mode === "guided" && "Beginner. Full voice + auto timer."}
            {mode === "practitioner" && "Manual control. Choose timing yourself."}
            {mode === "teacher" && "Reference mode. Read the protocol matrix."}
          </div>
        </div>

        <button
          onClick={onStart}
          className="btn-gold w-full rounded-2xl py-3.5 mt-6 font-medium tracking-wide flex items-center justify-center gap-2"
        >
          Start Practice <ChevronRight size={16} />
        </button>
        <div className="text-[10px] text-white/40 mt-4 leading-relaxed px-2">
          Not medical advice, diagnosis, or treatment.
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
   RECIPIENT SETUP
   ---------------------------------------------------------------------------- */

function RecipientSetup({
  name,
  setName,
  forSelf,
  setForSelf,
  intention,
  setIntention,
  onContinue,
}: {
  name: string;
  setName: (s: string) => void;
  forSelf: boolean;
  setForSelf: (b: boolean) => void;
  intention: string;
  setIntention: (s: string) => void;
  onContinue: () => void;
}) {
  const valid = name.trim().length >= 2;
  return (
    <section className="anim-fade-up pt-2">
      <div className="text-[11px] uppercase tracking-[0.22em] text-white/55 mb-1">Step 1 of 4</div>
      <h2 className="text-2xl font-semibold gold-text">Who is this for?</h2>
      <p className="text-white/55 text-sm mt-1">
        The full name is used in every proxy statement.
      </p>

      <div className="glass rounded-3xl mt-6 p-5 space-y-5">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-white/55 mb-2">Recipient</div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setForSelf(true)}
              className={`rounded-2xl py-2.5 text-sm transition ${
                forSelf ? "bg-white/14 border border-white/15" : "bg-white/4 border border-white/8 text-white/65"
              }`}
            >
              Myself
            </button>
            <button
              onClick={() => setForSelf(false)}
              className={`rounded-2xl py-2.5 text-sm transition ${
                !forSelf ? "bg-white/14 border border-white/15" : "bg-white/4 border border-white/8 text-white/65"
              }`}
            >
              Someone else
            </button>
          </div>
        </div>

        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-white/55 mb-2">Full name</div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Guadalupe Garza"
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm outline-none focus:border-white/25"
          />
        </div>

        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-white/55 mb-2">Intention (optional)</div>
          <textarea
            value={intention}
            onChange={(e) => setIntention(e.target.value)}
            rows={3}
            placeholder="A short, kind intention for this session…"
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm outline-none focus:border-white/25 resize-none"
          />
        </div>
      </div>

      <button
        onClick={onContinue}
        disabled={!valid}
        className={`w-full rounded-2xl py-3.5 mt-6 font-medium tracking-wide flex items-center justify-center gap-2 ${
          valid ? "btn-gold" : "btn-ghost opacity-60"
        }`}
      >
        Continue <ChevronRight size={16} />
      </button>
    </section>
  );
}

/* ----------------------------------------------------------------------------
   PROTOCOL SELECT
   ---------------------------------------------------------------------------- */

function ProtocolSelect({
  onSelect,
  mode,
}: {
  onSelect: (id: ProtocolId) => void;
  mode: AppMode;
}) {
  const totalTime = (p: Protocol) =>
    Math.round(p.buildSteps().reduce((acc, s) => acc + s.duration, 0) / 60);
  return (
    <section className="anim-fade-up pt-2">
      <div className="text-[11px] uppercase tracking-[0.22em] text-white/55 mb-1">Step 2 of 4</div>
      <h2 className="text-2xl font-semibold gold-text">Choose a protocol</h2>
      <p className="text-white/55 text-sm mt-1">
        Each protocol guides the proxy cell through colors and movement.
      </p>

      <div className="grid grid-cols-1 gap-3 mt-5">
        {PROTOCOLS.map((p) => {
          const Icon = p.icon;
          return (
            <button
              key={p.id}
              onClick={() => onSelect(p.id)}
              className="glass rounded-3xl p-4 text-left hover:bg-white/8 transition active:scale-[0.99]"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(232,194,106,0.18), rgba(122,60,255,0.18))",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <Icon className="text-white/90" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="font-medium text-[15px]">{p.name}</div>
                    {p.gentle && (
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/8 border border-white/10 text-white/70">
                        Gentle
                      </span>
                    )}
                  </div>
                  <div className="text-white/55 text-[12px] mt-0.5">{p.oneLine}</div>
                  <div className="flex items-center gap-2 mt-2">
                    {p.primaryColors.map((c) => (
                      <div
                        key={c}
                        className="h-2.5 w-6 rounded-full"
                        style={{
                          background: `linear-gradient(90deg, ${colorMap[c].from}, ${colorMap[c].to})`,
                        }}
                        title={colorMap[c].label}
                      />
                    ))}
                    <div className="text-[10px] text-white/45 ml-auto">≈ {totalTime(p)} min</div>
                  </div>
                  {p.warning && (
                    <div className="text-[11px] text-amber-200/80 mt-2 flex items-start gap-1">
                      <ShieldCheck size={12} className="mt-0.5" />
                      {p.warning}
                    </div>
                  )}
                </div>
                <ChevronRight className="text-white/35 mt-3" size={16} />
              </div>
              {mode === "teacher" && (
                <div className="mt-3 pt-3 border-t border-white/8 space-y-1">
                  {p.teaching.map((t, i) => (
                    <div key={i} className="text-[11px] text-white/55 flex gap-2">
                      <BookOpen size={11} className="mt-0.5 flex-shrink-0" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
   HAND + CRYSTAL TUTORIAL
   ---------------------------------------------------------------------------- */

function HandCrystalTutorial({
  protocol,
  recipientName,
  onStart,
}: {
  protocol: Protocol;
  recipientName: string;
  onStart: () => void;
}) {
  const [step, setStep] = useState(0);
  const steps = [
    {
      title: "Form the proxy cell",
      sub: "Touch thumb to index finger — a small circle.",
      detail: "This little circle represents one cell. Hold it gently in front of you.",
      visual: <ProxyCellVisual color="gold" movement="pulse" showCrystal={false} />,
    },
    {
      title: "Name the cell",
      sub: `Speak aloud or inwardly.`,
      detail: `"This cell represents all the cells of the ${protocol.systemPhrase} of ${recipientName}, wherever affected."`,
      visual: <ProxyCellVisual color="gold" movement="pulse" showCrystal={false} label="proxy cell" />,
    },
    {
      title: "Bring the crystal close",
      sub: "Crystal tip near the finger circle.",
      detail: "Keep the crystal close, steady, and gentle. If you don't have a crystal, use your fingertip with the same intention.",
      visual: <ProxyCellVisual color={protocol.primaryColors[0]} movement="beam-in" showCrystal={true} />,
    },
    {
      title: "Apply color & follow movement",
      sub: "The screen will guide each step.",
      detail: "Every 30 seconds you'll be reminded to repeat the proxy statement.",
      visual: <ProxyCellVisual color={protocol.primaryColors[0]} movement="circle-cw" showCrystal={true} />,
    },
  ];
  const current = steps[step];

  return (
    <section className="anim-fade-up pt-2">
      <div className="text-[11px] uppercase tracking-[0.22em] text-white/55 mb-1">Step 3 of 4</div>
      <h2 className="text-2xl font-semibold gold-text">Hand &amp; crystal setup</h2>
      <p className="text-white/55 text-sm mt-1">{protocol.name}</p>

      <div className="glass rounded-3xl mt-5 p-5">
        <div className="flex items-center justify-center mb-3">
          <div className="flex items-center gap-1">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === step ? "w-6 bg-white/80" : i < step ? "w-3 bg-white/40" : "w-3 bg-white/15"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="h-56 flex items-center justify-center">
          {current.visual}
        </div>

        <div className="mt-4 text-center">
          <div className="text-[11px] uppercase tracking-[0.18em] text-white/55">
            Step {step + 1} · {current.title}
          </div>
          <div className="text-white/85 text-sm mt-1.5">{current.sub}</div>
          <div className="text-white/55 text-[12px] mt-2 leading-relaxed">{current.detail}</div>
        </div>
      </div>

      <div className="flex gap-2 mt-5">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="btn-ghost rounded-2xl px-4 py-3 text-sm disabled:opacity-40"
        >
          <ChevronLeft size={16} />
        </button>
        {step < steps.length - 1 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            className="btn-gold flex-1 rounded-2xl py-3 text-sm font-medium flex items-center justify-center gap-2"
          >
            Next <ChevronRight size={16} />
          </button>
        ) : (
          <button
            onClick={onStart}
            className="btn-gold flex-1 rounded-2xl py-3 text-sm font-medium flex items-center justify-center gap-2"
          >
            Start guided session <ChevronRight size={16} />
          </button>
        )}
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
   PROXY CELL + CRYSTAL VISUAL
   ---------------------------------------------------------------------------- */

function ProxyCellVisual({
  color,
  movement,
  showCrystal,
  label,
  intensity = 1,
}: {
  color: ColorTone;
  movement: MovementKind;
  showCrystal: boolean;
  label?: string;
  intensity?: number;
}) {
  const c = colorMap[color];
  const crystalAnimClass =
    movement === "circle-cw"
      ? "crystal-circle"
      : movement === "sweep-down"
      ? "crystal-sweep"
      : movement === "pulse"
      ? "crystal-pulse"
      : movement === "alternate"
      ? "crystal-alternate"
      : movement === "expand"
      ? "crystal-expand"
      : "crystal-beam";

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* outer aura */}
      <div
        className={`absolute rounded-full ${movement === "expand" ? "expand-aura" : ""}`}
        style={{
          width: 220,
          height: 220,
          background: `radial-gradient(circle, ${c.ring} 0%, transparent 70%)`,
          opacity: 0.6 * intensity,
          filter: "blur(8px)",
        }}
      />

      {/* hand silhouette — thumb + index forming the proxy cell circle */}
      <svg viewBox="0 0 240 240" className="absolute inset-0 m-auto w-56 h-56" aria-hidden>
        <defs>
          <linearGradient id="skin" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f3d4b4" />
            <stop offset="100%" stopColor="#b88a64" />
          </linearGradient>
          <radialGradient id={`cellGrad-${color}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={c.from} stopOpacity="1" />
            <stop offset="60%" stopColor={c.to} stopOpacity="0.9" />
            <stop offset="100%" stopColor={c.to} stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* thumb */}
        <path
          d="M70 175 Q60 140 78 118 Q92 100 110 108 Q124 116 118 132 Q112 144 102 148"
          fill="url(#skin)"
          opacity="0.85"
          stroke="rgba(0,0,0,0.2)"
          strokeWidth="1"
        />
        {/* index finger */}
        <path
          d="M150 175 Q160 140 142 118 Q128 100 110 108 Q96 116 102 132 Q108 144 118 148"
          fill="url(#skin)"
          opacity="0.85"
          stroke="rgba(0,0,0,0.2)"
          strokeWidth="1"
        />
        {/* lower hand body */}
        <path
          d="M60 195 Q60 175 75 170 L145 170 Q160 175 160 195 L160 230 L60 230 Z"
          fill="url(#skin)"
          opacity="0.7"
        />
        {/* proxy cell circle (between thumb and index) */}
        <circle
          cx="110"
          cy="128"
          r="22"
          fill={`url(#cellGrad-${color})`}
          className="proxy-cell-pulse"
        />
        <circle
          cx="110"
          cy="128"
          r="22"
          fill="none"
          stroke={c.from}
          strokeWidth="1"
          opacity="0.6"
        />
      </svg>

      {/* crystal */}
      {showCrystal && (
        <div className={`absolute ${crystalAnimClass}`} style={{ width: 60, height: 60, top: "30%", left: "62%" }}>
          <svg viewBox="0 0 60 60" className="w-full h-full">
            <defs>
              <linearGradient id={`crystalGrad-${color}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={c.from} />
                <stop offset="100%" stopColor={c.to} />
              </linearGradient>
            </defs>
            <polygon
              points="30,4 50,22 42,52 18,52 10,22"
              fill={`url(#crystalGrad-${color})`}
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="0.8"
              filter={`drop-shadow(0 0 8px ${c.from})`}
            />
            <polygon
              points="30,4 50,22 30,30 10,22"
              fill="rgba(255,255,255,0.25)"
            />
          </svg>
        </div>
      )}

      {label && (
        <div className="absolute bottom-2 text-[10px] uppercase tracking-[0.2em] text-white/55">
          {label}
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------------------
   SESSION TRAINER
   ---------------------------------------------------------------------------- */

function SessionTrainer({
  protocol,
  recipientName,
  mode,
  voice,
  installedQualities,
  setInstalledQualities,
  onComplete,
}: {
  protocol: Protocol;
  recipientName: string;
  mode: AppMode;
  voice: boolean;
  installedQualities: string[];
  setInstalledQualities: (q: string[]) => void;
  onComplete: () => void;
}) {
  const steps = useMemo(() => protocol.buildSteps(), [protocol]);
  const [stepIdx, setStepIdx] = useState(0);
  const [running, setRunning] = useState(mode === "guided");
  const [elapsed, setElapsed] = useState(0);
  const [showWhy, setShowWhy] = useState(false);
  const [reminderPulse, setReminderPulse] = useState(false);
  const step = steps[stepIdx];

  const proxyStatement = `This cell represents all the cells of the ${protocol.systemPhrase} of ${recipientName}, wherever affected.`;

  // speak step
  useEffect(() => {
    setElapsed(0);
    setShowWhy(false);
    speak(step.voice, voice);
  }, [stepIdx, step.voice, voice]);

  // timer
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setElapsed((e) => e + 1);
    }, 1000);
    return () => clearInterval(t);
  }, [running]);

  // step auto-advance
  useEffect(() => {
    if (mode === "practitioner") return;
    if (elapsed >= step.duration) {
      if (stepIdx < steps.length - 1) {
        setStepIdx((i) => i + 1);
      } else {
        onComplete();
      }
    }
  }, [elapsed, step.duration, stepIdx, steps.length, onComplete, mode]);

  // 30-second proxy reminder
  useEffect(() => {
    if (elapsed > 0 && elapsed % 30 === 0 && running) {
      setReminderPulse(true);
      chime();
      speak("Repeat now. " + proxyStatement, voice);
      const t = setTimeout(() => setReminderPulse(false), 3500);
      return () => clearTimeout(t);
    }
  }, [elapsed, running, proxyStatement, voice]);

  const pct = Math.min(100, (elapsed / step.duration) * 100);
  const remaining = Math.max(0, step.duration - elapsed);

  const ColorPill = ({ tone }: { tone: ColorTone }) => {
    const cc = colorMap[tone];
    return (
      <div
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] border border-white/10"
        style={{
          background: `linear-gradient(90deg, ${cc.from}22, ${cc.to}22)`,
        }}
      >
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ background: `linear-gradient(135deg, ${cc.from}, ${cc.to})` }}
        />
        {cc.label}
      </div>
    );
  };

  return (
    <section className="anim-fade-up pt-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-[11px] uppercase tracking-[0.22em] text-white/55">
            {protocol.name} · for {recipientName}
          </div>
          <div className="text-white text-sm mt-1">{step.title}</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-wider text-white/45">step</div>
          <div className="text-sm text-white/85">{stepIdx + 1}/{steps.length}</div>
        </div>
      </div>

      {/* Step progress dots */}
      <div className="flex gap-1 mb-4">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all ${
              i < stepIdx ? "bg-white/55" : i === stepIdx ? "bg-amber-300/90" : "bg-white/12"
            }`}
          />
        ))}
      </div>

      {/* Main visual */}
      <div className="glass rounded-3xl p-5 relative overflow-hidden">
        <div className="h-72 relative">
          <ProxyCellVisual
            color={step.color}
            movement={step.movement}
            showCrystal={true}
            label={`proxy · ${step.body}`}
            intensity={reminderPulse ? 1.5 : 1}
          />
          {reminderPulse && (
            <div className="absolute inset-0 flex items-end justify-center pb-2 pointer-events-none">
              <div className="text-[11px] uppercase tracking-[0.2em] text-amber-200/90 px-3 py-1 rounded-full bg-amber-300/10 border border-amber-300/20 flex items-center gap-1.5">
                <Repeat size={11} /> Repeat proxy statement
              </div>
            </div>
          )}
        </div>

        {/* timer ring & color */}
        <div className="mt-3 flex items-center gap-3">
          <ColorPill tone={step.color} />
          <div className="ml-auto text-right">
            <div className="text-2xl tabular-nums gold-text font-semibold leading-none">
              {String(Math.floor(remaining / 60)).padStart(1, "0")}:{String(remaining % 60).padStart(2, "0")}
            </div>
            <div className="text-[10px] text-white/45 mt-0.5">remaining</div>
          </div>
        </div>

        <div className="progress-track h-1.5 rounded-full mt-3 overflow-hidden">
          <div className="progress-fill h-full" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Instruction card */}
      <div className="glass rounded-3xl mt-4 p-4">
        <div className="text-[10px] uppercase tracking-[0.2em] text-white/55">What to do now</div>
        <div className="text-white/90 text-[14px] mt-2 leading-relaxed">{step.instruction}</div>
        <div className="text-white/55 text-[12px] mt-2 italic">
          Movement: {movementLabel[step.movement]}.
        </div>
        {step.note && (
          <div className="text-amber-200/80 text-[11px] mt-2 flex items-start gap-1">
            <ShieldCheck size={12} className="mt-0.5" />
            {step.note}
          </div>
        )}
      </div>

      {/* Proxy statement card */}
      <div className="glass rounded-3xl mt-3 p-4">
        <div className="flex items-center justify-between">
          <div className="text-[10px] uppercase tracking-[0.2em] text-white/55">Say now</div>
          <button
            onClick={() => {
              chime();
              speak(proxyStatement, voice);
            }}
            className="btn-ghost rounded-full px-3 py-1 text-[11px] flex items-center gap-1"
          >
            <Repeat size={11} /> Replay
          </button>
        </div>
        <div className="text-white/90 text-[13px] mt-2 leading-relaxed">
          "{proxyStatement}"
        </div>
        <div className="text-white/45 text-[11px] mt-2">
          Repeat every 30 seconds (you will be reminded).
        </div>
      </div>

      {/* Install qualities */}
      {step.kind === "install" && (
        <div className="glass rounded-3xl mt-3 p-4">
          <div className="text-[10px] uppercase tracking-[0.2em] text-white/55 mb-2">
            Choose 1–3 qualities to install
          </div>
          <div className="flex flex-wrap gap-2">
            {QUALITIES.map((q) => {
              const active = installedQualities.includes(q);
              return (
                <button
                  key={q}
                  onClick={() => {
                    if (active) setInstalledQualities(installedQualities.filter((x) => x !== q));
                    else if (installedQualities.length < 3)
                      setInstalledQualities([...installedQualities, q]);
                  }}
                  className={`px-3 py-1.5 rounded-full text-[12px] border transition ${
                    active
                      ? "bg-amber-300/15 border-amber-300/35 text-amber-100"
                      : "bg-white/4 border-white/10 text-white/70"
                  }`}
                >
                  {q}
                </button>
              );
            })}
          </div>
          {installedQualities.length > 0 && (
            <div className="text-amber-100/80 text-[12px] mt-3">
              May the body be filled with {installedQualities.join(", ")}.
            </div>
          )}
        </div>
      )}

      {/* Why this matters */}
      <button
        onClick={() => setShowWhy((s) => !s)}
        className="w-full glass rounded-2xl mt-3 p-3 text-left flex items-start gap-2"
      >
        <BookOpen size={14} className="mt-0.5 text-white/55" />
        <div className="flex-1">
          <div className="text-[11px] uppercase tracking-[0.18em] text-white/55">Why this matters</div>
          {showWhy && (
            <div className="text-white/75 text-[12px] mt-1.5 leading-relaxed">{step.purpose}</div>
          )}
        </div>
      </button>

      {/* Sensations hint */}
      <div className="glass rounded-2xl mt-3 p-3">
        <div className="text-[11px] uppercase tracking-[0.18em] text-white/55 mb-1">How do I know it's working?</div>
        <div className="text-white/65 text-[12px] leading-relaxed">
          Possible: warmth, tingling, lightness, yawning, emotional release, subtle calm. If you feel nothing, continue calmly — not everyone feels immediately.
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-3 gap-2 mt-5">
        <button
          onClick={() => setRunning((r) => !r)}
          className="btn-ghost rounded-2xl py-3 text-sm flex items-center justify-center gap-1.5"
        >
          {running ? <><Pause size={14} /> Pause</> : <><Play size={14} /> Resume</>}
        </button>
        <button
          onClick={() => {
            setElapsed(0);
            speak(step.voice, voice);
          }}
          className="btn-ghost rounded-2xl py-3 text-sm flex items-center justify-center gap-1.5"
        >
          <RotateCcw size={14} /> Restart
        </button>
        <button
          onClick={() => {
            if (stepIdx < steps.length - 1) setStepIdx((i) => i + 1);
            else onComplete();
          }}
          className="btn-ghost rounded-2xl py-3 text-sm flex items-center justify-center gap-1.5"
        >
          <SkipForward size={14} /> Skip
        </button>
      </div>

      {mode === "practitioner" && (
        <button
          onClick={() => {
            if (stepIdx < steps.length - 1) setStepIdx((i) => i + 1);
            else onComplete();
          }}
          className="btn-gold w-full rounded-2xl py-3 mt-3 text-sm font-medium flex items-center justify-center gap-2"
        >
          <Check size={14} /> Mark complete · next step
        </button>
      )}
    </section>
  );
}

/* ----------------------------------------------------------------------------
   COMPLETION + REFLECTION
   ---------------------------------------------------------------------------- */

const SENSATIONS = [
  "lighter",
  "warmer",
  "calmer",
  "softer",
  "tingling",
  "emotional release",
  "sleepy",
  "no sensation yet",
];

function CompletionReflection({
  protocol,
  recipientName,
  reflection,
  setReflection,
  onDone,
}: {
  protocol: Protocol;
  recipientName: string;
  reflection: string[];
  setReflection: (s: string[]) => void;
  onDone: () => void;
}) {
  return (
    <section className="anim-fade-up pt-2 text-center">
      <div className="relative w-32 h-32 mx-auto mt-6 mb-5">
        <div className="absolute inset-0 rounded-full orb-core" />
        <div className="absolute -inset-3 rounded-full border border-white/10 ring-pulse" />
      </div>
      <div className="text-[11px] uppercase tracking-[0.22em] text-white/55">Practice complete</div>
      <h2 className="text-2xl font-semibold gold-text mt-1">Thank you. So be it.</h2>
      <p className="text-white/55 text-sm mt-2">
        {protocol.name} · for {recipientName}
      </p>

      <div className="glass rounded-3xl mt-6 p-5 text-left">
        <div className="text-[11px] uppercase tracking-[0.18em] text-white/55 mb-3">
          How does it feel now?
        </div>
        <div className="flex flex-wrap gap-2">
          {SENSATIONS.map((s) => {
            const active = reflection.includes(s);
            return (
              <button
                key={s}
                onClick={() => {
                  if (active) setReflection(reflection.filter((x) => x !== s));
                  else setReflection([...reflection, s]);
                }}
                className={`px-3 py-1.5 rounded-full text-[12px] border capitalize transition ${
                  active
                    ? "bg-amber-300/15 border-amber-300/35 text-amber-100"
                    : "bg-white/4 border-white/10 text-white/70"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
        <div className="text-white/55 text-[12px] mt-4 leading-relaxed">
          If no sensation is felt, continue calmly. Not everyone feels immediately.
        </div>
      </div>

      <button
        onClick={onDone}
        className="btn-gold w-full rounded-2xl py-3.5 mt-6 font-medium tracking-wide"
      >
        Close practice
      </button>
      <div className="text-[11px] text-white/40 mt-4">Stay blessed.</div>
    </section>
  );
}
