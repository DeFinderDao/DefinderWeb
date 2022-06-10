import ApiClient from '../../utils/ApiClient'
import {
    ResponseSwapBodyList,
    ResponseTransferBodyList,
    ResponseLpBodyList,
    SearchInfo,
    SymbolList,
    SearchHoldInfo,
    HoldLineData,
    AnalyseSwapList,
    AnalyseTransferList,
    AnalyseLpList,
    AddressItem,
    TradeListCondition,
    TradeRecordItem,
    TradeRecordsResponse,
    AddressAssetsFilter,
    AddressAssetsResponse,
    RelatedAddressListResponse,
    LpDetailListResponse,
    CreateAddressResponse,
    InfoDataProps,
    ProjectsDistributionResponse,
    ProjectProfitNumberDistributionResponse,
    CurrentHoldRateResponse,
    HistoryHoldDetailFilter,
    HistoryHoldDetailResponse,
    AddressNFTAssetsResponse,
    NFTHistoryHoldDetailResponse,
    TradeNFTRecordsResponse
} from 'redux/types/AddressAnalyseTypes';
import { ThunkAction } from 'redux-thunk';
import { Action } from 'redux';
import { AppState } from 'redux/reducers';
import { Response } from 'redux/types';
import { message } from 'antd';
import { CODE_SUCCESS } from 'utils/ApiServerError';
import Global from 'utils/Global';
import moment from 'moment';
const apiClient = new ApiClient();

export const CHANGE_SHOW_TAB = 'change_show_tab';

export const CHANGE_TRADE_LIST_CONDITION = 'change_trade_list_condition';

export const CHANGE_NFT_TRADE_LIST_CONDITION = 'change_nft_trade_list_condition';

export const CHANGE_ADDRESS_ASSETS_FILTER = 'change_address_assets_filter';

export const CHANGE_NFT_ADDRESS_ASSETS_FILTER = 'change_nft_address_assets_filter';
export const GET_ADDRESS_SYMBOL_LIST_SUCCESS = 'analyse_symbol_list_success'
export const GET_ADDRESS_SYMBOL_LIST_FAIL = 'analyse_symbol_list_fail'


export const GET_HOLDLIST_SUCCESS = 'analyse_hold_list_success'
export const GET_HOLDLIST_FAIL = 'analyse_hold_list_fail'

export const GET_TRADEHEADER_SUCCESS = 'analyse_trade_header_success'
export const GET_TRADELIST_SUCCESS = 'analyse_trade_list_success'
export const GET_TRADELIST_FAIL = 'analyse_trade_list_fail'

export const GET_TRANSFERHEADER_SUCCESS = 'analyse_transfer_header_success'
export const GET_TRANSFERLIST_SUCCESS = 'analyse_transfer_list_success'
export const GET_TRANSFERLIST_FAIL = 'analyse_transfer_list_fail'

export const GET_LPLIST_SUCCESS = 'lp_list_success'
export const GET_LPLIST_FAIL = 'lp_list_fail'

export const START_GET_TRADE_ADDRESS_LIST = 'start_get_trade_address_list';
export const GET_TRADE_ADDRESS_LIST_SUCCESS = 'get_trade_address_list_success';
export const GET_TRADE_ADDRESS_LIST_FAIL = 'get_trade_address_list_fail';

export const START_GET_NFT_TRADE_ADDRESS_LIST = 'start_get_nft_trade_address_list';
export const GET_NFT_TRADE_ADDRESS_LIST_SUCCESS = 'get_nft_trade_address_list_success';
export const GET_NFT_TRADE_ADDRESS_LIST_FAIL = 'get_nft_trade_address_list_fail';

export const SET_TRADE_RECORDS_LOADING_STATUS = 'set_trade_records_loading_status';
export const SET_TRADE_RECORDS_HAS_MORE = 'set_trade_records_has_more';
export const GET_TRADE_RECORDS_SUCCESS = 'get_trade_records_list_success';
export const GET_TRADE_RECORDS_FAIL = 'get_trade_records_list_fail';

