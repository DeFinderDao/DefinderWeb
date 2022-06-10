import { BackTop, Breadcrumb } from "antd"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { useIntl } from "react-intl"
import { UpCircleOutlined } from '@ant-design/icons';
import 'styles/marketDetailMore.less'
import 'styles/market-page.less'
import { SubscriptionDiscover } from "components/Subscription/discover";
import { useSelector } from "react-redux";
import { AppState } from "redux/reducers";
import Global from "utils/Global";
import IncreasedConcentrationOfChips from "components/NFTDiscover/IncreasedConcentrationOfChips";
import WhalesContinueToEnter from "components/NFTDiscover/WhalesContinueToEnter";
import NFTHoldingAddressesIncreaseRapidly from "components/NFTDiscover/NFTHoldingAddressesIncreaseRapidly";
import PopularCastingProjects from "components/NFTDiscover/PopularCastingProjects";
import PopularDeals from "components/NFTDiscover/PopularDeals";

export default function marketDetailMore() {
  useEffect(() => {
    
    window!.document!.querySelector('.ant-layout-content')!.scrollTop = 0
  }, [])
  const router = useRouter()
  
  const { formatMessage } = useIntl()
  const f = (id: string) => formatMessage({ id })
  const { level } = useSelector((state: AppState) => state.userInfo);

  const navigateMarketPage = (event: React.MouseEvent) => Global.openNewTag(event, router, '/nft-discover', 'replace')

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
                <Breadcrumb.Item>{f(type + '-title')}</Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <div className="market-detail-more discover-container">
              <div className="common-table attention-address common-dark-table common-table-tip">
                <div className="tableAction">
                  <div className="tableTip">
                    <span>{f(type + '-title')}</span>
                    <span className="tableTipHorn"></span>
                    <span className="tableTipTriangle"></span>
                  </div>
                  <span className="tipTitle">{f(type + '-tip')}</span>
                </div>
                <div className="content">
                  {type == 'popular-deals' ? (
                    (level == 0 ? null : <PopularDeals showMore={false} />)
                  ) : (
                    ''
                  )}
                  {type == 'popular-casting-projects' ? (
                    (level == 0 ? null : <PopularCastingProjects showMore={false} />)
                  ) : (
                    ''
                  )}
                  {type == 'nft-holding-addresses-increase-rapidly' ? (
                    (level == 0 ? null : <NFTHoldingAddressesIncreaseRapidly showMore={false} />)
                  ) : (
                    ''
                  )}
                  {type == 'whales-continue-to-enter' ? (
                    (level == 0 ? null : <WhalesContinueToEnter showMore={false} />)
                  ) : (
                    ''
                  )}
                  {type == 'increased-concentration-of-chips' ? (
                    (level == 0 ? null : <IncreasedConcentrationOfChips showMore={false} />)
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