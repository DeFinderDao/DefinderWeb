import ApiClient from "utils/ApiClient";
import { Breadcrumb, Button, Popover, Tooltip } from 'antd'
import React, { useEffect, useState } from "react";
import 'styles/investmentDetails.less'
import BasicInformation from "components/InvestmentComponents/BasicInformation";
import PositionIncome from "components/InvestmentComponents/PositionIncome";
import InvestmentDualAxes from "components/InvestmentComponents/InvestmentDualAxes";
import InvestmentHistory from "components/InvestmentComponents/InvestmentHistory";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import moment from "moment";
import { ADMIN_ADDRESS } from "utils/env";
import { useDispatch, useSelector } from "react-redux";
import { getInvestmentDetailsSuccess } from "redux/actions/InvestmentDetails/InvestmentDetailsAction";
import { AddrTag, InvestmentDetailsItem } from "redux/types/InvestmentDetailsTypes";
import DefinderLoading from "components/DefinderLoading";
import { AppState } from "redux/reducers";
import { showWalletDialog } from "redux/actions/UserInfoAction";
import Global from "utils/Global";
import UpdateTimeCom from "components/UpdateTimeCom";

export default function InvestmentDetails() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { query } = router;
  const { detail } = query;

  const symbolAddr = detail && detail.length > 1 ? detail[1] : null;
  const addrName = detail && detail.length > 2 ? detail[2] : null;
  const groupId = detail && detail.length > 3 ? detail[3] : null;
  const isEmpty = typeof symbolAddr === 'undefined';
  const { investmentDetails } = useSelector((state: AppState) => state.investmentDetailsReducer);
  const { address, level } = useSelector((state: AppState) => state.userInfo);
  useEffect(() => {
    if (symbolAddr && addrName && address && level != 0) {
      const body = {
        addrName: addrName,
        groupId: groupId,
        symbolAddr: symbolAddr,
      }
      const apiClient = new ApiClient<InvestmentDetailsItem>()
      apiClient.post(`/addr/invest/base/info`, { data: body, }).then(result => {
        dispatch(getInvestmentDetailsSuccess(result));
      }, e => {
        router.replace('/_error')
      });
    }
  }, [symbolAddr, addrName, address, level])

  const { formatMessage } = useIntl()
  const f = (id: string) => formatMessage({ id })

  const navigateAddressAnalyse = (event: React.MouseEvent) => Global.openNewTag(event, router, `/address-analyse/${encodeURIComponent(addrName as string)}/${groupId}`, 'replace')

  return (<div>
    <div className="defi-breadcrumb">
      <Breadcrumb separator=">">
        <Breadcrumb.Item onClick={navigateAddressAnalyse}>{f('address-analyse')}</Breadcrumb.Item>
        <Breadcrumb.Item>{investmentDetails.symbolInfo.symbol}{f('investmentInvestmentDetails')}</Breadcrumb.Item>
      </Breadcrumb>
    </div>

    {!address || level === 0 ?
      <NoLoginPro address={address} level={level} />
      :
      (isEmpty || !symbolAddr || (investmentDetails && investmentDetails.symbolInfo && investmentDetails.symbolInfo.symbolAddr != symbolAddr)
        ?
        <DefinderLoading />
        :
        <InvestmentDetailsBody
          props={{
            ...investmentDetails, addrName: addrName, groupId: groupId
          }}
        />)
    }
  </div>)
}

function NoLoginPro({ address, level }: { address: string, level: number }) {
  const { formatMessage } = useIntl()
  const f = (id: string) => formatMessage({ id })
  const dispatch = useDispatch();
  const handleLogin = () => {
    dispatch(showWalletDialog());
  }
  const router = useRouter();
  const handleGoPro = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    Global.openNewTag(e, router, '/member');
  }
  
  const content = !address ?
    (<div className="no-login-pro">
      <span>{f('buyPro')}</span>
      <span className="login-button" onClick={handleLogin}>{f('loginRightNow')}</span>
    </div>) :
    level === 0 ?
      (<div className="no-pro">
        <span>{f('notAllowedToSeeTokenInvestDetailContent')}</span>
        <Button className="go-pro-button" type="primary" onClick={handleGoPro}>{f('subscriptionBtn')}</Button>
      </div>) : null;
  return (<div className="investment-detail-empty">{content}</div>);
}

