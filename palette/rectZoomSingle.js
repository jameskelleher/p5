let growthRate = 0.5;
let numRects = 10;

let rects = [];
let colorIxOffset = 0;

function setup() {
    createCanvas(400, 500);

    colorMode(HSB);
    rectMode(CENTER);
    noStroke();

    myColorsHSB = colorsHSB.map(c => color(c[0], c[1], c[2]));

    for (let i = 0; i < numRects; i++) {
        let scale = (numRects - i - 1) / numRects;
        rects.push(new Rect(i % myColorsHSB.length, scale));
    }

    background(myColorsHSB[myColorsHSB.length - 1]);
}

function draw() {
    translate(width / 2, height / 2);

    rects.forEach(r => r.drawMe());

    if (rects[0].scale >= 1) {
        rects.forEach(r => r.resetScale());
    }
}

class Rect {
    constructor(colorIx, baseScale) {
        this.colorIx = colorIx;

        this.baseScale = baseScale;
        this.scale = this.baseScale;
    }
    
    hello() {
        console.log("hello from Rect " + this.colorIx);
    }

    drawMe() {
        let c = myColorsHSB[this.colorIx];
        fill(c);
        rect(0, 0, width * this.scale, height * this.scale);
        this.scale += (growthRate / 1000);
    }

    resetScale() {
        this.scale = this.baseScale;
        this.colorIx = (this.colorIx + 1) % myColorsHSB.length;
    }
}

// Save a 5-second gif when the user presses the 's' key.
function keyPressed() {
  if (key === 's') {
    saveGif('mySketch', 10);
  }
}