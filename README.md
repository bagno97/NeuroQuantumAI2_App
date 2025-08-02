# 🚀 Nazwa Projektu

Krótki opis projektu, co robi i dlaczego warto z niego korzystać.

---

## 📦 Wymagania

- Python 3.9+
- pip
- buildozer (do kompilacji APK, jeśli projekt tego wymaga)

---

## 🧪 Instalacja środowiska

> Środowisko nie jest częścią repozytorium — tworzy się je lokalnie.

```bash
python3 -m venv venv39
source venv39/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
pip install buildozer cython setuptools==65.5.1
