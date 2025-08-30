[app]
# Nazwa aplikacji (to co widać na telefonie)
title = MyKivyApp

# Nazwa paczki (unikalna, np. com.twojefirma.aplikacja)
package.name = mykivyapp
package.domain = org.example

# Główny plik aplikacji (musi być w repo)
source.dir = .
source.include_exts = py,png,jpg,kv,atlas

# Ikony i splash (opcjonalne)
icon.filename = %(source.dir)s/data/icon.png
# presplash.filename = %(source.dir)s/data/presplash.png

# Główne entry point
entrypoint = main.py

# Typ kompilacji: debug albo release
version = 0.1
requirements = python3,kivy

# Target Android
osx.kivy_version = 2.3.0
orientation = portrait

# Minimalna wersja Androida
android.minapi = 21
android.sdk = 33
android.ndk = 25b
android.archs = armeabi-v7a, arm64-v8a

# Uprawnienia (jeśli chcesz np. Internet)
android.permissions = INTERNET

[buildozer]
log_level = 2
warn_on_root = 1

[app.android]
# Tutaj można dodać własne zależności pip
p4a.local_recipes = 
p4a.branch = master
