# ADR-0001: Environment Architecture & Kubernetes Adoption Plan / Architektura środowisk i plan adopcji Kubernetesa

🌐 **Language / Język:** [English](#english) | [Polski](#polski)

- **Status:** Proposed / Accepted (Sprint 0)
- **Date / Data:** 2026-11-18
- **Author / Autor:** Igor Kowalski
- **Related Issue / Powiązane zadanie:** SZAM-66

---

<a id="english"></a>

## 🇬🇧 English

### 1. Context

The project uses a monorepo architecture (`apps/`, `packages/`, `infra/`, `docs/`) with a stack consisting of:

- **Frontend:** Vite + React + TypeScript (port `5173`)
- **Backend:** Spring Boot + Java 21 (port `8080`)
- **Database:** PostgreSQL 16 (port `5432`)

During Sprint 0, local development relies on Docker Compose (`docker compose up --build`). To ensure smooth scaling, isolated testing, and production readiness in upcoming sprints, we need to standardize our deployment environments and define a step-by-step migration plan to Kubernetes (K8s).

### 2. Decision: Environments Matrix

We define four distinct environments (`local`, `dev`, `stage`, `prod`) with clear separation of configuration, data, and deployment triggers:

| Aspect                   | `local`                                                          | `dev`                                                       | `stage`                                               | `prod`                                               |
| :----------------------- | :--------------------------------------------------------------- | :---------------------------------------------------------- | :---------------------------------------------------- | :--------------------------------------------------- |
| **Purpose**              | Individual feature development & debugging                       | Continuous integration & team feature testing               | Pre-production verification, UAT & smoke tests        | Live environment for end users                       |
| **Runtime / Hosting**    | Docker Desktop (Docker Compose) / local K8s (`minikube` / `k3d`) | Shared K8s cluster (namespace: `dev`) or cloud dev instance | K8s cluster (namespace: `stage`) mirroring `prod`     | Managed K8s cluster (namespace: `prod`)              |
| **Deployment Trigger**   | Manual (`docker compose up --build`)                             | Automatic on merge to `main` (via GitHub Actions)           | Automatic on release tag / pre-release branch         | Manual approval gate after `stage` verification      |
| **Database**             | Local PostgreSQL container (`postgres_data` volume)              | Dedicated dev PostgreSQL instance (ephemeral/resettable)    | Isolated staging PostgreSQL with anonymized/seed data | Managed PostgreSQL with automated backups & PITR     |
| **Secrets & Config**     | Local `.env` file (based on `.env.example`)                      | GitHub Secrets & K8s `ConfigMap` / `Secret`                 | K8s `Secret` / Sealed Secrets (separate credentials)  | Dedicated Secret Manager / K8s Secrets (strict RBAC) |
| **Logging & Monitoring** | Console logs (`docker compose logs`)                             | Basic container logs & Spring Boot Actuator `/health`       | Centralized logs + metrics (Prometheus/Grafana)       | Full observability, alerting & uptime monitoring     |

### 3. Kubernetes Adoption Plan (Sprint 1)

To avoid cloud infrastructure costs during early development while building K8s readiness, we adopt a phased approach starting with a local Kubernetes cluster (**k3d** or **minikube**):

1. **Dockerfiles Standardization (Week 1 of Sprint 1):**
   - Create production-ready multi-stage `Dockerfile` for `apps/backend` (Spring Boot) and `apps/frontend` (Vite + Nginx).
2. **Base Kubernetes Manifests (Week 1 of Sprint 1):**
   - Add `infra/k8s/base/` containing core manifests: `Deployment`, `Service`, `ConfigMap`, `Secret` (template), and `PersistentVolumeClaim` for PostgreSQL.
   - Configure `livenessProbe` and `readinessProbe` using Spring Boot Actuator (`/actuator/health`).
3. **Local Cluster Setup (`k3d` / `minikube`) (Week 2 of Sprint 1):**
   - Provide a single setup script/Makefile target in `infra/k8s/` to spin up the entire stack on local `k3d` or `minikube` with Ingress routing (`/` -> frontend, `/
