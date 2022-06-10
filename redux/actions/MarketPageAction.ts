import ApiClient from 'utils/ApiClient'
import {
    ResponseBodyList,
    MarketPageDataListAction,
    FilterFilledList,
    paginationOptionalList
} from 'redux/types/MarketPageTypes'
import { ThunkAction } from 'redux-thunk'
import { Action } from 'redux'
import { AppState } from 'redux/reducers'
import { Response } from 'redux/types'
import { MarketPageDetailAction } from 'redux/types/MarketPageDetailTypes'
import moment from 'moment'
import Global from 'utils/Global'
const apiClient = new ApiClient<Response<ResponseBodyList<MarketPageDataListAction[]>>>()
  
  
export const USER_LOGINOUT_SUCCESS = 'market_page_user_login_out_success'
  
export const MARKET_PAGE_OPTIONAL_LIST_LOADING =
    'market_page_optional_list_loading'
export const MARKET_PAGE_ALL_LIST_LOADING = 'market_page_all_list_loading'
export const MARKET_PAGE_PAGINATION_OPTIONAL_INFO =
    'market_page_pagination_optional_info'
export const MARKET_PAGE_PAGINATION_ALL_INFO = 'market_page_pagination_all_info'
export const MARKET_PAGE_FILTER_FILLED = 'market_page_filter_filled'
export const MARKET_PAGE_MENU_TYPE = 'market_page_menu_type'

  
export const MARKET_PAGE_OPTIONAL_LIST_SUCCESS =
    'market_page_optional_list_success'
export const MARKET_PAGE_OPTIONAL_LIST_FAIL = 'market_page_optional_list_fail'

  
export const MARKET_PAGE_ALL_LIST_SUCCESS = 'market_page_all_list_success'
export const MARKET_PAGE_ALL_LIST_FAIL = 'market_page_all_list_fail'

  
export const EDIT_MARKET_PAGE_OPTIONAL_LIST = 'edit_market_page_optional_list'
export const EDIT_MARKET_PAGE_ALL_LIST = 'edit_market_page_all_list'

export const MARKET_PAGE_OPTIONAL_LIST_REFRESH_SUCCESS =
    'market_page_optional_list_refresh_success'
export const MARKET_PAGE_OPTIONAL_LIST_REFRESH_FAIL =
    'market_page_optional_list_refresh_fail'
export const MARKET_PAGE_ALL_LIST_REFRESH_SUCCESS =
    'market_page_all_list_refresh_success'
export const MARKET_PAGE_ALL_LIST_REFRESH_FAIL =
    'market_page_all_list_refresh_fail'
export const MARKET_PAGE_DETAIL_SUCCESS =
    'market_page_detail_success'
export const MARKET_PAGE_DETAIL_FAIL =
    'market_page_detail_fail'


  
export const loginOutMarket = () => ({
    type: USER_LOGINOUT_SUCCESS,
})

  
export const setOptionalListLoading = (data: boolean) => ({
    type: MARKET_PAGE_OPTIONAL_LIST_LOADING,
    payload: data,
})
export const setAllListLoading = (data: boolean) => ({
    type: MARKET_PAGE_ALL_LIST_LOADING,
    payload: data,
})
  
export const marketPagePaginationOptionalInfo = (data: paginationOptionalList) => ({
    type: MARKET_PAGE_PAGINATION_OPTIONAL_INFO,
    payload: data,
})
export const marketPagePaginationAllInfo = (data: paginationOptionalList) => ({
    type: MARKET_PAGE_PAGINATION_ALL_INFO,
    payload: data,
})
export const marketPageFilterFilled = (data: FilterFilledList) => ({
    type: MARKET_PAGE_FILTER_FILLED,
    payload: data,
})
  
export const marketPageMenuType = (data: string) => ({
    type: MARKET_PAGE_MENU_TYPE,
    payload: data,
})

  
export const getMarketOptionalList = (params: paginationOptionalList & FilterFilledList, level: number): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    dispatch(setOptionalListLoading(true))
    try {
        const data = await apiClient.post(level == 0 ? '/market/symbol/list' : '/market/symbol/filter/list', {
            data: { ...getParams(params, level), type: 1 },
        })
        dispatch(getMarketOptionalListSuccess(data))
    } catch (e) {
        dispatch(getMarketOptionalListFail((e as unknown as Error)))
    }
}
  
