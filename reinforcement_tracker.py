import json

class ReinforcementTracker:
    def __init__(self, db_path="reinforcement.json"):
        self.db_path = db_path
        self.strength = self.load()

    def load(self):
        try:
            with open(self.db_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            return {}

    def reinforce(self, topic):
        self.strength[topic] = self.strength.get(topic, 0) + 1
        self.save()

    def get_strength(self, topic):
        return self.strength.get(topic, 0)

    def save(self):
        with open(self.db_path, 'w', encoding='utf-8') as f:
            json.dump(self.strength, f, indent=4)
