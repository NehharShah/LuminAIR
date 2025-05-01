import React from "react";
import { AnalysisRequest } from "../api";

interface AnalysisFormProps {
  form: AnalysisRequest;
  loading: boolean;
  error: string | null;
  result: any;
  setForm: (f: AnalysisRequest) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const AnalysisForm: React.FC<AnalysisFormProps> = ({ form, loading, error, result, setForm, onSubmit }) => (
  <form onSubmit={onSubmit} style={{ background: "#f9fafb", padding: 28, borderRadius: 12, boxShadow: "0 2px 12px #0001", marginBottom: 36 }}>
    <h2 style={{ marginBottom: 18, fontWeight: 700, color: "#243c5a" }}>Run Agent Analysis</h2>
    <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
      <label style={{ flex: 1, minWidth: 140 }}>
        <span style={{ fontWeight: 500 }}>Asset:</span><br />
        <input value={form.asset} onChange={e => setForm({ ...form, asset: e.target.value })} required style={{ width: "100%", padding: 6, borderRadius: 5, border: "1px solid #d1d5db" }} />
      </label>
      <label style={{ flex: 2, minWidth: 180 }}>
        <span style={{ fontWeight: 500 }}>Prices:</span><br />
        <input value={form.prices.join(",")} onChange={e => setForm({ ...form, prices: e.target.value.split(",").map(Number) })} required style={{ width: "100%", padding: 6, borderRadius: 5, border: "1px solid #d1d5db" }} />
      </label>
      <label style={{ flex: 2, minWidth: 180 }}>
        <span style={{ fontWeight: 500 }}>Quantities:</span><br />
        <input value={form.quantities.join(",")} onChange={e => setForm({ ...form, quantities: e.target.value.split(",").map(Number) })} required style={{ width: "100%", padding: 6, borderRadius: 5, border: "1px solid #d1d5db" }} />
      </label>
      <label style={{ flex: 2, minWidth: 220 }}>
        <span style={{ fontWeight: 500 }}>Timestamps:</span><br />
        <input value={form.timestamps.join(",")} onChange={e => setForm({ ...form, timestamps: e.target.value.split(",").map(Number) })} required style={{ width: "100%", padding: 6, borderRadius: 5, border: "1px solid #d1d5db" }} />
      </label>
      <label style={{ flex: 2, minWidth: 180 }}>
        <span style={{ fontWeight: 500 }}>Features (optional):</span><br />
        <input value={form.features?.join(",") ?? ""} onChange={e => setForm({ ...form, features: e.target.value ? e.target.value.split(",").map(Number) : undefined })} style={{ width: "100%", padding: 6, borderRadius: 5, border: "1px solid #d1d5db" }} />
      </label>
    </div>
    <button type="submit" disabled={loading} style={{ marginTop: 28, padding: "10px 34px", fontSize: 17, fontWeight: 600, background: "#4f8cff", color: "#fff", border: "none", borderRadius: 7, boxShadow: "0 1px 6px #4f8cff33", cursor: loading ? "not-allowed" : "pointer", transition: "background 0.2s" }}>
      {loading ? "Analyzing..." : "Analyze"}
    </button>
    {error && <div style={{ color: "#dc2626", marginTop: 14, fontWeight: 500 }}>{error}</div>}
    {result && (
      <div style={{ color: "#16a34a", marginTop: 14, fontWeight: 500 }}>
        Decision: <b>{result.decision}</b>, Confidence: <b>{result.confidence}</b>, Proof ID: <b>{result.proof_id}</b>
      </div>
    )}
  </form>
);
