import { Footer } from "@/components/shared/footer";
import { AnimatedPage } from "@/components/shared/animated-page";

// The hero template block renders its own floating header; the layout owns
// the single <main> landmark so every section (not just the hero) is inside
// it. App pages under (app) keep the shared Nav.
export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <main id="main-content" className="overflow-x-hidden">
        <AnimatedPage>{children}</AnimatedPage>
      </main>
      <Footer />
    </>
  );
}
