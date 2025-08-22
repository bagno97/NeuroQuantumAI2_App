[app]
# Metadane aplikacji
title = NeuroQuantumAI_App
package.name = neuroquantumai
package.domain = org.konrad
version = 1.0.0
version.code = 100

# Źródła i zasoby
source.dir = .
source.main = main.py

# Ikona i ekran startowy
icon.filename = %(source.dir)s/dane/icon.png
presplash.filename = %(source.dir)s/dane/splash.png
presplash.animation = True
presplash.fullscreen = True

# Rozszerzenia i zasoby
include_exts = py,png,jpg,kv,atlas,json,ttf,ini,txt,md
copy_to_apk = True
android.add_assets = %(source.dir)s/assets
android.add_src = %(source.dir)s/dane
android.add_resources = %(source.dir)s/fonts
android.extra_manifest_xml = %(source.dir)s/dane/manifest.xml

# UI i wygląd
orientation = portrait
fullscreen = 1
android.theme = @android:style/Theme.Material.Light.DarkActionBar

# Wymagania Python/Kivy + libffi
requirements = python3,kivy==2.1.0,kivymd,requests,pillow,certifi,urllib3,chardet,idna,setuptools,libffi

# Bootstrap SDL2
p4a.bootstrap = sdl2

# Uprawnienia Androida
android.permissions = INTERNET,CAMERA,WRITE_EXTERNAL_STORAGE,READ_EXTERNAL_STORAGE,VIBRATE,ACCESS_FINE_LOCATION
android.features = gps,camera
android.hardware = touchscreen,multitouch
android.allow_backup = True
android.private_storage = True

# Architektury i API
android.archs = armeabi-v7a,arm64-v8a
android.minapi = 21
android.api = 33
android.build_tools_version = 34.0.0

# Podpisywanie aplikacji
android.release = True
android.sign = True
android.keystore = %(source.dir)s/konrad.keystore
android.keyalias = konradkey
android.keystore_password = __WSTAW_HASLO__
android.keyalias_password = __WSTAW_HASLO__

# Debugowanie
log_level = 2
debug = 0

[buildozer]
use_system_libs = True
warn_on_root = 1
