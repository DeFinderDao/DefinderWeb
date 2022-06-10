import { Col, Row } from 'antd'
import IncreasedConcentrationOfChips from 'components/NFTDiscover/IncreasedConcentrationOfChips';
import NFTHoldingAddressesIncreaseRapidly from 'components/NFTDiscover/NFTHoldingAddressesIncreaseRapidly';
import PopularCastingProjects from 'components/NFTDiscover/PopularCastingProjects';
import PopularDeals from 'components/NFTDiscover/PopularDeals';
import WhalesContinueToEnter from 'components/NFTDiscover/WhalesContinueToEnter';
import { useIntl } from 'react-intl';
import 'styles/market-page.less'

export default function NFTDiscover() {
  const { formatMessage } = useIntl();
  const f = (id: string) => formatMessage({ id });

  return (
    <div className="market-page">
      <div className="discover-container">
          <Row>
            <Col span={12} >
              <PopularDeals showMore={true} />
            </Col>
            <Col span={12}>
              <PopularCastingProjects showMore={true} />
            </Col>
            <Col span={12}>
              <NFTHoldingAddressesIncreaseRapidly showMore={true} />
            </Col>
            <Col span={12}>
              <WhalesContinueToEnter showMore={true} />
            </Col>
            <Col span={12} >
              <IncreasedConcentrationOfChips showMore={true} />
            </Col>
            <Col span={12}>
            </Col>
          </Row>
          <div className="more-to-discover">
            {/* {f('moreToDiscover')} */}
          </div>
      </div>
    </div>
  )
}