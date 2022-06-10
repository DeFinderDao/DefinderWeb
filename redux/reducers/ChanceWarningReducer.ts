import { stat } from 'fs';
import {
    WARNING_LOADING,
    USER_LOGINOUT_SUCCESS,
    GET_WARNING_ADDR_LIST_SUCCESS,
    GET_WARNING_ADDR_LIST_FAIL,
    GET_WARNING_LOG_LIST_SUCCESS,
    GET_WARNING_LOG_LIST_FAIL,
    GET_WARNING_STATISTICS_SUCCESS,
    SET_WARNING_ITEM_INDEX,
    SET_WARNING_LOG_CONDITION,
    MARK_ALL_WARNING_READED,
    MARK_ONE_WARNING_LOG_READED,
    GET_WARNING_SYMBOL_LIST_SUCCESS
} from '../actions/ChanceWarningAction'

import {
    ChanceWarningState,
    ChanceWarningActions,
    ChanceWarningLoadingAction,
    ChanceWarningListErrorAction,
    GetWarningAddrListSuccessAction,
    GetWarningDataSuccessAction,
    GetWarningStatisticsSuccessAction,
    SetSelectedWarningItemAction,
    SetWarningLogConditionAction,
    MarkAllWarningLogReadedAction,
    MarkOneWarningLogReadedAction,
    WarningDataItem,
    GetWarningSymbolListSuccessAction
} from '../types/ChanceWarningTypes'

const pageSize = 20;

const initialState: ChanceWarningState = {
    warningLoading: true,
    warnLogCondition: {
          
        addressTag: '0',
          
        symbolName: '0',
          
        symbolAddr: '0',
          
        warnType: '0',
          
        isView: '0',
        money: '',
        pageNo: 1,
        pageSize: pageSize,
    },
    warningAddrList: {},
    warningSymbolList: [],
    warningData: {
        endDate: null,
        list: [],
        startDate: null,
        totalSize: 0,
    },
    statistics: {
        unreadWarnCount: 0,
        setAmountCount: 0,
        unreadAmountCount: 0
    },
    selectedWarnItemIndex: -1,
    warnListHasMore: false,
    e: null,
}

const reducer = (state = initialState, actions: ChanceWarningActions) => {
    const { type } = actions
    switch (type) {
        case WARNING_LOADING: {
            const { payload } = actions as ChanceWarningLoadingAction
            return {
                ...state,
                warningLoading: payload,
            }
        }
        case USER_LOGINOUT_SUCCESS: {
            return {
                ...state,
                warningAddrList: null,
                warningData: {
                    endDate: null,
                    list: [],
                    startDate: null,
                    totalSize: 0,
                },
                e: null,
            }
        }
        case GET_WARNING_ADDR_LIST_SUCCESS: {
            const { payload } = actions as GetWarningAddrListSuccessAction
            return {
                ...state,
                warningAddrList: payload.data,
            }
        }
        case GET_WARNING_LOG_LIST_SUCCESS: {
            const { payload } = actions as GetWarningDataSuccessAction
              
            const list = payload.data.list === null ? [] : payload.data.list;
            const warningData = {
                endDate: payload.data.endDate,
                list: state.warnLogCondition.pageNo! === 1 ?
                [...list] : state.warningData.list!.concat(list),
                startDate: payload.data.startDate,
                totalSize: payload.data.totalSize,
            }
            return {
                ...state,
                warningLoading: false,  
                warningData: warningData,
                warnListHasMore: payload.data.list !== null && payload.data.list.length === pageSize,
                selectedWarnItemIndex: state.warnLogCondition.pageNo! === 1 ?
                    -1 : state.selectedWarnItemIndex,    
            }
        }
        case GET_WARNING_STATISTICS_SUCCESS: {
            const { payload } = actions as GetWarningStatisticsSuccessAction
            return {
                ...state,
                statistics: payload
            }
        }
        case SET_WARNING_ITEM_INDEX: {
            const {payload} = actions as SetSelectedWarningItemAction;
            return {
                ...state,
                selectedWarnItemIndex: payload === state.selectedWarnItemIndex ? -1 : payload,
            }
        }
        case SET_WARNING_LOG_CONDITION: {
            const {payload} = actions as SetWarningLogConditionAction;
            const warnLogCondition = { ...state.warnLogCondition, ...payload };
            return { ...state, warnLogCondition };
        }
        case MARK_ALL_WARNING_READED: {
            const warnLogCondition = state.warnLogCondition;
              
            const statistics = {
                ...state.statistics,
                unreadWarnCount: 0,
                unreadAmountCount: 0
            };
            
            if(warnLogCondition.isView === '1') {
                const warningData = {
                    list: [],
                    startDate: null,
                    endDate: null,
                    totalSize: 0,
                }
                return {
                    ...state,
                    warningLoading: false,  
                    warningData: warningData,
                    warnListHasMore: false,
                    selectedWarnItemIndex: -1,
                    statistics  
                }
            } else {
                const list = state.warningData.list;
                if(list !== null) {
                    const mapList = list.map((warnItem: WarningDataItem) => {
                        return {
                            ...warnItem,
                            isView: 1
                        }
                    });
                    const warningData = {
                        list: mapList,
                        startDate: state.warningData.startDate,
                        endDate: state.warningData.endDate,
                        totalSize: state.warningData.totalSize,
                    }
                    return {
                        ...state,
                        warningData: warningData,
                        statistics
                    }
                } else {
                    return {
                        ...state,
                        statistics
                    };
                }
            }
        }
        case MARK_ONE_WARNING_LOG_READED: {
            const {payload} = actions as MarkOneWarningLogReadedAction;
            const warnList = state.warningData.list;
            if(warnList === null) {
                return state;
            } else {
                let modifiedItemIndex = -1;
                for(let warnItem of warnList) {
                    if(warnItem.id === payload) {
                        modifiedItemIndex = warnList.indexOf(warnItem);
                        break;
                    }
                }
                if(modifiedItemIndex !== -1) {
                    warnList[modifiedItemIndex] = {
                        ...warnList[modifiedItemIndex],
                        isView: 1
                    }
                    const warningData = {
                        list: warnList,
                        startDate: state.warningData.startDate,
                        endDate: state.warningData.endDate,
                        totalSize: state.warningData.totalSize,
                    }
                    return {
                        ...state,
                        warningData: warningData,
                    }
                } else {
                    return state;
                }
            }
        }
        case GET_WARNING_SYMBOL_LIST_SUCCESS: {
            const {payload} = actions as GetWarningSymbolListSuccessAction;
            return {
                ...state,
                warningSymbolList: payload
            }
        }
        case GET_WARNING_ADDR_LIST_FAIL:
        case GET_WARNING_LOG_LIST_FAIL: {
            const { payload } = actions as ChanceWarningListErrorAction
            return {
                ...state,
                e: payload,
                warningLoading: false,
            }
        }
        default:
            return state
    }
}

export default reducer
