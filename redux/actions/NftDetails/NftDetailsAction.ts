import { Response } from 'redux/types'
import { NftDetailsItem } from 'redux/types/NftDetailsTypes'

// redux action 
export const NFT_DETAILS_SUCCEE = 'nft_details_success'
export const NFT_DETAILS_FAIL = 'nft_details_fail'

export const getNftDetailsSuccess = (data: Response<NftDetailsItem>) => ({
  type: NFT_DETAILS_SUCCEE,
  payload: data,
})

export const getNftDetailsFail = (e: Error) => ({
  type: NFT_DETAILS_FAIL,
  payload: e,
})