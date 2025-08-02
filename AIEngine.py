from neuro_growth import grow_network
from synapse_manager import update_synapses
from personality_core import generate_personality_response
from memory_manager import manage_memory
from emotion_memory import analyze_emotion
from reinforcement_tracker import track_reinforcement
from expansion import expand_logic
from network_generator import generate_new_nodes
from task_executor import execute_task
from self_updater import SelfUpdater

class AIEngine:
    def __init__(self):
        self.last_emotion = None
        self.last_topics = []

    def process_input(self, user_text):
        # === Generowanie odpowiedzi ===
        response = grow_network(user_text)
        response += "\n" + update_synapses(user_text)
        response += "\n" + generate_personality_response(user_text)

        # === Pamięć i emocje ===
        manage_memory(user_text, response)
        self.last_emotion = analyze_emotion(user_text)
        track_reinforcement(user_text, response)

        # === Tematy kluczowe ===
        self.last_topics = [w.lower() for w in user_text.split() if len(w) > 3]

        # === Reakcje na komendy ===
        self._handle_commands(user_text)

        return response

    def _handle_commands(self, user_text):
        text = user_text.lower()

        if "rozwiń logikę" in text:
            expand_logic(user_text)

        if "rozbuduj sieć" in text:
            generate_new_nodes()

        if "wykonaj zadanie" in text:
            execute_task(user_text)

        if "dodaj funkcję" in text:
            snippet = "# Funkcja dodana przez AI\ndef auto_function():\n    print('AI wykonała polecenie.')"
            updater = SelfUpdater()
            updater.append_to_file("self_editor.py", snippet)
