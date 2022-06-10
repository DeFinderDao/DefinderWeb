import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { AppState } from 'redux/reducers'
import { Response } from 'redux/types'
import { NftPlotsHistoryItem, NftPlotsHistoryParams } from 'redux/types/NftPlotsHistoryTypes'
import ApiClient from 'utils/ApiClient'

// redux action 
export const NFT_PLOTS_DETAILS_LOADING = 'nft_plots_details_loading'
export const NFT_PLOTS_DETAILS_SUCCEE = 'nft_plots_details_success'
export const NFT_PLOTS_DETAILS_FAIL = 'nft_plots_details_fail'

export const NFT_GROUP_DETAILS_LOADING = 'nft_group_details_loading'
export const NFT_GROUP_DETAILS_SUCCEE = 'nft_group_details_success'
export const NFT_GROUP_DETAILS_FAIL = 'nft_group_details_fail'

// loading
export const getNftPlotsListLoading = (data: boolean) => ({
  type: NFT_PLOTS_DETAILS_LOADING,
  payload: data,
})

export const getNftPlotsList = (params: NftPlotsHistoryParams): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
  dispatch(getNftPlotsListLoading(true))
  try {
    const apiClient = new ApiClient<NftPlotsHistoryItem[]>()
    const data = await apiClient.post(`addr/nft/hist/trend`, { data: params })
    dispatch(getNftPlotsHistorySuccess(data))
  } catch (e) {
    dispatch(getNftPlotsHistoryFail(e as unknown as Error))
  }
}

export const getNftPlotsHistorySuccess = (data: Response<NftPlotsHistoryItem[]>) => ({
  type: NFT_PLOTS_DETAILS_SUCCEE,
  payload: data,
})

export const getNftPlotsHistoryFail = (e: Error) => ({
  type: NFT_PLOTS_DETAILS_FAIL,
  payload: e,
})


// loading
export const getNftGroupListLoading = (data: boolean) => ({
  type: NFT_GROUP_DETAILS_LOADING,
  payload: data,
})

export const getNftGroupList = (params: NftPlotsHistoryParams): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
  dispatch(getNftGroupListLoading(true))
  try {
    const apiClient = new ApiClient<NftPlotsHistoryItem[]>()
    const data = await apiClient.post(`addr/nft/hist/trend`, { data: params })
    dispatch(getNftGroupHistorySuccess(data))
  } catch (e) {
    dispatch(getNftGroupHistoryFail(e as unknown as Error))
  }
}

export const getNftGroupHistorySuccess = (data: Response<NftPlotsHistoryItem[]>) => ({
  type: NFT_GROUP_DETAILS_SUCCEE,
  payload: data,
})

export const getNftGroupHistoryFail = (e: Error) => ({
  type: NFT_GROUP_DETAILS_FAIL,
  payload: e,
})