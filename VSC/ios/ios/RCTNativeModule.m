//
//  RCTNativeModule.m
//  SinApp-mobile
//
//  Created by GreenMango on 6/7/21.
//

#import "RCTNativeModule.h"
#import "AppController.h"

NSString* const onCloseCCGameEventName = @"onCloseCCGame";

static RCTNativeModule *_instance = nil;

@implementation RCTNativeModule

// To export a module named RCTNativeModule
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(openCCGame : (NSString*) gameDir : (NSString*) orientation : (NSString*) userToken : (NSString*) refreshToken: (BOOL) enableMusic : (BOOL) enableSound)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        [[AppController getInstance] openCCGame:gameDir:orientation:userToken:refreshToken:enableMusic:enableSound];
     });
}

RCT_EXPORT_METHOD(openDumbGame)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        [[AppController getInstance] openDumbGame];
    });
}

RCT_EXPORT_METHOD(setOrientation: (NSString *) orientation)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        [[AppController getInstance] setOrientation:orientation];
    });
}

-(id) init {
    [super init];
    _instance = self;
    return self;
}

- (NSArray<NSString *> *)supportedEvents {
    return @[onCloseCCGameEventName];
}

// Will be called when this module's first listener is added.
-(void) startObserving {
  _hasListeners = YES;
}

// Will be called when this module's last listener is removed, or on dealloc.
-(void)stopObserving {
  _hasListeners = NO;
    
}

- (void)sendEvent : (NSString*) eventName : (id) body {
  if (_hasListeners) {
    [self sendEventWithName:eventName body:body];
  }
}

+ (BOOL) requiresMainQueueSetup {
    return YES;
}

+ (RCTNativeModule*) getInstance
{
    return _instance;
}
@end
