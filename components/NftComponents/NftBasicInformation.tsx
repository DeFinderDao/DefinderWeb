import { Col, message, Row, Tooltip } from "antd";
import { QuestionCircleOutlined, WarningFilled } from '@ant-design/icons'
import React from "react";
import { useIntl } from "react-intl";
import Global from 'utils/Global'
import { useRouter } from "next/router";
import { DefaultLocale } from "utils/env";
import { NftDetailsItem } from "redux/types/NftDetailsTypes";
import WaterMarkContent from "components/WaterMarkContent";
import { TokenLogo } from "components/TokenLogo";

interface Props {
  showTip: boolean,
  info: NftDetailsItem
}
export default function NftBasicInformation({ showTip, info }: Props) {
  const { formatMessage } = useIntl()
  const f = (id: string) => formatMessage({ id })
  const router = useRouter();
  const { locale } = router;

  const logoArr = ['website', 'twitter', 'telegram', 'discord', 'github', 'reddit', 'facebook']
  const logoIconArr = ['official-website', 'twitter', 'telegram1', 'discord1', 'github', 'reddit', 'facebook']
  return (
    <div className="block-item item-small">
      <WaterMarkContent />
      <div className="item-title">
        <span className="item-title-box">
          <span className="title-driver"></span>
          {f('nftBasicInformationTitle')}
        </span>
      </div>
      <div style={{ padding: '10px 20px 10px 35px' }}>

        {
          showTip ?
            (<div className="contract-warning">
              <span className="contract-warning-text"><WarningFilled style={{ marginRight: 3, color: '#fff' }} />{f('showTip')}</span>
            </div>) : <></>
        }
        <div className="grid-flex">
          <Row>
            <Col span={locale === DefaultLocale ? 5 : 4}>
              <span className="grid-label">{f('nftBasicInformationName')}</span>
            </Col>
            <Col span={locale === DefaultLocale ? 19 : 20}>
              <span>
                <TokenLogo
                  src={info.symbolInfo.symbolLogo}
                  style={{
                    width: 20,
                    height: 20,
                    marginRight: 10
                  }}
                />
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
              <span className="grid-label">{f('nftBasicInformationAddr')}</span>
            </Col>
            <Col span={locale === DefaultLocale ? 19 : 20}>
              <span>
                <span>{info.symbolInfo.symbolAddr}</span>
                <svg
                  className="icon"
                  aria-hidden="true"
                  style={{
                    width: '14px',
                    height: '16px',
                    marginLeft: 10,
                    cursor: 'pointer',
                    verticalAlign: 'middle'
                  }}
                  onClick={() => {
                    const copyUrlBtn = document.createElement('textarea');
                    copyUrlBtn.value = info.symbolInfo.symbolAddr;
                    document.body.appendChild(copyUrlBtn);
                    copyUrlBtn.select();
                    document.execCommand('Copy');
                    document.body.removeChild(copyUrlBtn);
                    message.success(f('copySuccess'))
                  }}>
                  <use xlinkHref="#icon-copy-blue"></use>
                </svg>
                <svg
                  className="icon"
                  aria-hidden="true"
                  style={{
                    width: 16, height: 16, marginLeft: 10, cursor: 'pointer',
                    verticalAlign: 'middle'
                  }}
                  onClick={() => {
                    window.open(info.chainUrl)
                  }}>
                  <use xlinkHref='#icon-etherscan'></use>
                </svg>
              </span>
            </Col>
          </Row>
        </div>
        <div className="grid-box">
          <Row>
            <Col span={12}>
              <InfoGridItem
                label={f('nftBasicInformationNum')}
                symbol={f('nftBasicInformationIndividualUnit')}
                num={info.holdAmount === null ? null : Number(info.holdAmount)}
              />
            </Col>
            <Col span={12}>
              <InfoGridItem
                label={f('nftBasicInformationPrice')}
                symbol={f('nftBasicInformationBitUnit')}
                num={info.holdRank === null ? null : Number(info.holdRank)}
              />
            </Col>
          </Row>
        </div>
        <div className="grid-box">
          <Row>
            <Col span={12}>
              <InfoGridItem
                label={f('nftBasicInformationCost')}
                symbol={f('nftBasicInformationIndividualUnit')}
                num={info.totalBuyAmount === null ? null : Number(info.totalBuyAmount)}
              />
            </Col>
            <Col span={12}>
              <InfoGridItem
                label={f('nftBasicInformationAve')}
                symbol={f('nftBasicInformationIndividualUnit')}
                num={info.sellAmount === null ? null : Number(info.sellAmount)}
              />
            </Col>
          </Row>
        </div>
        <div className="grid-box">
          <Row>
            <Col span={12}>
              <InfoGridItem
                label={f('nftBasicInformationCurrent')}
                symbol={'ETH'}
                num={info.holdCost === null ? null : Number(info.holdCost)}
                des={f('nftBasicInformationCurrentDesc')}
              />
            </Col>
            <Col span={12}>
              <InfoGridItem
                label={f('nftBasicInformationProfit')}
                symbol={'ETH'}
                num={info.holdAmountValue === null ? null : Number(info.holdAmountValue)}
                des={f('nftBasicInformationProfitDesc')}
              />
            </Col>
          </Row>
        </div>
        <div className="grid-box">
          <Row>
            <Col span={12}>
              <InfoGridItem
                label={f('nftBasicInformationYield')}
                num={info.profit === null ? null : Number(info.profit)}
                symbol={'ETH'}
                color
                des={f('nftBasicInformationYieldDesc')}
              />
            </Col>
            <Col span={12}>
              <InfoGridItem
                label={f('nftBasicInformationRank')}
                color
                percent={Number(info.profitRate)}
                des={f('nftBasicInformationRankDesc')}
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
          {symbol ? <span className={`${color ? (Number(num) > 0 ? 'info-unit-green' : Number(num) < 0 ? 'info-unit-red' : '') : ''}`}><span className="info-num">{Global.formatBigNum(num)}</span><span className={`${color ? (Number(num) > 0 ? 'info-unit-green' : Number(num) < 0 ? 'info-unit-red' : 'info-unit') : 'info-unit'}`}> {symbol}</span></span> : null}
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