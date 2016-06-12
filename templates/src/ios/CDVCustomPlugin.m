
#import "CDVCustomPlugin.h"

@implementation CDVCustomPlugin

- (void)echo:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Invoke success!"];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}
@end
