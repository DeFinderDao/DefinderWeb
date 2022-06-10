import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { AppState } from 'redux/reducers'
import { Response } from 'redux/types'
import { NftSwapHistoryItem, NftSwapHistoryParams, ResponseNftSwapHistory } from 'redux/types/NftSwapHistoryTypes'
import ApiClient from 'utils/ApiClient'
import Global from 'utils/Global'

export const NFT_SWAP_DETAILS_LOADING = 'nft_swap_details_loading'
export const NFT_SWAP_DETAILS_NOMORE = 'nft_swap_details_nomore'
export const NFT_SWAP_DETAILS_SUCCEE = 'nft_swap_details_success'
export const NFT_SWAP_DETAILS_FAIL = 'nft_swap_details_fail'

export const nftSwapListLoading = (data: boolean) => ({
  type: NFT_SWAP_DETAILS_LOADING,
  payload: data,
})
// nomore
export const nftSwapListNoMore = (data: boolean) => ({
  type: NFT_SWAP_DETAILS_NOMORE,
  payload: data,
})

export const getNftSwapList = (params: NftSwapHistoryParams): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
  dispatch(nftSwapListLoading(true))
  dispatch(nftSwapListNoMore(false))
  try {
    const apiClient = new ApiClient<ResponseNftSwapHistory>()
    const data = await apiClient.post(`/addr/nft/trade/record`, {
      data: {
        ...params,
        startTime: Global.getDayStart(params.startTime, 1000),
        endTime: Global.getDayEnd(params.endTime, 1000),
      }
    })

    data.data.list = data.data.list ? data.data.list : []
    if (
      (params.pageNo && params.pageNo > 1 && data.data.list.length > 0) ||
      params.pageNo == 1
    ) {
      
      dispatch(getNftSwapHistorySuccess(data))
      if (data.data.list.length < (params.pageSize as number)) {
        dispatch(nftSwapListNoMore(true))
      }
    } else {
      
      dispatch(nftSwapListNoMore(true))
    }
  } catch (e) {
    dispatch(getNftSwapHistoryFail(e as unknown as Error))
  }
}

export const getNftSwapHistorySuccess = (data: Response<ResponseNftSwapHistory>) => ({
  type: NFT_SWAP_DETAILS_SUCCEE,
  payload: data,
})

export const getNftSwapHistoryFail = (e: Error) => ({
  type: NFT_SWAP_DETAILS_FAIL,
  payload: e,
})