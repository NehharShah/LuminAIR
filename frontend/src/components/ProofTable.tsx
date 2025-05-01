import React from "react";
import { ProofListItem } from "../api";

interface ProofTableProps {
  proofs: ProofListItem[];
  verifying: string | null;
  verifyMsg: Record<string, string>;
  onVerify: (id: string) => void;
  onShow: (id: string) => void;
}

export const ProofTable: React.FC<ProofTableProps> = ({ proofs, verifying, verifyMsg, onVerify, onShow }) => (
  <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", boxShadow: "0 1px 4px #0001", borderRadius: 8, overflow: "hidden" }}>
    <thead>
      <tr style={{ background: "#f8fafc", color: "#222" }}>
        <th style={{ padding: 10, fontWeight: 600 }}>Proof ID</th>
        <th style={{ padding: 10, fontWeight: 600 }}>Public Metric</th>
        <th style={{ padding: 10, fontWeight: 600 }}>Verify</th>
        <th style={{ padding: 10, fontWeight: 600 }}>Show Proof</th>
      </tr>
    </thead>
    <tbody>
      {proofs.length === 0 ? (
        <tr>
          <td colSpan={4} style={{ textAlign: "center", padding: 24, color: "#888" }}>No proofs generated yet.</td>
        </tr>
      ) : (
        proofs.map(([id, metric]) => (
          <tr key={id} style={{ borderBottom: "1px solid #f0f0f0" }}>
            <td style={{ padding: 10, fontFamily: "monospace" }}>{id}</td>
            <td style={{ padding: 10 }}>{metric}</td>
            <td style={{ padding: 10 }}>
              <button
                onClick={() => onVerify(id)}
                disabled={verifying === id}
                style={{
                  padding: "4px 16px",
                  borderRadius: 5,
                  border: "none",
                  background: verifying === id ? "#e0e7ef" : "#4f8cff",
                  color: verifying === id ? "#333" : "#fff",
                  cursor: verifying === id ? "not-allowed" : "pointer",
                  fontWeight: 500,
                  fontSize: 15,
                  boxShadow: verifying === id ? "none" : "0 1px 4px #0001",
                  transition: "background 0.2s"
                }}
              >
                {verifying === id ? "Verifying..." : "Verify"}
              </button>
              <div style={{ fontSize: 13, color: verifyMsg[id]?.startsWith("Proof verified") ? "#16a34a" : "#dc2626", marginTop: 2 }}>{verifyMsg[id]}</div>
            </td>
            <td style={{ padding: 10 }}>
              <button
                onClick={() => onShow(id)}
                style={{
                  padding: "4px 16px",
                  borderRadius: 5,
                  border: "none",
                  background: "#f1f5f9",
                  color: "#222",
                  fontWeight: 500,
                  fontSize: 15,
                  cursor: "pointer",
                  boxShadow: "0 1px 4px #0001"
                }}
              >
                Show
              </button>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
)
