## TP-Link-Smart-Bulb-Web-Interface

A simple Web interface to control TP Link Smart bulbs.

Uses Konsumer's [tplink-lightbulb API](https://github.com/konsumer/tplink-lightbulb)

First you will need to set the bulbs IP address in the server.js, You can find this using your router or the scan command on Konsumer's tplink-lightbulb API.

Then simply run the server.js using``` node server.js ```and go to localhost in your browser.

This has been tested using an LB130 but should work for any of the bulbs listed in Konsumer's README.