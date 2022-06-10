import ApiClient from 'utils/ApiClient';
import { InviteDetailData, PageMode, UserInfoResponse } from 'redux/types/UserInfoTypes';
import { ThunkAction } from 'redux-thunk';
import { Action } from 'redux';
import { AppState } from 'redux/reducers';
import Storage, { KEY_CONNECT_WALLET_TYPE, KEY_USER_TOKEN, KEY_USER_UUID,userLoginOut } from 'utils/storage'
import { loginOutChanceWarning } from 'redux/actions/ChanceWarningAction'
import { loginOutCombination } from 'redux/actions/AddressCombinationAction'
import { loginOutMarket } from 'redux/actions/MarketPageAction'
import { loginOutSetWarning } from 'redux/actions/SetWarningAction'
import * as ethUtil from 'ethereumjs-util'
import { Response } from 'redux/types';
import { startWorker } from 'utils/webWorker/worker';
import WalletConnect from '@walletconnect/client';
import { message } from 'antd';
  
export const GET_USERINFO_SUCCESS = "get_userinfo_success";
export const GET_USERINFO_FAIL = "get_userinfo_fail";
export const USER_LOGINOUT_SUCCESS = "user_login_out_success";
export const SET_USER_PHONE_SUCCESS = "set_phone";
export const SET_USER_EMAIL_SUCCESS = "set_email";
export const SET_USER_TELEGRAM_SUCCESS = "set_telegram";
const apiClient = new ApiClient<UserInfoResponse>();
export const SHOW_WALLET_DIALOG = "show_wallet_dialog";
export const HIDE_WALLET_DIALOG = "hide_wallet_dialog";
export const REQUEST_METAMASK_LOGIN = "request_metamask_login";
  
export const SET_CONNECT_WALLET_PAGE_STATE = "set_connect_wallet_page_state";
export const METAMASK_CONNECTING = "metamask_connecting";
export const METAMASK_NOT_INSTALL = "metamask_not_install";
export const METAMASK_CONNECT_FAIL = "metamask_connect_fail";
export const METAMASK_CONNECT_SUCCESS = "metamask_connect_success";
  
export const SET_USER_ADDRESS = "set_user_address";
  
export const SET_CONNECT_WALLET_TYPE = 'set_connect_wallet_type';
  
export const REQUEST_SIGN_MESSAGE = "request_sign_message";
export const CHANGE_ADDRESS_ERROR = "change_address_error";
  
export const SET_PAGE_MODE = 'set_page_mode';
  
export const TROGGLE_ALERT_STATUS = 'troggle_alert_status_success';
  
export const SET_PAY_PRO_SUCCESS_VISIBLE_DIALOG = 'set_pay_pro_success_dialog';
  
export const SET_USER_BEGIN_GUIDE_STATE = "set_user_begin_guide_state";
  
export const SET_USER_INVITE_INFO = "set_user_invite_info";
  
export const SET_USER_INVITE_CODE = 'set_user_invite_code';

  
export const getUserInfo = () : ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    try {
        const result = await apiClient.get('/auth/userInfo');
        dispatch(getUserInfoSuccess(result.data));
    } catch(e) {
        dispatch(getUserInfoFail(e));
    }
}

export const loginOutSuccess = () => ({ type: USER_LOGINOUT_SUCCESS})

  
export const getUserInfoSuccess = (data: UserInfoResponse) => ({ type: GET_USERINFO_SUCCESS, payload: data })

  
export const getUserInfoFail = (e: Error) => ({ type: GET_USERINFO_FAIL, payload: e })

  
export const showWalletDialog = () => ({type: SHOW_WALLET_DIALOG});

  
export const hideWalletDialog = () => ({type : HIDE_WALLET_DIALOG});

  
export const setMetamaskConnectStatus = (status: string) => ({
    type: SET_CONNECT_WALLET_PAGE_STATE,
    payload: status
});

  
export const setUserPhone = (phone : string) => ({
    type: SET_USER_PHONE_SUCCESS,
    payload: phone
})

  
export const setUserTelegram = (telegramId: string) => ({
    type: SET_USER_TELEGRAM_SUCCESS,
    payload: telegramId
})

  
export const setUserEmail = (email : string) => ({
    type: SET_USER_EMAIL_SUCCESS,
    payload: email
})

