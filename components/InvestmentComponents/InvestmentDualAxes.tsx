import { Empty, Radio, Spin, Tooltip } from "antd";
import { QuestionCircleOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { RadioChangeEvent } from "antd/lib/radio";
import loadable from '@loadable/component'
import { ANT_CHARTS_DARK, CHART_AXIS_COLOR, LINESTYLE_WIDTH } from "utils/env";
import Global from "utils/Global";
import moment from "moment";
const DualAxes = loadable(() => import('@ant-design/plots/lib/components/dualAxes'))
import { getInvestmentPriceList } from 'redux/actions/InvestmentDetails/InvestmentPriceAction'
import { getInvestmentNumberList } from 'redux/actions/InvestmentDetails/InvestmentNumberAction'
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "redux/reducers";
import DefinEmpty from "components/Header/definEmpty";
import { InvestmentPriceItem } from "redux/types/InvestmentPriceTypes";
import { InvestmentNumberItem } from "redux/types/InvestmentNumberTypes";
import WaterMarkCahrtContent from "components/WaterMarkCahrtContent";

interface Props {
  type: string,
  addrName?: string,
  groupId?: string,
  symbolAddr: string,
}
export default function InvestmentDualAxes({ type, addrName, groupId, symbolAddr }: Props) {
  const dispatch = useDispatch()
  const { formatMessage } = useIntl()
  const f = (id: string) => formatMessage({ id })


  useEffect(() => {
    if (type == 'InvestmentPrice') {
      dispatch(getInvestmentPriceList({
        addrName: addrName,
        groupId: groupId,
        symbolAddr: symbolAddr,
        type: radioType,
      }))
    } else {
      dispatch(getInvestmentNumberList({
        addrName: addrName,
        groupId: groupId,
        symbolAddr: symbolAddr,
        type: radioType,
      }))
    }
  }, [dispatch, type])
  const incomeList = useSelector(
    (state: AppState) => type == 'InvestmentPrice' ? state.investmentPriceReducer.investmentPriceList : state.investmentNumberReducer.investmentNumberList
  )
  const incomeLoading = useSelector(
    (state: AppState) => type == 'InvestmentPrice' ? state.investmentPriceReducer.investmentPriceLoading : state.investmentNumberReducer.investmentNumberLoading
  )
  const { pageMode } = useSelector((state: AppState) => state.userInfo);
  const config = {
    data: [incomeList, incomeList],
    xField: 'date',
    yField: type == 'InvestmentPrice' ? ['price', 'holdAmount'] : ['cost', 'amount'],
    theme: pageMode === 'dark' ? ANT_CHARTS_DARK : undefined,
    geometryOptions: [
      {
        lineStyle: LINESTYLE_WIDTH,
        color: '#8CB1F1'
      },
      {
        lineStyle: LINESTYLE_WIDTH,
        color: '#EFB98A'
      }
    ],
    yAxis: {
      price: {
        ...Global.findMinAndMax(incomeList.map((item: InvestmentPriceItem | InvestmentNumberItem) => {
          return item.price as number;
        })),
        label: {
          formatter: (text: string) => {
            return Global.formatYAxis(text, f);
          },
        },
        grid: null,
        line: {
          style: {
            stroke: CHART_AXIS_COLOR,
            ...LINESTYLE_WIDTH
          },
        },
      },
      holdAmount: {
        ...Global.findMinAndMax(incomeList.map((item: InvestmentPriceItem | InvestmentNumberItem) => {
          return item.holdAmount as number;
        })),
        label: {
          formatter: (text: string) => {
            return Global.formatYAxis(text, f);
          },
        },
        grid: null,
        line: {
          style: {
            stroke: CHART_AXIS_COLOR,
            ...LINESTYLE_WIDTH
          },
        },
      },
      cost: {
        ...Global.findMinAndMax(incomeList.map((item: InvestmentPriceItem | InvestmentNumberItem) => {
          return item.cost as number;
        })),
        label: {
          formatter: (text: string) => {
            return Global.formatYAxis(text, f);
          },
        },
        grid: null,
        line: {
          style: {
            stroke: CHART_AXIS_COLOR,
            ...LINESTYLE_WIDTH
          },
        },
      },
      amount: {
        ...Global.findMinAndMax(incomeList.map((item: InvestmentPriceItem | InvestmentNumberItem) => {
          return item.amount as number;
        })),
        label: {
          formatter: (text: string) => {
            return Global.formatYAxis(text, f);
          },
        },
        grid: null,
        line: {
          style: {
            stroke: CHART_AXIS_COLOR,
            ...LINESTYLE_WIDTH
          },
        },
      },
    },
    slider: {
      ...ANT_CHARTS_DARK.components.slider.common,
      start: 0,
      end: 1,
      formatter(time: number) {
        return moment(Number(time)).format('YYYY/MM/DD')
      },
    },
    padding: [20, 30, 70, 30],
    tooltip: {
      title: 'time'
    },
    meta: {
      price: {
        alias: type == 'InvestmentPrice' ? f('realPrice') : f('positionCost'),
        formatter: (price: number) => {
          return `$ ${Global.formatNum(price)}`
        },
      },
      holdAmount: {
        alias: f('positionsNumber'),
        formatter: (holdAmount: number) => {
          return `${Global.formatNum(holdAmount)}`
        },
      },
      cost: {
        alias: type == 'InvestmentPrice' ? f('realPrice') : f('positionCost'),
        formatter: (cost: number) => {
          return `$ ${Global.formatNum(cost)}`
        },
      },
      amount: {
        alias: f('positionsNumber'),
        formatter: (amount: number) => {
          return `${Global.formatNum(amount)}`
        },
      },
      date: {
        sync: false,
      },
    },
    xAxis: {
      tickCount: 10,
      label: {
        formatter: (time: string) => {
          return moment(Number(time)).format('MM/DD')
        },
      },
      line: {
        style: {
          stroke: CHART_AXIS_COLOR,
          ...LINESTYLE_WIDTH
        },
      },
    },
  }
  const [radioType, setRadioType] = useState('0')
  const radioChange = (e: RadioChangeEvent) => {
    setRadioType(e.target.value)
    if (type == 'InvestmentPrice') {
      dispatch(getInvestmentPriceList({
        addrName: addrName,
        groupId: groupId,
        symbolAddr: symbolAddr,
        type: e.target.value
      }))
    } else {
      dispatch(getInvestmentNumberList({
        addrName: addrName,
        groupId: groupId,
        symbolAddr: symbolAddr,
        type: e.target.value
      }))
    }
  }
  return (
    <div className="block-item item-small">
      <div className="item-title">
        <span className="item-title-box">
          <span className="title-driver"></span>
          {f(type + 'Type')}
          {type == 'InvestmentPrice' ? null : <Tooltip
            placement="right"
            title={<div>{f('InvestmentNumberTypeTips')}</div>}
          >
            <QuestionCircleOutlined
              style={{
                fontSize: '16px',
                marginLeft: '10px',
              }}
            />
          </Tooltip>}
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
        </div>
      </div>
      <div style={{ height: 305 }}>
        {incomeList.length > 0 ? (
          <div style={{ marginTop: '20px', position: 'relative' }}>
            <DualAxes
              {...config}
              style={{ height: '355px' }}
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
            <WaterMarkCahrtContent right={80} top={180} />
          </div>) : (
          <div className="table-empty">
            <DefinEmpty spinning={incomeLoading} />
          </div>
        )}
      </div>
    </div>
  );
}