function InvestmentDetailsBody({ props }: { props: InvestmentDetailsItem }) {

  useEffect(() => {
    window!.document!.querySelector('.ant-layout-content')!.scrollTop = 0
  }, [])
  
  const { formatMessage } = useIntl()
  const f = (id: string) => formatMessage({ id })
  const router = useRouter()

  const addrTag = (name: string) => {
    if (name.length > 10) {
      return name.substr(0, 3) + '....' + name.substr(-3)
    } else {
      return name
    }
  }
  return (
    <>
      <div className="investment-head">
        <div className="investment-head-box">
          <img className="investment-head-img" src="/images/investment_header.svg" alt="" />
          <span className="investment-head-addr">
            {
              props.addressList.length > 1
                ?
                <Popover
                  placement="bottom"
                  content={<div>
                    {props.addressList.map((item, index) => {
                      if (index < 10) {
                        return <span key={index}
                          style={{ cursor: 'pointer', display: 'block' }}
                          onClick={(e) => {
                            Global.openNewTag(e, router, `/address-analyse/${item}`);
                          }}>{item}</span>
                      }
                    })}
                    {props.addressList.length > 10 ? (
                      <span style={{ textAlign: 'center' }}>......</span>
                    ) : (
                      ''
                    )}
                  </div>}
                  trigger="hover"
                  overlayClassName="pop-list"
                >
                  <span>
                    {f('investmentAddressGroup')}
                  </span>
                </Popover>
                :
                props.addressList[0]
            }
          </span>
          {props.addrTagList ? <Marks systemTagList={props.addrTagList} /> : null}
        </div>
        <UpdateTimeCom updateTime={props.updateTime} />
      </div>
      <div className="investment-detail">
        <div className="item-box">
          <BasicInformation showTip={props.showTip} info={props} />
          <PositionIncome
            addrName={props.addrName as string}
            groupId={props.groupId}
            symbolAddr={props.symbolInfo.symbolAddr} />
        </div>
        <div className="item-box">
          <InvestmentDualAxes
            type="InvestmentPrice"
            addrName={props.addrName as string}
            groupId={props.groupId as string}
            symbolAddr={props.symbolInfo.symbolAddr} />
          <InvestmentDualAxes
            type="InvestmentNumber"
            addrName={props.addrName as string}
            groupId={props.groupId as string}
            symbolAddr={props.symbolInfo.symbolAddr} />
        </div>
        <div className="item-box">
          <InvestmentHistory addressList={props.addressList} symbolAddr={props.symbolInfo.symbolAddr} />
        </div>
      </div>
    </>
  );
}
function Marks({ systemTagList }: { systemTagList: AddrTag[] }) {
  const [showMarks, setShowMarks] = useState(false);
  useEffect(() => {
    setShowMarks(true);
  }, []);
  
  const { formatMessage } = useIntl()
  const f = (id: string) => formatMessage({ id })
  const router = useRouter()
  
  const tagsData: { text: string, splitedText: string, groupId: number, isSubAddr: boolean }[] = [];
  const splitedTags = (tag: string) => {
    // if (tag.length > 10) {
    //   return tag.substr(0, 3) + '....' + tag.substr(-3)
    // } else {
    //   return tag;
    // }
    return tag;
  }
  if (systemTagList && systemTagList.length > 0) {
    systemTagList.forEach((tag) => {
      tagsData.push({
        text: tag.addrTag,
        splitedText: splitedTags(tag.addrTag.replace(ADMIN_ADDRESS, '')),
        groupId: tag.groupId,
        isSubAddr: tag.isSubAddr,
      });
    });
  }

  if (tagsData.length === 0 || !showMarks) {
    return <></>;
  } else {
    
    const box = document.getElementsByClassName("investment-head-box")[0];
    const img = document.getElementsByClassName("investment-head-img")[0];
    const addr = document.getElementsByClassName("investment-head-addr")[0];
    const bodyWidth = document.getElementsByTagName('body')[0].offsetWidth - 440;
    const boxWidth = (box as HTMLElement).offsetWidth - 200 < bodyWidth ? bodyWidth : (box as HTMLElement).offsetWidth - 200;
    const imgWidth = (img as HTMLElement).offsetWidth;
    const addrWidth = (addr as HTMLElement).offsetWidth;
    let tempWidth = 0;
    const padding = 8 * 2;
    const margin = 10;
    const includeWidth = 0; 
    let lastShowTagIndex = -1;
    const hasOverflow = tagsData.some((item, index) => {
      const tagWidth = getTextWidth(item.splitedText, getCanvasFontSize(box)) > 100 ? 100 : getTextWidth(item.splitedText, getCanvasFontSize(box));
      tempWidth += (tagWidth + padding + margin + includeWidth);

      if (tempWidth > (boxWidth - imgWidth - addrWidth - 65)) {
        lastShowTagIndex = index;
        return true;
      } else {
        return false;
      }
    });
    if (!hasOverflow) {
      lastShowTagIndex = tagsData.length;
    }
    let tagsComponent = [];

    for (let i = 0; i < lastShowTagIndex; i++) {
      const tagData = tagsData[i];
      tagsComponent.push(
        <span className="investment-head-tag" key={i}
          style={{ cursor: 'pointer' }}
          onClick={(e) => {
            Global.openNewTag(e, router, `/address-analyse/${tagData.text}/${tagData.groupId}`);
          }}>
          <Tooltip placement="top" title={tagData.text.replace(ADMIN_ADDRESS, '')}>
            <span style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 100
            }}>{`${tagData.splitedText}`}</span>
            {/* {tagData.isSubAddr ? `(${f('investmentInclude')})` : null} */}
          </Tooltip>
        </span>);
    }
    return <>{tagsComponent}{lastShowTagIndex < tagsData.length ? <span style={{ color: '#fff' }}>⋯</span> : ''}</>;
  }
}
const canvasHolder: { canvas: HTMLCanvasElement | null } = {
  canvas: null
};

