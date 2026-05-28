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
  X,
  BookOpen,
  Wand2,
  ShieldCheck,
  HelpCircle,
  ArrowDown,
  RotateCw,
  Move,
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
  | "anchor"
  | "disconnect"
  | "appreciation"
  | "lag"
  | "blue-coat"
  | "cleanse"
  | "energize"
  | "stabilize"
  | "install"
  | "integrate";

type VisualMode = "hand-anchor" | "floating-cell" | "movement" | "completion";

type Step = {
  id: string;
  kind: StepKind;
  visualMode: VisualMode;
  title: string;
  purpose: string;
  instruction: string;
  /** Single-line action shown on the practice screen. */
  shortAction: string;
  voice: string;
  color: ColorTone;
  movement: MovementKind;
  duration: number; // seconds
  body: string; // body region for proxy label
  note?: string;
  /** Optional explicit phrase to say (overrides default proxy statement). */
  sayText?: string;
};

/* Hand + crystal asset URLs (transparent PNGs) */
const HAND_IMG = "https://r2-pub.rork.com/generated-images/557220a3-829c-48c0-965a-3412d1698321.png";
const CRYSTAL_IMG = "https://r2-pub.rork.com/generated-images/35ad291e-3f48-41be-a237-ffe6a6fdabce.png";

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
   PROTOCOL MATRIX — V5 micro-step engine
   Each step is short (10-15s). Hand-anchor visual is used for: anchor,
   disconnect, appreciation, L.A.G., stabilize. Floating-cell for cleanse,
   energize, blue-coat, install. Completion for integration.
   ---------------------------------------------------------------------------- */

const anchorStep = (body: string, system: string): Step => ({
  id: "anchor",
  kind: "anchor",
  visualMode: "hand-anchor",
  title: "Anchor the proxy cell",
  purpose: "Form the proxy cell and name what it represents.",
  instruction: "Touch thumb to index finger. Say the proxy statement.",
  shortAction: "Form the cell. Say the proxy statement.",
  voice: "Form the proxy cell. Say the statement.",
  color: "gold",
  movement: "pulse",
  duration: 10,
  body,
  sayText: `This cell represents all the cells of the ${system} of [name], wherever affected.`,
});

const disconnectStep = (body: string, target: string, duration = 15): Step => ({
  id: `disconnect-${target.replace(/\s+/g, "-")}`,
  kind: "disconnect",
  visualMode: "hand-anchor",
  title: `Disconnect — ${target}`,
  purpose: "Release energetic cords and unwanted influence.",
  instruction: `Say: "Disconnect all unwanted connections to the ${target}. Cut now."`,
  shortAction: "Sweep crystal downward — cords dissolve.",
  voice: `Disconnect unwanted connections to the ${target}. Cut now.`,
  color: "violet",
  movement: "sweep-down",
  duration,
  body,
});

