import { CoinsPercentItem, HoldAssetRankItem, HolderInfoListItem, HoldInfoListFilter, HoldInfoListSuccess, HoldSymbolRankItem, HoldSymbolRankListResponse, PiePercents, SMCateroryItem } from "redux/types/SmartMoneyTypes";

export const CHANGE_SHOW_TAB = 'sm_change_show_tab';

export const CHANGE_ADDRESS_TYPE = 'change_address_type';

export const REQUEST_HOLD_LIST = 'request_hold_list';

export const REQUEST_HOLD_LIST_SUCCESS = 'request_hold_list_success';

export const REQUEST_SM_TYPE_SUCCESS = 'request_sm_type_success';

export const REQUEST_HOLD_ASSET_RANK_SUCCESS = 'request_hold_asset_rank_success';

export const REQUEST_HOLD_SYMBOL_RANK_SUCCESS = 'request_hold_symbol_rank_success';

export const REQUEST_COIN_PERCENTS_SUCCESS = 'request_coin_percents_success';

export const REQUEST_PIE_PERCENTS_SUCCESS = 'request_pie_percents_success';

export const changeShowTab = (tab: string) => ({
    type: CHANGE_SHOW_TAB,
    payload: tab
});

export const changeAddressType = (type: string) => ({
    type: CHANGE_ADDRESS_TYPE,
    payload: type
})

export const requestHoldList = (filter: HoldInfoListFilter) => ({
    type: REQUEST_HOLD_LIST,
    payload: filter
})

export const requestHoldListSuccess = (data: HoldInfoListSuccess) => ({
    type: REQUEST_HOLD_LIST_SUCCESS,
    payload: data
})

export const requestSmTypeSuccess = (data: SMCateroryItem[],total: number) => ({
    type: REQUEST_SM_TYPE_SUCCESS,
    payload: {
        data,
        total
    }
})

export const requestHoldAssetRankSuccess = (data: HoldAssetRankItem[] | null) => ({
    type: REQUEST_HOLD_ASSET_RANK_SUCCESS,
    payload: data
})

export const requestHoldSymbolRankSuccess = (data: HoldSymbolRankListResponse) => ({
    type: REQUEST_HOLD_SYMBOL_RANK_SUCCESS,
    payload: data
})

export const requestCoinsPercentSuccess = (data: CoinsPercentItem[],updateTime: number) => ({
    type: REQUEST_COIN_PERCENTS_SUCCESS,
    payload: {
        data,
        updateTime
    }
})

export const requestPiePercentSuccess = (data: PiePercents) => ({
    type: REQUEST_PIE_PERCENTS_SUCCESS,
    payload: data
})
