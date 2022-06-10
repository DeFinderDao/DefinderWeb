import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { AppState } from 'redux/reducers'
import { Response } from 'redux/types'
import { BuyRankListParams, BuyRankListResponse, ComparisonListParams, LPRankListParams, LPRankListResponse, LPRankPieResponse, NewAddressListParams, NewAddressListResponse } from 'redux/types/MarketComponentsTypes'
import ApiClient from 'utils/ApiClient'
const apiClient = new ApiClient()



export const COMPARISON_LOADING = 'comparison_loading'

export const NEW_ADDRESS_LIST_LOADING = 'comparison_new_address_list_loading'

export const BUY_RANK_LIST_LOADING = 'comparison_buy_rank_list_loading'
export const SET_RANK_LIST_PAGENO = 'set_rank_list_pageno';

export const SELL_RANK_LIST_LOADING = 'comparison_sell_rank_list_loading'

export const LP_RANK_LIST_LOADING = 'comparison_lp_rank_list_loading'

export const LP_RANK_PIE_LOADING = 'comparison_lp_rank_pie_loading'

export const MARKET_DETAIL_NEWADDR_LIST_NOMORE =
    'market_detail_newaddr_list_nomore'
export const MARKET_DETAIL_BUYEANK_LIST_NOMORE =
    'market_detail_buyrank_list_nomore'
export const MARKET_DETAIL_SELLEANK_LIST_NOMORE =
    'market_detail_sellrank_list_nomore'
export const MARKET_DETAIL_LPRANK_LIST_NOMORE =
    'market_detail_lprank_list_nomore'

export const GET_COMPARISON_LIST_SUCCESS = 'market_comparison_list_success'
export const GET_COMPARISON_LIST_FAIL = 'market_comparison_list_fail'

export const GET_NEW_ADDRESS_LIST_SUCCESS = 'market_new_address_list_success'
export const GET_NEW_ADDRESS_LIST_FAIL = 'market_new_address_list_fail'

export const GET_BUY_RANK_LIST_SUCCESS = 'market_buy_rank_list_success'
export const GET_BUY_RANK_LIST_FAIL = 'market_buy_rank_list_fail'

export const GET_SELL_RANK_LIST_SUCCESS = 'market_sell_rank_list_success'
export const GET_SELL_RANK_LIST_FAIL = 'market_sell_rank_list_fail'

export const GET_LP_RANK_LIST_SUCCESS = 'market_lp_rank_list_success'
export const GET_LP_RANK_LIST_FAIL = 'market_lp_rank_list_fail'

export const GET_LP_RANK_PIE_SUCCESS = 'market_lp_rank_Pie_success'
export const GET_LP_RANK_PIE_FAIL = 'market_lp_rank_Pie_fail'

export const SET_LP_RANK_LIST_PAGENO = 'set_lp_rank_list_pageno';

export const comparisonLoading = (data: boolean) => ({
    type: COMPARISON_LOADING,
    payload: data,
})
export const newAddrListLoading = (data: boolean) => ({
    type: NEW_ADDRESS_LIST_LOADING,
    payload: data,
})
export const buyRankListLoading = (data: boolean) => ({
    type: BUY_RANK_LIST_LOADING,
    payload: data,
})
export const setRankListPageNo = (data: number) => ({
    type: SET_RANK_LIST_PAGENO,
    payload: data
})
export const sellRankListLoading = (data: boolean) => ({
    type: SELL_RANK_LIST_LOADING,
    payload: data,
})
export const lpRankListLoading = (data: boolean) => ({
    type: LP_RANK_LIST_LOADING,
    payload: data,
})
export const lpRankPieLoading = (data: boolean) => ({
    type: LP_RANK_PIE_LOADING,
    payload: data,
})
// nomore
export const newAddrListNoMore = (data: boolean) => ({
    type: MARKET_DETAIL_NEWADDR_LIST_NOMORE,
    payload: data,
})
export const buyRankListNoMore = (data: boolean) => ({
    type: MARKET_DETAIL_BUYEANK_LIST_NOMORE,
    payload: data,
})
export const sellRankListNoMore = (data: boolean) => ({
    type: MARKET_DETAIL_SELLEANK_LIST_NOMORE,
    payload: data,
})
export const lpRankListNoMore = (data: boolean) => ({
    type: MARKET_DETAIL_LPRANK_LIST_NOMORE,
    payload: data,
})

export const getComparisonList = (params: ComparisonListParams) : ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    dispatch(comparisonLoading(true))
    try {
        const response = await apiClient.post(`/market/positions/list`, {
            data: params,
        })
        const data = response as unknown as Response<ComparisonListParams>
        dispatch(getComparisonListSuccess(data))
    } catch (e) {
        dispatch(getComparisonListFail((e as unknown as Error)))
    }
}

export const getComparisonListSuccess = (data: Response<ComparisonListParams>) => ({
    type: GET_COMPARISON_LIST_SUCCESS,
    payload: data,
})

