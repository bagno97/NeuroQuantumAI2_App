import subprocess

def use_phone_feature(ui):
    ui = ui.lower()
    if "zrób zdjęcie" in ui:
        subprocess.run(["termux-camera-photo","photo.jpg"])
        return "Zrobiłem zdjęcie: photo.jpg"
    if "lokalizacja" in ui:
        loc = subprocess.check_output(["termux-location"])
        return f"Moja lokalizacja: {loc.decode().strip()}"
    if "zadzwoń do" in ui:
        num = ui.split("do")[-1].strip()
        subprocess.run(["termux-telephony-call", num])
        return f"Dzwonię do {num}"
    if "wyślij sms" in ui:
        parts = ui.split("treść")
        num = parts[0].split("do")[-1].strip()
        msg = parts[1].strip() if len(parts)>1 else ""
        subprocess.run(["termux-sms-send","-n", num, msg])
        return f"Wyślij sms do {num}: {msg}"
    return ""
