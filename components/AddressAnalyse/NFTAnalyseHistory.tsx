import { Radio } from "antd";
import DefinEmpty from "components/Header/definEmpty";
import { RadioChangeEvent } from "antd/lib/radio";
import { useEffect, useState } from "react";
import loadable from '@loadable/component'
import { useIntl } from "react-intl";
import { ANT_CHARTS_DARK, CHART_AXIS_COLOR, DefaultLocale, LINESTYLE_WIDTH } from "utils/env";
import Global from "utils/Global";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "redux/reducers";
import { getNftGroupList } from 'redux/actions/NftDetails/NftPlotsHistoryAction'
import { NftPlotsHistoryItem, NftPlotsHistoryParams } from "redux/types/NftPlotsHistoryTypes";
import { useRouter } from "next/router";
import { Chart } from '@antv/g2';
import WaterMarkCahrtContent from "components/WaterMarkCahrtContent";
import UpdateTimeCom from "components/UpdateTimeCom";


interface Props {
  addrName?: string,
  groupId?: string | null,
}
export default function NFTAnalyseHistory(prop: Props) {
  const { formatMessage } = useIntl()
  const f = (id: string) => formatMessage({ id })
  const dispatch = useDispatch()
  const router = useRouter();
  const { locale = DefaultLocale } = router;

  const radioChange = (e: RadioChangeEvent) => {
    if (chart) {
      chart.destroy()
    }

    setTrendParams({
      ...trendParams,
      type: e.target.value
    })
  }
  const [trendParams, setTrendParams] = useState<NftPlotsHistoryParams>({
    addrName: prop.addrName as string, 
    groupId: prop.groupId as string,
    type: '0'
  })

  const nftGroup = useSelector(
    (state: AppState) => state.NftPlotsHistoryReducer.nftGroup
  )
  const nftGroupUpdateTime = useSelector(
    (state: AppState) => state.NftPlotsHistoryReducer.nftGroupUpdateTime
  )
  const nftGroupLoading = useSelector(
    (state: AppState) => state.NftPlotsHistoryReducer.nftGroupLoading
  )
  useEffect(() => {
    dispatch(
      getNftGroupList(trendParams)
    )
  }, [trendParams, locale])

  const { pageMode } = useSelector((state: AppState) => state.userInfo);
  let chart: Chart
  useEffect(() => {
    const dom = document.getElementById('container')
    if (nftGroup.length > 0 && dom) {
      if (dom.hasChildNodes()) {
        dom.removeChild(dom.childNodes[0])
      }
      chart = new Chart({
        container: 'container',
        autoFit: true,
        height: 312
      });
      chart.data(nftGroup);
      chart.scale({
        time: { nice: true, type: 'time', tickCount: 10 },
        finalPrice: {
          nice: true,
          ...Global.findMinAndMax(nftGroup.map((item: NftPlotsHistoryItem) => {
            return item.finalPrice as number;
          })),
        },
      });
      chart.legend({
        position: 'top-left',
      });
      chart.option('slider', {
        start: 0,
        end: 1,
        ...ANT_CHARTS_DARK.components.slider.common,
        formatter(time: string) {
          return time.split(' ')[0]
        },
      });
      chart.tooltip({
        showTitle: false,
        showCrosshairs: true,
        showMarkers: false,
        crosshairs: {
          type: 'xy',
        },
        itemTpl: '<li class="g2-tooltip-list-item" data-index={index} style="margin-bottom:4px;">'
          + '{time}<br/><br/>'
          + '<span style="background-color:grey;" class="g2-tooltip-marker"></span>'
          + `${f('unifiedSearchProject')}: `
          + '{symbol}<br/><br/>'
          + '<span style="background-color:{color};" class="g2-tooltip-marker"></span>'
          + '{name}: '
          + '{finalPrice} ETH'
          + '</li>'
      });
      chart.axis('time', {
        grid: null,
        line: {
          style: {
            stroke: CHART_AXIS_COLOR,
            ...LINESTYLE_WIDTH
          },
        },
      });
      chart.axis('finalPrice', {
        grid: null,
        line: {
          style: {
            stroke: CHART_AXIS_COLOR,
            ...LINESTYLE_WIDTH
          },
        },
      });
      chart
        .point()
        .position('time*finalPrice')
        .color('category')
        .shape('circle')
        .tooltip('category*time*finalPrice*symbol', (category, time, finalPrice, symbol) => {
          return {
            name: category,
            time: time,
            finalPrice: finalPrice,
            symbol: symbol
          };
        })
        .style({
          fillOpacity: 0.85,
          r: 7,
          strokeOpacity: 0
        });
      chart.interaction('legend-highlight');
      chart.render();
    }
  }, [nftGroup])

  return (
    <div className="white-block earnings-trend" style={{ borderBottom: 'none' }}>
      <div className="header">
        <span className="title">
          {f('nftAnalyseHistoryPlotsTitle')}
        </span>
        <UpdateTimeCom updateTime={nftGroupUpdateTime} />
      </div>
      <div className="header" style={{ marginTop: 0 }}>
        <span className="title">
        </span>
        <div>
          <Radio.Group
            defaultValue={trendParams.type}
            buttonStyle="solid"
            onChange={radioChange}
          >
            <Radio.Button value="1">
              {f('investmentRadio30')}
            </Radio.Button>
            <Radio.Button value="2">
              {f('investmentRadio180')}
            </Radio.Button>
            <Radio.Button value="3">
              {f('investmentRadio1')}
            </Radio.Button>
            <Radio.Button value="0">
              {f('investmentRadioMax')}
            </Radio.Button>
          </Radio.Group>
        </div>
      </div>
      <div>
        {nftGroup.length > 0 ? (
          <div style={{ marginTop: '20px', height: '312px', padding: '0 10px' }}>
            <div id="container" />
            <WaterMarkCahrtContent top={280} />
          </div>
        ) : (
          <div className="table-empty" style={{ height: 200 }}>
            <DefinEmpty spinning={nftGroupLoading} />
          </div>
        )}
      </div>
    </div>
  )
}