export const SET_NFT_TRADE_RECORDS_LOADING_STATUS = 'set_nft_trade_records_loading_status';
export const SET_NFT_TRADE_RECORDS_HAS_MORE = 'set_nft_trade_records_has_more';
export const GET_NFT_TRADE_RECORDS_SUCCESS = 'get_nft_trade_records_list_success';
export const GET_NFT_TRADE_RECORDS_FAIL = 'get_nft_trade_records_list_fail';

export const SET_TRADE_HISTORY_CLICK_INDEX = 'set_trade_history_click_index';

export const GET_ADDRESS_ASSETS_SUCCESS = 'get_address_assets_success';
export const GET_ADDRESS_ASSETS_FAIL = 'get_address_assets_fail';
export const SET_ADDRESS_ASSETS_LIST_LOADING = 'set_address_assets_list_loading';

export const GET_ADDRESS_NFT_ASSETS_SUCCESS = 'get_address_nft_assets_success';
export const GET_ADDRESS_NFT_ASSETS_FAIL = 'get_address_nft_assets_fail';
export const SET_ADDRESS_NFT_ASSETS_LIST_LOADING = 'set_address_nft_assets_list_loading';

export const GET_RELATED_ADDRESS_SUCCESS = 'get_related_address_success';
export const GET_RELATED_ADDRESS_FAIL = 'get_related_address_fail';
export const SET_RELATED_ADDRESS_LIST_LOADING = 'set_related_address_list_loading';
export const SET_RELATED_ADDRESS_LIST_PAGENO = 'set_related_address_list_pageno';

export const GET_CREATED_ADDRESS_SUCCESS = 'get_created_address_success';
export const GET_CREATED_ADDRESS_FAIL = 'get_created_address_fail';
export const SET_CREATED_ADDRESS_LIST_LOADING = 'set_created_address_list_loading';
export const SET_CREATED_ADDRESS_LIST_PAGENO = 'set_created_address_list_pageno';

export const GET_LP_DETAIL_LIST_SUCCESS = 'get_lp_detail_list_success';
export const GET_LP_DETAIL_LIST_FAIL = 'get_lp_detail_list_fail';
export const SET_LP_DETAIL_LIST_LOADING = 'set_lp_detail_list_loading';
export const SET_LP_DETAIL_LIST_PAGENO = 'set_lp_detail_list_pageno';

export const GET_ADDRESS_BASEINFO_SUCCESS = 'get_address_baseinfo_success';
export const GET_ADDRESS_BASEINFO_FAIL = 'get_address_baseinfo_fail';
export const SET_ADDRESS_BASEINFO_LOADING = 'set_address_baseinfo_loading';

export const GET_ADDRESS_PROJECTS_DISTRIBUTION_SUCCESS = 'get_address_projects_distribution_success';

export const GET_PROJECTS_PROFIT_DISTRIBUTION_SUCCESS = 'get_projects_profit_distribution_success';

export const GET_CURRENT_HOLD_RATE_SUCCESS = 'get_current_hold_rate_success';

export const GET_CURRENT_NFT_HOLD_RATE_SUCCESS = 'get_current_nft_hold_rate_success';

export const CHANGE_HISTORY_HOLD_DETAIL_FILTER = 'change_history_hold_detail_filter';

export const GET_HISTORY_HOLD_DETAIL_LIST_SUCCESS = 'get_history_hold_detail_list_success';

export const CHANGE_NFT_HISTORY_HOLD_DETAIL_FILTER = 'change_nft_history_hold_detail_filter';

export const GET_NFT_HISTORY_HOLD_DETAIL_LIST_SUCCESS = 'get_nft_history_hold_detail_list_success';

export const SET_GO_PRO_DIALOG_VISIBLE = 'set_go_pro_dialog_visible';

