let x1 = 0;
let y1 = -40;
let w1 = 400;
let h1 = 500;

let x2 = 0;
let y2 = 0;
let w2 = 400;
let h2 = 400;

let angle = 0

let sketch2 = function (p) {
  p.setup = function () {
    p.createCanvas(400, 400);

    p.frameRate(0.9)
  }

  p.draw = function () {
    p.background(220);

    // // rectMode(CENTER)
    p.push()
    p.translate(200, 200);
    p.rotate(angle);

    angle = angle + 1

    p.scale(0.2);
    customArc(-p.PI / 2, p);

    p.pop()

    // ellipse(200, 200, 200, 20)
  }
}

function customArc(r, p) { // color amarillo
  // fill(244, 232, 193);
  //rect(x2, y2, w2, h2);
  p.noStroke();
  p.fill(160, 193, 185);

  p.push();

  // fill(250,0,0)

  // COLOR AZUL CLARO
  p.quad(130, 0, w1, 0, w1, 60, w1, 80);
  p.quad(130, w1, w1, w1, w1, 200, w1, 330);
  p.quad(220, 11, w1, 11, w1, 200, w1, 300);
  p.quad(w1, 150, 200, w1, w1, w1, w1, 300);
  p.pop();


  // COLOR AZUL OSCURO

  p.push();
  p.translate(p.width / 2, p.height / 2); // centers
  p.translate(-p.width / 8, 0); // translate a bit from the side
  p.rotate(r);
  p.fill(112, 160, 175);
  p.arc(x1, y1, w1, h1, 0, p.PI);
  p.pop();


  // CIRCULO AMARILLO
  p.push();

  p.translate(p.width / 2, p.height / 2); // centers
  p.translate(-p.width / 4, 0); // translate a bit from the side
  p.rotate(r);
  p.fill(244, 232, 193);
  p.arc(x2, y2, w2, h2, 0, p.PI); // CIRCULO AMARILLO
}

// END OF ONE TILE

function mousePressed() {
  print("x: ", mouseX, "y: ", mouseY);

}

let pyp5_2 = new p5(sketch2, "two");
