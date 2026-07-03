"use client";

// Phase 0 de-risking spike for the Zama Relayer SDK (PRD §15, Phase 0).
// Exercises the three riskiest steps before any feature depends on them:
//   1. WASM loads in the browser (initSDK)
//   2. An instance is created against the live Sepolia relayer config
//   3. A user-decryption keypair generates
// This page is a scaffolding aid and is removed once Phase 3 lands.

import { useState } from "react";
import { CheckCircle2, Loader2, PlayCircle, XCircle } from "lucide-react";
import { getFhevmInstance } from "@/lib/fhevm";
import { cn } from "@/lib/utils";

type StepState = "idle" | "running" | "ok" | "error";

interface Step {
  label: string;
  state: StepState;
  detail?: string;
}

const initialSteps: Step[] = [
  { label: "Load SDK WASM (initSDK)", state: "idle" },
  { label: "Create instance (SepoliaConfig)", state: "idle" },
  { label: "Generate user-decryption keypair", state: "idle" },
];

function StepIcon({ state }: { state: StepState }) {
  switch (state) {
    case "running":
      return <Loader2 className="size-4 animate-spin text-cobalt-300" />;
    case "ok":
      return <CheckCircle2 className="size-4 text-valid" />;
    case "error":
      return <XCircle className="size-4 text-revoked" />;
    default:
      return <span className="block size-4 rounded-full border border-line" />;
  }
}

export default function SpikePage() {
  const [steps, setSteps] = useState(initialSteps);
  const [running, setRunning] = useState(false);

  const setStep = (i: number, patch: Partial<Step>) =>
    setSteps((prev) => prev.map((s, j) => (j === i ? { ...s, ...patch } : s)));

  async function run() {
    setRunning(true);
    setSteps(initialSteps);
    try {
      setStep(0, { state: "running" });
      setStep(1, { state: "running" });
      const instance = await getFhevmInstance();
      setStep(0, { state: "ok" });
      setStep(1, { state: "ok" });

      setStep(2, { state: "running" });
      const keypair = instance.generateKeypair();
      setStep(2, {
        state: "ok",
        detail: `public key ${keypair.publicKey.slice(0, 18)}…`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setSteps((prev) =>
        prev.map((s) =>
          s.state === "running" ? { ...s, state: "error", detail: message } : s,
        ),
      );
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="glass mx-auto mt-16 max-w-xl rounded-(--radius-card) p-8">
      <h1 className="text-2xl font-semibold tracking-tight">
        Relayer SDK spike
      </h1>
      <p className="mt-2 text-sm text-muted">
        Phase 0 de-risking: proves the FHEVM client loads and can prepare a
        user decryption before any feature work depends on it.
      </p>

      <ul className="mt-6 space-y-3">
        {steps.map((step) => (
          <li key={step.label} className="flex items-start gap-3 text-sm">
            <span className="mt-0.5">
              <StepIcon state={step.state} />
            </span>
            <span>
              {step.label}
              {step.detail && (
                <span
                  className={cn(
                    "mt-1 block font-mono text-xs",
                    step.state === "error" ? "text-revoked" : "text-muted",
                  )}
                >
                  {step.detail}
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={run}
        disabled={running}
        className="mt-8 inline-flex items-center gap-2 rounded-(--radius-btn) bg-cobalt-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-cobalt-600 disabled:opacity-50"
      >
        {running ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          <PlayCircle className="size-4" aria-hidden />
        )}
        {running ? "Running…" : "Run spike"}
      </button>
    </div>
  );
}
