const util = require('util');
const setImmediatePromise = util.promisify(setImmediate);
var BleUart = require('./ble-uart');
var dataHandler = require('./ruuvi.endpoints.js/index.js')
var tryteConverter = require('./iota.lib.js/lib/utils/asciiToTrytes.js')
var MAM = require('./iota-mam/mam')
var sleep = require('sleep');
var stdin = process.openStdin();
var singleShotTemperature = new Uint8Array([0x31,0x10,0x01,251,251,252,252,1,0,2,0]);
var continuousTemperature = new Uint8Array([0x31,0x10,0x01,1,251,252,252,1,0,2,0]);
var continuousAcceleration= new Uint8Array([0x40,0x60,0x01,10,251,10,252,1,0,2,0]);
var queryTemperature      = new Uint8Array([0x31,0x10,0x05,0,0,0,0,0,0,0,0]);
var queryMAM              = new Uint8Array([0xE0,0x10,0x05,0,0,0,0,0,0,0,0]);  //XXX PoC for hackathon, only destination matters    

const IOTA = require('iota.lib.js');
const CCurl = require('ccurl.interface.js');
const {
    promisify
} = require('util');

// not really used as we don't do any TX with value changes.
const MWM = 15;
let seed = 'YOUR SEED HERE';
let targetAddress = 'NAUU9SMZRLVWDJKUVYVND9S9GTKPDOHQHXTLMQTPTIQOBT9VILIDFGBWZVTLAGUWJWSIXPVIIECDBJPFBDUGAGGYXX';
let targetTag = 'ALL9THE9TAGGING9YOULL9NEED9';


// construct iota.lib.js instance
let iota = new IOTA({
    'host': 'http://service.iotasupport.com',
    'port': 14265
});

const PCCurl = promisify(CCurl);
const PprepareTransfers = promisify(iota.api.prepareTransfers);
const PgetTransactionsToApprove = async depth => {
    return new Promise((resolve, reject) => {
        iota.api.getTransactionsToApprove(depth, function(err, suc) {
            if (err != undefined) {
                reject(err);
            } else {
                resolve(suc);
            }
        });
    });
};

const PbroadcastTransactions = async trytes => {
  return new Promise((resolve, reject) => {
    iota.api.broadcastTransactions(trytes, function(err, suc) {
      if (err != undefined) {
        reject(err);
      } else {
        resolve(suc);
      }
    });
  });
};

var localAttachToTangle = function(trunkTransaction, branchTransaction, minWeightMagnitude, trytes, callback) {
    console.log("Light Wallet: localAttachToTangle");
    //ccurl(trunkTransaction, branchTransaction, trytes, minWeightMagnitude, [, path], callback)
    CCurl(trunkTransaction, branchTransaction, minWeightMagnitude, trytes, function(error, success) {
        console.log("Light Wallet: ccurl.ccurlHashing finished:");
        if (error) {
            //console.log(error);
        } else {
            //console.log(success);
        }
        if (callback) {
            return callback(error, success);
        } else {
            return success;
        }
    })
}

var localInterruptAttachingToTangle = function(callback) {
    console.log("Light Wallet: localInterruptAttachingToTangle");

    CCurl.ccurlInterrupt(CCurl.ccurlProvider);

    if (callback) {
      return callback();
    }
}

iota.api.attachToTangle = localAttachToTangle;
iota.api.interruptAttachingToTangle = localInterruptAttachingToTangle;

    //
    //  Makes a new transfer for the specified seed
    //  Includes message and value
    //
function sendTransfer(address, value, messageTrytes) {
        var transfer = [{
            'address': address,
            'value': parseInt(value),
            'message': messageTrytes
        }]
        console.log("Sending Transfer", transfer);
        // We send the transfer from this seed, with depth 4 and minWeightMagnitude 18
        iota.api.sendTransfer(seed, 4, MWM, transfer, function(e) {
            if (e){
            //console.log("error in transfer: " + e)
            } else {
            console.log("Transfer ok")
            }
        })
}

https://stackoverflow.com/questions/6965107/converting-between-strings-and-arraybuffers
function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}



// use a predefined UART service (nordic, redbear, laird, bluegiga)
var bleSerial = new BleUart('nordic');
var reconnTimer = null;
function reConn() {
  console.log("Connection failed. Retrying");
  bleSerial.peripheral.disconnect();
  bleSerial.scan('poweredOn');
}



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
  //console.log("Got new data: " + data);
  let message = dataHandler(data);
  if (message.ready){
    let res = (ab2str(message.binary)).split('\n');
    //console.log(res[0]);
    //console.log(res[1]);
    //if(message.type === "MAM")
    //{
      let trytes = MAM.mam_parse(res[0], res[1], 1).split('\n');
    //}
    //console.log(trytes);
    let ascii = tryteConverter.fromTrytes(trytes[0]);
    console.log("Got: " + ascii);

    sendTransfer(targetAddress, parseInt(ascii), res[0]);
  }
});

// this function gets called when the program
// establishes a connection with the remote BLE radio:
bleSerial.on('connected', function(data){
  console.log("Connected to BLE. Sending a hello message");  
  clearTimeout(reconnTimer);
  reconnTimer = null;
  timerExample();
  //bleSerial.write("Hello BLE!");
  //bleSerial.write([1,2,3,4,5]);
  

  //bleSerial.write(new Buffer([6,7,8,9]))
});

bleSerial.on('preparing', function(){
   if(reconnTimer == null){
   console.log("setting up retry timer");
   reconnTimer = setTimeout(reConn, 5000);
   }
});


// thus function gets called if the radio successfully starts scanning:
bleSerial.on('scanning', function(status){
  console.log("radio status: " + status);
})

async function timerExample() {
  //console.log('Before I/O callbacks');
  await setImmediatePromise();
  console.log('Connection ready.');
  console.log('1) singleshot 2) continous 3) query. 4) Get MAM data 5) Get acceleration data');
  iota.api.getNodeInfo(function(error, success) {
    if (error) {
        //console.error(error);
    } else {
        //console.log(success);
    }
})
  //bleSerial.write(new Uint8Array([0x31,0x10,0x01,251,251,252,252,1,0,2,0]));
  //sleep.sleep(5);
  //bleSerial.write(new Uint8Array([0x31,0x10,0x05,0,0,0,0,0,0,0,0]));  
}

stdin.on('data', function(chunk) {
  if(chunk == '1\n')
  {
     console.log("Single shot"); 
     bleSerial.write(singleShotTemperature);
  }
  if(chunk == '2\n')
  {
    console.log("Continous measurement");   
    bleSerial.write(continuousTemperature);
  }
  if(chunk == '3\n')
  {
    console.log("Query data"); 
    bleSerial.write(queryTemperature);
  }
  if(chunk == '4\n')
  {
    console.log("Asking for MAM"); 
    bleSerial.write(queryMAM);
  }
  if(chunk == '5\n')
  {
    console.log("Asking for acceleration"); 
    bleSerial.write(continuousAcceleration);
  }
  }
);

