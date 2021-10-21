(function(){
    
    const modelParams = {
        flipHorizontal: true,
        imageScaleFactor: 0.7,
        maxNumBoxes: 20,
        iouThresold: 0.5,
        scoreThresold: 0.79
    }

    navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia

    const video = document.querySelector('#video')
    const audio = document.querySelector('#audio')
    let model;

    const play_audio = (type) => {
        if(type === 'hurt') {
            audio.src = './audio/hurt-' + tirage(1, 3) + '.mp3'
        } else if(type === 'bubble') {
            audio.src = './audio/bubble.mp3'
        }
        audio.play()
    }

    handTrack.startVideo(video)
    .then(status => {
        if(status) {
            navigator.getUserMedia(
                { video : {} },
                stream => {
                    setInterval(runDetection, 100)
                },
                err => console.err(err)
            )
        }
    })

    const stuff_bar = document.querySelector('.stuff-bar')

    const generate_stuffbar = () => {
        for(let i=0; i<8; i++) {
            stuff_bar.innerHTML += '<div class="square"><img src="" alt=""/><p></p></div>'
        }
    }

    generate_stuffbar()

    const array_stuff = {}

    const add_stuff = (mob) => {
        array_stuff[mob] == null ? array_stuff[mob] = 1 : array_stuff[mob] = array_stuff[mob]+1
        let i=0
        play_audio('bubble')
        for(const [key, value] of Object.entries(array_stuff)) {
            i++
            const current_square = stuff_bar.querySelector('.square:nth-child('+i+')')
            current_square.querySelector('img').src = './' + key + '.png'
            current_square.querySelector('p').textContent = 'x' + value
        }
    }

    const cursor = document.querySelector('.wrapper .cursor');
    const grid = document.querySelector('.grid')

    const hit = () => {
        const mob_active = grid.querySelector('.mob.active')
        const pos_active = mob_active.getBoundingClientRect()
        const pos_sword = cursor.getBoundingClientRect()
        if(
            pos_sword.left + 75 > pos_active.left && pos_sword.left + 75 < pos_active.right &&
            pos_sword.top + 75 > pos_active.top && pos_sword.top + 75 < pos_active.bottom
        ) {
            add_stuff(mob_active.dataset.mob)
            play_audio('hurt')
            playATurn()
        }
    }

    const reset_mob = () => {
        for(let mob of document.querySelectorAll('.mob')) {
            mob.classList.remove('active')
        }
    }

    const playATurn = () => {
        reset_mob()
        grid.querySelector('.area:nth-child('+tirage(1, 6)+') .mob').classList.add('active')
    }
    
    let win_width = window.innerWidth
    let ht_max_x = 550
    let ht_max_y = 430

    function runDetection() {
        model.detect(video)
            .then(predictions => {
                if(predictions.length !== 0) {

                    if(predictions[1].label == 'face') {

                    } else {

                        let hand1 = predictions[1].bbox;
                        let x = hand1[0]
                        let y = hand1[1]
    
                        if(predictions[1].label == 'closed') {
                            cursor.classList.add('closed')
                            hit()
                        } else cursor.classList.remove('closed')

                        cursor.style.left = `${x / ht_max_x * 100}%`
                        cursor.style.top = `${y / ht_max_y * 100}%`

                    }
                    
                }
            })
    }

    const tirage = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    playATurn()

    handTrack.load(modelParams).then(lmodel => {
        model = lmodel
    })

    let audio_started = false;

    const notes = {
        'c2': 65.41,
        'c#2': 65.41,
        'd2': 73.42,
        'd#2': 77.78,
        'e2': 82.41,
        'f2': 87.31,
        'f#2': 92.50,
        'g2': 98.00,
        'g#2': 103.83,
        'a2': 110.00,
        'a#2': 116.54,
        'a2': 123.47,
        'b2': 123.47,
        'c3': 130.81,
        'c#3': 138.59,
        'd3': 146.83,
        'd#3': 155.56,
        'e3': 164.81,
        'f3': 174.61,
        'f#3': 185.00,
        'g3': 196.00,
        'g#3': 207.65,
        'a3': 220.00,
        'a#3': 233.08,
        'b3': 246.94
    }
    
    const gestion_audio = () => {
        
        if(audio_started) return false

        audio_started = true

        const BaseAudioContext = window.AudioContext || window.webkitAudioContext
        const context = new BaseAudioContext()

        const oscillator = context.createOscillator()
        oscillator.type = 'triangle'
        
        oscillator.frequency.value = notes['a#3']
        oscillator.frequency.setValueAtTime(notes['g#3'], 1.5)
        oscillator.frequency.setValueAtTime(notes['d#3'], 2.25)
        oscillator.frequency.setValueAtTime(notes['f#3'], 3.5)
        oscillator.frequency.setValueAtTime(notes['a#3'], 5)
        oscillator.frequency.setValueAtTime(notes['g#3'], 6.5)
        oscillator.frequency.setValueAtTime(notes['d#3'], 7)
        oscillator.frequency.setValueAtTime(notes['c#3'], 8.5)

        const amp = context.createGain()
        amp.gain.setValueAtTime(0.15, context.currentTime)
        oscillator.connect(amp).connect(context.destination)

        oscillator.connect(context.destination)
        oscillator.start()

        setTimeout(() => {
            oscillator.stop()
        }, 10000)

    }

    document.querySelector('.menu .start').addEventListener('click', function() {
        gestion_audio()
        document.querySelector('.wrapper-menu').style.display = 'none'
    })

})();
