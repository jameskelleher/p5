const serial = new p5.WebSerial();

let indata;
let portButton = null;

let btn;

function setup() {
    createCanvas(400, 300);

    setupSerial();

    // btn = creaeButton("a");
    // btn.html("tb");

    
}

function draw() {
    background(220);
}

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
  if (inData) console.log(inData);
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
  portButton.html("choose port");
  portButton.mousePressed(choosePort);
}