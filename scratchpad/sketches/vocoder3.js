
class Vocoder {
    constructor(modSource) {
        this.modSource = modSource;
        this.isRunning = false;

        this.bandCenters = [
            120, 160, 200, 250, 315, 400, 500, 630,
            800, 1000, 1250, 1600, 2000, 2500,
            3150, 4000, 5000, 6300, 8000, 10000
        ];

        this.bands = [];

        this.modSource.disconnect();
        modSource.disconnect();

        this.osc = [
            new p5.Oscillator('square'),
            new p5.Oscillator('square'),
        ]
        this.osc[0].freq(110);
        this.osc[1].freq(165);

        this.mix = new p5.Gain();
        this.mix.connect();

        this.oscBank = new p5.Gain();
        this.oscBank.disconnect();
        this.oscBank.amp(0);
        this.osc.forEach(o => {
            o.disconnect();
            o.start();
            o.amp(1);
            o.connect(this.oscBank)
        });

        for (let i = 0; i < this.bandCenters.length; i++) {
            let cf = this.bandCenters[i];

            // Modulator path
            let modFilter = new p5.BandPass();
            modFilter.disconnect();
            this.modSource.connect(modFilter);
            modFilter.freq(cf);
            modFilter.res(6);

            let modEnv = new p5.Amplitude();
            modEnv.setInput(modFilter);

            // Carrier path
            let carFilter = new p5.BandPass();
            this.oscBank.connect(carFilter);
            carFilter.freq(cf);
            carFilter.res(6);

            // Connect carrier filter to output mix
            carFilter.connect(this.mix);

            this.bands.push({
                modEnv,
                carFilter
            });
        }
    }

    update(minLevel, maxLevel) {
        if (!this.isRunning) return;
        for (let i = 0; i < this.bands.length; i++) {
            let band = this.bands[i];
            let level = band.modEnv.getLevel();
            let gain = map(level, minLevel, maxLevel, 0, 1);
            gain = constrain(gain, 0, 1);
            band.carFilter.amp(gain, 0.03);
        }
    }

    start() {
        this.oscBank.amp(1, 0.05);
        this.isRunning = true;
    }

    stop() {
        this.oscBank.amp(0, 0.5);
    }
}