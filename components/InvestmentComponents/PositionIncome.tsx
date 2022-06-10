import { Empty, Radio, Spin, Tooltip } from "antd";
import { QuestionCircleOutlined } from '@ant-design/icons'
import { getPositionIncomeList } from 'redux/actions/InvestmentDetails/PositionIncomeAction'
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { RadioChangeEvent } from "antd/lib/radio";
import loadable from '@loadable/component'
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "redux/reducers";
import Global from "utils/Global";
import { PositionIncomeItem } from "redux/types/PositionIncomeTypes";
import moment from "moment";
import { ANT_CHARTS_DARK, CHART_AXIS_COLOR, LINESTYLE_WIDTH } from "utils/env";
import { ListItem } from '@antv/component/lib/types'
import DefinEmpty from "components/Header/definEmpty";
const Line = loadable(() => import('@ant-design/plots/lib/components/line'))
import WaterMarkCahrtContent from "components/WaterMarkCahrtContent";

interface Props {
  addrName?: string,
  groupId?: string | null,
  symbolAddr: string,
}
export default function PositionIncome({ addrName, groupId, symbolAddr }: Props) {
  const dispatch = useDispatch()
  const { formatMessage } = useIntl()
  const f = (id: string) => formatMessage({ id })

  useEffect(() => {
    dispatch(getPositionIncomeList({
      addrName: addrName,
      groupId: groupId,
      symbolAddr: symbolAddr,
      type: radioType,
    }))
  }, [dispatch])
  const positionIncomeLoading = useSelector(
    (state: AppState) => state.positionIncomeReducer.positionIncomeLoading
  )
  const positionIncomeList = useSelector(
    (state: AppState) => state.positionIncomeReducer.positionIncomeList
  )
  const { pageMode } = useSelector((state: AppState) => state.userInfo);
  var config = {
    data: positionIncomeList,
    xField: 'date',
    yField: 'profit',
    smooth: true,
    height: 312,
    theme: pageMode === 'dark' ? ANT_CHARTS_DARK : undefined,
    tooltip: {
      title: f('investmentPositionIncomeChartTitle'),
      formatter: (itemData: {
        [x: string]: number;
      }) => {
        return {
          name: moment(Number((itemData as PositionIncomeItem).date)).format('YYYY/MM/DD'),
          value: `$ ${Global.formatNum((itemData as PositionIncomeItem).profit)}`,
        }
      },
    },
    lineStyle: LINESTYLE_WIDTH,
    slider: {
      start: 0,
      end: 1,
      formatter(time: number) {
        return moment(Number(time)).format('YYYY/MM/DD')
      },
    },
    meta: {
      date: {
        range: [0, 1]
      },
    },
    xAxis: {
      label: {
        formatter: (time: string) => {
          return moment(Number(time)).format('YYYY/MM/DD')
        },
      },
      tickCount: 6,
      line: {
        style: {
          stroke: CHART_AXIS_COLOR,
          ...LINESTYLE_WIDTH
        },
      },
    },
    yAxis: {
      ...Global.findMinAndMax(positionIncomeList.map((item: PositionIncomeItem) => {
        return item.profit as number;
      })),
      grid: null,
      line: {
        style: {
          stroke: CHART_AXIS_COLOR,
          ...LINESTYLE_WIDTH
        },
      },
      label: {
        formatter: (text: string, item: ListItem, index: number) => {
          return Global.formatYAxis(text, f);
        },
      },
    },
  }

  const [radioType, setRadioType] = useState('0')
  const radioChange = (e: RadioChangeEvent) => {
    setRadioType(e.target.value)
    dispatch(getPositionIncomeList({
      addrName: addrName,
      groupId: groupId,
      symbolAddr: symbolAddr,
      type: e.target.value,
    }))
  }
  return (
    <div className="block-item item-small">
      <div className="item-title">
        <span className="item-title-box">
          <span className="title-driver"></span>
          {f('investmentPositionIncomeTitle')}
        </span>
        <div>
          <Radio.Group
            defaultValue={radioType}
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
        </div></div>
      <div>
        {positionIncomeList.length > 0 ? (
          <div style={{ marginTop: '20px', height: '312px' }}>
            <Line
              {...config}
              fallback={
                <div
                  style={{
                    width: '100%',
                    height: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Spin></Spin>
                </div>
              }
            />
            <WaterMarkCahrtContent right={60} top={300} />
          </div>
        ) : (
          <div className="table-empty">
            <DefinEmpty spinning={positionIncomeLoading} />
          </div>
        )}
      </div>
    </div>
  );
}