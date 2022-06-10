import {
  SM_INFO_RANK_LIST_LOADING,
  SM_INFO_RANK_LIST_SUCCESS,
  SM_INFO_RANK_LIST_FAIL,
  SM_INFO_RECORD_LIST_LOADING,
  SM_INFO_RECORD_LIST_SUCCESS,
  SM_INFO_RECORD_LIST_FAIL,
} from 'redux/actions/SmartMoneyInfoAction'
import { Response } from 'redux/types'
import { SMInfoRankDataRankState, SMInfoRankActions, SMInfoRankListResponse, SMInfoRecordListResponse } from 'redux/types/SmartMoneyInfoTypes'

const initialState: SMInfoRankDataRankState = {
  infoLoading: true,
  infoList: null,
  infoListUpdateTime: null,
  infoRecordLoading: true,
  infoRecordList: null,
  e: null,
}

const reducer = (state = initialState, { type, payload }: SMInfoRankActions) => {
  switch (type) {
    case SM_INFO_RANK_LIST_LOADING:
      return {
        ...state,
        infoLoading: payload as boolean,
      }
    case SM_INFO_RECORD_LIST_LOADING:
      return {
        ...state,
        infoRecordLoading: payload as boolean,
      }
    case SM_INFO_RANK_LIST_SUCCESS:
      const infoData = (payload as Response<SMInfoRankListResponse>).data
      return {
        ...state,
        infoList: infoData,
        infoListUpdateTime: (payload as Response<SMInfoRankListResponse>).updateTime,
        infoLoading: false,
      }
    case SM_INFO_RECORD_LIST_SUCCESS:
      const infoRecordData = (payload as Response<SMInfoRecordListResponse>).data
      return {
        ...state,
        infoRecordList: infoRecordData,
        infoRecordLoading: false,
      }
    case SM_INFO_RANK_LIST_FAIL:
      return {
        ...state,
        infoLoading: false,
        e: payload as Error,
      }
    case SM_INFO_RECORD_LIST_FAIL:
      return {
        ...state,
        infoRecordLoading: false,
        e: payload as Error,
      }
    default:
      return state
  }
}

export default reducer
