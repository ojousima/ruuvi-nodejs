var BleUart = require('./ble-uart');
var dataHandler = require('./ruuvi.endpoints.js/index.js')
var tryteConverter = require('./iota.lib.js/lib/utils/asciiToTrytes.js')
var MAM = require('./iota-mam/mam')
var sleep = require('sleep');

https://stackoverflow.com/questions/6965107/converting-between-strings-and-arraybuffers
function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}

// use a predefined UART service (nordic, redbear, laird, bluegiga)
var bleSerial = new BleUart('nordic');

// optionally define a custom service
// var uart = {
//   serviceUUID: '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
//   txUUID: '6e400002-b5a3-f393-e0a9-e50e24dcca9e',
//   rxUUID: '6e400003-b5a3-f393-e0a9-e50e24dcca9e'
// }
// var bleSerial = new BleUart('foo', uart);

// this function gets called when new data is received from
// the Bluetooth LE serial service:
bleSerial.on('data', function(data){
  console.log("Got new data: " + data);
  let message = dataHandler(data);
  if (message.ready){
    let res = (ab2str(message.binary)).split('\n');
    console.log(res[0]);
    console.log(res[1]);
    //if(message.type === "MAM")
    //{
      let trytes = MAM.mam_parse(res[0], res[1], 1).split('\n');
    //}
    console.log(trytes);
    let ascii = tryteConverter.fromTrytes(trytes[0]);
    console.log(ascii);
  }
});

// this function gets called when the program
// establishes a connection with the remote BLE radio:
bleSerial.on('connected', function(data){
  console.log("Connected to BLE. Sending a hello message");  
  //bleSerial.write("Hello BLE!");
  //bleSerial.write([1,2,3,4,5]);
  bleSerial.write(new Uint8Array([0x31,0x10,0x01,251,251,252,252,1,0,3,0]));
  sleep.sleep(5);
  bleSerial.write(new Uint8Array([0x31,0x10,0x05,0,0,0,0,0,0,0,0]));

  //bleSerial.write(new Buffer([6,7,8,9]))
});

// thus function gets called if the radio successfully starts scanning:
bleSerial.on('scanning', function(status){
  console.log("radio status: " + status);
})