export const setPageMode = (mode: PageMode) => ({
    type: SET_PAGE_MODE,
    payload: mode
});

  
export const troggleAlertStatus = (type: number) => ({
    type: TROGGLE_ALERT_STATUS,
    payload: type
});

declare global {
    interface Window {
        ethereum: any;
    }
  }

declare var ethereum: any;

interface NonceResponse {
    nonce: string,
    nonceMsg: string
}

interface LoginResponse {
    uuid: string,
    token: string,

}

interface JsonRpcResponse {
    id: string | undefined;
    jsonrpc: '2.0';
    method: string;
    result?: unknown;
    error?: Error;
  }

  
export const connectMetamaskWallet = (inviteCode : string) : ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    if (!window.ethereum) {
          
        dispatch(setMetamaskConnectStatus('CONNECT_NO_PLUGIN'))
        return
    } 

      
    if (window.ethereum) {
        try {
            dispatch(setMetamaskConnectStatus('CONNECTING'))
            dispatch(setConnectType("0"));
            const accounts = await ethereum.request({
                method: 'eth_requestAccounts',
            })
            const account = accounts[0]
            const apiClient = new ApiClient<NonceResponse>();
            const nonceResult = await apiClient.get(`/auth/sign/nonce?address=${account}`);
              
            const {nonce,nonceMsg} = nonceResult.data;
            const from = account
            const msg = ethUtil.bufferToHex(new Buffer(nonceMsg, 'utf8'))
            const params = [msg,from]
            const method = 'personal_sign'
            ethereum.sendAsync(
                {
                    method,
                    params,
                    from,
                },
                async (err : Error, result:JsonRpcResponse) => {
                    if(err) {
                        dispatch(setMetamaskConnectStatus('CONNECT_FAIL'));
                        return;
                    }
                    
                    try {
                          
                        const loginServerResult = await apiClient.post('/auth/login',{
                            data: {
                                address: from,
                                sign: result.result,
                                nonce: nonce,
                                inviteCode
                            }
                        });

                          
                        const storage = new Storage()
                        const loginResult = loginServerResult as unknown as Response<LoginResponse>;
                        storage.set(KEY_USER_UUID, loginResult.data.uuid)
                        const authorization = window.btoa(
                            unescape(
                                encodeURIComponent(
                                    `${loginResult.data.uuid}:${loginResult.data.token}`
                                )
                            )
                        )
                        storage.set(KEY_USER_TOKEN, authorization)
                        localStorage.setItem(KEY_CONNECT_WALLET_TYPE,"0");
                          
                        dispatch(setMetamaskConnectStatus('INIT'));
                        dispatch(setUserAddress(from));
                        dispatch(hideWalletDialog());
                    } catch(e) {

                        dispatch(setMetamaskConnectStatus('CONNECT_FAIL'));
                    }
                }
            )
        } catch (e) {
            dispatch(setMetamaskConnectStatus('CONNECT_FAIL'));
        }
    }
}

  
export const handleWalletConnect = (account: string,connector: WalletConnect,inviteCode: string) : ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    dispatch(setMetamaskConnectStatus('CONNECTING'))
    dispatch(setConnectType("1"));
    const apiClient = new ApiClient<NonceResponse>();
    const nonceResult = await apiClient.get(`/auth/sign/nonce?address=${account}`);
      
    const {nonce,nonceMsg} = nonceResult.data;
    const from = account
    const msg = ethUtil.bufferToHex(new Buffer(nonceMsg, 'utf8'))
    const params = [msg,from]
    try {
        const result = await connector.signPersonalMessage(params)
          
        const loginServerResult = await apiClient.post('/auth/login',{
            data: {
                address: from,
                sign: result,
                nonce: nonce,
                inviteCode
            }
        });

          
        const storage = new Storage()
        const loginResult = loginServerResult as unknown as Response<LoginResponse>;
        storage.set(KEY_USER_UUID, loginResult.data.uuid)
        const authorization = window.btoa(
            unescape(
                encodeURIComponent(
                    `${loginResult.data.uuid}:${loginResult.data.token}`
                )
            )
        )
        storage.set(KEY_USER_TOKEN, authorization)
        localStorage.setItem(KEY_CONNECT_WALLET_TYPE,"1");
          
        dispatch(setMetamaskConnectStatus('INIT'));
        dispatch(setUserAddress(from));
        dispatch(hideWalletDialog());
    } catch (e) {
          
        dispatch(setMetamaskConnectStatus('CONNECT_FAIL'));
    }
}

