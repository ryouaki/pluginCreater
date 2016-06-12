
#import "CDVCustomPlugin.h"
#import <Cordova/CDVViewController.h>

@implementation CDVCustomPlugin

- (void)echo:(CDVInvokedUrlCommand*)command
{
    NSString* isRunBackgroud = [command argumentAtIndex:0];
    if([isRunBackgroud isEqualToString:@"false"]) {
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Invoke success!"];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    } else if([isRunBackgroud isEqualToString:@"true"]) {
        [self.commandDelegate runInBackground:^ {
            CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Invoke success(background)!"];
            [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        }];
    } else {
        CDVPluginResult *result = [CDVPluginResult resultWithStatus: CDVCommandStatus_ERROR messageAsString:@"ERROR!"];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }
}
@end
