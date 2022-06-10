import { Action } from 'redux'
import { Response } from 'redux/types'

export interface AssetBoardState {
    assetsLoading: boolean
    walletData: null | WalletData
    loanData: null | any
    e: Error | null
}
export interface PropsData {
    code: string
    name: string
}
export interface WalletData {
    address: string
    assetsBalances: AssetsBalancesList[]
    walletTotalBalance: number
}
export interface AssetsBalancesList {
    balance: number
    id: number
    price: number
    symbol: string
    symbolLogo: string
    symbolValue: number
}

export interface LoanData {
    collateralTotalValue: number
    debtTotalValue: number
    loanProjectLists: LoanProjectList[]
}
export interface LoanProjectList {
    projectName: string
    projectUrl: string
    projectLogo: string
    borrowSupplyRate: number
    borrowInnerData: BorrowInnerData[]
    supplyInnerData: SupplyInnerData[]
}
export interface BorrowInnerData {
    symbol: string
    symbolLogo: string
    borrowBalance: number
    borrowRate: number
    borrowValue: number
}
export interface SupplyInnerData {
    symbol: string
    symbolLogo: string
    supplyBalance: number
    supplyRate: number
    supplyValue: number
}

export interface ClearAssetAction extends Action<string> {

}

export interface AssetsLoadingAction extends Action<string> {
    payload: boolean
}
export interface AssetsListErrorAction extends Action<string> {
    payload: Error
}
export interface GetWalletDataSuccessAction extends Action<string> {
    payload: Response<WalletData>
}
export interface GetLoanDataSuccessAction extends Action<string> {
    payload: Response<LoanData[]>
}

export type AssetBoardResponse =
    | WalletData
    | LoanData

export type AssetsActions =
    | AssetsLoadingAction
    | AssetsListErrorAction
    | GetWalletDataSuccessAction
    | GetLoanDataSuccessAction
    | ClearAssetAction
