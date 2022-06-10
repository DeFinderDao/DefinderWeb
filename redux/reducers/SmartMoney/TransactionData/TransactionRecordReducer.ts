import {
  SM_RECORD_BUS_LIST_LOADING,
  SM_RECORD_LP_LIST_LOADING,
  SM_RECORD_BUS_LIST_SUCCESS,
  SM_RECORD_BUS_LIST_FAIL,
  SM_RECORD_LP_LIST_SUCCESS,
  SM_RECORD_LP_LIST_FAIL,
} from 'redux/actions/SmartMoney/TransactionData/TransactionRecordAction'
import { Response } from 'redux/types'
import { SMRecordActions, SMRecordListResponse, SMRecordState } from 'redux/types/SmartMoney/TransactionData/TransactionRecordTypes'

const initialState: SMRecordState = {
  busLoading: true,
  busList: {
    endDate: null,
    startDate: null,
    totalSize: null,
    list: []
  },
  lpLoading: true,
  lpList: {
    endDate: null,
    startDate: null,
    totalSize: null,
    list: []
  },
  e: null,
}

const reducer = (state = initialState, { type, payload }: SMRecordActions) => {
  switch (type) {
    case SM_RECORD_BUS_LIST_LOADING:
      return {
        ...state,
        busLoading: payload as boolean,
      }
    case SM_RECORD_BUS_LIST_SUCCESS:
      const buyData = (payload as Response<SMRecordListResponse>).data
      return {
        ...state,
        busList: buyData,
        busLoading: false,
      }
    case SM_RECORD_LP_LIST_LOADING:
      return {
        ...state,
        lpLoading: payload as boolean,
      }
    case SM_RECORD_LP_LIST_SUCCESS:
      const sellData = (payload as Response<SMRecordListResponse>).data
      return {
        ...state,
        lpList: sellData,
        lpLoading: false,
      }
    case SM_RECORD_BUS_LIST_FAIL:
      return {
        ...state,
        busLoading: false,
        e: payload as Error,
      }
    case SM_RECORD_LP_LIST_FAIL:
      return {
        ...state,
        lpLoading: false,
        e: payload as Error,
      }
    default:
      return state
  }
}

export default reducer
