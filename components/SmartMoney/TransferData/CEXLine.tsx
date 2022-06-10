import { Button, DatePicker, Modal, Select, Spin, Tooltip } from "antd"
import moment, { Moment } from "moment"
import { useEffect, useState } from "react"
import { SMCEXLineItem, SMCEXLineParams, SMCEXLineSearchItem } from "redux/types/SmartMoney/TransferData/CEXLineTypes"
import { QuestionCircleOutlined } from '@ant-design/icons'
import type { RangeValue } from 'rc-picker/lib/interface'
import React from "react"
import { AppState } from "redux/reducers"
import { useDispatch, useSelector } from "react-redux"
import { useIntl } from "react-intl"
import { useRouter } from "next/router"
import { getSMCEXLine, getSMCEXLineSearch } from "redux/actions/SmartMoney/TransferData/CEXLineAction"
import DefinEmpty from "components/Header/definEmpty"
const { RangePicker } = DatePicker
const { Option, OptGroup } = Select;
import loadable from '@loadable/component'
import { ANT_CHARTS_DARK, CHART_AXIS_COLOR, LINESTYLE_WIDTH } from "utils/env"
import Global from "utils/Global"
const DualAxes = loadable(() => import('@ant-design/plots/lib/components/dualAxes'))
import type { Datum } from '@antv/g2plot'
import { TokenLogo } from "components/TokenLogo"
import WaterMarkCahrtContent from "components/WaterMarkCahrtContent"



interface CEXLineProps {
  addressType: string,
}

