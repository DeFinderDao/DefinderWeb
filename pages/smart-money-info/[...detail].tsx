import React, { useEffect, useState } from 'react'
import 'styles/marketDetail.less'
import 'styles/smart-money-info.less'
import ApiClient from 'utils/ApiClient'
import Breadcrumb from 'components/Breadcrumb/breadcrumb'
import {
  MarketPageDetailAction,
} from 'redux/types/MarketPageDetailTypes';
import { useRouter } from 'next/router'
import { getMarketDetailSuccess } from 'redux/actions/MarketPageAction'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from 'redux/reducers'
import DefinderLoading from 'components/DefinderLoading'
import SMBaseInfo from 'components/SmartMoneyInfo/BaseInfo'
import TransactionData from 'components/SmartMoneyInfo/TransactionData'
import CurrencyHoldingRanking from 'components/SmartMoneyInfo/CurrencyHoldingRanking'
import TransactionRecord from 'components/SmartMoneyInfo/TransactionRecord'
import { SMCateroryItem } from 'redux/types/SmartMoneyTypes'
import { CODE_SUCCESS } from 'utils/ApiServerError'
import SubscriptionSmartMoney from 'components/Subscription/smartMoney'

interface Category {
  list: SMCateroryItem[],
  total: number
}
export default function SmartMoneyInfo() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { query } = router;
  const { detail } = query;

  const addr = detail && detail.length > 1 ? detail[detail.length - 1] : undefined;
  const isEmpty = typeof addr === 'undefined';
  const { marketDetail } = useSelector((state: AppState) => state.marketPage);
  const { level } = useSelector((state: AppState) => state.userInfo);

  const [categoryData, setCategoryData] = useState<SMCateroryItem[]>([])
  function requestData() {
    const apiClient = new ApiClient<Category>();
    apiClient.get('/smart/money/category').then(result => {
      if (result.code === CODE_SUCCESS) {
        setCategoryData(result.data.list);
      } else {
        setCategoryData([])
      }
    });
  }
  useEffect(() => {
    if (level == 0) {
      return
    }
    if (addr) {
      requestData()
      const apiClient = new ApiClient<MarketPageDetailAction>()
      apiClient.get(`/market/detail?symbolAddr=${addr}`).then(result => {
        dispatch(getMarketDetailSuccess(result.data));
      }, e => {
        router.replace('/_error')
      });
    }
  }, [addr, level])
  return (
    <>
      {level == 1 ?
        (isEmpty || marketDetail.symbolAddr == null || !addr || marketDetail.symbolAddr != addr ?
          <DefinderLoading /> :
          <SmartMoneyInfoBody props={marketDetail} categoryData={categoryData} />)
        :
        <SubscriptionSmartMoney />
      }
    </>
  )
}

function SmartMoneyInfoBody({ props, categoryData }: { props: MarketPageDetailAction, categoryData: SMCateroryItem[] }) {
  return (
    <>
      <Breadcrumb lastItem={props.symbol} borderBottom={true} />
      <div className="market-detail">
        <div className="item-box">
          <div className="block-item" style={{ padding: 0, borderTop: 0, minHeight: 'auto' }}>
            <SMBaseInfo data={props} />
          </div>
        </div>
        <div className="item-box">
          <TransactionData
            categoryData={categoryData}
            symbolAddr={props.symbolAddr}
            symbol={props.symbol}
          />
        </div>
        <div className="item-box">
          <CurrencyHoldingRanking
            categoryData={categoryData}
            symbolAddr={props.symbolAddr}
            symbol={props.symbol}
          />
        </div>
        <div className="item-box">
          <TransactionRecord
            categoryData={categoryData}
            symbolAddr={props.symbolAddr}
            symbol={props.symbol}
          />
        </div>
      </div>
    </>
  )
}