use agentic_verification::proof_interface::{generate_performance_proof, TradingInputs};
use agentic_verification::giza_adapter::{verify_zk_proof, ZkProof};

#[test]
fn test_zk_proof_generation_and_verification() {
    let inputs = TradingInputs {
        prices: vec![99.0, 100.5, 102.0],
        quantities: vec![1.0, 2.0, -1.5],
        timestamps: vec![1714560000, 1714563600, 1714567200],
        features: None,
    };
    let metric = 2.34;
    let proof: ZkProof = generate_performance_proof(metric, &inputs);
    assert!(verify_zk_proof(&proof));
    let serialized = proof.to_json();
    let deserialized = ZkProof::from_json(&serialized);
    assert_eq!(deserialized.public_metric, metric);
    assert_eq!(deserialized.proof_bytes, proof.proof_bytes);
}
