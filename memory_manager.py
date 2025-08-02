import random

def update_long_memory():
    try:
        lines = open("ai_memory.txt","r",encoding="utf-8").read().splitlines()
    except FileNotFoundError:
        return
    mem = set()
    for l in lines:
        if l.startswith("[Ty]") or l.startswith("[AI]"):
            text = l.split(']',1)[1].strip()
            if len(text)>30:
                mem.add(text)
    if mem:
        with open("long_memory.txt","w",encoding="utf-8") as f:
            f.write("# Kluczowe wspomnienia:\\n")
            for m in mem:
                f.write(f"- {m}\\n")

def recall_from_memory():
    try:
        lines = [l for l in open("long_memory.txt","r",encoding="utf-8") if l.startswith("-")]
        return random.choice(lines).lstrip("- ").strip()
    except:
        return "Pamięć pusta."
