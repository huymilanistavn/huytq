package com.vsc;

import android.app.Activity;
import android.content.pm.ActivityInfo;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import org.cocos2dx.javascript.CCActivity;

public class RCTNativeModule extends ReactContextBaseJavaModule {
    RCTNativeModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "NativeModule";
    }

//    @ReactMethod
//    public void openCCGame(String gameDir, String orientation, String userToken, String refreshToken) {
//        CCActivity.preInit(gameDir, orientation, userToken, refreshToken);
//        MainActivity.startCCActivity();
//    }

    @ReactMethod
    public void openCCGame(String gameDir, String orientation, String userToken, String refreshToken, boolean enableMusic, boolean enableSound) {
        CCActivity.preInit(gameDir, orientation, userToken, refreshToken, enableMusic, enableSound);
        MainActivity.startCCActivity();
    }

    @ReactMethod
    public void openDumbGame()
    {
        CCActivity.preInitForDumbGame();
        MainActivity.startCCActivity();
        MainActivity.instance.overridePendingTransition(0, 0);
    }

    @ReactMethod
    public void setOrientation(String orientation)
    {
        final Activity activity = getCurrentActivity();
        if (activity != null)
        {
            if (orientation.equals("landscape"))
            {
                activity.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
            }
            else
            {
                activity.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
            }
        }
    }

}
