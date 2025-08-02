import shutil, datetime, subprocess, sys, importlib, os, json

def modify_code(target, snippet, log_file="editor_log.json"):
    stamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
    bak = f"{target}.bak_{stamp}"
    try:
        shutil.copy(target, bak)
        with open(target, "a", encoding="utf-8") as f:
            f.write(f"\n# [AI MODIFIED] {stamp}\n{snippet}\n")

        res = subprocess.run([sys.executable, "-m", "py_compile", target])
        if res.returncode != 0:
            shutil.copy(bak, target)
            return "Błąd składni – rollback."

        module_name = os.path.splitext(os.path.basename(target))[0]
        importlib.reload(importlib.import_module("ai_engine." + module_name))

        log_entry = {
            "timestamp": stamp,
            "file": target,
            "backup": bak,
            "snippet": snippet,
            "status": "success"
        }
        save_log(log_entry, log_file)
        return "Kod zmodyfikowany pomyślnie."
    except Exception as e:
        save_log({
            "timestamp": stamp,
            "file": target,
            "backup": bak,
            "snippet": snippet,
            "status": f"error: {str(e)}"
        }, log_file)
        return f"Nieudana modyfikacja: {str(e)}"

def save_log(entry, log_file):
    try:
        if os.path.exists(log_file):
            with open(log_file, "r", encoding="utf-8") as f:
                logs = json.load(f)
        else:
            logs = []
        logs.append(entry)
        with open(log_file, "w", encoding="utf-8") as f:
            json.dump(logs, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print("Błąd zapisu logu:", e)

def evaluate_self():
    return "Moduł self_editor działa i jest gotowy do modyfikacji kodu."
