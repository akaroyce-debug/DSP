import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Check } from "lucide-react";
import { getProductBySlug, getProducts } from "@/lib/db/queries";
import { formatPrice } from "@/lib/utils";
import { ScrollProgress } from "@/components/scroll-progress";
import { Footer } from "@/components/sections/footer";
import { Reveal } from "@/components/motion/reveal";
import { ThreeDPlaceholder } from "@/components/placeholders/three-d-placeholder";
import { ImagePlaceholder } from "@/components/placeholders/image-placeholder";
import { VideoPlaceholder } from "@/components/placeholders/video-placeholder";
import { ProductBuyBar } from "@/components/product-buy-bar";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Not found" };
  return {
    title: product.name,
    description: product.shortDescription,
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const all = await getProducts();
  const related = all
    .filter((p) => p.id !== product.id && p.inStock)
    .slice(0, 3);

  const lead = product.media[0];
  const leadIsModel = !lead || lead.kind === "model";
  const gallery = product.media.slice(1);

  return (
    <>
      <ScrollProgress />

      {/* Minimal top bar */}
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
        <div className="glass-strong flex w-full max-w-6xl items-center justify-between rounded-full px-5 py-2.5">
          <Link
            href="/#collection"
            className="group inline-flex items-center gap-2 text-sm text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-ink)]"
          >
            <ArrowLeft className="size-4 transition-transform duration-500 group-hover:-translate-x-1" />
            Collection
          </Link>
          <Link href="/" className="font-display text-base font-semibold tracking-tight">
            Royce<span className="text-[var(--color-ink-muted)]">DSP</span>
          </Link>
        </div>
      </header>

      <main className="px-6 pt-32">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Media */}
            <div className="lg:sticky lg:top-28 lg:h-fit">
              <div className="relative rounded-[var(--radius-glass)] bg-[var(--color-paper-pure)] p-3 shadow-[0_30px_80px_-40px_rgba(10,10,11,0.25)]">
                {leadIsModel ? (
                  <ThreeDPlaceholder
                    aspect="aspect-square"
                    label="Replace with GLTF product model"
                  />
                ) : lead.kind === "video" ? (
                  <VideoPlaceholder aspect="aspect-square" label={product.name} />
                ) : (
                  <ImagePlaceholder aspect="aspect-square" label={product.name} />
                )}
              </div>
              {gallery.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {gallery.map((m, i) => (
                    <ImagePlaceholder
                      key={i}
                      aspect="aspect-square"
                      label={m.kind}
                      rounded="rounded-2xl"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="pb-8">
              <Reveal>
                <div className="overline mb-4">{product.category}</div>
                <h1 className="font-display text-[clamp(2.25rem,6vw,4rem)] font-light leading-[0.98] tracking-[-0.03em]">
                  {product.name}
                </h1>
                <p className="text-pretty mt-5 max-w-md text-lg leading-relaxed text-[var(--color-ink-muted)]">
                  {product.shortDescription}
                </p>
              </Reveal>

              <Reveal delay={0.05}>
                <div className="mt-8 flex items-center gap-4">
                  <span className="font-display text-3xl font-medium tabular-nums">
                    {formatPrice(product.price, product.currency)}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                      product.inStock
                        ? "bg-[var(--color-bronze-tint)] text-[var(--color-bronze)]"
                        : "bg-[color-mix(in_srgb,var(--color-ink)_6%,transparent)] text-[var(--color-ink-muted)]"
                    }`}
                  >
                    {product.inStock ? (
                      <>
                        <Check className="size-3" /> Available
                      </>
                    ) : (
                      "Sold out"
                    )}
                  </span>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <ProductBuyBar
                  product={{
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    inStock: product.inStock,
                  }}
                />
              </Reveal>

              {product.description && (
                <Reveal delay={0.12}>
                  <div className="mt-12 border-t border-[var(--color-line)] pt-10">
                    <h2 className="overline mb-4">Overview</h2>
                    <p className="text-pretty whitespace-pre-line text-[1.05rem] leading-relaxed text-[var(--color-ink-soft)]">
                      {product.description}
                    </p>
                  </div>
                </Reveal>
              )}

              {product.features.length > 0 && (
                <Reveal delay={0.14}>
                  <div className="mt-12 border-t border-[var(--color-line)] pt-10">
                    <h2 className="overline mb-6">Engineered details</h2>
                    <dl className="grid gap-px">
                      {product.features.map((f) => (
                        <div
                          key={f.title}
                          className="border-t border-[var(--color-line)] py-6 first:border-t-0"
                        >
                          <dt className="font-display text-lg font-light tracking-tight">
                            {f.title}
                          </dt>
                          <dd className="text-pretty mt-2 max-w-md leading-relaxed text-[var(--color-ink-muted)]">
                            {f.description}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </Reveal>
              )}
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-32 border-t border-[var(--color-line)] pt-16">
              <h2 className="font-display mb-10 text-2xl font-light tracking-tight">
                Continue exploring
              </h2>
              <div className="grid gap-6 sm:grid-cols-3">
                {related.map((p) => (
                  <Link
                    key={p.id}
                    href={`/products/${p.slug}`}
                    className="group block"
                  >
                    <div className="overflow-hidden rounded-[var(--radius-glass)] bg-[var(--color-paper-pure)] p-2">
                      <ImagePlaceholder aspect="aspect-[5/4]" label={p.name} rounded="rounded-2xl" />
                    </div>
                    <div className="mt-4 flex items-baseline justify-between px-1">
                      <span className="font-display text-base font-medium tracking-tight transition-colors group-hover:text-[var(--color-bronze)]">
                        {p.name}
                      </span>
                      <span className="text-sm tabular-nums text-[var(--color-ink-muted)]">
                        {formatPrice(p.price, p.currency)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <div className="mt-24">
        <Footer />
      </div>
    </>
  );
}
