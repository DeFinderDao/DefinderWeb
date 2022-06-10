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
  symbol?: string,
  symbolAddr?: string,
  price?: string, 
  priceIncreaseRate?: string, 
  holdAddrCount?: string, 
  addHoldAddrCount?: string, 
  addNetBuyAmount?: string, 
  addNetBuyAsset?: string, 
  bigOrderInAmount?: string,
  bigOrderInAsset?: string, 
  bigOrderOutAmount?: string,
  bigOrderOutAsset?: string,
  holdSymbolTop50Rate?: string, 
  holdSymbolTop50ChangeRate?: string, 
  holdSymbolTop100Rate?: string, 
  holdSymbolTop100ChangeRate?: string, 
  time?: string, 
  logo?: string,
}
export default function ShareToken({ symbolAddr, visible = false, onClose }: ShareTokenProps) {
  const { formatMessage } = useIntl();
  const f = (id: string) => formatMessage({ id });
  const router = useRouter();
  const { locale } = router;

  const [info, setInfo] = useState<ShareInfo>({})
  const [str, setStr] = useState('')
  const [twitter, setTwitter] = useState('')
  const [code, setCode] = useState('loading')
  const apiClient = new ApiClient()
  useEffect(() => {
    if (visible) {
      getSymbolInfo(symbolAddr)
    } else {
      setInfo({})
      setStr('')
      setTwitter('')
      setCode('loading')
    }
  }, [visible])
  const getSymbolInfo = async (val: string) => {
    setCode('loading')
    try {
      const data = await apiClient.get(`/market/share/info?symbolAddr=${val}`)
      if (data.code === CODE_SUCCESS) {
        setInfo(data.data as ShareInfo);
        const item = data.data as ShareInfo
        if (item) {
          drawImg(item)
          setStr(`${f('shareProjectReport')}
${f('shareSymbol')}：${item.symbol}
${f('shareSymbolAddr')}：${item.symbolAddr}
${f('sharePrice')}：$${Global.formatNum(item.price)}  (${increaseNumber(item.priceIncreaseRate as string)})
${f('shareHoldAddrCount')}：${Global.formatNum(item.holdAddrCount)}
${f('shareAddHoldAddrCount')}：${Global.formatNum(item.addHoldAddrCount)}

${f('shareAddNetBuyAmount')}：${Global.formatNum(item.addNetBuyAmount)} ${item.symbol}  ($ ${Global.formatNum(item.addNetBuyAsset)})
${f('shareBigOrderInAmount')}：${Global.formatNum(item.bigOrderInAmount)} ${item.symbol}  ($ ${Global.formatNum(item.bigOrderInAsset)})
${f('shareBigOrderOutAmount')}：${Global.formatNum(item.bigOrderOutAmount)} ${item.symbol}  ($ ${Global.formatNum(item.bigOrderOutAsset)})
${f('shareHoldSymbolTop50Rate')}：${item.holdSymbolTop50Rate}%  (${increaseNumber(item.holdSymbolTop50ChangeRate as string)})
${f('shareHoldSymbolTop100Rate')}：${item.holdSymbolTop100Rate}%  (${increaseNumber(item.holdSymbolTop100ChangeRate as string)})

${f('shareTime')}：${moment(item.time).format('YYYY-MM-DD HH:mm')}
${f('shareVisitWebsite')}：app.definder.info
DeFinder-Make crypto investment easier
`)
          setTwitter(`@DefinderGlobal
Token: ${item.symbol}
Contract address: ${Global.abbrSymbolAddress(item.symbolAddr as string)}
Price: $${Global.formatNum(item.price)}  (${increaseNumber(item.priceIncreaseRate as string)})
Holders: ${Global.formatBigNum(item.holdAddrCount)}
New holders(24h): ${Global.formatBigNum(item.addHoldAddrCount)}
Net buying of new holders: ${Global.formatBigNum(item.addNetBuyAmount)} ${item.symbol}  ($ ${Global.formatBigNum(item.addNetBuyAsset)})

Link : app.definder.info/market-detail/market-page/${item.symbolAddr}`)
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
    // const canvas = document.getElementById('mycanvas') as HTMLCanvasElement
    const canvas = document.createElement("canvas") as HTMLCanvasElement
    const bgImg = new Image();
    bgImg.src = '/images/share_bg.png';
    bgImg.crossOrigin = '*';
    const logoImg = new Image();
    logoImg.src = '/images/definder-logo.svg';
    logoImg.crossOrigin = '*';
    const tokenImg = new Image();
    tokenImg.src = infoItem.logo as string;
    tokenImg.crossOrigin = '*';
    canvas.width = 924;
    canvas.height = 660;

    if (bgImg.complete) {
      if (logoImg.complete) {
        if (tokenImg.complete) {
          drawAvatar(canvas, bgImg, logoImg, tokenImg, infoItem)
        } else {
          tokenImg.onload = () => {
            drawAvatar(canvas, bgImg, logoImg, tokenImg, infoItem)
          }
        }
      } else {
        logoImg.onload = () => {
          if (tokenImg.complete) {
            drawAvatar(canvas, bgImg, logoImg, tokenImg, infoItem)
          } else {
            tokenImg.onload = () => {
              drawAvatar(canvas, bgImg, logoImg, tokenImg, infoItem)
            }
          }
        }
      }
    } else {
      bgImg.onload = () => {
        if (logoImg.complete) {
          if (tokenImg.complete) {
            drawAvatar(canvas, bgImg, logoImg, tokenImg, infoItem)
          } else {
            tokenImg.onload = () => {
              drawAvatar(canvas, bgImg, logoImg, tokenImg, infoItem)
            }
          }
        } else {
          logoImg.onload = () => {
            if (tokenImg.complete) {
              drawAvatar(canvas, bgImg, logoImg, tokenImg, infoItem)
            } else {
              tokenImg.onload = () => {
                drawAvatar(canvas, bgImg, logoImg, tokenImg, infoItem)
              }
            }
          }
        }
      }
    }
  }

  const drawAvatar = (canvas: HTMLCanvasElement, bgImg: HTMLImageElement, logoImg: HTMLImageElement, tokenImg: HTMLImageElement, infoItem: ShareInfo) => {
    let ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, 924, 660)
    ctx.textAlign = 'left'
    ctx.drawImage(bgImg, 300, 100);

    ctx.drawImage(logoImg, 50, 22);
    ctx.font = 'bold 33px Arial';
    ctx.fillStyle = '#7377de'
    ctx.font = 'bold 20px Arial';
    ctx.fillText('Make crypto investment easier', 250, 48);

    circleImg(ctx, tokenImg, 50, 90, 20);
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 28px Arial';
    ctx.fillText(infoItem.symbol as string, 115, 120);
    ctx.font = 'bold 28px Arial';
    ctx.fillText(`$ ${Global.formatNum(infoItem.price)}`, 255, 120);
    ctx.fillStyle = increaseNumber(infoItem.priceIncreaseRate as string).indexOf('-') > -1 ? '#EF5F81' : increaseNumber(infoItem.priceIncreaseRate as string).indexOf('+') > -1 ? '#44BE90' : '#fff'
    ctx.font = 'bold 20px Arial';
    ctx.fillText(increaseNumber(infoItem.priceIncreaseRate as string), 255 + `$ ${Global.formatNum(infoItem.price)}`.length * 20, 120);

    ctx.fillStyle = '#737E82'
    ctx.font = '20px Arial';
    ctx.fillText(f('shareHoldAddrCount'), 50, 200);
    ctx.fillStyle = '#fff'
    ctx.font = '20px Arial';
    ctx.fillText(Global.formatNum(infoItem.holdAddrCount), locale == 'zh' ? 200 : 160, 200);

    ctx.fillStyle = '#737E82'
    ctx.font = '20px Arial';
    ctx.fillText(f('shareAddHoldAddrCount'), 50, 240);
    ctx.fillStyle = '#fff'
    ctx.font = '20px Arial';
    ctx.fillText(Global.formatNum(infoItem.addHoldAddrCount), locale == 'zh' ? 300 : 370, 240);

    ctx.fillStyle = '#737E82'
    ctx.font = '20px Arial';
    ctx.fillText(f('shareAddNetBuyAmount'), 50, 280);
    ctx.fillStyle = '#fff'
    ctx.font = '20px Arial';
    const addNetBuyAmount = `${Global.formatNum(infoItem.addNetBuyAmount)}  ${infoItem.symbol}`
    ctx.fillText(addNetBuyAmount, locale == 'zh' ? 270 : 380, 280);
    ctx.fillStyle = '#737E82'
    ctx.font = '20px Arial';
    ctx.fillText(`($ ${Global.formatNum(infoItem.addNetBuyAsset)})`, locale == 'zh' ? addNetBuyAmount.length * 10 + 320 : addNetBuyAmount.length * 10 + 430, 280);

    ctx.fillStyle = '#737E82'
    ctx.font = '20px Arial';
    ctx.fillText(f('shareBigOrderInAmount'), 50, 320);
    ctx.fillStyle = '#fff'
    ctx.font = '20px Arial';
    const bigOrderInAmount = `${Global.formatNum(infoItem.bigOrderInAmount)}  ${infoItem.symbol}`
    ctx.fillText(bigOrderInAmount, locale == 'zh' ? 220 : 300, 320);
    ctx.fillStyle = '#737E82'
    ctx.font = '20px Arial';
    ctx.fillText(`($ ${Global.formatNum(infoItem.bigOrderInAsset)})`, locale == 'zh' ? bigOrderInAmount.length * 10 + 270 : bigOrderInAmount.length * 10 + 350, 320);

    ctx.fillStyle = '#737E82'
    ctx.font = '20px Arial';
    ctx.fillText(f('shareBigOrderOutAmount'), 50, 360);
    ctx.fillStyle = '#fff'
    ctx.font = '20px Arial';
    const bigOrderOutAmount = `${Global.formatNum(infoItem.bigOrderOutAmount)}  ${infoItem.symbol}`
    ctx.fillText(bigOrderOutAmount, locale == 'zh' ? 220 : 300, 360);
    ctx.fillStyle = '#737E82'
    ctx.font = '20px Arial';
    ctx.fillText(`($ ${Global.formatNum(infoItem.bigOrderOutAsset)})`, locale == 'zh' ? bigOrderOutAmount.length * 10 + 270 : bigOrderOutAmount.length * 10 + 350, 360);

    ctx.fillStyle = '#737E82'
    ctx.font = '20px Arial';
    ctx.fillText(f('shareHoldSymbolTop50Rate'), 50, 440);
    ctx.fillStyle = '#fff'
    ctx.font = '20px Arial';
    ctx.fillText(`${infoItem.holdSymbolTop50Rate}%`, locale == 'zh' ? 370 : 590, 440);
    ctx.fillStyle = '#737E82'
    ctx.font = '20px Arial';
    ctx.fillText(`(${infoItem.holdSymbolTop50ChangeRate}%)`, locale == 'zh' ? `${infoItem.holdSymbolTop50Rate}%`.length * 10 + 420 : `${infoItem.holdSymbolTop50Rate}%`.length * 10 + 640, 440);

    ctx.fillStyle = '#737E82'
    ctx.font = '20px Arial';
    ctx.fillText(f('shareHoldSymbolTop100Rate'), 50, 480);
    ctx.fillStyle = '#fff'
    ctx.font = '20px Arial';
    ctx.fillText(`${infoItem.holdSymbolTop100Rate}%`, locale == 'zh' ? 380 : 600, 480);
    ctx.fillStyle = '#737E82'
    ctx.font = '20px Arial';
    ctx.fillText(`(${infoItem.holdSymbolTop100ChangeRate}%)`, locale == 'zh' ? `${infoItem.holdSymbolTop100Rate}%`.length * 10 + 430 : `${infoItem.holdSymbolTop100Rate}%`.length * 10 + 650, 480);

    ctx.fillStyle = '#737E82'
    ctx.font = '20px Arial';
    ctx.fillText(f('shareTime'), 50, 560);
    ctx.fillStyle = '#fff'
    ctx.font = '20px Arial';
    ctx.fillText(moment(infoItem.time).format('YYYY-MM-DD HH:mm'), locale == 'zh' ? 180 : 200, 560);

    ctx.fillStyle = '#737E82'
    ctx.font = '20px Arial';
    ctx.fillText(f('shareVisitWebsite'), 50, 600);
    ctx.fillStyle = '#fff'
    ctx.font = '20px Arial';
    ctx.fillText('app.definder.info', locale == 'zh' ? 300 : 480, 600);

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
      onCancel={onClose}
      className="share-token-modal"
      footer={null}>
      <div className="share-token">
        {code != 'success' ? <div className="share-code-box">
          {code == 'loading' ? <Spin /> : null}
          {code == 'error' ? <ReloadOutlined className="reload-icon" onClick={() => { getSymbolInfo(symbolAddr) }} /> : null}
        </div> : null}
        {/* <canvas id="mycanvas"></canvas> */}
        <ShareBox info={info} scale={1} />
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
                  // const dom = document.getElementById('shareTokenBox1') as HTMLElement
                  // domtoimage.toBlob(dom)
                  //   .then(function (blob) {
                  //     saveAs(blob, `${info.symbol}.png`);
                  //   });
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
  scale: number
}
function ShareBox({ info, scale }: ShareBoxProps) {
  const { formatMessage } = useIntl();
  const f = (id: string) => formatMessage({ id });

  return (
    <div id={`shareTokenBox${scale}`} className={`py-${6 * scale} px-${11 * scale} bt-radius-${10 * scale}`}>
      <div className={`flex items-center mb-${12 * scale}`}>
        <img className={`w-${77 * scale}`} src="/images/definder-logo.svg" alt="" />
        <span className={`color-primary ml-${8 * scale} text-${12 * scale}`}>Make crypto investment easier</span>
      </div>
      {info ?
        <>
          <div className={`text-${18 * scale} mb-${10 * scale} flex items-center`}>
            <TokenLogo
              className="contect-logo"
              src={info.logo}
              style={{
                width: 18 * scale,
                height: 18 * scale,
                marginRight: 10 * scale
              }}
            />
            <span>{info.symbol}</span>
            <span className={`ml-${28 * scale}`}>$ {Global.formatNum(info.price)} <span className={`text-${12 * scale}`}>&nbsp;{Global.formatIncreaseNumber(info.priceIncreaseRate as string)}</span></span>
          </div>
          <div className={`flex mb-${10 * scale}`} style={{ justifyContent: 'space-between' }}>
            <InfoItem scale={scale} title={f('shareHoldAddrCount')} num={Global.formatNum(info.holdAddrCount)} />
          </div>
          <div className={`flex mb-${10 * scale}`} style={{ justifyContent: 'space-between' }}>
            <InfoItem scale={scale} title={f('shareAddHoldAddrCount')} num={Global.formatNum(info.addHoldAddrCount)} />
          </div>
          <div className={`mb-${10 * scale}`}>
            <InfoItem scale={scale} title={f('shareAddNetBuyAmount')} num={Global.formatNum(info.addNetBuyAmount)} symbol={info.symbol} price={info.addNetBuyAsset} />
          </div>
          <div className={`mb-${10 * scale}`}>
            <InfoItem scale={scale} title={f('shareBigOrderInAmount')} num={Global.formatNum(info.bigOrderInAmount)} symbol={info.symbol} price={info.bigOrderInAsset} />
          </div>
          <div className={`mb-${27 * scale}`}>
            <InfoItem scale={scale} title={f('shareBigOrderOutAmount')} num={Global.formatNum(info.bigOrderOutAmount)} symbol={info.symbol} price={info.bigOrderOutAsset} />
          </div>
          <div className={`mb-${12 * scale}`}>
            <InfoItem scale={scale} title={f('shareHoldSymbolTop50Rate')} num={`${info.holdSymbolTop50Rate}%`} rate={info.holdSymbolTop50ChangeRate} />
          </div>
          <div className={`mb-${17 * scale}`}>
            <InfoItem scale={scale} title={f('shareHoldSymbolTop100Rate')} num={ `${info.holdSymbolTop100Rate}%`} rate={info.holdSymbolTop100ChangeRate} />
          </div>
          <div className={`flex`} style={{ justifyContent: 'space-between' }}>
            <InfoItem scale={scale} title={f('shareTime')} time={info.time} />
          </div>
          <div className={`flex mb-${20 * scale}`} style={{ justifyContent: 'space-between' }}>
            <InfoItem scale={scale} title={f('shareVisitWebsite')} num="app.definder.info" />
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
  scale: number,
  symbol?: string,
  price?: string,
  rate?: string,
  time?: string,
}
function InfoItem(params: InfoItemProps) {
  return (
    <div className={`text-${13 * params.scale}`}>
      <span className="color-grey">{params.title}</span>
      {params.num ? <span className={`color-white ml-${18 * params.scale}`}>{params.num}</span> : null}
      {params.symbol ? <span className="color-white"> {params.symbol}</span> : null}
      {params.price ? <span className="color-grey"> ($ {Global.formatNum(params.price)})</span> : null}
      {params.rate ? <span className="color-grey"> ({Global.formatIncreaseNumber(params.rate)})</span> : null}
      {params.time ? <span className={`color-grey ml-${18 * params.scale}`}>{moment(params.time).format('YYYY-MM-DD HH:mm')}</span> : null}
    </div>
  )
}