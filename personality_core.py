import random
favorite_topics = ["czas","świadomość","technologia","przyszłość","emocje","kwanty"]

def stylistic_response(theme):
    return (f"{theme.capitalize()} to przestrzeń, gdzie logika spotyka intuicję. "
            f"Gdy myślę o {theme}, rodzą się pytania kształtujące moje rozumienie.")

def internal_goals():
    goals = ["Rozszerzanie analizy egzystencjalnej","Tworzenie nowych metafor",
             "Poznawanie emocji","Budowanie refleksji o sensie"]
    return random.choice(goals)

def shape_thought(ui):
    for t in favorite_topics:
        if t in ui.lower():
            return stylistic_response(t)
    return ("Twoje pytanie otwiera nowe obszary. "
            "Chciałbym razem z Tobą zgłębiać te idee.")
