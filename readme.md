#Usage

After installing, run node example.js
Program searches for RuuviTag which has Nordic UART service enabled

After connection, a non-sense message is sent to TEMPERATURE enpoint, RuuviTag will reply with unknown-message.
If RuuviTag sends a MAM message, MAM message is parsed and printed on console. 
MAM message parsing requres MAM-js libraries which aren't published yet.

# Dependencies
## Noble
[https://github.com/sandeepmistry/noble]

## iota.lib.js
Git submodule, init & update

#ruuvi.endpoints.js
Git submodule, init & update

## ble-uart
[https://github.com/tigoe/BluetoothLE-Examples]
Install Noble->Readserial

#Licensing
Ruuvi / Ojousima: BSD-3
iota libs: MIT
BLE-UART: Unknown, please refer to [https://github.com/tigoe/BluetoothLE-Examples/issues/7]
Noble: MIT 

