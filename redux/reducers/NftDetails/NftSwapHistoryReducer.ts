import moment from 'moment'
import {
  NFT_SWAP_DETAILS_SUCCEE,
  NFT_SWAP_DETAILS_NOMORE,
  NFT_SWAP_DETAILS_FAIL,
  NFT_SWAP_DETAILS_LOADING
} from 'redux/actions/NftDetails/NftSwapHistoryAction'
import { Response } from 'redux/types'
import { NftSwapHistoryActions, NftSwapHistoryItem, NftSwapHistoryState, ResponseNftSwapHistory } from 'redux/types/NftSwapHistoryTypes'

const initialState: NftSwapHistoryState = {
  nftSwapLoading: true,
  nftSwapNoMore: false,
  nftSwap: [],
  nftSwapTotalSize: 0,
  e: null,
}

const reducer = (state = initialState, { type, payload }: NftSwapHistoryActions) => {
  switch (type) {
    case NFT_SWAP_DETAILS_SUCCEE: {
      const data = (payload as Response<ResponseNftSwapHistory>).data.list
      const totalSize = (payload as Response<ResponseNftSwapHistory>).data.totalSize
      return {
        ...state,
        nftSwap: data,
        nftSwapTotalSize: totalSize,
        nftSwapLoading: false,
      }
    }
    case NFT_SWAP_DETAILS_LOADING: {
      return {
        ...state,
        nftSwapLoading: payload as boolean,
      }
    }
    case NFT_SWAP_DETAILS_NOMORE:
      return {
        ...state,
        nftSwapNoMore: payload as boolean,
        nftSwapLoading: false,
      }
    case NFT_SWAP_DETAILS_FAIL:
      return {
        ...state,
        nftSwapLoading: false,
        e: payload as Error,
      }
    default:
      return state
  }
}

export default reducer
