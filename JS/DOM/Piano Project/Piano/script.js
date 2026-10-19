const whiteKeys = [
    // --- Octave 3 (White Keys - QWERTY main row, shifted left) ---
    { "note": "C", "octave": 3, "midi": 48, "isAccidental": false, "type": "white", "keyboard": "z", "sample": "Dusty Keys Sample Pack/448546__tedagame__c3.wav" },
    { "note": "D", "octave": 3, "midi": 50, "isAccidental": false, "type": "white", "keyboard": "x", "sample": "Dusty Keys Sample Pack/448608__tedagame__d3.wav" },
    { "note": "E", "octave": 3, "midi": 52, "isAccidental": false, "type": "white", "keyboard": "c", "sample": "Dusty Keys Sample Pack/448614__tedagame__e3.wav" },
    { "note": "F", "octave": 3, "midi": 53, "isAccidental": false, "type": "white", "keyboard": "v", "sample": "Dusty Keys Sample Pack/448589__tedagame__f3.wav" },
    { "note": "G", "octave": 3, "midi": 55, "isAccidental": false, "type": "white", "keyboard": "b", "sample": "Dusty Keys Sample Pack/448559__tedagame__g3.wav" },
    { "note": "A", "octave": 3, "midi": 57, "isAccidental": false, "type": "white", "keyboard": "n", "sample": "Dusty Keys Sample Pack/448562__tedagame__a3.wav" },
    { "note": "B", "octave": 3, "midi": 59, "isAccidental": false, "type": "white", "keyboard": "m", "sample": "Dusty Keys Sample Pack/448568__tedagame__b3.wav" },

    // --- Octave 4 (White Keys - QWERTY main row, from "A" key onwards) ---
    { "note": "C", "octave": 4, "midi": 60, "isAccidental": false, "type": "white", "keyboard": "a", "sample": "Dusty Keys Sample Pack/448549__tedagame__c4.wav" },
    { "note": "D", "octave": 4, "midi": 62, "isAccidental": false, "type": "white", "keyboard": "s", "sample": "Dusty Keys Sample Pack/448609__tedagame__d4.wav" },
    { "note": "E", "octave": 4, "midi": 64, "isAccidental": false, "type": "white", "keyboard": "d", "sample": "Dusty Keys Sample Pack/448613__tedagame__e4.wav" },
    { "note": "F", "octave": 4, "midi": 65, "isAccidental": false, "type": "white", "keyboard": "f", "sample": "Dusty Keys Sample Pack/448595__tedagame__f4.wav" },
    { "note": "G", "octave": 4, "midi": 67, "isAccidental": false, "type": "white", "keyboard": "g", "sample": "Dusty Keys Sample Pack/448552__tedagame__g4.wav" },
    { "note": "A", "octave": 4, "midi": 69, "isAccidental": false, "type": "white", "keyboard": "h", "sample": "Dusty Keys Sample Pack/448561__tedagame__a4.wav" },
    { "note": "B", "octave": 4, "midi": 71, "isAccidental": false, "type": "white", "keyboard": "j", "sample": "Dusty Keys Sample Pack/448536__tedagame__b4.wav" }
];

