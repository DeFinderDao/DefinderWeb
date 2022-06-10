import {
  SM_TRANSACTION_BUY_RANK_LIST_LOADING,
  SM_TRANSACTION_BUY_RANK_LIST_NOMORE,
  SM_TRANSACTION_SELL_RANK_LIST_LOADING,
  SM_TRANSACTION_SELL_RANK_LIST_NOMORE,
  SM_TRANSACTION_BUY_RANK_LIST_SUCCESS,
  SM_TRANSACTION_BUY_RANK_LIST_FAIL,
  SM_TRANSACTION_BUY_RANK_PIE_SUCCESS,
  SM_TRANSACTION_BUY_RANK_PIE_FAIL,
  SM_TRANSACTION_SELL_RANK_LIST_SUCCESS,
  SM_TRANSACTION_SELL_RANK_LIST_FAIL,
  SM_TRANSACTION_SELL_RANK_PIE_SUCCESS,
  SM_TRANSACTION_SELL_RANK_PIE_FAIL
} from 'redux/actions/SmartMoney/TransactionData/BuySellRankAction'
import { Response } from 'redux/types'
import { SMRankListResponse, SMRankPieResponse, SMTransactionDataRankState, SMTransactionRankActions } from 'redux/types/SmartMoney/TransactionData/BuySellRankTypes'

const initialState: SMTransactionDataRankState = {
  buyLoading: true,
  buyRankPie: [],
  buyRankList: null,
  buyNoMore: false,
  sellLoading: true,
  sellRankPie: [],
  sellRankList: null,
  sellNoMore: false,
  e: null,
}

const reducer = (state = initialState, { type, payload }: SMTransactionRankActions) => {
  switch (type) {
    case SM_TRANSACTION_BUY_RANK_LIST_LOADING:
      return {
        ...state,
        buyLoading: payload as boolean,
      }
    case SM_TRANSACTION_BUY_RANK_LIST_SUCCESS:
      const buyData = (payload as Response<SMRankListResponse>).data
        
      return {
        ...state,
        buyRankList: buyData,
          
        buyLoading: false,
      }
    case SM_TRANSACTION_BUY_RANK_PIE_SUCCESS:
      return {
        ...state,
        buyRankPie: (payload as Response<SMRankPieResponse>).data.symbolList,
      }
    case SM_TRANSACTION_BUY_RANK_LIST_NOMORE:
      return {
        ...state,
        buyNoMore: payload as boolean,
        buyLoading: false,
      }
    case SM_TRANSACTION_SELL_RANK_LIST_LOADING:
      return {
        ...state,
        sellLoading: payload as boolean,
      }
    case SM_TRANSACTION_SELL_RANK_LIST_SUCCESS:
      const sellData = (payload as Response<SMRankListResponse>).data
        
      return {
        ...state,
        sellRankList: sellData,
          
        sellLoading: false,
      }
    case SM_TRANSACTION_SELL_RANK_PIE_SUCCESS:
      return {
        ...state,
        sellRankPie: (payload as Response<SMRankPieResponse>).data.symbolList,
      }
    case SM_TRANSACTION_SELL_RANK_LIST_NOMORE:
      return {
        ...state,
        sellNoMore: payload as boolean,
        sellLoading: false,
      }
    case SM_TRANSACTION_BUY_RANK_LIST_FAIL:
    case SM_TRANSACTION_BUY_RANK_PIE_FAIL:
      return {
        ...state,
        buyLoading: false,
        e: payload as Error,
      }
    case SM_TRANSACTION_SELL_RANK_PIE_FAIL:
    case SM_TRANSACTION_SELL_RANK_LIST_FAIL:
      return {
        ...state,
        sellLoading: false,
        e: payload as Error,
      }
    default:
      return state
  }
}

export default reducer
