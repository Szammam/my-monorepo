- Provide a single setup script/Makefile target in `infra/k8s/` to spin up the entire stack on local `k3d` or `minikube` with Ingress routing (`/` -> frontend, `/api` -> backend).

4. **CI Integration (End of Sprint 1):**
   - Extend `.github/workflows/ci.yml` to build Docker images and validate Kubernetes manifests (`kubectl dry-run` / `kubeconform`) on every Pull Request.

### 4. Consequences & Risks

#### Positive Consequences

- **Parity across environments:** Using containers and K8s manifests reduces "works on my machine" issues between `local`, `stage`, and `prod`.
- **Zero cloud cost in Sprint 0–1:** Using `k3d`/`minikube` lets the team learn and test K8s manifests locally for free.
- **Clear security boundaries:** Strict separation of `.env` and K8s namespaces prevents accidental data corruption in higher environments.

#### Risks & Mitigations

- **Risk 1: Increased complexity for developers unfamiliar with K8s.**
  - _Mitigation:_ Keep `docker compose up --build` fully functional for daily coding; K8s is introduced incrementally in `infra/k8s/` with step-by-step onboarding docs.
- **Risk 2: Configuration drift between Docker Compose and Kubernetes.**
  - _Mitigation:_ Standardize all configuration via 12-Factor environment variables documented in `.env.example`.
- **Risk 3: Stateful PostgreSQL management inside Kubernetes.**
  - _Mitigation:_ Use `PersistentVolumeClaim` in `local`/`dev` clusters, while planning for a managed database service in `prod`.

### 5. Next Steps

- [ ] **Team Review:** Get PR approval from Backend (`AndriiSynytsia`) and Frontend (`bbosinney-coder`) leads to mark ADR-0001 as `Accepted`.
- [ ] **Sprint 1 (`infra/`):** Add `Dockerfile`s for Spring Boot and React apps.
- [ ] **Sprint 1 (`infra/k8s/`):** Create initial K8s manifests and test deployment on `minikube` / `k3d`.
- [ ] **Sprint 1 (`.github/workflows/ci.yml`):** Add container image build & manifest linting step to CI.

---

