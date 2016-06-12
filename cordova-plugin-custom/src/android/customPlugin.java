package com.cordovacn.www;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import android.widget.Toast;


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
            //加个Toast提示
            Toast.makeText(this.cordova.getActivity(),action,Toast.LENGTH_SHORT).show();
            final String isRunBackgroud = args.getString(0);
            if(isRunBackgroud.equals("false")) {
                callbackContext.success("Invoke success!");
            } else if(isRunBackgroud.equals("true")) {
                this.cordova.getThreadPool().execute(new Runnable() {
                    public void run() {
                        callbackContext.success("Invoke success(background)!");
                    }
                });
            } else {
                callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.ERROR, "ERROR!"));
            }
        } else {
            return false;
        }
        return true;
    }
}
