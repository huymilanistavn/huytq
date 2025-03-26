/****************************************************************************
 Copyright (c) 2015-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
package org.cocos2dx.javascript;

import org.cocos2dx.lib.BuildConfig;
import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;
import org.cocos2dx.lib.Cocos2dxLocalStorage;

import android.content.pm.ActivityInfo;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;

import android.content.Intent;
import android.content.res.Configuration;
import android.util.DisplayMetrics;
import android.view.KeyEvent;
import android.view.WindowManager;
import android.widget.ImageView;

import androidx.annotation.Keep;

import com.sin88.MainActivity;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;

class GameInfo {
    String gameDir = "";
    String orientation = "";
    String userToken = "";
    String refreshToken = "";
    boolean enableMusic = true;
    boolean enableSound = true;
}

public class CCActivity extends Cocos2dxActivity {

    static CCActivity instance;
    ImageView m_loadingBG;
    private static boolean CREATOR_LOCAL_TEST = false;
    private static boolean isShowingDumbGame = false;
    public static GameInfo s_gameInfo = new GameInfo();
    static String g_dumbGameOrientation = "portrait";
    static String g_dumbGameName = "bubbleburst";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        instance = this;
        super.onCreate(savedInstanceState);
        SDKWrapper.getInstance().init(this);
        if (BuildConfig.BUILD_TYPE.equals("release")) {
            CREATOR_LOCAL_TEST = false;
        }

        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        if (CREATOR_LOCAL_TEST || isShowingDumbGame) {
            try {
                InputStream inputStream = getAssets().open(s_gameInfo.gameDir + "/resources/loading_bg.png");
                if (inputStream != null) {
                    DisplayMetrics displayMetrics = getResources().getDisplayMetrics();
                    Bitmap bitmap = BitmapFactory.decodeStream(inputStream);
                    int bitmapBig = bitmap.getWidth();
                    int bitmapSmall = bitmap.getWidth();
                    if (bitmap.getWidth() > bitmap.getHeight()){
                        bitmapSmall = bitmap.getHeight();
                    }
                    else
                    {
                        bitmapBig = bitmap.getHeight();
                    }
                    int deviceBig = displayMetrics.widthPixels;
                    int deviceSmall = displayMetrics.widthPixels;
                    if (displayMetrics.widthPixels > displayMetrics.heightPixels)
                    {
                        deviceSmall = displayMetrics.heightPixels;
                    }
                    else
                    {
                        deviceBig = displayMetrics.heightPixels;
                    }
                    float scale1 = 1.0f * deviceBig / bitmapBig;
                    float scale2 = 1.0f * deviceSmall / bitmapSmall;
                    float scale = scale1 > scale2 ? scale1 : scale2;
                    int x = (int) Math.ceil(bitmap.getWidth() * scale);
                    int y = (int) Math.ceil(bitmap.getHeight() * scale);
                    Bitmap bitmapResized = Bitmap.createScaledBitmap(bitmap, x, y, false);
                    m_loadingBG = new ImageView(this);
                    m_loadingBG.setImageBitmap(bitmapResized);
                    m_loadingBG.setScaleType(ImageView.ScaleType.CENTER);
                    mFrameLayout.addView(m_loadingBG);
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        } else {
            if (s_gameInfo.gameDir.length() > 0)
            {
                File imgFile = new File(s_gameInfo.gameDir + "/resources/loading_bg.png");
                DisplayMetrics displayMetrics = getResources().getDisplayMetrics();
                if (imgFile.exists()) {
                    Bitmap bitmap = BitmapFactory.decodeFile(imgFile.getAbsolutePath());
                    int bitmapBig = bitmap.getWidth();
                    int bitmapSmall = bitmap.getWidth();
                    if (bitmap.getWidth() > bitmap.getHeight()){
                        bitmapSmall = bitmap.getHeight();
                    }
                    else
                    {
                        bitmapBig = bitmap.getHeight();
                    }
                    int deviceBig = displayMetrics.widthPixels;
                    int deviceSmall = displayMetrics.widthPixels;
                    if (displayMetrics.widthPixels > displayMetrics.heightPixels)
                    {
                        deviceSmall = displayMetrics.heightPixels;
                    }
                    else
                    {
                        deviceBig = displayMetrics.heightPixels;
                    }
                    float scale1 = 1.0f * deviceBig / bitmapBig;
                    float scale2 = 1.0f * deviceSmall / bitmapSmall;
                    float scale = scale1 > scale2 ? scale1 : scale2;
                    int x = (int) Math.ceil(bitmap.getWidth() * scale);
                    int y = (int) Math.ceil(bitmap.getHeight() * scale);
                    Bitmap bitmapResized = Bitmap.createScaledBitmap(bitmap, x, y, false);
                    m_loadingBG = new ImageView(this);
                    m_loadingBG.setImageBitmap(bitmapResized);
                    m_loadingBG.setScaleType(ImageView.ScaleType.CENTER_CROP);
                    mFrameLayout.addView(m_loadingBG);
                }
            }
        }
        nativeSetGameInfo(s_gameInfo.gameDir, s_gameInfo.userToken, s_gameInfo.refreshToken, s_gameInfo.enableMusic, s_gameInfo.enableMusic);
        nativeOnStart();
    }

    @Override
    public Cocos2dxGLSurfaceView onCreateView() {
        Cocos2dxGLSurfaceView glSurfaceView = new Cocos2dxGLSurfaceView(this);
        // TestCpp should create stencil buffer
        glSurfaceView.setEGLConfigChooser(5, 6, 5, 0, 16, 8);
        SDKWrapper.getInstance().setGLSurfaceView(glSurfaceView, this);

        return glSurfaceView;
    }

    @Override
    protected void onResume() {
        super.onResume();
        SDKWrapper.getInstance().onResume();
    }

    @Override
    protected void onPause() {
        super.onPause();
        SDKWrapper.getInstance().onPause();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        SDKWrapper.getInstance().onDestroy();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        SDKWrapper.getInstance().onActivityResult(requestCode, resultCode, data);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        SDKWrapper.getInstance().onNewIntent(intent);
    }

    @Override
    protected void onRestart() {
        super.onRestart();
        SDKWrapper.getInstance().onRestart();
    }

    @Override
    protected void onStop() {
        super.onStop();
        SDKWrapper.getInstance().onStop();
    }

    @Override
    public void onBackPressed() {
        SDKWrapper.getInstance().onBackPressed();
//        super.onBackPressed();
        Cocos2dxGLSurfaceView.getInstance().onKeyDown(KeyEvent.KEYCODE_BACK, null);
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        SDKWrapper.getInstance().onConfigurationChanged(newConfig);
        super.onConfigurationChanged(newConfig);
    }

    @Override
    protected void onRestoreInstanceState(Bundle savedInstanceState) {
        SDKWrapper.getInstance().onRestoreInstanceState(savedInstanceState);
        super.onRestoreInstanceState(savedInstanceState);
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        SDKWrapper.getInstance().onSaveInstanceState(outState);
        super.onSaveInstanceState(outState);
    }

    @Override
    protected void onStart() {
        SDKWrapper.getInstance().onStart();
        super.onStart();
    }

    public void removeLoadingBG() {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                mFrameLayout.removeView(m_loadingBG);
                if (s_gameInfo.orientation.equals("landscape")) {
                    setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
                } else {
                    setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
                }
            }
        });
    }
    public void finishMe()
    {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
                finish();
                //if (!isShowingDumbGame)
                {
                    MainActivity.s_shouldCallOnCloseCCGameEvent = true;
                    MainActivity.s_user_bg_music = Cocos2dxLocalStorage.getItem("user_bg_music");
                    MainActivity.s_user_fx_sound = Cocos2dxLocalStorage.getItem("user_fx_sound");
                }
            }
        });
    }

//    @Keep
    public static void preInit(String gameDir, String orientation, String userToken, String refreshToken, boolean enableMusic, boolean enableSound) {
        s_gameInfo.gameDir = gameDir;
        s_gameInfo.orientation = orientation;
        s_gameInfo.userToken = userToken;
        s_gameInfo.refreshToken = refreshToken;
        s_gameInfo.enableMusic = enableMusic;
        s_gameInfo.enableSound = enableSound;
        isShowingDumbGame = false;
    }

    public static void preInit(String gameDir, String orientation, String userToken, String refreshToken) {
        s_gameInfo.gameDir = gameDir;
        s_gameInfo.orientation = orientation;
        s_gameInfo.userToken = userToken;
        s_gameInfo.refreshToken = refreshToken;
        s_gameInfo.enableMusic = true;
        s_gameInfo.enableSound = true;
        isShowingDumbGame = false;
    }

    public static void preInitForDumbGame() {
        s_gameInfo.gameDir = g_dumbGameName;
        s_gameInfo.orientation = g_dumbGameOrientation;
        s_gameInfo.userToken = "";
        s_gameInfo.refreshToken = "";
        s_gameInfo.enableMusic = true;
        s_gameInfo.enableSound = true;
        isShowingDumbGame = true;
    }

    @Keep
    public static void closeCCGame() {
        if (CCActivity.instance != null) {
            CCActivity.instance.finishMe();
        }
    }

    @Keep
    public static void onCCGameDidLoad() {
        CCActivity.instance.removeLoadingBG();
        MainActivity.instance.removeCCLoading();
    }

    public static native void nativeOnStart();
    public static native void nativeSetGameInfo(String gameDir, String userToken, String refreshToken, boolean enableMusic, boolean enableSound);
}
