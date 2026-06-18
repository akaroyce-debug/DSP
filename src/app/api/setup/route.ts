import { NextRequest, NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { createClient } from "@libsql/client";
import { products } from "@/lib/db/schema";

// Temporary one-shot setup endpoint — will be removed after first use
const SECRET = process.env.SETUP_SECRET;

export async function POST(req: NextRequest) {
  const auth = req.headers.get("x-setup-secret");
  if (!SECRET || auth !== SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = process.env.TURSO_DATABASE_URL || "file:local.db";
  const authToken = process.env.TURSO_AUTH_TOKEN || undefined;
  const client = createClient({ url, authToken });
  const db = drizzle(client);

  try {
    await migrate(db, { migrationsFolder: "./drizzle" });

    // Seed 6 products
    await db.delete(products);
    await db.insert(products).values([
      {
        slug: "aurum-core",
        name: "Aurum Core",
        tagline: "Precision-crafted spatial intelligence",
        description:
          "The flagship processor at the heart of the RoyceDSP experience. Aurum Core delivers unparalleled spatial audio processing with zero-latency DSP architecture.",
        price: 34900,
        category: "Processors",
        featured: true,
        inStock: true,
        features: JSON.stringify(["Zero-latency DSP", "Spatial audio engine", "32-bit float processing", "256-channel routing"]),
        media: JSON.stringify([{ kind: "model", url: "/models/aurum-core.glb" }]),
      },
      {
        slug: "halo-field",
        name: "Halo Field",
        tagline: "Immersive spatial field generator",
        description:
          "Halo Field wraps your sound in a luminous three-dimensional space. Patent-pending field-generation algorithms create presence beyond the speakers.",
        price: 28900,
        category: "Effects",
        featured: true,
        inStock: true,
        features: JSON.stringify(["3D field generation", "Binaural rendering", "HRTF personalization", "Ambisonics support"]),
        media: JSON.stringify([{ kind: "image", url: "/images/halo-field.jpg" }]),
      },
      {
        slug: "velvet-drive",
        name: "Velvet Drive",
        tagline: "Warm harmonic saturation engine",
        description:
          "A study in controlled harmonic distortion. Velvet Drive models the exact non-linearity of vintage transformer saturation with surgical precision.",
        price: 14900,
        category: "Saturation",
        featured: false,
        inStock: true,
        features: JSON.stringify(["Transformer modeling", "Harmonic generation", "Tape emulation", "Drive sculpting"]),
        media: JSON.stringify([{ kind: "image", url: "/images/velvet-drive.jpg" }]),
      },
      {
        slug: "obsidian-suite",
        name: "Obsidian Suite",
        tagline: "Complete mastering intelligence",
        description:
          "The complete RoyceDSP mastering chain. Obsidian Suite bundles our full processor stack with an AI-assisted metering system for reference-grade masters.",
        price: 89900,
        category: "Bundles",
        featured: true,
        inStock: true,
        features: JSON.stringify(["Full processor stack", "AI metering", "Reference monitoring", "Stem mastering"]),
        media: JSON.stringify([{ kind: "model", url: "/models/obsidian-suite.glb" }]),
      },
      {
        slug: "lumen-eq",
        name: "Lumen EQ",
        tagline: "Transparent parametric equaliser",
        description:
          "Linear-phase precision meets musical warmth. Lumen EQ offers 8 fully parametric bands with zero cramping at Nyquist and optional analogue-style phase.",
        price: 18900,
        category: "EQ",
        featured: false,
        inStock: true,
        features: JSON.stringify(["8 parametric bands", "Linear phase mode", "Analogue phase option", "Mid-side processing"]),
        media: JSON.stringify([{ kind: "image", url: "/images/lumen-eq.jpg" }]),
      },
      {
        slug: "resonance-pack-01",
        name: "Resonance Pack 01",
        tagline: "Curated impulse response library",
        description:
          "250 meticulously captured impulse responses spanning rare vintage hardware, custom-built acoustic spaces, and original RoyceDSP-designed reverb chambers.",
        price: 7900,
        category: "Libraries",
        featured: false,
        inStock: true,
        features: JSON.stringify(["250 IRs", "Vintage hardware captures", "Acoustic spaces", "Custom chambers"]),
        media: JSON.stringify([{ kind: "image", url: "/images/resonance-pack.jpg" }]),
      },
    ]);

    return NextResponse.json({ ok: true, message: "Migration and seed complete." });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
