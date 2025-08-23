[app]
# Nazwa wyświetlana w systemie
title = NeuroQuantumAI
# Nazwa paczki w kodzie i w Android Manifest
package.name = neuroquantumai
package.domain = org.example
# Główne źródła aplikacji
source.dir = .
# Jakie rozszerzenia dołączać do pakietu
source.include_exts = py,png,jpg,kv,atlas
# Wersja aplikacji
version = 1.0
# Wymagane biblioteki — usuwamy libffi
requirements = python3,kivy==2.1.0,kivymd,requests,pillow,certifi,urllib3,chardet,idna,setuptools
# Orientacja ekranu
orientation = portrait
# Ikony (opcjonalnie zmień ścieżki)
icon.filename = %(source.dir)s/data/icon.png

# Uprawnienia Androida — dodawaj w razie potrzeby
android.permissions = INTERNET

# Minimalna wersja Android API
android.minapi = 21
android.sdk = 33
android.ndk = 25b
android.ndk_api = 21

# Obsługiwane architektury
android.archs = armeabi-v7a, arm64-v8a

# Możesz wyłączyć presplash albo ustawić własny
# presplash.filename = %(source.dir)s/data/presplash.png

[buildozer]
log_level = 2
warn_on_root = 1
# Kluczowa zmiana: korzystamy z bibliotek systemowych
use_system_libs = True

[app:source.exclude_patterns]
# Możesz dodać wzorce plików do wykluczenia z builda
# np. tests/*, docs/*

[app:source.include_patterns]
# Możesz wymusić dołączenie plików, które normalnie byłyby pominięte
