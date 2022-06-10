import { BackTop, Breadcrumb } from "antd"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { useIntl } from "react-intl"
import { UpCircleOutlined } from '@ant-design/icons';
import WhaleContinueIn from "components/MarketComponents/WhaleContinueIn";
import HolderAddressIncrease from "components/MarketComponents/HolderAddressIncrease";
import NewTokenIncreaseRapidly from "components/MarketComponents/NewTokenIncreaseRapidly";
import ConvergenceRateIncrease from "components/MarketComponents/ConvergenceRateIncrease";
import 'styles/marketDetailMore.less'
import 'styles/market-page.less'
import SMAdmission from "components/MarketComponents/SMAdmission";
import { SubscriptionDiscover } from "components/Subscription/discover";
import { useSelector } from "react-redux";
import { AppState } from "redux/reducers";
import Global from "utils/Global";

export default function marketDetailMore() {
  useEffect(() => {
    
    window!.document!.querySelector('.ant-layout-content')!.scrollTop = 0
  }, [])
  const router = useRouter()

  const { formatMessage } = useIntl()
  const f = (id: string) => formatMessage({ id })
  const { level } = useSelector((state: AppState) => state.userInfo);

  const navigateMarketPage = (event: React.MouseEvent) => Global.openNewTag(event, router, '/market-discover', 'replace')

  const pageType = typeof router.query.detail !== 'undefined' && router.query.detail.length > 1 ? router.query.detail[router.query.detail.length - 1] : null;
  console.log(pageType);
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
                <Breadcrumb.Item onClick={navigateMarketPage}>{f('market-discover')}</Breadcrumb.Item>
                <Breadcrumb.Item>{f(type + 'Title')}</Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <div className="market-detail-more discover-container">
              <div className="common-table attention-address common-dark-table common-table-tip">
                <div className="tableAction">
                  <div className="tableTip">
                    <span>{f(type + 'Title')}</span>
                    <span className="tableTipHorn"></span>
                    <span className="tableTipTriangle"></span>
                  </div>
                  <span className="tipTitle">{f(type + 'Tip')}</span>
                </div>
                <div className="content">
                  {type == 'holderAddressIncrease' ? (
                    (level == 0 ? null : <HolderAddressIncrease showMore={false} />)
                  ) : (
                    ''
                  )}
                  {type == 'newTokenIncreaseRapidly' ? (
                    (level == 0 ? null : <NewTokenIncreaseRapidly showMore={false} />)
                  ) : (
                    ''
                  )}
                  {type == 'convergenceRateIncrease' ? (
                    (level == 0 ? null : <ConvergenceRateIncrease showMore={false} />)
                  ) : (
                    ''
                  )}
                  {type == 'whaleContinueIn' ? (
                    (level == 0 ? null : <WhaleContinueIn showMore={false} />)
                  ) : (
                    ''
                  )}
                  {type == 'SMAdmission' ? (
                    (level == 0 ? null : <SMAdmission showMore={false} />)
                  ) : (
                    ''
                  )}
                  {level == 0 ? <SubscriptionDiscover /> : null}
                </div>
              </div>
            </div>
            <BackTop target={() => {
              return document.getElementsByClassName('market-discover-detail-scroll')[0] as unknown as HTMLElement
            }}>
              <div style={{
                height: 40,
                width: 40,
                borderRadius: 4,
                backgroundColor: 'rgba(16, 136, 233, 0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}><UpCircleOutlined style={{ fontSize: 27 }} /></div>
            </BackTop>
          </div>
          :
          null
      }
    </>
  )
}