from gtts import gTTS
from pydub import AudioSegment

# Generate mp3 from text
tts = gTTS("My name is Ravi Kumar. I am 43 years old. I am suffering from fever and body pain. I prefer doctor Mehta.")
tts.save("sample.mp3")

# Convert mp3 to proper PCM WAV
sound = AudioSegment.from_mp3("sample.mp3")
sound.export("sample2.wav", format="wav", codec="pcm_s16le")  # PCM encoded WAV
