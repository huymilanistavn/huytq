import { Alert, Linking, Platform, View } from 'react-native';
import * as React from 'react';
import { showMessage, hideMessage } from "react-native-flash-message";
import { g } from '../../g'

const defaultNumbers = ' hai ba bốn năm sáu bảy tám chín';
const chuHangDonVi = ('1 một' + defaultNumbers).split(' ');
const chuHangChuc = ('lẻ mười' + defaultNumbers).split(' ');
const chuHangTram = ('không một' + defaultNumbers).split(' ');
const dvBlock = '1 nghìn triệu tỷ'.split(' ');

class Function extends React.Component<{

}, {

    }> {
    constructor(props: Function['props']) {
        super(props);
        this.state = {
        };
    }

    clipboardMessage = () => {
        showMessage({
            message: "Đã sao chép",
            type: 'success',
            icon: { icon: 'success', position: "left" }
        });
    }

    currencyFormat(num: number) {
        return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') + ' VND'
    }

    currencyFormatK(num: number) {
        return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
    }

    getK = (str: string) => {
        //return Math.round(parseInt(str.replace(/\./g, '')) / 1000);
        let a = parseInt(str.replace(/\./g, ''));
        return (a - a % 1000) / 1000;
    }

    getCCGameOrientation(isLandscape: boolean) {
        if (isLandscape) {
            return 'landscape';
        }
        else {
            return 'portrait';
        }
    }

    //goto Link
    public gotoLink(props: any, redirectLogin: boolean, redirectWebview: boolean) {
        if (props?.user?.user?.username === '') {
            if (redirectLogin)
                props.navigation.navigate('LoginAndRegister', { data: 0 });
            return 'login';
        } else {
            if (props?.user?.user?.balance === 0) {
                return "nomoney";
            } else {
                if (redirectWebview)
                    props.navigation.navigate(g.value.isLandscape ? "WebviewLandscape" : "Webview");
                return 'ok';
                //}
            }
        }
    }

    //goto Link
    public gotoNative(props: any) {
        if (props?.user?.user?.username === '') {
            props.navigation.navigate('LoginAndRegister');
            return 'login';
        } else {
            if (props?.user?.user?.balance === 0) {
                return "nomoney";
            } else {
                // if (props?.user?.user?.balanceSub === 0) {
                //     return "Gnomoney";
                // }
                // else {
                // Play
                //Linking.openURL(g.value.currentGoToLink).catch((err) => console.error('An error occurred', err));
                //props.navigation.navigate("Webview");
                return 'ok';
                //}
            }
        }
    }

    setClick() {
        g.value.canClick = false;
        let myInterval = setInterval(function () {
            g.value.canClick = true;
            clearInterval(myInterval);
        }, 1000);
    }

    checkBlacklist(partner: string) {
        if (Platform.OS === 'android' && g.value.blacklistNativeAndroid.indexOf(partner) !== -1)
            return true;
        if (Platform.OS === 'ios' && g.value.blacklistNativeIOS.indexOf(partner) !== -1)
            return true;
        return false;
    }

    //using for webgame
    checkAndGoLink(link: string, isLandscape: boolean, props: any) {
        g.sound.play('bet_click');
        g.value.isNative = '';
        g.value.isLandscape = isLandscape;
        g.value.gameName = '';

        g.api.getRealLink(link).then(res => {
            if (res.data?.status === 'OK') {
                g.value.currentGoToLink = res.data?.data?.url_mobile;
                g.value.canPlay = g.fn.gotoLink(props, false, true);
            } else {
                if (props.user.user.username !== '') {
                    showMessage({ message: "Game đang bảo trì! Vui lòng quay lại sau!", type: 'warning', icon: { icon: 'warning', position: "left" } });
                } else {
                    props.navigation.navigate('LoginAndRegister');
                }
            }
        })
    }

    ////////////////////// number to string currency ////////////////////
    convert_block_three(number: any) {
        if (number == '000') return '';
        var _a = number + ''; //Convert biến 'number' thành kiểu string

        //Kiểm tra độ dài của khối
        switch (_a.length) {
            case 0: return '';
            case 1: return chuHangDonVi[_a];
            case 2: return this.convert_block_two(_a);
            case 3:
                var chuc_dv = '';
                if (_a.slice(1, 3) != '00') {
                    chuc_dv = this.convert_block_two(_a.slice(1, 3));
                }
                var tram = chuHangTram[_a[0]] + ' trăm';
                return tram + ' ' + chuc_dv;
        }
    }

    convert_block_two(number: any) {
        var dv = chuHangDonVi[number[1]];
        var chuc = chuHangChuc[number[0]];
        var append = '';

        // Nếu chữ số hàng đơn vị là 5
        if (number[0] > 0 && number[1] == 5) {
            dv = 'lăm'
        }

        // Nếu số hàng chục lớn hơn 1
        if (number[0] > 1) {
            append = ' mươi';

            if (number[1] == 1) {
                dv = ' mốt';
            }
        }

        return chuc + '' + append + ' ' + dv;
    }
    to_vietnamese(number: any) {
        var str = parseInt(number) + '';
        var i = 0;
        var arr = [];
        var index = str.length;
        var result = [];
        var rsString = '';

        if (index == 0 || str == 'NaN') {
            return '';
        }

        // Chia chuỗi số thành một mảng từng khối có 3 chữ số
        while (index >= 0) {
            arr.push(str.substring(index, Math.max(index - 3, 0)));
            index -= 3;
        }

        // Lặp từng khối trong mảng trên và convert từng khối đấy ra chữ Việt Nam
        for (i = arr.length - 1; i >= 0; i--) {
            if (arr[i] != '' && arr[i] != '000') {
                result.push(this.convert_block_three(arr[i]));

                // Thêm đuôi của mỗi khối
                if (dvBlock[i]) {
                    result.push(dvBlock[i]);
                }
            }
        }

        // Join mảng kết quả lại thành chuỗi string
        rsString = result.join(' ');

        // Trả về kết quả kèm xóa những ký tự thừa
        return rsString.replace(/[0-9]/g, '').replace(/ /g, ' ').replace(/ $/, '').replace('  ',' ');
    }
    //////////////////////end currency ////////////////////////////

}

export default new Function();

export const callNumber = (phone: any) => () => {
    //console.log('callNumber ----> ', phone);
    g.sound.play('bet_click');
    let phoneNumber = phone;
    if (Platform.OS !== 'android') {
        phoneNumber = `telprompt:${phone}`;
    }
    else {
        phoneNumber = `tel://${phone}`;
    }
    Linking.canOpenURL(phoneNumber)
        .then(supported => {
            if (!supported) {
                Alert.alert('Phone number is not available');
            } else {
                return Linking.openURL(phoneNumber);
            }
        })
        .catch(err => console.log(err));
};