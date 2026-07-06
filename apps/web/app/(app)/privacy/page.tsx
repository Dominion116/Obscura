import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Obscura handles data: no accounts, no tracking, decryption stays in your browser, and the indexer stores only public on-chain events.",
};

const REPO_URL = "https://github.com/Dominion116/Obscura";

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="July 6, 2026"
      intro={
        <p>
          Obscura is built so that there is almost nothing to have a privacy
          policy about. There are no accounts, no sign-ups, no advertising,
          and no analytics or tracking cookies. This page explains the little
          that remains: what stays in your browser, what our indexer stores,
          and which third parties are involved when you use the app.
        </p>
      }
    >
      <LegalSection title="1. What we never collect">
        <p>
          We do not collect names, email addresses, or any other personal
          identifiers. We never see your private keys or seed phrases. We
          never see your decrypted balances: user decryption happens entirely
          in your browser, using a throwaway keypair generated for that
          session, and the cleartext is never transmitted to or stored on any
          server we operate.
        </p>
      </LegalSection>

      <LegalSection title="2. Your wallet address">
        <p>
          When you connect a wallet, your address is used in your browser to
          read balances, build transactions, and show your portfolio. The
          application does not send your address to our servers as part of
          any account or profile; there is no server-side record tied to you.
        </p>
        <p>
          Remember that everything you do on-chain is public by nature.
          Transactions you sign, including wraps, unwrap requests, and
          finalizations, are permanently visible on the Sepolia blockchain to
          anyone, independent of Obscura.
        </p>
      </LegalSection>

      <LegalSection title="3. What the indexer stores">
        <p>
          Obscura runs an indexer that listens to public registry and wrapper
          events and stores them in a database so the app can serve fast
          lists and statistics. It holds only public, on-chain-derived data:
          pair addresses and metadata, event types, the addresses involved,
          transaction hashes, block numbers, timestamps, and the amounts that
          are public by nature (wrap amounts and finalized unwrap amounts).
          Anyone could derive the same data from the public blockchain.
          Encrypted amounts are never stored; confidential transfer events
          are recorded without any amount.
        </p>
      </LegalSection>

      <LegalSection title="4. What stays in your browser">
        <p>
          Obscura keeps a small amount of state in your browser&apos;s local
          storage so the app works well across reloads: the live state of
          your pending unwrap requests (so an interrupted unwrap can be
          resumed), and the connection state your wallet tooling caches. This
          data never leaves your device through us, and you can remove it at
          any time by clearing site data in your browser.
        </p>
      </LegalSection>

      <LegalSection title="5. Cookies and analytics">
        <p>
          Obscura sets no advertising or analytics cookies and runs no
          behavioral tracking. Our hosting providers may keep standard,
          short-lived server logs (such as IP addresses and user agents) for
          security and operations, under their own policies.
        </p>
      </LegalSection>

      <LegalSection title="6. Third parties involved">
        <p>
          Using Obscura necessarily involves services we do not operate, each
          governed by its own privacy policy:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <span className="text-foreground">Your wallet</span> and its
            connection infrastructure (Reown AppKit / WalletConnect) handle
            your keys and connection requests.
          </li>
          <li>
            <span className="text-foreground">RPC providers</span> receive
            the read and write requests your browser makes to the Sepolia
            network.
          </li>
          <li>
            <span className="text-foreground">The Zama relayer</span>{" "}
            receives ciphertext handles, encrypted inputs, and signed
            decryption requests when you encrypt amounts or decrypt balances.
            It does not receive your private keys.
          </li>
          <li>
            <span className="text-foreground">Block explorers</span> such as
            Etherscan, when you follow an outbound link.
          </li>
          <li>
            <span className="text-foreground">Hosting providers</span>{" "}
            (currently Vercel for the web apps and Render for the API) serve
            the Service and keep their own operational logs.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="7. One deliberate disclosure">
        <p>
          The protocol requires exactly one value to become public:
          finalizing an unwrap publicly decrypts the unwrap amount, and that
          amount is then permanently visible on-chain. The interface says so
          before you start an unwrap. No other confidential value is ever
          disclosed by the Service.
        </p>
      </LegalSection>

      <LegalSection title="8. Data retention and deletion">
        <p>
          Because we hold no personal data, there is nothing personal to
          delete on request. The indexer&apos;s copy of public blockchain
          events mirrors what the chain already exposes. Anything stored in
          your browser is under your control and can be cleared at any time.
        </p>
      </LegalSection>

      <LegalSection title="9. Children">
        <p>
          The Service is a developer-focused testnet application and is not
          directed at children.
        </p>
      </LegalSection>

      <LegalSection title="10. Changes and contact">
        <p>
          If this policy changes, the update appears on this page with a new
          date at the top. Questions are welcome as issues on the{" "}
          <a
            href={`${REPO_URL}/issues`}
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline"
          >
            GitHub repository
          </a>
          . For the rules that govern using the app, see the{" "}
          <Link href="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