export const getAddressList = (addr: string | null): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    try {
        const response = await apiClient.get(`/addr/${addr}/symbol/list`)
        const data = response as unknown as Response<SymbolList[]>;
        dispatch(getAddressListSuccess(data))
    } catch (e) {
        dispatch(getAddressListFail(e as unknown as Error))
    }
}

export const getAddressListSuccess = (data: Response<SymbolList[]>) => ({
    type: GET_ADDRESS_SYMBOL_LIST_SUCCESS,
    payload: data,
})

export const getAddressListFail = (e: Error) => ({
    type: GET_ADDRESS_SYMBOL_LIST_FAIL,
    payload: e,
})

export const getHoldList = (addr: string | null, holdCondition: SearchHoldInfo): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    try {
        const response = await apiClient.post(`/addr/${addr}/hold`, {
            data: holdCondition,
        })
        const data = response as unknown as Response<HoldLineData[]>;
        dispatch(getHoldListSuccess(data))
    } catch (e) {
        dispatch(getHoldListFail(e as unknown as Error))
    }
}

export const getHoldListSuccess = (data: Response<HoldLineData[]>) => ({
    type: GET_HOLDLIST_SUCCESS,
    payload: data,
})

export const getHoldListFail = (e: Error) => ({
    type: GET_HOLDLIST_FAIL,
    payload: e,
})

export const getTradeList = (addr: string | null, tradeCondition: SearchInfo): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    try {
        const response = await apiClient.post(`/addr/${addr}/swap`, {
            data: tradeCondition,
        })
        const data = response as unknown as Response<ResponseSwapBodyList<AnalyseSwapList[]>>;
        dispatch(getTradeListSuccess(data))
        if (tradeCondition.pageNo == 1) {
            dispatch(getTradeHeaderSuccess(data))
        }
    } catch (e) {
        dispatch(getTradeListFail(e as unknown as Error))
    }
}

export const getTradeHeaderSuccess = (data: Response<ResponseSwapBodyList<AnalyseSwapList[]>>) => ({
    type: GET_TRADEHEADER_SUCCESS,
    payload: data,
})

export const getTradeListSuccess = (data: Response<ResponseSwapBodyList<AnalyseSwapList[]>>) => ({
    type: GET_TRADELIST_SUCCESS,
    payload: data,
})

export const getTradeListFail = (e: Error) => ({
    type: GET_TRADELIST_FAIL,
    payload: e,
})

export const getTransferList = (addr: string | null, transferCondition: SearchInfo): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    try {
        const response = await apiClient.post(`/addr/${addr}/transfer`, {
            data: transferCondition,
        })
        const data = response as unknown as Response<ResponseTransferBodyList<AnalyseTransferList[]>>;
        dispatch(getTransferListSuccess(data))
        if (transferCondition.pageNo == 1) {
            dispatch(getTransferHeaderSuccess(data))
        }
    } catch (e) {
        dispatch(getTransferListFail(e as unknown as Error))
    }
}

export const getTransferHeaderSuccess = (data: Response<ResponseTransferBodyList<AnalyseTransferList[]>>) => ({
    type: GET_TRANSFERHEADER_SUCCESS,
    payload: data,
})

export const getTransferListSuccess = (data: Response<ResponseTransferBodyList<AnalyseTransferList[]>>) => ({
    type: GET_TRANSFERLIST_SUCCESS,
    payload: data,
})

export const getTransferListFail = (e: Error) => ({
    type: GET_TRANSFERLIST_FAIL,
    payload: e,
})

export const getLpList = (addr: string | null, lpCondition: SearchInfo): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    try {
        const response = await apiClient.post(`/addr/${addr}/lp`, {
            data: lpCondition,
        })
        const data = response as unknown as Response<ResponseLpBodyList<AnalyseLpList[]>>;
        dispatch(getLpListSuccess(data))
    } catch (e) {
        dispatch(getLpListFail(e as unknown as Error))
    }
}

export const getLpListSuccess = (data: Response<ResponseLpBodyList<AnalyseLpList[]>>) => ({
    type: GET_LPLIST_SUCCESS,
    payload: data,
})

