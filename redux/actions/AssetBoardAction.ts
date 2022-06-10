import ApiClient from '../../utils/ApiClient'
import { ThunkAction } from 'redux-thunk'
import { Action } from 'redux'
import { AppState } from 'redux/reducers'
import { Response } from 'redux/types'
import { AssetBoardResponse, PropsData } from 'redux/types/AssetBoardTypes'
  
  
export const ASSETS_LOADING = 'assets_loading'

export const CLEAR_ASSET = 'clear_asset';

  
export const GET_ASSETS_WALLET_LIST_SUCCESS = 'assets_wallet_list_success'
export const GET_ASSETS_WALLET_LIST_FAIL = 'assets_wallet_list_fail'

  
export const GET_ASSETS_LOAN_LIST_SUCCESS = 'assets_loan_list_success'
export const GET_ASSETS_LOAN_LIST_FAIL = 'assets_loan_list_fail'

  
export const assetsLoading = (data: boolean) => ({
    type: ASSETS_LOADING,
    payload: data,
})
  
export const getAssetsWalletList =
    (params: {
        address: string | string[] | undefined
    }): ThunkAction<void, AppState, null, Action<string>> =>
    async (dispatch) => {
        dispatch(assetsLoading(true))
        try {
            const apiClient = new ApiClient<AssetBoardResponse>()
            const data = await apiClient.get(`/assets/wallet/list`, {
                params: params,
            })
            dispatch(getAssetsWalletListSuccess(data))
        } catch (e) {
            dispatch(getAssetsWalletListFail(e))
        }
    }

  
export const getAssetsWalletListSuccess = (
    data: Response<AssetBoardResponse>
) => ({
    type: GET_ASSETS_WALLET_LIST_SUCCESS,
    payload: data,
})

  
export const getAssetsWalletListFail = (e: Error) => ({
    type: GET_ASSETS_WALLET_LIST_FAIL,
    payload: e,
})

  
export const getAssetsLoanList =
    (
        code: PropsData[],
        params: { address: string | string[] | undefined }
    ): ThunkAction<void, AppState, null, Action<string>> =>
    async (dispatch) => {
        dispatch(assetsLoading(true))
        const apiClient = new ApiClient<AssetBoardResponse>()
        const dataList = code.map((item) => {
            return apiClient
                .get(`/assets/loan/${item.code}/list`, {
                    params: params,
                })
                .catch((err) => {
                    return Promise.resolve(null)
                })
        })
        Promise.all(dataList)
            .then((res) => {
                let data: AssetBoardResponse[] = []
                res.forEach((item) => {
                    if (item) {
                        data.push(item.data)
                    }
                })
                dispatch(getAssetsLoanListSuccess(data))
            })
            .catch((e) => {
                dispatch(getAssetsLoanListFail(e))
            })
    }

  
export const getAssetsLoanListSuccess = (data: any) => ({
    type: GET_ASSETS_LOAN_LIST_SUCCESS,
    payload: data,
})

  
export const getAssetsLoanListFail = (e: Error) => ({
    type: GET_ASSETS_LOAN_LIST_FAIL,
    payload: e,
})

  
export const clearAsset = () => ({
    type: CLEAR_ASSET
})
