from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from AIEngine import AIEngine  # Centralny mózg AI

class ChatBox(BoxLayout):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.engine = AIEngine()  # Inicjalizacja silnika AI

    def send_message(self):
        user_text = self.ids.user_input.text.strip()
        if not user_text:
            return

        # === Przetwarzanie wiadomości przez AIEngine ===
        response = self.engine.process_input(user_text)

        # === Aktualizacja interfejsu ===
        self.ids.chat_log.text += f"\nUser: {user_text}\nAI:   {response}\n"
        self.ids.user_input.text = ""

class NeuroQuantumAIApp(App):
    def build(self):
        return ChatBox()

if __name__ == "__main__":
    NeuroQuantumAIApp().run()
