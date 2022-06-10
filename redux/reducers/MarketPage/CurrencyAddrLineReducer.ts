import moment from 'moment'
import {
    CURRENCY_ADDR_LINE_LIST_LOADING,
    CURRENCY_ADDR_LINE_LIST_SUCCESS,
    CURRENCY_ADDR_LINE_LIST_FAIL,
} from 'redux/actions/MarketPage/CurrencyAddrLineAction'
import { Response } from 'redux/types'
import { CurrencyAddrLineActions, CurrencyAddrLineState, HoldMarketApiResponse, HoldMarketItem } from 'redux/types/CurrencyAddrLineTypes'

const initialState : CurrencyAddrLineState = {
    currencyAddrLoading: true,
    currencyAddrLineList: [],
    e: null,
}

const reducer = (state = initialState, { type, payload } : CurrencyAddrLineActions) => {
    switch (type) {
        case CURRENCY_ADDR_LINE_LIST_LOADING: {
            return {
                ...state,
                currencyAddrLoading: payload as boolean,
            }
        }
        case CURRENCY_ADDR_LINE_LIST_SUCCESS: {
            const data = (payload as Response<HoldMarketApiResponse>).data.innerData ? (payload as Response<HoldMarketApiResponse>).data.innerData : []
            if (data) {
                data.forEach((item: HoldMarketItem) => {
                    item.date = item.time
                    item.time = moment(Number(item.date)).format('YYYY/MM/DD')
                });
            }
            return {
                ...state,
                currencyAddrLineList: data,
                currencyAddrLoading: false,
            }
        }
        case CURRENCY_ADDR_LINE_LIST_FAIL: {
            return {
                ...state,
                currencyAddrLoading: false,
                e: payload as Error,
            }
        }
        default:
            return state
    }
}

export default reducer
