import moment from 'moment'
import {
  SM_CEX_LINE_LIST_LOADING,
  SM_CEX_LINE_LIST_SUCCESS,
  SM_CEX_LINE_LIST_FAIL,
  SM_CEX_SEARCH_LIST_LOADING,
  SM_CEX_SEARCH_LIST_SUCCESS,
  SM_CEX_SEARCH_LIST_FAIL,
} from 'redux/actions/SmartMoney/TransferData/CEXLineAction'
import { Response } from 'redux/types'
import { SMCEXLineActions, SMCEXLineDataRankState, SMCEXLineItem, SMCEXLineResponse, SMCEXLineSearchResponse } from 'redux/types/SmartMoney/TransferData/CEXLineTypes'
import data from 'utils/analyse/data'

const initialState: SMCEXLineDataRankState = {
  CEXLineLoading: true,
  CEXLineData: [],
  CEXLineSearchLoading: true,
  CEXLineSearchData: [],
  e: null,
}

const reducer = (state = initialState, { type, payload }: SMCEXLineActions) => {
  switch (type) {
    case SM_CEX_LINE_LIST_LOADING:
      return {
        ...state,
        CEXLineLoading: payload as boolean,
      }
    case SM_CEX_LINE_LIST_SUCCESS:
      const data = (payload as Response<SMCEXLineResponse>).data ? (payload as Response<SMCEXLineResponse>).data.innerData : []
      if (data) {
        data.forEach((item: SMCEXLineItem) => {
          item.time = moment(Number(item.date)).format('YYYY/MM/DD')
        });
      }
      return {
        ...state,
        CEXLineData: data,
        CEXLineLoading: false,
      }
    case SM_CEX_SEARCH_LIST_LOADING:
      return {
        ...state,
        CEXLineSearchLoading: payload as boolean,
      }
    case SM_CEX_SEARCH_LIST_SUCCESS:
      const searchData = (payload as Response<SMCEXLineSearchResponse>).data ? (payload as Response<SMCEXLineSearchResponse>).data.innerData : []
      return {
        ...state,
        CEXLineSearchData: searchData,
        CEXLineSearchLoading: false,
      }
    case SM_CEX_LINE_LIST_FAIL:
      return {
        ...state,
        CEXLineLoading: false,
        e: payload as Error,
      }
    case SM_CEX_SEARCH_LIST_FAIL:
      return {
        ...state,
        CEXLineSearchLoading: false,
        e: payload as Error,
      }
    default:
      return state
  }
}

export default reducer
