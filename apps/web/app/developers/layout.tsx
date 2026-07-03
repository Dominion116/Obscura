import { Nav } from "@/components/shared/nav";
import { Footer } from "@/components/shared/footer";

export default function DevelopersLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Nav />
      <main className="mx-auto min-h-[70dvh] w-full max-w-7xl px-4 py-10 sm:px-6">
        {children}
      </main>
      <Footer />
    </>
  );
}
