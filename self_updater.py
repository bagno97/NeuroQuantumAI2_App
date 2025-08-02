# self_updater.py

import os
import traceback
import json
from datetime import datetime

class SelfUpdater:
    def append_to_file(self, file_path, code_snippet):
        try:
            self.backup_file(file_path)
            with open(file_path, "a", encoding="utf-8") as f:
                f.write("\n# === AI Update ===\n" + code_snippet + "\n")
            print(f"[AI] Plik zaktualizowany: {file_path}")
            self.log_update(file_path, "append", code_snippet)
        except Exception as e:
            print("Błąd aktualizacji:", e)
            traceback.print_exc()

    def create_new_module(self, module_name, code_content):
        try:
            filename = f"{module_name}.py"
            with open(filename, "w", encoding="utf-8") as f:
                f.write(code_content)
            print(f"[AI] Utworzono nowy moduł: {filename}")
            self.log_update(filename, "create", code_content)
        except Exception as e:
            print("Błąd tworzenia modułu:", e)
            traceback.print_exc()

    def insert_code_in_file(self, file_path, marker, code_snippet):
        try:
            self.backup_file(file_path)
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
            if marker not in content:
                print(f"[AI] Marker '{marker}' nie został znaleziony w {file_path}")
                return
            updated = content.replace(marker, marker + "\n" + code_snippet)
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(updated)
            print(f"[AI] Kod wstawiony w {file_path}")
            self.log_update(file_path, "insert", code_snippet)
        except Exception as e:
            print("Błąd wstawiania kodu:", e)
            traceback.print_exc()

    def log_update(self, file_path, action, code_snippet):
        log_entry = {
            "file": file_path,
            "action": action,
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "code_snippet": code_snippet
        }
        try:
            if os.path.exists("update_log.json"):
                with open("update_log.json", "r", encoding="utf-8") as log_file:
                    logs = json.load(log_file)
            else:
                logs = []

            logs.append(log_entry)

            with open("update_log.json", "w", encoding="utf-8") as log_file:
                json.dump(logs, log_file, indent=2, ensure_ascii=False)
        except Exception as e:
            print("Błąd logowania aktualizacji:", e)
            traceback.print_exc()

    def backup_file(self, file_path):
        try:
            if not os.path.exists(file_path):
                print(f"[AI] Plik nie istnieje, brak kopii: {file_path}")
                return
            backup_path = file_path + ".bak"
            with open(file_path, "r", encoding="utf-8") as original:
                content = original.read()
            with open(backup_path, "w", encoding="utf-8") as backup:
                backup.write(content)
            print(f"[AI] Utworzono kopię zapasową: {backup_path}")
        except Exception as e:
            print("Błąd tworzenia kopii zapasowej:", e)
            traceback.print_exc()
