# Monorepo

🌐 **Language / Język:** [English](#english) | [Polski](#polski)

---

<a id="english"></a>

## Required Tools and Environment Setup (Onboarding)

To run the project locally, install the following tools:

1. **Git** – download and install from [git-scm.com](https://git-scm.com/) (keep default settings during Windows installation).
2. **Docker Desktop (with Docker Compose)** – download from [docker.com](https://www.docker.com/products/docker-desktop/).
   - _Note for Windows:_ Run the installer as an administrator and select **All-users installation** with **WSL 2** enabled. If the system prompts you to install WSL, open PowerShell as an administrator, run `wsl --install`, and restart your computer.

### Installation Verification

Open your terminal (PowerShell or CMD) and verify that both commands return version numbers without errors:

```bash
git --version
docker compose version
```

### Running the Project

1. Clone the repository to your machine:
   ```bash
   git clone [https://github.com/Szammam/my-monorepo.git](https://github.com/Szammam/my-monorepo.git)
   ```
2. Navigate to the project folder and create your local environment variables file from the template (optional, default values work out of the box):
   ```bash
   cd my-monorepo
   cp .env.example .env
   ```
3. Start the environment (local database):
   ```bash
   docker compose up -d
   ```

### Stopping the Project

To stop and remove the running containers, execute the following command inside the project folder:

```bash
docker compose down
```

---

<a id="polski"></a>
🌐 [Back to English](#english)

## Wymagane narzędzia i konfiguracja środowiska (Onboarding)

Aby uruchomić projekt lokalnie, zainstaluj poniższe narzędzia:

1. **Git** – pobierz i zainstaluj ze strony [git-scm.com](https://git-scm.com/) (podczas instalacji na Windowsie zostaw domyślne ustawienia).
2. **Docker Desktop (z Docker Compose)** – pobierz ze strony [docker.com](https://www.docker.com/products/docker-desktop/).
   - _Uwaga dla Windows:_ Uruchom instalator jako administrator i wybierz opcję **All-users installation** z włączonym **WSL 2**. Jeśli system poprosi o doinstalowanie WSL, otwórz PowerShell jako administrator, wpisz `wsl --install`, i zrestartuj komputer.

### Weryfikacja instalacji

Otwórz terminal (PowerShell lub CMD) i sprawdź, czy obie komendy zwracają numery wersji bez błędów:

```bash
git --version
docker compose version
```

### Uruchomienie projektu

1. Sklonuj repozytorium na swój komputer:
   ```bash
   git clone [https://github.com/Szammam/my-monorepo.git](https://github.com/Szammam/my-monorepo.git)
   ```
2. Wejdź do folderu projektu i utwórz lokalny plik ze zmiennymi środowiskowymi na podstawie szablonu (opcjonalnie, wartości domyślne działają od razu):
   ```bash
   cd my-monorepo
   cp .env.example .env
   ```
3. Uruchom środowisko (lokalną bazę danych):
   ```bash
   docker compose up -d
   ```

### Zamknięcie projektu

Aby zatrzymać i usunąć działające kontenery, wykonaj w folderze projektu poniższą komendę:

```bash
docker compose down
```
