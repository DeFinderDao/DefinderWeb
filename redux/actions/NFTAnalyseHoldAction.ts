import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { AppState } from 'redux/reducers'
import { Response } from 'redux/types'
import { NFTHoldPieResponse, NFTHoldRankParams, ResponseBodyList } from 'redux/types/NFTAnalyseHoldTypes'
import ApiClient from 'utils/ApiClient'
const apiClient = new ApiClient()

  
  
export const GET_NFT_HOLDER_NUM_PIE_SUCCESS = 'market_nft_hold_num_Pie_success'
export const GET_NFT_HOLDER_NUM_PIE_FAIL = 'market_nft_hold_num_Pie_fail'
  
export const GET_NFT_HOLDER_TIME_PIE_SUCCESS = 'market_nft_hold_time_Pie_success'
export const GET_NFT_HOLDER_TIME_PIE_FAIL = 'market_nft_hold_time_Pie_fail'
  
export const GET_NFT_HOLDER_RANK_LIST_LOADING = 'market_nft_hold_rank_list_loading'
export const GET_NFT_HOLDER_RANK_LIST_SUCCESS = 'market_nft_hold_rank_list_success'
export const GET_NFT_HOLDER_RANK_LIST_FAIL = 'market_nft_hold_rank_list_fail'

  
export const getNFTHoldNumPie = (params: { symbolAddr: string }): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    try {
        const result = await apiClient.get(`market/nft/hold/pie/chart`, {
            params: {
                symbolAddr: params.symbolAddr,
                type: 1,
            },
        })
        const data = result as unknown as Response<NFTHoldPieResponse>
        dispatch(getNFTHoldNumPieSuccess(data))
    } catch (e) {
        dispatch(getNFTHoldNumPieFail((e as unknown as Error)))
    }
}
  
export const getNFTHoldNumPieSuccess = (data: Response<NFTHoldPieResponse>) => ({
    type: GET_NFT_HOLDER_NUM_PIE_SUCCESS,
    payload: data,
})
  
export const getNFTHoldNumPieFail = (e: Error) => ({
    type: GET_NFT_HOLDER_NUM_PIE_FAIL,
    payload: e,
})


  
export const getNFTHoldTimePie = (params: { symbolAddr: string }): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    try {
        const result = await apiClient.get(`/market/nft/hold/pie/chart`, {
            params: {
                symbolAddr: params.symbolAddr,
                type: 2,
            },
        })
        const data = result as unknown as Response<NFTHoldPieResponse>
        dispatch(getNFTHoldTimePieSuccess(data))
    } catch (e) {
        dispatch(getNFTHoldTimePieFail((e as unknown as Error)))
    }
}
  
export const getNFTHoldTimePieSuccess = (data: Response<NFTHoldPieResponse>) => ({
    type: GET_NFT_HOLDER_TIME_PIE_SUCCESS,
    payload: data,
})
  
export const getNFTHoldTimePieFail = (e: Error) => ({
    type: GET_NFT_HOLDER_TIME_PIE_FAIL,
    payload: e,
})


  
export const setNFTHoldRankListLoading = (data: boolean) => ({
    type: GET_NFT_HOLDER_RANK_LIST_LOADING,
    payload: data,
})
  
export const getNFTHoldRankList = (params: NFTHoldRankParams): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    dispatch(setNFTHoldRankListLoading(true))
    try {
        const data = await apiClient.post('/market/nft/hold/rank/list', {
            data: params,
        })
        dispatch(getNFTHoldRankListSuccess(data as Response<ResponseBodyList>))
    } catch (e) {
        dispatch(getNFTHoldRankListFail((e as unknown as Error)))
    }
}
  
export const getNFTHoldRankListSuccess = (data: Response<ResponseBodyList>) => ({
    type: GET_NFT_HOLDER_RANK_LIST_SUCCESS,
    payload: data,
})
  
export const getNFTHoldRankListFail = (e: Error) => ({
    type: GET_NFT_HOLDER_RANK_LIST_FAIL,
    payload: e,
})