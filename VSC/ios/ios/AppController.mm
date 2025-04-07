/****************************************************************************
 Copyright (c) 2010-2013 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
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

#import "AppController.h"
#import "cocos2d.h"
#import "AppDelegate.h"
#import "CCViewController.h"
#import "RootNavigationController.h"
#import "RNViewController.h"
#import "RCTNativeModule.h"
#import "SDKWrapper.h"
#import "platform/ios/CCEAGLView-ios.h"
#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <CodePush/CodePush.h>
#include "audio/include/AudioEngine.h"

#ifdef FB_SONARKIT_ENABLED
#import <FlipperKit/FlipperClient.h>
#import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
#import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
#import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
#import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
#import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>

static void InitializeFlipper(UIApplication *application) {
    FlipperClient *client = [FlipperClient sharedClient];
    SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
    [client addPlugin:[[FlipperKitLayoutPlugin alloc] initWithRootNode:application withDescriptorMapper:layoutDescriptorMapper]];
    [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
    [client addPlugin:[FlipperKitReactPlugin new]];
    [client addPlugin:[[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
    [client start];
}
#endif

using namespace cocos2d;

static AppController *m_instance = nil;

NSString *g_dumbGameOrientation = @"portrait";
NSString *g_dumbGameName = @"bubbleburst" ;

@implementation AppController

Application* app = nullptr;
@synthesize window;

#pragma mark -
#pragma mark Application lifecycle

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    m_instance = self;
    //    [[SDKWrapper getInstance] application:application didFinishLaunchingWithOptions:launchOptions];
#ifdef FB_SONARKIT_ENABLED
    InitializeFlipper(application);
#endif
    RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
    RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                     moduleName:@"demoreactnative"
                                              initialProperties:nil];
    
    // adjust red, green, blue and alpha as per the UIColor spec
    rootView.backgroundColor = [[[UIColor alloc] initWithRed:0.03f green:0.1f blue:0.16f alpha:1.0] autorelease];
    
    self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
    RNViewController *rnViewController = [RNViewController new];
    rnViewController.view = rootView;
    
    _navigationController = [[RootNavigationController alloc] init];
    [_navigationController setNavigationBarHidden:YES animated:NO];
    [_navigationController pushViewController:rnViewController animated:YES];
    self.window.rootViewController = _navigationController;
    
    [self.window makeKeyAndVisible];
    [self setOrientation: @"portrait"];
    
    [[UIApplication sharedApplication] setIdleTimerDisabled:YES];
    
    return YES;
}

- (void)applicationWillResignActive:(UIApplication *)application {
    /*
     Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
     Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
     */
    //    [[SDKWrapper getInstance] applicationWillResignActive:application];
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
    /*
     Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
     */
    //    [[SDKWrapper getInstance] applicationDidBecomeActive:application];
}

- (void)applicationDidEnterBackground:(UIApplication *)application {
    /*
     Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
     If your application supports background execution, called instead of applicationWillTerminate: when the user quits.
     */
    //    [[SDKWrapper getInstance] applicationDidEnterBackground:application];
    if (app)
    {
        app->applicationDidEnterBackground();
    }
}

- (void)applicationWillEnterForeground:(UIApplication *)application {
    /*
     Called as part of  transition from the background to the inactive state: here you can undo many of the changes made on entering the background.
     */
    //    [[SDKWrapper getInstance] applicationWillEnterForeground:application];
    if (app)
    {
        app->applicationWillEnterForeground();
    }
}

- (void)applicationWillTerminate:(UIApplication *)application
{
    //    [[SDKWrapper getInstance] applicationWillTerminate:application];
    delete app;
    app = nil;
}


#pragma mark -
#pragma mark Memory management

- (void)applicationDidReceiveMemoryWarning:(UIApplication *)application {
    /*
     Free up as much memory as possible by purging cached data objects that can be recreated (or reloaded from disk) later.
     */
}

#pragma mark -
#pragma mark Custom Methods
- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
//    return [CodePush bundleURL];
#if DEBUG
    return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
    return [CodePush bundleURL];
#endif
}

-(void) openCCGame:(NSString *)gameDir : (NSString*) orientation : (NSString*) userToken : (NSString*) refreshToken : (BOOL) enableMusic : (BOOL) enableSound {
    _isShowingDumbGame = false;
    _targetOrientation = [[NSString alloc] initWithString:orientation];
    _gameDir = [[NSString alloc] initWithString:gameDir];
    dispatch_async(dispatch_get_main_queue(), ^{
        float scale = [[UIScreen mainScreen] scale];
        CGRect bounds = [[UIScreen mainScreen] bounds];
        window = [[UIWindow alloc] initWithFrame: bounds];
        
        // cocos2d application instance
        app = new AppDelegate(bounds.size.width * scale, bounds.size.height * scale);
        app->setMultitouch(true);
        
        // Use RootViewController to manage CCEAGLView
        _viewController = [[CCViewController alloc] init];
        [_viewController autorelease];
#ifdef NSFoundationVersionNumber_iOS_7_0
        _viewController.automaticallyAdjustsScrollViewInsets = NO;
        _viewController.extendedLayoutIncludesOpaqueBars = NO;
        _viewController.edgesForExtendedLayout = UIRectEdgeAll;
#else
        _viewController.wantsFullScreenLayout = YES;
#endif
        
        [_navigationController pushViewController:_viewController animated:YES];
        
        NSTimeInterval delayInSeconds = 1;
        dispatch_time_t time = dispatch_time(DISPATCH_TIME_NOW, (int64_t)(delayInSeconds * NSEC_PER_SEC));
        dispatch_after(time, dispatch_get_main_queue(), ^(void){
            //run the cocos2d-x game scene
            std::string gameDirStr([gameDir UTF8String]);
            std::string userTokenStr([userToken UTF8String]);
            std::string refreshTokenStr([refreshToken UTF8String]);
            static_cast<AppDelegate*>(app)->setGameInfo(gameDirStr, userTokenStr, refreshTokenStr, enableMusic, enableSound);
            app->start();
        });
    });
}

