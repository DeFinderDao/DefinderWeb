import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { AppState } from 'redux/reducers'
import { Response } from 'redux/types'
import { SMCEXLineParams, SMCEXLineResponse } from 'redux/types/SmartMoney/TransferData/CEXLineTypes'
import ApiClient from 'utils/ApiClient'

export const SM_CEX_LINE_LIST_LOADING = 'sm_cex_line_loading'
export const SM_CEX_SEARCH_LIST_LOADING = 'sm_cex_search_loading'

export const SM_CEX_LINE_LIST_SUCCESS = 'sm_cex_line_success'
export const SM_CEX_LINE_LIST_FAIL = 'sm_cex_line_fail'

export const SM_CEX_SEARCH_LIST_SUCCESS = 'sm_cex_search_success'
export const SM_CEX_SEARCH_LIST_FAIL = 'sm_cex_search_fail'

export const smCEXLineLoading = (data: boolean) => ({
  type: SM_CEX_LINE_LIST_LOADING,
  payload: data,
})

export const smCEXLineSearchLoading = (data: boolean) => ({
  type: SM_CEX_SEARCH_LIST_LOADING,
  payload: data,
})

export const getSMCEXLine = (params: SMCEXLineParams): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
  dispatch(smCEXLineLoading(true))
  try {
    const apiClient = new ApiClient<SMCEXLineResponse>()
    const data = await apiClient.post(
      `/smart/money/transfer/cex/trend`,
      { data: params }
    )
    dispatch(getSMCEXLineSuccess(data))
  } catch (e) {
    dispatch(getSMCEXLineFail((e as unknown as Error)))
  }
}

export const getSMCEXLineSuccess = (data: Response<SMCEXLineResponse>) => ({
  type: SM_CEX_LINE_LIST_SUCCESS,
  payload: data,
})

export const getSMCEXLineFail = (e: Error) => ({
  type: SM_CEX_LINE_LIST_FAIL,
  payload: e,
})

export const getSMCEXLineSearch = (params: SMCEXLineParams): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
  dispatch(smCEXLineSearchLoading(true))
  try {
    const apiClient = new ApiClient<SMCEXLineResponse>()
    const data = await apiClient.post(
      `/smart/money/search`,
      { data: params }
    )
    dispatch(getSMCEXLineSearchSuccess(data))
  } catch (e) {
    dispatch(getSMCEXLineSearchFail((e as unknown as Error)))
  }
}

export const getSMCEXLineSearchSuccess = (data: Response<SMCEXLineResponse>) => ({
  type: SM_CEX_SEARCH_LIST_SUCCESS,
  payload: data,
})

export const getSMCEXLineSearchFail = (e: Error) => ({
  type: SM_CEX_SEARCH_LIST_FAIL,
  payload: e,
})