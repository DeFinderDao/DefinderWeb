import moment from 'moment'
import {
    INVESTMENT_DETAILS_PRICE_LOADING,
    INVESTMENT_DETAILS_PRICE_SUCCEE,
    INVESTMENT_DETAILS_PRICE_FAIL,
} from 'redux/actions/InvestmentDetails/InvestmentPriceAction'
import { Response } from 'redux/types'
import { InvestmentPriceState, InvestmentPriceItem, InvestmentPriceActions } from 'redux/types/InvestmentPriceTypes'

const initialState: InvestmentPriceState = {
    investmentPriceLoading: true,
    investmentPriceList: [],
    e: null,
}

const reducer = (state = initialState, { type, payload }: InvestmentPriceActions) => {
    switch (type) {
        case INVESTMENT_DETAILS_PRICE_LOADING:
            return {
                ...state,
                investmentPriceLoading: payload as boolean,
            }
        case INVESTMENT_DETAILS_PRICE_SUCCEE:
            const data = (payload as Response<InvestmentPriceItem[]>).data
            if (data) {
                data.forEach((item: InvestmentPriceItem) => {
                    item.time = moment(Number(item.date)).format('YYYY/MM/DD')
                });
            }
            return {
                ...state,
                investmentPriceList: data,
                investmentPriceLoading: false,
            }
        case INVESTMENT_DETAILS_PRICE_FAIL:
            return {
                ...state,
                investmentPriceLoading: false,
                e: payload as Error,
            }
        default:
            return state
    }
}

export default reducer
