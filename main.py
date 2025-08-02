# main.py
from kivy.app       import App
from kivy.uix.boxlayout import BoxLayout
from controller      import process_interaction
from neuro_growth    import grow_network
from synapse_manager import update_synapses

class ChatBox(BoxLayout):
    def send_message(self):
        user_text = self.ids.user_input.text.strip()
        if not user_text:
            return

        # 1. Generujemy odpowiedź AI (stara logika)
        response = grow_network(user_text)
        response += "\n" + update_synapses(user_text)

        # 2. Wyświetlamy w GUI
        self.ids.chat_log.text += f"\nUser: {user_text}\nAI:   {response}\n"
        self.ids.user_input.text = ""

        # 3. Wyodrębniamy kluczowe tematy
        topics = [w.lower() for w in user_text.split() if len(w) > 3]

        # 4. Uruchamiamy nowy kontroler z logiką decyzyjną
        process_interaction(user_text, response, topics)

class NeuroQuantumAIApp(App):
    def build(self):
        return ChatBox()

if __name__ == "__main__":
    NeuroQuantumAIApp().run()
