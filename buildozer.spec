[app]
title = NeuroQuantumAI
package.name = neuroquantumai
package.domain = org.neuroquantum
source.dir = .
source.include_exts = py,kv,png,jpg,json,txt,ttf,ttc,ini,xml,atlas
# jeśli chcesz dołączyć startowe pliki pamięci do APK:
# source.include_patterns = ai_memory.txt,emotion_memory.txt,long_memory.txt,conversation_history.json,knowledge_map.json,network_map.json,mrmory.json,connections.json

version = 1.0.0
orientation = portrait
fullscreen = 1
icon.filename = icon.png

# ⬇️ Zależności potrzebne *rzeczywiście* w projekcie
requirements = python3,kivy==2.2.1,plyer

# Uprawnienia wymagane przez TaskExecutor (plyer: camera/gps/filechooser/tts/notification)
android.permissions = INTERNET,CAMERA,READ_EXTERNAL_STORAGE,WRITE_EXTERNAL_STORAGE,ACCESS_FINE_LOCATION,WAKE_LOCK

# Android / NDK — zgodne z Kivy 2.2.1
android.api = 33
android.minapi = 21
android.sdk = 33
android.ndk = 25b
android.ndk_api = 21
android.archs = armeabi-v7a,arm64-v8a

# Logowanie / katalogi wyjściowe
[buildozer]
log_level = 2
bin_dir = ./bin
build_dir = ./.buildozer
warn_on_root = 0
