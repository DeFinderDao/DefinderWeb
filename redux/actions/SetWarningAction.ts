import ApiClient from '../../utils/ApiClient'
import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { AppState } from 'redux/reducers'
import { Response } from 'redux/types'
import { SymbolItem, WarningAddressItem, WarningDetailResponse, WarningListParams, WarningListResponse } from 'redux/types/SetWarningTypes'
  
  
export const SET_WARNING_LOADING = 'set_warning_loading'
  
export const USER_LOGINOUT_SUCCESS = 'set_warning_user_login_out_success'
  
export const GET_WARNING_LIST_SUCCESS = 'set_warning_list_success'
export const GET_WARNING_LIST_FAIL = 'set_warning_list_fail'
  
export const GET_WARNING_DETAIL_SUCCESS = 'set_warning_detail_success'
export const GET_WARNING_DETAIL_FAIL = 'set_warning_detail_fail'
  
export const GET_WARNING_ADDRESS_SUCCESS = 'set_warning_address_success'
export const GET_WARNING_ADDRESS_FAIL = 'set_warning_address_fail'
  
export const GET_WARNING_SYMBOL_SUCCESS = 'set_warning_symbol_success'
export const GET_WARNING_SYMBOL_FAIL = 'set_warning_symbol_fail'
  
export const GET_WARNING_FOLLOW__SUCCESS = 'warning_follow_success'
export const GET_WARNING_FOLLOW__FAIL = 'warning_follow_fail'
  
export const setWarningLoading = (data: boolean) => ({
    type: SET_WARNING_LOADING,
    payload: data,
})
  
export const loginOutSetWarning = () => ({ type: USER_LOGINOUT_SUCCESS })
  
export const getWarningList = (params : WarningListParams) : ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    dispatch(setWarningLoading(true))
    try {
        const apiClient = new ApiClient<WarningListResponse>()
        const data = await apiClient.post(`/warn/list`, {
            data: params,
        })
        dispatch(getWarningListSuccess(data))
    } catch (e) {
        dispatch(getWarningListFail(e))
    }
}

  
export const getWarningListSuccess = (data: Response<WarningListResponse>) => ({
    type: GET_WARNING_LIST_SUCCESS,
    payload: data,
})

  
export const getWarningListFail = (e: Error) => ({
    type: GET_WARNING_LIST_FAIL,
    payload: e,
})
  
export const getWarningDetail = (params : {id : string | number}): ThunkAction<Promise<void>, AppState, null, Action<string>> => async (dispatch) => {
    dispatch(setWarningLoading(true))
    try {
        const apiClient = new ApiClient<WarningDetailResponse>()
        const data = await apiClient.get(`/warn/find/info`, {
            params: params,
        })
        dispatch(getWarningDetailSuccess(data))
    } catch (e) {
        dispatch(getWarningDetailFail(e))
    }
}

  
export const getWarningDetailSuccess = (data: Response<WarningDetailResponse>) => ({
    type: GET_WARNING_DETAIL_SUCCESS,
    payload: data,
})

  
export const getWarningDetailFail = (e: Error) => ({
    type: GET_WARNING_DETAIL_FAIL,
    payload: e,
})

  
export const getWarnAddress = () : ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    try {
        const apiClient = new ApiClient<WarningAddressItem[]>();
        const data = await apiClient.post(
            `/warn/follow/list/all`
        )
        dispatch(getWarningAddressSuccess(data))
    } catch (e) {
        dispatch(getWarningAddressSuccess(e))
    }
}
  
export const getWarningAddressSuccess = (data: Response<WarningAddressItem[]>) => ({
    type: GET_WARNING_ADDRESS_SUCCESS,
    payload: data,
})

  
export const getWarningAddressFail = (e: Error) => ({
    type: GET_WARNING_ADDRESS_FAIL,
    payload: e,
})

  
export const getSymbolList = () : ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    try {
        const apiClient = new ApiClient<SymbolItem[]>();
        const data = await apiClient.get(
            `/symbol/warn/list`
        )
        dispatch(getSymbolListSuccess(data))
    } catch (e) {
        dispatch(getSymbolListFail(e))
    }
}
  
export const getSymbolListSuccess = (data : Response<SymbolItem[]>) => ({
    type: GET_WARNING_SYMBOL_SUCCESS,
    payload: data,
})

  
export const getSymbolListFail = (e: Error) => ({
    type: GET_WARNING_SYMBOL_FAIL,
    payload: e,
})