const stabilizeStep = (body: string, duration = 15): Step => ({
  id: "stabilize",
  kind: "stabilize",
  visualMode: "hand-anchor",
  title: "Stabilize with Gold",
  purpose: "Seal and stabilize after cleansing.",
  instruction: "Hold the crystal steady. Project Gold into the cell.",
  shortAction: "Hold steady — fill with Gold.",
  voice: "Stabilize with Gold.",
  color: "gold",
  movement: "beam-in",
  duration,
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
      anchorStep("whole body", "every single cell of the body"),
      disconnectStep("whole body", "whole body"),
      { id: "cleanse-gv", kind: "cleanse", visualMode: "floating-cell",
        title: "Cleanse — Green + Violet", purpose: "Sweep heaviness from every system.",
        instruction: "Gentle clockwise circles. Green + Violet wash through the cell.",
        shortAction: "Clockwise circles — Green + Violet.",
        voice: "Apply Green and Violet to the proxy cell.",
        color: "green-violet", movement: "circle-cw", duration: 15, body: "whole body" },
      { id: "cleanse-exclude", kind: "cleanse", visualMode: "hand-anchor",
        title: "Exclude the eyes", purpose: "Eyes need their own protocol — keep them outside this sweep.",
        instruction: "Briefly affirm: exclude the eyes from this Green + Violet sweep.",
        shortAction: "Exclude the eyes from the sweep.",
        voice: "Exclude the eyes from the Green and Violet sweep.",
        color: "green-violet", movement: "pulse", duration: 8, body: "whole body",
        note: "Use the Eyes protocol for the eyes — Electric Violet only." },
      { id: "cleanse-continue", kind: "cleanse", visualMode: "floating-cell",
        title: "Continue — scalp to soles", purpose: "Sweep across skin, bones, muscles, nerves, organs, systems.",
        instruction: "Continue Green + Violet over scalp, skin, bones, organs.",
        shortAction: "Continue Green + Violet through every system.",
        voice: "Continue Green and Violet through every system.",
        color: "green-violet", movement: "circle-cw", duration: 15, body: "whole body" },
      { id: "energize-gold", kind: "energize", visualMode: "floating-cell",
        title: "Energize — Gold", purpose: "Restore every cell with golden light.",
        instruction: "Beam Gold steadily into the cell.",
        shortAction: "Hold steady — beam Gold.",
        voice: "Energize with Gold. Every cell receives golden restorative energy.",
        color: "gold", movement: "beam-in", duration: 15, body: "whole body" },
      { id: "integrate", kind: "integrate", visualMode: "completion",
        title: "Golden Sun integration", purpose: "Seal and shine like a golden sun.",
        instruction: "Expand the Gold light outward.",
        shortAction: "Expand Gold outward — golden sun.",
        voice: "See yourself shining like the golden sun.",
        color: "gold", movement: "expand", duration: 15, body: "whole body" },
      { id: "gratitude", kind: "appreciation", visualMode: "hand-anchor",
        title: "Gratitude · So be it", purpose: "Close with appreciation.",
        instruction: "Inwardly say: Thank you. So be it.",
        shortAction: "Say inwardly: Thank you. So be it.",
        voice: "Thank you. So be it. Stay blessed.",
        color: "gold", movement: "pulse", duration: 10, body: "whole body" },
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
      anchorStep("nervous system", "nervous system"),
      disconnectStep("nervous system", "nervous system"),
      { id: "cleanse", kind: "cleanse", visualMode: "floating-cell",
        title: "Cleanse — Electric Violet", purpose: "Clear heaviness from the nerves.",
        instruction: "Tiny soft Electric Violet pulses.",
        shortAction: "Tiny Electric Violet pulses.",
        voice: "Apply Electric Violet gently.",
        color: "violet", movement: "pulse", duration: 15, body: "nervous system" },
      { id: "energize", kind: "energize", visualMode: "floating-cell",
        title: "Energize — Electric Violet", purpose: "Restore nerve flow.",
        instruction: "Hold steady. Beam Electric Violet.",
        shortAction: "Hold steady — beam Electric Violet.",
        voice: "Energize with Electric Violet. Do not force.",
        color: "violet", movement: "beam-in", duration: 15, body: "nervous system" },
      stabilizeStep("nervous system"),
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
      anchorStep("muscles", "muscle cells affected by pain"),
      { id: "appreciation", kind: "appreciation", visualMode: "hand-anchor",
        title: "Appreciation", purpose: "Thank the muscles for carrying you.",
        instruction: "Inwardly: Thank you muscles for carrying the body.",
        shortAction: "Speak appreciation to the muscles.",
        voice: "Thank you muscles and legs for carrying the body.",
        color: "gold", movement: "pulse", duration: 10, body: "muscles" },
      { id: "blue-coat", kind: "blue-coat", visualMode: "floating-cell",
        title: "Soothe — Light Blue", purpose: "Cool pain energetically.",
        instruction: "Sweep a soft Light Blue wave through the cell.",
        shortAction: "Sweep cooling Light Blue downward.",
        voice: "Apply Light Blue. Soothe the muscles.",
        color: "blue", movement: "sweep-down", duration: 15, body: "muscles" },
      { id: "cleanse-green", kind: "cleanse", visualMode: "floating-cell",
        title: "Cleanse — Green", purpose: "Clear density.",
        instruction: "Sweep Green through the proxy cell.",
        shortAction: "Green clearing wave.",
        voice: "Apply Green to the proxy cell.",
        color: "green", movement: "sweep-down", duration: 15, body: "muscles" },
      { id: "cleanse-orange", kind: "cleanse", visualMode: "floating-cell",
        title: "Cleanse — Orange", purpose: "Clear deeper density.",
        instruction: "Sweep Orange through the proxy cell.",
        shortAction: "Orange clearing wave.",
        voice: "Apply Orange to the proxy cell.",
        color: "orange", movement: "sweep-down", duration: 15, body: "muscles" },
      { id: "cleanse-alt", kind: "cleanse", visualMode: "floating-cell",
        title: "Alternate — Green + Orange", purpose: "Restore strength and circulation.",
        instruction: "Alternate Green and Orange waves.",
        shortAction: "Alternate Green and Orange.",
        voice: "Alternate Green and Orange.",
        color: "orange", movement: "alternate", duration: 15, body: "muscles" },
      stabilizeStep("muscles"),
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
      anchorStep("heart", "heart and cardiovascular system"),
      { id: "lag-love", kind: "lag", visualMode: "hand-anchor",
        title: "Love", purpose: "Open the heart with love.",
        instruction: "Inwardly: Thank you, heart, for beating since the beginning of life.",
        shortAction: "Send LOVE to the heart.",
        voice: "Thank you, heart, for beating since the beginning of life.",
        color: "rose-gold", movement: "pulse", duration: 15, body: "heart" },
      { id: "lag-appreciation", kind: "appreciation", visualMode: "hand-anchor",
        title: "Appreciation", purpose: "Appreciate the heart's work.",
        instruction: "Inwardly: Thank you for moving blood and oxygen. I appreciate you.",
        shortAction: "Send APPRECIATION to the heart.",
        voice: "Thank you for circulating blood and oxygen. I appreciate you.",
        color: "gold", movement: "pulse", duration: 15, body: "heart" },
      { id: "lag-gratitude", kind: "lag", visualMode: "hand-anchor",
        title: "Gratitude", purpose: "Send gratitude to every cell.",
        instruction: "Inwardly: I send love, appreciation, and gratitude to every cell.",
        shortAction: "Send GRATITUDE to every cell.",
        voice: "I send love, appreciation, and gratitude to every cell.",
        color: "gold", movement: "pulse", duration: 15, body: "heart" },
      { id: "cleanse", kind: "cleanse", visualMode: "floating-cell",
        title: "Cleanse — Green + Violet", purpose: "Release sadness and heaviness.",
        instruction: "Circle Green + Violet gently around the cell.",
        shortAction: "Clockwise circles — Green + Violet.",
        voice: "Cleanse the heart with Green and Violet.",
        color: "green-violet", movement: "circle-cw", duration: 15, body: "heart" },
      { id: "energize", kind: "energize", visualMode: "floating-cell",
        title: "Energize — Gold + Electric Violet", purpose: "Fill the heart with light.",
        instruction: "Alternate Gold and Electric Violet.",
        shortAction: "Alternate Gold and Electric Violet.",
        voice: "Energize the heart with Gold and Electric Violet.",
        color: "gold", movement: "alternate", duration: 15, body: "heart" },
      stabilizeStep("heart"),
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
      anchorStep("digestive system", "digestive system"),
      disconnectStep("digestive system", "digestive system"),
      { id: "blue-coat", kind: "blue-coat", visualMode: "floating-cell",
        title: "Light Blue coating", purpose: "Protect lower GI before deeper clearing.",
        instruction: "Coat the cell with soft Light Blue.",
        shortAction: "Coat the cell with Light Blue.",
        voice: "Apply Light Blue coating first.",
        color: "blue", movement: "sweep-down", duration: 15, body: "digestive system",
        note: "Lower GI: Light Blue first is mandatory before Green/Orange." },
      { id: "cleanse-green", kind: "cleanse", visualMode: "floating-cell",
        title: "Cleanse — Green", purpose: "Clear density.",
        instruction: "Green wave through the cell.",
        shortAction: "Green clearing wave.",
        voice: "Apply Green.",
        color: "green", movement: "sweep-down", duration: 15, body: "digestive system" },
      { id: "cleanse-orange", kind: "cleanse", visualMode: "floating-cell",
        title: "Cleanse — Orange", purpose: "Clear deeper density.",
        instruction: "Orange wave through the cell.",
        shortAction: "Orange clearing wave.",
        voice: "Apply Orange.",
        color: "orange", movement: "sweep-down", duration: 15, body: "digestive system" },
      { id: "cleanse-alt", kind: "cleanse", visualMode: "floating-cell",
        title: "Alternate — Green + Orange", purpose: "Continue clearing in alternation.",
        instruction: "Alternate Green and Orange.",
        shortAction: "Alternate Green and Orange.",
        voice: "Alternate Green and Orange.",
        color: "orange", movement: "alternate", duration: 15, body: "digestive system" },
      stabilizeStep("digestive system"),
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
      anchorStep("kidneys", "urinary system and kidneys"),
      disconnectStep("kidneys", "left kidney", 10),
      disconnectStep("kidneys", "right kidney", 10),
      disconnectStep("kidneys", "bladder", 10),
      { id: "appreciation", kind: "appreciation", visualMode: "hand-anchor",
        title: "Appreciation", purpose: "Thank the kidneys for vitality.",
        instruction: "Inwardly: Thank you kidneys for supporting vitality.",
        shortAction: "Thank the kidneys inwardly.",
        voice: "Thank you kidneys for supporting vitality and strength.",
        color: "gold", movement: "pulse", duration: 10, body: "kidneys" },
      { id: "cleanse-green", kind: "cleanse", visualMode: "floating-cell",
        title: "Cleanse — Green", purpose: "Clear density.",
        instruction: "Green wave through the cell.",
        shortAction: "Green clearing wave.",
        voice: "Apply Green to the kidneys.",
        color: "green", movement: "sweep-down", duration: 15, body: "kidneys" },
      { id: "cleanse-orange", kind: "cleanse", visualMode: "floating-cell",
        title: "Cleanse — Orange", purpose: "Clear deeper density.",
        instruction: "Orange wave through the cell.",
        shortAction: "Orange clearing wave.",
        voice: "Apply Orange.",
        color: "orange", movement: "sweep-down", duration: 15, body: "kidneys" },
      { id: "cleanse-alt", kind: "cleanse", visualMode: "floating-cell",
        title: "Alternate — Green + Orange", purpose: "Continue clearing.",
        instruction: "Alternate Green and Orange.",
        shortAction: "Alternate Green and Orange.",
        voice: "Alternate Green and Orange.",
        color: "orange", movement: "alternate", duration: 15, body: "kidneys" },
      { id: "regenerate", kind: "energize", visualMode: "floating-cell",
        title: "Regenerate — Gold", purpose: "Restore strength and vitality.",
        instruction: "Beam Gold steadily.",
        shortAction: "Hold steady — beam Gold.",
        voice: "Regenerate the kidneys with Gold.",
        color: "gold", movement: "beam-in", duration: 15, body: "kidneys" },
      stabilizeStep("kidneys"),
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
      anchorStep("brain", "brain, both hemispheres"),
      { id: "balance", kind: "cleanse", visualMode: "hand-anchor",
        title: "Balance hemispheres", purpose: "Soften and balance left and right.",
        instruction: "Soft Greenish Gold pulses — gentle only.",
        shortAction: "Balance right and left — soft pulses.",
        voice: "Balance right and left hemispheres.",
        color: "greenish-gold", movement: "pulse", duration: 15, body: "brain",
        note: "Gentle only. Do not overdo." },
      { id: "cleanse", kind: "cleanse", visualMode: "floating-cell",
        title: "Cleanse — Greenish Gold", purpose: "Soft clearing.",
        instruction: "Tiny Greenish Gold pulses into the cell.",
        shortAction: "Tiny Greenish Gold pulses.",
        voice: "Apply Greenish Gold gently.",
        color: "greenish-gold", movement: "pulse", duration: 15, body: "brain" },
      { id: "energize", kind: "energize", visualMode: "floating-cell",
        title: "Energize — Greenish Gold", purpose: "Allow the brain to receive softly.",
        instruction: "Hold steady. Beam Greenish Gold.",
        shortAction: "Hold steady — beam Greenish Gold.",
        voice: "Allow the brain to receive softly.",
        color: "greenish-gold", movement: "beam-in", duration: 15, body: "brain" },
      stabilizeStep("brain"),
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
      anchorStep("eyes", "both eyes"),
      disconnectStep("eyes", "both eyes", 10),
      { id: "cleanse", kind: "cleanse", visualMode: "floating-cell",
        title: "Gentle Cleanse — Electric Violet", purpose: "Soft clearing for the eyes.",
        instruction: "Tiny violet pulses. Both eyes together.",
        shortAction: "Tiny Electric Violet pulses.",
        voice: "Apply Electric Violet only. Gentle, loving, soft.",
        color: "violet", movement: "pulse", duration: 12, body: "eyes",
        note: "Electric Violet ONLY. No Green or Orange. Do not strain." },
      { id: "energize", kind: "energize", visualMode: "floating-cell",
        title: "Energize — Electric Violet", purpose: "Restore softly.",
        instruction: "Continue soft pulses. Keep short.",
        shortAction: "Continue soft violet pulses.",
        voice: "Energize the eyes. Stop before overdoing.",
        color: "violet", movement: "pulse", duration: 12, body: "eyes" },
      { id: "rest", kind: "stabilize", visualMode: "hand-anchor",
        title: "Rest", purpose: "Allow the eyes to settle.",
        instruction: "Soften. Stop. Let the eyes rest.",
        shortAction: "Soften and rest.",
        voice: "Let the eyes rest now.",
        color: "violet", movement: "pulse", duration: 10, body: "eyes" },
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
      anchorStep("affected area", "all cells affected by pain"),
      { id: "blue-coat", kind: "blue-coat", visualMode: "floating-cell",
        title: "Cooling — Light Blue", purpose: "Cool the affected cells.",
        instruction: "Sweep Light Blue through the cell.",
        shortAction: "Soothing Light Blue wave.",
        voice: "Apply Light Blue. Soothe and cool the pain.",
        color: "blue", movement: "sweep-down", duration: 15, body: "affected area" },
      { id: "hold-blue", kind: "energize", visualMode: "floating-cell",
        title: "Hold — Light Blue", purpose: "Let the area relax.",
        instruction: "Hold steady. Allow the Blue to settle in.",
        shortAction: "Hold steady — let Blue settle in.",
        voice: "Hold Light Blue. Allow the area to relax.",
        color: "blue", movement: "beam-in", duration: 15, body: "affected area" },
      stabilizeStep("affected area"),
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
      anchorStep("emotional body", "every cell of the body"),
      disconnectStep("emotional body", "emotional body"),
      { id: "cleanse", kind: "cleanse", visualMode: "floating-cell",
        title: "Cleanse — Electric Violet", purpose: "Remove sadness, fear, anger, inertia, stress.",
        instruction: "Sweep Electric Violet through the cell.",
        shortAction: "Sweep Electric Violet downward.",
        voice: "Remove what no longer serves. Apply Electric Violet.",
        color: "violet", movement: "sweep-down", duration: 15, body: "emotional body" },
      { id: "release", kind: "cleanse", visualMode: "floating-cell",
        title: "Release patterns", purpose: "Release sadness, fear, anger, self-sabotage.",
        instruction: "Inwardly: release what no longer serves.",
        shortAction: "Release patterns — let them go.",
        voice: "Release sadness, fear, anger, self sabotage. Let them go.",
        color: "violet", movement: "sweep-down", duration: 15, body: "emotional body" },
      { id: "install-peace", kind: "install", visualMode: "floating-cell",
        title: "Install — Peace", purpose: "Fill with peace.",
        instruction: "Beam Gold carrying Peace into the cell.",
        shortAction: "Install PEACE — Gold beam.",
        voice: "Install peace into every cell.",
        color: "gold", movement: "beam-in", duration: 10, body: "emotional body" },
      { id: "install-love", kind: "install", visualMode: "floating-cell",
        title: "Install — Love", purpose: "Fill with love.",
        instruction: "Beam Gold carrying Love into the cell.",
        shortAction: "Install LOVE — Gold beam.",
        voice: "Install love into every cell.",
        color: "gold", movement: "beam-in", duration: 10, body: "emotional body" },
      { id: "install-joy", kind: "install", visualMode: "floating-cell",
        title: "Install — Joy", purpose: "Fill with joy.",
        instruction: "Beam Gold carrying Joy into the cell.",
        shortAction: "Install JOY — Gold beam.",
        voice: "Install joy into every cell.",
        color: "gold", movement: "beam-in", duration: 10, body: "emotional body" },
      { id: "install-chosen", kind: "install", visualMode: "floating-cell",
        title: "Install — your qualities", purpose: "Add the qualities you chose.",
        instruction: "Beam Gold carrying your chosen qualities.",
        shortAction: "Install your chosen qualities.",
        voice: "Install your chosen qualities.",
        color: "gold", movement: "beam-in", duration: 12, body: "emotional body" },
      stabilizeStep("emotional body"),
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
      {screen !== "session" && <TopBar
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
      />}

      <main className={`relative ${screen === "session" ? "" : "max-w-md mx-auto px-5 pb-24 pt-2"}`}>
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
            ambient={ambient}
            toggleAmbient={() => setAmbient((v) => !v)}
            toggleVoice={() => setVoice((v) => !v)}
            installedQualities={installedQualities}
            setInstalledQualities={setInstalledQualities}
            onComplete={() => setScreen("complete")}
            onExit={() => setScreen("tutorial")}
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
      sub: "Make the circle with thumb + index.",
      visual: <ProxyCellVisual color="gold" movement="pulse" showCrystal={false} showLabels={true} />,
    },
    {
      title: "Center the cell",
      sub: "The whole circle is the cell.",
      visual: <ProxyCellVisual color="gold" movement="pulse" showCrystal={false} showLabels={false} intensity={1.3} />,
    },
    {
      title: "Bring crystal close",
      sub: "Point the crystal to the center.",
      visual: <ProxyCellVisual color={protocol.primaryColors[0]} movement="beam-in" showCrystal={true} showLabels={true} />,
    },
    {
      title: "Say the statement",
      sub: `This cell represents all cells of the ${protocol.systemPhrase} of ${recipientName}.`,
      visual: <ProxyCellVisual color={protocol.primaryColors[0]} movement="pulse" showCrystal={true} showLabels={false} intensity={1.4} />,
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

        <div className="h-[420px] md:h-[520px] flex items-center justify-center overflow-hidden rounded-2xl">
          {current.visual}
        </div>

        <div className="mt-4 text-center">
          <div className="text-[11px] uppercase tracking-[0.18em] text-white/55">
            Step {step + 1} · {current.title}
          </div>
          <div className="text-white/90 text-sm mt-1.5">{current.sub}</div>
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
  showLabels = true,
}: {
  color: ColorTone;
  movement: MovementKind;
  showCrystal: boolean;
  label?: string;
  intensity?: number;
  showLabels?: boolean;
}) {
  const c = colorMap[color];

  // Coordinates as percentages of the container (hand image aspect 768:1207).
  const cellX = 26; // proxy cell center inside the thumb+index loop
  const cellY = 19;
  const tipX = 16; // crystal tip target (just outside the loop, upper-left)
  const tipY = 17;

  // Crystal wrapper sits above the loop so the bottom of the crystal image
  // (the natural tip) lands at (tipX, tipY).
  const crystalW = 22; // % of container width
  // crystal image aspect: ~590 / 984 ≈ 0.6  →  wrapper height in container-height %:
  // crystalW * (1/0.6) * (768/1207) ≈ crystalW * 1.061
  const crystalH = crystalW * (984 / 590) * (768 / 1207); // ≈ 23.3
  const crystalLeft = tipX - crystalW / 2;
  const crystalTop = tipY - crystalH;

  const crystalMotion =
    movement === "sweep-down"
      ? "crystal-sweep-asset"
      : movement === "circle-cw"
      ? "crystal-orbit-asset"
      : movement === "pulse"
      ? "crystal-pulse-asset"
      : movement === "alternate"
      ? "crystal-alternate-asset"
      : movement === "expand"
      ? "crystal-expand-asset"
      : "crystal-hold-asset";

  const uid = color; // unique-ish suffix for gradient ids

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none overflow-hidden">
      <div
        className="relative"
        style={{
          aspectRatio: "768 / 1207",
          height: "128%",
          maxWidth: "none",
          transform: "translateY(6%)",
        }}
      >
        {/* outer cinematic aura centered on the proxy cell */}
        <div
          className={`absolute pointer-events-none ${movement === "expand" ? "expand-aura" : ""}`}
          style={{
            left: `${cellX}%`,
            top: `${cellY}%`,
            width: "70%",
            aspectRatio: "1 / 1",
            transform: "translate(-50%,-50%)",
            background: `radial-gradient(circle, ${c.ring} 0%, transparent 70%)`,
            opacity: 0.65 * intensity,
            filter: "blur(22px)",
          }}
        />

        {/* Photographic hand asset (transparent PNG) */}
        <img
          src={HAND_IMG}
          alt=""
          draggable={false}
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          style={{ filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.55))" }}
        />

        {/* SVG overlay — beam, movement paths, labels */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full pointer-events-none"
          aria-hidden
        >
          <defs>
            <linearGradient
              id={`beamGrad-${uid}`}
              x1={tipX}
              y1={tipY}
              x2={cellX}
              y2={cellY}
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor={c.from} stopOpacity="0.95" />
              <stop offset="100%" stopColor={c.to} stopOpacity="0.25" />
            </linearGradient>
          </defs>

          {/* Beam from crystal tip into the proxy cell */}
          {showCrystal && (
            <g className="beam-glow">
              <line
                x1={tipX}
                y1={tipY}
                x2={cellX}
                y2={cellY}
                stroke={`url(#beamGrad-${uid})`}
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.55"
                vectorEffect="non-scaling-stroke"
                style={{ filter: `drop-shadow(0 0 6px ${c.ring})` }}
              />
              <line
                x1={tipX}
                y1={tipY}
                x2={cellX}
                y2={cellY}
                stroke={c.from}
                strokeWidth="1"
                strokeLinecap="round"
                className="beam-flow"
                vectorEffect="non-scaling-stroke"
                opacity="0.95"
              />
            </g>
          )}

          {/* Movement paths */}
          {movement === "sweep-down" && showCrystal && (
            <g vectorEffect="non-scaling-stroke">
              <line
                x1={cellX}
                y1={cellY - 6}
                x2={cellX}
                y2={cellY + 22}
                stroke={c.from}
                strokeWidth="1.4"
                opacity="0.75"
                className="path-sweep"
                vectorEffect="non-scaling-stroke"
              />
              <polygon
                points={`${cellX - 1.5},${cellY + 20} ${cellX + 1.5},${cellY + 20} ${cellX},${cellY + 24}`}
                fill={c.from}
                opacity="0.9"
              />
            </g>
          )}
          {movement === "circle-cw" && showCrystal && (
            <ellipse
              cx={cellX}
              cy={cellY}
              rx="11"
              ry="11"
              fill="none"
              stroke={c.from}
              strokeWidth="1.2"
              opacity="0.8"
              className="path-circle"
              vectorEffect="non-scaling-stroke"
            />
          )}
          {movement === "pulse" && showCrystal && (
            <>
              <circle
                cx={cellX}
                cy={cellY}
                r="7"
                fill="none"
                stroke={c.from}
                strokeWidth="1"
                opacity="0.85"
                className="path-pulse-ring"
                vectorEffect="non-scaling-stroke"
                style={{ transformOrigin: `${cellX}px ${cellY}px` }}
              />
              <circle
                cx={cellX}
                cy={cellY}
                r="7"
                fill="none"
                stroke={c.from}
                strokeWidth="0.8"
                opacity="0.65"
                className="path-pulse-ring"
                vectorEffect="non-scaling-stroke"
                style={{ transformOrigin: `${cellX}px ${cellY}px`, animationDelay: "0.6s" }}
              />
            </>
          )}
          {movement === "alternate" && showCrystal && (
            <g
              className="path-alt"
              vectorEffect="non-scaling-stroke"
              style={{ transformOrigin: `${cellX}px ${cellY}px` }}
            >
              <line
                x1={cellX - 14}
                y1={cellY}
                x2={cellX + 14}
                y2={cellY}
                stroke={c.from}
                strokeWidth="1.2"
                opacity="0.75"
                vectorEffect="non-scaling-stroke"
              />
              <polygon
                points={`${cellX - 16},${cellY} ${cellX - 12},${cellY - 1.5} ${cellX - 12},${cellY + 1.5}`}
                fill={c.from}
              />
              <polygon
                points={`${cellX + 16},${cellY} ${cellX + 12},${cellY - 1.5} ${cellX + 12},${cellY + 1.5}`}
                fill={c.to}
              />
            </g>
          )}
          {movement === "expand" && showCrystal && (
            <>
              <circle
                cx={cellX}
                cy={cellY}
                r="6"
                fill="none"
                stroke={c.from}
                strokeWidth="1"
                opacity="0.85"
                className="path-expand-ring"
                vectorEffect="non-scaling-stroke"
                style={{ transformOrigin: `${cellX}px ${cellY}px` }}
              />
              <circle
                cx={cellX}
                cy={cellY}
                r="6"
                fill="none"
                stroke={c.to}
                strokeWidth="0.8"
                opacity="0.6"
                className="path-expand-ring"
                vectorEffect="non-scaling-stroke"
                style={{ transformOrigin: `${cellX}px ${cellY}px`, animationDelay: "1s" }}
              />
            </>
          )}

          {/* Labels (leader lines + text) */}
          {showLabels && (
            <g
              className="label-fade"
              fontFamily="-apple-system, system-ui, sans-serif"
              vectorEffect="non-scaling-stroke"
            >
              {/* PROXY CELL */}
              <line
                x1={cellX + 5}
                y1={cellY - 2}
                x2={cellX + 28}
                y2={cellY - 8}
                stroke="rgba(255,255,255,0.45)"
                strokeWidth="0.4"
                vectorEffect="non-scaling-stroke"
              />
              <text
                x={cellX + 29}
                y={cellY - 8}
                fill="rgba(255,235,180,0.95)"
                fontSize="2.4"
                letterSpacing="0.4"
              >
                PROXY CELL
              </text>

              {/* CRYSTAL TIP */}
              {showCrystal && (
                <>
                  <line
                    x1={tipX - 2}
                    y1={tipY - 1}
                    x2={tipX - 12}
                    y2={tipY - 8}
                    stroke="rgba(255,255,255,0.45)"
                    strokeWidth="0.4"
                    vectorEffect="non-scaling-stroke"
                  />
                  <text
                    x={tipX - 14}
                    y={tipY - 9}
                    fill="rgba(255,255,255,0.85)"
                    fontSize="2.4"
                    letterSpacing="0.4"
                    textAnchor="end"
                  >
                    CRYSTAL TIP
                  </text>
                </>
              )}

              {/* THUMB */}
              <line
                x1="10"
                y1="24"
                x2="2"
                y2="30"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="0.4"
                vectorEffect="non-scaling-stroke"
              />
              <text x="0" y="33" fill="rgba(255,255,255,0.8)" fontSize="2.4" letterSpacing="0.4">
                THUMB
              </text>

              {/* INDEX */}
              <line
                x1="36"
                y1="10"
                x2="52"
                y2="4"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="0.4"
                vectorEffect="non-scaling-stroke"
              />
              <text x="54" y="4" fill="rgba(255,255,255,0.8)" fontSize="2.4" letterSpacing="0.4">
                INDEX
              </text>

              {/* Distance ~5 cm */}
              {showCrystal && (
                <>
                  <line
                    x1={tipX + 1}
                    y1={tipY + 1}
                    x2={cellX - 2}
                    y2={cellY - 1}
                    stroke="rgba(255,255,255,0.35)"
                    strokeWidth="0.3"
                    strokeDasharray="0.6 1"
                    vectorEffect="non-scaling-stroke"
                  />
                  <text
                    x={(tipX + cellX) / 2 - 5}
                    y={(tipY + cellY) / 2 + 5}
                    fill="rgba(255,255,255,0.7)"
                    fontSize="2"
                    letterSpacing="0.3"
                  >
                    ~5 cm
                  </text>
                </>
              )}
            </g>
          )}
        </svg>

        {/* Proxy cell (glowing orb inside the finger loop) */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: `${cellX}%`,
            top: `${cellY}%`,
            width: "14%",
            aspectRatio: "1 / 1",
            transform: "translate(-50%,-50%)",
          }}
        >
          <div
            className="w-full h-full rounded-full cell-glow"
            style={{
              ["--cell-glow" as never]: c.ring,
              background: `radial-gradient(circle, #ffffff 0%, ${c.from} 28%, ${c.to} 65%, transparent 100%)`,
              boxShadow: `0 0 24px ${c.ring}, inset 0 0 12px rgba(255,255,255,0.55)`,
            } as React.CSSProperties}
          />
          {intensity > 1.2 && (
            <div
              className="reminder-ring absolute inset-0 rounded-full"
              style={{ border: `2px solid ${c.from}`, transformOrigin: "center" }}
            />
          )}
        </div>

        {/* Crystal asset (animated wrapper does the motion; inner rotates) */}
        {showCrystal && (
          <div
            className={`absolute pointer-events-none ${crystalMotion}`}
            style={{
              left: `${crystalLeft}%`,
              top: `${crystalTop}%`,
              width: `${crystalW}%`,
              transformOrigin: "50% 100%",
              filter: `drop-shadow(0 0 12px ${c.ring}) drop-shadow(0 0 4px ${c.from}) drop-shadow(0 8px 14px rgba(0,0,0,0.45))`,
            }}
          >
            <div
              style={{
                transform: "rotate(18deg)",
                transformOrigin: "50% 100%",
              }}
            >
              <img
                src={CRYSTAL_IMG}
                alt=""
                draggable={false}
                className="w-full h-auto select-none pointer-events-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* legacy block removed */}

      {label && (
        <div className="absolute bottom-2 text-[10px] uppercase tracking-[0.2em] text-white/55">
          {label}
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------------------
   FLOATING CELL VISUAL — used between hand-anchor moments
   ---------------------------------------------------------------------------- */

function FloatingCellVisual({
  color,
  movement,
  intensity = 1,
}: {
  color: ColorTone;
  movement: MovementKind;
  intensity?: number;
}) {
  const c = colorMap[color];
  const motionClass =
    movement === "sweep-down"
      ? "fc-sweep"
      : movement === "circle-cw"
      ? "fc-orbit"
      : movement === "pulse"
      ? "fc-pulse"
      : movement === "alternate"
      ? "fc-alternate"
      : movement === "expand"
      ? "fc-expand"
      : "fc-beam";

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none">
      <div className="relative" style={{ width: "min(70%, 360px)", aspectRatio: "1 / 1" }}>
        {/* outer halo */}
        <div
          className="absolute inset-[-25%] rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${c.ring} 0%, transparent 65%)`,
            opacity: 0.55 * intensity,
            filter: "blur(28px)",
          }}
        />
        {/* movement guide ring */}
        {movement === "circle-cw" && (
          <div
            className="absolute inset-[6%] rounded-full border path-circle"
            style={{ borderColor: c.from, opacity: 0.55, borderWidth: 1 }}
          />
        )}
        {movement === "sweep-down" && (
          <div
            className="absolute left-1/2 -translate-x-1/2 path-sweep"
            style={{
              top: "-10%",
              width: 2,
              height: "120%",
              background: `linear-gradient(180deg, transparent, ${c.from}, transparent)`,
              opacity: 0.7,
            }}
          />
        )}
        {(movement === "pulse" || movement === "expand") && (
          <>
            <div
              className="absolute inset-0 rounded-full path-pulse-ring"
              style={{ border: `1px solid ${c.from}`, opacity: 0.6 }}
            />
            <div
              className="absolute inset-[10%] rounded-full path-pulse-ring"
              style={{ border: `1px solid ${c.to}`, opacity: 0.45, animationDelay: "0.6s" }}
            />
          </>
        )}
        {movement === "alternate" && (
          <div
            className="absolute top-1/2 left-0 right-0 -translate-y-1/2 path-alt"
            style={{
              height: 2,
              background: `linear-gradient(90deg, ${c.from}, transparent, ${c.to})`,
              opacity: 0.7,
            }}
          />
        )}

        {/* the proxy cell orb */}
        <div
          className={`absolute inset-[20%] rounded-full cell-glow ${motionClass}`}
          style={{
            ["--cell-glow" as never]: c.ring,
            background: `radial-gradient(circle, #ffffff 0%, ${c.from} 30%, ${c.to} 70%, transparent 100%)`,
            boxShadow: `0 0 36px ${c.ring}, inset 0 0 22px rgba(255,255,255,0.55)`,
          } as React.CSSProperties}
        />
        {intensity > 1.2 && (
          <div
            className="reminder-ring absolute inset-[20%] rounded-full"
            style={{ border: `2px solid ${c.from}` }}
          />
        )}
        {/* tiny floating particles for cinematic feel */}
        <div className="absolute inset-0 pointer-events-none">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="fc-particle absolute rounded-full"
              style={{
                left: `${20 + i * 14}%`,
                top: `${30 + (i % 2) * 30}%`,
                width: 4,
                height: 4,
                background: c.from,
                boxShadow: `0 0 8px ${c.from}`,
                animationDelay: `${i * 0.4}s`,
              }}
            />
          ))}
        </div>
        <div className="absolute -bottom-6 left-0 right-0 text-center text-[10px] uppercase tracking-[0.22em] text-white/45">
          proxy cell · {c.label}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------------
   SESSION TRAINER
   ---------------------------------------------------------------------------- */

/* ----- Movement micro-icon ----- */
function MovementIcon({ m, size = 12 }: { m: MovementKind; size?: number }) {
  if (m === "sweep-down") return <ArrowDown size={size} />;
  if (m === "circle-cw") return <RotateCw size={size} />;
  if (m === "beam-in") return <Zap size={size} />;
  if (m === "pulse") return <Activity size={size} />;
  if (m === "alternate") return <Move size={size} />;
  return <Sparkles size={size} />;
}

function SessionTrainer({
  protocol,
  recipientName,
  mode,
  voice,
  ambient,
  toggleAmbient,
  toggleVoice,
  installedQualities,
  setInstalledQualities,
  onComplete,
  onExit,
}: {
  protocol: Protocol;
  recipientName: string;
  mode: AppMode;
  voice: boolean;
  ambient: boolean;
  toggleAmbient: () => void;
  toggleVoice: () => void;
  installedQualities: string[];
  setInstalledQualities: (q: string[]) => void;
  onComplete: () => void;
  onExit: () => void;
}) {
  const steps = useMemo(() => protocol.buildSteps(), [protocol]);
  const [stepIdx, setStepIdx] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [extension, setExtension] = useState(0);
  const [reminderPulse, setReminderPulse] = useState(false);
  // Scan-before must complete before the timer starts; scan-after must complete before onComplete fires.
  const [scanBeforeDone, setScanBeforeDone] = useState(false);
  const [scanAfterDone, setScanAfterDone] = useState(false);
  const [sheet, setSheet] = useState<null | "why" | "install" | "scan">("scan");
  const [scanPhase, setScanPhase] = useState<"before" | "after">("before");
  const [scanBefore, setScanBefore] = useState<string[]>([]);
  const [scanAfter, setScanAfter] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const step = steps[stepIdx];
  const effectiveDuration = step.duration + extension;

  const proxyStatement = `This cell represents all the cells of the ${protocol.systemPhrase} of ${recipientName}, wherever affected.`;

  useEffect(() => {
    setElapsed(0);
    setExtension(0);
    setSheet((s) => (s === "scan" ? s : null));
    speak(step.voice, voice);
  }, [stepIdx, step.voice, voice]);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [running]);

  useEffect(() => {
    if (mode === "practitioner") return;
    if (elapsed >= effectiveDuration) {
      if (stepIdx < steps.length - 1) {
        setStepIdx((i) => i + 1);
      } else if (!scanAfterDone) {
        // Require Scan After before completing.
        setRunning(false);
        setScanPhase("after");
        setSheet("scan");
      } else {
        onComplete();
      }
    }
  }, [elapsed, effectiveDuration, stepIdx, steps.length, onComplete, mode, scanAfterDone]);

  useEffect(() => {
    if (elapsed > 0 && elapsed % 30 === 0 && running) {
      setReminderPulse(true);
      chime();
      speak("Repeat now. " + proxyStatement, voice);
      const t = setTimeout(() => setReminderPulse(false), 3500);
      return () => clearTimeout(t);
    }
  }, [elapsed, running, proxyStatement, voice]);

  const triggerReminder = () => {
    setReminderPulse(true);
    chime();
    speak("Repeat now. " + proxyStatement, voice);
    setTimeout(() => setReminderPulse(false), 3500);
  };

  const pct = Math.min(100, (elapsed / effectiveDuration) * 100);
  const remaining = Math.max(0, effectiveDuration - elapsed);
  const cc = colorMap[step.color];
  const mm = Math.floor(remaining / 60);
  const ss = remaining % 60;

  // Compact, fixed-viewport, no-scroll trainer
  return (
    <div className="fixed inset-0 z-40 flex flex-col cho-bg overflow-hidden">
      <div className="cho-stars absolute inset-0 pointer-events-none" />

      {/* TOP BAR */}
      <div className="relative flex items-center gap-2 px-4 pt-[max(env(safe-area-inset-top),12px)] pb-2">
        <button onClick={onExit} className="btn-ghost rounded-full p-2" aria-label="Exit">
          <X size={16} />
        </button>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] uppercase tracking-[0.22em] text-white/55 truncate">
            {protocol.name}
          </div>
          <div className="text-[13px] text-white/90 truncate -mt-0.5">
            for {recipientName} · step {stepIdx + 1}/{steps.length}
          </div>
        </div>
        <div
          className={`text-right tabular-nums leading-none ${reminderPulse ? "animate-pulse" : ""}`}
        >
          <div className="text-2xl font-semibold gold-text">
            {mm}:{String(ss).padStart(2, "0")}
          </div>
          <div className="text-[9px] text-white/45 uppercase tracking-wider mt-0.5">
            remaining
          </div>
        </div>
        <button onClick={toggleAmbient} className="btn-ghost rounded-full p-2" aria-label="Ambient">
          {ambient ? <Volume2 size={14} /> : <VolumeX size={14} />}
        </button>
        <button onClick={toggleVoice} className="btn-ghost rounded-full p-2" aria-label="Voice">
          {voice ? <Mic size={14} /> : <MicOff size={14} />}
        </button>
      </div>

      {/* Step progress bar */}
      <div className="px-4">
        <div className="flex gap-1">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all ${
                i < stepIdx
                  ? "bg-white/50"
                  : i === stepIdx
                  ? "bg-amber-300/90"
                  : "bg-white/10"
              }`}
            />
          ))}
        </div>
        <div className="progress-track h-1 rounded-full mt-1.5 overflow-hidden">
          <div className="progress-fill h-full" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* CENTER (≈70%) — hand-anchor or floating-cell, swapped by visualMode */}
      <div className="relative flex-1 min-h-0 flex items-center justify-center px-4">
        <div className="relative w-full h-full max-h-[68vh] min-h-[420px] flex items-center justify-center">
          {(reminderPulse || step.visualMode === "hand-anchor") ? (
            <ProxyCellVisual
              color={step.color}
              movement={step.movement}
              showCrystal={true}
              intensity={reminderPulse ? 1.5 : 1}
              showLabels={step.kind === "anchor" || reminderPulse}
            />
          ) : (
            <FloatingCellVisual
              color={step.color}
              movement={step.movement}
              intensity={1}
            />
          )}

          {/* Color + movement pills, anchored top-left */}
          <div className="absolute top-1 left-1 flex flex-col gap-1.5">
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] border border-white/10 backdrop-blur"
              style={{ background: `linear-gradient(90deg, ${cc.from}22, ${cc.to}22)` }}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: `linear-gradient(135deg, ${cc.from}, ${cc.to})` }}
              />
              <span className="text-white/90">{cc.label}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] bg-white/5 border border-white/10 backdrop-blur text-white/75">
              <MovementIcon m={step.movement} />
              <span className="capitalize">{step.movement.replace("-", " ")}</span>
            </div>
          </div>

          {/* Step title pill, anchored top-right */}
          <div className="absolute top-1 right-1 px-2.5 py-1 rounded-full text-[11px] bg-white/5 border border-white/10 backdrop-blur text-white/85">
            {step.title}
          </div>

          {/* 30s reminder banner */}
          {reminderPulse && (
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
              <div className="text-[11px] uppercase tracking-[0.2em] text-amber-200/95 px-3 py-1 rounded-full bg-amber-300/10 border border-amber-300/30 flex items-center gap-1.5">
                <Repeat size={11} /> Repeat now
              </div>
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM (≈30%) — phrase + action + controls */}
      <div className="relative px-4 pb-[max(env(safe-area-inset-bottom),12px)]">
        {/* Proxy statement */}
        <div className="glass rounded-2xl px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="text-[9px] uppercase tracking-[0.22em] text-white/55">Say now</div>
            <button
              onClick={() => {
                chime();
                speak(proxyStatement, voice);
              }}
              className="text-white/55 hover:text-white/85"
              aria-label="Replay"
            >
              <Repeat size={12} />
            </button>
          </div>
          <div className="text-white/95 text-[13px] mt-1 leading-snug">
            “{step.sayText
              ? step.sayText
                  .replace("[name]", recipientName)
                  .replace("[system]", protocol.systemPhrase)
              : proxyStatement}”
          </div>
        </div>

        {/* One short action */}
        <div className="mt-2 px-1 text-center">
          <div className="text-[9px] uppercase tracking-[0.22em] text-white/45">
            Action
          </div>
          <div className="text-white/95 text-[13px] mt-0.5 leading-snug line-clamp-2">
            {step.shortAction}
          </div>
        </div>

        {/* Primary actions row */}
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={triggerReminder}
            className="btn-ghost rounded-full px-3 py-2 text-[11px] flex items-center gap-1.5"
            aria-label="Repeat now"
          >
            <Repeat size={12} /> Repeat now
          </button>
          <button
            onClick={() => setExtension((e) => e + 30)}
            className="btn-ghost rounded-full px-3 py-2 text-[11px] flex items-center gap-1.5"
            aria-label="Extend 30 seconds"
          >
            <RotateCcw size={12} /> +30s
            {extension > 0 && (
              <span className="ml-1 px-1.5 rounded-full bg-amber-300/20 text-amber-100 text-[10px]">
                +{extension}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              setScanPhase(stepIdx === steps.length - 1 ? "after" : "before");
              setSheet("scan");
            }}
            className="btn-ghost rounded-full px-3 py-2 text-[11px] flex items-center gap-1.5"
            aria-label="Scan"
          >
            <ShieldCheck size={12} /> Scan
          </button>
          <button
            onClick={() => setRunning((r) => !r)}
            className="btn-gold ml-auto rounded-full w-12 h-12 flex items-center justify-center"
            aria-label={running ? "Pause" : "Resume"}
          >
            {running ? <Pause size={18} /> : <Play size={18} />}
          </button>
        </div>

        {/* Secondary row */}
        <div className="mt-2 flex items-center gap-2">
          <button
            onClick={() => setSheet("why")}
            className="text-[11px] text-white/55 hover:text-white/90 px-1"
          >
            <HelpCircle size={11} className="inline -mt-0.5 mr-1" /> Why this step?
          </button>
          {step.kind === "install" && (
            <button
              onClick={() => setSheet("install")}
              className="text-[11px] text-white/55 hover:text-white/90 px-1"
            >
              <Sparkles size={11} className="inline -mt-0.5 mr-1" /> Qualities
              {installedQualities.length > 0 && (
                <span className="ml-1 text-amber-200/90">({installedQualities.length})</span>
              )}
            </button>
          )}
          <button
            onClick={() => {
              if (stepIdx < steps.length - 1) setStepIdx((i) => i + 1);
              else if (!scanAfterDone) {
                setRunning(false);
                setScanPhase("after");
                setSheet("scan");
              } else onComplete();
            }}
            className="ml-auto text-[10px] text-white/35 hover:text-white/65 px-1"
            aria-label="Skip step"
          >
            Skip <SkipForward size={10} className="inline -mt-0.5 ml-1" />
          </button>
        </div>
      </div>

      {/* SHEETS (progressive disclosure) */}
      {sheet && sheet !== "scan" && (
        <button
          aria-label="Close"
          onClick={() => setSheet(null)}
          className="absolute inset-0 bg-black/55 backdrop-blur-sm z-50"
        />
      )}
      {sheet === "scan" && (
        <div
          aria-hidden
          className="absolute inset-0 bg-black/65 backdrop-blur-sm z-50 pointer-events-auto"
        />
      )}
      {sheet === "why" && (
        <div className="absolute left-0 right-0 bottom-0 z-50 anim-fade-up">
          <div className="glass rounded-t-3xl border-t border-white/10 p-5 pb-[max(env(safe-area-inset-bottom),20px)]">
            <div className="w-10 h-1 bg-white/15 rounded-full mx-auto mb-3" />
            <div className="text-[10px] uppercase tracking-[0.22em] text-white/55">Why this step</div>
            <div className="text-white/95 text-sm mt-1.5 leading-relaxed">{step.purpose}</div>
            <div className="text-white/65 text-[12px] mt-3 leading-relaxed">
              Movement: {movementLabel[step.movement]}.
            </div>
            {step.note && (
              <div className="text-amber-200/85 text-[11px] mt-3 flex items-start gap-1.5">
                <ShieldCheck size={12} className="mt-0.5" />
                <span>{step.note}</span>
              </div>
            )}
            <div className="text-white/55 text-[11px] mt-3 leading-relaxed">
              Possible sensations: warmth, tingling, lightness, yawning, emotional release, subtle calm. If nothing yet — continue calmly.
            </div>
            <button
              onClick={() => setSheet(null)}
              className="btn-ghost w-full rounded-2xl py-2.5 mt-4 text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {sheet === "scan" && (
        <div className="absolute left-0 right-0 bottom-0 z-50 anim-fade-up">
          <div className="glass rounded-t-3xl border-t border-white/10 p-5 pb-[max(env(safe-area-inset-bottom),20px)]">
            <div className="w-10 h-1 bg-white/15 rounded-full mx-auto mb-3" />
            <div className="text-[10px] uppercase tracking-[0.22em] text-white/55 mb-1">
              {scanPhase === "before" ? "Scan before" : "Scan after"}
            </div>
            <div className="text-white/95 text-[13px] leading-snug mb-3">
              {scanPhase === "before"
                ? "Pause for a moment. Notice the area or feeling before the protocol begins."
                : "Pause and notice what changed. Compare gently to your scan before."}
            </div>
            <div className="flex gap-1.5 mb-3">
              <button
                onClick={() => setScanPhase("before")}
                className={`px-3 py-1.5 rounded-full text-[11px] border transition ${scanPhase === "before" ? "bg-amber-300/15 border-amber-300/35 text-amber-100" : "bg-white/4 border-white/10 text-white/65"}`}
              >Before</button>
              <button
                onClick={() => setScanPhase("after")}
                className={`px-3 py-1.5 rounded-full text-[11px] border transition ${scanPhase === "after" ? "bg-amber-300/15 border-amber-300/35 text-amber-100" : "bg-white/4 border-white/10 text-white/65"}`}
              >After</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {["heavy", "tight", "warm", "cool", "tingling", "calm", "light", "painful", "emotional", "no sensation"].map((s) => {
                const list = scanPhase === "before" ? scanBefore : scanAfter;
                const setList = scanPhase === "before" ? setScanBefore : setScanAfter;
                const active = list.includes(s);
                return (
                  <button
                    key={s}
                    onClick={() => {
                      if (active) setList(list.filter((x) => x !== s));
                      else setList([...list, s]);
                    }}
                    className={`px-3 py-1.5 rounded-full text-[12px] border capitalize transition ${active ? "bg-amber-300/15 border-amber-300/35 text-amber-100" : "bg-white/4 border-white/10 text-white/70"}`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
            {(scanBefore.length > 0 || scanAfter.length > 0) && (
              <div className="mt-4 text-[11px] text-white/65 space-y-1">
                {scanBefore.length > 0 && (
                  <div><span className="text-white/45">Before ·</span> {scanBefore.join(", ")}</div>
                )}
                {scanAfter.length > 0 && (
                  <div><span className="text-white/45">After ·</span> {scanAfter.join(", ")}</div>
                )}
              </div>
            )}
            <div className="text-[11px] text-white/45 mt-3 leading-relaxed">
              {scanPhase === "before"
                ? "Required — a quick check before the practice begins. Tap any that apply, or ‘no sensation’."
                : "Required — notice what changed before completing."}
            </div>
            <button
              onClick={() => {
                if (scanPhase === "before") {
                  setScanBeforeDone(true);
                  setRunning(mode === "guided");
                } else {
                  setScanAfterDone(true);
                  // If we were at the final step, complete now.
                  if (stepIdx === steps.length - 1 && elapsed >= effectiveDuration) {
                    onComplete();
                    return;
                  }
                }
                setSheet(null);
              }}
              className="btn-gold w-full rounded-2xl py-2.5 mt-4 text-sm font-medium"
            >
              {scanPhase === "before"
                ? scanBeforeDone
                  ? "Resume practice"
                  : "Begin practice"
                : "Complete practice"}
            </button>
          </div>
        </div>
      )}
      {sheet === "install" && (
        <div className="absolute left-0 right-0 bottom-0 z-50 anim-fade-up">
          <div className="glass rounded-t-3xl border-t border-white/10 p-5 pb-[max(env(safe-area-inset-bottom),20px)]">
            <div className="w-10 h-1 bg-white/15 rounded-full mx-auto mb-3" />
            <div className="text-[10px] uppercase tracking-[0.22em] text-white/55 mb-2">
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
              <div className="text-amber-100/85 text-[12px] mt-3">
                May the body be filled with {installedQualities.join(", ")}.
              </div>
            )}
            <button
              onClick={() => setSheet(null)}
              className="btn-gold w-full rounded-2xl py-2.5 mt-4 text-sm font-medium"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
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
