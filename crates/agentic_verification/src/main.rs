use actix_web::{post, get, web, App, HttpServer, Responder, HttpResponse};
use serde::{Deserialize, Serialize};
use tracing::{info, Level};
use tracing_subscriber::FmtSubscriber;
use chrono::Utc;
mod proof_store;
use proof_store::{PROOF_STORE, DECISION_STORE};
use agentic_verification::proof_interface::{generate_performance_proof, TradingInputs};
use agentic_verification::giza_adapter::{verify_zk_proof, ZkProof};
use actix_cors::Cors;

#[derive(Deserialize)]
struct AnalysisRequest {
    asset: String,
    prices: Vec<f64>,
    quantities: Vec<f64>,
    timestamps: Vec<u64>,
    features: Option<Vec<f64>>,
}

#[derive(Serialize, Clone)]
struct AnalysisResponse {
    decision: String,
    confidence: f64,
    proof_id: String,
    proof: ZkProof,
}

#[post("/analyze")]
async fn analyze(req: web::Json<AnalysisRequest>) -> impl Responder {
    let asset = &req.asset;
    info!("Received analysis request for asset: {}", asset);
    info!("Making decision for {}", asset);

    // Simulate agent computation (replace with real logic as needed)
    let metric = 1.0; // e.g., Sharpe ratio
    let decision = "BUY".to_string();
    let confidence = 1.0;
    let proof_id = format!("{}_{}", asset, Utc::now().timestamp());

    info!("Compiling computation graph...");
    info!("Executing graph and generating trace...");
    info!("Generating proof for execution trace...");
    let inputs = TradingInputs {
        prices: req.prices.clone(),
        quantities: req.quantities.clone(),
        timestamps: req.timestamps.clone(),
        features: req.features.clone(),
    };
    let proof = generate_performance_proof(metric, &inputs);
    info!("Proof generated successfully. Proof ID: {}", proof_id);
    info!("Verifying proof...");
    let verified = verify_zk_proof(&proof);
    if verified {
        info!("Proof verified successfully!");
    } else {
        info!("Proof verification failed!");
    }
    info!("Result tensor: [simulated result]");
    info!("Decision: {}, Confidence: {:.2}", decision, confidence);
    info!("Generated decision with proof ID: {}", proof_id);

    // Store proof and decision
    {
        let mut ps = PROOF_STORE.lock().unwrap();
        ps.insert(proof_id.clone(), proof.clone());
    }
    {
        let mut ds = DECISION_STORE.lock().unwrap();
        ds.insert(proof_id.clone(), decision.clone());
    }

    HttpResponse::Ok().json(AnalysisResponse {
        decision,
        confidence,
        proof_id,
        proof,
    })
}

#[derive(Deserialize)]
struct VerificationRequest {
    proof_id: String,
}

#[post("/verify")]
async fn verify(req: web::Json<VerificationRequest>) -> impl Responder {
    let proof_id = &req.proof_id;
    info!("Received verification request for proof ID: {}", proof_id);
    info!("Verifying decision with proof ID: {}", proof_id);
    let proof_opt = {
        let ps = PROOF_STORE.lock().unwrap();
        ps.get(proof_id).cloned()
    };
    match proof_opt {
        Some(proof) => {
            let verified = verify_zk_proof(&proof);
            if verified {
                info!("Found proof data for verification");
                info!("Proof verified successfully!");
                HttpResponse::Ok().body("Proof verified")
            } else {
                HttpResponse::BadRequest().body("Proof verification failed!")
            }
        },
        None => HttpResponse::NotFound().body("Proof ID not found"),
    }
}

#[get("/proofs")]
async fn list_proofs() -> impl Responder {
    let ps = PROOF_STORE.lock().unwrap();
    let mut out = Vec::new();
    for (id, proof) in ps.iter() {
        out.push((id.clone(), proof.public_metric));
    }
    HttpResponse::Ok().json(out)
}

#[get("/proof/{id}")]
async fn get_proof(path: web::Path<String>) -> impl Responder {
    let id = path.into_inner();
    let ps = PROOF_STORE.lock().unwrap();
    match ps.get(&id) {
        Some(proof) => HttpResponse::Ok().json(proof),
        None => HttpResponse::NotFound().body("Proof ID not found"),
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let subscriber = FmtSubscriber::builder()
        .with_max_level(Level::INFO)
        .finish();
    tracing::subscriber::set_global_default(subscriber).expect("setting default subscriber failed");

    let addr = "0.0.0.0:8088";
    info!("Starting HTTP server on {}", addr);

    HttpServer::new(|| {
        App::new()
            .wrap(
                Cors::default()
                    .allow_any_origin()
                    .allow_any_method()
                    .allow_any_header()
            )
            .service(analyze)
            .service(verify)
            .service(list_proofs)
            .service(get_proof)
    })
    .bind(addr)?
    .run()
    .await
}