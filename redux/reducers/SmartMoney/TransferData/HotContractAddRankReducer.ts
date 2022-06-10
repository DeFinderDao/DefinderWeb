import {
  SM_HOT_RANK_LIST_LOADING,
  SM_HOT_RANK_LIST_NOMORE,
  SM_HOT_RANK_LIST_SUCCESS,
  SM_HOT_RANK_LIST_FAIL
} from 'redux/actions/SmartMoney/TransferData/HotContractAddRankAction'
import { Response } from 'redux/types'
import { SMHOTDataRankState, SMHOTRankActions, SMHOTRankListResponse } from 'redux/types/SmartMoney/TransferData/HotContractAddRankTypes'

const initialState: SMHOTDataRankState = {
  HOTLoading: true,
  HOTNoMore: false,
  HOTRankList: null,
  e: null,
}

const reducer = (state = initialState, { type, payload }: SMHOTRankActions) => {
  switch (type) {
    case SM_HOT_RANK_LIST_LOADING:
      return {
        ...state,
        HOTLoading: payload as boolean,
      }
    case SM_HOT_RANK_LIST_NOMORE:
      return {
        ...state,
        HOTNoMore: payload as boolean,
        HOTLoading: false,
      }
    case SM_HOT_RANK_LIST_SUCCESS:
      const HOTData = (payload as Response<SMHOTRankListResponse>).data
      return {
        ...state,
        HOTRankList: HOTData,
        HOTLoading: false,
      }
    case SM_HOT_RANK_LIST_FAIL:
      return {
        ...state,
        HOTLoading: false,
        e: payload as Error,
      }
    default:
      return state
  }
}

export default reducer
