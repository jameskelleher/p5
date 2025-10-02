let scaleFactor = 30;
let scaleOffset = 0.9;

let gradSpeed = 0.00;

let quads = [];
let rotatedQuads = [];

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

    // push()

    rotate(-PI / 2);
    scale(-1, 1);

    rotatedQuads.forEach(quad => quad.draw(this));

    // pop()
}

function drawTrap(p, x, y, c) {
    p.push();
            
    p.translate(x, y);
    p.scale(0.7);
    p.fill(c)
    p.quad(0, 0, w - h, 0, w, h, h, h);

    p.pop();
}

function grad(c1, c2, x, y) {
    let inter = map(scaleFactor * (x+y), 0, width+height, 0, 1);
    return lerpColor(c1, c2, inter);
}

class Quad {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.gradInter = Math.random();
        this.gradSpeed = Math.random() * gradSpeed * 2 - gradSpeed;

        let isEdgePiece = this.x == this.y || this.x == 0 || this.y == 0;
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

        let c = lerpColor(this.c1, this.c2, this.gradInter);
        p.fill(c)

        p.quad(0, 0, w - h, 0, w, h, h, h);

        p.pop();

        this.gradInter += this.gradSpeed;
        if (this.gradInter <= 0 || this.gradInter >= 1) this.gradSpeed = -this.gradSpeed;
    }
}

function keyPressed() {
  if (key === 's') {
    saveGif('trapsRandom', 5);
  }
}