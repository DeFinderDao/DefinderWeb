import { Breadcrumb } from "antd"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { useIntl } from "react-intl"
import 'styles/marketDetailMore.less'
import BuySellRank from "components/SmartMoney/TransactionData/BuySellRank";
import 'styles/smart-money.less'
import HotContractAddRank from "components/SmartMoney/TransferData/HotContractAddRank"
import { SubscriptionDiscover } from "components/Subscription/discover"
import { useSelector } from "react-redux"
import { AppState } from "redux/reducers"
import Global from "utils/Global"
import { DefaultLocale } from "utils/env"

export default function marketDetailMore() {
  useEffect(() => {
    window!.document!.querySelector('.ant-layout-content')!.scrollTop = 0
  }, [])
  const router = useRouter()

  const { locale = DefaultLocale } = useRouter();
  const { formatMessage } = useIntl()
  const f = (id: string) => formatMessage({ id })
  const { level } = useSelector((state: AppState) => state.userInfo);

  const navigateMarketPage = (e: React.MouseEvent<HTMLElement, MouseEvent>) => Global.openNewTag(e, router, `/${locale}/smart-money`, 'replace');

  const pageType = typeof router.query.detail !== 'undefined' && router.query.detail.length > 1 ? router.query.detail[router.query.detail.length - 1] : null;
  useEffect(() => {
    if (pageType) {
      setType(pageType)
    }
  }, [pageType])
  const [type, setType] = useState<string | null>(pageType)

  return (
    <>
      {
        type
          ?
          <div className="market-discover-detail-scroll market-page">
            <div className="defi-breadcrumb">
              <Breadcrumb separator=">">
                <Breadcrumb.Item onClick={navigateMarketPage}>{f('smart-money')}</Breadcrumb.Item>
                <Breadcrumb.Item>{f(`sm${type}Title`)}</Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <div className="market-detail-more discover-container">
              <div className="common-table attention-address common-dark-table common-table-tip">
                <div className="tableAction">
                  <div className="tableTip">
                    <span>{f(`sm${type}Title`)}</span>
                    <span className="tableTipHorn"></span>
                    <span className="tableTipTriangle"></span>
                  </div>
                  <span className="tipTitle">{f(`sm${type}Tip`)}</span>
                  {type == 'Buy' || type == 'Sell' ? (
                    <span className="tipTitle" style={{ fontWeight: 100, minWidth: 200 }}>{f('stableCurrencyExcluded')}</span>
                  ) : (
                    ''
                  )}
                </div>
                {level == 0 ?
                  <SubscriptionDiscover />
                  :
                  <div>
                    {type == 'Buy' || type == 'Sell' ? (
                      <BuySellRank type={type} showMore={false} />
                    ) : (
                      ''
                    )}
                    {type == 'Hot' ? (
                      <HotContractAddRank showMore={false} />
                    ) : (
                      ''
                    )}
                  </div>
                }
              </div>
            </div>
          </div>
          :
          null
      }
    </>
  )
}