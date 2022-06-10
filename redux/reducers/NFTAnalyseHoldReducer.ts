import {
    GET_NFT_HOLDER_NUM_PIE_FAIL,
    GET_NFT_HOLDER_NUM_PIE_SUCCESS,
    GET_NFT_HOLDER_TIME_PIE_FAIL,
    GET_NFT_HOLDER_TIME_PIE_SUCCESS,
    GET_NFT_HOLDER_RANK_LIST_LOADING,
    GET_NFT_HOLDER_RANK_LIST_SUCCESS,
    GET_NFT_HOLDER_RANK_LIST_FAIL,
} from "redux/actions/NFTAnalyseHoldAction"
import { NFTHoldComponentsActions, NFTHoldErrorAction, NFTHoldLoadingAction, NFTHoldPieSuccessAction, NFTHoldRankSuccessAction, NFTHoldState } from "redux/types/NFTAnalyseHoldTypes"


const initialState: NFTHoldState = {
    numList: [],
    numUpdateTime: 0,
    timeList: [],
    timeUpdateTime: 0,
    rankList: {
        endDate: '',
        startDate: '',
        totalSize: 0,
        whaleNum: 0,
        list: []
    },
    rankListupdateTime: null,
    rankLoading: true,
    e: null,
}

const reducer = (state = initialState, actions: NFTHoldComponentsActions) => {
    const { type } = actions
    switch (type) {
        case GET_NFT_HOLDER_NUM_PIE_SUCCESS: {
            const { payload } = actions as NFTHoldPieSuccessAction
            const numData = payload.data.map(item => {
                item.rate = Number(item.rate)
                item.type = item.type.toString()
                return item
            })
            return {
                ...state,
                numList: numData,
                numUpdateTime: payload.updateTime
            }
        }
        case GET_NFT_HOLDER_TIME_PIE_SUCCESS: {
            const { payload } = actions as NFTHoldPieSuccessAction
            const timeData = payload.data.map(item => {
                item.rate = Number(item.rate)
                item.type = item.type.toString()
                return item
            })
            return {
                ...state,
                timeList: timeData,
                timeUpdateTime: payload.updateTime
            }
        }
        case GET_NFT_HOLDER_RANK_LIST_LOADING: {
            const { payload } = actions as NFTHoldLoadingAction
            return {
                ...state,
                rankLoading: payload,
            }
        }
        case GET_NFT_HOLDER_RANK_LIST_SUCCESS: {
            const { payload } = actions as NFTHoldRankSuccessAction
            return {
                ...state,
                rankList: payload.data,
                rankListupdateTime: payload.updateTime,
                rankLoading: false,
            }
        }
        case GET_NFT_HOLDER_NUM_PIE_FAIL:
        case GET_NFT_HOLDER_TIME_PIE_FAIL: {
            const { payload } = actions as NFTHoldErrorAction
            return {
                ...state,
                e: payload,
            }
        }
        case GET_NFT_HOLDER_RANK_LIST_FAIL: {
            const { payload } = actions as NFTHoldErrorAction
            return {
                ...state,
                e: payload,
                rankLoading: false,
            }
        }
        default:
            return state
    }
}

export default reducer
