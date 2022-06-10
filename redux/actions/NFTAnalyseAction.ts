import ApiClient from 'utils/ApiClient'
import {
    ResponseBodyList,
    NFTAnalyseDataListAction,
    FilterFilledList,
    paginationOptionalList
} from 'redux/types/NFTAnalyseTypes'
import { ThunkAction } from 'redux-thunk'
import { Action } from 'redux'
import { AppState } from 'redux/reducers'
import { Response } from 'redux/types'
import { NFTAnalyseDetailAction } from 'redux/types/NFTAnalyseDetailTypes'
import Global from 'utils/Global'
const apiClient = new ApiClient<ResponseBodyList<NFTAnalyseDataListAction[]>>()
  
  
export const USER_LOGINOUT_SUCCESS = 'nft_analyse_user_login_out_success'
  
export const NFT_ANALYSE_OPTIONAL_LIST_LOADING = 'nft_analyse_optional_list_loading'
export const NFT_ANALYSE_ALL_LIST_LOADING = 'nft_analyse_all_list_loading'
  
export const NFT_ANALYSE_PAGINATION_OPTIONAL_INFO = 'nft_analyse_pagination_optional_info'
export const NFT_ANALYSE_PAGINATION_ALL_INFO = 'nft_analyse_pagination_all_info'
  
export const NFT_ANALYSE_FILTER_FILLED = 'nft_analyse_filter_filled'

  
export const NFT_ANALYSE_OPTIONAL_LIST_SUCCESS = 'nft_analyse_optional_list_success'
export const NFT_ANALYSE_OPTIONAL_LIST_FAIL = 'nft_analyse_optional_list_fail'

  
export const NFT_ANALYSE_ALL_LIST_SUCCESS = 'nft_analyse_all_list_success'
export const NFT_ANALYSE_ALL_LIST_FAIL = 'nft_analyse_all_list_fail'

  
export const EDIT_NFT_ANALYSE_OPTIONAL_LIST = 'edit_nft_analyse_optional_list'
export const EDIT_NFT_ANALYSE_ALL_LIST = 'edit_nft_analyse_all_list'

  
export const NFT_ANALYSE_DETAIL_SUCCESS = 'nft_analyse_detail_success'
export const NFT_ANALYSE_DETAIL_FAIL = 'nft_analyse_detail_fail'

  
export const NFT_ANALYSE_OPTIONAL_LIST_REFRESH_SUCCESS = 'nft_analyse_optional_list_refresh_success'
export const NFT_ANALYSE_OPTIONAL_LIST_REFRESH_FAIL = 'nft_analyse_optional_list_refresh_fail'
export const NFT_ANALYSE_ALL_LIST_REFRESH_SUCCESS = 'nft_analyse_all_list_refresh_success'
export const NFT_ANALYSE_ALL_LIST_REFRESH_FAIL = 'nft_analyse_all_list_refresh_fail'


export const NFT_ANALYSE_MENU_TYPE = 'nft_analyse_menu_type'
  
export const nftAnalyseMenuType = (data: string) => ({
    type: NFT_ANALYSE_MENU_TYPE,
    payload: data,
})

  
export const loginOutNFTAnalyse = () => ({
    type: USER_LOGINOUT_SUCCESS,
})

  
export const setOptionalListLoading = (data: boolean) => ({
    type: NFT_ANALYSE_OPTIONAL_LIST_LOADING,
    payload: data,
})
export const setAllListLoading = (data: boolean) => ({
    type: NFT_ANALYSE_ALL_LIST_LOADING,
    payload: data,
})
  
export const nftAnalysePaginationOptionalInfo = (data: paginationOptionalList) => ({
    type: NFT_ANALYSE_PAGINATION_OPTIONAL_INFO,
    payload: data,
})
export const nftAnalysePaginationAllInfo = (data: paginationOptionalList) => ({
    type: NFT_ANALYSE_PAGINATION_ALL_INFO,
    payload: data,
})
export const nftAnalyseFilterFilled = (data: FilterFilledList) => ({
    type: NFT_ANALYSE_FILTER_FILLED,
    payload: data,
})

  
export const getNFTAnalyseOptionalList = (params: paginationOptionalList & FilterFilledList, level: number): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    dispatch(setOptionalListLoading(true))
    try {
        const data = await apiClient.post(level === 0 ? 'market/nft/filter/list/v2' : '/market/nft/filter/list', {
            data: { ...getParams(params, level), type: 1 },
        })
        dispatch(getNFTAnalyseOptionalListSuccess(data))
    } catch (e) {
        dispatch(getNFTAnalyseOptionalListFail((e as unknown as Error)))
    }
}
  