<a id="polski"></a>
🌐 [Back to English](#english)

## 🇵🇱 Polski

### 1. Kontekst

Projekt wykorzystuje architekturę monorepo (`apps/`, `packages/`, `infra/`, `docs/`) ze stosem technologicznym obejmującym:

- **Frontend:** Vite + React + TypeScript (port `5173`)
- **Backend:** Spring Boot + Java 21 (port `8080`)
- **Baza danych:** PostgreSQL 16 (port `5432`)

W trakcie Sprintu 0 lokalne środowisko deweloperskie opiera się na Docker Compose (`docker compose up --build`). Aby zapewnić sprawne skalowanie, izolowane testowanie oraz gotowość produkcyjną w kolejnych sprintach, musimy ustandaryzować środowiska wdrożeniowe oraz określić etapowy plan migracji do Kubernetesa (K8s).

### 2. Decyzja: Schemat środowisk

Definiujemy cztery odrębne środowiska (`local`, `dev`, `stage`, `prod`) z wyraźnym rozdzieleniem konfiguracji, danych oraz wyzwalaczy wdrożeń:

| Aspekt                        | `local`                                                            | `dev`                                                                   | `stage`                                                       | `prod`                                                           |
| :---------------------------- | :----------------------------------------------------------------- | :---------------------------------------------------------------------- | :------------------------------------------------------------ | :--------------------------------------------------------------- |
| **Przeznaczenie**             | Indywidualny rozwój funkcji i debugowanie                          | Ciągła integracja (CI) oraz zespołowe testy funkcji                     | Weryfikacja przedprodukcyjna, testy UAT i smoke testy         | Środowisko produkcyjne dla użytkowników końcowych                |
| **Środowisko uruchomieniowe** | Docker Desktop (Docker Compose) / lokalny K8s (`minikube` / `k3d`) | Współdzielony klaster K8s (namespace: `dev`) lub instancja deweloperska | Klaster K8s (namespace: `stage`) odzwierciedlający `prod`     | Zarządzany klaster K8s (namespace: `prod`)                       |
| **Wyzwalacz wdrożenia**       | Ręczny (`docker compose up --build`)                               | Automatyczny po mergu do `main` (przez GitHub Actions)                  | Automatyczny po utworzeniu tagu wydania / brancha pre-release | Ręczna akceptacja po pozytywnej weryfikacji na `stage`           |
| **Baza danych**               | Lokalny kontener PostgreSQL (wolumen `postgres_data`)              | Dedykowana instancja dev PostgreSQL (tymczasowa/resetowalna)            | Izolowana baza staging z danymi testowymi/zanonimizowanymi    | Zarządzany PostgreSQL z automatycznymi kopiami zapasowymi i PITR |
| **Sekrety i konfiguracja**    | Lokalny plik `.env` (na bazie `.env.example`)                      | GitHub Secrets oraz K8s `ConfigMap` / `Secret`                          | K8s `Secret` / Sealed Secrets (oddzielne poświadczenia)       | Dedykowany Secret Manager / K8s Secrets (restrykcyjny RBAC)      |
| **Logi i monitoring**         | Logi w konsoli (`docker compose logs`)                             | Podstawowe logi kontenerów oraz Spring Boot Actuator `/health`          | Scentralizowane logi + metryki (Prometheus/Grafana)           | Pełna obserwowalność, alertowanie oraz monitoring dostępności    |

### 3. Plan adopcji Kubernetesa (Sprint 1)

Aby uniknąć kosztów infrastruktury chmurowej na wczesnym etapie prac, przy jednoczesnym budowaniu gotowości pod K8s, przyjmujemy podejście etapowe oparte na lokalnym klastrze Kubernetes (**k3d** lub **minikube**):

1. **Standaryzacja plików Dockerfile (1. tydzień Sprintu 1):**
   - Utworzenie wieloetapowych (multi-stage), gotowych do produkcji plików `Dockerfile` dla `apps/backend` (Spring Boot) oraz `apps/frontend` (Vite + Nginx).
2. **Bazowe manifesty Kubernetes (1. tydzień Sprintu 1):**
   - Dodanie katalogu `infra/k8s/base/` zawierającego podstawowe manifesty: `Deployment`, `Service`, `ConfigMap`, `Secret` (szablon) oraz `PersistentVolumeClaim` dla PostgreSQL.
   - Konfiguracja sond `livenessProbe` oraz `readinessProbe` z wykorzystaniem Spring Boot Actuator (`/actuator/health`).
3. **Konfiguracja lokalnego klastra (`k3d` / `minikube`) (2. tydzień Sprintu 1):**
   - Przygotowanie pojedynczego skryptu / celu w `Makefile` w katalogu `infra/k8s/` do uruchomienia całego stosu na lokalnym `k3d` lub `minikube` z routingiem Ingress (`/` -> frontend, `/api` -> backend).
4. **Integracja z CI (Koniec Sprintu 1):**
   - Rozszerzenie `.github/workflows/ci.yml` o budowanie obrazów Docker oraz walidację manifestów Kubernetes (`kubectl dry-run` / `kubeconform`) przy każdym Pull Requeście.

### 4. Konsekwencje i ryzyka

#### Pozytywne konsekwencje

- **Spójność między środowiskami:** Wykorzystanie kontenerów i manifestów K8s ogranicza problem „u mnie działa” pomiędzy `local`, `stage` i `prod`.
- **Zerowe koszty chmury w Sprincie 0–1:** Użycie `k3d`/`minikube` pozwala zespołowi bezpłatnie testować i rozwijać manifesty K8s lokalnie.
- **Wyraźne granice bezpieczeństwa:** Ścisła separacja plików `.env` i przestrzeni nazw (namespaces) K8s zapobiega przypadkowemu nadpisaniu danych na wyższych środowiskach.

#### Ryzyka i mitygacja

- **Ryzyko 1: Większa złożoność dla osób nieznających jeszcze K8s.**
  - _Mitygacja:_ Utrzymanie w pełni działającego `docker compose up --build` do codziennej pracy; wprowadzanie K8s stopniowo w `infra/k8s/` wraz z dokumentacją krok po kroku.
- **Ryzyko 2: Rozbieżności konfiguracyjne między Docker Compose a Kubernetesem.**
  - _Mitygacja:_ Standaryzacja konfiguracji poprzez zmienne środowiskowe (zgodnie z 12-Factor App) opisane w `.env.example`.
- **Ryzyko 3: Zarządzanie stanową bazą PostgreSQL wewnątrz Kubernetesa.**
  - _Mitygacja:_ Użycie `PersistentVolumeClaim` na lokalnych klastrach `local`/`dev` oraz zaplanowanie zarządzanej usługi bazodanowej dla `prod`.

### 5. Następne kroki

- [ ] **Przegląd zespołowy:** Uzyskanie akceptacji PR od liderów Backendu (`AndriiSynytsia`) oraz Frontendu (`bbosinney-coder`) w celu zmiany statusu ADR-0001 na `Accepted`.
- [ ] **Sprint 1 (`infra/`):** Dodanie plików `Dockerfile` dla aplikacji Spring Boot oraz React.
- [ ] **Sprint 1 (`infra/k8s/`):** Utworzenie pierwszych manifestów K8s oraz przetestowanie wdrożenia na `minikube` / `k3d`.
- [ ] **Sprint 1 (`.github/workflows/ci.yml`):** Dodanie kroku budowania obrazów kontenerów i walidacji manifestów do pipeline'u CI.
