export interface AnalysisRequest {
  asset: string;
  prices: number[];
  quantities: number[];
  timestamps: number[];
  features?: number[];
}

export interface AnalysisResponse {
  decision: string;
  confidence: number;
  proof_id: string;
  proof: {
    proof_bytes: number[];
    public_metric: number;
  };
}

// Change ProofListItem to a tuple type for correct destructuring
export type ProofListItem = [string, number];

export async function analyze(req: AnalysisRequest): Promise<AnalysisResponse> {
  const res = await fetch('http://localhost:8088/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function listProofs(): Promise<ProofListItem[]> {
  const res = await fetch('http://localhost:8088/proofs');
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function verifyProof(proof_id: string): Promise<string> {
  const res = await fetch('http://localhost:8088/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ proof_id }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.text();
}

export async function getProof(proof_id: string) {
  const res = await fetch(`http://localhost:8088/proof/${proof_id}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
