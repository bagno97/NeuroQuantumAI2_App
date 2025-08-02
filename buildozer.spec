[app]
# -------------------------------------------------
# Metadane aplikacji
# -------------------------------------------------
title                    = NeuroQuantumAI_App
package.name             = neuroquantumai
package.domain           = org.konrad
version                  = 1.0.0
version.code             = 100

# -------------------------------------------------
# Źródła i zasoby
# -------------------------------------------------
source.dir               = .
source.main              = main.py

# ikona i presplash (folder 'dane/')
icon.filename            = %(source.dir)s/dane/icon.png
presplash.filename       = %(source.dir)s/dane/splash.png
presplash.animation      = True
presplash.fullscreen     = True

# jakie rozszerzenia dołączyć
include_exts             = py,png,jpg,kv,atlas,json,ttf,ini,txt,md

# kopiuj foldery z zasobami
copy_to_apk              = True
android.add_assets       = %(source.dir)s/assets
android.add_src          = %(source.dir)s/dane
android.add_resources    = %(source.dir)s/fonts
android.extra_manifest_xml = %(source.dir)s/dane/manifest.xml

# -------------------------------------------------
# Wygląd i UI
# -------------------------------------------------
orientation              = portrait
fullscreen               = 1
android.theme            = @android:style/Theme.Material.Light.DarkActionBar

# -------------------------------------------------
# Python i Kivy
# -------------------------------------------------
requirements             = python3,kivy==2.1.0,kivymd,requests,pillow,certifi,urllib3,chardet,idna,setuptools

# przełącz się na SDL2 (stare android.bootstrap już nie działa)
p4a.bootstrap            = sdl2

# -------------------------------------------------
# Android: uprawnienia, funkcje, architektury
# -------------------------------------------------
android.permissions      = INTERNET,CAMERA,WRITE_EXTERNAL_STORAGE,READ_EXTERNAL_STORAGE,VIBRATE,ACCESS_FINE_LOCATION
android.features         = gps,camera
android.hardware         = touchscreen,multitouch
android.allow_backup     = True
android.private_storage  = True

android.archs            = armeabi-v7a,arm64-v8a
android.minapi           = 21
android.api              = 33
android.build_tools_version = 34.0.0

# -------------------------------------------------
# Release & podpisywanie
# -------------------------------------------------
android.release          = True
android.sign             = True
android.keystore         = %(source.dir)s/konrad.keystore
android.keyalias         = konradkey
android.keystore_password  = haslo123
android.keyalias_password  = haslo123

# -------------------------------------------------
# Logi i debug
# -------------------------------------------------
log_level                = 2
debug                    = 0
