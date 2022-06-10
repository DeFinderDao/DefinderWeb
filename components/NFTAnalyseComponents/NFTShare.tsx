import { Button, message, Modal, Spin } from "antd";
import { DownloadOutlined, TwitterOutlined, ReloadOutlined } from '@ant-design/icons';
import moment from "moment";
import { useEffect, useState } from "react";
import Global from "utils/Global";
import 'styles/MarketComponents/shareToken.less'
import { TokenLogo } from "components/TokenLogo";
import ApiClient from "utils/ApiClient";
import { CODE_SUCCESS } from "utils/ApiServerError";
import { saveAs } from 'file-saver';
import { useIntl } from "react-intl";
import { NOT_A_NUMBER } from "utils/env";
import { useRouter } from "next/router";
import DefinEmpty from "components/Header/definEmpty";

interface ShareTokenProps {
  symbolAddr: string,
  visible: boolean,
  onClose: () => void,
}

interface ShareInfo {
  symbol: string, 
  symbolAddress: string, 
  marketValueEth: string,
  floorPriceEth: string, 
  holdAddressCount: string, 
  whaleHoldAddressCount: string, 
  tradingVolume24H: string, 
  tradingVolumeIncrease24H: string, 
  tradingAvgVolume24H: string, 
  tradingAvgVolumeIncrease24H: string, 
  highVolume24H: string, 
  highVolumeIncrease24H: string, 
  lowVolume24H: string, 
  lowVolumeIncrease24H: string, 
  tradingNum24H: string,
  tradingNumIncrease24H: string,
  time: string,
  logo: string,
}
export default function NFTShare({ symbolAddr, visible = false, onClose }: ShareTokenProps) {
  const { formatMessage } = useIntl();
  const f = (id: string) => formatMessage({ id });
  const router = useRouter();
  const { locale } = router;

  const [info, setInfo] = useState<ShareInfo | null>()
  const [str, setStr] = useState('')
  const [twitter, setTwitter] = useState('')
  const [code, setCode] = useState('loading')
  const apiClient = new ApiClient()
  useEffect(() => {
    if (visible) {
      getSymbolInfo(symbolAddr)
    } else {
      setInfo(null)
      setStr('')
      setTwitter('')
      setCode('loading')
    }
  }, [visible])
  const getSymbolInfo = async (val: string) => {
    setCode('loading')
    try {
      const data = await apiClient.get(`/market/nft/share/info?symbolAddr=${val}`)
      if (data.code === CODE_SUCCESS) {
        setInfo(data.data as ShareInfo);
        const item = data.data as ShareInfo
        if (item) {
          drawImg(item)
          setStr(`${f('shareProjectReport')}
${f('shareSymbol')}：${item.symbol}
${f('shareSymbolAddr')}：${item.symbolAddress}
${f('shareMarketValueEth')}：${Global.formatNum(item.marketValueEth)} ETH
${f('shareFloorPriceEth')}：${Global.formatNum(item.floorPriceEth)} ${item.floorPriceEth !== null ? 'ETH' : ''}
${f('shareHoldAddressCount')}：${Global.formatNum(item.holdAddressCount)}
${f('shareWhaleHoldAddressCount')}：${Global.formatNum(item.whaleHoldAddressCount)}

${f('shareTradeValue')}：${Global.formatNum(item.tradingVolume24H)} ETH  ${increaseNumber(item.tradingVolumeIncrease24H)}
${f('shareTradeAvgPrice')}：${Global.formatNum(item.tradingAvgVolume24H)} ETH  ${increaseNumber(item.tradingAvgVolumeIncrease24H)}
${f('shareTradeHighPrice')}：${Global.formatNum(item.highVolume24H)} ${item.highVolume24H !== null ? 'ETH' : ''}  ${increaseNumber(item.highVolumeIncrease24H)}
${f('shareTradeLowPrice')}：${Global.formatNum(item.lowVolume24H)} ${item.lowVolume24H !== null ? 'ETH' : ''}  ${increaseNumber(item.lowVolumeIncrease24H)}
${f('shareTradeNumber')}：${Global.formatNum(item.tradingNum24H)}  ${increaseNumber(item.tradingNumIncrease24H)}

${f('shareTime')}：${moment(item.time).format('YYYY-MM-DD HH:mm')}
${f('shareVisitWebsite')}：app.definder.info
DeFinder-Make crypto investment easier
`)
          setTwitter(`@DefinderGlobal
Collection:${item.symbol}
Contract address:${Global.abbrSymbolAddress(item.symbolAddress as string)}
Market Cap:${Global.formatBigNum(item.marketValueEth)}ETH
Floor price:${Global.formatBigNum(item.floorPriceEth)}ETH
Holders:${Global.formatBigNum(item.holdAddressCount)}

Volume(24H):${Global.formatBigNum(item.tradingVolume24H)}ETH
Avg Price(24H):${Global.formatBigNum(item.tradingAvgVolume24H)}ETH
Max Price(24H):${Global.formatBigNum(item.highVolume24H)}ETH
Min Price(24H):${Global.formatBigNum(item.lowVolume24H)}ETH

Link : app.definder.info/nft-analyse-detail/nft-analyse/${item.symbolAddress}`)
        } else {
          setCode('success')
        }
      } else {
        setCode('error')
        message.error(data.message)
      }
    } catch (e) {
      setCode('error')
      message.error((e as unknown as Error).message)
    }
  }

  const [binary, setBinary] = useState<Uint8Array>()
  const drawImg = (infoItem: ShareInfo) => {
    // const canvas = document.getElementById("canvas") as HTMLCanvasElement
    const canvas = document.createElement("canvas") as HTMLCanvasElement
    const bgImg = new Image();
    bgImg.src = '/images/share_bg.png';
    bgImg.crossOrigin = '*';
    const logoImg = new Image();
    logoImg.src = '/images/definder-logo.svg';
    logoImg.crossOrigin = '*';
    const tokenImg = new Image();
    tokenImg.src = infoItem.logo as string || '';
    tokenImg.crossOrigin = '*';
    canvas.width = 924;
    canvas.height = 600;

    if (bgImg.complete) {
      if (logoImg.complete) {
        if (infoItem.logo) {
          tokenImgComplete(canvas, bgImg, logoImg, tokenImg, infoItem)
        } else {
          drawAvatar(canvas, bgImg, logoImg, '', infoItem)
        }
      } else {
        logoImg.onload = () => {
          if (infoItem.logo) {
            tokenImgComplete(canvas, bgImg, logoImg, tokenImg, infoItem)
          } else {
            drawAvatar(canvas, bgImg, logoImg, '', infoItem)
          }
        }
      }
    } else {
      bgImg.onload = () => {
        if (logoImg.complete) {
          if (infoItem.logo) {
            tokenImgComplete(canvas, bgImg, logoImg, tokenImg, infoItem)
          } else {
            drawAvatar(canvas, bgImg, logoImg, '', infoItem)
          }
        } else {
          logoImg.onload = () => {
            if (infoItem.logo) {
              tokenImgComplete(canvas, bgImg, logoImg, tokenImg, infoItem)
            } else {
              drawAvatar(canvas, bgImg, logoImg, '', infoItem)
            }
          }
        }
      }
    }
  }
  const tokenImgComplete = (canvas: HTMLCanvasElement, bgImg: HTMLImageElement, logoImg: HTMLImageElement, tokenImg: HTMLImageElement, infoItem: ShareInfo) => {
    if (tokenImg.complete) {
      drawAvatar(canvas, bgImg, logoImg, tokenImg, infoItem)
    } else {
      tokenImg.onload = () => {
        drawAvatar(canvas, bgImg, logoImg, tokenImg, infoItem)
      }
    }
  }
  const drawAvatar = (canvas: HTMLCanvasElement, bgImg: HTMLImageElement, logoImg: HTMLImageElement, tokenImg: HTMLImageElement | string, infoItem: ShareInfo) => {
    let ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, 924, 600)
    ctx.textAlign = 'left'
    ctx.drawImage(bgImg, 300, 100);

    ctx.drawImage(logoImg, 50, 22);
    ctx.font = 'bold 33px Arial';
    ctx.fillStyle = '#7377de'
    ctx.font = 'bold 20px Arial';
    ctx.fillText('Make crypto investment easier', 250, 48);

    if (tokenImg != '') {
      circleImg(ctx, tokenImg as HTMLImageElement, 50, 90, 20);
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 28px Arial';
      ctx.fillText(infoItem.symbol as string, 115, 120);
    } else {
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 28px Arial';
      ctx.fillText(infoItem.symbol as string, 50, 120);
    }

    ctx.fillStyle = '#737E82'
    ctx.font = '20px Arial';
    ctx.fillText(f('shareSymbolAddr'), 50, 200);
    ctx.fillStyle = '#fff'
    ctx.font = '20px Arial';
    ctx.fillText(infoItem.symbolAddress, locale == 'zh' ? 200 : 260, 200);

    ctx.fillStyle = '#737E82'
    ctx.font = '20px Arial';
    ctx.fillText(f('shareMarketValueEth'), 50, 240);
    ctx.fillStyle = '#fff'
    ctx.font = '20px Arial';
    ctx.fillText(`${Global.formatNum(infoItem.marketValueEth)}  ETH`, locale == 'zh' ? 200 : 180, 240);

    ctx.fillStyle = '#737E82'
    ctx.font = '20px Arial';
    ctx.fillText(f('shareFloorPriceEth'), 500, 240);
    ctx.fillStyle = '#fff'
    ctx.font = '20px Arial';
    ctx.fillText(`${Global.formatNum(infoItem.floorPriceEth)}  ${infoItem.floorPriceEth !== null ? 'ETH' : ''}`, locale == 'zh' ? 650 : 660, 240);

    ctx.fillStyle = '#737E82'
    ctx.font = '20px Arial';
    ctx.fillText(f('shareHoldAddressCount'), 50, 280);
    ctx.fillStyle = '#fff'
    ctx.font = '20px Arial';
    ctx.fillText(Global.formatNum(infoItem.holdAddressCount), locale == 'zh' ? 200 : 160, 280);

    ctx.fillStyle = '#737E82'
    ctx.font = '20px Arial';
    ctx.fillText(f('shareWhaleHoldAddressCount'), 500, 280);
    ctx.fillStyle = '#fff'
    ctx.font = '20px Arial';
    ctx.fillText(Global.formatNum(infoItem.whaleHoldAddressCount), locale == 'zh' ? 650 : 660, 280);

    ctx.fillStyle = '#737E82'
    ctx.font = '20px Arial';
    ctx.fillText(f('shareTradeValue'), 50, 360);
    ctx.fillStyle = '#fff'
    ctx.font = '20px Arial';
    const tradingVolume24H = `${Global.formatNum(infoItem.tradingVolume24H)}  ETH`
    ctx.fillText(tradingVolume24H, locale == 'zh' ? 200 : 180, 360);
    ctx.fillStyle = increaseNumber(infoItem.tradingVolumeIncrease24H as string).indexOf('-') > -1 ? '#EF5F81' : increaseNumber(infoItem.tradingVolumeIncrease24H as string).indexOf('+') > -1 ? '#44BE90' : '#fff'
    ctx.font = '20px Arial';
    ctx.fillText(`${increaseNumber(infoItem.tradingVolumeIncrease24H)}`, locale == 'zh' ? tradingVolume24H.length * 10 + 220 : tradingVolume24H.length * 10 + 200, 360);

    ctx.fillStyle = '#737E82'
    ctx.font = '20px Arial';
    ctx.fillText(f('shareTradeAvgPrice'), 500, 360);
    ctx.fillStyle = '#fff'
    ctx.font = '20px Arial';
    const tradingAvgVolume24H = `${Global.formatNum(infoItem.tradingAvgVolume24H)}  ETH`
    ctx.fillText(tradingAvgVolume24H, locale == 'zh' ? 650 : 660, 360);
    ctx.fillStyle = increaseNumber(infoItem.tradingAvgVolumeIncrease24H as string).indexOf('-') > -1 ? '#EF5F81' : increaseNumber(infoItem.tradingAvgVolumeIncrease24H as string).indexOf('+') > -1 ? '#44BE90' : '#fff'
    ctx.font = '20px Arial';
    ctx.fillText(`${increaseNumber(infoItem.tradingAvgVolumeIncrease24H)}`, locale == 'zh' ? tradingAvgVolume24H.length * 10 + 670 : tradingAvgVolume24H.length * 10 + 692, 360);

    ctx.fillStyle = '#737E82'
    ctx.font = '20px Arial';
    ctx.fillText(f('shareTradeHighPrice'), 50, 400);
    ctx.fillStyle = '#fff'
    ctx.font = '20px Arial';
    const highVolume24H = `${Global.formatNum(infoItem.highVolume24H)}  ${infoItem.highVolume24H !== null ? 'ETH' : ''}`
    ctx.fillText(highVolume24H, locale == 'zh' ? 200 : 210, 400);
    ctx.fillStyle = increaseNumber(infoItem.highVolumeIncrease24H as string).indexOf('-') > -1 ? '#EF5F81' : increaseNumber(infoItem.highVolumeIncrease24H as string).indexOf('+') > -1 ? '#44BE90' : '#fff'
    ctx.font = '20px Arial';
    ctx.fillText(`${increaseNumber(infoItem.highVolumeIncrease24H)}`, locale == 'zh' ? highVolume24H.length * 10 + 220 : highVolume24H.length * 10 + 230, 400);

    ctx.fillStyle = '#737E82'
    ctx.font = '20px Arial';
    ctx.fillText(f('shareTradeLowPrice'), 500, 400);
    ctx.fillStyle = '#fff'
    ctx.font = '20px Arial';
    const lowVolume24H = `${Global.formatNum(infoItem.lowVolume24H)}  ${infoItem.lowVolume24H !== null ? 'ETH' : ''}`
    ctx.fillText(lowVolume24H, locale == 'zh' ? 650 : 660, 400);
    ctx.fillStyle = increaseNumber(infoItem.lowVolumeIncrease24H as string).indexOf('-') > -1 ? '#EF5F81' : increaseNumber(infoItem.lowVolumeIncrease24H as string).indexOf('+') > -1 ? '#44BE90' : '#fff'
    ctx.font = '20px Arial';
    ctx.fillText(`${increaseNumber(infoItem.lowVolumeIncrease24H)}`, locale == 'zh' ? lowVolume24H.length * 10 + 670 : lowVolume24H.length * 10 + 692, 400);

    ctx.fillStyle = '#737E82'
    ctx.font = '20px Arial';
    ctx.fillText(f('shareTradeNumber'), 50, 440);
    ctx.fillStyle = '#fff'
    ctx.font = '20px Arial';
    const tradingNum24H = `${Global.formatNum(infoItem.tradingNum24H)}`
    ctx.fillText(tradingNum24H, locale == 'zh' ? 200 : 330, 440);
    ctx.fillStyle = increaseNumber(infoItem.tradingNumIncrease24H as string).indexOf('-') > -1 ? '#EF5F81' : increaseNumber(infoItem.tradingNumIncrease24H as string).indexOf('+') > -1 ? '#44BE90' : '#fff'
    ctx.font = '20px Arial';
    ctx.fillText(`${increaseNumber(infoItem.tradingNumIncrease24H)}`, locale == 'zh' ? tradingNum24H.length * 10 + 220 : tradingNum24H.length * 10 + 350, 440);

    ctx.fillStyle = '#737E82'
    ctx.font = '20px Arial';
    ctx.fillText(f('shareTime'), 50, 520);
    ctx.fillStyle = '#fff'
    ctx.font = '20px Arial';
    ctx.fillText(moment(infoItem.time).format('YYYY-MM-DD HH:mm'), locale == 'zh' ? 200 : 160, 520);

    ctx.fillStyle = '#737E82'
    ctx.font = '20px Arial';
    ctx.fillText(f('shareVisitWebsite'), 50, 560);
    ctx.fillStyle = '#fff'
    ctx.font = '20px Arial';
    ctx.fillText('app.definder.info', locale == 'zh' ? 300 : 480, 560);

    const binaryString = window.atob(canvas.toDataURL().split(',')[1]);
    const length = binaryString.length;
    const binaryArray = new Uint8Array(length);
    for (let i = 0; i < length; i++)
      binaryArray[i] = binaryString.charCodeAt(i);
    setBinary(binaryArray)
    setCode('success')
  }

  const circleImg = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, r: number) => {
    ctx.save();
    let d = 2 * r;
    let cx = x + r;
    let cy = y + r;
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.clip();
    ctx.drawImage(img, x, y, d, d);
    ctx.restore();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  const increaseNumber = (num: number | string) => {
    if (Number(num) == 0) {
      if (num === null) {
        return NOT_A_NUMBER
      } else {
        return '0%'
      }
    } else {
      if (Number(num) < 0) {
        return `-${num.toString().substring(1)}%`
      } else {
        return `+${num}%`
      }
    }
  }

  const shareTokenText = (item: ShareInfo) => {
    const copyUrlBtn = document.createElement('textarea');
    copyUrlBtn.value = str;
    document.body.appendChild(copyUrlBtn);
    copyUrlBtn.select();
    document.execCommand('Copy');
    document.body.removeChild(copyUrlBtn);
    message.success(f('copySuccess'))
  }
  return (
    <Modal
      visible={visible}
      centered
      closable={false}
      width="600px"
      onCancel={onClose}
      className="share-token-modal"
      footer={null}>
      <div className="share-token">
        {code != 'success' ? <div className="share-code-box">
          {code == 'loading' ? <Spin /> : null}
          {code == 'error' ? <ReloadOutlined className="reload-icon" onClick={() => { getSymbolInfo(symbolAddr) }} /> : null}
        </div> : null}
        {/* <canvas id="canvas"></canvas> */}
        <ShareBox info={info as ShareInfo} />
        {info ?
          <>
            <div className="flex justify-between px-11 mb-12">
              <Button className="w-30 h-24 text-13 flex items-center justify-center color-white btn-grey"
                onClick={() => {
                  shareTokenText(info)
                }}>
                <svg
                  className="icon"
                  aria-hidden="true"
                  style={{
                    width: '12px',
                    height: '12px',
                    marginRight: '10px',
                    cursor: 'pointer',
                  }}>
                  <use xlinkHref="#icon-copy-white"></use>
                </svg>
                {f('shareBtnCopy')}
              </Button>
              <Button className="w-30 h-24 text-13 flex items-center justify-center" type="primary"
                onClick={() => {
                  saveAs(new Blob([binary as Uint8Array], { type: 'image/png' }), `${info.symbol}.png`);
                }}>
                <DownloadOutlined />
                {f('shareBtnDown')}
              </Button>
              <Button className="w-30 h-24 text-13 flex items-center justify-center btn-lighBlue" type="primary">
                <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(twitter)}`} target="_blank" className="h-24 text-13 flex items-center justify-center">
                  <TwitterOutlined />
                  {f('shareBtnTweet')}
                </a>
              </Button>
            </div>
          </>
          :
          <>
            <div className="flex justify-center px-11 mb-12">
              <Button className="w-30 h-24 text-13 flex items-center justify-center color-white btn-grey" onClick={onClose}>
                {f('close')}
              </Button>
            </div>
          </>
        }
      </div>
    </Modal>
  )
}

interface ShareBoxProps {
  info: ShareInfo,
}
function ShareBox({ info }: ShareBoxProps) {
  const { formatMessage } = useIntl();
  const f = (id: string) => formatMessage({ id });

  return (
    <div id='shareTokenBox1' className="py-6 px-11 bt-radius-10">
      <div className="flex items-center mb-12">
        <img className="w-77" src="/images/definder-logo.svg" alt="" />
        <span className="color-primary ml-8 text-12">Make crypto investment easier</span>
      </div>
      {info ?
        <>
          <div className="text-18 mb-10 flex items-center">
            {info.logo ? <TokenLogo
              className="contect-logo"
              src={info.logo}
              style={{
                width: 18,
                height: 18,
                marginRight: 10
              }}
            /> : null}
            <span>{info.symbol}</span>
          </div>
          <div className="flex mb-10" style={{ justifyContent: 'space-between' }}>
            <InfoItem title={f('shareSymbolAddr')} num="" symbol={info.symbolAddress} width='100%' />
          </div>
          <div className="flex" style={{ justifyContent: 'space-between' }}>
            <InfoItem title={f('shareMarketValueEth')} num={Global.formatNum(info.marketValueEth)} symbol="ETH" />
            <InfoItem title={f('shareFloorPriceEth')} num={Global.formatNum(info.floorPriceEth)} symbol={info.floorPriceEth !== null ? 'ETH' : ''} />
          </div>
          <div className="flex mb-20" style={{ justifyContent: 'space-between' }}>
            <InfoItem title={f('shareHoldAddressCount')} num={Global.formatNum(info.holdAddressCount)} />
            <InfoItem title={f('shareWhaleHoldAddressCount')} num={Global.formatNum(info.whaleHoldAddressCount)} />
          </div>
          <div className="flex" style={{ justifyContent: 'space-between' }}>
            <InfoItem title={f('shareTradeValue')} num={Global.formatNum(info.tradingVolume24H)} symbol="ETH" rate={info.tradingVolumeIncrease24H} />
            <InfoItem title={f('shareTradeAvgPrice')} num={Global.formatNum(info.tradingAvgVolume24H)} symbol="ETH" rate={info.tradingAvgVolumeIncrease24H} />
          </div>
          <div className="flex" style={{ justifyContent: 'space-between' }}>
            <InfoItem title={f('shareTradeHighPrice')} num={Global.formatNum(info.highVolume24H)} symbol={info.highVolume24H !== null ? 'ETH' : ''} rate={info.highVolumeIncrease24H} />
            <InfoItem title={f('shareTradeLowPrice')} num={Global.formatNum(info.lowVolume24H)} symbol={info.lowVolume24H !== null ? 'ETH' : ''} rate={info.lowVolumeIncrease24H} />
          </div>
          <div className="mb-17">
            <InfoItem title={f('shareTradeNumber')} num={Global.formatNum(info.tradingNum24H)} rate={info.tradingNumIncrease24H} width='100%' />
          </div>
          <div className="flex" style={{ justifyContent: 'space-between' }}>
            <InfoItem title={f('shareTime')} time={info.time} />
          </div>
          <div className="flex mb-20" style={{ justifyContent: 'space-between' }}>
            <InfoItem title={f('shareVisitWebsite')} num="app.definder.info" />
          </div>
        </>
        :
        <DefinEmpty />
      }
    </div>
  )
}

interface InfoItemProps {
  title: string,
  num?: string,
  symbol?: string,
  rate?: string,
  time?: string,
  width?: string
}
function InfoItem(params: InfoItemProps) {
  return (
    <div className="text-13" style={{ width: params.width ? params.width : '50%' }}>
      <span className="color-grey mr-18">{params.title}</span>
      {params.num ? <span className="color-white">{params.num}</span> : null}
      {params.symbol ? <span className="color-white">&nbsp;{params.symbol}</span> : null}
      {params.rate ? <span className="color-grey">&nbsp;&nbsp;{Global.formatIncreaseNumber(params.rate)}</span> : null}
      {params.time ? <span className="color-grey ml-18">{moment(params.time).format('YYYY-MM-DD HH:mm')}</span> : null}
    </div>
  )
}