import speech_recognition as sr
import re
import os
from pydub import AudioSegment

def convert_to_wav_pydub(input_path: str, output_path: str = "converted_temp.wav") -> str:
    audio = AudioSegment.from_file(input_path)
    audio = audio.set_frame_rate(16000).set_channels(1).set_sample_width(2)  # 16-bit PCM
    audio.export(output_path, format="wav")
    return output_path

def transcribe_audio(audio_file_path: str) -> str:
    recognizer = sr.Recognizer()
    
    # Convert to proper WAV if needed
    if not audio_file_path.lower().endswith(".wav"):
        converted_path = convert_to_wav_pydub(audio_file_path)  # ✅ FIXED HERE
        delete_after_use = True
    else:
        converted_path = convert_to_wav_pydub(audio_file_path)  # Even if WAV, reconvert to ensure PCM format
        delete_after_use = True

    try:
        with sr.AudioFile(converted_path) as source:
            audio_data = recognizer.record(source)
            text = recognizer.recognize_google(audio_data)
            print("✅ Transcribed Text:", text)
            return text
    except sr.UnknownValueError:
        print("⚠️ Could not understand audio")
        return "Could not understand audio"
    except sr.RequestError as e:
        print("❌ API Request Error:", e)
        return f"Request failed: {e}"
    finally:
        if delete_after_use and os.path.exists(converted_path):
            try:
                os.remove(converted_path)
            except PermissionError:
                print("⚠️ Warning: File could not be deleted, still in use.")

def simulate_stt(audio_file_path: str) -> dict:
    raw_text = transcribe_audio(audio_file_path)

    # Extract structured data using regex
    name_match = re.search(r"my name is ([a-zA-Z ]+?)(?= i am| and|,|\.|$)", raw_text, re.IGNORECASE)
    age_match = re.search(r"i am (\d+) years old", raw_text, re.IGNORECASE)
    symptoms_match = re.search(r"suffering from (.+)", raw_text, re.IGNORECASE)

    return {
        "patient_name": name_match.group(1).strip() if name_match else "Unknown",
        "age": int(age_match.group(1)) if age_match else 0,
        "symptoms": symptoms_match.group(1).strip() if symptoms_match else "Not mentioned",
        "preferred_doctor": "Not specified"
    }