export const getLpListFail = (e: Error) => ({ type: GET_LPLIST_FAIL, payload: e })

export const changeShowTab = (tab: string) => ({
    type: CHANGE_SHOW_TAB,
    payload: tab
});

export const changeTradeListCondition = (condition: TradeListCondition) => ({
    type: CHANGE_TRADE_LIST_CONDITION,
    payload: condition
});

export const changeNFTTradeListCondition = (condition: TradeListCondition) => ({
    type: CHANGE_NFT_TRADE_LIST_CONDITION,
    payload: condition
});

export const changeAddressAssetsFilter = (filter: AddressAssetsFilter) => ({
    type: CHANGE_ADDRESS_ASSETS_FILTER,
    payload: filter
})

export const changeNftAddressAssetsFilter = (filter: AddressAssetsFilter) => ({
    type: CHANGE_NFT_ADDRESS_ASSETS_FILTER,
    payload: filter
})

export const getTradeAddressList = (addressList: string[]): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    const apiClient = new ApiClient<AddressItem[]>();
    dispatch(startGettingTradeAddressList());
    try {
        const result = await apiClient.post('/addr/trade/record/symbols', {
            data: {
                addressList
            }
        });
        if (result.code === CODE_SUCCESS) {
            dispatch(getTradeAddressListSuccess(result));
        } else {
            dispatch(getTradeAddressListError(new Error(result.message)));
        }
    } catch (e) {
        dispatch(getTradeAddressListError(e as unknown as Error));
    }
}

export const startGettingTradeAddressList = () => ({
    type: START_GET_TRADE_ADDRESS_LIST
});

export const getTradeAddressListSuccess = (addressList: Response<AddressItem[]>) => ({
    type: GET_TRADE_ADDRESS_LIST_SUCCESS,
    payload: addressList
});

export const getTradeAddressListError = (e: Error) => ({
    type: GET_TRADE_ADDRESS_LIST_FAIL, 
    payload: e
})

export const getNFTTradeAddressList = (addressList: string[]): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    const apiClient = new ApiClient<AddressItem[]>();
    dispatch(startGettingTradeAddressList());
    try {
        const result = await apiClient.post('/addr/nft/trade/record/symbols', {
            data: {
                addressList
            }
        });
        if (result.code === CODE_SUCCESS) {
            dispatch(getTradeNFTAddressListSuccess(result));
        } else {
            dispatch(getTradeNFTAddressListError(new Error(result.message)));
        }
    } catch (e) {
        dispatch(getTradeNFTAddressListError(e as unknown as Error));
    }
}

export const startGettingNFTTradeAddressList = () => ({
    type: START_GET_NFT_TRADE_ADDRESS_LIST
});

export const getTradeNFTAddressListSuccess = (addressList: Response<AddressItem[]>) => ({
    type: GET_NFT_TRADE_ADDRESS_LIST_SUCCESS,
    payload: addressList
});

export const getTradeNFTAddressListError = (e: Error) => ({
    type: GET_NFT_TRADE_ADDRESS_LIST_FAIL,
    payload: e
})

export const refreshTradeRecordsList = (search: TradeListCondition): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    const apiClient = new ApiClient<TradeRecordsResponse>();
    try {
        dispatch(setTradeRecordsLoadingStatus(true));
        const result = await apiClient.post('/addr/trade/record', {
            data: {
                ...search,
 
                startTime: search.startTime ? Math.floor(search.startTime.valueOf() / 1000) : undefined,
                endTime: search.endTime ? Math.floor(search.endTime.valueOf() / 1000) : undefined,
            }
        });
        dispatch(getTradeRecordsListSuccess(result));
    } catch (e) {
        dispatch(getTradeRecordsListFail(e as unknown as Error));
    }
}

export const getTradeRecordsListSuccess = (response: Response<TradeRecordsResponse>) => ({
    type: GET_TRADE_RECORDS_SUCCESS,
    payload: response
});

