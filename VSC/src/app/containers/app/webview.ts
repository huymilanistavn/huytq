import { connect } from 'react-redux';
import Webview from '../../components/app/webview';
const mapStateToProps = (state: any) => ({
    user: state,
});

const mapDispatchToProps = (dispatch: any) => ({
    userTransfer: (amount: number, strType: string)=>{
        dispatch({
            type: "AMOUNT_TRANSFER",
            amount,
            strType,
        });
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Webview);