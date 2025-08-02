#!/usr/bin/env python3
import json
import os

REINF_PATH = "reinforcement.json"
MEM_PATH = "memory.json"
CONN_PATH = "connections.json"

def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def save_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def expand_modules():
    # Wczytujemy pliki
    reinforcement = load_json(REINF_PATH)
    memory = load_json(MEM_PATH)
    connections = load_json(CONN_PATH)

    # Zliczamy powtarzające się tematy w pamięci
    freq = {}
    for entry in memory["history"]:
        for topic in entry.get("topics", []):
            freq[topic] = freq.get(topic, 0) + 1

    # Dodajemy nowe węzły, gdy temat przekracza threshold_powtórzeń
    threshold = reinforcement["neuroplastyczność"]["threshold_powtórzeń"]
    for topic, count in freq.items():
        exists = any(node["id"] == topic for node in connections["nodes"])
        if count >= threshold and not exists:
            connections["nodes"].append({
                "id": topic,
                "weight": count
            })

    # Zapisujemy zaktualizowaną mapę
    save_json(CONN_PATH, connections)
    print(f"Rozszerzono moduły: dodano węzły dla tematów powtarzających się ≥ {threshold} razy.")

if __name__ == "__main__":
    expand_modules()
