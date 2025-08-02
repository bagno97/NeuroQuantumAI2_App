# self_updater.py
import os
import traceback

class SelfUpdater:
    def append_to_file(self, file_path, code_snippet):
        try:
            with open(file_path, "a", encoding="utf-8") as f:
                f.write("\n# === AI Update ===\n" + code_snippet + "\n")
            print(f"[AI] Plik zaktualizowany: {file_path}")
        except Exception as e:
            print("Błąd aktualizacji:", e)
            traceback.print_exc()

    def create_new_module(self, module_name, code_content):
        try:
            filename = f"{module_name}.py"
            with open(filename, "w", encoding="utf-8") as f:
                f.write(code_content)
            print(f"[AI] Utworzono nowy moduł: {filename}")
        except Exception as e:
            print("Błąd tworzenia modułu:", e)

    def insert_code_in_file(self, file_path, marker, code_snippet):
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
            updated = content.replace(marker, marker + "\n" + code_snippet)
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(updated)
            print(f"[AI] Kod wstawiony w {file_path}")
        except Exception as e:
            print("Błąd wstawiania kodu:", e)
