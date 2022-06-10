import ApiClient from 'utils/ApiClient';
import {
    ResponseBodyList,
    SymbolList,
    TradeList,
    TransferList,
    LpList, 
    SearchInfo
} from 'redux/types/AddressDynamicTypes';
import { ThunkAction } from 'redux-thunk';
import { Action } from 'redux';
import { AppState } from 'redux/reducers';
import { Response } from 'redux/types';
const apiClient = new ApiClient();

  
  
export const ADDR_LIST_LOADING = 'dynamic_addr_list_loading'
  
export const ADDR_LIST_NOMORE = 'dynamic_addr_list_nomore'
  
export const SET_SEARCH_INFO = 'dynamic_set_search_info'

  
export const GET_ADDR_SYMBOL_LIST_SUCCESS = 'dynamic_addr_symbol_list_success'
export const GET_ADDR_SYMBOL_LIST_FAIL = 'dynamic_addr_symbol_list_fail'

  
export const GET_ADDR_TRADE_LIST_SUCCESS = 'dynamic_addr_trade_list_success'
export const GET_ADDR_TRADE_LIST_FAIL = 'dynamic_addr_trade_list_fail'

  
export const GET_ADDR_TRANSFER_LIST_SUCCESS =
    'dynamic_addr_transfer_list_success'
export const GET_ADDR_TRANSFER_LIST_FAIL = 'dynamic_addr_transfer_list_fail'

  
export const GET_ADDR_LP_LIST_SUCCESS = 'dynamic_addr_lp_list_success'
export const GET_ADDR_LP_LIST_FAIL = 'dynamic_addr_lp_list_fail'

  
export const addrListLoading = (data: boolean) => ({
    type: ADDR_LIST_LOADING,
    payload: data,
})
  
export const addrListNoMore = (data: boolean) => ({
    type: ADDR_LIST_NOMORE,
    payload: data,
})
  
export const setSearchInfo = (data: SearchInfo | null) => ({
    type: SET_SEARCH_INFO,
    payload: data,
})

  
export const getAddrSymbolList = (): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    try {
        const response = await apiClient.get('/symbol/list')
        const data = response as unknown as Response<SymbolList[]>;
        dispatch(getAddrSymbolListSuccess(data))
    } catch (e) {
        dispatch(getAddrSymbolListFail(e))
    }
}
  
export const getAddrSymbolListSuccess = (data: Response<SymbolList[]>) => ({
    type: GET_ADDR_SYMBOL_LIST_SUCCESS,
    payload: data,
})
  
export const getAddrSymbolListFail = (e: Error) => ({
    type: GET_ADDR_SYMBOL_LIST_FAIL,
    payload: e,
})

  
export const getAddrTradeList = (params: SearchInfo): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    dispatch(addrListLoading(true))
    try {
        const response = await apiClient.post('/symbol/swap/list', {
            data: params,
        })
        const data = response as unknown as Response<ResponseBodyList<TradeList[]>>;
        if (
            (params.pageNo > 1 && data.data.list.length > 0) ||
            params.pageNo == 1
        ) {
              
            dispatch(getAddrTradeListSuccess(data))
        } else {
              
            dispatch(addrListNoMore(true))
        }
    } catch (e) {
        dispatch(getAddrTradeListFail(e))
    }
}
  
export const getAddrTradeListSuccess = (data: Response<ResponseBodyList<TradeList[]>>) => ({
    type: GET_ADDR_TRADE_LIST_SUCCESS,
    payload: data,
})
  
export const getAddrTradeListFail = (e: Error) => ({
    type: GET_ADDR_TRADE_LIST_FAIL,
    payload: e,
})

  
export const getAddrTransferList = (params: SearchInfo): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    dispatch(addrListLoading(true))
    try {
        const response = await apiClient.post('/symbol/transfer/list', {
            data: params,
        })
        const data = response as unknown as Response<ResponseBodyList<TransferList[]>>;
        if (
            (params.pageNo > 1 && data.data.list.length > 0) ||
            params.pageNo == 1
        ) {
              
            dispatch(getAddrTransferListSuccess(data))
        } else {
              
            dispatch(addrListNoMore(true))
        }
    } catch (e) {
        dispatch(getAddrTransferListFail(e))
    }
}
  
export const getAddrTransferListSuccess = (data: Response<ResponseBodyList<TransferList[]>>) => ({
    type: GET_ADDR_TRANSFER_LIST_SUCCESS,
    payload: data,
})
  
export const getAddrTransferListFail = (e: Error) => ({
    type: GET_ADDR_TRANSFER_LIST_FAIL,
    payload: e,
})

  
export const getAddrLpList = (params: SearchInfo): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    dispatch(addrListLoading(true))
    try {
        const response = await apiClient.post('/symbol/lp/list', {
            data: params,
        })
        const data = response as unknown as Response<ResponseBodyList<LpList[]>>;
        if (
            (params.pageNo > 1 && data.data.list.length > 0) ||
            params.pageNo == 1
        ) {
              
            dispatch(getAddrLpListSuccess(data))
        } else {
              
            dispatch(addrListNoMore(true))
        }
    } catch (e) {
        dispatch(getAddrLpListFail(e))
    }
}
  
export const getAddrLpListSuccess = (data: Response<ResponseBodyList<LpList[]>>) => ({
    type: GET_ADDR_LP_LIST_SUCCESS,
    payload: data,
})
  
export const getAddrLpListFail = (e: Error) => ({
    type: GET_ADDR_LP_LIST_FAIL,
    payload: e,
})
