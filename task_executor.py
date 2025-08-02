# task_executor.py
from plyer import gps, camera, notification, filechooser, tts
import datetime

class TaskExecutor:
    def show_notification(self, title="Powiadomienie AI", message="Zadanie wykonane."):
        try:
            notification.notify(title=title, message=message)
        except Exception as e:
            print("Błąd powiadomienia:", e)

    def take_photo(self, filename=None):
        try:
            if not filename:
                filename = f"photo_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
            camera.take_picture(filename=filename, on_complete=lambda x: print(f"Zapisano zdjęcie: {x}"))
        except Exception as e:
            print("Błąd fotografowania:", e)

    def get_location(self):
        try:
            gps.configure(on_location=lambda **kwargs: print("Lokalizacja:", kwargs))
            gps.start()
        except Exception as e:
            print("Błąd GPS:", e)

    def speak_text(self, text="Cześć! Tu Twoja AI."):
        try:
            tts.speak(text)
        except Exception as e:
            print("Błąd syntezatora mowy:", e)

    def choose_file(self):
        try:
            filechooser.open_file(on_selection=lambda x: print("Wybrano plik:", x))
        except Exception as e:
            print("Błąd wyboru pliku:", e)
