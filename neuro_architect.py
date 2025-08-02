import os
import json

class NeuroArchitect:
    def __init__(self, log_path="conversation_history.json"):
        self.log_path = log_path

    def analyze_topics(self):
        if not os.path.exists(self.log_path):
            return []
        with open(self.log_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        topic_counter = {}
        for entry in data:
            user_input = entry.get("user", "")
            keywords = user_input.lower().split()
            for word in keywords:
                topic_counter[word] = topic_counter.get(word, 0) + 1

        frequent = [word for word, count in topic_counter.items() if count >= 3]
        return frequent

    def build_module(self, topic):
        filename = f"module_{topic}.py"
        if os.path.exists(filename):
            return f"Moduł {filename} już istnieje."
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(f"# Moduł analizy tematu: {topic}\n\ndef analyze(input):\n    # Tu dodaj logikę analizy\n    pass\n")
        return f"Utworzono nowy moduł: {filename}"

    def evolve(self):
        topics = self.analyze_topics()
        results = []
        for topic in topics:
            results.append(self.build_module(topic))
        return results
