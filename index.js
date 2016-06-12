#!/usr/bin/env node

"use strict";

var pkg = require('./package.json');
var path = require('path');

var currentDir = process.cwd();
const DEFAULT_PLUGIN_NAME = 'cordova-plugin-custom';
const COMMAND_LINE = ['-n','-p','-v','-h'];

var options = {
  info: {
    display: true,
    description: 'INFO    : This is a tools for cordova developer to generate a basic files structure for cordova custom plugin.\n' +
    'Author  : ' + pkg.author + '\n' +
    'Homepage: ' + pkg.homepage
  },
  usage: {
    display: true,
    description: '\n Usage: pluginc [-v] [-h] [option <value>]\n'
  },
  fields: {
    display: true,
    description: ' Option    | Description'
  },
  n: {
    display: true,
    description: ' -n <name>   Assign a plugin name.(default: cordova-plugin-custom)'
  },
  p: {
    display: true,
    description: ' -p <path>   Assign to a path of where you want to store source code of your plugin.(default: ./)'
  },
  v: {
    display: true,
    description: ' -v          Display the version of pluginCreater.'
  },
  h: {
    display: true,
    description: ' -h          Display help.'
  },
  example: {
    display: true,
    description: '\n command line                            | description\n' +
    ' pluginc -n cordova-plugin-custom          // create plugin by defaule,Ignore .\n' +
    ' pluginc -n cordova-plugin-custom -p ./    // create plugin in assign directory.\n' +
    ' pluginc -v                                // Show version of pluginCreater.\n'
  },
  version: {
    display: false,
    description: '\n' + pkg.name + ' Ver: ' + pkg.version
  }
}

function displayOption(msg) {
  console.log(msg.description);
}

function displayAllOptions() {
  for (var key in options) {
    if (options[key].display) {
      displayOption(options[key]);
    }
  }
}

function exec(argv) {
  if (argv[2] == '-h' || argv.length == 2) {
    displayAllOptions();
    process.exit();
  } else if (argv[2] == '-v') {
    displayOption(options['version']);
    process.exit();
  } 

  const tasks = parseArguments(argv);
  if (!tasks) {
    process.exit(0);
  }

  createPlugin(tasks);
}

function parseArguments(argv) {
  if (argv.length % 2 != 0) {
    return false;
  } else {
    let ret = {};
    for (let index = 2; index < argv.length; index++) {
      if (COMMAND_LINE.indexOf(argv[index])<0) {
        console.log('\nERROR: Bad option: '+argv[index]+' !');
        return false;
      }
      ret[argv[index]] = argv[index + 1];
      index++
    }
    return ret;
  }
}

function createPlugin(tasks) {
  let targetName = '';
  let targetPath = '';

  if (tasks['-n'] != undefined && tasks['-n'].length > 0) {
    targetName = tasks['-n'];
  }

  if (tasks['-p'] != undefined && tasks['-p'].length > 0) {
    targetPath = tasks['-p'];
  }

  if (targetName.length <= 0) {
    targetName = DEFAULT_PLUGIN_NAME;
  }

  if (targetPath.length <= 0) {
    targetPath = path.join(currentDir);
  }

  

}

exec(process.argv);