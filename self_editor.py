import shutil, datetime, subprocess, sys, importlib, os

def modify_code(target, snippet):
    stamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
    bak = f"{target}.bak_{stamp}"
    shutil.copy(target, bak)
    with open(target, "a", encoding="utf-8") as f:
        f.write(snippet)
    res = subprocess.run([sys.executable, "-m", "py_compile", target])
    if res.returncode != 0:
        shutil.copy(bak, target)
        return "Błąd składni – rollback."
    module_name = os.path.splitext(os.path.basename(target))[0]
    importlib.reload(importlib.import_module("ai_engine." + module_name))
    return "Kod zmodyfikowany pomyślnie."

def evaluate_self():
    return "OK"
