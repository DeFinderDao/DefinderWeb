import { Tooltip } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { AppState } from "redux/reducers";
import { InfoDataProps, Symbol } from "redux/types/AddressAnalyseTypes";
import { DefaultLocale, NOT_A_NUMBER } from "utils/env";
import Global from "utils/Global";
import {
    QuestionCircleOutlined
} from '@ant-design/icons'
import NFTAnalyseHistory from "./NFTAnalyseHistory";
import { TokenLogo } from "components/TokenLogo";
import UpdateTimeCom from "components/UpdateTimeCom";

interface NFTDataOverviewProps {
    props: InfoDataProps,
    addrName: string | undefined,
    groupId: undefined | string
}

export default function NFTDataOverview({ props, addrName, groupId }: NFTDataOverviewProps) {
    const { formatMessage } = useIntl();
    const f = (id: string) => formatMessage({ id });
    const { isOpen } = useSelector((state: AppState) => state.menuList);
    const router = useRouter();
    const { locale = DefaultLocale, query } = router;

    const {
        contract,
        nftTotalAsset,
        nftTotalAssetLast,
        nftOperateSymbolList,
        nftProfit,
        updateTime
    } = props;

    const nftProfitNumber = Number(nftProfit);
    const nftProfitText = nftProfit === null ? NOT_A_NUMBER : (Global.formatBigNum(nftProfit.startsWith('-') ? nftProfit.substring(1) : nftProfit));
    const nftProfitTips = (<Tooltip
        placement="top"
        title={
            <>
                <div>{f('nftEarnAmountTips')}</div>
            </>}
    >
        <QuestionCircleOutlined
            style={{
                color: '#BEC4CC',
                fontSize: '16px',
                marginLeft: '10px',
            }}
        />
    </Tooltip>);
    let nftProfitWidget;
    if (nftProfitText === NOT_A_NUMBER) {
        nftProfitWidget = <span className="sub-content">{NOT_A_NUMBER}{nftProfitTips}</span>
    } else if (nftProfitNumber > 0) {
        nftProfitWidget = <span className="defi-color-Increase" style={{ flex: 4 }}>+&nbsp;{nftProfitText}&nbsp;ETH{nftProfitTips}</span>
    } else if (nftProfitNumber < 0) {
        nftProfitWidget = <span className="defi-color-reduce" style={{ flex: 4 }}>-&nbsp;{nftProfitText}&nbsp;ETH{nftProfitTips}</span>
    } else {
        nftProfitWidget = <span className="sub-content" style={{ flex: 4 }}>&nbsp;{nftProfitText}&nbsp;ETH{nftProfitTips}</span>
    }

    let leftLabelClassName = locale === DefaultLocale ? "label en-label-left-column" : "label cn-label-column";
    let rightLabelClassName = locale === DefaultLocale ? "label en-label-right-column" : "label cn-label-column";

    const projectMinWidth = !isOpen ? (locale === DefaultLocale ? 190 : 210) : 160
    return (
        <div className="white-block base-info" style={{ borderBottom: 'none', borderRight: 'none', height: 'auto', paddingBottom: 0 }}>
            <div className="header">
                <div className="title">{f('baseInfoNFT')}</div>
                <UpdateTimeCom updateTime={updateTime} />
            </div>
            <div className="info-content" style={{ position: 'relative' }}>
                <div className="horizantol">
                    <div className="horizantol-item right-padding">
                        <span className={leftLabelClassName} style={locale === DefaultLocale ? {width:'auto'} : {}}>{f('nftCalTotal')}</span>
                        <span className="sub-content">{nftTotalAsset}&nbsp;ETH
                            <Tooltip
                                placement="right"
                                title={
                                    <>
                                        <div>{f('nftCalTotalTips')}</div>
                                    </>}
                            >
                                <QuestionCircleOutlined
                                    style={{
                                        color: '#BEC4CC',
                                        fontSize: '16px',
                                        marginLeft: '10px',
                                    }}
                                />
                            </Tooltip>
                        </span>
                    </div>
                    <div className="horizantol-item">
                        <span className={rightLabelClassName} style={locale === DefaultLocale ? {marginLeft: 38} : {}}>{f('nftTotal')}</span>
                        <span className="sub-content">{Global.formatBigNum(nftTotalAssetLast)}&nbsp;ETH
                            <Tooltip
                                placement="right"
                                title={
                                    <>
                                        <div>{f('nftTotalTips')}</div>
                                    </>}
                            >
                                <QuestionCircleOutlined
                                    style={{
                                        color: '#BEC4CC',
                                        fontSize: '16px',
                                        marginLeft: '10px',
                                    }}
                                />
                            </Tooltip>
                        </span>
                    </div>
                </div>
                <div className="horizantol">
                    <div className="horizantol-item right-padding">
                        <span className={leftLabelClassName} >{f('nftProjects')}</span>

                        <span id="nft-projects" className="sub-content" style={{ minWidth: projectMinWidth }}>
                            {/* {`${nftOperateSymbolList ? nftOperateSymbolList.length : 0}`}<span className="unit" style={{ marginRight: 10 }}>&nbsp;{f('unit2')}</span> */}
                            <MemoProjects operateSymbolList={nftOperateSymbolList} containerId="nft-projects" minWidth={projectMinWidth}/>
                        </span>
                    </div>
                    
                    <div className="horizantol-item">
                        <span className={rightLabelClassName}>{f('nftEarnAmount')}</span>
                        {nftProfitWidget}
                    </div>
                </div>
            </div>
            <NFTAnalyseHistory addrName={addrName} groupId={groupId} />
        </div>
    );
}

const MemoProjects = React.memo(Projects);

function Projects(props: { operateSymbolList: Symbol[] | null, minWidth: number, containerId: string }) {
    const [showProjects, setShowProjects] = useState(false);
    const { operateSymbolList, minWidth, containerId } = props;
    const { formatMessage } = useIntl();
    const f = (id: string) => formatMessage({ id });
    useEffect(() => {
        setShowProjects(true);
    }, []);
    if (operateSymbolList && operateSymbolList.length > 0 && showProjects) {
        const tags = document.getElementById(containerId);
        const holderWidth = minWidth;
        const paddingLeft = getTextWidth(operateSymbolList.length.toString() + f('unit2'), getCanvasFontSize(tags as Element)) + 10;
        const paddingRight = 30;
        const marginRight = 5;
        const imgWidth = 16;
        let tmpWidth = paddingLeft + paddingRight;
        let lastShowIndex = -1;
        const hasOverflow = operateSymbolList.some((symbol, index) => {
            tmpWidth += (imgWidth + marginRight);
            if (tmpWidth > holderWidth) {
                lastShowIndex = index;
                return true;
            } else {
                return false;
            }
        });
        if (!hasOverflow) {
            lastShowIndex = operateSymbolList.length;
        }

        let projects = [];
        for (let i = 0; i < lastShowIndex; i++) {
            const item = operateSymbolList[i];
            projects.push(<TokenLogo style={{ width: 16, height: 16, borderRadius: 8, marginLeft: 5 }} src={item.symbolLogo} key={`img{${item.symbolAddr}}`} />);
        }
        const dots = hasOverflow ? (<span style={{ marginLeft: '5px' }}>...</span>) : '';
        return (<>
            {`${operateSymbolList.length}`}
            <span className="unit" style={{ marginRight: 10 }}>&nbsp;{f('unit2')}</span>
            {projects}{dots}
        </>);
    } else {
        return (<>0<span className="unit" style={{ marginRight: 10 }}>&nbsp;{f('unit2')}</span></>);
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