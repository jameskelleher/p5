let g1, g2, inter;

function setup() {
  createCanvas(400, 400);
  // g1 = createGraphics(width, height);
  g2 = createGraphics(width, height);
  inter = createGraphics(width, height);
}

function draw() {
  background(220);

  // clear buffers
  // g1.clear();
  g2.clear();
  inter.clear();

  // draw shapes into their buffers (white on transparent)
  // g1.noStroke(); g1.fill(255); g1.ellipse(200, 200, 200, 200);
  g2.noStroke(); g2.fill(255); g2.rect(mouseX - 50, mouseY - 50, 100, 100);

  // create intersection in `inter` using canvas compositing
  inter.noStroke();
  inter.fill(255);
  inter.ellipse(200, 200, 200, 200);          // destination (ellipse)
  inter.drawingContext.globalCompositeOperation = 'source-in';
  inter.image(g2, 0, 0);                      // draw g2 as source -> leaves only overlap
  inter.drawingContext.globalCompositeOperation = 'source-over'; // reset
  inter.stroke(0);
  inter.noFill();
  inter.ellipse(200, 200, 200, 200);

  // draw outlines for context
  fill(0, 0, 255); stroke(0); 
  ellipse(200, 200, 200, 200);
  fill(0, 255, 0);
  rect(mouseX - 50, mouseY - 50, 100, 100);

  // draw intersection tinted red
  tint(255, 255, 0);
  image(inter, 0, 0);
  noTint();

  fill(255);
  square(10, 10, 30);
}
