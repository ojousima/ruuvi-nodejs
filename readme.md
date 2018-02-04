# NOTICE
As of right now, changes in FFI interface prevent ccurl.interface.js from compiling in NodeJS 9+
Please use NodeJS 8.9.4

# Usage
Program searches for RuuviTag which has Nordic UART service enabled
and automatically connects to first RuuviTag it finds.
Please update the RuuviTag with [MAM-firmware](https://lab.ruuvi.com/distribution-packages/frankfurt_demo_dfu.zip).

Sometimes there is issue with Bluetooth stack, and you'll need to run
`sudo hciconfig hci0 reset`. Replace the HCI interface number if applicable. 

A simple command line interface is given. 
User is given option to setup temperature sensor for a single-shot measurement,
continous measurement (once per second) and querying temperature in plain text.
User can also send a MAM query, which will trigger reading environmental data 
and soon the environmental data is sent from RuuviTag with MAM coding. 

The example program publishes MAM data to tangle to fixed address defined in example.js.

You can observe the state of RuuviTag by RED LED, if the led is on or blinking there is activity
going on.

After installing, run node example.js

# Dependencies
## NodeJS, npm 
NOTE: This modifies your global NodeJS and NPM versions.
Update NodeJS to 8.9.4 with instructions found at
https://askubuntu.com/questions/426750/how-can-i-update-my-nodejs-to-the-latest-version . i.e.
```
sudo npm cache clean -f
sudo npm install -g n
sudo n 8.9.4
sudo ln -sf /usr/local/n/versions/node/8.9.4/bin/node /usr/bin/node
curl -0 -L https://npmjs.com/install.sh | sudo sh
```

This repository is tested on nodejs 8.9.4, check your version with `node --version`

## Noble
[Noble repositry](https://github.com/sandeepmistry/noble)
`npm install noble`
`sudo setcap cap_net_raw+eip $(eval readlink -f \`which node\`)`

## iota.lib.js, ruuvi.endpoints.js ccurl.interface.js
`git submodule update --init --recursive`
`npm install iota.lib.js`
`npm install ccurl.interface.js`
mv 

## ble-uart
[ble-uart examples](https://github.com/tigoe/BluetoothLE-Examples)
Install Noble->Readserial

## Sleep
npm install sleep

## ccurl
Install ccurl according to instructions published on [NPM](https://www.npmjs.com/package/ccurl.interface.js#https://github.com/iotaledger/ccurl).
For your convenience binaries are provided for Raspberry Pi and 64-bit debian.

# Licensing
 * Ruuvi / Ojousima: BSD-3
 * iota libs: MIT
 * BLE-UART: Unknown, please refer to [source](https://github.com/tigoe/BluetoothLE-Examples/issues/7)
 * Noble: MIT 

