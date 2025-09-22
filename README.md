# 🧠 NeuroQuantumAI - Quantum Neural Networks

[![Build NeuroQuantumAI Android APK](https://github.com/[USERNAME]/NeuroQuantumAI/actions/workflows/build-apk.yml/badge.svg)](https://github.com/[USERNAME]/NeuroQuantumAI/actions/workflows/build-apk.yml)
[![Build All Platforms](https://github.com/[USERNAME]/NeuroQuantumAI/actions/workflows/build-all-platforms.yml/badge.svg)](https://github.com/[USERNAME]/NeuroQuantumAI/actions/workflows/build-all-platforms.yml)

**Zaawansowany system AI z quantum neural networks, neurogenesis i możliwościami samomodyfikacji.**

## 🚀 **Automatyczne budowanie przez GitHub Actions**

### **📱 Pobierz najnowszą wersję:**
- **[Releases](../../releases)** - Automatycznie zbudowane APK, Windows i Web
- **[Actions](../../actions)** - Zobacz proces budowania na żywo

### **🎯 Obsługiwane platformy:**
- **📱 Android APK** - Samsung Galaxy A35 5G (i inne Android 7.0+)
- **💻 Windows App** - Windows 10/11 (Electron)
- **🌐 Web PWA** - Każda nowoczesna przeglądarka

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
