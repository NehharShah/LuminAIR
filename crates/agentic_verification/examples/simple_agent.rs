//! Example usage: trading agent generating a ZK proof
use agentic_verification::proof_interface::{generate_performance_proof, TradingInputs};
use agentic_verification::giza_adapter::{verify_zk_proof, ZkProof};

fn main() {
    let metric = 1.23; // Example: Sharpe ratio
    let inputs = TradingInputs {
        prices: vec![100.0, 101.5, 102.1],
        quantities: vec![1.0, -0.5, 2.0],
        timestamps: vec![1714560000, 1714563600, 1714567200],
        features: Some(vec![0.1, 0.2, 0.3]),
    };
    let proof: ZkProof = generate_performance_proof(metric, &inputs);
    println!("Generated ZK Proof: {}", proof.to_json());
    let verified = verify_zk_proof(&proof);
    println!("Proof verification result: {}", verified);
}
