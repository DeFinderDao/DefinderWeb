import ApiClient from '../../utils/ApiClient'
import {
    ApplicationResponse,
    ApplicationSearchInfo,
} from 'redux/types/ApplicationTypes'
import { ThunkAction } from 'redux-thunk'
import { Action } from 'redux'
import { AppState } from 'redux/reducers'
import { Response } from 'redux/types';
  
  
export const ADDR_LIST_LOADING = 'addr_list_loading'
  
export const APPLICATIONA_CLEAR_TABLE_LIST = 'application_clear_table_list'
  
export const GET_APPLICATION_TYPE_LIST_SUCCESS = 'application_type_list_success'
export const GET_APPLICATION_TYPE_LIST_FAIL = 'application_type_list_fail'

  
export const GET_APPLICATION_TRADELIST_SUCCESS =
    'application_trade_list_success'
export const GET_APPLICATION_TRADELIST_FAIL = 'application_trade_list_fail'

  
export const GET_APPLICATION_TRANSFERLIST_SUCCESS =
    'application_transfer_list_success'
export const GET_APPLICATION_TRANSFERLIST_FAIL =
    'application_transfer_list_fail'

  
export const GET_APPLICATION_HOLDERLIST_SUCCESS =
    'application_holder_list_success'
export const GET_APPLICATION_HOLDERLIST_FAIL = 'application_holder_list_fail'

  
export const GET_APPLICATION_LUCKLIST_SUCCESS = 'application_luck_list_success'
export const GET_APPLICATION_LUCKLIST_FAIL = 'application_luck_list_fail'

  
export const addrListLoading = (data: boolean) => ({
    type: ADDR_LIST_LOADING,
    payload: data,
})

  
export const clearTableList = () => ({
    type: APPLICATIONA_CLEAR_TABLE_LIST,
})

  
export const getApplicationTypeList =
    (): ThunkAction<void, AppState, null, Action<string>> =>
    async (dispatch) => {
        try {
            const apiClient = new ApiClient<ApplicationResponse>()
            const data = await apiClient.get('/dapp/type/list')
            dispatch(getApplicationTypeListSuccess(data))
        } catch (e) {
            dispatch(getApplicationTypeListFail(e))
        }
    }

  
export const getApplicationTypeListSuccess = (data:Response<ApplicationResponse>) => ({
    type: GET_APPLICATION_TYPE_LIST_SUCCESS,
    payload: data,
})

  
export const getApplicationTypeListFail = (e: Error) => ({
    type: GET_APPLICATION_TYPE_LIST_FAIL,
    payload: e,
})

  
export const getApplicationTradeList =
    (
        code: string,
        params: ApplicationSearchInfo
    ): ThunkAction<void, AppState, null, Action<string>> =>
    async (dispatch) => {
        dispatch(addrListLoading(true))
        try {
            const apiClient = new ApiClient<ApplicationResponse>()
            const data = await apiClient.post(`/dapp/${code}/swap/list`, {
                data: params,
            })
            dispatch(getApplicationTradeListSuccess(data))
        } catch (e) {
            dispatch(getApplicationTradeListFail(e))
        }
    }

  
export const getApplicationTradeListSuccess = (data:Response<ApplicationResponse>) => ({
    type: GET_APPLICATION_TRADELIST_SUCCESS,
    payload: data,
})

  
export const getApplicationTradeListFail = (e: Error) => ({
    type: GET_APPLICATION_TRADELIST_FAIL,
    payload: e,
})

  
export const getApplicationTransferList =
    (
        code: string,
        params: ApplicationSearchInfo
    ): ThunkAction<void, AppState, null, Action<string>> =>
    async (dispatch) => {
        dispatch(addrListLoading(true))
        try {
            const apiClient = new ApiClient<ApplicationResponse>()
            const data = await apiClient.post(`/dapp/${code}/transfer/list`, {
                data: params,
            })
            dispatch(getApplicationTransferListSuccess(data))
        } catch (e) {
            dispatch(getApplicationTransferListFail(e))
        }
    }

  
export const getApplicationTransferListSuccess = (data:Response<ApplicationResponse>) => ({
    type: GET_APPLICATION_TRANSFERLIST_SUCCESS,
    payload: data,
})

  
export const getApplicationTransferListFail = (e: Error) => ({
    type: GET_APPLICATION_TRANSFERLIST_FAIL,
    payload: e,
})

  
export const getApplicationHolderList =
    (
        code: string,
        params: ApplicationSearchInfo
    ): ThunkAction<void, AppState, null, Action<string>> =>
    async (dispatch) => {
        dispatch(addrListLoading(true))
        try {
            const apiClient = new ApiClient<ApplicationResponse>()
            const data = await apiClient.get(
                `/dapp/${code}/holder/list`,
                {
                    params: params,
                }
            )
            dispatch(getApplicationHolderListSuccess(data))
        } catch (e) {
            dispatch(getApplicationHolderListFail(e))
        }
    }

  
export const getApplicationHolderListSuccess = (data:Response<ApplicationResponse>) => ({
    type: GET_APPLICATION_HOLDERLIST_SUCCESS,
    payload: data,
})

  
export const getApplicationHolderListFail = (e: Error) => ({
    type: GET_APPLICATION_HOLDERLIST_FAIL,
    payload: e,
})

  
export const getApplicationLuckList =
    (
        code: string,
        params: ApplicationSearchInfo
    ): ThunkAction<void, AppState, null, Action<string>> =>
    async (dispatch) => {
        dispatch(addrListLoading(true))
        try {
            const apiClient = new ApiClient<ApplicationResponse>()
            const data = await apiClient.get(
                `/dapp/${code}/lock/list`,
                {
                    params: params,
                }
            )
            dispatch(getApplicationLuckListSuccess(data))
        } catch (e) {
            dispatch(getApplicationLuckListFail(e))
        }
    }

  
export const getApplicationLuckListSuccess = (data:Response<ApplicationResponse>) => ({
    type: GET_APPLICATION_LUCKLIST_SUCCESS,
    payload: data,
})

  
export const getApplicationLuckListFail = (e: Error) => ({
    type: GET_APPLICATION_LUCKLIST_FAIL,
    payload: e,
})
