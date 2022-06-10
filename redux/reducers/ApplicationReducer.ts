import {
    ADDR_LIST_LOADING,
    APPLICATIONA_CLEAR_TABLE_LIST,
    GET_APPLICATION_TYPE_LIST_SUCCESS,
    GET_APPLICATION_TYPE_LIST_FAIL,
    GET_APPLICATION_TRADELIST_SUCCESS,
    GET_APPLICATION_TRADELIST_FAIL,
    GET_APPLICATION_TRANSFERLIST_SUCCESS,
    GET_APPLICATION_TRANSFERLIST_FAIL,
    GET_APPLICATION_HOLDERLIST_SUCCESS,
    GET_APPLICATION_HOLDERLIST_FAIL,
    GET_APPLICATION_LUCKLIST_SUCCESS,
    GET_APPLICATION_LUCKLIST_FAIL,
} from '../actions/ApplicationAction'
import {
    ApplicationState,
    ApplicationActions,
    AddrListSimpleAction,
    AddrListClearAction,
    AddrListErrorAction,
    GetSiderListSuccessAction,
    GetTableListSuccessAction,
} from '../types/ApplicationTypes'

const initialState: ApplicationState = {
    siderList: [],
    tableList: null,
    loadingList: [],
    loading: true,
    e: null,
}

const reducer = (state = initialState, actions: ApplicationActions) => {
    const { type } = actions
    switch (type) {
        case ADDR_LIST_LOADING: {
            const { payload } = actions as AddrListSimpleAction
            return {
                ...state,
                loading: payload,
            }
        }
        case APPLICATIONA_CLEAR_TABLE_LIST: {
            const { payload } = actions as AddrListClearAction
            return {
                ...state,
                loadingList: [],
            }
        }
        case GET_APPLICATION_TYPE_LIST_SUCCESS: {
            const { payload } = actions as GetSiderListSuccessAction
            return {
                ...state,
                siderList: payload.data,
            }
        }
        case GET_APPLICATION_TRADELIST_SUCCESS:
        case GET_APPLICATION_TRANSFERLIST_SUCCESS:
        case GET_APPLICATION_HOLDERLIST_SUCCESS:
        case GET_APPLICATION_LUCKLIST_SUCCESS: {
            const { payload } = actions as GetTableListSuccessAction
            return {
                ...state,
                tableList: payload.data,
                loadingList: state.loadingList.concat(payload.data.list || []),
                loading: false,
            }
        }
        case GET_APPLICATION_TYPE_LIST_FAIL:
        case GET_APPLICATION_TRADELIST_FAIL:
        case GET_APPLICATION_TRANSFERLIST_FAIL:
        case GET_APPLICATION_HOLDERLIST_FAIL:
        case GET_APPLICATION_LUCKLIST_FAIL: {
            const { payload } = actions as AddrListErrorAction
            return {
                ...state,
                e: payload,
                loading: false,
            }
        }
        default:
            return state
    }
}

export default reducer
