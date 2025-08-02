from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from controller import process_interaction
from neuro_growth import grow_network
from synapse_manager import update_synapses
from self_updater import SelfUpdater
from reinforcement_tracker import track_reinforcement
from task_executor import execute_task
from emotion_memory import analyze_emotion
from memory_manager import manage_memory
from personality_core import generate_personality_response
from expansion import expand_logic
from network_generator import generate_new_nodes

class ChatBox(BoxLayout):
    def send_message(self):
        user_text = self.ids.user_input.text.strip()
        if not user_text:
            return

        # === Krok 1: Generowanie odpowiedzi ===
        response = grow_network(user_text)
        response += "\n" + update_synapses(user_text)
        response += "\n" + generate_personality_response(user_text)

        # === Krok 2: Pamięć, emocje, wzmocnienia ===
        manage_memory(user_text, response)
        emotion = analyze_emotion(user_text)
        track_reinforcement(user_text, response)

        # === Krok 3: Reakcja na komendy specjalne ===
        if "rozwiń logikę" in user_text.lower():
            expand_logic(user_text)

        if "rozbuduj sieć" in user_text.lower():
            generate_new_nodes()

        if "wykonaj zadanie" in user_text.lower():
            execute_task(user_text)

        if "dodaj funkcję" in user_text.lower():
            snippet = "# Funkcja dodana przez AI\ndef auto_function():\n    print('AI wykonała polecenie.')"
            updater = SelfUpdater()
            updater.append_to_file("self_editor.py", snippet)

        # === Krok 4: Aktualizacja interfejsu ===
        self.ids.chat_log.text += f"\nUser: {user_text}\nAI:   {response}\n"
        self.ids.user_input.text = ""

class NeuroQuantumAIApp(App):
    def build(self):
        return ChatBox()

if __name__ == "__main__":
    NeuroQuantumAIApp().run()
