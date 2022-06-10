import {
    INVESTMENT_DETAILS_POSITION_INCOME_LOADING,
    INVESTMENT_DETAILS_POSITION_INCOME_SUCCEE,
    INVESTMENT_DETAILS_POSITION_INCOME_FAIL,
} from 'redux/actions/InvestmentDetails/PositionIncomeAction'
import { Response } from 'redux/types'
import { PositionIncomeState, PositionIncomeItem, PositionIncomeActions } from 'redux/types/PositionIncomeTypes'

const initialState: PositionIncomeState = {
    positionIncomeLoading: true,
    positionIncomeList: [],
    e: null,
}

const reducer = (state = initialState, { type, payload }: PositionIncomeActions) => {
    switch (type) {
        case INVESTMENT_DETAILS_POSITION_INCOME_LOADING:
            return {
                ...state,
                positionIncomeLoading: payload as boolean,
            }
        case INVESTMENT_DETAILS_POSITION_INCOME_SUCCEE:
            return {
                ...state,
                positionIncomeList: (payload as Response<PositionIncomeItem[]>).data,
                positionIncomeLoading: false,
            }
        case INVESTMENT_DETAILS_POSITION_INCOME_FAIL:
            return {
                ...state,
                positionIncomeLoading: false,
                e: payload as Error,
            }
        default:
            return state
    }
}

export default reducer
