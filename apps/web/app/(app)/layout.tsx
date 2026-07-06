import { Nav } from "@/components/shared/nav";
import { Footer } from "@/components/shared/footer";
import { AnimatedPage } from "@/components/shared/animated-page";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Nav />
      <main
        id="main-content"
        className="mx-auto min-h-[70dvh] w-full max-w-7xl px-6 py-10"
      >
        <AnimatedPage>{children}</AnimatedPage>
      </main>
      <Footer />
    </>
  );
}
