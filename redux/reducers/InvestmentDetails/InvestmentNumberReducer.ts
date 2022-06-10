import moment from 'moment'
import {
    INVESTMENT_DETAILS_NUMBER_LOADING,
    INVESTMENT_DETAILS_NUMBER_SUCCEE,
    INVESTMENT_DETAILS_NUMBER_FAIL,
} from 'redux/actions/InvestmentDetails/InvestmentNumberAction'
import { Response } from 'redux/types'
import { InvestmentNumberState, InvestmentNumberItem, InvestmentNumberActions } from 'redux/types/InvestmentNumberTypes'

const initialState: InvestmentNumberState = {
    investmentNumberLoading: true,
    investmentNumberList: [],
    e: null,
}

const reducer = (state = initialState, { type, payload }: InvestmentNumberActions) => {
    switch (type) {
        case INVESTMENT_DETAILS_NUMBER_LOADING:
            return {
                ...state,
                investmentNumberLoading: payload as boolean,
            }
        case INVESTMENT_DETAILS_NUMBER_SUCCEE:
            const data = (payload as Response<InvestmentNumberItem[]>).data
            if (data) {
                data.forEach((item: InvestmentNumberItem) => {
                    item.time = moment(Number(item.date)).format('YYYY/MM/DD')
                });
            }
            return {
                ...state,
                investmentNumberList: data,
                investmentNumberLoading: false,
            }
        case INVESTMENT_DETAILS_NUMBER_FAIL:
            return {
                ...state,
                investmentNumberLoading: false,
                e: payload as Error,
            }
        default:
            return state
    }
}

export default reducer
