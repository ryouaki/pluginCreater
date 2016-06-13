# pluginCreater(Unstable)
这是一个可以帮助Cordova开发者快速创建plugin基础框架的工具。<br>
This is a tools for cordova developer to generate a basic directory structure for cordova custom plugin.

## platform support(支持的平台)

- Android
- iOS

## Install 安装
Download and Unzip(下载工具并解压) [link](https://github.com/ryouaki/pluginCreater/archive/master.zip)
```sh
  npm install -g <yourLocalPath>/pluginCreater
```
![](https://github.com/ryouaki/pluginCreater/blob/master/screenshot1.jpg)

## How to create your own cordova plugin by pluginCreater(如何使用pluginCreater创建你自己的plugin)
Parameter(参数)：

- -n Plugin name/ID(插件名/ID)
- -p The path where you want to store your plugin(存放插件的路径)
- -v Display the version of tool(显示版本号)
- -h Display help(显示帮助)

```sh
  pluginc -n <pluginName> -p <pluginPath> [-h] [-v]
```
![](https://github.com/ryouaki/pluginCreater/blob/master/screenshot2.jpg)
![](https://github.com/ryouaki/pluginCreater/blob/master/screenshot3.jpg)

## problem(问题)
目前由于我这里设备条件原因，只在Win10+Nodejs6.2.1+Cordova5.4.1通过了测试<br>
Currently this is a unstable version .And only tested on Win10+Nodejs6.2.1+Cordova5.4.1

## Contact(联系)
如果你发现bug，请在[issue](https://github.com/ryouaki/pluginCreater/issues)提交你的bug。<br>
If you found issues please submit defect at [issue](https://github.com/ryouaki/pluginCreater/issues)<br>
You should submit the information include as below(提交内容需要包括)：<br>

- OS version
- Nodejs version
- Cordova version

如果你想提交自己的代码到pluginCreater，请提交pull request。<br>
If you want to pull your code to pluginCreater. Please pull request.

## License
MIT 

## Author
Ryouaki(46517115@qq.com)