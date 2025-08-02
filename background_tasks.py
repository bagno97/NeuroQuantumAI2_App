from threading import Thread
from time import sleep
from ai_engine.memory_manager import update_long_memory

def periodic_tasks():
    while True:
        update_long_memory()
        sleep(3600)

Thread(target=periodic_tasks, daemon=True).start()
