import { Col, Row, Tooltip } from "antd";
import { QuestionCircleOutlined, WarningFilled } from '@ant-design/icons'
import React from "react";
import { useIntl } from "react-intl";
import Global from 'utils/Global'
import { useRouter } from "next/router";
import { DefaultLocale } from "utils/env";
import WaterMarkContent from "components/WaterMarkContent";

interface AddrTag {
  addrTag: string,
  groupId: number,
  isSubAddr: boolean
}
interface Community {
  name: string,
  url: string,
}
interface Symbolinfo {
  symbol: string,
  symbolAddr: string,
  contract?: string,
  communityList: Community[],
}
interface Props {
  showTip: boolean,
  info: {
    addressList: string[],
    addrTagList: AddrTag[],
    symbolInfo: Symbolinfo,
    holdAmount: string,
    holdAmountValue: string,
    holdCost: string,
    inAvgPrice: string,
    price: string,
    profit: string,
    profitRate: string,
    holdRank: string,
  }
}
export default function BasicInformation({ showTip, info }: Props) {
  const { formatMessage } = useIntl()
  const f = (id: string) => formatMessage({ id })
  const router = useRouter();
  const { locale } = router;

  const logoArr = ['website', 'twitter', 'telegram', 'discord', 'github', 'reddit', 'facebook']
  const logoIconArr = ['official-website', 'twitter', 'telegram1', 'discord1', 'github', 'reddit', 'facebook']
  return (
    <div className="block-item item-small">
      <div className="item-title">
        <span className="item-title-box">
          <span className="title-driver"></span>
          {f('investmentBasicInformationTitle')}
        </span>
      </div>
      <div style={{ padding: '10px 20px 10px 35px', position: 'relative' }}>
        <WaterMarkContent right={40} bottom={28} />
        {
          showTip ?
            (<div className="contract-warning">
              <span className="contract-warning-text"><WarningFilled style={{ marginRight: 3, color: '#fff' }} />{f('showTip')}</span>
            </div>) : <></>
        }
        <div className="grid-flex">
          <Row>
            <Col span={locale === DefaultLocale ? 5 : 4}>
              <span className="grid-label">{f('investmentBasicInformationName')}</span>
            </Col>
            <Col span={locale === DefaultLocale ? 19 : 20}>
              <span>
                <span style={{ marginRight: 20 }}>{info.symbolInfo.symbol}</span>
                {
                  info.symbolInfo.communityList ? info.symbolInfo.communityList.map((item, index) => {
                    return <span key={index} onClick={() => {
                      window.open(item.url)
                    }}>
                      <svg
                        className="icon"
                        aria-hidden="true"
                        style={{
                          width: 20,
                          height: 20,
                          marginRight: 10,
                          verticalAlign: 'middle',
                          cursor: 'pointer'
                        }}>
                        <use xlinkHref={`#icon-${logoIconArr[logoArr.indexOf(item.name)]}`}></use>
                      </svg>
                    </span>
                  }) : null
                }
              </span>
            </Col>
          </Row>
        </div>
        <div className="grid-flex">
          <Row>
            <Col span={locale === DefaultLocale ? 5 : 4}>
              <span className="grid-label">{f('investmentBasicInformationAddr')}</span>
            </Col>
            <Col span={locale === DefaultLocale ? 19 : 20}>
              <span>
                <span>{info.symbolInfo.symbolAddr}</span>
              </span>
            </Col>
          </Row>
        </div>
        <div className="grid-box">
          <Row>
            <Col span={12}>
              <InfoGridItem
                label={f('investmentBasicInformationNum')}
                symbol={info.symbolInfo.symbol}
                num={info.holdAmount === null ? null : Number(info.holdAmount)}
              />
            </Col>
            <Col span={12}>
              <InfoGridItem
                label={f('investmentBasicInformationPrice')}
                money={info.holdAmountValue === null ? null : Number(info.holdAmountValue)}
              />
            </Col>
          </Row>
        </div>
        <div className="grid-box">
          <Row>
            <Col span={12}>
              <InfoGridItem
                label={f('investmentBasicInformationCost')}
                money={info.holdCost === null ? null : Number(info.holdCost)}
              />
            </Col>
            <Col span={12}>
              <InfoGridItem
                label={f('investmentBasicInformationAve')}
                money={info.inAvgPrice === null ? null : Number(info.inAvgPrice)}
                des={f('investmentBasicInformationAveDesc')}
              />
            </Col>
          </Row>
        </div>
        <div className="grid-box">
          <Row>
            <Col span={12}>
              <InfoGridItem
                label={f('investmentBasicInformationCurrent')}
                money={info.price === null ? null : Number(info.price)}
              />
            </Col>
            <Col span={12}>
              <InfoGridItem
                label={f('investmentBasicInformationProfit')}
                money={info.profit === null ? null : Number(info.profit)}
                color
                des={f('investmentBasicInformationProfitDesc')}
              />
            </Col>
          </Row>
        </div>
        <div className="grid-box">
          <Row>
            <Col span={12}>
              <InfoGridItem
                label={f('investmentBasicInformationYield')}
                percent={Number(info.profitRate)}
                des={f('investmentBasicInformationYieldDesc')}
              />
            </Col>
            <Col span={12}>
              <InfoGridItem
                label={f('investmentBasicInformationRank')}
                symbol={f('investmentBasicInformationRankUnit')}
                num={info.holdRank === null ? null : Number(info.holdRank)}
              />
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}
interface InfoGridItemProps {
  label: string, num?: number | null, money?: number | null, color?: boolean, symbol?: string, percent?: number, des?: string
}
function InfoGridItem({ label, num, money, symbol, color, percent, des }: InfoGridItemProps) {
  const router = useRouter();
  const { locale } = router;
  return (
    <Row>
      <Col span={locale === DefaultLocale ? 10 : 8}>
        <span className="grid-label">{label}</span>
      </Col>
      <Col span={locale === DefaultLocale ? 14 : 16}>
        <div>
          {symbol ? <span><span className="info-num">{Global.formatBigNum(num)}</span><span className="info-unit"> {symbol}</span></span> : null}
          {money !== undefined ? (
            money === null ? <span>N/A</span> : (money == 0 ?
              <span><span className="info-unit">$ </span><span className="info-num">0</span></span>
              : money < 0 ?
                <span className={`${color ? 'info-unit-red' : ''}`}><span>- $ </span><span className="info-num">{Global.formatBigNum(Math.abs(money))}</span></span>
                :
                <span className={`${color ? 'info-unit-green' : ''}`}><span>{color ? '+ ' : ''}$ </span><span className="info-num">{Global.formatBigNum(money)}</span></span>)) : null}
          {percent !== undefined ? Global.formatIncreaseNumber(percent) : null}
          {des ?
            <Tooltip
              placement="right"
              title={<div>{des}</div>}
            >
              <QuestionCircleOutlined
                style={{
                  fontSize: '14px',
                  marginLeft: '10px',
                  color: '#999'
                }}
              />
            </Tooltip> : null}
        </div>
      </Col>
    </Row>
  )
}