#如何自定义插件(plugin)

#####首先我们要按照以下目录结构创建文件夹：
```sh
    /
    ----/LICENSE      # license文件
    ----/package.json # plugin描述文件
    ----/plugin.xml   # plugin配置文件
    ----/README.md    # readme
    ----/src          # 存放原生代码文件
        ----/android  # 存放android环境的原生代码
            ----/customPlugin.java  # android原生代码文件
        ----/ios      # 存放ios环境的原生代码 
            ----/CDVCustomPlugin.h  # ios原生代码头文件
            ----/CDVCustomPlugin.m  # ios原生代码定义文件
    ----/www          # 存放定义js接口文件
        ----/customPlugin.js # js接口定义文件(这个是可选的，主要是为了多平台js api统一，类似java接口的定义)
```

#####以下是package.json文件的内容
```json
    {
      "name": "cordova-plugin-custom",    // plugin名称
      "version": "1.0.0",                 // 版本号
      "description": "Cordova custom Plugin",   // plugin描述
      "cordova": {
        "id": "cordova-plugin-custom",    // plugin的id，这个很重要。要和plugin目录名一致
        "platforms": [                    // 插件支持的平台
          "android",                      // 该插件支持android和ios
          "ios"
        ]
      },
      "repository": {                     // 远程库地址
        "type": "git",
        "url": "https://github.com/CordovaCn/CordovaPluginsDemo"
      },
      "keywords": [                       // 用于在cordova plugin search被查找出来
        "cordova",
        "custom"
      ],
      "author": "46517115@qq.com",        // 作者
      "license": "Apache 2.0"             // 开源协议
    }
```

#####创建plugin.xml
```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <!--plugin标签内的id属性要和文件夹名保持一致，这也是你将来进行安装所使用的名字-->
    <plugin xmlns="http://apache.org/cordova/ns/plugins/1.0"
               id="cordova-plugin-custom"
          version="1.0.0">
        <name>cordova-plugin-custom</name>
        <description>Cordova Custom Plugin</description>
        <license>Apache 2.0</license>
        <keywords>cordova,custom</keywords>
        <issue>https://github.com/CordovaCn/CordovaPluginsDemo/issues</issue>
        <!--这里用来设置发布接口文件该模块会在navigator对象上添加一个customPlugin对象-->
        <js-module src="www/customPlugin.js" name="customPlugin">
            <clobbers target="navigator.customPlugin" />
        </js-module>
        <!--针对android平台的配置-->
        <platform name="android">
            <!--将以下plugin信息注入到android的res/xml/config.xml文件中-->
            <config-file target="res/xml/config.xml" parent="/*">
                <feature name="customPlugin" >
                    <!--value必须与java文件的package信息相符-->
                    <param name="android-package" value="com.cordovacn.www.customPlugin"/>
                    <param name="onload" value="true" />
                </feature>
            </config-file>
            <!--将插件目录下的java文件拷贝到target-dir目录，必须与package信息匹配-->
            <source-file src="src/android/customPlugin.java" target-dir="src/com/cordovacn/www" />
        </platform>
        <!--针对ios平台的配置-->
        <platform name="ios">
            <!--将以下plugin信息注入到ios的config.xml文件中-->
            <config-file target="config.xml" parent="/*">
                <feature name="customPlugin">
                    <param name="ios-package" value="CDVCustomPlugin" />
                    <param name="onload" value="true" />
                </feature>
            </config-file>
            <!--将插件目录下的oc文件拷贝到ios平台oc代码目录-->
            <header-file src="src/ios/CDVCustomPlugin.h" />
            <source-file src="src/ios/CDVCustomPlugin.m" />
        </platform>
    </plugin>
```

#####customPlugin.js文件
```JavaScript
    var argscheck = require('cordova/argscheck'),
        exec      = require('cordova/exec');
      
    var customPlugin = {};
    // 定义对外发布的接口echo，该方法可以通过navigator.customPlugin.echo调用
    customPlugin.echo = function(successCallback, errorCallback, args) {
      exec(successCallback, errorCallback, "customPlugin", "echo", args);
    };
    // 发布接口对象
    module.exports = customPlugin;
```

#####customPlugin.java文件
```Java
    // package信息必须与<platform name="android">下的配置信息匹配
    package com.cordovacn.www; 
    
    import org.apache.cordova.CallbackContext;
    import org.apache.cordova.CordovaPlugin;
    import org.apache.cordova.PluginResult;
    import org.json.JSONArray;
    import org.json.JSONException;
    
    
    // 所有plugin类必须继承至CordovaPlugin
    public class customPlugin extends CordovaPlugin {
        
        public static final String METHOD_ECHO = "echo";
        
        /**
         * Executes the request and returns PluginResult.
         *
         * @param action            The action to execute.
         * @param args              JSONArray of arguments for the plugin.
         * @param callbackContext   The callback context used when calling back into JavaScript.
         * @return                  True if the action was valid, false otherwise.
         */
        public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) throws JSONException {
            // 与ios不同，android是通过action来区分js请求的具体api
            if (action.equals(customPlugin.METHOD_ECHO)) {
                // 从js代码传入的参数中取得第一个参数的值
                final String isRunBackgroud = args.getString(0);
                if(isRunBackgroud.equals("false")) {
                    // plugin执行成功，返回成功信息，调用successCallback回调
                    callbackContext.success("Invoke success!");
                } else if(isRunBackgroud.equals("true")) {
                    // 如果执行复杂耗时的操作，需要在线程中进行，避免app被系统杀死
                    this.cordova.getThreadPool().execute(new Runnable() {
                        public void run() {
                            callbackContext.success("Invoke success(background)!");
                        }
                    });
                } else {
                    // plugin执行失败，返回失败信息，调用failedCallback回调
                    callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.ERROR, "ERROR!"));
                }
            } else {
                return false;
            }
            return true;
        }
    }

```

#####CDVCustomPlugin.h
```c
    #import <Foundation/Foundation.h>
    #import <Cordova/CDVPlugin.h>
    // 同样，plugin类必须派生至CDVPlugin
    @interface CDVCustomPlugin : CDVPlugin
    // 定义一个plugin的api供js调用
    - (void)echo:(CDVInvokedUrlCommand*)command;
    
    @end
```

#####CDVCustomPlugin.m
```c
    #import "CDVCustomPlugin.h"
    #import <Cordova/CDVViewController.h>
    
    @implementation CDVCustomPlugin
    
    - (void)echo:(CDVInvokedUrlCommand*)command
    {
        // 取得js传递过来的参数
        NSString* isRunBackgroud = [command argumentAtIndex:0];
        if([isRunBackgroud isEqualToString:@"false"]) {
            // plugin执行成功，返回成功信息，调用successCallback回调
            CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Invoke success!"];
            [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        } else if([isRunBackgroud isEqualToString:@"true"]) {
            // 如果执行复杂耗时的操作，需要在线程中进行，避免app被系统杀死
            [self.commandDelegate runInBackground:^ {
                CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Invoke success(background)!"];
                [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
            }];
        } else {
            // plugin执行失败，返回失败信息，调用failedCallback回调
            CDVPluginResult *result = [CDVPluginResult resultWithStatus: CDVCommandStatus_ERROR messageAsString:@"ERROR!"];
            [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        }
    }
    @end
```

#####安装插件
cordova plugin add [自定义的插件目录]

#####删除插件
cordova plugin rm [插件名称]
