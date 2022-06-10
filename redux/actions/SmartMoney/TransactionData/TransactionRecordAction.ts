import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { AppState } from 'redux/reducers'
import { Response } from 'redux/types'
import { SMRecordListResponse, SMRecordParams } from 'redux/types/SmartMoney/TransactionData/TransactionRecordTypes'
import ApiClient from 'utils/ApiClient'
import Global from 'utils/Global'

// loading
export const SM_RECORD_BUS_LIST_LOADING = 'sm_record_bus_list_loading'
export const SM_RECORD_LP_LIST_LOADING = 'sm_record_lp_list_loading'


export const SM_RECORD_BUS_LIST_SUCCESS = 'sm_record_bus_list_success'
export const SM_RECORD_BUS_LIST_FAIL = 'sm_record_bus_list_fail'


export const SM_RECORD_LP_LIST_SUCCESS = 'sm_record_lp_list_success'
export const SM_RECORD_LP_LIST_FAIL = 'sm_record_lp_list_fail'


export const smRecordBusListLoading = (data: boolean) => ({
  type: SM_RECORD_BUS_LIST_LOADING,
  payload: data,
})


export const getSMRecordBusList = (params: SMRecordParams): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
  dispatch(smRecordBusListLoading(true))
  try {
    delete params["symbol0Addr"];
    delete params["symbol1Addr"];
    const apiClient = new ApiClient<SMRecordListResponse>()
    const data = await apiClient.post(
      `/smart/money/swap/record`,
      {
        data: {
          ...params,
          startTime: Global.getDayStart(params.startTime as number | null, 1000),
          endTime: Global.getDayEnd(params.endTime as number | null, 1000),
        }
      }
    )
    data.data.list = data.data.list ? data.data.list : []
    dispatch(getSMRecordBusListSuccess(data))
  } catch (e) {
    dispatch(getSMRecordBusListFail((e as unknown as Error)))
  }
}

export const getSMRecordBusListSuccess = (data: Response<SMRecordListResponse>) => ({
  type: SM_RECORD_BUS_LIST_SUCCESS,
  payload: data,
})

export const getSMRecordBusListFail = (e: Error) => ({
  type: SM_RECORD_BUS_LIST_FAIL,
  payload: e,
})



export const smRecordLpListLoading = (data: boolean) => ({
  type: SM_RECORD_LP_LIST_LOADING,
  payload: data,
})


export const getSMRecordLPList = (params: SMRecordParams): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
  dispatch(smRecordLpListLoading(true))
  try {
    params.takerTokenKeyword = params.symbol1Addr
    params.makerTokenKeyword = params.symbol0Addr
    delete params["symbol0Addr"];
    delete params["symbol1Addr"];
    const apiClient = new ApiClient<SMRecordListResponse>()
    const data = await apiClient.post(
      `/smart/money/lp/record`,
      {
        data: {
          ...params,
          startTime: Global.getDayStart(params.startTime as number | null, 1000),
          endTime: Global.getDayEnd(params.endTime as number | null, 1000),
        }
      }
    )
    data.data.list = data.data.list ? data.data.list : []
    dispatch(getSMRecordLPListSuccess(data))
  } catch (e) {
    dispatch(getSMRecordLPListFail((e as unknown as Error)))
  }
}

export const getSMRecordLPListSuccess = (data: Response<SMRecordListResponse>) => ({
  type: SM_RECORD_LP_LIST_SUCCESS,
  payload: data,
})

export const getSMRecordLPListFail = (e: Error) => ({
  type: SM_RECORD_LP_LIST_FAIL,
  payload: e,
})
