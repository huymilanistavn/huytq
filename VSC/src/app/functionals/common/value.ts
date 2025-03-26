
export default {
    // FLAG BUILD AND LOAD NATIVE GAME
    is_native_lib : true,

    token: '',
    autoLogin: true,
    user: {
        name: 'Kelvin Tang',
        birthday: '15/04/1990',
        email: 'kelvintang@gmail.com',
        phone: '090909090',
        address: '125 Điện Biên Phủ, F5, Q3, HCM',
        startdate: '01/01/2019',
        enddate: '31/12/2022',
        mycode: 'MYCODE',
        parentcode: 'PARENTCODE',
        totalchild: '1',
        vip: 0,
        username: 'username',
        avatar: ''
    },
    congGameName: '',
    currentBankSelected: '',
    currentMethodBankSelected: 'ibanking',
    currentGoToLink: '',
    canPlay: '',
    currentLiveCasino: 0,

    //notification
    notificationCount: 0,

    //native
    isNative: '',
    isLandscape: false,
    gameName:'',
    viewGameNative: false,
    
    // avoid spam click game
    canClick: true,

    //contact
    isContact: false,

    //is Using Webview or Native Game
    isUsingWebViewOrNativeGame: false,

    //blackList Android "partner_game_id": "kts9997"
    blacklistNativeAndroid:[], //"kts9997","kts9991","ktrng3979","ktrng3981","ktrng3998"...'kts9995'

    //blackList IOS
    blacklistNativeIOS:[], //"kts9997","kts9991","ktrng3979","ktrng3981","ktrng3998"...'kts9995','kts9992'

    //game Need Money to Play
    gameNeedMoney:["xidealer7995","sicbophuonghoang3996","baccaratsuper3992","baccarat3997","sicbo3998"],
}
