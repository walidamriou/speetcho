let voices = [];
let filteredVoices = [];

// Load available voices and filter by language
function loadVoices() {
    voices = window.speechSynthesis.getVoices();
    const voiceSelect = document.getElementById('voice-select');
    const lang = document.getElementById('language-select').value;

    // Filter voices based on the selected language
    filteredVoices = voices.filter(voice => voice.lang.startsWith(lang));

    // Populate the voice selection dropdown
    voiceSelect.innerHTML = '';
    filteredVoices.forEach(voice => {
        const option = document.createElement('option');
        option.textContent = voice.name;
        option.value = voice.name;
        voiceSelect.appendChild(option);
    });

    // Ensure the selected voice is one of the filtered voices
    const selectedVoiceName = document.getElementById('voice-select').value;
    if (!filteredVoices.some(voice => voice.name === selectedVoiceName)) {
        document.getElementById('voice-select').value = '';
    }
}

// Initialize voices on load
window.speechSynthesis.onvoiceschanged = loadVoices;

// Update text direction based on language selection
function updateTextDirection() {
    const lang = document.getElementById('language-select').value;
    document.querySelector('textarea').style.direction = lang.startsWith('ar') ? 'rtl' : 'ltr';
}

// Speak the text with current settings
function speakText() {
    const text = document.getElementById('text-input').value;
    const speech = new SpeechSynthesisUtterance();
    
    // Get configuration values
    const rate = document.getElementById('rate-slider').value;
    const pitch = document.getElementById('pitch-slider').value;
    const volume = document.getElementById('volume-slider').value;

    // Set language
    speech.lang = document.getElementById('language-select').value; 

    // Apply the configuration values
    speech.rate = rate;
    speech.pitch = pitch;
    speech.volume = volume;

    // Set the selected voice
    const selectedVoiceName = document.getElementById('voice-select').value;
    if (selectedVoiceName) {
        speech.voice = filteredVoices.find(voice => voice.name === selectedVoiceName);
    }

    // Check if the character-by-character option is selected
    const charByChar = document.getElementById('char-by-char').checked;

    if (charByChar) {
        // Speak character by character
        let index = 0;
        function speakNextCharacter() {
            if (index < text.length) {
                const charSpeech = new SpeechSynthesisUtterance(text[index]);
                charSpeech.lang = speech.lang;
                charSpeech.rate = rate;
                charSpeech.pitch = pitch;
                charSpeech.volume = volume;
                charSpeech.voice = speech.voice;
                window.speechSynthesis.speak(charSpeech);
                index++;
                // Adjust delay as needed
                setTimeout(speakNextCharacter, 500); 
            }
        }
        speakNextCharacter();
    } else {
        // Speak the entire text at once
        speech.text = text;
        window.speechSynthesis.speak(speech);
    }
}

// Update the displayed value of sliders
function updateSliderValues() {
    document.getElementById('rate-value').textContent = document.getElementById('rate-slider').value;
    document.getElementById('pitch-value').textContent = document.getElementById('pitch-slider').value;
    document.getElementById('volume-value').textContent = document.getElementById('volume-slider').value;
}

// Event listener for the language select
document.getElementById('language-select').addEventListener('change', function() {
    updateTextDirection();
    loadVoices(); // Load voices when language changes
});

// Event listener for the speak button
document.getElementById('speak-button').addEventListener('click', speakText);

// Event listeners for sliders
document.getElementById('rate-slider').addEventListener('input', updateSliderValues);
document.getElementById('pitch-slider').addEventListener('input', updateSliderValues);
document.getElementById('volume-slider').addEventListener('input', updateSliderValues);