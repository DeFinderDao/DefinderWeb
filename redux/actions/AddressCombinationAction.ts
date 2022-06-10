import ApiClient from 'utils/ApiClient'
import {
    ResponseBodyList,
    CombinationSymbolList,
    CombinationFollowDataList,
    CombinationRecommendDataList
} from 'redux/types/AddressCombinationTypes';
import { ThunkAction } from 'redux-thunk';
import { Action } from 'redux';
import { AppState } from 'redux/reducers';
import { Response } from 'redux/types';
const apiClient = new ApiClient();
interface SearchInfo {
    pageNo: number,
    pageSize: number | undefined,
    sort: string,
    sortFiled: string,
    isWarn?: string | number | null
}
interface SetRecommend {
    ids: string[] | number[],
    isFollow: number,
}

  
export const USER_LOGINOUT_SUCCESS = 'combination_user_login_out_success'
  
export const COMBINATION_FOLLOW_LOADING = 'combination_follow_loading'
export const COMBINATION_RECOMMEND_LOADING = 'combination_recommend_loading'
export const GET_SYMBOL_LIST_SUCCESS = 'combination_symbol_list_success'
export const GET_SYMBOL_LIST_FAIL = 'combination_symbol_list_fail'
export const GET_COMBINATION_FOLLOW_LIST_SUCCESS =
    'combination_follow_list_success'
export const GET_COMBINATION_FOLLOW_LIST_FAIL = 'combination_follow_list_fail'
export const SET_RECOMMEND_LIST = 'combination_set_recommend_list'
export const GET_COMBINATION_RECOMMEND_LIST_SUCCESS =
    'combination_recommend_list_success'
export const GET_COMBINATION_RECOMMEND_LIST_FAIL =
    'combination_recommend_list_fail'
  
export const GET_COMBINATION_FOLLOW__SUCCESS = 'combination_follow_success'
export const GET_COMBINATION_FOLLOW__FAIL = 'combination_follow_fail'
  
export const setWarningFollowLoading = (data: boolean) => ({
    type: COMBINATION_FOLLOW_LOADING,
    payload: data,
})
export const setWarningRecommendLoading = (data: boolean) => ({
    type: COMBINATION_RECOMMEND_LOADING,
    payload: data,
})
  
export const loginOutCombination = () => ({ type: USER_LOGINOUT_SUCCESS })

  
export const getFollowList = (params: SearchInfo): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    dispatch(setWarningFollowLoading(true))
    try {
        const response = await apiClient.post(`/warn/follow/list`, {
            data: params,
        })
        const data = response as unknown as Response<ResponseBodyList<CombinationFollowDataList[]>>;
        dispatch(getFollowListSuccess(data))
    } catch (e) {
        dispatch(getFollowListFail(e))
    }
}
  
export const getFollowListSuccess = (data: Response<ResponseBodyList<CombinationFollowDataList[]>>) => ({
    type: GET_COMBINATION_FOLLOW_LIST_SUCCESS,
    payload: data,
})
  
export const getFollowListFail = (e: Error) => ({
    type: GET_COMBINATION_FOLLOW_LIST_FAIL,
    payload: e,
})

  
export const getRecommendList = (params: SearchInfo): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    dispatch(setWarningRecommendLoading(true))
    try {
        const response = await apiClient.post(`/groupAddr/admin/addr/list`, {
            data: params,
        })
        const data = response as unknown as Response<ResponseBodyList<CombinationRecommendDataList[]>>;
        dispatch(getRecommendListSuccess(data))
    } catch (e) {
        dispatch(getRecommendListFail(e))
    }
}
  
export const getRecommendListSuccess = (data: Response<ResponseBodyList<CombinationRecommendDataList[]>>) => ({
    type: GET_COMBINATION_RECOMMEND_LIST_SUCCESS,
    payload: data,
})
  
export const getRecommendListFail = (e: Error) => ({
    type: GET_COMBINATION_RECOMMEND_LIST_FAIL,
    payload: e,
})

  
export const getFollow = (params: SetRecommend, call: (val: Response<boolean>) => void, err: (e:Error) => void): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    dispatch(setWarningRecommendLoading(true))
    try {
        const response = await apiClient.post(`/warn/batch/follow`, {
            data: params,
        })
        const data = response as unknown as Response<boolean>;
        call(data)
    } catch (e) {
        err(e)
        dispatch(setWarningRecommendLoading(false))
    }
}
  
export const setRecommendList = (data: SetRecommend) => ({
    type: SET_RECOMMEND_LIST,
    payload: data,
})

  
export const getSymbolList = (): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    try {
        const response = await apiClient.post('/symbol/list')
        const data = response as unknown as Response<ResponseBodyList<CombinationSymbolList[]>>;
        dispatch(getSymbolListSuccess(data))
    } catch (e) {
        dispatch(getSymbolListFail(e))
    }
}
  
export const getSymbolListSuccess = (data: Response<ResponseBodyList<CombinationSymbolList[]>>) => ({
    type: GET_SYMBOL_LIST_SUCCESS,
    payload: data,
})
  
export const getSymbolListFail = (e: Error) => ({
    type: GET_SYMBOL_LIST_FAIL,
    payload: e,
})
