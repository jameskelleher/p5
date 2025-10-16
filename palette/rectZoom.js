let growthRate = 2;
let numRects = 8;
let numCols = 4;
let numRows = 3;
let setRandIx = true;

let zones = [];
let colorIxOffset = 0;

function setup() {
    createCanvas(600, 300);
	
    background(220);

    colorMode(HSB);
    rectMode(CENTER);
    noStroke();
	
    myColorsHSB = colorsHSB.map(c => color(c[0], c[1], c[2]));
    

    for (let x = 0; x < numCols; x++) {
        for (let y = 0; y < numRows; y++) {
            let zoneRects = [];

            let colorIx = setRandIx ? floor(random(myColorsHSB.length)) : 0;

            let zoneW = width / numCols;
            let zoneH = height / numRows;

            let rectX = x / numCols * width + zoneW / 2;
            let rectY = y / numRows * height + zoneH / 2;

            for (let i = 0; i < numRects; i++) {
                let baseScale = (numRects - i - 1) / numRects;
                zoneRects.push(new Rect(rectX, rectY, (i + colorIx) % myColorsHSB.length, baseScale));
            }

            zones.push(zoneRects);

            let startColorIx = colorIx - 1;
            if (startColorIx == -1) startColorIx = myColorsHSB.length - 1;
            let startColor = myColorsHSB[startColorIx]
            fill(startColor);
            rect(rectX, rectY, width / numCols, height / numRows);
        }
    }
}


function draw() {
    zones.forEach(zone => zone.forEach(r => r.drawMe()));

    if (zones[0][0].scale >= 1) {
        zones.forEach(zone => zone.forEach(r => r.resetScale()));
    }
}

class Rect {
    constructor(x, y, colorIx, baseScale) {
        this.x = x;
        this.y = y;

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
        rect(this.x, this.y, width * this.scale / numCols, height * this.scale / numRows);
        this.scale += (growthRate / 1000);
    }

    resetScale() {
        this.scale = this.baseScale;
        // change to the next color in the array
        this.colorIx = (this.colorIx + 1) % myColorsHSB.length;
    }
}

function keyPressed() {
  if (key === 's') {
    saveGif('mySketch', 10);
  }
}