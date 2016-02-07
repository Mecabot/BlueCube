# BlueCube
BlueCube is a open source project designed to allow remote control of a [Freetronics 4x4x4 RGB LED Cube](http://www.freetronics.com.au/products/cube4-4x4x4-rgb-led-cube) via Bluetooth Low Energy (LE) from a compatible mobile (cell) phone using a [Adafruit BlueFruit LE UART Friend](https://www.adafruit.com/product/2479) module.

The project provides a sketch for running on the cube, and a [Ionic Framework](http://ionicframework.com) / [Cordova](https://cordova.apache.org) based app that can be run from either iOS or Android devices that support Bluetooth LE.

## How do I get started?
Please visit the [BlueCube website](http://neographophobic.github.io/BlueCube). It contains information on:-

* Parts required, and how to wire them together
* Downloading BlueCube and dependencies
* Installation
* Usage, including adding your own user defined patterns
* Tips for Troubleshooting, FAQs and Support infomation
* Acknowledgements

The website also outlines how to setup the development environment necessary to build and deploy your own version of the Ionic apps to your mobile devices.

## Repository Layout
The repository is split into two subdirectories "Arduino" and "IonicApp". 

Arduino holds the sketch ("Arduino" -> "BlueCube" -> "BlueCube.ino") and associated classes that are required for the sketch to compile and upload to the cube. There is also a fritzing wiring diagram, and a text file outlining the wiring.

IonicApp is the Ionic Framework based application. The code for the app lives in the "www" folder.
