import ApiClient from '../../utils/ApiClient';
import {
    AppDetailDappInfo,
    ResponseTransferChangeBodyList,
    ResponseSwapChangeBodyList,
    AppDetailData,
    SearchInfo,
} from 'redux/types/AppDetailTypes';
import { ThunkAction } from 'redux-thunk';
import { Action } from 'redux';
import { AppState } from 'redux/reducers';
import { Response } from 'redux/types';
const apiClient = new ApiClient();

  
  
export const GET_APPLICATION_DETAIL_INFO_SUCCESS = 'application_detail_info_success'
export const GET_APPLICATION_DETAIL_INFO_FAIL = 'application_detail_info_fail'

  
export const GET_APPLICATION_HOLDERCHANGE_SUCCESS = "application_holder_change_success";
export const GET_APPLICATION_HOLDERCHANGE_FAIL = "application_holder_change_fail";

  
export const GET_APPLICATION_TRANSFERCHANGE_SUCCESS = "application_transfer_change_success";
export const GET_APPLICATION_TRANSFERCHANGE_FAIL = "application_transfer_change_fail";

  
export const GET_APPLICATION_TRADECHANGE_SUCCESS = "application_trade_change_success";
export const GET_APPLICATION_TRADECHANGE_FAIL = "application_trade_change_fail";


  
export const getApplicationDetailInfo = (objCode: string): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    try {
        const response = await apiClient.get(`/dapp/${objCode}/info`);
        const data = response as unknown as Response<AppDetailDappInfo>;
        dispatch(getApplicationDetailInfoSuccess(data));
    } catch (e) {
        dispatch(getApplicationDetailInfoFail(e));
    }
}

  
export const getApplicationDetailInfoSuccess = (data: Response<AppDetailDappInfo>) => ({ type: GET_APPLICATION_DETAIL_INFO_SUCCESS, payload: data })

  
export const getApplicationDetailInfoFail = (e: Error) => ({ type: GET_APPLICATION_DETAIL_INFO_FAIL, payload: e })

  
  
  
  
  
  
  
  
  
  
  
  

  
  

  
  
  

  
export const getApplicationTransferChange = (objCode: string, params: SearchInfo): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    try {
        const response = await apiClient.post(`/dapp/${objCode}/transfer/change`, {
            data: params
        });
        const data = response as unknown as Response<ResponseTransferChangeBodyList<AppDetailData[]>>;
        dispatch(getApplicationTransferChangeSuccess(data));
    } catch (e) {
        dispatch(getApplicationTransferChangeFail(e));
    }
}

  
export const getApplicationTransferChangeSuccess = (data: Response<ResponseTransferChangeBodyList<AppDetailData[]>>) => ({ type: GET_APPLICATION_TRANSFERCHANGE_SUCCESS, payload: data })

  
export const getApplicationTransferChangeFail = (e: Error) => ({ type: GET_APPLICATION_TRANSFERCHANGE_FAIL, payload: e })

  
export const getApplicationTradeChange = (objCode: string, params: SearchInfo): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    try {
        const response = await apiClient.post(`/dapp/${objCode}/swap/change`, {
            data: params
        });
        const data = response as unknown as Response<ResponseSwapChangeBodyList<AppDetailData[]>>;
        dispatch(getApplicationTradeChangeSuccess(data));
    } catch (e) {
        dispatch(getApplicationTradeChangeFail(e));
    }
}

  
export const getApplicationTradeChangeSuccess = (data: Response<ResponseSwapChangeBodyList<AppDetailData[]>>) => ({ type: GET_APPLICATION_TRADECHANGE_SUCCESS, payload: data })

  
export const getApplicationTradeChangeFail = (e: Error) => ({ type: GET_APPLICATION_TRADECHANGE_FAIL, payload: e })

