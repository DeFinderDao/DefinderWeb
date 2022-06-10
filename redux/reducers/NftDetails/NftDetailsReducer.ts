import {
  NFT_DETAILS_SUCCEE,
  NFT_DETAILS_FAIL
} from 'redux/actions/NftDetails/NftDetailsAction'
import { Response } from 'redux/types'
import { NftDetailsActions, NftDetailsItem, NftDetailsState } from 'redux/types/NftDetailsTypes'

const initialState: NftDetailsState = {
  nftDetails: {
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
      symbolLogo: '',
      symbolAddr: '',   
      contract: '',   
      communityList: [
        {
          name: '',   
          url: '',
        }
      ]
    },   
    holdAmount: 0,   
    holdRank: '',   
    totalBuyAmount: '',   
    sellAmount: '',   
    holdCost: '',   
    holdAmountValue: '',   
    profit: '',   
    profitRate: '',   
    chainUrl: '',   
    updateTime: 0,   
    addrName: '',
    groupId: '',
    showTip: false
  },
  e: null,
}

const reducer = (state = initialState, { type, payload }: NftDetailsActions) => {
  switch (type) {
    case NFT_DETAILS_SUCCEE: {
      return {
        ...state,
        nftDetails: (payload as Response<NftDetailsItem>).data,
      }
    }
    case NFT_DETAILS_FAIL:
      return {
        ...state,
        e: payload as Error,
      }
    default:
      return state
  }
}

export default reducer
