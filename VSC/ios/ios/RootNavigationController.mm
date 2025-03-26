//
//  RootNavigationController.m
//  SinApp
//
//  Created by GreenMango on 7/17/21.
//

#import "RootNavigationController.h"

@interface RootNavigationController ()

@end

@implementation RootNavigationController

- (BOOL)shouldAutorotate {
    return self.visibleViewController.shouldAutorotate;
}
// For ios6, use supportedInterfaceOrientations & shouldAutorotate instead
#ifdef __IPHONE_6_0
- (UIInterfaceOrientationMask)supportedInterfaceOrientations {
    return self.visibleViewController.supportedInterfaceOrientations;
}
#endif

// Controls the application's preferred home indicator auto-hiding when this view controller is shown.
- (BOOL)prefersHomeIndicatorAutoHidden {
    return self.visibleViewController.prefersHomeIndicatorAutoHidden;
}

//fix not hide status on ios7
- (BOOL)prefersStatusBarHidden {
    return self.visibleViewController.prefersStatusBarHidden;
}
@end
