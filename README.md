# Monorepo

## Wymagane narzędzia i konfiguracja środowiska (Onboarding)

Aby uruchomić projekt lokalnie, zainstaluj poniższe narzędzia:

1. **Git** – pobierz i zainstaluj ze strony [git-scm.com](https://git-scm.com/) (podczas instalacji na Windowsie zostaw domyślne ustawienia).
2. **Docker Desktop (z Docker Compose)** – pobierz ze strony [docker.com](https://www.docker.com/products/docker-desktop/).
   - _Uwaga dla Windows:_ Uruchom instalator jako administrator i wybierz opcję **All-users installation** z włączonym **WSL 2**. Jeśli system poprosi o doinstalowanie WSL, otwórz PowerShell jako administrator, wpisz `wsl --install` i zrestartuj komputer.

### Weryfikacja instalacji

Otwórz terminal (PowerShell lub CMD) i sprawdź, czy obie komendy zwracają numery wersji bez błędów:

```bash
git --version
docker compose version
```

### Uruchomienie projektu

1. Sklonuj repozytorium na swój komputer:
   ```bash
   git clone <TUTAJ_WKLEJ_LINK_DO_REPOZYTORIUM>
   ```
2. Wejdź do folderu projektu i uruchom środowisko (gdy pojawi się plik `docker-compose.yml`):
   ```bash
   docker compose up -d
   ```
