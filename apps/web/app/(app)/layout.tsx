import { Nav } from "@/components/shared/nav";
import { Footer } from "@/components/shared/footer";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Nav />
      <main className="mx-auto min-h-[70dvh] w-full max-w-7xl px-6 py-10">
        {children}
      </main>
      <Footer />
    </>
  );
}