export const getMarketOptionalListSuccess = (data: Response<Response<ResponseBodyList<MarketPageDataListAction[]>>>) => ({
    type: MARKET_PAGE_OPTIONAL_LIST_SUCCESS,
    payload: data,
})
  
export const getMarketOptionalListFail = (e: Error) => ({
    type: MARKET_PAGE_OPTIONAL_LIST_FAIL,
    payload: e,
})

  
export const getMarketAllList = (params: paginationOptionalList & FilterFilledList, level: number): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    dispatch(setAllListLoading(true))
    try {
        const data = await apiClient.post(level == 0 ? '/market/symbol/list' : '/market/symbol/filter/list', {
            data: { ...getParams(params, level), type: 2 },
        })
        dispatch(getMarketAllListSuccess(data))
    } catch (e) {
        dispatch(getMarketAllListFail((e as unknown as Error)))
    }
}
  
export const getMarketAllListSuccess = (data: Response<Response<ResponseBodyList<MarketPageDataListAction[]>>>) => ({
    type: MARKET_PAGE_ALL_LIST_SUCCESS,
    payload: data,
})
  
export const getMarketAllListFail = (e: Error) => ({
    type: MARKET_PAGE_ALL_LIST_FAIL,
    payload: e,
})

  
export const editOptionalList = (data: string) => {
    return {
        type: EDIT_MARKET_PAGE_OPTIONAL_LIST,
        payload: JSON.parse(data),
    }
}

  
export const editAllList = (data: string) => {
    return {
        type: EDIT_MARKET_PAGE_ALL_LIST,
        payload: JSON.parse(data),
    }
}

  
export const getMarketOptionalRefreshList = (params: paginationOptionalList & FilterFilledList, level: number): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    try {
        const data = await apiClient.post(level == 0 ? '/market/symbol/list' : '/market/symbol/filter/list', {
            data: { ...getParams(params, level), type: 1 },
        })
        dispatch(getMarketOptionalRefreshListSuccess(data))
    } catch (e) {
        dispatch(getMarketOptionalRefreshListFail((e as unknown as Error)))
    }
}
  
export const getMarketOptionalRefreshListSuccess = (data: Response<Response<ResponseBodyList<MarketPageDataListAction[]>>>) => ({
    type: MARKET_PAGE_OPTIONAL_LIST_REFRESH_SUCCESS,
    payload: data,
})
  
export const getMarketOptionalRefreshListFail = (e: Error) => ({
    type: MARKET_PAGE_OPTIONAL_LIST_REFRESH_FAIL,
    payload: e,
})

  
export const getMarketAllRefreshList = (params: paginationOptionalList & FilterFilledList, level: number): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    try {
        const data = await apiClient.post(level == 0 ? '/market/symbol/list' : '/market/symbol/filter/list', {
            data: {
                ...getParams(params, level), type: 2
            },
        })
        dispatch(getMarketAllRefreshListSuccess(data))
    } catch (e) {
        dispatch(getMarketAllRefreshListFail((e as unknown as Error)))
    }
}
  
export const getMarketAllRefreshListSuccess = (data: Response<Response<ResponseBodyList<MarketPageDataListAction[]>>>) => ({
    type: MARKET_PAGE_ALL_LIST_REFRESH_SUCCESS,
    payload: data,
})
  
export const getMarketAllRefreshListFail = (e: Error) => ({
    type: MARKET_PAGE_ALL_LIST_REFRESH_FAIL,
    payload: e,
})

  
export const getMarketDetailSuccess = (data: MarketPageDetailAction) => ({
    type: MARKET_PAGE_DETAIL_SUCCESS,
    payload: data,
})
  
export const getMarketDetailFail = (e: Error) => ({
    type: MARKET_PAGE_DETAIL_FAIL,
    payload: e,
})

function getParams(params: paginationOptionalList & FilterFilledList, level: number) {
    if (level == 0) {
        return {
            pageNo: params.pageNo,
            pageSize: params.pageSize,
            sortFiled: params.sortFiled,
            sort: params.sort,
        }
    } else {
        return {
            ...params,
            startTime: Global.getDayStart(params.startTime, 1000),
            endTime: Global.getDayEnd(params.endTime, 1000),
        }
    }
}