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
var queryTemperature      = new Uint8Array([0x31,0x10,0x05,0,0,0,0,0,0,0,0]);
var queryMAM              = new Uint8Array([0xE0,0x10,0x05,0,0,0,0,0,0,0,0]);  //XXX PoC for hackathon, only destination matters    

const IOTA = require('iota.lib.js');
const CCurl = require('ccurl.interface.js');
const {
    promisify
} = require('util');

// not really used as we don't do any TX with value changes.
const MWM = 15;
let seed = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ9ABCDEFGHIJKLMNOPQRSTUVWXYZ9ABCDEFGHIJKLMNOPQRSTUVWXYZ9';
let targetAddress = '99999999999999999999999999999999999999999999999999999999999999999RUUVI9LOVES9IOTA';
let targetTag = 'ALL9THE9TAGGING9YOULL9NEED9';
let message = 'HSVKSZBJFAI9OUUXZSAYVPHENMYSMDOTXSVUISVGWN9DVUBYTNXCFQK9AAAWHFIBHLPRHXIXPX9HUCRUCILCKVZGYBOJEHGJFA9YFGIHNS99ILCOOKWV9FVLGVKCMPVPDZFXTKOBGVKXVTDLOVYCEYTTGRXVWBVFKFXHWQGQSQNESOEAMSSVBCOQVCWKEHHONFQKIBEHXYBNYIYBBXFZNBLGVHXPJTPSRB9FSVGBNVHADGGLKLIIARULVV9ALN99QTS9JUGTTFCNCXEGUZIUFWMXGYVK9YDKFVXMHDRNHRINXKKCIELUAGIDFUIANFNMSZQJGDYDZDQDURRLXHLYCDLFBRZYTQDJZUVAWXKWHGJHDUHETGNDSP9ABBIU9PAGZMLJKNCXTCZSQJXRBCEJ9PQPFLYKLUMEUGNOOTUFLABBBAPEWTWKTAMLMARRLSYRCWSYZRITTRLLLBP9XTRCFMJYYIZSZEVSXTVBFLAOENMPPKWZOUEBIORBVIWXVCTNKRYJMAXTKKMUR9IJDWEVHUBUJMQZIMAFSGZAIGHWHMOOLLINHNVJSIAEDUAO9ZZRABQ9AFRMEE9GLXHSMZIVZIZSSPHTYDKBFAMCWOPOEMFBJOJBPOVQCMUFPXHKQKQXPJKDTK9SK9LNGWYHCEZTBZWQDRCS9XKYHNXWSPHLEQSP9EODYIVQUJROCJWCPVDYJLZUGENRCUGKCLKALLQNGEVCGGNYZKHSZXADXABVRKJBGLHE9KRBSHODGRWQEGJZDL9OTITSAOUJSOGQYJRNIBCYWVZQTPAKULCGTYYHFPNHANGUR9IFY9SOKLMFWYZFEWZOEUXSU9JLXNWZ9ZPOGBQVWRBUQZVOAADABGWYLGSVIKEJBVARTCOUDOBFBFHSY9WNRYBHLGCAQKNZQNDYQMKOGECWIUVWIZ9ON9VFCLMODZELBZQGHLHWZRMDZXROMRWVAXUKCKVFU9AVTLKROICXLDBSPLCJGMXXTXTWLNIBQEQXWTNLABO9EWESSKZCAEQONSABZOCQJOYANPRVXBVYYUUNWAEHGRITYVZPDEMPQKRIRBQMHYHWXQXTXIUFPRJJRIORNUPFIIKVM9QOQVTLGXIRATSYXELMUAJNLLPMPCVSGJEEONRROUWWBBXC9XIHCOOMHYJHPYVXBRKAWB9KNZDUS9HEFLFSSWPPMFKROKJTXVFFLYJZRSJLCHYCDPEPNHDP9TBZGOPRKDLTNZRALWLIWKH9MSRVIFWLTDMNICQRW9HIQPQBG9WZZLCDOZYIDUSEIPEUGJ9ARCVNQZFVQRRUVPMQYQELADHDQFMBTRXDARMGHOQIJMGKJKGNMZAIGCTIP9VWLVOQVZHWDCOXOWLJHWKMELANENMMLYKL9Y9CI9QAOHHJSZBLAAIOPGQVPXLH9AZUUIWSMMNORKBNDSJVBCQLNMQN9E9QKAWIQUCFTVUEJKQKYDFXJZXGKQJXFD9XZUZZDSNVGJBYXCSWHDDDFIEHUXW9F9XQMOV9TVAPYHPLRNOBNWSIPJ9OLFZTAQEHXVAOYOVPBHYTMRNKVHDFZPAFRJEBZUXDPKSKJCBKLRYEWQUJSDJWEX9UJRRFHKE9AHBBNTTFIIIBHRFJVOMOEGB9VWZED9WADAPKFEAFVV99CAHRXD9RXRJDAULFRTKJLLTB9KRLCOM99BTBKDXMXRJOZSYXLSXDQQDEZ9NPCBJDVHARHHJCPGZTMJAV9PJSAEX9YILZBKUVAVNGFRWETNNFMRJYFXSOAOT9KDXTHAWABGZLWYLZVGABLSWUQGLAVWOFUAVQNAGLQWLGXCUSYXTWWCFWDHERSNXGFHKOEXWMBXBYASSBZGNVBOOPAWYBLDQMBXVBVARTDQPYCZLKWIVVJFLVINRDIIKLGEDWSLMOVLSYGDWZIAYRUPKJATMWBTJUADLJUJXI9XVXF9VXWGIIMEIESHZSCGUNAZBJFUXYJQ9KMBZVGJCOWOXGMTA9V9HI9FXILRKYQIFIGAGGCMYAQU9WKIHSOKKRFMWQZBGHHX9UARCSZJGLNGNMRNVBYMGXVRCSLRKMBWIWJVVWAHKAFQPJWOOMKQDOIKONZXKPZ9FXPNZUVT9ZVIQCBRECOQRZJPPYWQAPEWNVMSS9BPPOXCSOZFGP9NNRLQWEJWBKRXRDJAUGUCLZIVYYIPEH9YHR9VGNLFLTJQVYWXHVFKFFPANVMMKNUNUUFDLAVPQNNSGFGKID9CUQVMWWPBAWN9SPSTFDGUSYSCWTNCMNVPPJFITVKTAIQNHWPOKXCTJGTMPPFFBUIQIHPSOYPPZXLUKKCSGFQLRJLR9GOZIALKBIJOLTKDOTBHUSGMYM9WRPBUK9GIIJKWNTJLPDAXZYCKGLCRLRSVHTYYJNHOQEUVRFDRNJISJEEPAJANACSFPDOHGVNCSSGXAAHS9CYDYQBZOQZCFDOHBFDEVGAIF';

// sample MAM payload.

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
    console.log(res[0]);
    console.log(res[1]);
    //if(message.type === "MAM")
    //{
      let trytes = MAM.mam_parse(res[0], res[1], 1).split('\n');
    //}
    console.log(trytes);
    let ascii = tryteConverter.fromTrytes(trytes[0]);
    console.log(ascii);

    PprepareTransfers(seed, [{
        address: targetAddress,
        value: 0,
        message: res[0],
        tag: targetTag
    }]).then(transactions => {
        return PgetTransactionsToApprove(5).then(toApprove => {
            return PCCurl(toApprove.trunkTransaction, toApprove.branchTransaction, MWM, transactions);
        });
    }).then(bundle => PbroadcastTransactions(bundle))
    .then(ret => console.log(ret));

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
  console.log('1) singleshot 2) continous 3) query. 4) Get MAM data');
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
  }
);

