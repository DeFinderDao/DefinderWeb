import React, { useState, Key } from 'react'
import { useIntl } from 'react-intl'
import { DatePicker, Select } from 'antd'
import { Moment } from 'moment'
import moment from 'moment'
import type { RangeValue } from 'rc-picker/lib/interface'
import NftSwapHistory from './NftSwapHistory'
import { NftSwapHistoryParams } from 'redux/types/NftSwapHistoryTypes'
const { RangePicker } = DatePicker
const { Option } = Select

interface Props {
  addressList: string[],
  symbolAddr: string
}
export default function NftHistory({ addressList, symbolAddr }: Props) {
  const { formatMessage } = useIntl()
  const f = (id: string) => formatMessage({ id })

  const [current, setCurrent] = useState<Key>('SwapHistory')
  const handleClick = (e: string) => {
    setCurrent(e);
  };

  const [swapParams, setSwapParams] = useState<NftSwapHistoryParams>({
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

  return (
    <div className="block-item">
      <div className="investment-history-menu-box">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span className="title-driver"></span>
          <div className="menu-div">
            <span className={current == 'SwapHistory' ? 'active-item' : ''} onClick={() => { handleClick('SwapHistory') }}>{f('nftSwapHistory')}</span>
          </div>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: 20
        }}>
          <Select
            value={swapParams.type}
            onChange={swapSelectChange}
            style={{ width: 105 }}
          >
            <Option value={0} key={0}>{f('nftHistoryType0')}</Option>
            <Option value={1} key={1}>{f('nftHistoryType1')}</Option>
            <Option value={2} key={2}>{f('nftHistoryType2')}</Option>
            <Option value={3} key={3}>{f('nftHistoryType3')}</Option>
            <Option value={4} key={4}>{f('nftHistoryType4')}</Option>
            <Option value={5} key={5}>{f('nftHistoryType5')}</Option>
          </Select>
          <RangePicker
            format={'YYYY-MM-DD'}
            value={swapParams.startTime ? [moment(swapParams.startTime), moment(swapParams.endTime)] : [] as unknown as [Moment, Moment]}
            onChange={swapDatePickerChange}
            style={{ width: 250, marginLeft: 40 }}
          />
        </div>
      </div>
      <div>
        <NftSwapHistory
          type={swapParams.type}
          startTime={swapParams.startTime ? parseInt((swapParams.startTime) as unknown as string) : null}
          endTime={swapParams.endTime ? parseInt((swapParams.endTime) as unknown as string) : null}
          addressList={addressList}
          symbolAddrList={[symbolAddr]} />
      </div>
    </div>
  )
}
