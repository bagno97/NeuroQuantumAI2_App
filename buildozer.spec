[app]
title = NeuroQuantumAI
package.name = neuroquantumai
package.domain = org.konrad
source.dir = .
source.include_exts = py,png,jpg,kv,atlas,json,ttf,ini,txt,md
version = 1.0.0

requirements = python3,kivy==2.1.0,kivymd,requests,pillow,certifi,urllib3,chardet,idna,setuptools

orientation = portrait
fullscreen = 1

icon.filename = %(source.dir)s/dane/icon.png
presplash.filename = %(source.dir)s/dane/splash.png
presplash.animation = True
presplash.fullscreen = True

android.permissions = INTERNET,CAMERA,WRITE_EXTERNAL_STORAGE,READ_EXTERNAL_STORAGE,VIBRATE,ACCESS_FINE_LOCATION
android.api = 33
android.minapi = 21
android.archs = armeabi-v7a,arm64-v8a
android.build_tools_version = 34.0.0
android.release = True
android.sign = True
android.keystore = %(source.dir)s/konrad.keystore
android.keyalias = konradkey
android.keystore_password = __WSTAW_HASLO__
android.keyalias_password = __WSTAW_HASLO__

[buildozer]
log_level = 2
warn_on_root = 1
use_system_libs = True
