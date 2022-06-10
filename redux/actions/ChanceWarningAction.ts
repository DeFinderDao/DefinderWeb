import ApiClient from '../../utils/ApiClient'
import { ThunkAction } from 'redux-thunk'
import { Action } from 'redux'
import { AppState } from 'redux/reducers'
import { Response } from 'redux/types'
import {
    SearchInfo,
    WarningAddrList,
    WarningData,
    WarningDataItem,
    InnerData,
    WarningAddrListResponse,
    WarningDataResponse,
    WarnStatistics,
    WarnSymbol,
} from 'redux/types/ChanceWarningTypes'

  
  
export const WARNING_LOADING = 'warning_loading'
  
export const USER_LOGINOUT_SUCCESS = 'warning_user_login_out_success'
  
export const GET_WARNING_ADDR_LIST_SUCCESS = 'warning_addr_list_success'
export const GET_WARNING_ADDR_LIST_FAIL = 'warning_addr_list_fail'
  
export const GET_WARNING_LOG_LIST_SUCCESS = 'warning_log_list_success'
export const GET_WARNING_LOG_LIST_FAIL = 'warning_log_list_fail'
  
export const GET_WARNING_STATISTICS_SUCCESS = "warning_statistics_success";
  
export const SET_WARNING_ITEM_INDEX = 'set_warning_item_index';
  
export const SET_WARNING_LOG_CONDITION = 'set_warning_condition';
  
export const MARK_ALL_WARNING_READED = 'mark_all_warning_readed';
  
export const MARK_ONE_WARNING_LOG_READED = 'mark_one_warning_log_readed';
  
export const GET_WARNING_SYMBOL_LIST_SUCCESS = 'warning_symbol_list_success'
  
export const warningLoading = (data: boolean) => ({
    type: WARNING_LOADING,
    payload: data,
})
  
export const loginOutChanceWarning = () => ({ type: USER_LOGINOUT_SUCCESS })
  
export const getWarningAddrList =
    (): ThunkAction<void, AppState, null, Action<string>> =>
    async (dispatch) => {
        dispatch(warningLoading(true))
        try {
            const apiClient = new ApiClient<WarningAddrListResponse>()
            const data = await apiClient.get(`/warn/warn/log/address`)
            dispatch(getWarningAddrListSuccess(data))
        } catch (e) {
            dispatch(getWarningAddrListFail(e as Error))
        }
}

  
export const getWarningSymbolList = (): ThunkAction<void, AppState, null, Action<string>> =>
async (dispatch) => {
    try {
        const apiClient = new ApiClient<WarnSymbol[]>()
        const data = await apiClient.get(`/warn/list/symbol`)
        dispatch(getWarningSymbolListSuccess(data.data))
    } catch (e) {
        
    }
}

  
export const getWarningAddrListSuccess = (
    data: Response<WarningAddrList<InnerData[]>>
) => ({
    type: GET_WARNING_ADDR_LIST_SUCCESS,
    payload: data,
})

export const getWarningSymbolListSuccess = (
    data: WarnSymbol[]
) => ({
    type: GET_WARNING_SYMBOL_LIST_SUCCESS,
    payload: data,
})

  
export const getWarningAddrListFail = (e: Error) => ({
    type: GET_WARNING_ADDR_LIST_FAIL,
    payload: e,
})

  
export const getWarningLogList =
    (params: SearchInfo): ThunkAction<void, AppState, null, Action<string>> =>
    async (dispatch) => {
        dispatch(warningLoading(true))
        try {
            const apiClient = new ApiClient<WarningDataResponse>()
            const data: SearchInfo = {
                ...params,
                symbolAddr: params.symbolAddr === '0' ? undefined : params.symbolAddr,
                warnType: params.warnType === '0' ? undefined : params.warnType,
                isView: params.isView === '0' ? undefined : (Number(params.isView) - 1).toString(),
                addressTag: params.addressTag === '0' ? undefined : params.addressTag
            }
            delete data.symbolName;
            const result = await apiClient.post('warn/list/log', {
                data: data,
            })
            dispatch(getWarningLogListSuccess(result))
        } catch (e) {
            dispatch(getWarningLogListFail(e as Error))
        }
    }

  
export const getWarningLogListSuccess = (
    data: Response<WarningData<WarningDataItem[]>>
) => ({
    type: GET_WARNING_LOG_LIST_SUCCESS,
    payload: data,
})

  
export const getWarningLogListFail = (e: Error) => ({
    type: GET_WARNING_LOG_LIST_FAIL,
    payload: e,
})

  
export const getWarningStatistics =(): ThunkAction<void, AppState, null, Action<string>> =>
    async (dispatch) => {
        dispatch(warningLoading(true))
        try {
            const apiClient = new ApiClient<WarnStatistics>()
            const data = await apiClient.get('/warn/data/statistics');
            dispatch(getWarnSatisticsSuccess(data.data))
        } catch (e) {
            
        }
}

  
export const getWarnSatisticsSuccess = (data: WarnStatistics) => ({
    type: GET_WARNING_STATISTICS_SUCCESS,
    payload: data,
});

  
export const setWarningItemIndex = (index: number) => ({
    type: SET_WARNING_ITEM_INDEX,
    payload: index
})

  
export const setWarningLogCondition = (warningLogCondition: SearchInfo) => ({
    type: SET_WARNING_LOG_CONDITION,
    payload: warningLogCondition
})

  
export const markAllWarningLogReaded = () => ({
    type: MARK_ALL_WARNING_READED
})

  
export const markOneWarningLogReaded = (id: number): ThunkAction<void, AppState, null, Action<string>> =>
    async (dispatch) => {
        try {
            const apiClient = new ApiClient()
            await apiClient.post('/warn/clear/read',{
                data: {
                    ids: [id]
                }
            });
            const data = await apiClient.get('/warn/data/statistics');
            dispatch(getWarnSatisticsSuccess(data.data as WarnStatistics))
            dispatch(markOneWarningLogReadedSuccess(id))
        } catch (e) {
            
        }
}

export const markOneWarningLogReadedSuccess = (id: number) => ({
    type: MARK_ONE_WARNING_LOG_READED,
    payload: id
});