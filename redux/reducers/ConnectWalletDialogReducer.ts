import type { Action } from 'redux';
import type { ConnectWalletDialogState } from 'redux/types/ConnectWalletDialogTypes';
import {ACTION_OPEN_CONNECT_WALLET_DIALOG,ACTION_CLOSE_CONNECT_WALLET_DIALOG} from '../actions/ConnectWalletDialogAction';

const initialState : ConnectWalletDialogState = {
    isOpen : true
}

const reducer = (state = initialState, { type } : Action<string>) => {
    switch (type) {
        case ACTION_OPEN_CONNECT_WALLET_DIALOG:
            return {
                ...state,
                isOpen: true
            }
            break
        case ACTION_CLOSE_CONNECT_WALLET_DIALOG:
            return {
                ...state,
                isOpen: false
            }
            break
        default:
            return state
    }
}

export default reducer