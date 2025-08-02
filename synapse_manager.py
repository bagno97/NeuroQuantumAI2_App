import json, random, os

MAP_FILE = "network_map.json"

def load_synapses():
    if os.path.exists(MAP_FILE):
        with open(MAP_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}

def analyze_synapses():
    synapses = load_synapses()
    analysis = {}
    for edge, weight in synapses.items():
        eff = round(weight * random.uniform(0.95, 1.05), 2)
        analysis[edge] = eff
    return analysis

def visualize_cognitive_map():
    synapses = load_synapses()
    lines = ["Mapa poznawcza:"]
    for edge, weight in synapses.items():
        lines.append(f"{edge} (waga: {weight})")
    return "\n".join(lines)
