import json, random, os

MAP_FILE = "network_map.json"

def generate_synaptic_connection(source_signals, target):
    if not isinstance(source_signals, list):
        source_signals = [str(source_signals)]
    weight = round(random.uniform(0.75, 0.98), 2)
    try:
        if os.path.exists(MAP_FILE):
            with open(MAP_FILE, "r", encoding="utf-8") as f:
                map_data = json.load(f)
        else:
                map_data = {}
        for src in source_signals:
            key = f"{src}→{target}"
            map_data[key] = weight
        with open(MAP_FILE, "w", encoding="utf-8") as f:
            json.dump(map_data, f, indent=2)
        return f"🧠 Połączenie utworzone: {', '.join(source_signals)} → {target}, waga: {weight}"
    except Exception as e:
        return f"⚠️ Błąd synapsy: {e}"