export const getTradeRecordsListFail = (e: Error) => ({
    type: GET_TRADE_RECORDS_FAIL,
    payload: e
});

export const setTradeRecordsLoadingStatus = (loading: boolean) => ({
    type: SET_TRADE_RECORDS_LOADING_STATUS,
    payload: loading,
});

export const setTradeRecordsHasMore = (hasMore: boolean) => ({
    type: SET_TRADE_RECORDS_HAS_MORE,
    payload: hasMore
});

export const refreshNFTTradeRecordsList = (search: TradeListCondition): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    const apiClient = new ApiClient<TradeNFTRecordsResponse>();
    
    try {
        dispatch(setNFTTradeRecordsLoadingStatus(true));
        const result = await apiClient.post('/addr/nft/trade/record', {
            data: {
                ...search,
 
                startTime: search.startTime ? Global.getDayStart(Math.floor(moment(search.startTime).valueOf()), 1000) : undefined,
                endTime: search.endTime ? Global.getDayEnd(Math.floor(moment(search.endTime).valueOf()), 1000) : undefined,
            }
        });
        dispatch(getNFTTradeRecordsListSuccess(result));
    } catch (e) {
        dispatch(getNFTTradeRecordsListFail(e as unknown as Error));
    }
}

export const getNFTTradeRecordsListSuccess = (response: Response<TradeNFTRecordsResponse>) => ({
    type: GET_NFT_TRADE_RECORDS_SUCCESS,
    payload: response
});

export const getNFTTradeRecordsListFail = (e: Error) => ({
    type: GET_NFT_TRADE_RECORDS_FAIL,
    payload: e
});

export const setNFTTradeRecordsLoadingStatus = (loading: boolean) => ({
    type: SET_NFT_TRADE_RECORDS_LOADING_STATUS,
    payload: loading,
});

export const setNFTTradeRecordsHasMore = (hasMore: boolean) => ({
    type: SET_NFT_TRADE_RECORDS_HAS_MORE,
    payload: hasMore
});

export const setTradeRecordClickIndex = (index: number) => ({
    type: SET_TRADE_HISTORY_CLICK_INDEX,
    payload: index
});

export const requestAddressAssetsList = (filter: AddressAssetsFilter): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    const apiClient = new ApiClient<AddressAssetsResponse>();
    try {
        dispatch(setAddressAssetsListLoading(true));
        const result = await apiClient.post('/addr/assets', {
            data: filter
        });
        dispatch(getAddressAssetsListSuccess(result));
    } catch (e) {
        dispatch(getAddressAssetsListFail(e as unknown as Error));
    } finally {
        dispatch(setAddressAssetsListLoading(false));
    }
}

export const requestCurrentHoldDetailList = (body: {
    addrName: string,
    groupId: string | undefined,
    pageNo: number,
    pageSize: number,
    sortField?: string | undefined,
    sortType?: number | undefined
}): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    const apiClient = new ApiClient<AddressAssetsResponse>();
    try {
        dispatch(setAddressAssetsListLoading(true));
        const result = await apiClient.post('/addr/current/hold/detail', {
            data: body
        });
        dispatch(getAddressAssetsListSuccess(result));
    } catch (e) {
        dispatch(getAddressAssetsListFail(e as unknown as Error));
    } finally {
        dispatch(setAddressAssetsListLoading(false));
    }
}

export const requestCurrentNFTHoldDetailList = (body: {
    addrName: string,
    groupId: string | undefined,
    pageNo: number,
    pageSize: number,
    sortField?: string | undefined,
    sortType?: number | undefined
}): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    const apiClient = new ApiClient<AddressNFTAssetsResponse>();
    try {
        dispatch(setAddressNFTAssetsListLoading(true));
        const result = await apiClient.post('/addr/nft/current/hold/detail', {
            data: body
        });
        dispatch(getAddressNFTAssetsListSuccess(result));
    } catch (e) {
        dispatch(getAddressNFTAssetsListFail(e as unknown as Error));
    } finally {
        dispatch(setAddressNFTAssetsListLoading(false));
    }
}

