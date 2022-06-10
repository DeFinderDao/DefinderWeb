import React, { useState, Key, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { DatePicker, Menu, Select } from 'antd'
import InvestmentLpHistory from './InvestmentLpHistory'
import InvestmentSwapHistory from './InvestmentSwapHistory'
import type { MenuInfo } from 'rc-menu/lib/interface'
import { Moment } from 'moment'
import moment from 'moment'
import type { RangeValue } from 'rc-picker/lib/interface'
import { InvestmentLpHistoryParams } from 'redux/types/InvestmentLpHistoryTypes'
import { InvestmentSwapHistoryParams } from 'redux/types/InvestmentSwapHistoryTypes'
const { RangePicker } = DatePicker
const { Option } = Select

interface Props {
  addressList: string[],
  symbolAddr: string
}
export default function InvestmentHistory({ addressList, symbolAddr }: Props) {
  const { formatMessage } = useIntl()
  const f = (id: string) => formatMessage({ id })

  const [current, setCurrent] = useState<Key>('SwapHistory')
  // const handleClick = (e: MenuInfo) => {
  //   setCurrent(e.key);
  // };
  const handleClick = (e: string) => {
    setCurrent(e);
  };

  const [swapParams, setSwapParams] = useState<InvestmentSwapHistoryParams>({
    type: 0,
    startTime: null,
    endTime: null,
  })

  const swapSelectChange = (value: number) => {
    setSwapParams({
      ...swapParams,
      type: value,
    })
  }
  const swapDatePickerChange = (dates: RangeValue<Moment>, dateStrings: string[]) => {
    if (dates === null) {
      setSwapParams({
        ...swapParams,
        startTime: null,
        endTime: null,
      })
    } else {
      setSwapParams({
        ...swapParams,
        startTime: Math.floor(moment(dates![0]).valueOf()),
        endTime: Math.floor(moment(dates![1]).valueOf()),
      })
    }
  }

  const [lpParams, setLpParams] = useState<InvestmentLpHistoryParams>({
    type: 0,
    startTime: null,
    endTime: null,
  })
  const lpSelectChange = (value: number) => {
    setLpParams({
      ...lpParams,
      type: value,
    })
  }
  const lpDatePickerChange = (dates: RangeValue<Moment>, dateStrings: string[]) => {
    if (dates === null) {
      setLpParams({
        ...lpParams,
        startTime: null,
        endTime: null,
      })
    } else {
      setLpParams({
        ...lpParams,
        startTime: Math.floor(moment(dates![0]).valueOf()),
        endTime: Math.floor(moment(dates![1]).valueOf()),
      })
    }
  }

  return (
    <div className="block-item">
      <div className="investment-history-menu-box">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span className="title-driver"></span>
          <div className="menu-div">
            <span className={current == 'SwapHistory' ? 'active-item' : ''} onClick={() => { handleClick('SwapHistory') }}>{f('investmentSwapHistory')}</span>
            <span className={current == 'LpHistory' ? 'active-item' : ''} onClick={() => { handleClick('LpHistory') }}>{f('investmentLpHistory')}</span>
          </div>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: 20
        }}>
          {
            current == 'SwapHistory' ?
              <>
                <Select
                  value={swapParams.type}
                  onChange={swapSelectChange}
                  style={{ width: 100 }}
                >
                  <Option value={0} key={0}>{f('investmentHistoryType0')}</Option>
                  <Option value={1} key={1}>{f('investmentHistoryType1')}</Option>
                  <Option value={2} key={2}>{f('investmentHistoryType2')}</Option>
                  <Option value={3} key={3}>{f('investmentHistoryType3')}</Option>
                  <Option value={4} key={4}>{f('investmentHistoryType4')}</Option>
                </Select>
                <RangePicker
                  format={'YYYY-MM-DD'}
                  // allowClear={false}
                  value={swapParams.startTime ? [moment(swapParams.startTime), moment(swapParams.endTime)] : [] as unknown as [Moment, Moment]}
                  onChange={swapDatePickerChange}
                  style={{ width: 250, marginLeft: 40 }}
                />
              </>
              :
              <>
                <Select
                  value={lpParams.type}
                  onChange={lpSelectChange}
                  style={{ width: 100 }}
                >
                  <Option value={0} key={0}>{f('investmentHistoryType0')}</Option>
                  <Option value={5} key={5}>{f('investmentHistoryType5')}</Option>
                  <Option value={6} key={6}>{f('investmentHistoryType6')}</Option>
                </Select>
                <RangePicker
                  format={'YYYY-MM-DD'}
                  allowClear={false}
                  value={lpParams.startTime ? [moment(lpParams.startTime), moment(lpParams.endTime)] : [] as unknown as [Moment, Moment]}
                  onChange={lpDatePickerChange}
                  style={{ width: 250, marginLeft: 40 }}
                />
              </>
          }
        </div>
      </div>
      <div style={{ display: current == 'SwapHistory' ? 'block' : 'none' }}>
        <InvestmentSwapHistory
          type={swapParams.type}
          startTime={swapParams.startTime}
          endTime={swapParams.endTime}
          addressList={addressList}
          symbolAddr={symbolAddr} />
      </div>
      <div style={{ display: current != 'SwapHistory' ? 'block' : 'none' }}>
        <InvestmentLpHistory
          type={lpParams.type}
          startTime={lpParams.startTime}
          endTime={lpParams.endTime}
          addressList={addressList}
          symbolAddr={symbolAddr} />
      </div>
    </div>
  )
}
