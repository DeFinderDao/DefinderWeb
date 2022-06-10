import { Spin, Tooltip } from "antd"
import { useIntl } from "react-intl";
import { QuestionCircleOutlined } from '@ant-design/icons'
import { useSelector } from "react-redux";
import { AppState } from "redux/reducers";
import loadable from '@loadable/component'
import { ANT_CHARTS_DARK, DefaultLocale } from "utils/env";
import { NFTHoldPieItemResponse, NFTHoldPieResponse } from "redux/types/NFTAnalyseHoldTypes";
import DefinEmpty from "components/Header/definEmpty";
import Global from "utils/Global";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Options } from "@ant-design/plots/lib/hooks/useChart";
import UpdateTimeCom from "components/UpdateTimeCom";
const Pie = loadable(() => import('@ant-design/plots/lib/components/pie'))


interface NFTHolderPieProps {
  title: string,
  desc: string,
  num: number,
  data: NFTHoldPieItemResponse[],
  updateTime: number
}
export default function NFTHolderPie({ title, desc, num, data, updateTime }: NFTHolderPieProps) {
  const { formatMessage } = useIntl();
  const f = (id: string) => formatMessage({ id });
  const router = useRouter();
  const { locale = DefaultLocale } = router;
  const { pageMode, level } = useSelector((state: AppState) => state.userInfo);
  const dataArr = [['rate', 'type', f('nftHolderNumber')], ['rate', 'type', f('nftHolderTime')]]
  const legendArr = [['', '1', '2-3', '4-10', '11-50', '51-100', '>100'], ['', '<24H', '1D-7D', '7D-30D', '30D-3M', '3M-1Y', '>1Y']]

  const colors = ANT_CHARTS_DARK.colors10;
  const color = num == 0 ? colors.slice(0, 6) : colors.slice(4, 10)
  const [activeAdd, setActiveAdd] = useState('')
  const [plot, setPlot] = useState<undefined | Options>();
  useEffect(() => {
    if (typeof plot !== 'undefined') {
      plot.setState('active', (item: NFTHoldPieItemResponse) => {
        if (item.type === activeAdd) {
          return true;
        } else {
          return false;
        }
      });
    }
  }, [plot, activeAdd]);
  const handleMouseEnter = (data: NFTHoldPieItemResponse) => {
    (setActiveAdd as React.Dispatch<React.SetStateAction<string>>)(data.type as string);
  }
  const handleMouseLeave = (data: NFTHoldPieItemResponse) => {
    (setActiveAdd as React.Dispatch<React.SetStateAction<string>>)('');
  }
  const config = {
    appendPadding: 10,
    data: data,
    angleField: dataArr[num][0],
    colorField: dataArr[num][1],
    height: 300,
    width: 300,
    radius: 1,
    theme: pageMode === 'dark' ? ANT_CHARTS_DARK : undefined,
    innerRadius: 0.6,
    pieStyle: {
      stroke: null
    },
    color: color,
    legend: false as const,
    tooltip: {
      position: 'bottom' as const,
      enterable: true,
      customContent: (title: string, data: any[]) => {
        if (data.length > 0) {
          return (
            <div style={{ padding: '20px 10px', minWidth: 300 }}>
              {num == 1 ? <><div style={{ padding: '10px 0' }}>
                <span>{dataArr[num][2]}：</span>
                <span>{legendArr[num][data[0].data.type]}</span>
              </div></> : <div style={{ padding: '10px 0' }}>
                <span>{dataArr[num][2]}：</span>
                <span>{legendArr[num][data[0].data.type]}</span>
              </div>}
              <div style={{ padding: '10px 0' }}>
                <span>{f('nftHolderRate')}：</span>
                <span>{data[0].data.rate}%</span>
              </div>
            </div>
          ) as unknown as string
        } else {
          return ''
        }
      },
    },
    label: {
      type: 'inner',
      offset: '-50%',
      formatter: function formatter(item: Record<string, number>) {
        if (item.rate > 2) {
          return `${item.rate}%`
        } else {
          return ''
        }
      },
      style: {
        textAlign: 'center',
        fontSize: 14,
        fill: '#fff',
      },
    },
    statistic: {
      title: false as const,
      content: {
        customHtml: function formatter() {
          return (
            <img
              src={'/images/line-watermark.svg'}
              style={{ width: '130px' }}
            />
          ) as unknown as string
        },
      },
    },
    animation: false as const,
  }

  return (
    <div className="block-item item-small" style={{borderTop: 0}}>
      <div className="item-title">
        <span>
          <span>{title}</span>
          <Tooltip
            placement="right"
            title={desc}
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
        <UpdateTimeCom updateTime={updateTime} />
      </div>
      <div style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {data && data.length > 0 ?
          <>
            <Pie
              {...config}
              fallback={
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Spin></Spin>
                </div>
              }
              onReady={(plot: Options) => {
                setPlot(plot);
              }}
            />
            {plot != undefined ?
              <div className="pie-legend">
                {data.map((item, index) => {
                  return (
                    <div className="pie-legend-item" key={`${num}-${index}`} onMouseEnter={() => { handleMouseEnter(item) }} onMouseLeave={() => { handleMouseLeave(item) }}>
                      <div className="pie-legend-left">
                        <span className="pie-legend-circle" style={{ backgroundColor: color[index] }}></span>
                        <span className="pie-legend-title">{legendArr[num][Number(item.type)]}</span>
                      </div>
                      <span className="pie-legend-value">{item.rate < 0.01 && item.rate > 0 ? '0.01%' : `${item.rate}%`}</span>
                    </div>
                  )
                })}
              </div> : null}
          </>
          :
          <div className="table-empty empty">
            <DefinEmpty />
          </div>
        }
      </div>
    </div>
  )
}