export const changeAddress = (address: string,inviteCode: string) : ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    try {
        const apiClient = new ApiClient<NonceResponse>();
        const nonceResult = await apiClient.get(`/auth/sign/nonce?address=${address}`);
          
        const {nonce,nonceMsg} = nonceResult.data;
        const from = address
        const msg = ethUtil.bufferToHex(new Buffer(nonceMsg, 'utf8'))
        const params = [msg,from]
        const method = 'personal_sign'
        ethereum.sendAsync(
            {
                method,
                params,
                from,
            },
            async (err: Error, result:JsonRpcResponse) => {
                if(err) {
                    return;
                }
                
                try {
                      
                    const loginServerResult = await apiClient.post('/auth/login',{
                        data: {
                            address: from,
                            sign: result.result,
                            nonce: nonce,
                            inviteCode
                        }
                    });

                    const loginResult = loginServerResult as unknown as Response<LoginResponse>;
                      
                    const storage = new Storage()
                    storage.set(KEY_USER_UUID, loginResult.data.uuid)
                    const authorization = window.btoa(
                        unescape(
                            encodeURIComponent(
                                `${loginResult.data.uuid}:${loginResult.data.token}`
                            )
                        )
                    )
                    storage.set(KEY_USER_TOKEN, authorization)
                    dispatch(setUserAddress(from));
                } catch(e) {
                    dispatch(changeAddressError(e));
                }
            }
        )
    } catch (e) {
        dispatch(changeAddressError(e));
    }
}

export const changeAddressError = (error: Error) => ({
    type: CHANGE_ADDRESS_ERROR,
    payload: error
})

export const setUserAddress = (address: string) => ({
    type: SET_USER_ADDRESS,
    payload: address
});

  
export const setConnectType = (type: string) => ({
    type: SET_CONNECT_WALLET_TYPE,
    payload: type
});

export const requestLoginOut = (): ThunkAction<void, AppState, null, Action<string>> => (dispatch) => {
    userLoginOut()
    dispatch(loginOutSuccess())
    dispatch(loginOutChanceWarning())
    dispatch(loginOutCombination())
    dispatch(loginOutMarket())
    dispatch(loginOutSetWarning())
}

export const setPaySuccessDialogVisible = (visible: boolean) => ({
    type: SET_PAY_PRO_SUCCESS_VISIBLE_DIALOG,
    payload: visible
})

export const changeUserTeachState = (state: number) => ({
    type: SET_USER_BEGIN_GUIDE_STATE,
    payload: state
})

export const getUserInviteDetailInfo = () : ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    const apiClient = new ApiClient<InviteDetailData>();
    apiClient.get('/invite/base').then(
        success => {
            dispatch(setUserInviteDetailInfo(success.data));
        },
        fail => {
            message.error(fail.message);
        }
    );
}

export const setUserInviteDetailInfo = (inviteDetail : InviteDetailData) => ({
    type: SET_USER_INVITE_INFO,
    payload: inviteDetail
})

export const setUserInviteCode = (inviteCode : string) => ({
    type: SET_USER_INVITE_CODE,
    payload: inviteCode
})