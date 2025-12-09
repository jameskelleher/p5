let carFft, modFft, osc, oscBank, mix, mic, octaveBands, room, roomAmp, roomFft;
let filters = [];

let bandCenters = [
   120, 160, 200, 250, 315, 400, 500, 630, 
   800, 1000, 1250, 1600, 2000, 2500, 
   3150, 4000, 5000, 6300, 8000, 10000
];
let bands = [];

function preload() {
    // room = loadSound('media/room.m4a');
    room = loadSound('media/buttadog.mp3');
}

function setup() {
    let cnv = createCanvas(400, 400);
    cnv.mousePressed(startVocoder);

    osc = [
        new p5.Oscillator('square'),
        new p5.Oscillator('square'),
        new p5.Oscillator('square'),
    ]
    osc[0].freq(110);
    osc[1].freq(440);
    osc[2].freq(880);

    // mic = new p5.AudioIn();
    // mic.start();

    mix = new p5.Gain();
    mix.connect();


    
    // modFft.setInput(mic);

    oscBank = new p5.Gain();
    oscBank.disconnect();
    oscBank.amp(0);
    osc.forEach(o => {
        o.disconnect();
        o.start();
        o.amp(1);
        o.connect(oscBank)
    });
    // oscBank.setInput(osc);

    room.disconnect();
    room.loop();


    for (let i =0; i < bandCenters.length; i++) {
        let cf = bandCenters[i];

        // Modulator path
        let modFilter = new p5.BandPass();
        modFilter.disconnect();
        room.connect(modFilter);
        modFilter.freq(cf);
        modFilter.res(6);

        let modEnv = new p5.Amplitude();
        modEnv.setInput(modFilter);
        
        // Carrier path
        let carFilter = new p5.BandPass();
        oscBank.connect(carFilter);
        carFilter.freq(cf);
        carFilter.res(6);

        // Output
        carFilter.connect(mix);

        bands.push({
            modEnv,
            carFilter
        });
    }

}

function draw() {
    background(220);

    for (let i = 0; i < bands.length; i++) {
        let band = bands[i];
        let level = band.modEnv.getLevel();
        // let gain = map(level, 0, 0.03, 0, 1);
        let gain = map(level, 0.01, 0.03, 0, 1);
        console.log(gain);
        gain = constrain(gain, 0, 1);
        band.carFilter.amp(gain, 0.03);
    }
}

function startVocoder() {
    oscBank.amp(1);
}

function mouseReleased() {
    oscBank.amp(0, 0.2);
}