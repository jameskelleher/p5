let scaleFactor = 30;
let scaleOffset = 0.9;

let quads = [];
let rotatedQuads = [];

let lerpTracker = 0;
let lerpRate = -0.015;

let bands = 6;

let h = 1;
let w = 3;

function setup() {
    createCanvas(800, 500);
    colorMode(HSB);
    noStroke();

    myColorsHSB = colorsHSB.map(c => color(c[0], c[1], c[2]));
    background(myColorsHSB[1]);
    myColorsHSB.splice(1, 1);

    for (let y = 0; y <= height/scaleFactor; y += h) {
        for (let x = y; x <= width/scaleFactor; x += (w-h)) {
            quads.push(new Quad(x, y));
        }
    }

    for (let y = 0; y <= width/scaleFactor; y += h) {
        for (let x = y; x <= height/scaleFactor; x += (w-h)) {
            rotatedQuads.push(new Quad(x, y));
        }
    }
}

function draw() {

    scale(scaleFactor);
    quads.forEach(quad => quad.draw(this));

    rotate(-PI / 2);
    scale(-1, 1);

    rotatedQuads.forEach(quad => quad.draw(this));

    lerpTracker += lerpRate;

}


class Quad {
    constructor(x, y) {
        // position
        this.x = x;
        this.y = y;

        // initial gradient of each trapezoid
        this.gradInter = map(x+y, 0, (width+height)/scaleFactor, 0, bands);

        // is this piece along the edge, or somewhere x == y?
        let isEdgePiece = this.x == 0 || this.y == 0 || this.x == this.y;
        if (isEdgePiece) {
            this.c1 = myColorsHSB[2];
            this.c2 = myColorsHSB[2];
        } else {
            this.c1 = myColorsHSB[0];
            this.c2 = myColorsHSB[1];
        }
    }

    draw(p) {
        p.push();
            
        p.translate(this.x, this.y);
        p.scale(0.9);

        // the internal Math.abs reverses the direction of the gradient "wave"
        let inter = Math.abs(Math.abs(this.gradInter + lerpTracker) % 2 - 1);
        let c = lerpColor(this.c1, this.c2, inter);
        p.fill(c)

        p.quad(0, 0, w - h, 0, w, h, h, h);

        p.pop();
    }
}

function keyPressed() {
  if (key === 's') {
    saveGif('traps', 10);
  }
}
