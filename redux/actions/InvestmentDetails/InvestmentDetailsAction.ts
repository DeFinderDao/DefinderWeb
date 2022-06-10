import { Response } from 'redux/types'
import { InvestmentDetailsItem } from 'redux/types/InvestmentDetailsTypes'

export const INVESTMENT_DETAILS_SUCCEE = 'investment_details_success'
export const INVESTMENT_DETAILS_FAIL = 'investment_details_fail'


export const getInvestmentDetailsSuccess = (data: Response<InvestmentDetailsItem>) => ({
  type: INVESTMENT_DETAILS_SUCCEE,
  payload: data,
})

export const getInvestmentDetailsFail = (e: Error) => ({
  type: INVESTMENT_DETAILS_FAIL,
  payload: e,
})