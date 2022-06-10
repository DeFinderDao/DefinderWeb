import { Button, Col, DatePicker, Input, Menu, Modal, Row, Table, Tooltip } from "antd";
import { Key, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { FilterFilled, SwapRightOutlined } from '@ant-design/icons'
import type { MenuInfo } from 'rc-menu/lib/interface'
import { useRouter } from "next/router";
import moment, { Moment } from "moment";
import type { RangeValue } from 'rc-picker/lib/interface'
const { RangePicker } = DatePicker
import 'styles/address-combination.less'
import { ColumnsType, TablePaginationConfig } from "antd/lib/table";
import Global from "utils/Global";
import { SorterResult, TableCurrentDataSource } from "antd/lib/table/interface";
import { AppState } from "redux/reducers";
import { useDispatch, useSelector } from "react-redux";
import { ColumnsItem, SMTransferRankListParams, SMTransferRankListResponse } from "redux/types/SmartMoney/TransferData/TransferRecordTypes";
import { getSMTransferRankList } from "redux/actions/SmartMoney/TransferData/TransferRecordAction";
import { TokenLogo } from "components/TokenLogo";
import Link from "next/link";
import GlobalLabel from "components/GlobalLabel";
import WaterMarkContent from "components/WaterMarkContent";


interface TransferRecordProps {
  addressType: string,
}
export default function TransferRecord() {
  const { formatMessage } = useIntl()
  const f = (id: string) => formatMessage({ id })
  const router = useRouter()
  const { locale } = router
  const dispatch = useDispatch()

  const { addressType } = useSelector((state: AppState) => state.smartMoneyReducer);

  const transferLoading = useSelector(
    (state: AppState) => state.TransferRecordReducer.transferLoading
  )
  const transferRankList = useSelector(
    (state: AppState) => state.TransferRecordReducer.transferRankList
  )

  const [current, setCurrent] = useState<string>('Bus')
  const [searchMenuColor, setSearchMenuColor] = useState(false)
  const [busCondition, setBusCondition] = useState<SMTransferRankListParams>({
    pageNo: 1,
    pageSize: 20,
  })
  const [query, setQuery] = useState<SMTransferRankListParams>({
    fromAddr: null, 
    toAddr: null, 
    startTime: null,
    endTime: null,
    makerTokenKeyword: null, 
    minAmountValue: null, 
    addressType: addressType,
    pageSize: 20,
    pageNo: 1,
  })
  const dispatchType = (arr: SMTransferRankListParams) => {
    dispatch(
      getSMTransferRankList(arr)
    )
  }
  useEffect(() => {
    setQuery({
      ...query,
      addressType: addressType,
      pageSize: 20,
      pageNo: 1,
    })
    dispatchType({
      ...query,
      addressType: addressType,
      pageSize: 20,
      pageNo: 1,
    })
  }, [addressType])
  useEffect(() => {
    if (query.startTime || query.endTime || query.fromAddr || query.toAddr || query.makerTokenKeyword || query.minAmountValue) {
      setSearchMenuColor(true)
    } else {
      setSearchMenuColor(false)
    }
  }, [query])
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleDatePickerChange = (dates: RangeValue<Moment>, dateStrings: string[]) => {
    setQuery({
      ...query,
      startTime: Math.floor(moment(dates![0]).valueOf()),
      endTime: Math.floor(moment(dates![1]).valueOf()),
    })
  }
  const handleOk = () => {
    setBusCondition({
      pageNo: 1,
      pageSize: 20,
    })
    dispatchType({
      ...query,
      ...busCondition,
      pageNo: 1,
      pageSize: 20,
    })
    setIsModalVisible(false);
  };
  const handleCancel = () => {
    setQuery({
      fromAddr: null, 
      toAddr: null, 
      startTime: null,
      endTime: null,
      makerTokenKeyword: null, 
      minAmountValue: null, 
      addressType: addressType,
      pageSize: 20,
      pageNo: 1,
    });
    setBusCondition({
      pageNo: 1,
      pageSize: 20,
    })
    dispatchType({
      fromAddr: null, 
      toAddr: null, 
      startTime: null,
      endTime: null,
      makerTokenKeyword: null, 
      minAmountValue: null, 
      addressType: addressType,
      pageSize: 20,
      pageNo: 1,
    })
    setIsModalVisible(false);
  };

  const menuClick = (e: MenuInfo) => {
    if (e.key == 'SearchMenu') {
      setIsModalVisible(true);
    } else {
      // setCurrent(e.key)
      // dispatchType({
      //   ...query,
      //   ...busCondition,
      // })
    }
  }

  const busTableChange = (pagination: TablePaginationConfig, sorter: SorterResult<ColumnsItem> | SorterResult<ColumnsItem>[],) => {
    setBusCondition({
      ...busCondition,
      pageNo: pagination.current as number,
      pageSize: pagination.pageSize as number,
    })
    dispatchType({
      ...query,
      ...busCondition,
      pageNo: pagination.current as number,
      pageSize: pagination.pageSize as number,
    })
  }

  return (
    <div className="SM-block-item">
      <div className="menuBox transaction-history-menu-box">
        <Menu
          selectedKeys={[current as string]}
          mode="horizontal"
          style={{ background: 'transparent' }}
          onClick={menuClick}
        >
          <Menu.Item key="Bus">
            {f('smTransferSwap')}
          </Menu.Item>
          <Menu.Item key="SearchMenu" className={`search-menu ${searchMenuColor ? 'search-menu-active' : ''}`}>
            {f('SearchMenu')}<FilterFilled />
          </Menu.Item>
        </Menu>
      </div>

      <div
        className="common-table"
        style={{ boxShadow: 'none', padding: '0 0 20px', margin: '20px 0 0' }}
      >
        < TableRecordBus
          locale={locale as string}
          params={{
            loading: transferLoading,
            pageNo: busCondition.pageNo,
            pageSize: busCondition.pageSize,
          }}
          groupList={transferRankList}
          handleTableChange={(pagination, filters, sorter, extra) => {
            busTableChange(pagination, sorter)
          }}
        />
        <WaterMarkContent bottom={150} />
      </div>
      <Modal
        visible={isModalVisible}
        onCancel={() => { setIsModalVisible(false) }}
        width={locale == 'zh' ? 520 : 620}
        footer={null}>
        <p className="modal-title">
          {f('SearchMenu')}
        </p>
        <Row style={{ marginBottom: 16 }}>
          <Col span={locale == 'zh' ? 6 : 8} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end'
          }}>
            {f('searchMenuTimeInterval')}：
          </Col>
          <Col span={locale == 'zh' ? 18 : 16}>
            <RangePicker
              format={'YYYY-MM-DD'}
              allowClear={false}
              value={query.startTime ? [moment(query.startTime), moment(query.endTime)] : [] as unknown as [Moment, Moment]}
              onChange={handleDatePickerChange}
              style={{ width: '100%' }}
            />
          </Col>
        </Row>
        <Row style={{ marginBottom: 16 }}>
          <Col span={locale == 'zh' ? 6 : 8} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end'
          }}>
            {f('searchFromAddress')}：
          </Col>
          <Col span={locale == 'zh' ? 18 : 16}>
            <Input placeholder={f('searchAddressPlaceholder')} value={query.fromAddr as string} onChange={(e) => {
              setQuery({
                ...query,
                fromAddr: e.target.value || null,
              })
            }} />
          </Col>
        </Row>
        <Row style={{ marginBottom: 16 }}>
          <Col span={locale == 'zh' ? 6 : 8} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end'
          }}>
            {f(`searchToAddress`)}：
          </Col>
          <Col span={locale == 'zh' ? 18 : 16}>
            <Input placeholder={f('searchAddressPlaceholder')} value={query.toAddr as string} onChange={(e) => {
              setQuery({
                ...query,
                toAddr: e.target.value || null,
              })
            }} />
          </Col>
        </Row>
        <Row style={{ marginBottom: 16 }}>
          <Col span={locale == 'zh' ? 6 : 8} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end'
          }}>
            {f(`searchSymbolAddr`)}：
          </Col>
          <Col span={locale == 'zh' ? 18 : 16}>
            <Input placeholder={f('searchSymbolAddrPlaceholder')} value={query.makerTokenKeyword as string} onChange={(e) => {
              setQuery({
                ...query,
                makerTokenKeyword: e.target.value || null,
              })
            }} />
          </Col>
        </Row>
        <Row style={{ marginBottom: 40 }}>
          <Col span={locale == 'zh' ? 6 : 8} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end'
          }}>
            {f(`searchMinAmountValue`)}：
          </Col>
          <Col span={locale == 'zh' ? 18 : 16}>
            <Input placeholder={f('searchMinAmountValuePlaceholder')} value={query.minAmountValue as number} onChange={(e) => {
              setQuery({
                ...query,
                minAmountValue: e.target.value as unknown as number || null,
              })
            }} />
          </Col>
        </Row>
        <div className="form-btns">
          <Button
            style={{
              marginRight: 100,
            }} onClick={handleCancel}>
            {f('resetBtn')}
          </Button>
          <Button type="primary" onClick={handleOk}>
            {f('searchBtn')}
          </Button>
        </div>
      </Modal>
    </div>
  )
}

