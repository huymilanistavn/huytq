import { connect } from 'react-redux';
import App from '../../components/app/app';

const mapStateToProps = (state: any) => ({
    user: state,
});

const mapDispatchToProps = (dispatch: any) => ({
    refresh: (navigation: any) => {
        dispatch({
            type: "HANDLE_REFRESH",
            navigation,
        });
    },
    userTransfer: (amount: number, strType: string)=>{
        dispatch({
            type: "AMOUNT_TRANSFER",
            amount,
            strType,
        });
    },
    userUpdateinfo: (fullname: string, email: string, phone: string) => {
        dispatch({
            type: "UPDATEINFO",
            fullname,
            email,
            phone
        });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