const blackKeys = [
    // --- Octave 3 (Black Keys) ---
    // C#3 between C3(48) and D3(50)
    { "note": "C#", "octave": 3, "midi": 49, "isAccidental": true, "type": "black", "keyboard": "1", "offset": 0.5, "sample": "Dusty Keys Sample Pack/448538__tedagame__c3.wav" },
    // D#3 between D3(50) and E3(52)
    { "note": "D#", "octave": 3, "midi": 51, "isAccidental": true, "type": "black", "keyboard": "2", "offset": 0.5, "sample": "Dusty Keys Sample Pack/448601__tedagame__d3.wav" },
    // F#3 between F3(53) and G3(55)
    { "note": "F#", "octave": 3, "midi": 54, "isAccidental": true, "type": "black", "keyboard": "3", "offset": 0.5, "sample": "Dusty Keys Sample Pack/448584__tedagame__f3.wav" },
    // G#3 between G3(55) and A3(57)
    { "note": "G#", "octave": 3, "midi": 56, "isAccidental": true, "type": "black", "keyboard": "4", "offset": 0.5, "sample": "Dusty Keys Sample Pack/448593__tedagame__g3.wav" },
    // A#3 between A3(57) and B3(59)
    { "note": "A#", "octave": 3, "midi": 58, "isAccidental": true, "type": "black", "keyboard": "5", "offset": 0.5, "sample": "Dusty Keys Sample Pack/448570__tedagame__a3.wav" },

    // --- Octave 4 (Black Keys) ---
    // C#4 between C4(60) and D4(62)
    { "note": "C#", "octave": 4, "midi": 61, "isAccidental": true, "type": "black", "keyboard": "6", "offset": 0.5, "sample": "Dusty Keys Sample Pack/448539__tedagame__c4.wav" },
    // D#4 between D4(62) and E4(64)
    { "note": "D#", "octave": 4, "midi": 63, "isAccidental": true, "type": "black", "keyboard": "7", "offset": 0.5, "sample": "Dusty Keys Sample Pack/448602__tedagame__d4.wav" },
    // F#4 between F4(65) and G4(67)
    { "note": "F#", "octave": 4, "midi": 66, "isAccidental": true, "type": "black", "keyboard": "8", "offset": 0.5, "sample": "Dusty Keys Sample Pack/448585__tedagame__f4.wav" },
    // G#4 between G4(67) and A4(69)
    { "note": "G#", "octave": 4, "midi": 68, "isAccidental": true, "type": "black", "keyboard": "9", "offset": 0.5, "sample": "Dusty Keys Sample Pack/448592__tedagame__g4.wav" },
    // A#4 between A4(69) and B4(71)
    { "note": "A#", "octave": 4, "midi": 70, "isAccidental": true, "type": "black", "keyboard": "0", "offset": 0.5, "sample": "Dusty Keys Sample Pack/448577__tedagame__a4.wav" }
];

let alpha = new Audio('Dusty Keys Sample Pack/448536__tedagame__b4.wav')

let BlackKeysArray = [

];

let keyBox = document.querySelector('.lower');


whiteKeys.forEach((key) => {
    let WhiteKey = document.createElement('div');

    WhiteKey.classList.add('key-class');
    WhiteKey.classList.add('WhiteKeyalpha');
    keyBox.appendChild(WhiteKey);

    WhiteKey.innerHTML = `${key.keyboard}`

    WhiteKey.addEventListener('click',() =>{
        let alpha = new Audio(`${key.sample}`);
        alpha.play();
    })
});
let whiteKeyEls = document.querySelectorAll('.WhiteKeyalpha');

const midiToWhiteEl = {};
whiteKeyEls.forEach((el, idx) => {
    midiToWhiteEl[whiteKeys[idx].midi] = el;
});

blackKeys.forEach((key, idx) => {
    let BlackKey = document.createElement('div');
    BlackKeysArray[idx] = BlackKey;
    BlackKey.classList.add('Black-key-class');
    BlackKey.innerHTML = `${key.note}`
    BlackKey.style.position = 'absolute';
    BlackKey.style.top = '0';

    
    keyBox.appendChild(BlackKey);

    
    let prevWhiteMidi = key.midi - 1;
    let prevEl = midiToWhiteEl[prevWhiteMidi];

    
    if (!prevEl) prevEl = whiteKeyEls[0];

    let whiteKeyWidth = whiteKeyEls[0].clientWidth;
    const centerX = prevEl.offsetLeft + whiteKeyWidth;
    const leftPx = Math.round(centerX - (BlackKey.clientWidth / 2));
    BlackKey.style.left = `${leftPx}px`;

    BlackKey.addEventListener('click',() =>{
        let alpha = new Audio(`${key.sample}`);
        alpha.play();
    })
});

addEventListener('keydown', (elem) => {
    whiteKeys.forEach((key) => {
        if(key.keyboard == elem.key){
            let alpha = new Audio(`${key.sample}`);
            alpha.play();
           
        }
    })
    blackKeys.forEach((key) => {
        if(key.keyboard == elem.key){
            let alpha = new Audio(`${key.sample}`);
            alpha.play();
        }
    })

})


