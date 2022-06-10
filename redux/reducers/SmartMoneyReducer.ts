import { Result } from "antd";
import moment from "moment";
import { CoinsPercentItem, HoldAssetRankItem, HolderInfoListItem, HoldInfoListFilter, HoldInfoListSuccess, HoldSymbolRankItem, HoldSymbolRankListResponse, PiePercents, RequestSmTypeAction, SmartMoneyActions, SmartMoneyState, SMCategoryResponse, SMCateroryItem } from "redux/types/SmartMoneyTypes";
import data from "utils/analyse/data";
import { CHANGE_SHOW_TAB, CHANGE_ADDRESS_TYPE, REQUEST_HOLD_LIST, REQUEST_HOLD_LIST_SUCCESS, REQUEST_SM_TYPE_SUCCESS, REQUEST_HOLD_ASSET_RANK_SUCCESS, REQUEST_HOLD_SYMBOL_RANK_SUCCESS, REQUEST_COIN_PERCENTS_SUCCESS, REQUEST_PIE_PERCENTS_SUCCESS } from "../actions/SmartMoneyAction";

const smartMoneyState: SmartMoneyState = {
    showTab: 'trade',
    addressType: '0',
    smCategories: [],
    smCategoriesTotal: 0,
      
    holdInfoListFilter: {
        addressType: '0',
        pageSize: 20,
        pageNo: 1,
        sortField: '',
        sortType: ''
    },
    holdInfoListTotalSize: 0,
    holdInfoListData: [],
    holdAssetRank: [],
    holdSymbolRank: {
        list: [],
        others: {
            number: 0,
            rate: 0,
        }
    },
    coinsPercent: [],
    coinsPercentUpdateTime: 0,
    piePercents: undefined,
}

const reducer = (state = smartMoneyState, { type, payload }: SmartMoneyActions) => {
    switch (type) {
        case CHANGE_SHOW_TAB:
            return {
                ...state,
                showTab: payload as string
            }
        case CHANGE_ADDRESS_TYPE:
            return {
                ...state,
                addressType: payload as string
            }
        case REQUEST_HOLD_LIST: {
            return {
                ...state,
                holdInfoListFilter: {
                    ...state.holdInfoListFilter,
                    ...payload as HoldInfoListFilter
                }
            }
        }
        case REQUEST_HOLD_LIST_SUCCESS: {
            const data = payload as HoldInfoListSuccess;
            return {
                ...state,
                holdInfoListData: data.data,
                holdInfoListTotalSize: data.totalSize
            }
        }
        case REQUEST_SM_TYPE_SUCCESS: {
            const result = payload as SMCategoryResponse;
            return {
                ...state,
                smCategories: result.data,
                smCategoriesTotal: result.total
            }
        }
        case REQUEST_HOLD_ASSET_RANK_SUCCESS: {
            const data = payload === null ? [] : payload;
            return {
                ...state,
                holdAssetRank: data as HoldAssetRankItem[]
            }
        }
        case REQUEST_HOLD_SYMBOL_RANK_SUCCESS: {
            const resu = payload as HoldSymbolRankListResponse;
            resu.list.forEach((item: HoldSymbolRankItem) => {
                item.totalAssetRate = Number(item.totalAssetRate)
            });
            return {
                ...state,
                holdSymbolRank: resu
            }
        }
        case REQUEST_COIN_PERCENTS_SUCCESS: {
            const { data, updateTime } = payload as {
                data: CoinsPercentItem[],
                updateTime: number
            };
            if (data) {
                data.forEach((item: CoinsPercentItem) => {
                    item.time = moment(Number(item.date)).format('YYYY/MM/DD')
                });
            }
            return {
                ...state,
                coinsPercent: data,
                coinsPercentUpdateTime: updateTime
            }
        }
        case REQUEST_PIE_PERCENTS_SUCCESS: {
            if (payload === null) {
                return {
                    ...state,
                    piePercents: undefined
                }
            } else {
                return {
                    ...state,
                    piePercents: payload as PiePercents
                }
            }
        }
        default:
            return state
    }
}

export default reducer