export const getNFTAnalyseOptionalListSuccess = (data: Response<ResponseBodyList<NFTAnalyseDataListAction[]>>) => ({
    type: NFT_ANALYSE_OPTIONAL_LIST_SUCCESS,
    payload: data,
})
  
export const getNFTAnalyseOptionalListFail = (e: Error) => ({
    type: NFT_ANALYSE_OPTIONAL_LIST_FAIL,
    payload: e,
})

  
export const getNFTAnalyseAllList = (params: paginationOptionalList & FilterFilledList, level: number): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    dispatch(setAllListLoading(true))
    try {
        const data = await apiClient.post(level === 0 ? '/market/nft/filter/list/v2' : '/market/nft/filter/list', {
            data: { ...getParams(params, level), type: 2 },
        })
        dispatch(getNFTAnalyseAllListSuccess(data))
    } catch (e) {
        dispatch(getNFTAnalyseAllListFail((e as unknown as Error)))
    }
}
  
export const getNFTAnalyseAllListSuccess = (data: Response<ResponseBodyList<NFTAnalyseDataListAction[]>>) => ({
    type: NFT_ANALYSE_ALL_LIST_SUCCESS,
    payload: data,
})
  
export const getNFTAnalyseAllListFail = (e: Error) => ({
    type: NFT_ANALYSE_ALL_LIST_FAIL,
    payload: e,
})

  
export const editOptionalList = (data: string) => {
    return {
        type: EDIT_NFT_ANALYSE_OPTIONAL_LIST,
        payload: JSON.parse(data),
    }
}

  
export const editAllList = (data: string) => {
    return {
        type: EDIT_NFT_ANALYSE_ALL_LIST,
        payload: JSON.parse(data),
    }
}

  
export const getNFTAnalyseDetailSuccess = (data: NFTAnalyseDetailAction) => ({
    type: NFT_ANALYSE_DETAIL_SUCCESS,
    payload: data,
})
  
export const getNFTAnalyseDetailFail = (e: Error) => ({
    type: NFT_ANALYSE_DETAIL_FAIL,
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
        }
    }
}


  
export const getNFTAnalyseOptionalRefreshList = (params: paginationOptionalList & FilterFilledList, level: number): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    try {
        const data = await apiClient.post(level === 0 ? '/market/nft/filter/list/v2' : '/market/nft/filter/list', {
            data: { ...getParams(params, level), type: 1 },
        })
        dispatch(getNFTAnalyseOptionalRefreshListSuccess(data))
    } catch (e) {
        dispatch(getNFTAnalyseOptionalRefreshListFail((e as unknown as Error)))
    }
}
  
export const getNFTAnalyseOptionalRefreshListSuccess = (data: Response<ResponseBodyList<NFTAnalyseDataListAction[]>>) => ({
    type: NFT_ANALYSE_OPTIONAL_LIST_REFRESH_SUCCESS,
    payload: data,
})
  
export const getNFTAnalyseOptionalRefreshListFail = (e: Error) => ({
    type: NFT_ANALYSE_OPTIONAL_LIST_REFRESH_FAIL,
    payload: e,
})

  
export const getNFTAnalyseAllRefreshList = (params: paginationOptionalList & FilterFilledList, level: number): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    try {
        const data = await apiClient.post(level === 0 ? '/market/nft/filter/list/v2' : '/market/nft/filter/list', {
            data: {
                ...getParams(params, level), type: 2
            },
        })
        dispatch(getNFTAnalyseAllRefreshListSuccess(data))
    } catch (e) {
        dispatch(getNFTAnalyseAllRefreshListFail((e as unknown as Error)))
    }
}
  
export const getNFTAnalyseAllRefreshListSuccess = (data: Response<ResponseBodyList<NFTAnalyseDataListAction[]>>) => ({
    type: NFT_ANALYSE_ALL_LIST_REFRESH_SUCCESS,
    payload: data,
})
  
export const getNFTAnalyseAllRefreshListFail = (e: Error) => ({
    type: NFT_ANALYSE_ALL_LIST_REFRESH_FAIL,
    payload: e,
})