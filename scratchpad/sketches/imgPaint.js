let img;
let gfx;

let cat;
let dog;
let but;

function preload() {
    console.log('preload');
    cat = loadImage('media/cat.jpg');
    dog = loadImage('media/dog.jpg');
    but = loadImage('media/butterfly.jpg');
}

function setup() {
    createCanvas(400, 400);
    
    cat.resize(400, 400);
    dog.resize(400, 400);
    but.resize(400, 400);

    img = cat;

    gfx = createGraphics(400, 400);
    gfx.fill(255, 255, 255, 10);
    gfx.noStroke();
  
    background(220);

    let button1 = createButton('First Image');
    button1.position(0, 425);
    button1.mousePressed(() => {
        img = cat;
    });
    
    let button2 = createButton('Second Image');
    button2.position(100, 425);
    button2.mousePressed(() => {
        img = dog;
    });
    
    let button3 = createButton('Third Image');
    button3.position(215, 425);
    button3.mousePressed(() => {
        img = but;
    }); 
}

function draw() {
    if (mouseIsPressed) {
        for (let i = 0; i < 5; i++) {
            mask(gfx);
            image(gfx, 0, 0);
        }
    }
}

function mask(pg) {
    pg.drawingContext.globalCompositeOperation = 'source-over';
    pg.image(img, 0, 0)
    pg.drawingContext.globalCompositeOperation = 'destination-in';
    let randX = pg.random(-10, 10);
    let randY = pg.random(-10, 10);
    pg.circle(mouseX+randX, mouseY+randY, 75);
}