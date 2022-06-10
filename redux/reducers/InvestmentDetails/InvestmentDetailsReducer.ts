import {
  INVESTMENT_DETAILS_SUCCEE,
  INVESTMENT_DETAILS_FAIL
} from 'redux/actions/InvestmentDetails/InvestmentDetailsAction'
import { Response } from 'redux/types'
import { InvestmentDetailsActions, InvestmentDetailsItem, InvestmentDetailsState } from 'redux/types/InvestmentDetailsTypes'

const initialState: InvestmentDetailsState = {
  investmentDetails: {
    addressList: [],
    addrTagList: [
      {
        addrTag: '',
        groupId: 0,
        isSubAddr: false,
      }
    ],
    symbolInfo: {
      symbol: '',
      symbolAddr: '',
      contract: '',
      communityList: [{
        name: '',
        url: '',
      }],
    },
    holdAmount: '',
    holdAmountValue: '',
    holdCost: '',
    inAvgPrice: '',
    price: '',
    profit: '',
    profitRate: '',
    holdRank: '',
    addrName: '',
    groupId: '',
    updateTime: 0,
    showTip: false
  },
  e: null,
}

const reducer = (state = initialState, { type, payload }: InvestmentDetailsActions) => {
  switch (type) {
    case INVESTMENT_DETAILS_SUCCEE: {
      return {
        ...state,
        investmentDetails: (payload as Response<InvestmentDetailsItem>).data,
      }
    }
    case INVESTMENT_DETAILS_FAIL:
      return {
        ...state,
        e: payload as Error,
      }
    default:
      return state
  }
}

export default reducer
