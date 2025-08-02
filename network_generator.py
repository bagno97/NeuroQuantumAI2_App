import os
import json

def evolve_network_from_data(data, target_folder="modules"):
    if not os.path.exists(target_folder):
        os.makedirs(target_folder)

    keywords = set()
    for entry in data:
        keywords.update(entry["user"].lower().split())

    for word in keywords:
        filename = os.path.join(target_folder, f"{word}.py")
        if not os.path.exists(filename):
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(f"# Moduł tematyczny: {word}\n\ndef process(input):\n    # Logika dla: {word}\n    return f'Analiza {word}: {{input}}'\n")

    return f"Wygenerowano moduły dla {len(keywords)} słów kluczowych."
