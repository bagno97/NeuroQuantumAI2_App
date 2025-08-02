#!/usr/bin/env python3
import json
import datetime
from expansion        import expand_modules
from reinforcement_tracker import ReinforcementTracker
from task_executor    import TaskExecutor
from self_updater     import SelfUpdater

# Ścieżki do plików konfiguracji i pamięci
REINF_PATH = "reinforcement.json"
MEM_PATH   = "memory.json"
CONN_PATH  = "connections.json"

# Progi decyzyjne
INTERACTION_THRESHOLD = 20
MODULE_STRENGTH_LIMIT = 5

# Inicjalizacja pomocników
tracker  = ReinforcementTracker()
tasker   = TaskExecutor()
updater  = SelfUpdater()

def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def save_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def update_memory(user_input, assistant_response, topics, importance=1):
    mem = load_json(MEM_PATH)
    entry = {
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
        "user": user_input,
        "assistant": assistant_response,
        "topics": topics,
        "importance": importance
    }
    mem["history"].append(entry)
    if len(mem["history"]) > mem.get("max_entries", 200):
        mem["history"].pop(0)
    save_json(MEM_PATH, mem)
    return len(mem["history"])

def update_connections(topics):
    conn = load_json(CONN_PATH)
    for src, tgt in zip(topics, topics[1:]):
        for edge in conn["edges"]:
            if edge["source"] == src and edge["target"] == tgt:
                edge["weight"] += 1
                break
        else:
            conn["edges"].append({
                "source": src,
                "target": tgt,
                "weight": 1
            })
    save_json(CONN_PATH, conn)

def handle_system_commands(assistant_response):
    """
    Jeśli AI w odpowiedzi użyje prefiksu EXECUTE: lub UPDATE:
    wywołujemy odpowiednie funkcje.
    """
    if assistant_response.startswith("EXECUTE:"):
        cmd = assistant_response.replace("EXECUTE:", "").strip()
        getattr(tasker, cmd, lambda: print("Nieznane polecenie"))()
        return True

    if assistant_response.startswith("UPDATE:"):
        # after UPDATE: we expect "file_path||code_snippet"
        try:
            payload = assistant_response.split("UPDATE:")[1].strip()
            file_path, snippet = payload.split("||", 1)
            updater.append_to_file(file_path.strip(), snippet.strip())
            return True
        except Exception as e:
            print("Błąd parsowania UPDATE:", e)
    return False

def process_interaction(user_input, assistant_response, topics):
    # 1. Aktualizacja pamięci i zliczanie wpisów
    history_len = update_memory(user_input, assistant_response, topics)
    # 2. Aktualizacja mapy połączeń
    update_connections(topics)
    # 3. Rozszerzenie modułów tematycznych
    expand_modules()
    # 4. Wzmocnienie każdego tematu
    for topic in topics:
        tracker.reinforce(topic)

    # 5. Logika decyzyjna: tworzenie modułu, auto-aktualizacja  
    # a) Nowe moduły gdy temat jest silnie wzmocniony
    for topic in topics:
        if tracker.get_strength(topic) >= MODULE_STRENGTH_LIMIT:
            updater.create_new_module(
                module_name=f"module_{topic}",
                code_content=(
                    f"# Moduł automatyczny dla tematu '{topic}'\n"
                    "def analyze(input):\n"
                    "    # TODO: dodaj logikę analizy\n"
                    "    return f'Analiza %s: %s' % (topic, input)\n"
                )
            )

    # b) Dodanie helpera do main.py co INTERACTION_THRESHOLD interakcji
    if history_len and history_len % INTERACTION_THRESHOLD == 0:
        snippet = (
            "# Helper automatyczny co {INTERACTION_THRESHOLD} rozmów\n"
            "def auto_helper():\n"
            "    print('AI helper uruchomiony po dużym ruchu')\n"
        )
        updater.append_to_file("main.py", snippet)

    # c) Obsługa komend systemowych od AI w treści odpowiedzi
    handle_system_commands(assistant_response)

if __name__ == "__main__":
    # przykład wywołania
    user  = "Zrobię zdjęcie proszę"
    bot   = "EXECUTE:take_photo"
    topics = ["foto", "aplikacja"]
    process_interaction(user, bot, topics)
    print("Interakcja zakończona z logiką decyzyjną.")
