import {
  SM_TRANSFER_RANK_LIST_LOADING,
  SM_TRANSFER_RANK_LIST_SUCCESS,
  SM_TRANSFER_RANK_LIST_FAIL
} from 'redux/actions/SmartMoney/TransferData/TransferRecordAction'
import { Response } from 'redux/types'
import { SMTransferDataRankState, SMTransferRankActions, SMTransferRankListResponse } from 'redux/types/SmartMoney/TransferData/TransferRecordTypes'

const initialState: SMTransferDataRankState = {
  transferLoading: true,
  transferRankList: null,
  e: null,
}

const reducer = (state = initialState, { type, payload }: SMTransferRankActions) => {
  switch (type) {
    case SM_TRANSFER_RANK_LIST_LOADING:
      return {
        ...state,
        transferLoading: payload as boolean,
      }
    case SM_TRANSFER_RANK_LIST_SUCCESS:
      const transferData = (payload as Response<SMTransferRankListResponse>).data
      return {
        ...state,
        transferRankList: transferData,
        transferLoading: false,
      }
    case SM_TRANSFER_RANK_LIST_FAIL:
      return {
        ...state,
        transferLoading: false,
        e: payload as Error,
      }
    default:
      return state
  }
}

export default reducer
