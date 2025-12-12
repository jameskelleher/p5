const serial = new p5.WebSerial();

let indata;
let portButton = null;

let btn;

let inputs = [];

let currentValues = "";

function setup() {
  createCanvas(400, 300);

  setupSerial();

  let btnLabels = ["hfSpeed", "lfSpeed", "freqOne", "freqTwo", "ampOne", "ampTwo"];
  for (let i = 0; i < 6; i++) {
    let btnLabel = btnLabels[i];
    let y = portButton.y + portButton.height + 20 + 30 * i;

    let input = createInput();
    input.position(10, y);
    input.size(70, input.height);
    inputs.push(input);

    let btn = createButton(btnLabel);
    btn.position(input.x + input.width + 15, y + 4);

    function submit() {
      let val = input.value();
      if (!isFinite(+val)) { console.log(`invalid data: ${val}`); return; }

      serial.print(i);
      serial.println(val);
    }

    input.changed(submit);
    btn.mousePressed(submit);
  }
}

function draw() {
  background(220);

  if (currentValues) {
    textSize(24);
    stroke("black");
    strokeWeight(3);
    let split = currentValues.trim().split('\n');
    let rows = currentValues.split('\n').slice(1, split.length);
    for (let r = 0; r < rows.length; r++) {
      let cols = rows[r].split(', ');
      for (let c = 0; c < cols.length; c++) {
        let elem = cols[c];
        if (!elem) continue;
        let val = elem.split(": ")[1];
        let colorCode = val.slice(0, val.indexOf('m') + 1);
        let color = ansi24ToRgb(colorCode);
        let reading = val.slice(colorCode.length, val.indexOf('\x1B', colorCode.length));
        fill(color.r, color.g, color.b);
        text(reading, 200 + 60 * c, 80 + 40 * r);
      }
    }
  }
}

function processInData() {
  console.log(inData);
  if (inData.startsWith("currentValues")) currentValues = inData;
}

function ansi24ToRgb(ansi) {
  const match = ansi.match(/\x1b\[\d+;2;(\d+);(\d+);(\d+)m/);
  if (!match) return null;
  return {
    r: Number(match[1]),
    g: Number(match[2]),
    b: Number(match[3]),
  };
}

/*

  SERIAL BOILERPLATE

*/

function setupSerial() {
  // check to see if serial is available
  if (!navigator.serial) {
    alert("WebSerial is not supported in this browser. Try Chrome or MS Edge.");
  }

  // if serial is available, add connect/disconnect listeners:
  navigator.serial.addEventListener("connect", portConnect);
  navigator.serial.addEventListener("disconnect", portDisconnect);
  // check for any ports that are available:
  serial.getPorts();
  // if there's no port chosen, choose one:
  makePortButton();
  // serial.on("noport", makePortButton);
  // open whatever port is available:
  serial.on("portavailable", openPort);
  // handle serial errors:
  serial.on("requesterror", portError);
  // handle any incoming serial data:
  serial.on("data", serialEvent);
  serial.on("close", makePortButton);
}


// if there's no port selected,
// make a port select button appear:
function makePortButton() {
  // create and position a port chooser button:
  if (!portButton) portButton = createButton("choose port");
  portButton.position(10, 10);
  // give the port button a mousepressed handler:
  portButton.mousePressed(choosePort);
}

// make the port selector window appear:
function choosePort() {
  if (portButton) portButton.show();
  serial.requestPort();
}

// open the selected port, and make the port
// button invisible:
function openPort() {
  // wait fo the serial.open promise to return,
  // then call the initiateSerial function
  serial.open().then(initiateSerial);

  // once the port opens, let the user know:
  function initiateSerial() {
    console.log("port open");
  }

  // hide the port button once a port is chosen:
  //   if (portButton) portButton.hide();
  if (portButton) {
    portButton.html("close port");
    portButton.mousePressed(closePort);
  }
}

// pop up an alert if there's a port error:
function portError(err) {
  alert("Serial port error: " + err);
}

// read any incoming data as a string
// (assumes a newline at the end of it):
function serialEvent() {
  //   inData = Number(serial.read());
  //   console.log(inData);
  // read a byte from the serial port, convert it to a number:
  inData = serial.readLine();
  if (inData) processInData();
}

// try to connect if a new serial port
// gets added (i.e. plugged in via USB)
function portConnect() {
  console.log("port connected");
  serial.getPorts();
}

// try to connect if a new serial port 
// gets added (i.e. plugged in via USB):
function portDisconnect() {
  serial.close();
  console.log("port disconnected");
}

function closePort() {
  serial.close();
  console.log("port closed");
  portButton.html("choose port");
  portButton.mousePressed(choosePort);
}