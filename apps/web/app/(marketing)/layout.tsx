import { Footer } from "@/components/shared/footer";

// The hero template block renders its own floating header and <main>, so
// this layout adds neither. App pages under (app) keep the shared Nav.
export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
