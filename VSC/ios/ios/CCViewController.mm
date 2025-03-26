/****************************************************************************
 Copyright (c) 2013      cocos2d-x.org
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

#import "CCViewController.h"
#import "cocos2d.h"
#import "AppController.h"

#include "platform/CCApplication.h"
#include "platform/ios/CCEAGLView-ios.h"
#include "AppDelegate.h"

extern cocos2d::Application* app;

@implementation CCViewController

/*
 // The designated initializer.  Override if you create the controller programmatically and want to perform customization that is not appropriate for viewDidLoad.
 - (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil {
 if ((self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil])) {
 // Custom initialization
 }
 return self;
 }
 */

// Implement loadView to create a view hierarchy programmatically, without using a nib.
- (void)loadView {
    // Set EAGLView as view of RootViewController
    self.view = (__bridge CCEAGLView *)cocos2d::Application::getInstance()->getView();
}

// Implement viewDidLoad to do additional setup after loading the view, typically from a nib.
- (void)viewDidLoad {
    [super viewDidLoad];
}

- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
    self.view.backgroundColor = [[[UIColor alloc] initWithRed:0.03f green:0.1f blue:0.16f alpha:1.0] autorelease];
    [self addLoadingBackground];
    [[UIApplication sharedApplication] setStatusBarHidden:YES withAnimation:UIStatusBarAnimationSlide];
}

- (void)viewDidDisappear:(BOOL)animated {
    [super viewDidDisappear:animated];
    if (app)
    {
        delete app;
        app = nullptr;
    }
//    [self.view.backgroundColor release];
    self.view.backgroundColor = nil;
    self.view = nil;
    NSTimeInterval delayInSeconds = 0.5;
    dispatch_time_t popTime = dispatch_time(DISPATCH_TIME_NOW, (int64_t)(delayInSeconds * NSEC_PER_SEC));
    dispatch_after(popTime, dispatch_get_main_queue(), ^(void){
        [[UIApplication sharedApplication] setStatusBarHidden:NO withAnimation:UIStatusBarAnimationSlide];
    });
}

// For ios6, use supportedInterfaceOrientations & shouldAutorotate instead
#ifdef __IPHONE_6_0
- (NSUInteger) supportedInterfaceOrientations{
    return UIInterfaceOrientationMaskAllButUpsideDown;
}
#endif

- (BOOL) shouldAutorotate {
    return [[AppController getInstance] autoRotate];
}

//fix not hide status on ios7
- (BOOL)prefersStatusBarHidden {
    return YES;
}

// Controls the application's preferred home indicator auto-hiding when this view controller is shown.
- (BOOL)prefersHomeIndicatorAutoHidden {
    return YES;
}

- (void)didReceiveMemoryWarning {
    // Releases the view if it doesn't have a superview.
    [super didReceiveMemoryWarning];
    
    // Release any cached data, images, etc that aren't in use.
}

-(void) gameDidLoad {
    [self removeLoadingBackground];
}
-(void)addLoadingBackground {
    if (_loadingBG)
    {
        return;
    }
    CGRect screenBounds = [[UIScreen mainScreen] bounds];
    _loadingBG = [[UIImageView alloc] initWithFrame:CGRectMake(0, 0, screenBounds.size.width, screenBounds.size.height)];
    NSString *nsStrPath = nil;
    if ([[AppController getInstance] isShowingDumbGame])
    {
        nsStrPath = [[NSBundle mainBundle] pathForResource:[NSString stringWithFormat:@"%@%@", [[AppController getInstance] gameDir], @"/resources/loading_bg.png"] ofType:nil];
    }
    else
    {
        nsStrPath = [NSString stringWithFormat:@"%@%@", [[AppController getInstance] gameDir], @"/resources/loading_bg.png"];
    }

    _loadingBG.image = [UIImage imageWithContentsOfFile:nsStrPath];
    _loadingBG.contentMode = UIViewContentModeScaleAspectFill;
    [_loadingBG autorelease];
    
    [self.view addSubview:_loadingBG];
    [self.view sendSubviewToBack:_loadingBG];
}
-(void)removeLoadingBackground {
    if (_loadingBG)
    {
        [_loadingBG removeFromSuperview];
        _loadingBG = nil;
    }
}
@end