interface TableProps {
  locale: string,
  params: {
    loading: boolean,
    pageNo: number | undefined,
    pageSize: number | undefined,
  },
  groupList: SMTransferRankListResponse | null,
  handleTableChange: (pagination: TablePaginationConfig, filters: Record<string, (Key | boolean)[] | null>, sorter: SorterResult<ColumnsItem> | SorterResult<ColumnsItem>[], extra: TableCurrentDataSource<ColumnsItem>) => void;
}
function TableRecordBus({ locale, params, groupList, handleTableChange }: TableProps) {
  const { formatMessage } = useIntl()
  const f = (id: string) => formatMessage({ id })

  const logoUrlDesc: string[] = [
    f('smWhale'),
    f('smRobot'),
    f('smElephant'),
  ]
  const columns: ColumnsType<ColumnsItem> = [
    {
      title: f('smRecordTimestamp'),
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (text, record) => {
        return Global.distanceFromCurrent(record.timestamp, locale, true)
      },
    },
    {
      title: f('smFromAddress'),
      dataIndex: 'from',
      key: 'from',
      render: (text, record) => {
        return (
          <div>
            <GlobalLabel addr={record.fromAddr} label={record.fromAddrLabel} link="/address-analyse/" />
            < span
              style={{
                display: 'inline-block',
                width: 25,
                height: 20,
                paddingLeft: 5,
              }
              }
            >
              {
                record.from.logoUrl ? (
                  <Tooltip
                    title={
                      <div>
                        {
                          logoUrlDesc[
                          Number(record.from.description) - 1
                          ]
                        }
                      </div>
                    }
                  >
                    <TokenLogo
                      style={{
                        width: '100%',
                        height: '100%',
                      }}
                      src={record.from.logoUrl}
                    />
                  </Tooltip>
                ) : null
              }
            </span >
          </div>
        )
      },
    },
    {
      title: ' ',
      dataIndex: 'type',
      key: 'type',
      width: 50,
      render: (text, record) => {
        return <span style={{ color: '#EF6D59', display: 'flex' }}>
          <SwapRightOutlined />
        </span>
      },
    },
    {
      title: f('smToAddress'),
      dataIndex: 'to',
      key: 'to',
      render: (text, record) => {
        return (
          <div>
            <GlobalLabel addr={record.toAddr} label={record.toAddrLabel} link="/address-analyse/" />
            < span
              style={{
                display: 'inline-block',
                width: 25,
                height: 20,
                paddingLeft: 5,
              }
              }
            >
              {
                record.to.logoUrl ? (
                  <Tooltip
                    title={
                      <div>
                        {
                          logoUrlDesc[
                          Number(record.to.description) - 1
                          ]
                        }
                      </div>
                    }
                  >
                    <TokenLogo
                      style={{
                        width: '100%',
                        height: '100%',
                      }}
                      src={record.to.logoUrl}
                    />
                  </Tooltip>
                ) : null
              }
            </span >
          </div>
        )
      },
    },
    {
      title: f('smToken'),
      dataIndex: 'symbol',
      key: 'symbol',
      align: 'center',
      render: (text, record) => {
        return < Link
          href={`/market-detail/market-page/${record.symbolAddr}`}
        >
          <a className="url-link">
            {record.symbol}
          </a>
        </Link >
      },
    },
    {
      title: f('smAmount'),
      dataIndex: 'amount',
      key: 'amount',
      align: 'right',
      render: (text, record) => {
        return <span>{Global.formatBigNum(record.amount)}</span>
      },
    },
    {
      title: f('smValue'),
      dataIndex: 'value',
      key: 'value',
      align: 'right',
      render: (text, record) => {
        return <span>$ {Global.formatBigNum(record.value)}</span>
      },
    },
    {
      title: f('smPrice'),
      dataIndex: 'price',
      key: 'price',
      align: 'right',
      render: (text, record) => {
        return <span>$ {Global.formatBigNum(record.price)}</span>
      },
    },
    {
      title: f('smRecordTxHash'),
      dataIndex: 'txHash',
      key: 'txHash',
      align: 'right',
      render: (text, record) => {
        return (
          <svg
            className="icon"
            aria-hidden="true"
            style={{ width: 16, height: 16, cursor: 'pointer' }}
            onClick={() => {
              window.open(record.txHash)
            }}>
            <use xlinkHref='#icon-etherscan'></use>
          </svg>
        )
      },
    }
  ]
  return (
    <Table
      rowKey={(record: ColumnsItem) => {
        return `${record.txHash}--${record.index}`;
      }}
      columns={columns}
      pagination={{
        showQuickJumper: true,
        showSizeChanger: false,
        current: params.pageNo,
        pageSize: params.pageSize,
        total: groupList?.totalSize as number,
        position: ['bottomCenter'],
      }}
      dataSource={groupList?.list}
      loading={params.loading}
      onChange={handleTableChange}
    />
  )
}
