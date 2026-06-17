import { Navigation } from "@/components/sections/navigation";
import { Hero } from "@/components/sections/hero";
import { Vision } from "@/components/sections/vision";
import { Collection } from "@/components/sections/collection";
import { Technology } from "@/components/sections/technology";
import { Experience } from "@/components/sections/experience";
import { Footer } from "@/components/sections/footer";
import { ScrollProgress } from "@/components/scroll-progress";
import { getAvailableProducts } from "@/lib/db/queries";

// Always reflect the latest catalogue edits from the admin.
export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await getAvailableProducts();

  return (
    <>
      <ScrollProgress />
      <Navigation />
      <main>
        <Hero />
        <Vision />
        <Collection products={products} />
        <Technology />
        <Experience />
      </main>
      <Footer />
    </>
  );
}
