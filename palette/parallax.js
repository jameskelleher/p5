let src;

let shapes = [];
let backgroundColor;
let myColorsHSB = [];

function setup() {
    createCanvas(400, 500);

    colorMode(HSB);
    frameRate(60);
    
    myColorsHSB = colorsHSB.map(c => color(c[0], c[1], c[2]));
    backgroundColor = myColorsHSB[1];

    shapes.push(new Circle(200, 25, 1, 0.5, myColorsHSB[3], 50));
    shapes.push(new Circle(50, 10, 3.5, 1, myColorsHSB[0], 10));
    shapes.push(new Circle(100, 0, 2, 1.5, myColorsHSB[2], 10))

    for (let _ = 0; _ < 1000; _++) {
        draw();
    }
}

function draw() {
    background(backgroundColor);
    shapes.forEach(s => s.draw(this));

}

// Save a 10-second gif when the user presses the 's' key.
function keyPressed() {
  if (key === 's') {
    saveGif('mySketch', 10);
  }
}

class Circle {
    slideSpeed = 4;
    constructor(x, y, sideSpeed, downSpeed, c, d) {
        this.x = x;
        this.y = y;
        this.sideSpeed = sideSpeed;
        this.downSpeed = downSpeed;
        this.c = c;
        this.d = d;

        this.src = createGraphics(width, height+100);
        this.feedback = createGraphics(width, height+90);

        this.src.fill(this.c);
        this.src.noStroke();
    }

    draw(pg) {
        this.src.circle(this.x, this.y, this.d);
        this.feedback.image(this.src, 0, 0);

        this.src.clear();
        this.src.image(this.feedback, 0, this.downSpeed);

        pg.image(this.feedback, 0, -50);

        this.feedback.clear();

        let leftBound = this.x <= 0;
        let rightBound = this.x >= width;
        if (leftBound || rightBound) this.sideSpeed = -this.sideSpeed;
        this.x += this.sideSpeed;
    }
}