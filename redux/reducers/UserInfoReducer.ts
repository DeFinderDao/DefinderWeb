import {
    GET_USERINFO_FAIL,
    GET_USERINFO_SUCCESS,
    USER_LOGINOUT_SUCCESS,
    SHOW_WALLET_DIALOG,
    HIDE_WALLET_DIALOG,
    SET_CONNECT_WALLET_PAGE_STATE,
    SET_USER_ADDRESS,
    CHANGE_ADDRESS_ERROR,
    SET_USER_EMAIL_SUCCESS,
    SET_USER_PHONE_SUCCESS,
    SET_USER_TELEGRAM_SUCCESS,
    SET_PAGE_MODE,
    TROGGLE_ALERT_STATUS,
    SET_PAY_PRO_SUCCESS_VISIBLE_DIALOG,
    SET_USER_BEGIN_GUIDE_STATE,
    SET_CONNECT_WALLET_TYPE,
    SET_USER_INVITE_INFO,
    SET_USER_INVITE_CODE
} from '../actions/UserInfoAction'

import type {UserInfoState,UserInfoActions, GetUserInfoSuccessAction,SetConnectWalletPageStateAction,SetUserAddressAction,ChangeAddressError, SetUserEmailAction, SetUserPhoneAction, SetPageModeAction,ToggleAlertStatusAction, SetUserTelegramAction, SetPaySuccessDialogVisible, SetUserBeginGuideStateAction,SetUserConnectWalletTypeAction,SetUserInviteDetailInfoAction, SetUserInviteCodeAction} from '../types/UserInfoTypes'

const initialState : UserInfoState = {
    phone: '',
    mail: '',
      
    type: '',
      
    address: '',
      
    currentWallet: 'metamask',
      
    showWalletDialog: false,
      
      
      
      
      
    connectWalletPageState: 'INIT',
    connectType: '0',
    error: null,
    pageMode: 'dark',
    telegramId: null,
    languageType: 0,
    browserWarn: 0,
    emailWarn: 0,
    telegramWarn: 0,
      
    level: 0,
    endTime: 0,
    showPaySuccessDialog: false,
      
    noviceBootStatus: 1,
      
    experienceCardStatus: 1,
      
    levelId: 0,
    inviteCode: '',
}

const reducer = (state = initialState, actions : UserInfoActions) => {
    const {type} = actions;
    switch (type) {
        case GET_USERINFO_SUCCESS: {
            const {payload} = actions as GetUserInfoSuccessAction;
            return {
                ...state,
                phone: payload.phone,
                type: payload.type,
                address: payload.address,
                mail: payload.mail,
                telegramId: payload.telegramId,
                languageType: payload.languageType,
                browserWarn: payload.browserWarn,
                emailWarn: payload.emailWarn,
                telegramWarn: payload.telegramWarn,
                level: payload.level,
                endTime: payload.endTime,
                noviceBootStatus: payload.noviceBootStatus === null ? 0 : payload.noviceBootStatus,
                experienceCardStatus: payload.experienceCardStatus,
                levelId: payload.levelId
            }
        }
        case USER_LOGINOUT_SUCCESS:
            return {
                ...state,
                phone: '',
                type: '',
                address: '',
                mail: '',
                level: 0,
                noviceBootStatus: 1,
                experienceCardStatus: 1,
                levelId: 0,
                  
                inviteDetail: undefined
            }
        case HIDE_WALLET_DIALOG:
            return {
                ...state,
                showWalletDialog: false
            }
        case SHOW_WALLET_DIALOG:
            return {
                ...state,
                showWalletDialog: true
            }    
        case SET_CONNECT_WALLET_PAGE_STATE: {
            const {payload} = actions as SetConnectWalletPageStateAction;
            return {
                ...state,
                connectWalletPageState: payload
            }
        }
        case SET_USER_ADDRESS: {
            const {payload} = actions as SetUserAddressAction;
            return {
                ...state,
                address: payload
            }    
        }
        case SET_USER_EMAIL_SUCCESS: {
            const {payload} = actions as SetUserEmailAction;
            return {
                ...state,
                mail: payload,
                  
                emailWarn: state.mail === null ? 1 : state.emailWarn
            }
        }
        case SET_USER_PHONE_SUCCESS: {
            const {payload} = actions as SetUserPhoneAction;
            return {
                ...state,
                phone: payload
            }
        }
        case SET_USER_TELEGRAM_SUCCESS: {
            const {payload} = actions as SetUserTelegramAction;
            return {
                ...state,
                telegramId: payload,
                  
                telegramWarn: state.telegramId === null ? 1 : state.telegramWarn
            }
        }
        case CHANGE_ADDRESS_ERROR: {
            const {payload} = actions as ChangeAddressError;
            return {
                ...state,
                error: payload
            }      
        }
        case SET_PAGE_MODE: {
            const {payload} = actions as SetPageModeAction;
            return {
                ...state,
                pageMode: payload
            }
        }
        case TROGGLE_ALERT_STATUS: {
            const {payload} = actions as ToggleAlertStatusAction;
            switch (payload) {
                case 1:
                    return {
                        ...state,
                        languageType: state.languageType === 0 ? 1 : 0
                    }
                case 2:
                    return {
                        ...state,
                        browserWarn: state.browserWarn === 0 ? 1 : 0
                    }    
                case 3:
                    return {
                        ...state,
                        telegramWarn: state.telegramWarn === 0 ? 1 : 0
                    }    
                case 4: 
                default:
                    return {
                        ...state,
                        emailWarn: state.emailWarn === 0 ? 1 : 0
                    }        
            }
        }
        case SET_PAY_PRO_SUCCESS_VISIBLE_DIALOG: {
            const {payload} = actions as SetPaySuccessDialogVisible;
            return {
                ...state,
                showPaySuccessDialog: payload
            }
        }
        case SET_USER_BEGIN_GUIDE_STATE: {
            const {payload} = actions as SetUserBeginGuideStateAction;
            return {
                ...state,
                noviceBootStatus: payload
            }
        }
        case SET_CONNECT_WALLET_TYPE: {
            const {payload} = actions as SetUserConnectWalletTypeAction;
            return {
                ...state,
                connectType: payload
            }
        }
        case SET_USER_INVITE_INFO: {
            const {payload} = actions as SetUserInviteDetailInfoAction;
            return {
                ...state,
                inviteDetail: payload
            }
        }
        case SET_USER_INVITE_CODE: {
            const {payload} = actions as SetUserInviteCodeAction;
            return {
                ...state,
                inviteCode: payload
            }
        }
        case GET_USERINFO_FAIL:
        default:
            return state
    }
}

export default reducer