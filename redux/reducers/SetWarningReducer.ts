import { SetWarningState, SymbolItem, WarningAddressItem, WarningDetailResponse, WarningListResponse, WarningTypeActions } from 'redux/types/SetWarningTypes'
import {
    SET_WARNING_LOADING,
    USER_LOGINOUT_SUCCESS,
    GET_WARNING_LIST_SUCCESS,
    GET_WARNING_LIST_FAIL,
    GET_WARNING_DETAIL_SUCCESS,
    GET_WARNING_DETAIL_FAIL,
    GET_WARNING_ADDRESS_SUCCESS,
    GET_WARNING_ADDRESS_FAIL,
    GET_WARNING_SYMBOL_SUCCESS,
    GET_WARNING_SYMBOL_FAIL,
} from '../actions/SetWarningAction'
import {Response} from '../types/index'

const initialState : SetWarningState = {
    setWarningLoading: true,
    setWarningData: {},
    setWarningDetail: {},
    warningAddressList: [],
    symbolList: [],
    e: null,
}

const reducer = (state = initialState, { type, payload } : WarningTypeActions) => {
    switch (type) {
        case SET_WARNING_LOADING:
            return {
                ...state,
                setWarningLoading: payload as boolean,
            }
        case USER_LOGINOUT_SUCCESS:
            return {
                ...state,
                setWarningData: {},
                setWarningDetail: {},
                e: null,
            }
        case GET_WARNING_LIST_SUCCESS:
            return {
                ...state,
                setWarningData: (payload as Response<WarningListResponse>).data,
                setWarningLoading: false,
            }
        case GET_WARNING_DETAIL_SUCCESS:
            return {
                ...state,
                setWarningDetail: (payload as Response<WarningDetailResponse>).data,
                setWarningLoading: false,
            }
        case GET_WARNING_ADDRESS_SUCCESS:
            return {
                ...state,
                warningAddressList: (payload as Response<WarningAddressItem[]>).data,
            }
        case GET_WARNING_SYMBOL_SUCCESS:
            return {
                ...state,
                symbolList: (payload as Response<SymbolItem[]>).data,
            }
        case GET_WARNING_LIST_FAIL:
        case GET_WARNING_DETAIL_FAIL:
            return {
                ...state,
                e: payload as Error,
                setWarningLoading: false,
            }
        case GET_WARNING_ADDRESS_FAIL:
        case GET_WARNING_SYMBOL_FAIL:
            return {
                ...state,
                e: payload as Error,
            }
        default:
            return state
    }
}

export default reducer
