import { Button, Col, DatePicker, Input, InputNumber, Menu, Modal, Radio, Row, Table, Tooltip } from "antd";
import { Key, ReactElement, useEffect, useState } from "react";
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
import { RecordColumnsItem, SMRecordListResponse, SMRecordParams } from "redux/types/SmartMoney/TransactionData/TransactionRecordTypes";
import { SorterResult, TableCurrentDataSource } from "antd/lib/table/interface";
import { AppState } from "redux/reducers";
import { useDispatch, useSelector } from "react-redux";
import { getSMRecordBusList, getSMRecordLPList } from "redux/actions/SmartMoney/TransactionData/TransactionRecordAction";
import Link from "next/link";
import GlobalLabel from "components/GlobalLabel";
import WaterMarkContent from "components/WaterMarkContent";


interface TransactionRecordProps {
  addressType: string,
}
export default function TransactionRecord() {
  const { formatMessage } = useIntl()
  const f = (id: string) => formatMessage({ id })
  const router = useRouter()
  const { locale } = router
  const dispatch = useDispatch()

  const { addressType } = useSelector((state: AppState) => state.smartMoneyReducer);


  const busLoading = useSelector(
    (state: AppState) => state.smTransactionRecordReducer.busLoading
  )
  const busList = useSelector(
    (state: AppState) => state.smTransactionRecordReducer.busList
  )

  const lpLoading = useSelector(
    (state: AppState) => state.smTransactionRecordReducer.lpLoading
  )
  const lpList = useSelector(
    (state: AppState) => state.smTransactionRecordReducer.lpList
  )

  const [current, setCurrent] = useState<string>('Bus')
  const [searchMenuColor, setSearchMenuColor] = useState(false)
  const [busCondition, setBusCondition] = useState<SMRecordParams>({
    pageNo: 1,
    pageSize: 20,
    sortField: null,
    sortType: null, // 1 asc  ; 0 desc
  })
  const [lpCondition, setLpCondition] = useState<SMRecordParams>({
    pageNo: 1,
    pageSize: 20,
    sortField: null,
    sortType: null, // 1 asc  ; 0 desc
  })
  const [query, setQuery] = useState<SMRecordParams>({
    addressType: null,
    startTime: null,
    endTime: null,
    address: null,
    takerTokenKeyword: null,
    makerTokenKeyword: null,
    symbol0Addr: null,
    symbol1Addr: null,
    pageSize: 20,
    pageNo: 1,
  })
  const dispatchType = (arr: SMRecordParams, key?: string) => {
    if ((key && key == 'Bus') || (!key && current == 'Bus')) {
      dispatch(
        getSMRecordBusList(arr)
      )
    } else {
      dispatch(
        getSMRecordLPList(arr)
      )
    }
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
    }, 'Bus')
    dispatchType({
      ...query,
      addressType: addressType,
      pageSize: 20,
      pageNo: 1,
    }, 'Lp')
  }, [addressType])
  useEffect(() => {
    if (current == 'Bus') {
      if (query.startTime || query.endTime || query.address || query.takerTokenKeyword || query.makerTokenKeyword) {
        setSearchMenuColor(true)
      } else {
        setSearchMenuColor(false)
      }
    } else {
      if (query.startTime || query.endTime || query.address || query.symbol0Addr || query.symbol1Addr) {
        setSearchMenuColor(true)
      } else {
        setSearchMenuColor(false)
      }
    }
  }, [query, current])
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleDatePickerChange = (dates: RangeValue<Moment>, dateStrings: string[]) => {
    setQuery({
      ...query,
      startTime: Math.floor(moment(dates![0]).valueOf()),
      endTime: Math.floor(moment(dates![1]).valueOf()),
    })
  }
  const handleOk = () => {
    if (current == 'Bus') {
      setBusCondition({
        pageNo: 1,
        pageSize: 20,
        sortField: null,
        sortType: null
      })
      dispatchType({
        ...query,
        ...busCondition,
        pageNo: 1,
        pageSize: 20,
        sortField: null,
        sortType: null
      })
    } else {
      setLpCondition({
        pageNo: 1,
        pageSize: 20,
        sortField: null,
        sortType: null
      })
      dispatchType({
        ...query,
        ...lpCondition,
        pageNo: 1,
        pageSize: 20,
        sortField: null,
        sortType: null
      })
    }
    setIsModalVisible(false);
  };
  const handleCancel = () => {
    setQuery({
      addressType: addressType,
      startTime: null,
      endTime: null,
      address: null,
      takerTokenKeyword: null,
      makerTokenKeyword: null,
      symbol0Addr: null,
      symbol1Addr: null,
      pageSize: 20,
      pageNo: 1,
    });
    setBusCondition({
      pageNo: 1,
      pageSize: 20,
      sortField: null,
      sortType: null
    })
    setLpCondition({
      pageNo: 1,
      pageSize: 20,
      sortField: null,
      sortType: null
    })
    dispatchType({
      addressType: addressType,
      startTime: null,
      endTime: null,
      address: null,
      takerTokenKeyword: null,
      makerTokenKeyword: null,
      symbol0Addr: null,
      symbol1Addr: null,
      pageSize: 20,
      pageNo: 1,
      sortField: null,
      sortType: null
    })
    setIsModalVisible(false);
  };

  const menuClick = (e: MenuInfo) => {
    if (e.key == 'SearchMenu') {
      setIsModalVisible(true);
    } else {
      setCurrent(e.key)
      if (e.key == 'Bus') {
        dispatchType({
          ...query,
          ...busCondition,
        }, e.key)
      } else if (e.key == 'Lp') {
        dispatchType({
          ...query,
          ...lpCondition,
        }, e.key)
      }
    }
  }

  const busTableChange = (pagination: TablePaginationConfig, sorter: SorterResult<RecordColumnsItem> | SorterResult<RecordColumnsItem>[],) => {
    const { key, order } = sorterCall(sorter)
    setBusCondition({
      ...busCondition,
      pageNo: busCondition.pageNo == pagination.current as number ? 1 : pagination.current as number,
      pageSize: pagination.pageSize,
      sortField: key as string,
      sortType: order
    })
    dispatchType({
      ...query,
      ...busCondition,
      pageNo: busCondition.pageNo == pagination.current as number ? 1 : pagination.current as number,
      pageSize: pagination.pageSize,
      sortField: key as string,
      sortType: order
    })
  }
  const lpTableChange = (pagination: TablePaginationConfig, sorter: SorterResult<RecordColumnsItem> | SorterResult<RecordColumnsItem>[]) => {
    const { key, order } = sorterCall(sorter)
    setLpCondition({
      ...lpCondition,
      pageNo: lpCondition.pageNo == pagination.current as number ? 1 : pagination.current as number,
      pageSize: pagination.pageSize,
      sortField: key as string,
      sortType: order
    })
    dispatchType({
      ...query,
      ...lpCondition,
      pageNo: lpCondition.pageNo == pagination.current as number ? 1 : pagination.current as number,
      pageSize: pagination.pageSize,
      sortField: key as string,
      sortType: order
    })
  }
  const sorterCall = (sorter: SorterResult<RecordColumnsItem> | SorterResult<RecordColumnsItem>[]) => {
    if (!Array.isArray(sorter)) {
      if (sorter.order == 'descend') {
        return { key: sorter.columnKey, order: '0' }
      } else if (sorter.order == 'ascend') {
        return { key: sorter.columnKey, order: '1' }
      } else {
        return { key: null, order: null }
      }
    } else {
      return { key: null, order: null }
    }
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
            {f('smTransactionBus')}
          </Menu.Item>
          <Menu.Item key="Lp">
            {f('smTransactionLp')}
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
        {current == 'Bus' ?
          < TableRecordBus
            locale={locale as string}
            params={{
              loading: busLoading,
              pageNo: busCondition.pageNo,
              pageSize: busCondition.pageSize,
            }}
            groupList={busList}
            handleTableChange={(pagination, filters, sorter, extra) => {
              busTableChange(pagination, sorter)
            }}
          />
          :
          <TableRecordLp
            locale={locale as string}
            params={{
              loading: lpLoading,
              pageNo: lpCondition.pageNo,
              pageSize: lpCondition.pageSize,
            }}
            groupList={lpList}
            handleTableChange={(pagination, filters, sorter, extra) => {
              lpTableChange(pagination, sorter)
            }}
          />
        }
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
            {f('searchMenuAddress')}：
          </Col>
          <Col span={locale == 'zh' ? 18 : 16}>
            <Input placeholder={f('searchMenuAddressPlaceholder')} value={query.address as string} onChange={(e) => {
              setQuery({
                ...query,
                address: e.target.value || null,
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
            {f(`searchMenu${current}TokenA`)}：
          </Col>
          <Col span={locale == 'zh' ? 18 : 16}>
            {
              current == 'Bus' ?
                <Input placeholder={f('searchMenuTokenPlaceholder')} value={query.takerTokenKeyword as string} onChange={(e) => {
                  setQuery({
                    ...query,
                    takerTokenKeyword: e.target.value || null,
                  })
                }} />
                :
                <Input placeholder={f('searchMenuTokenPlaceholder')} value={query.symbol0Addr as string} onChange={(e) => {
                  setQuery({
                    ...query,
                    symbol0Addr: e.target.value || null,
                  })
                }} />
            }
          </Col>
        </Row>
        <Row style={{ marginBottom: 40 }}>
          <Col span={locale == 'zh' ? 6 : 8} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end'
          }}>
            {f(`searchMenu${current}TokenB`)}：
          </Col>
          <Col span={locale == 'zh' ? 18 : 16}>
            {
              current == 'Bus' ?
                <Input placeholder={f('searchMenuTokenPlaceholder')} value={query.makerTokenKeyword as number} onChange={(e) => {
                  setQuery({
                    ...query,
                    makerTokenKeyword: e.target.value || null,
                  })
                }} />
                :
                <Input placeholder={f('searchMenuTokenPlaceholder')} value={query.symbol1Addr as number} onChange={(e) => {
                  setQuery({
                    ...query,
                    symbol1Addr: e.target.value || null,
                  })
                }} />
            }
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
  groupList: SMRecordListResponse | null,
  handleTableChange: (pagination: TablePaginationConfig, filters: Record<string, (Key | boolean)[] | null>, sorter: SorterResult<RecordColumnsItem> | SorterResult<RecordColumnsItem>[], extra: TableCurrentDataSource<RecordColumnsItem>) => void;
}
function TableRecordBus({ locale, params, groupList, handleTableChange }: TableProps) {
  const { formatMessage } = useIntl()
  const f = (id: string) => formatMessage({ id })

  const columns: ColumnsType<RecordColumnsItem> = [
    {
      title: f('smRecordTimestamp'),
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (text, record) => {
        return Global.distanceFromCurrent(record.timestamp, locale, true)
      },
    },
    {
      title: f('smRecordAddress'),
      dataIndex: 'address',
      key: 'address',
      render: (text, record) => (
        <GlobalLabel addr={record.address} label={record.addressLabel} link="/address-analyse/" />
      ),
    },
    {
      title: f('smRecordTakerAmount'),
      dataIndex: 'takerAmount',
      key: 'takerAmount',
      sorter: true,
      sortDirections: ['descend' as const, 'ascend' as const],
      align: 'right',
      render: (text, record) => {
        return <span>{Global.formatBigNum(record.takerAmount)}</span>
      },
    },
    {
      title: f('smRecordTaskerToken'),
      dataIndex: 'takerToken',
      key: 'takerToken',
      render: (text, record) => {
        return <Link
          href={`/market-detail/market-page/${record.takerTokenAddr}`}
        >
          <a className="url-link">
            {record.takerToken}
          </a>
        </Link>
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
      title: f('smRecordMakerAmount'),
      dataIndex: 'makerAmount',
      key: 'makerAmount',
      sorter: true,
      sortDirections: ['descend' as const, 'ascend' as const],
      align: 'right',
      render: (text, record) => {
        return <span>{Global.formatBigNum(record.makerAmount)}</span>
      },
    },
    {
      title: f('smRecordMakerToken'),
      dataIndex: 'makerToken',
      key: 'makerToken',
      render: (text, record) => {
        return <Link
          href={`/market-detail/market-page/${record.makerTokenAddr}`}
        >
          <a className="url-link">
            {record.makerToken}
          </a>
        </Link>
      },
    },
    {
      title: f('smRecordDex'),
      dataIndex: 'dex',
      key: 'dex',
      render: (text, record) => {
        return <span>{record.dex ? record.dex : 'Others'}</span>
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
      rowKey={(record: RecordColumnsItem) => {
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

function TableRecordLp({ locale, params, groupList, handleTableChange }: TableProps) {
  const { formatMessage } = useIntl()
  const f = (id: string) => formatMessage({ id })

  const tableTypeColumn: ReactElement[] = [
    <span style={{ color: '#1FA300', display: 'flex' }}>
      <svg
        className="icon"
        aria-hidden="true"
        style={{ width: 16, height: 16 }}>
        <title>{f('smRecordLpDown')}</title>
        <use xlinkHref='#icon-lp_down'></use>
      </svg>
    </span>,
    <span style={{ color: '#EF6D59', display: 'flex' }}>
      <svg
        className="icon"
        aria-hidden="true"
        style={{ width: 16, height: 16 }}>
        <title>{f('smRecordLpUp')}</title>
        <use xlinkHref='#icon-lp_up'></use>
      </svg>
    </span>,
  ]

  const columns: ColumnsType<RecordColumnsItem> = [
    {
      title: f('smRecordTimestamp'),
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (text, record) => {
        return Global.distanceFromCurrent(record.timestamp, locale, true)
      },
    },
    {
      title: f('smRecordAddress'),
      dataIndex: 'address',
      key: 'address',
      render: (text, record) => (
        <GlobalLabel addr={record.address} label={record.addressLabel} link="/address-analyse/" />
      ),
    },
    {
      title: f('smRecordType'),
      dataIndex: 'type',
      key: 'type',
      align: 'center',
      render: (text, record) => {
        if (record.type == 1) {
          return (
            <span style={{ color: '#1FA300' }}>
              {f('smRecordLpDown')}
            </span>
          )
        } else if (record.type == 2) {
          return (
            <span style={{ color: '#EF6D59' }}>
              {f('smRecordLpUp')}
            </span>
          )
        }
      },
    },
    {
      title: f('smRecordTakerAmountLp'),
      dataIndex: 'takerAmountA',
      key: 'takerAmountA',
      sorter: true,
      sortDirections: ['descend' as const, 'ascend' as const],
      align: 'right',
      render: (text, record) => {
        return <span>{Global.formatBigNum(record.takerAmountA)}</span>
      },
    },
    {
      title: f('smRecordTaskerTokenA'),
      dataIndex: 'takerTokenA',
      key: 'takerTokenA',
      render: (text, record) => {
        return <Link
          href={`/market-detail/market-page/${record.takerTokenAddrA}`}
        >
          <a className="url-link">
            {record.takerTokenA}
          </a>
        </Link>
      },
    },
    {
      title: ' ',
      dataIndex: 'type',
      key: 'type',
      width: 50,
      render: (text, record) => {
        return (
          <span style={{
            display: 'flex',
            width: 30,
            alignItems: 'center'
          }}>
            {/* {tableTypeColumn[record.type - 1]} */}
            +
          </span>
        )
      },
    },
    {
      title: f('smRecordTakerAmountLp'),
      dataIndex: 'takerAmountB',
      key: 'takerAmountB',
      sorter: true,
      sortDirections: ['descend' as const, 'ascend' as const],
      align: 'right',
      render: (text, record) => {
        return <span>{Global.formatBigNum(record.takerAmountB)}</span>
      },
    },
    {
      title: f('smRecordTakerTokenB'),
      dataIndex: 'takerTokenB',
      key: 'takerTokenB',
      render: (text, record) => {
        return <Link
          href={`/market-detail/market-page/${record.takerTokenAddrB}`}
        >
          <a className="url-link">
            {record.takerTokenB}
          </a>
        </Link>
      },
    },
    {
      title: f('smRecordDex'),
      dataIndex: 'dex',
      key: 'dex',
      render: (text, record) => {
        return <span>{record.dex ? record.dex : 'Others'}</span>
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
      rowKey={(record: RecordColumnsItem) => {
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
