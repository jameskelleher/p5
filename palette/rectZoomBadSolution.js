let scaleFactor = 0;
let growthRate = 2;
let numRects = 20;
let colorIxOffset = 0;

let rects = []

function setup() {
    createCanvas(400, 500);

    colorMode(HSB);
    rectMode(CENTER);
    noStroke();

    myColorsHSB = colorsHSB.map(c => color(c[0], c[1], c[2]));

    // you only need double numRects if you're putting the origin in the corner
    for (let i = 0; i < numRects; i++) {
        let baseZoom = (numRects - i - 1) / numRects;
        rects.push(new Rect(i, baseZoom));
    }

    background(myColorsHSB[myColorsHSB.length - 1]);
}

function draw() {
    translate(width/2, height/2);
    // translate(mouseX, mouseY);

    rects.forEach(r => r.draw());

    scaleFactor += growthRate;

    if (scaleW((numRects - 1) / numRects) >= width / numRects) {
        console.log("reset");
        scaleFactor = 0;
        rects.forEach(r => r.incrIx());
    }

}

function scaleW(w) {
    return w + (width * (scaleFactor / 1000));
}

function scaleH(h) {
    return h + (height * (scaleFactor / 1000));
}

class Rect {
    constructor(colorIx, baseZoom) {
        this.colorIx = colorIx;
        this.baseZoom = baseZoom;
    }

    hello() {
        console.log("hello from Rect " + this.colorIx);
    }

    draw() {
        let c = myColorsHSB[(this.colorIx + colorIxOffset) % myColorsHSB.length];
        fill(c);
        rect(0, 0, scaleW(width * this.baseZoom), scaleH(height * this.baseZoom));
    }

    incrIx() {
        this.colorIx++;
        console.log("incrIx " + this.colorIx);
    }
}