export const getComparisonListFail = (e: Error) => ({
    type: GET_COMPARISON_LIST_FAIL,
    payload: e,
})

export const getNewAddressList = (params: NewAddressListParams) : ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    dispatch(newAddrListLoading(true))
    try {
        const response = await apiClient.post(`/market/add/list`, {
            data: params,
        })
        const data = response as unknown as Response<NewAddressListResponse>;
        if (
            (params.pageNo > 1 && data.data.list.length > 0) ||
            params.pageNo == 1
        ) {
        
            dispatch(getNewAddressListSuccess(data))
        } else {
        
            dispatch(newAddrListNoMore(true))
        }
    } catch (e) {
        dispatch(getNewAddressListFail((e as unknown as Error)))
    }
}


export const getNewAddressListSuccess = (data : Response<NewAddressListResponse>) => ({
    type: GET_NEW_ADDRESS_LIST_SUCCESS,
    payload: data,
})

export const getNewAddressListFail = (e: Error) => ({
    type: GET_NEW_ADDRESS_LIST_FAIL,
    payload: e,
})

export const getBuyRankList = (params: BuyRankListParams) : ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    dispatch(buyRankListLoading(true))
    dispatch(setRankListPageNo(params.pageNo));
    try {
        const response = await apiClient.post(`/market/netBuy/list/in`, {
            data: params,
        })
        const data = response as unknown as Response<BuyRankListResponse>;
        if (
            (params.pageNo > 1 && data.data.list.length > 0) ||
            params.pageNo == 1
        ) {
            dispatch(getBuyRankListSuccess(data))
        } else {
            dispatch(buyRankListNoMore(true))
        }
    } catch (e) {
        dispatch(getBuyRankListFail((e as unknown as Error)))
    }
}

export const getBuyRankListSuccess = (data: Response<BuyRankListResponse> | null) => ({
    type: GET_BUY_RANK_LIST_SUCCESS,
    payload: data,
})

export const getBuyRankListFail = (e: Error) => ({
    type: GET_BUY_RANK_LIST_FAIL,
    payload: e,
})

export const getSellRankList = (params: BuyRankListParams): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    dispatch(sellRankListLoading(true))
    dispatch(setRankListPageNo(params.pageNo));
    try {
        const response = await apiClient.post(`/market/netBuy/list/out`, {
            data: params,
        })
        const data = response as unknown as Response<BuyRankListResponse>;
        if (
            (params.pageNo > 1 && data.data.list.length > 0) ||
            params.pageNo == 1
        ) {
            
            dispatch(getSellRankListSuccess(data))
        } else {
            
            dispatch(sellRankListNoMore(true))
        }
    } catch (e) {
        dispatch(getSellRankListFail((e as unknown as Error)))
    }
}


export const getSellRankListSuccess = (data: Response<BuyRankListResponse>) => ({
    type: GET_SELL_RANK_LIST_SUCCESS,
    payload: data,
})


export const getSellRankListFail = (e: Error) => ({
    type: GET_SELL_RANK_LIST_FAIL,
    payload: e,
})


export const getLPRankList = (params: LPRankListParams) : ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    dispatch(lpRankListLoading(true))
    dispatch(setLpRankPageNo(params.pageNo));
    try {
        const response = await apiClient.post(`/market/lp/list`, {
            data: params,
        })
        const data = response as unknown as Response<LPRankListResponse>;
        if (
            (params.pageNo > 1 && data.data.list.length > 0) ||
            params.pageNo == 1
        ) {
            
            dispatch(getLPRankListSuccess(data))
        } else {
            
            dispatch(lpRankListNoMore(true))
        }
    } catch (e) {
        dispatch(getLPRankListFail((e as unknown as Error)))
    }
}


export const getLPRankListSuccess = (data: Response<LPRankListResponse>) => ({
    type: GET_LP_RANK_LIST_SUCCESS,
    payload: data,
})


export const getLPRankListFail = (e: Error) => ({
    type: GET_LP_RANK_LIST_FAIL,
    payload: e,
})

export const getLPRankPie = (params: {symbolAddr: string}) : ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    dispatch(lpRankPieLoading(true))
    try {
        const result = await apiClient.get(`/market/lp/pie/chart`, {
            params: params,
        })
        const data = result as unknown as Response<LPRankPieResponse>
        dispatch(getLPRankPieSuccess(data))
    } catch (e) {
        dispatch(getLPRankPieFail((e as unknown as Error)))
    }
}


export const getLPRankPieSuccess = (data: Response<LPRankPieResponse>) => ({
    type: GET_LP_RANK_PIE_SUCCESS,
    payload: data,
})


export const getLPRankPieFail = (e: Error) => ({
    type: GET_LP_RANK_PIE_FAIL,
    payload: e,
})

export const setLpRankPageNo = (pageNo: number) => ({
    type: SET_LP_RANK_LIST_PAGENO,
    payload: pageNo
})
