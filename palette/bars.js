let doShuffle = true;
let myColorsHSB;  // default, will be replaced in setup.
// let colorsHSB = [[236, 86, 92], [0, 0, 100], [48, 86, 92], [120, 86, 92], [192, 86, 92]];
// myColorsHSB = [colorsHSB[0], colorsHSB[3], colorsHSB[1], colorsHSB[2]]; // reorder to get better gradient

function setup() {
    createCanvas(400, 500);
    colorMode(HSB);

    myColorsHSB = colorsHSB.map(c => color(c[0], c[1], c[2]));

    noStroke();
    if (doShuffle) myColorsHSB = shuffle(myColorsHSB.slice());
}

function draw() {
    let barH = height / myColorsHSB.length;
    
    background(220);

    for (let i = 0; i < myColorsHSB.length; i++) {
        let c = myColorsHSB[i];
        fill(c);
        rect(0, i*barH, width, barH);
    }
}

function shuffle(array) {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        let randomIndex = floor(random(currentIndex));
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}