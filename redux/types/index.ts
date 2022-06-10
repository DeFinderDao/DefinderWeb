  
import type { MenuAction } from './MenuTypes'
import type { UserInfoActions } from './UserInfoTypes'
import type { AddressDynamicActions } from './AddressDynamicTypes'
import type { MarketComponentsActions } from './MarketComponentsTypes'
import type { ApplicationActions } from './ApplicationTypes'
import type { CurrencyAddrLineActions } from './CurrencyAddrLineTypes'
import type { CurrencyAddrRankActions } from './CurrencyAddrRankTypes'
import type { AnalysisSellBuyUsersActions } from './AnalysisSellBuyUsersTypes'
import type { AnalysisBuyingTodayActions } from './AnalysisBuyingTodayTypes'
import type { TransactionHistoryActions } from './TransactionHistoryTypes'
import type { ChanceWarningActions } from './ChanceWarningTypes'
import type { WarningTypeActions } from './SetWarningTypes'
import type { MarketPageActions } from './MarketPageTypes'
import type { AddressAnalyseActions } from './AddressAnalyseTypes'
import type { AddressCombinationActions } from './AddressCombinationTypes'

import type { ThunkAction as ReduxThunkAction } from "redux-thunk";
import type { Action, AnyAction } from 'redux'
import type { AppDetailseActions } from './AppDetailTypes'
import { AssetsActions } from './AssetBoardTypes'

export interface Response<T> {
    code: string
    message: string
    data: T
    updateTime: number
}

export type Actions =
    | MenuAction
    | UserInfoActions
    | AddressDynamicActions
    | MarketComponentsActions
    | ApplicationActions
    | CurrencyAddrLineActions
    | CurrencyAddrRankActions
    | AnalysisSellBuyUsersActions
    | AnalysisBuyingTodayActions
    | TransactionHistoryActions
    | WarningTypeActions
    | ChanceWarningActions
    | MarketPageActions
    | AddressAnalyseActions
    | AddressCombinationActions
    | AppDetailseActions
    | AssetsActions


export interface Dispatch<A extends Action = AnyAction> {
    <TReturnType = any, TState = any, TExtraThunkArg = any>(
        thunkAction: ReduxThunkAction<TReturnType, TState, TExtraThunkArg, A>
    ): TReturnType;
}