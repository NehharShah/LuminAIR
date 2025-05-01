import React, { useState, useEffect } from "react";
import {
  analyze,
  listProofs,
  verifyProof,
  getProof,
  AnalysisRequest,
  AnalysisResponse,
  ProofListItem,
} from "./api";
import { AnalysisForm } from "./components/AnalysisForm";
import { ProofTable } from "./components/ProofTable";

const defaultTradingData = {
  asset: "ETH-USD",
  prices: [100.0, 101.5, 102.1],
  quantities: [1.0, -0.5, 2.0],
  timestamps: [1714560000, 1714563600, 1714567200],
  features: [0.1, 0.2, 0.3],
};

function App() {
  const [form, setForm] = useState<AnalysisRequest>(defaultTradingData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [proofs, setProofs] = useState<ProofListItem[]>([]);
  const [verifying, setVerifying] = useState<string | null>(null);
  const [verifyMsg, setVerifyMsg] = useState<Record<string, string>>({});
  const [selectedProof, setSelectedProof] = useState<any | null>(null);

  useEffect(() => {
    refreshProofs();
  }, []);

  async function refreshProofs() {
    try {
      setProofs(await listProofs());
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function submitAnalysis(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await analyze(form);
      setResult(res);
      await refreshProofs();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(id: string) {
    setVerifying(id);
    setVerifyMsg((m) => ({ ...m, [id]: "Verifying..." }));
    try {
      const msg = await verifyProof(id);
      setVerifyMsg((m) => ({ ...m, [id]: msg }));
    } catch (e: any) {
      setVerifyMsg((m) => ({ ...m, [id]: e.message }));
    } finally {
      setVerifying(null);
    }
  }

  async function handleShowProof(id: string) {
    try {
      const proof = await getProof(id);
      setSelectedProof(proof);
    } catch (e: any) {
      setSelectedProof({ error: e.message });
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      width: "100vw",
      background: "#f4f7fb",
      display: "flex",
      flexDirection: "column",
      fontFamily: "Inter, system-ui, sans-serif",
    }}>
      <header style={{ width: "100%", padding: "32px 0 16px 0", background: "#fff", boxShadow: "0 2px 12px #0001" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 36px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1, color: "#1e293b", margin: 0 }}>
            <span style={{ color: "#4f8cff" }}>LuminAIR</span> Agentic Verification
          </h1>
          <span style={{ color: "#64748b", fontWeight: 500, fontSize: 18 }}>ZK-Proofed Trading</span>
        </div>
      </header>
      <main style={{ flex: 1, width: "100%", maxWidth: 1280, margin: "0 auto", display: "flex", gap: 40, alignItems: "flex-start", justifyContent: "center", padding: "32px 24px 0 24px" }}>
        <section style={{ flex: 1, minWidth: 350, maxWidth: 400 }}>
          <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px #0001", padding: 28, marginBottom: 24 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#243c5a", marginBottom: 18 }}>Run Agent Analysis</h2>
            <AnalysisForm
              form={form}
              loading={loading}
              error={error}
              result={result}
              setForm={setForm}
              onSubmit={submitAnalysis}
            />
          </div>
        </section>
        <section style={{ flex: 2, minWidth: 0 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#243c5a", margin: "0 0 18px 0" }}>Generated Proofs</h2>
          <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px #0001", padding: 0, overflowX: "auto" }}>
            <ProofTable
              proofs={proofs}
              verifying={verifying}
              verifyMsg={verifyMsg}
              onVerify={handleVerify}
              onShow={handleShowProof}
            />
          </div>
          {selectedProof && (
            <div style={{ marginTop: 32, background: "#f1f5f9", padding: 24, borderRadius: 10, boxShadow: "0 2px 8px #0001" }}>
              <h3 style={{ marginBottom: 8, fontWeight: 700, color: "#334155" }}>Proof Details</h3>
              <pre style={{ fontSize: 15, whiteSpace: "pre-wrap", wordBreak: "break-all", background: "#fff", padding: 16, borderRadius: 6, border: "1px solid #e5e7eb" }}>{JSON.stringify(selectedProof, null, 2)}</pre>
              <button onClick={() => setSelectedProof(null)} style={{ marginTop: 12, padding: "8px 24px", background: "#4f8cff", color: "#fff", border: "none", borderRadius: 6, fontWeight: 600, fontSize: 16, cursor: "pointer" }}>Close</button>
            </div>
          )}
        </section>
      </main>
      <footer style={{ marginTop: 32, color: "#64748b", textAlign: "center", fontSize: 13, padding: "24px 0 12px 0", background: "#f4f7fb" }}>
        &copy; {new Date().getFullYear()} LuminAIR Agentic ZK Verification &mdash; Design by Cascade
      </footer>
    </div>
  );
}

export default App;
