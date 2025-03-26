//
//  RCTNativeModule.h
//  SinApp-mobile
//
//  Created by GreenMango on 6/7/21.
//

#ifndef RCTNativeModule_h
#define RCTNativeModule_h

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCTNativeModule : RCTEventEmitter <RCTBridgeModule>
{
}
@property(nonatomic, readonly) BOOL hasListeners;
-(void) sendEvent:(NSString*) eventName : (id) body;

+(RCTNativeModule*) getInstance;

@end

#endif /* RCTNativeModule_h */
