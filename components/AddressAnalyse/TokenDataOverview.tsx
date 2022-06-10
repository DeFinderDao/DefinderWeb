import { Tooltip } from "antd";
import { useRouter } from "next/router";
import React from "react";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { AppState } from "redux/reducers";
import { InfoDataProps, Symbol } from "redux/types/AddressAnalyseTypes";
import { DefaultLocale, NOT_A_NUMBER } from "utils/env";
import Global from "utils/Global";
import {
  QuestionCircleOutlined
} from '@ant-design/icons'
import { TokenLogo } from "components/TokenLogo";
import EarningsTrend from "./EarningsTrend";
import UpdateTimeCom from "components/UpdateTimeCom";

interface TokenDataOverviewProps {
  props: InfoDataProps,
  addrName: string | undefined,
  groupId: undefined | string
}

export default function TokenDataOverview({ props, addrName, groupId }: TokenDataOverviewProps) {
  const { formatMessage } = useIntl();
  const f = (id: string) => formatMessage({ id });

  const { isOpen } = useSelector((state: AppState) => state.menuList);
  const router = useRouter();
  const { locale = DefaultLocale, query } = router;

  const {
    totalAsset,
    profit,
    operateSymbolList,
    contract,
    updateTime
  } = props;

  const totalAssetText = Global.formatBigNum(totalAsset);
  const totalAssetComponent = totalAssetText === NOT_A_NUMBER ?
    <span className="sub-content">{NOT_A_NUMBER}</span> : <>$&nbsp;<span className="sub-content">{totalAssetText}</span></>;

  let profitWidget;
  const profitNumber = Number(profit);
  const profitText = profit === null ? NOT_A_NUMBER : (Global.formatBigNum(profit.startsWith('-') ? profit.substring(1) : profit));
  const profitTips = (<Tooltip
    placement="right"
    title={
      <>
        <div>{f('tipsProfit')}</div>
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
  if (profitText === NOT_A_NUMBER) {
    profitWidget = <span className="sub-content">{NOT_A_NUMBER}{profitTips}</span>
  } else if (profitNumber > 0) {
    profitWidget = <span className="defi-color-Increase" style={{ flex: 4 }}>+&nbsp;$&nbsp;{profitText}{profitTips}</span>
  } else if (profitNumber < 0) {
    profitWidget = <span className="defi-color-reduce" style={{ flex: 4 }}>-&nbsp;$&nbsp;{profitText}{profitTips}</span>
  } else {
    profitWidget = <span className="sub-content" style={{ flex: 4 }}>&nbsp;$&nbsp;{profitText}{profitTips}</span>
  }

  let leftLabelClassName = locale === DefaultLocale ? "label en-label-left-column" : "label cn-label-column";
  let rightLabelClassName = locale === DefaultLocale ? "label en-label-right-column" : "label cn-label-column";

  const projectMinWidth = !isOpen ? (locale === DefaultLocale ? 190 : 210) : 160
  return (
    <div className="white-block base-info" style={{ borderBottom: 'none', height: 'auto', paddingBottom: 0 }}>
      <div className="header">
        <div className="title">{f('baseInfoToken')}</div>
        <UpdateTimeCom updateTime={updateTime} />
      </div>
      <div className="info-content" style={{ position: 'relative' }}>
        <div className="horizantol">
          <div className="horizantol-item right-padding">
            <span className={leftLabelClassName}>{f('addressTotal')}</span>
            <span className="unit" style={{ flex: 4 }}>{totalAssetComponent}</span>
          </div>
          <div className="horizantol-item">
            <span className={rightLabelClassName} style={locale === 'zh' ? { width: 90 } : {}}>{f('earnTotal')}</span>
            {profitWidget}
          </div>
        </div>

        <div className="horizantol">
          <div className="horizantol-item right-padding">
            <span className={leftLabelClassName} style={locale === 'zh' ? { width: 80 } : {}}>{f('projectsNum')}</span>
            <span id="projects" className="sub-content" style={{ minWidth: projectMinWidth }}>
              <MemoProjects operateSymbolList={operateSymbolList} minWidth={projectMinWidth} containerId="projects" />
            </span>
          </div>
          <div className="horizantol-item">

          </div>
        </div>
      </div>
      <EarningsTrend addrName={addrName} groupId={groupId} />
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