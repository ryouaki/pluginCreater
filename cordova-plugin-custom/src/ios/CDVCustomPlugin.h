#import <Foundation/Foundation.h>
#import <Cordova/CDVPlugin.h>

@interface CDVCustomPlugin : CDVPlugin

- (void)echo:(CDVInvokedUrlCommand*)command;

@end
