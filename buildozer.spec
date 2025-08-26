[app]
title = NeuroQuantumAI
package.name = neuroquantuma3_app
package.domain = org
source.dir = .
source.include_exts = py,png,jpg,kv,atlas,ttf,ttc,ini,txt,xml
requirements = python3,kivy==2.1.0,kivymd,requests,pillow,certifi,urllib3,chardet,idna,setuptools
orientation = portrait
fullscreen = 1
hide_statusbar = 0
android.orientation = portrait
android.permissions = INTERNET,CAMERA,WRITE_EXTERNAL_STORAGE,READ_EXTERNAL_STORAGE,ACCESS_FINE_LOCATION
android.api = 33
android.minapi = 21
android.sdk = 33
android.ndk = 23b
android.ndk_api = 23

[buildozer]
build_dir = ./.buildozer
bin_dir = ./bin
log_level = 2
debug = 1
use_system_libs = True
warn_on_root = 1
