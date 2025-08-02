import os
import json
from datetime import datetime

def evolve_network_from_data(data, target_folder="modules", registry_file="modules.json"):
    # Tworzenie folderu docelowego, jeśli nie istnieje
    if not os.path.exists(target_folder):
        os.makedirs(target_folder)

    # Wyodrębnianie słów kluczowych z danych użytkownika
    keywords = set()
    for entry in data:
        user_input = entry.get("user", "")
        keywords.update(user_input.lower().split())

    generated = []
    for word in keywords:
        filename = os.path.join(target_folder, f"{word}.py")
        if not os.path.exists(filename):
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(f"# Moduł tematyczny: {word}\n\n")
                f.write("def process(input):\n")
                f.write(f"    # Logika dla: {word}\n")
                f.write(f"    return f'Analiza {word}: {{input}}'\n")
            
            generated.append({
                "module": f"{word}.py",
                "topic": word,
                "source": "network_generator",
                "status": "created",
                "timestamp": datetime.utcnow().isoformat() + "Z"
            })

    # Aktualizacja rejestru modułów
    if generated:
        if os.path.exists(registry_file):
            try:
                with open(registry_file, 'r', encoding='utf-8') as reg:
                    registry = json.load(reg)
            except json.JSONDecodeError:
                registry = []
        else:
            registry = []

        registry.extend(generated)

        with open(registry_file, 'w', encoding='utf-8') as reg:
            json.dump(registry, reg, indent=2, ensure_ascii=False)

    return f"Wygenerowano {len(generated)} nowych modułów."

