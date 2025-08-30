[app]
# Nazwa aplikacji
title = NeuroQuantumAI
package.name = neuroquantumai
package.domain = org.neuroquantumai

# Główna klasa startowa
source.dir = .
source.include_exts = py,png,jpg,kv,atlas

# Plik startowy
main.py = main.py

# Ikona aplikacji
icon.filename = icon.png

# Wersja aplikacji
version = 1.0

# Format aplikacji
fullscreen = 0

# Dołącz pliki danych (jeśli chcesz pamięci startowe w apk)
# Jeżeli nie potrzebujesz -> zostaw puste
source.include_patterns = ai_memory.txt,emotion_memory.txt,long_memory.txt,conversation_history.json,knowledge_map.json,network_map.json,mrmory.json

# Wymagane zależności
requirements = python3,kivy,plyer,cython

# Minimalna wersja Androida
android.minapi = 21
android.sdk = 31
android.ndk = 23b
android.ndk_api = 21

# Orientacja
orientation = portrait

# Uprawnienia Androida
android.permissions = INTERNET

# Nazwa paczki wyjściowej
package.version = 1
