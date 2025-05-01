//! API for trading agents to generate ZK proofs of performance
use crate::giza_adapter::{self, ZkProof};

/// TradingInputs contains all private data needed for ZK proof generation.
///
/// # Security
/// - This struct must NOT be serialized, logged, or shared outside the proof circuit boundary.
/// - Only pass to trusted proof-generation code.
#[derive(Debug)]
pub struct TradingInputs {
    /// Sequence of trade prices (private)
    pub prices: Vec<f64>,
    /// Sequence of trade quantities (private)
    pub quantities: Vec<f64>,
    /// Timestamps for each trade (private)
    pub timestamps: Vec<u64>,
    /// Any additional private features (optional)
    pub features: Option<Vec<f64>>,
}

/// Generates a ZK proof of performance metric
///
/// # Arguments
/// * `metric` - The public performance metric (e.g., Sharpe ratio)
/// * `inputs` - Private trading data
///
/// # Returns
/// * ZK proof as a struct (not just a string)
///
/// # Security
/// - No sensitive data is leaked outside the proof circuit.
pub fn generate_performance_proof(metric: f64, inputs: &TradingInputs) -> ZkProof {
    giza_adapter::generate_zk_proof(metric, inputs)
}
