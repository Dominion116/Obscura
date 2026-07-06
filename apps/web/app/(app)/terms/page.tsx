import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that govern your use of Obscura, a non-custodial interface to the Zama Confidential Token Wrappers Registry on Ethereum Sepolia.",
};

const REPO_URL = "https://github.com/Dominion116/Obscura";

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="July 6, 2026"
      intro={
        <p>
          These terms govern your use of Obscura: the web application, the
          developer documentation site, and the public read API that backs
          them (together, &quot;the Service&quot;). By accessing or using the
          Service you agree to these terms. If you do not agree, do not use
          the Service.
        </p>
      }
    >
      <LegalSection title="1. What Obscura is">
        <p>
          Obscura is an open-source, non-custodial web interface to the Zama
          Confidential Token Wrappers Registry on the Ethereum Sepolia test
          network. It lets you browse registered ERC-20 to ERC-7984 wrapper
          pairs, wrap and unwrap tokens, transfer confidential tokens, decrypt
          your own balances, and mint test tokens from a faucet. It was built
          as a reference implementation for the Zama Developer Program,
          Mainnet Season 3 bounty track.
        </p>
      </LegalSection>

      <LegalSection title="2. Testnet only, no monetary value">
        <p>
          The Service operates exclusively on Sepolia, a public Ethereum test
          network. Every token you can interact with through Obscura,
          including the mock tokens minted by the faucet, is a test asset
          with no monetary value. Nothing in the Service is an offer,
          solicitation, or recommendation to buy or sell any asset, and
          nothing in it constitutes financial, investment, legal, or tax
          advice.
        </p>
      </LegalSection>

      <LegalSection title="3. Non-custodial: your wallet, your keys">
        <p>
          Obscura never takes possession of your funds, private keys, or seed
          phrases. Every transaction is constructed in your browser and
          signed by your own wallet; nothing can move without your explicit
          approval in that wallet.
        </p>
        <p>
          You are solely responsible for securing your wallet and for
          reviewing every transaction and signature request before approving
          it. Blockchain transactions are irreversible once confirmed; neither
          Obscura nor anyone else can undo them.
        </p>
      </LegalSection>

      <LegalSection title="4. The smart contracts are not ours">
        <p>
          The Confidential Token Wrappers Registry, the ERC-7984 wrapper
          contracts, and the mock tokens are deployed and operated by Zama,
          not by Obscura. Obscura only reads from and helps you write to
          them. The registry&apos;s owner can revoke a wrapper at any time;
          Obscura surfaces the validity flag and blocks wrapping into revoked
          wrappers, but has no control over registrations, revocations,
          upgrades, or any other behavior of those contracts.
        </p>
      </LegalSection>

      <LegalSection title="5. Confidentiality and disclosure">
        <p>
          Confidential balances are decrypted in your browser through a
          signed user-decryption request and are never sent to or stored on
          our servers. Be aware of one deliberate exception in the protocol:
          finalizing an unwrap requires the unwrap amount to be publicly
          decrypted. Once that happens, the amount is permanently public
          on-chain. Starting an unwrap means accepting that disclosure.
        </p>
      </LegalSection>

      <LegalSection title="6. Third-party services">
        <p>
          The Service depends on infrastructure we do not operate: your
          wallet and its connection tooling, public RPC endpoints, the Zama
          relayer and its decryption infrastructure, block explorers, and our
          hosting providers. Their availability, performance, and conduct are
          outside our control, and their own terms govern your use of them.
          The Service may be interrupted, degraded, or discontinued at any
          time without notice.
        </p>
      </LegalSection>

      <LegalSection title="7. Acceptable use">
        <p>You agree not to:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>use the Service for any unlawful purpose;</li>
          <li>
            attempt to exploit, disrupt, or gain unauthorized access to the
            Service, its API, or the underlying contracts;
          </li>
          <li>
            place abusive load on the faucet, the read API, or the relayer;
          </li>
          <li>
            misrepresent the Service, or present test assets as having real
            value.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="8. Open source">
        <p>
          Obscura&apos;s code is open source under the MIT license and lives
          on{" "}
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline"
          >
            GitHub
          </a>
          . Third-party names and marks, including Zama and Ethereum, belong
          to their respective owners; their use here does not imply
          endorsement.
        </p>
      </LegalSection>

      <LegalSection title="9. Disclaimers">
        <p>
          The Service is provided &quot;as is&quot; and &quot;as
          available&quot;, without warranties of any kind, express or
          implied. Fully homomorphic encryption on Ethereum is experimental
          technology; the protocol, the contracts, and this interface may
          contain defects. Data shown in the interface (balances, pair lists,
          activity, statistics) may lag or diverge from on-chain state; the
          blockchain itself is the only source of truth.
        </p>
      </LegalSection>

      <LegalSection title="10. Limitation of liability">
        <p>
          To the maximum extent permitted by law, the authors and
          contributors of Obscura shall not be liable for any indirect,
          incidental, special, consequential, or exemplary damages, or for
          any loss of tokens, data, or goodwill, arising from your use of or
          inability to use the Service, including losses caused by wallet
          compromise, contract behavior, relayer downtime, or mistakes in
          transactions you signed.
        </p>
      </LegalSection>

      <LegalSection title="11. Changes to these terms">
        <p>
          We may update these terms from time to time. Changes take effect
          when posted on this page, with the date above updated accordingly.
          Continuing to use the Service after a change means you accept the
          revised terms.
        </p>
      </LegalSection>

      <LegalSection title="12. Contact">
        <p>
          Questions about these terms are best raised as an issue on the{" "}
          <a
            href={`${REPO_URL}/issues`}
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline"
          >
            GitHub repository
          </a>
          . For how we handle data, see the{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
