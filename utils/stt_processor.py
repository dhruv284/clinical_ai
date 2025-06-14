import speech_recognition as sr
import re

def transcribe_audio(audio_file_path: str):
    recognizer = sr.Recognizer()
    try:
        with sr.AudioFile(audio_file_path) as source:
            audio_data = recognizer.record(source)
            text = recognizer.recognize_google(audio_data)  # free but internet required
            return text
    except sr.UnknownValueError:
        return "Could not understand audio"
    except sr.RequestError as e:
        return f"Request failed: {e}"

def simulate_stt(audio_file_path: str):
    raw_text = transcribe_audio(audio_file_path)

    # Extract structured data using regex
    name_match = re.search(r"my name is ([a-zA-Z ]+)", raw_text, re.IGNORECASE)
    age_match = re.search(r"i am (\d+) years old", raw_text, re.IGNORECASE)
    symptoms_match = re.search(r"suffering from (.+)", raw_text, re.IGNORECASE)

    return {
        "patient_name": name_match.group(1).strip() if name_match else "Unknown",
        "age": int(age_match.group(1)) if age_match else 0,
        "symptoms": symptoms_match.group(1).strip() if symptoms_match else "Not mentioned",
        "preferred_doctor": "Not specified"  # Set to default since no extraction
    }