-(void) openDumbGame
{
    _isShowingDumbGame = true;
    _gameDir = [[NSString alloc] initWithString:g_dumbGameName];
    dispatch_async(dispatch_get_main_queue(), ^{
        float scale = [[UIScreen mainScreen] scale];
        CGRect bounds = [[UIScreen mainScreen] bounds];
        window = [[UIWindow alloc] initWithFrame: bounds];
        
        [self setOrientation:g_dumbGameOrientation];
        
        // cocos2d application instance
        app = new AppDelegate(bounds.size.width * scale, bounds.size.height * scale);
        app->setMultitouch(true);
        
        // Use RootViewController to manage CCEAGLView
        _viewController = [[CCViewController alloc]init];
        [_viewController autorelease];
#ifdef NSFoundationVersionNumber_iOS_7_0
        _viewController.automaticallyAdjustsScrollViewInsets = NO;
        _viewController.extendedLayoutIncludesOpaqueBars = NO;
        _viewController.edgesForExtendedLayout = UIRectEdgeAll;
#else
        _viewController.wantsFullScreenLayout = YES;
#endif
        [_navigationController pushViewController:_viewController animated:NO];
        std::string gameDirStr([_gameDir UTF8String]);
        std::string userTokenStr([@"" UTF8String]);
        std::string refreshTokenStr([@"" UTF8String]);
        static_cast<AppDelegate*>(app)->setGameInfo(gameDirStr, userTokenStr, refreshTokenStr, true, true);
        app->start();
    });
}

-(void) closeCCGame
{
    dispatch_async(dispatch_get_main_queue(), ^{
        
        BOOL animated = NO;
        switch ([UIDevice currentDevice].orientation) {
            case UIDeviceOrientationPortrait:
                animated = YES;
                break;
            case UIDeviceOrientationLandscapeRight:
                animated = NO;
                break;
            case UIDeviceOrientationPortraitUpsideDown:
                animated = YES;
                break;
            case UIDeviceOrientationLandscapeLeft:
                animated = NO;
                break;
            default:
                break;
        }

//      [UIView setAnimationsEnabled:NO];
        [self setOrientation:@"portrait"];
        [_viewController addLoadingBackground];
        app->prepareToStop();
//        [UIView setAnimationsEnabled:YES];
        
        NSTimeInterval delayInSeconds = 0.5;
        dispatch_time_t popTime = dispatch_time(DISPATCH_TIME_NOW, (int64_t)(delayInSeconds * NSEC_PER_SEC));
        dispatch_after(popTime, dispatch_get_main_queue(), ^(void){
            [_navigationController popViewControllerAnimated:YES];
        });
    });
}

-(void) onCCGameDidLoad
{
    dispatch_async(dispatch_get_main_queue(), ^{
        [_viewController gameDidLoad];
        [self setOrientation:_targetOrientation];
    });
}

-(void) setOrientation:(NSString *) orientation {
    if (orientation == nil)
    {
        return;
    }
    _autoRotate = true;
    NSNumber *orientationTarget;
    if ([orientation isEqualToString:@"landscape"])
    {
        orientationTarget = [NSNumber numberWithInt:UIInterfaceOrientationLandscapeRight];
    }
    else if ([orientation isEqualToString:@"portrait"])
    {
        orientationTarget = [NSNumber numberWithInt:UIInterfaceOrientationPortrait];
    }
    [[UIDevice currentDevice] setValue:orientationTarget forKey:@"orientation"];
    [UIViewController attemptRotationToDeviceOrientation];
    _autoRotate = false;
}

+(AppController*) getInstance
{
    return m_instance;
}

void onCCGameDidLoad()
{
    [[AppController getInstance] onCCGameDidLoad];
}

void closeCCGame()
{
    [[AppController getInstance] closeCCGame];
    extern NSString* const onCloseCCGameEventName;
    bool localStorageGetItem( const std::string& key, std::string *outItem );
    std::string user_bg_music = "";
    std::string user_fx_sound = "";
    localStorageGetItem("user_bg_music", &user_bg_music);
    localStorageGetItem("user_fx_sound", &user_fx_sound);
    
    NSString *ns_user_bg_music = [NSString stringWithCString:user_bg_music.c_str() encoding:[NSString defaultCStringEncoding]];
    NSString *ns_user_fx_sound = [NSString stringWithCString:user_fx_sound.c_str() encoding:[NSString defaultCStringEncoding]];
    
    [[RCTNativeModule getInstance] sendEvent:onCloseCCGameEventName:@{@"user_bg_music": ns_user_bg_music, @"user_fx_sound": ns_user_fx_sound}];
}

@end
