import moment from 'moment'
import {
  NFT_PLOTS_DETAILS_LOADING,
  NFT_PLOTS_DETAILS_SUCCEE,
  NFT_PLOTS_DETAILS_FAIL,
  NFT_GROUP_DETAILS_LOADING,
  NFT_GROUP_DETAILS_SUCCEE,
  NFT_GROUP_DETAILS_FAIL,
} from 'redux/actions/NftDetails/NftPlotsHistoryAction'
import { Response } from 'redux/types'
import { NftPlotsHistoryActions, NftPlotsHistoryItem, NftPlotsHistoryLoadingAction, NftPlotsHistoryState } from 'redux/types/NftPlotsHistoryTypes'

const initialState: NftPlotsHistoryState = {
  nftPlotsLoading: true,
  nftPlots: [],
  nftGroupLoading: true,
  nftGroup: [],
  nftGroupUpdateTime: null,
  e: null,
}

const reducer = (state = initialState, { type, payload }: NftPlotsHistoryActions) => {
  switch (type) {
    case NFT_PLOTS_DETAILS_LOADING: {
      return {
        ...state,
        nftPlotsLoading: payload as boolean,
      }
    }
    case NFT_GROUP_DETAILS_LOADING: {
      return {
        ...state,
        nftGroupLoading: payload as boolean,
      }
    }
    case NFT_PLOTS_DETAILS_SUCCEE: {
      const data = (payload as Response<NftPlotsHistoryItem[]>).data
      data.forEach((item: NftPlotsHistoryItem) => {
        item.finalPrice = Number(item.finalPrice)
        item.time = moment(Number(item.date)).format('YYYY/MM/DD HH:mm:ss')
      });
      return {
        ...state,
        nftPlots: data,
        nftPlotsLoading: false
      }
    }
    case NFT_GROUP_DETAILS_SUCCEE: {
      const data = (payload as Response<NftPlotsHistoryItem[]>).data
      data.forEach((item: NftPlotsHistoryItem) => {
        item.finalPrice = Number(item.finalPrice)
        item.time = moment(Number(item.date)).format('YYYY/MM/DD HH:mm:ss')
      });
      return {
        ...state,
        nftGroup: data,
        nftGroupUpdateTime: (payload as Response<NftPlotsHistoryItem[]>).updateTime,
        nftGroupLoading: false
      }
    }
    case NFT_PLOTS_DETAILS_FAIL:
      return {
        ...state,
        nftPlotsLoading: false,
        e: payload as Error,
      }
    case NFT_GROUP_DETAILS_FAIL:
      return {
        ...state,
        nftGroupLoading: false,
        e: payload as Error,
      }
    default:
      return state
  }
}

export default reducer
