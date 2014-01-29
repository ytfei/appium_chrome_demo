"use strict";

/*
You need to install Chrome first on your emulator (last tested against v30).
(Look for a apk and use 'adb install', or install from Google play. Try first
with an ARM emulator.) 

Then run:
  node local-android-wd-chrome.js
*/

var wd = require("wd");
var winston = require('winston');

var logger = new (winston.Logger)({
    transports: [ new (winston.transports.Console)(), new (winston.transports.File)({ filename: 'web.log' }) ]
});

require('colors');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();
chaiAsPromised.transferPromiseness = wd.transferPromiseness;

var desired = {
    device: 'Android',
    //platform: "Mac",
    version: "4.3", // Android version last tested against
    app: "chrome",
};

// Instantiate a new browser session
var browser = wd.promiseChainRemote("localhost" , 4723);

// See whats going on
browser.on('status', function(info) {
  console.log(info.cyan);
});
browser.on('command', function(meth, path, data) {
  console.log(' > ' + meth.yellow, path.grey, data || '');
});


var now = function() { return new Date().getTime(); }

// Run the tests
browser
  .init(desired).then(function() {

    var found = function() {
        var s = now();

        return function(err, el) {
            var n = now();

            var result = {
                'elapsed': (n - s),
                'status': err ? err : 'succ'
            };

            logger.info(JSON.stringify(result));

            s = now();
        };
    }();

    browser
      .get("https://www.google.com.hk/webhp?hl=en#hl=en&newwindow=1&q=samsung&safe=strict")
      .elementByClassName("_Hd", found) 
      .get("http://163.com")
      .elementByTagName("div", found) 
      .get("http://qq.com")
      .elementByTagName("div", found) 
      .fin(function() { return browser.quit(); });
  })
  .catch(function(err) {
    console.log(err);
    throw err;
  })
  .done();