export const getAddressAssetsListSuccess = (response: Response<AddressAssetsResponse>) => ({
    type: GET_ADDRESS_ASSETS_SUCCESS,
    payload: response
});

export const getAddressAssetsListFail = (e: Error) => ({
    type: GET_ADDRESS_ASSETS_FAIL,
    payload: e
});

export const getAddressNFTAssetsListSuccess = (response: Response<AddressNFTAssetsResponse>) => ({
    type: GET_ADDRESS_NFT_ASSETS_SUCCESS,
    payload: response
});

export const getAddressNFTAssetsListFail = (e: Error) => ({
    type: GET_ADDRESS_NFT_ASSETS_FAIL,
    payload: e
});

export const setAddressAssetsListLoading = (loading: boolean) => ({
    type: SET_ADDRESS_ASSETS_LIST_LOADING,
    payload: loading
})

export const setAddressNFTAssetsListLoading = (loading: boolean) => ({
    type: SET_ADDRESS_NFT_ASSETS_LIST_LOADING,
    payload: loading
})

export const requestRelatedAddressList = (addrName: string, groupId: string | undefined, pageNo: number, pageSize: number): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    const apiClient = new ApiClient<RelatedAddressListResponse>();
    try {
        dispatch(setRelatedAddressListLoading(true));
        const result = await apiClient.post('addr/relation/addr', {
            data: {
                addrName,
                groupId,
                pageNo,
                pageSize
            }
        });
        dispatch(getRelateAddressListSuccess(result.data));
    } catch (e) {
        //console.log(e);
        dispatch(getRelatedAddressListFail(e as unknown as Error));
    } finally {
        dispatch(setRelatedAddressListLoading(false));
    }
}

export const getRelateAddressListSuccess = (response: RelatedAddressListResponse) => ({
    type: GET_RELATED_ADDRESS_SUCCESS,
    payload: response
});

export const getRelatedAddressListFail = (e: Error) => ({
    type: GET_RELATED_ADDRESS_FAIL,
    payload: e
})

export const setRelatedAddressListLoading = (loading: boolean) => ({
    type: SET_RELATED_ADDRESS_LIST_LOADING,
    payload: loading
})

export const setRelatedAddressListPageNo = (pageNo: number) => ({
    type: SET_RELATED_ADDRESS_LIST_PAGENO,
    payload: pageNo
})

export const requestLpDetailList = (addressList: string[], groupId: string | undefined, pageNo: number, pageSize: number): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    const apiClient = new ApiClient<LpDetailListResponse>();
    try {
        dispatch(setLpDetailsListLoading(true));
        const result = await apiClient.post('/addr/home/lp', {
            data: {
                addressList,
                groupId,
                pageNo,
                pageSize
            }
        });
        dispatch(getLpDetailsListSuccess(result));
    } catch (e) {
        dispatch(getLpDetailsListFail(e as unknown as Error));
    } finally {
        dispatch(setLpDetailsListLoading(false));
    }
}

export const getLpDetailsListSuccess = (response: Response<LpDetailListResponse>) => ({
    type: GET_LP_DETAIL_LIST_SUCCESS,
    payload: response
});

export const getLpDetailsListFail = (e: Error) => ({
    type: GET_LP_DETAIL_LIST_FAIL,
    payload: e
})

export const setLpDetailsListLoading = (loading: boolean) => ({
    type: SET_LP_DETAIL_LIST_LOADING,
    payload: loading
})

export const setLpDetailsListPageNo = (pageNo: number) => ({
    type: SET_LP_DETAIL_LIST_PAGENO,
    payload: pageNo
})

