KEYS = ['czas','świadomość','technologia','emocje','lokalizacja']
def process_input_one(text):
    found = [k for k in KEYS if k in text.lower()]
    return found or ['ogólne']
