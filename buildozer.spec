[app]
# --- Podstawowe informacje o aplikacji ---
title = NeuroQuantumAI
package.name = neuroquantumai
package.domain = org.konrad
source.dir = .
source.include_exts = py,png,jpg,kv,atlas
version = 1.0
orientation = portrait
fullscreen = 0

# --- Wymagania Pythona i bibliotek ---
requirements = python3,kivy==2.1.0,kivymd,requests,pillow,certifi,urllib3,chardet,idna,setuptools
# Uwaga: brak libffi w tej liście!

# --- Android: architektury i API ---
archs = armeabi-v7a, arm64-v8a
android.api = 31
ndk.api = 23
android.minapi = 21

# --- Inne ustawienia ---
osx.python_version = 3
osx.kivy_version = 1.9.1

# Możesz tu dodać inne opcje aplikacji, np. ikony:
# icon.filename = %(source.dir)s/data/icon.png


[buildozer]
log_level = 2
warn_on_root = 1
use_system_libs = True