export const requestCreateAddressList = (addrName: string, groupId: string | undefined, pageNo: number, pageSize: number): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    const apiClient = new ApiClient<CreateAddressResponse>();
    try {
        dispatch(setCreateAddressListLoading(true));
        const result = await apiClient.post('/addr/new', {
            data: {
                addrName,
                groupId,
                pageNo,
                pageSize
            }
        });
        dispatch(getCreateAddressListSuccess(result.data));
    } catch (e) {
        //console.log(e);
        dispatch(getCreateAddressListFail(e as unknown as Error));
    } finally {
        dispatch(setCreateAddressListLoading(false));
    }
}

export const getCreateAddressListSuccess = (response: CreateAddressResponse) => ({
    type: GET_CREATED_ADDRESS_SUCCESS,
    payload: response
});

export const getCreateAddressListFail = (e: Error) => ({
    type: GET_CREATED_ADDRESS_FAIL,
    payload: e
})

export const setCreateAddressListLoading = (loading: boolean) => ({
    type: SET_CREATED_ADDRESS_LIST_LOADING,
    payload: loading
})

export const setCreateAddressListPageNo = (pageNo: number) => ({
    type: SET_CREATED_ADDRESS_LIST_PAGENO,
    payload: pageNo
})

export const requestAddressAnalyseDetail = (addrName: string, groupId: string | undefined): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
    const apiClient = new ApiClient<InfoDataProps>()
    try {
        dispatch(setAddressAnalyseDetailLoading(true));
        const result = await apiClient.post('/addr/base/info', {
            data: {
                addrName,
                groupId,
            }
        });
        dispatch(getAddressAnalyseDetailSuccess(result.data));
    } catch (e) {
        dispatch(getAddressAnalyseDetailFail(e as unknown as Error));
    } finally {
        dispatch(setAddressAnalyseDetailLoading(false));
    }
}

export const getAddressAnalyseDetailSuccess = (data: InfoDataProps) => ({
    type: GET_ADDRESS_BASEINFO_SUCCESS,
    payload: data
})

export const getAddressAnalyseDetailFail = (e: Error) => ({
    type: GET_ADDRESS_BASEINFO_FAIL,
    payload: e
})

export const setAddressAnalyseDetailLoading = (loading: boolean) => ({
    type: SET_ADDRESS_BASEINFO_LOADING,
    payload: loading
})

export const getProjectsDistributionSuccess = (type: "profit" | "loss", data: ProjectsDistributionResponse) => {
    data.type = type;
    return {
        type: GET_ADDRESS_PROJECTS_DISTRIBUTION_SUCCESS,
        payload: data
    }
};

export const getProjectsNumberProfitDistributionSuccess = (data: ProjectProfitNumberDistributionResponse | null) => ({
    type: GET_PROJECTS_PROFIT_DISTRIBUTION_SUCCESS,
    payload: data
});

export const getCurrentHoldRateSuccess = (data: CurrentHoldRateResponse | null) => ({
    type: GET_CURRENT_HOLD_RATE_SUCCESS,
    payload: data
})

export const getCurrentNftHoldRateSuccess = (data: CurrentHoldRateResponse | null) => ({
    type: GET_CURRENT_NFT_HOLD_RATE_SUCCESS,
    payload: data
})

export const changeHistoryHoldDetailFilter = (filter: HistoryHoldDetailFilter) => ({
    type: CHANGE_HISTORY_HOLD_DETAIL_FILTER,
    payload: filter
})

export const getHistoryHoldDetailList = (data: HistoryHoldDetailResponse | null) => ({
    type: GET_HISTORY_HOLD_DETAIL_LIST_SUCCESS,
    payload: data
})

export const changeNFTHistoryHoldDetailFilter = (filter: HistoryHoldDetailFilter) => ({
    type: CHANGE_NFT_HISTORY_HOLD_DETAIL_FILTER,
    payload: filter
})

export const getNFTHistoryHoldDetailList = (data: NFTHistoryHoldDetailResponse | null) => ({
    type: GET_NFT_HISTORY_HOLD_DETAIL_LIST_SUCCESS,
    payload: data
})

export const setGoProDialogVisible = (visible: boolean) => ({
    type: SET_GO_PRO_DIALOG_VISIBLE,
    payload: visible
})