# Usage

After installing, run node example.js
Program searches for RuuviTag which has Nordic UART service enabled
and automatically connects to first RuuviTag it finds. 

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

# Dependencies
## NodeJS 
Update NodeJS to latest stable with instructions found at
https://askubuntu.com/questions/426750/how-can-i-update-my-nodejs-to-the-latest-version . i.e.
```
sudo npm cache clean -f
sudo npm install -g n
sudo n stable
sudo ln -sf /usr/local/n/versions/node/<VERSION>/bin/node /usr/bin/nodejs
```

This repository is tested on nodejs 8.4.0, check your version with `node --version`

## Noble
[Noble repositry](https://github.com/sandeepmistry/noble)

## iota.lib.js
Git submodule init & update

## ruuvi.endpoints.js
Git submodule init & update

## ble-uart
[ble-uart examples](https://github.com/tigoe/BluetoothLE-Examples)
Install Noble->Readserial

## Sleep
sudo npm -g install sleep

## ccurl
Install ccurl according to instructions published on (NPM)[https://www.npmjs.com/package/ccurl.interface.js#https://github.com/iotaledger/ccurl].
For your convenience binaries are provided for Raspberry Pi and 64-bit debian.

# Licensing
 * Ruuvi / Ojousima: BSD-3
 * iota libs: MIT
 * BLE-UART: Unknown, please refer to [source](https://github.com/tigoe/BluetoothLE-Examples/issues/7)
 * Noble: MIT 

