# Deployment Options: Linux VPS Comparison

This document evaluates Linux VPS providers for hosting the Sovereign Academy
infrastructure (Deno Fresh + Mojo Math Engine).

---

## 1. Quick Breakdown

### AWS (Amazon Web Services)

- **EC2 (Elastic Compute Cloud)**: Their core product.
  - **Price**: ~$8/month for `t3.micro`.
  - **Free Tier**: 750 hours/month of `t2.micro` for the first **12 months**.
- **Lightsail**: A simplified "all-in-one" VPS product.
  - **Price**: Starts at **$5/month** (1GB RAM, 1 vCPU, 40GB SSD).
  - **Verdict**: Best if you are already in the AWS ecosystem.

### Google Cloud (GCP)

- **Compute Engine**: Their core Linux VPS.
  - **Price**: Starts at ~$7/month.
  - **Always Free Tier**: The `e2-micro` instance is **permanently free** in
    selected regions (`us-east1`, `us-central1`, `us-west1`).
  - **Verdict**: **Recommended starting point** because it is $0/month
    indefinitely.

---

## 2. Competitive Alternatives

| Provider         | Price     | Best For                                            |
| ---------------- | --------- | --------------------------------------------------- |
| **GCP e2-micro** | **FREE**  | Dev/Testing, first 100 students.                    |
| **DigitalOcean** | $6/month  | Simplest UX, excellent documentation.               |
| **Hetzner (EU)** | ~$4/month | Best price-to-performance (if latency to EU is OK). |
| **Railway**      | Variable  | Easiest "Git Push" deployment (PaaS-style).         |

---

## 3. Recommended Path

1. **Phase 1 (Development)**: Use the **GCP "Always Free" e2-micro**. It runs
   standard Ubuntu 22.04+, which is perfect for hosting the Mojo binary and the
   Deno server.
2. **Phase 2 (Growth)**: Scale to a
   **$6/month DigitalOcean Droplet** or a **$5/month AWS Lightsail** instance
   once you have 100+ active students or the Mojo engine needs more CPU power.

---

## 4. Key Specs Required

To run this project comfortably, your VPS should have:

- **OS**: Ubuntu 22.04 LTS (Required for Mojo/Pixi compatibility).
- **RAM**: Minimum 1GB (2GB preferred for building/compiling).
- **Architecture**: `x86_64` (Mojo currently has better support here than
  ARM64).
