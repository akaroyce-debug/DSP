import { NextRequest, NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { createClient } from "@libsql/client";
import { products, type NewProduct } from "@/lib/db/schema";

// Temporary one-shot setup endpoint — will be removed after first use
const SECRET = process.env.SETUP_SECRET || "roycedsp-setup-x9k2m";

const seedProducts: NewProduct[] = [
  {
    name: "Aurum Core",
    slug: "aurum-core",
    shortDescription:
      "The reference processing engine. Mastering-grade clarity, distilled.",
    description:
      "Aurum Core is the foundation of the RoyceDSP ecosystem — a zero-latency processing engine engineered around a 64-bit floating-point path and oversampled nonlinearities. It listens before it touches, profiling the program material in real time and adapting its transfer curve to preserve transient integrity while resolving the densest mixes with effortless headroom. Built for mastering, trusted in tracking.",
    price: 34900,
    category: "Core DSP",
    media: [
      { kind: "model", url: "", alt: "Aurum Core soundform sculpture" },
      { kind: "image", url: "", alt: "Aurum Core interface" },
    ],
    features: [
      { title: "Adaptive Transfer", description: "Real-time program analysis reshapes the processing curve to the material, not the meter." },
      { title: "64-bit Float Path", description: "End-to-end double precision with oversampled saturation stages for pristine highs." },
      { title: "Zero-Latency Monitor", description: "Track and mix without delay; full lookahead engages only on bounce." },
    ],
    inStock: true,
    sortOrder: 1,
  },
  {
    name: "Halo Field",
    slug: "halo-field",
    shortDescription: "Spatial intelligence that sculpts a room around every source.",
    description:
      "Halo Field reconstructs space as a continuous field rather than a set of channels. Using perceptual modeling of early reflections and diffuse tails, it places sources within a coherent acoustic volume that translates from headphones to immersive formats without re-authoring.",
    price: 28900,
    category: "Spatial Intelligence",
    media: [
      { kind: "model", url: "", alt: "Halo Field spatial sculpture" },
      { kind: "video", url: "", alt: "Halo Field walkthrough" },
    ],
    features: [
      { title: "Perceptual Room Model", description: "Early reflections and diffuse tails modeled for translation across formats." },
      { title: "Object Coherence", description: "Sources stay locked in space as the field expands or contracts." },
      { title: "Binaural & Immersive", description: "One authoring pass renders to headphones, stereo, and object-based output." },
    ],
    inStock: true,
    sortOrder: 2,
  },
  {
    name: "Velvet Drive",
    slug: "velvet-drive",
    shortDescription: "Harmonic warmth with surgical restraint. Color without compromise.",
    description:
      "Velvet Drive is a creative coloring stage that models the gentle nonlinearity of premium analog circuitry, then gives you control no hardware ever could. Sculpt even and odd harmonics independently, bias the saturation across the spectrum.",
    price: 14900,
    category: "Creative Tools",
    media: [
      { kind: "model", url: "", alt: "Velvet Drive sculpture" },
      { kind: "image", url: "", alt: "Velvet Drive interface" },
    ],
    features: [
      { title: "Independent Harmonics", description: "Shape even and odd orders separately for warmth or edge on demand." },
      { title: "Spectral Bias", description: "Concentrate saturation where the material wants it across the band." },
      { title: "Auto-Gain Match", description: "Compare tones at equal loudness so you judge color, not level." },
    ],
    inStock: true,
    sortOrder: 3,
  },
  {
    name: "Obsidian Suite",
    slug: "obsidian-suite",
    shortDescription: "The complete signature collection. Every RoyceDSP tool, in concert.",
    description:
      "Obsidian Suite gathers the full RoyceDSP catalogue into a single license — Aurum Core, Halo Field, Velvet Drive, and the Signature processing chains — tuned to work as one instrument.",
    price: 89900,
    category: "Signature Packs",
    media: [
      { kind: "model", url: "", alt: "Obsidian Suite sculpture" },
      { kind: "video", url: "", alt: "Obsidian Suite film" },
    ],
    features: [
      { title: "Unified Intelligence", description: "Plugins share analysis so each stage adapts to the whole chain." },
      { title: "One License", description: "Every current tool, plus signature chains, under a single activation." },
      { title: "Priority Updates", description: "First access to new modules and refinements as the platform evolves." },
    ],
    inStock: true,
    sortOrder: 4,
  },
  {
    name: "Lumen EQ",
    slug: "lumen-eq",
    shortDescription: "A linear-phase equalizer that hears the way you do.",
    description:
      "Lumen EQ pairs a dynamic, linear-phase filter set with a perceptual frequency display that highlights what actually matters in the moment. Bands respond dynamically to program content, taming resonances only when they ring.",
    price: 18900,
    category: "Core DSP",
    media: [
      { kind: "model", url: "", alt: "Lumen EQ sculpture" },
      { kind: "image", url: "", alt: "Lumen EQ interface" },
    ],
    features: [
      { title: "Dynamic Bands", description: "Filters engage with the material, resolving resonances only as they appear." },
      { title: "Linear Phase", description: "Phase-coherent processing for transparent corrective and mastering work." },
      { title: "Perceptual Display", description: "A spectrum that weights what you hear, not just what is present." },
    ],
    inStock: true,
    sortOrder: 5,
  },
  {
    name: "Resonance Pack 01",
    slug: "resonance-pack-01",
    shortDescription: "A curated set of signature chains for instant, intentional character.",
    description:
      "Resonance Pack 01 is a hand-built collection of signature processing chains assembled by RoyceDSP's sound design team — starting points with taste. From intimate vocal sheen to monolithic low-end and cinematic space.",
    price: 7900,
    category: "Signature Packs",
    media: [
      { kind: "image", url: "", alt: "Resonance Pack cover art" },
      { kind: "model", url: "", alt: "Resonance Pack sculpture" },
    ],
    features: [
      { title: "Curated Chains", description: "Production-ready signal flows built by professional sound designers." },
      { title: "Fully Editable", description: "Every chain opens up for you to reshape down to the last parameter." },
      { title: "Genre Spanning", description: "From intimate vocals to cinematic scale, a destination for every brief." },
    ],
    inStock: true,
    sortOrder: 6,
  },
];

export async function GET(req: NextRequest) {
  const auth = req.nextUrl.searchParams.get("secret");
  if (auth !== SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = process.env.TURSO_DATABASE_URL || "file:local.db";
  const authToken = process.env.TURSO_AUTH_TOKEN || undefined;
  const client = createClient({ url, authToken });
  const db = drizzle(client);

  try {
    await migrate(db, { migrationsFolder: "./drizzle" });
    await db.delete(products);
    await db.insert(products).values(seedProducts);
    return NextResponse.json({ ok: true, message: "Migration and seed complete. 6 products inserted." });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
