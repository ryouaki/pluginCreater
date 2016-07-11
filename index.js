#!/usr/bin/env node

"use strict";

var pkg = require('./package.json');
var path = require('path');
var fs = require('fs');

var currentDir = process.cwd();
const DEFAULT_PLUGIN_NAME = 'cordova-plugin-custom';
const COMMAND_LINE = ['-n','-p','-v','-h'];
var currentName= DEFAULT_PLUGIN_NAME;

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

  if (!path.isAbsolute(targetPath)) {
    targetPath = path.join(currentDir,targetPath);
  }

  let rootPath = path.join(targetPath,targetName);

  try {
    fs.mkdirSync(rootPath);
    fs.mkdirSync(path.join(rootPath,'src'));
    fs.mkdirSync(path.join(rootPath,'src','android'));
    fs.mkdirSync(path.join(rootPath,'src','ios'));
    fs.mkdirSync(path.join(rootPath,'www'));
    
    createReadme(targetName, rootPath);
    createPackage(targetName, rootPath);
    createPluginXML(targetName, rootPath);
    createJSModule(targetName, rootPath);
    createPlatformSrc(targetName, rootPath);

    displaySuccess();
  } catch(e) {
    console.log(e.message);
  }
}

function displaySuccess() {
  console.log('Plugin files are created succesfully.');
  console.log('Please open the directory of where you store the plugin and modify the files as below: ');
  console.log('Readme.md(option)   : '+path.join(currentDir, currentName, 'README.md'));
  console.log('plugin.xml          : '+path.join(currentDir, currentName, 'plugin.xml'));
  console.log('package.json(option): '+path.join(currentDir, currentName, 'package.json'));
  console.log('js-module(option)   : '+path.join(currentDir, currentName, 'www', '*.js'));
  console.log('native code         : '+path.join(currentDir, currentName, 'src', '*'));
}

function createReadme(targetName,rootPath) {
  let buff = fs.readFileSync(path.join(__dirname, '.', 'templates', 'README.md'), 'utf-8');
  var reg=new RegExp('<plugin-name>', 'g'); //创建正则RegExp对象   
  buff = buff.replace(reg, targetName);
  write(path.join(rootPath, '.', 'README.md'), buff);
  return ;
}

function createPluginXML(targetName,rootPath) {
  let buff = fs.readFileSync(path.join(__dirname, '.', 'templates', 'plugin.xml'), 'utf-8');
  var reg=new RegExp('<plugin-name>', 'g'); //创建正则RegExp对象   
  buff = buff.replace(reg, targetName);
  write(path.join(rootPath, '.', 'plugin.xml'), buff);
  return ;
}

function createPackage(targetName,rootPath) {
  let buff = fs.readFileSync(path.join(__dirname, '.', 'templates', 'package.json'), 'utf-8');
  var reg=new RegExp('<plugin-name>', 'g'); //创建正则RegExp对象   
  buff = buff.replace(reg, targetName);
  write(path.join(rootPath, '.', 'package.json'), buff);
  return ;
}

function createJSModule(targetName,rootPath) {
  let buff = fs.readFileSync(path.join(__dirname, '.', 'templates', 'www', 'customPlugin.js'), 'utf-8');
  write(path.join(rootPath, '.', 'www', 'customPlugin.js'), buff);
  return ;
}

function createPlatformSrc(targetName,rootPath) {
  let buffJava = fs.readFileSync(path.join(__dirname, '.', 'templates', 'src', 'android', 'customPlugin.java'), 'utf-8');
  write(path.join(rootPath, '.', 'src', 'android', 'customPlugin.java'), buffJava);
  let buffH = fs.readFileSync(path.join(__dirname, '.', 'templates', 'src', 'ios', 'CDVCustomPlugin.h'), 'utf-8');
  write(path.join(rootPath, '.', 'src', 'ios', 'CDVCustomPlugin.h'), buffH);
  let buffM = fs.readFileSync(path.join(__dirname, '.', 'templates', 'src', 'ios', 'CDVCustomPlugin.m'), 'utf-8');
  write(path.join(rootPath, '.', 'src', 'ios', 'CDVCustomPlugin.m'), buffM);
  return ;
}

function write(path, str) {
  fs.writeFileSync(path, str ,{flag:'w+'});
}

exec(process.argv);

process.exit();