var exec = require('cordova/exec');
  
var customPlugin = {};

customPlugin.echo = function(successCallback, errorCallback, args) {
  exec(successCallback, errorCallback, "customPlugin", "echo", args);
};

module.exports = customPlugin;