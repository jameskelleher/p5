let osc, oscBank, mix, mic;

var modSource;
let filters = [];

let bandCenters = [
   120, 160, 200, 250, 315, 400, 500, 630, 
   800, 1000, 1250, 1600, 2000, 2500, 
   3150, 4000, 5000, 6300, 8000, 10000
];
let bands = [];

function setupVocoder() {
    console.log("setting up");
    osc = [
        new p5.Oscillator('square'),
        new p5.Oscillator('square'),
        new p5.Oscillator('square'),
    ]
    osc[0].freq(110);
    osc[1].freq(165);
    osc[2].freq(220);

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

    modSource.disconnect();
    modSource.loop();


    for (let i = 0; i < bandCenters.length; i++) {
        let cf = bandCenters[i];

        // Modulator path
        let modFilter = new p5.BandPass();
        modFilter.disconnect();
        modSource.connect(modFilter);
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

function updateVocoder(minLevel, maxLevel) {
    lvl = 0;
    for (let i = 0; i < bands.length; i++) {
        let band = bands[i];
        let level = band.modEnv.getLevel();
        lvl = max(level, lvl);
        let gain = map(level, minLevel, maxLevel, 0, 1);
        gain = constrain(gain, 0, 1);
        band.carFilter.amp(gain, 0.03);
    }
    // console.log(lvl);
}

function startVocoder() {
    console.log("starting")
    oscBank.amp(1);
}

// function mouseReleased() {
//     oscBank.amp(0, 0.2);
// }