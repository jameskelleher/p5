let playVocoder = false;

function preload() {
    modSource = loadSound('media/buttadog.mp3');
}

function setup() {
    let cnv = createCanvas(400, 400);
    cnv.mousePressed(() => {
        setupVocoder();
        startVocoder();
        playVocoder = true;
    })

}

function draw() {
    background(220);
    if (playVocoder) {
        updateVocoder(0.01, 0.03);
    }
}