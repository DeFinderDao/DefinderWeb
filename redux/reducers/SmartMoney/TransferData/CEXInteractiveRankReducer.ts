import {
  SM_CEX_RANK_LIST_LOADING,
  SM_CEX_RANK_LIST_SUCCESS,
  SM_CEX_RANK_LIST_FAIL
} from 'redux/actions/SmartMoney/TransferData/CEXInteractiveRankAction'
import { Response } from 'redux/types'
import { SMCEXDataRankState, SMCEXRankActions, SMCEXRankListResponse } from 'redux/types/SmartMoney/TransferData/CEXInteractiveRankTypes'

const initialState: SMCEXDataRankState = {
  CEXLoading: true,
  CEXRankList: null,
  e: null,
}

const reducer = (state = initialState, { type, payload }: SMCEXRankActions) => {
  switch (type) {
    case SM_CEX_RANK_LIST_LOADING:
      return {
        ...state,
        CEXLoading: payload as boolean,
      }
    case SM_CEX_RANK_LIST_SUCCESS:
      const CEXData = (payload as Response<SMCEXRankListResponse>).data
      return {
        ...state,
        CEXRankList: CEXData,
        CEXLoading: false,
      }
    case SM_CEX_RANK_LIST_FAIL:
      return {
        ...state,
        CEXLoading: false,
        e: payload as Error,
      }
    default:
      return state
  }
}

export default reducer
