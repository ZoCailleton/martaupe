(function(){

    const BaseAudioContext = window.AudioContext || window.webkitAudioContext
    const context = new BaseAudioContext()

    const frequencies = {
        'c3': 130.81,
        'd3': 146.83,
        'e3': 164.81,
        'f3': 174.61,
        'g3': 196,
        'a3': 220,
        'b3': 246.94,
        'c4': 261,
        'd4': 293,
        'e4': 329,
        'f4': 349,
        'g4': 392,
        'a4': 440,
        'b4': 493
    }

    let oscillator;

    const notePressed = note => {
        oscillator = context.createOscillator()
        oscillator.frequency.setValueAtTime(frequencies[note], 0)
        oscillator.connect(context.destination)
        oscillator.start(0)
        oscillator.type = waveform
    }

    const noteReleased = () => {
        oscillator.stop(0.5)
        delete oscillator;
    }

    const keyboard = document.querySelector('.keyboard')
    const base_touches = ['c', 'd', 'e', 'f', 'g', 'a', 'b']

    const createKeyboard = () => {
        for(let i=2; i<=4; i++) {
            for(let j=0; j<7; j++) {
                keyboard.innerHTML += `<div data-note="${base_touches[j]}${i}" class="touche">${base_touches[j]}${i}<img src="./evan.jpeg" alt=""/></div>`
            }
        }
    }

    createKeyboard()

    for(let touche of document.querySelectorAll('.touche')) {
        touche.addEventListener('mousedown', function(){
            this.classList.add('pressed')
            notePressed(this.dataset.note)
        });
        touche.addEventListener('mouseup', function(){
            this.classList.remove('pressed')
            noteReleased()
        });
    }

})();
