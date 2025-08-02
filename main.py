from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from controller import process_interaction
from neuro_growth import grow_network
from synapse_manager import update_synapses
from self_updater import SelfUpdater
from reinforcement_tracker import track_reinforcement
from task_engine import execute_task  # Zakładam, że masz moduł do zadań
import re

class ChatBox(BoxLayout):
    def send_message(self):
        user_text = self.ids.user_input.text.strip()
        if not user_text:
            return

        # === Krok 1: AI tworzy odpowiedź i uczy się ===
        response = grow_network(user_text)
        response += "\n" + update_synapses(user_text)

        # === Krok 2: Wyświetlamy komunikację w GUI ===
        self.ids.chat_log.text += f"\nUser: {user_text}\nAI:   {response}\n"
        self.ids.user_input.text = ""

        # === Krok 3: Tematy i analiza treści ===
        topics = [w.lower() for w in user_text.split() if len(w) > 3]

        # === Krok 4: Logika decyzyjna ===
        process_interaction(user_text, response, topics)

        # === Krok 5: Wykonanie zadań zleconych przez użytkownika ===
        task_match = re.search(r"(wykonaj|zrób|utwórz|dodaj|zmodyfikuj)\s(.+)", user_text.lower())
        if task_match:
            task_description = task_match.group(2)
            execute_task(task_description)  # AI próbuje wykonać konkretne zadanie

        # === Krok 6: Samoaktualizacja — dodawanie kodu jeśli użytkownik tego chce ===
        if "dodaj funkcję" in user_text.lower():
            updater = SelfUpdater()
            snippet = "# === Funkcja wygenerowana przez AI ===\n" \
                      "def auto_generated_function():\n" \
                      "    print('Nowa funkcja została dodana!')"
            updater.append_to_file("self_editor.py", snippet)

        # === Krok 7: Wzmocnienie zachowań i analiza emocji ===
        track_reinforcement(user_text, response)

class NeuroQuantumAIApp(App):
    def build(self):
        return ChatBox()

if __name__ == "__main__":
    NeuroQuantumAIApp().run()