function getCssStyle(element: Element, prop: string) {
  return window.getComputedStyle(element, null).getPropertyValue(prop);
}

function getCanvasFontSize(el: Element = document.body) {
  const fontWeight = getCssStyle(el, 'font-weight') || 'normal';
  const fontSize = getCssStyle(el, 'font-size') || '16px';
  const fontFamily = getCssStyle(el, 'font-family');

  return `${fontWeight} ${fontSize} ${fontFamily}`;
}

function getTextWidth(text: string, font: string): number {
  // re-use canvas object for better performance
  const canvas = canvasHolder.canvas || (canvasHolder.canvas = document.createElement("canvas"));
  const context = canvas.getContext("2d");
  if (context != null) {
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
  } else {
    return 0;
  }
}

// interface AddrTag {
//   addrTag: string,
//   groupId: number,
//   isSubAddr: boolean
// }
// interface Community {
//   name: string,
//   url: string,
// }
// interface Symbolinfo {
//   symbol: string,
//   symbolAddr: string,
//   contract: string,
//   communityList: Community[],
// }
// interface InvestmentDetailsItem {
//   addressList: string[],
//   addrTagList: AddrTag[],
//   symbolInfo: Symbolinfo,
//   holdAmount: string,
//   holdAmountValue: string,
//   holdCost: string,
//   inAvgPrice: string,
//   price: string,
//   profit: string,
//   profitRate: string,
//   holdRank: string,
//   addrName?: string,
//   groupId?: string,
//   updateTime: number
// }
// export async function getServerSideProps(context: any) {
//   const { query } = context
//   const { detail } = query
//   const symbolAddr = detail && detail.length > 1 ? detail[1] : null;
//   const addrName = detail && detail.length > 2 ? detail[2] : null;
//   const groupId = detail && detail.length > 3 ? detail[3] : null;

//   if (addrName && symbolAddr) {
//     const body = {
//       addrName: addrName,
//       groupId: groupId,
//       symbolAddr: symbolAddr,
//     }
//     const apiClient = new ApiClient(context)
//     try {
//       const response = await apiClient.post(`/addr/invest/base/info`, { data: body, })
//       const data = response as unknown as Response<InvestmentDetailsItem>;
//       console.log(data.data.addrTagList);

//       return {
//         props: {
//           ...data.data,
//           addrName,
//           groupId
//         }, // will be passed to the page component as props
//       }
//     } catch (e) {
//       return {
//         redirect: {
//           destination: '/_error',
//           permanent: false,
//         },
//       }
//     }
//   } else {
//     return {
//       redirect: {
//         destination: '/_error',
//         permanent: false,
//       },
//     }
//   }
// }