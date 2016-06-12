package com.cordovacn.www;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;

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
        
        if (action.equals(customPlugin.METHOD_ECHO)) {
            callbackContext.success("Invoke success!");
        } else {
            return false;
        }
        return true;
    }
}
