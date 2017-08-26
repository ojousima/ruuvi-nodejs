# Usage

After installing, run node example.js
Program searches for RuuviTag which has Nordic UART service enabled

After connection, a non-sense message is sent to TEMPERATURE enpoint, RuuviTag will reply with unknown-message.
If RuuviTag sends a MAM message, MAM message is parsed and printed on console. 
MAM message parsing requres MAM-js libraries which aren't published yet.

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

# Licensing
 * Ruuvi / Ojousima: BSD-3
 * iota libs: MIT
 * BLE-UART: Unknown, please refer to [source](https://github.com/tigoe/BluetoothLE-Examples/issues/7)
 * Noble: MIT 

