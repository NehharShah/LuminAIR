use std::collections::HashMap;
use std::sync::Mutex;
use lazy_static::lazy_static;
use agentic_verification::giza_adapter::ZkProof;

lazy_static! {
    pub static ref PROOF_STORE: Mutex<HashMap<String, ZkProof>> = Mutex::new(HashMap::new());
    pub static ref DECISION_STORE: Mutex<HashMap<String, String>> = Mutex::new(HashMap::new());
}
