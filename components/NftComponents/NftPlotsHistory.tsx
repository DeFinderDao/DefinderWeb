import { Radio } from "antd";
import DefinEmpty from "components/Header/definEmpty";
import { RadioChangeEvent } from "antd/lib/radio";
import { useEffect, useState } from "react";
import loadable from '@loadable/component'
import { useIntl } from "react-intl";
import { ANT_CHARTS_DARK, CHART_AXIS_COLOR, LINESTYLE_WIDTH } from "utils/env";
import Global from "utils/Global";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "redux/reducers";
import { getNftPlotsList } from 'redux/actions/NftDetails/NftPlotsHistoryAction'
import { NftPlotsHistoryItem, NftPlotsHistoryParams } from "redux/types/NftPlotsHistoryTypes";
import { useRouter } from "next/router";
import { Chart } from '@antv/g2';
import WaterMarkCahrtContent from "components/WaterMarkCahrtContent";


interface Props {
  addrName?: string,
  groupId?: string | null,
  symbolAddr: string,
}
export default function NftPlotsHistory(prop: Props) {
  const { formatMessage } = useIntl()
  const f = (id: string) => formatMessage({ id })
  const dispatch = useDispatch()
  const router = useRouter();
  const { locale } = router;

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
    symbolAddr: prop.symbolAddr,
    type: '0'	
  })

  const nftPlots = useSelector(
    (state: AppState) => state.NftPlotsHistoryReducer.nftPlots
  )
  const nftPlotsLoading = useSelector(
    (state: AppState) => state.NftPlotsHistoryReducer.nftPlotsLoading
  )
  useEffect(() => {
    dispatch(
      getNftPlotsList(trendParams)
    )
  }, [trendParams, locale])

  const { pageMode } = useSelector((state: AppState) => state.userInfo);
  let chart: Chart
  useEffect(() => {
    const dom = document.getElementById('container')
    if (nftPlots.length > 0 && dom) {
      if (dom.hasChildNodes()) {
        dom.removeChild(dom.childNodes[0])
      }
      chart = new Chart({
        container: 'container',
        autoFit: true,
        height: 312
      });
      chart.data(nftPlots);
      chart.scale({
        time: { nice: true, type: 'time', tickCount: 10 },
        finalPrice: {
          nice: true,
          ...Global.findMinAndMax(nftPlots.map((item: NftPlotsHistoryItem) => {
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
        .tooltip('category*time*finalPrice', (category, time, finalPrice) => {
          return {
            name: category,
            time: time,
            finalPrice: finalPrice
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
  }, [nftPlots])

  return (
    <div className="block-item item-small">
      <div className="item-title">
        <span className="item-title-box">
          <span className="title-driver"></span>
          {f('nftPositionIncomeTitle')}
        </span>
        <div>
          <Radio.Group
            defaultValue={trendParams.type}
            buttonStyle="solid"
            onChange={radioChange}
          >
            <Radio.Button value="1">
              {f('nftRadio30')}
            </Radio.Button>
            <Radio.Button value="2">
              {f('nftRadio180')}
            </Radio.Button>
            <Radio.Button value="3">
              {f('nftRadio1')}
            </Radio.Button>
            <Radio.Button value="0">
              {f('nftRadioMax')}
            </Radio.Button>
          </Radio.Group>
        </div></div>
      <div>
        {nftPlots.length > 0 ? (
          <div style={{ marginTop: '20px', height: '312px' }}>
            <div id="container" />
            <WaterMarkCahrtContent top={280} />
          </div>
        ) : (
          <div className="table-empty">
            <DefinEmpty spinning={nftPlotsLoading} />
          </div>
        )}
      </div>
    </div>
  )
}