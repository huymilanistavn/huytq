package com.sin88;

import android.content.Intent;
import android.os.Bundle;
import android.view.WindowManager;

import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.cocos2dx.javascript.CCActivity;

public class MainActivity extends ReactActivity {
  public static MainActivity instance;
  public static boolean s_shouldCallOnCloseCCGameEvent = false;
  public static String s_user_bg_music = "";
  public static String s_user_fx_sound = "";

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    if (savedInstanceState != null)
    {
      savedInstanceState.clear();
    }
    instance = this;
    getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
  }

  @Override
  protected void onPause() {
    super.onPause();
  }

  @Override
  protected void onResume() {
    super.onResume();
    if (s_shouldCallOnCloseCCGameEvent)
    {
      callOnCloseCCGameEvent();
      s_shouldCallOnCloseCCGameEvent = false;
    }
  }

  @Override
  protected void onDestroy() {
    super.onDestroy();
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "demoreactnative";
  }

  public static void startCCActivity()
  {
    Intent intent = new Intent(MainActivity.instance, CCActivity.class);
    MainActivity.instance.startActivity(intent);
  }
  public void removeCCLoading()
  {
    WritableMap params = Arguments.createMap();
    getReactInstanceManager().getCurrentReactContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("removeCCLoading", params);
  }
  public void callOnCloseCCGameEvent()
  {
    WritableMap params = Arguments.createMap();
    params.putString("user_bg_music", s_user_bg_music);
    params.putString("user_fx_sound", s_user_fx_sound);
    getReactInstanceManager().getCurrentReactContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("onCloseCCGame", params);
  }
}