const dateFormat = 'YYYY-MM-DD'
function convertDatesToMoments(startTime: number, endTime: number) {
  if (startTime && endTime) {
    return [moment(startTime, dateFormat), moment(endTime, dateFormat)]
  } else {
    return []
  }
}
export default function CEXLine() {
  const { formatMessage } = useIntl()
  const f = (id: string) => formatMessage({ id })
  const router = useRouter()
  const { locale } = router
  const dispatch = useDispatch()

  const { addressType } = useSelector((state: AppState) => state.smartMoneyReducer);

  const [query, setQuery] = useState<SMCEXLineParams>({
    startTime: Math.floor(moment().subtract(30, 'd').valueOf()),
    endTime: Math.floor(moment().valueOf()),
    symbolAddr: null,   
    addressType: addressType,
  })
  const CEXLineLoading = useSelector(
    (state: AppState) => state.CEXLineReducer.CEXLineLoading
  )
  const CEXLineData = useSelector(
    (state: AppState) => state.CEXLineReducer.CEXLineData
  )
  const CEXLineSearchLoading = useSelector(
    (state: AppState) => state.CEXLineReducer.CEXLineSearchLoading
  )
  const CEXLineSearchData = useSelector(
    (state: AppState) => state.CEXLineReducer.CEXLineSearchData
  )

  const dispatchType = (arr: SMCEXLineParams, token?: string) => {
    arr.startTime = arr.startTime ? parseInt((arr.startTime / 1000) as unknown as string) : arr.startTime
    arr.endTime = arr.endTime ? parseInt((arr.endTime / 1000) as unknown as string) : arr.endTime
    dispatch(
      getSMCEXLine(arr)
    )
    if (!token) {
      dispatch(
        getSMCEXLineSearch(arr)
      )
    }
  }
  useEffect(() => {
    setQuery({
      ...query,
      addressType: addressType,
    })
    dispatchType({
      ...query,
      addressType: addressType,
    })
  }, [addressType])

  const CEXLineConditionValue = React.useMemo(() => {
    convertDatesToMoments(
      query.startTime as number,
      query.endTime as number
    )
  }, [query.startTime, query.endTime]);
  const handleDatePickerChange = (dates: RangeValue<Moment>, dateStrings: string[]) => {
    setQuery({
      ...query,
      startTime: Math.floor(moment(dates![0]).valueOf()),
      endTime: Math.floor(moment(dates![1]).valueOf()),
    })
    dispatchType({
      ...query,
      startTime: Math.floor(moment(dates![0]).valueOf()),
      endTime: Math.floor(moment(dates![1]).valueOf()),
    })
  }
  const { pageMode } = useSelector((state: AppState) => state.userInfo);
  const config = {
    data: [CEXLineData, CEXLineData],
    xField: 'date',
    yField: ['inAsset', 'outAsset'],
    theme: pageMode === 'dark' ? ANT_CHARTS_DARK : undefined,
    geometryOptions: [
      {
        lineStyle: LINESTYLE_WIDTH
      },
      {
        lineStyle: LINESTYLE_WIDTH
      }
    ],
    yAxis: {
      inAsset: {
        label: {
          formatter: (text: string) => {
            return Global.formatYAxis(text, f);
          },
        },
        ...Global.findMinAndMax(CEXLineData?.map((item: SMCEXLineItem) => {
          return item.inAsset as number;
        })),
        grid: null,
        line: {
          style: {
            stroke: CHART_AXIS_COLOR,
            ...LINESTYLE_WIDTH
          },
        },
      },
      outAsset: {
        label: {
          formatter: (text: string) => {
            return Global.formatYAxis(text, f);
          },
        },
        ...Global.findMinAndMax(CEXLineData.map((item: SMCEXLineItem) => {
          return item.outAsset as number;
        })),
        grid: null,
        line: {
          style: {
            stroke: CHART_AXIS_COLOR,
            ...LINESTYLE_WIDTH
          },
        },
      }
    },
    slider: {
      ...ANT_CHARTS_DARK.components.slider.common,
      start: 0,
      end: 1,
      formatter(time: number) {
        return moment(Number(time)).format('YYYY/MM/DD')
      },
      padding: [0, 0, -22, 0]
    },
    padding: [20, 30, 30, 30],
    tooltip: {
      customContent: (title: string, data: Datum) => {
        if (data.length > 0) {
          return (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "space-around", height: 100 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{data[0].data.time}</span>
                <span>{f('smToken')}：{tokenBtn}</span>
              </div>
              <div style={{ display: 'flex' }}>
                <span style={{ width: 10, height: 10, backgroundColor: data[0].color, borderRadius: 200 }}></span>
                <span style={{ margin: '0 10px' }}>{f('smCEXLineInAsset')}</span>
                <span>$ {`${Global.formatNum(data[0].data.inAssetStr)}`}</span>
              </div>
              <div style={{ display: 'flex' }}>
                <span style={{ width: 10, height: 10, backgroundColor: data[1].color, borderRadius: 200 }}></span>
                <span style={{ margin: '0 10px' }}>{f('smCEXLineOutAsset')}</span>
                <span>$ {`${Global.formatNum(data[1].data.outAssetStr)}`}</span>
              </div>
            </div>
          ) as unknown as string
        }
        return <></> as unknown as string
      },
    },
    meta: {
      inAsset: {
        alias: f('smCEXLineInAsset'),
        formatter: (inAsset: number) => {
          return `$ ${Global.formatNum(inAsset)}`
        },
      },
      outAsset: {
        alias: f('smCEXLineOutAsset'),
        formatter: (outAsset: number) => {
          return `$ ${Global.formatNum(outAsset)}`
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
          return moment(Number(time)).format('yyyy/MM/DD')
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
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [tokenBtn, setTokenBtn] = useState(f('SelectAllToken'))
  const selectChange = (val: string | undefined) => {
    if (val) {
      setQuery({
        ...query,
        symbolAddr: val.split('|')[0],
      })
      dispatchType({
        ...query,
        symbolAddr: val.split('|')[0],
      }, val.split('|')[0])
      setTokenBtn(val.split('|')[1])
    } else {
      setQuery({
        ...query,
        symbolAddr: null, 
      })
      dispatchType({
        ...query,
        symbolAddr: null, 
      }, 'DEF')
      setTokenBtn(f('SelectAllToken'))
    }
  }
  return <>
    <div className="SM-block-item">
      < div className="item-title" >
        <div className="adapt-width">
          <span>
            {f("CEXLineTitle")}
            <Tooltip
              placement="right"
              title={<div>{f(`CEXLineTips`)}</div>}
            >
              <QuestionCircleOutlined
                style={{
                  fontSize: '16px',
                  marginLeft: '10px',
                }}
              />
            </Tooltip>
          </span>
        </div>
        <div className="defi-radio-group-time" style={{ display: 'flex' }}>
          {CEXLineSearchData.length > 0 ?
            <Button onClick={() => { setIsModalVisible(true) }} style={{ marginRight: 20 }}>
              {tokenBtn}
            </Button>
            :
            null
          }
          <RangePicker
            format={'YYYY-MM-DD'}
            allowClear={false}
            defaultValue={[
              moment().subtract(30, 'd'),
              moment(),
            ]}
            value={CEXLineConditionValue as unknown as [Moment, Moment]}
            onChange={handleDatePickerChange}
            style={{ width: '100%' }}
          />
        </div>
      </div >

      {CEXLineData && CEXLineData.length > 0 ? (
        <div style={{ marginTop: '20px', height: '312px' }}>
          <DualAxes
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
          <WaterMarkCahrtContent right={100} top={285} />
        </div>
      ) : (
        <div className="table-empty">
          <DefinEmpty spinning={CEXLineLoading} />
        </div>
      )}
    </div>
    <CEXTokenSelect
      CEXLineSearchLoading={CEXLineSearchLoading}
      CEXLineSearchData={CEXLineSearchData}
      isModalVisible={isModalVisible}
      setIsModalVisible={setIsModalVisible}
      selectChange={(val) => { selectChange(val) }} />
  </>
}

interface CEXTokenSelectProps {
  CEXLineSearchLoading: boolean,
  CEXLineSearchData: SMCEXLineSearchItem[],
  isModalVisible: boolean,
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
  selectChange: (newValue: string | undefined) => void
}
function CEXTokenSelect({ CEXLineSearchLoading, CEXLineSearchData, isModalVisible, setIsModalVisible, selectChange }: CEXTokenSelectProps) {
  const { formatMessage } = useIntl()
  const f = (id: string) => formatMessage({ id })

  useEffect(() => {
    setData(CEXLineSearchData)
  }, [CEXLineSearchData])
  const [data, setData] = useState(CEXLineSearchData)
  const [selectVal, setSelectVal] = useState<string | undefined>(undefined)
  const handleOk = () => {
    setData(CEXLineSearchData)
    selectChange(selectVal)
    setIsModalVisible(false);
  };
  const handleCancel = () => {
    setData(CEXLineSearchData)
    setSelectVal(undefined)
    selectChange(undefined)
    setIsModalVisible(false);
  };

  const selectLabel = React.createElement(
    "div",
    {
      class: "unified-search-content unified-search-table-title unified-search-box-padding",
    },
    React.createElement("span", { class: 'contect-text flex-3' }, f('unifiedSearchSymbol')),
    React.createElement("span", { class: 'contect-text flex-4 align-right' }, f('unifiedSearchPrice')),
    React.createElement("span", { class: 'contect-text flex-3' }, f('unifiedSearchLpVolume')),
    React.createElement("span", { class: 'contect-text flex-4' }, f('unifiedSearchVolume24h')),
    React.createElement("span", { class: 'contect-text flex-4' }, f('unifiedSearchSymbolAddr')),
  )

  const handleTokenSelectChange = (newValue: string) => {
    setSelectVal(newValue)
  }
  return (
    <Modal
      visible={isModalVisible}
      onCancel={() => { setIsModalVisible(false) }}
      footer={null}>
      <p className="modal-title" style={{ textAlign: 'center' }}>
        {f('SelectToken')}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 100 }}>
        <Select
          value={selectVal}
          getPopupContainer={triggerNode => {
            return triggerNode.parentElement
          }}
          style={{ minWidth: 210, height: 32 }}
          dropdownClassName="CEX-search-auto-complete-dropdown"
          loading={CEXLineSearchLoading}
          maxTagCount={2}
          onChange={handleTokenSelectChange}
          placeholder={f('SelectAllToken')}
          optionLabelProp="label"
          showSearch
          allowClear
          onSearch={(val) => {
            setData(CEXLineSearchData.filter((item: SMCEXLineSearchItem) => `${item.symbolAddr}|${item.symbol}`.toLowerCase().indexOf(val.toLowerCase()) > -1))
          }}
          onClear={() => {
            setData(CEXLineSearchData)
          }}
        >
          <OptGroup label={selectLabel}>
            {
              data.map((item: SMCEXLineSearchItem, index) => {
                return (
                  <Option value={`${item.symbolAddr}|${item.symbol}`} key={`${item.symbolAddr}|${item.symbol}`} label={item.symbol}>
                    <div
                      className={`unified-search-content unified-search-table-body${index % 2} unified-search-box-padding`}
                      key={'marketItem' + index}
                    >
                      <span className="contect-text" style={{ flex: 3 }}>
                        <TokenLogo
                          className="contect-logo"
                          src={item.logo}
                          alt=''
                        />
                        {item.symbol}
                      </span>
                      <span className="contect-text" style={{ flex: 4 }}>
                        {`$${item.price}`} &nbsp;
                        {Global.formatIncreaseNumber(item.priceIncrease)}
                      </span>
                      <span
                        className="contect-text"
                        style={{ flex: 3, textAlign: 'right' }}
                      >
                        $&nbsp;{Global.formatBigNum(item.lpVolume)}
                      </span>
                      <span className="contect-text" style={{ flex: 4 }}>
                        {Global.formatBigNum(item.symbolVolume)}
                      </span>
                      <span className="contect-text" style={{ flex: 4 }}>
                        {Global.abbrSymbolAddress(item.symbolAddr)}
                      </span>
                    </div>
                  </Option>
                );
              })
            }
          </OptGroup>
        </Select>
      </div>
      <div className="form-btns">
        <Button
          style={{
            marginRight: 100,
          }} onClick={handleCancel}>
          {f('SelectAllToken')}
        </Button>
        <Button type="primary" onClick={handleOk}>
          {f('SelectConfirm')}
        </Button>
      </div>
    </Modal>
  )
}