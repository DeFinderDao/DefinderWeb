import { BackTop, Divider, Radio, RadioChangeEvent, Spin, Table, Tooltip } from "antd";
import { useIntl } from "react-intl";
import { QuestionCircleOutlined, UpCircleOutlined } from '@ant-design/icons'
import { Key, useEffect, useState } from "react";
import { ColumnType } from "antd/lib/table";
import { ColumnsItem, SMRankListResponse, SMTransactionRankListParams } from "redux/types/SmartMoney/TransactionData/BuySellRankTypes";
import Global from "utils/Global";
import { SorterResult, TableCurrentDataSource, TablePaginationConfig } from "antd/lib/table/interface";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "redux/reducers";
import React from "react";
import { ANT_CHARTS_DARK } from "utils/env";
import loadable from '@loadable/component'
import {
  getSMBuyRankList, getSMSellRankList, smTransactionBuyListLoading, smTransactionBuyListNoMore, smTransactionSellListLoading, smTransactionSellListNoMore
} from "redux/actions/SmartMoney/TransactionData/BuySellRankAction";
import { useRouter } from "next/router";
import TimeChoose from "components/MarketComponents/TimeChoose";
import { Options } from "@ant-design/plots/lib/hooks/useChart";
import ApiClient from "utils/ApiClient";
import AddressTypeDropdown from "../AddressTypeDropdown";
import { changeAddressType } from "redux/actions/SmartMoneyAction";
import Link from "next/link";
const Pie = loadable(() => import('@ant-design/plots/lib/components/pie'))
import WaterMarkContent from "components/WaterMarkContent";

interface BuySellRankProps {
  type: string,
  showMore: boolean
}
export default function BuySellRank({ type, showMore }: BuySellRankProps) {
  const { formatMessage } = useIntl()
  const f = (id: string) => formatMessage({ id })
  const dispatch = useDispatch()

  const { addressType } = useSelector((state: AppState) => state.smartMoneyReducer);
  const { level } = useSelector((state: AppState) => state.userInfo);

  const pageSize = showMore || level == 0 ? 10 : 100
  const [smTransactionRankListCondition, setSmTransactionRankListCondition] =
    useState<SMTransactionRankListParams>({
      addressType: addressType,
      dateType: '2',
      sortField: 'netSwapAsset',
      sortType: '0', // 1 asc  ; 0 desc
      pageNo: 1,
      pageSize: pageSize,
    })
  const dispatchType = (arr: SMTransactionRankListParams) => {
    if (type == 'Buy') {
      dispatch(
        getSMBuyRankList(arr)
      )
    } else {
      dispatch(
        getSMSellRankList(arr)
      )
    }
  }
  useEffect(() => {
    setSmTransactionRankListCondition({
      ...smTransactionRankListCondition,
      addressType: addressType,
      pageSize: pageSize,
      pageNo: 1,
    })
    dispatchType({
      ...smTransactionRankListCondition,
      addressType: addressType,
      pageSize: pageSize,
      pageNo: 1,
    })
  }, [addressType])

  const [radioType, setRadioType] = useState('2')
  const radioChange = (e: RadioChangeEvent) => {
    setRadioType(e.target.value)
    setSmTransactionRankListCondition({
      ...smTransactionRankListCondition,
      dateType: e.target.value,
      pageSize: pageSize,
      pageNo: 1,
    })
    dispatchType({
      ...smTransactionRankListCondition,
      dateType: e.target.value,
      pageSize: pageSize,
      pageNo: 1,
    })
  }
  // const smTransactionRankPie = useSelector(
  //   (state: AppState) => type == 'Buy' ? state.smBuySellRankReducer.buyRankPie : state.smBuySellRankReducer.sellRankPie
  // )
  const smTransactionRankList = useSelector(
    (state: AppState) => type == 'Buy' ? state.smBuySellRankReducer.buyRankList : state.smBuySellRankReducer.sellRankList
  )
  const smTransactionRankLoading = useSelector(
    (state: AppState) => type == 'Buy' ? state.smBuySellRankReducer.buyLoading : state.smBuySellRankReducer.sellLoading
  )
  const smTransactionRankNoMore = useSelector(
    (state: AppState) => type == 'Buy' ? state.smBuySellRankReducer.buyNoMore : state.smBuySellRankReducer.sellNoMore
  )
  const sortChange = (sorter: SorterResult<ColumnsItem>) => {
    setSmTransactionRankListCondition({
      ...smTransactionRankListCondition,
      sortField: sorter.columnKey as string,
      pageSize: pageSize,
      pageNo: 1,
    })
    dispatchType({
      ...smTransactionRankListCondition,
      sortField: sorter.columnKey as string,
      pageSize: pageSize,
      pageNo: 1,
    })
  }
  const handleDropdownClick = (type: string) => {
    const element = document.getElementsByClassName('currency-addr-rank-scroll')[0] as unknown as HTMLElement;
    element.scrollTop = 0;
    dispatch(changeAddressType(type));
  }
  return (
    <>
      {
        showMore ?
          <div className="SM-block-item">
            < div className="item-title" >
              <div className="adapt-width">
                <span>
                  {f(`sm${type}TokenRankTitle`)}
                  <Tooltip
                    placement="right"
                    title={<div>{f(`sm${type}TokenRankTips`)}</div>}
                  >
                    <QuestionCircleOutlined
                      style={{
                        fontSize: '16px',
                        marginLeft: '10px',
                      }}
                    />
                  </Tooltip>
                </span>
                <span className="SM-tips">*{f('stableCurrencyExcluded')}</span>
              </div>
              <div className="defi-radio-group-time">
                <Radio.Group
                  defaultValue={radioType}
                  buttonStyle="solid"
                  onChange={radioChange}
                >
                  <Radio.Button value="4">
                    {f('smTimeChoose30Days')}
                  </Radio.Button>
                  <Radio.Button value="3">
                    {f('smTimeChoose7Days')}
                  </Radio.Button>
                  <Radio.Button value="2">
                    {f('smTimeChoose3Days')}
                  </Radio.Button>
                  <Radio.Button value="1">
                    {f('smTimeChoose24Hours')}
                  </Radio.Button>
                  <Radio.Button value="5">
                    {f('smTimeChoose4Hours')}
                  </Radio.Button>
                </Radio.Group>
              </div>
            </div >
            <div className="SM-block-table">
              <ShowMoreCom smTransactionRankList={smTransactionRankList} smTransactionRankLoading={smTransactionRankLoading} smTransactionRankNoMore={smTransactionRankNoMore} type={type} showMore={showMore} sortChange={(sorter) => { sortChange(sorter) }} setSmTransactionRankListCondition={setSmTransactionRankListCondition} />
            </div>
          </div >
          :
          <div>
            <div className="defi-radio-group-time" style={{ display: 'flex', alignItems: 'center' }}>
              <TimeChoose
                name="sm"
                timeChange={(e) => {
                  const element = document.getElementsByClassName('currency-addr-rank-scroll')[0] as unknown as HTMLElement;
                  element.scrollTop = 0;
                  setSmTransactionRankListCondition({
                    ...smTransactionRankListCondition,
                    dateType: e.target.value,
                    pageSize: pageSize,
                    pageNo: 1,
                  })
                  dispatchType({
                    ...smTransactionRankListCondition,
                    dateType: e.target.value,
                    pageSize: pageSize,
                    pageNo: 1,
                  })
                }}
              />
              <div style={{ display: 'flex', alignItems: 'center', marginLeft: 30 }}>
                <div style={{ borderLeft: '1px solid #fff', height: 22, width: 1 }}></div>
                <div style={{ marginLeft: 10 }}>
                  <AddressTypeDropdown addressType={addressType} handleDropdownClick={handleDropdownClick} />
                </div>
              </div>
            </div>
            <DetailCom smTransactionRankList={smTransactionRankList} smTransactionRankLoading={smTransactionRankLoading} smTransactionRankNoMore={smTransactionRankNoMore} type={type} showMore={showMore} sortChange={(sorter) => { sortChange(sorter) }} smTransactionRankListCondition={smTransactionRankListCondition} setSmTransactionRankListCondition={setSmTransactionRankListCondition} />
          </div>
      }
    </>
  )
}

interface TablePaops {
  smTransactionRankList: SMRankListResponse | null,
  smTransactionRankLoading: boolean,
  smTransactionRankNoMore: boolean,
  type: string,
  showMore: boolean,
  sortChange: (sorter: SorterResult<ColumnsItem>) => void,
  smTransactionRankListCondition?: SMTransactionRankListParams,
  setSmTransactionRankListCondition: React.Dispatch<React.SetStateAction<SMTransactionRankListParams>>
}

function ShowMoreCom({ smTransactionRankList, smTransactionRankLoading, smTransactionRankNoMore, type, showMore, sortChange }: TablePaops) {
  const { formatMessage } = useIntl()
  const f = (id: string) => formatMessage({ id })
  const router = useRouter()

  const [sortedInfo, setSortedInfo] = useState<SorterResult<ColumnsItem>>({ columnKey: 'netSwapAsset', order: "descend" })
  const handleChange = (pagination: TablePaginationConfig, filters: Record<string, (Key | boolean)[] | null>, sorter: SorterResult<ColumnsItem> | SorterResult<ColumnsItem>[], extra: TableCurrentDataSource<ColumnsItem>) => {
    if (!Array.isArray(sorter)) {
      if (sortedInfo.columnKey == sorter.columnKey) {
        if (sorter.columnKey == 'netSwapAsset') {
          sorter = { ...sorter, columnKey: 'netSwapAddrCount', field: 'netSwapAddrCount', order: "descend" }
        } else {
          sorter = { ...sorter, columnKey: 'netSwapAsset', field: 'netSwapAsset', order: "descend" }
        }
      }
      setSortedInfo(sorter)
      sortChange(sorter as SorterResult<ColumnsItem>)
    }
  }

  const [activeAdd, setActiveAdd] = useState('')
  const handleMouseEnter = (data: ColumnsItem) => {
    (setActiveAdd as React.Dispatch<React.SetStateAction<string>>)(data.symbolAddr as string);
  }
  const handleMouseLeave = (data: ColumnsItem) => {
    (setActiveAdd as React.Dispatch<React.SetStateAction<string>>)('');
  }

  const handleItemClick = (event: any, record: ColumnsItem) => {
    const url = `/smart-money-info/smart-money/${record.symbolAddr}`;
    Global.openNewTag(event, router, url)
  }
  const columnsRow: ColumnType<ColumnsItem>[] = [
    {
      title: f('smToken'),
      dataIndex: 'symbol',
      key: 'symbol',
      render: (text, record, index) => {
        return (
          <>
            <span className="circle" style={{ backgroundColor: ANT_CHARTS_DARK.colors10[index] }} />
            <Link
              href={`/market-detail/market-page/${record.symbolAddr}`}
            >
              <a className="url-link">
                {record.symbol}
              </a>
            </Link>
          </>
        )
      },
    },
    {
      title: f(`sm${type}Price`),
      dataIndex: 'netSwapAsset',
      key: 'netSwapAsset',
      align: 'right',
      sortDirections: ['descend'],
      sorter: true,
      sortOrder:
        sortedInfo.columnKey === 'netSwapAsset' ? sortedInfo.order : undefined,
      render: (text, record) => {
        return <span>$ {Global.formatBigNum(record.netSwapAsset)}</span>
      },
    },
    {
      title: f(`sm${type}AddrNum`),
      dataIndex: 'netSwapAddrCount',
      key: 'netSwapAddrCount',
      align: 'right',
      sortDirections: ['descend'],
      sorter: true,
      sortOrder:
        sortedInfo.columnKey === 'netSwapAddrCount' ? sortedInfo.order : undefined,
      render: (text, record) => {
        return (
          <span>
            {Global.formatBigNum(record.netSwapAddrCount)}
          </span>
        )
      },
    },
    {
      title: f('smGetTotalAmount'),
      dataIndex: 'holdAsset',
      key: 'holdAsset',
      align: 'right',
      render: (text, record) => {
        return <span>$ {Global.formatBigNum(record.holdAsset)}</span>
      },
    },
    {
      title: f(`sm${type}AvgPrice`),
      dataIndex: 'netSwapAvgPrice',
      key: 'netSwapAvgPrice',
      align: 'right',
      render: (text, record) => {
        return <span>$ {Global.formatBigNum(record.netSwapAvgPrice)}</span>
      },
    },
    {
      title: ' ',
      dataIndex: 'action',
      key: 'action',
      align: 'right',
      width: 50,
      render: (text, record) => {
        return <img src="/images/detail-icon.svg" className="img-details" onClick={event => handleItemClick(event, record)} />
      }
    }
  ]

  const { pageMode } = useSelector((state: AppState) => state.userInfo);

  const pieSelected = ({ event }: Record<string, any>) => {
    if (event.type == 'element:mouseleave') {
      setActiveAdd('')
    } else {
      setActiveAdd(event.data.data.symbolAddr)
    }
  }
  const [plot, setPlot] = useState<undefined | Options>();

  useEffect(() => {
    if (typeof plot !== 'undefined') {
      plot.setState('active', (item: ColumnsItem) => {
        if (item.symbolAddr === activeAdd) {
          return true;
        } else {
          return false;
        }
      });
    }
  }, [plot, activeAdd]);

  var config = {
    width: 300,
    height: 300,
    appendPadding: 10,
    data: smTransactionRankList?.list.slice(0, 10).concat([{ rate: smTransactionRankList.others ? smTransactionRankList.others.rate : 0, number: smTransactionRankList.others ? smTransactionRankList.others.number : 0, symbol: f('smOther'), symbolAddr: '0x0000000000000000000000' }]) as ColumnsItem[],
    angleField: 'rate',
    colorField: 'symbolAddr',
    radius: 1,
    theme: pageMode === 'dark' ? ANT_CHARTS_DARK : undefined,
    innerRadius: 0.45,
    legend: false as const,
    // tooltip: false as const,
    tooltip: {
      position: 'bottom' as const,
      enterable: true,
      customContent: (title: string, data: any[]) => {
        if (data.length > 0 && (data[0].data as ColumnsItem).symbolAddr == '0x0000000000000000000000') {
          return (
            <div style={{ padding: '20px 10px', minWidth: 300 }}>
              <div style={{ padding: '10px 0' }}>
                <span>{sortedInfo.columnKey === 'netSwapAsset' ? f(`sm${type}Price`) : f(`sm${type}AddrNum`)}：</span>
                <span>$ {Global.formatBigNum((data[0].data as ColumnsItem).number)}</span>
              </div>
              <div style={{ padding: '10px 0' }}>
                <span>{f('smToken')}：</span>
                <span>{(data[0].data as ColumnsItem).symbol}</span>
              </div>
              {
                (data[0].data as ColumnsItem).symbolAddr == '0x0000000000000000000000' ?
                  <></>
                  :
                  <div style={{ padding: '10px 0' }}>
                    <span>{f('smSymbolAddr')}：</span>
                    <span>{(data[0].data as ColumnsItem).symbolAddr}</span>
                  </div>
              }
              <div style={{ padding: '10px 0' }}>
                <span>{f('smRate')}：</span>
                <span>{Global.formatNum((data[0].data as ColumnsItem).rate)}%</span>
              </div>
            </div>
          ) as unknown as string
        } else {
          return <></> as unknown as string
        }
      },
    },
    pieStyle: {
      stroke: null
    },
    color: ANT_CHARTS_DARK.colors10.concat(['#CDF3E4']),
    interactions: [
      {
        type: 'element-active',
        cfg: {
          start: [
            {
              trigger: 'element:mouseenter',
              callback(context: Record<string, any>) {
                pieSelected(context)
              },
              action: 'element-active:active',
            },
          ],
          end: [
            {
              trigger: 'element:mouseleave',
              callback(context: Record<string, any>) {
                pieSelected(context)
              },
              action: 'element-active:reset',
            },
          ],

        },
      },
    ],
    label: {
      type: 'inner',
      offset: '-50%',
      formatter: function formatter(item: Record<string, number>, mappingData: any, index: number) {
        if (item.rate < 2) {
          return '';
        } else {
          return `${item.rate}%`
        }
      },
      style: {
        textAlign: 'center',
        fontSize: 14,
        fill: '#ffffff'
      },
    },
    statistic: {
      title: false as const,
      content: {
        customHtml: function formatter() {
          if (smTransactionRankList && smTransactionRankList.list && smTransactionRankList.list.length > 0) {
            return (
              <img
                src={'/images/line-watermark.svg'}
                style={{ width: '100px' }}
              />
            ) as unknown as string
          } else {
            return <></> as unknown as string
          }
        },
      },
      // content: {
      //   customHtml: function formatter() {
      //     if (smTransactionRankList && smTransactionRankList.length > 0) {
      //       let total;
      //       if (activeAdd) {
      //         for (let item of smTransactionRankList) {
      //           if (item.symbolAddr === activeAdd) {
      //             total = `$${Global.formatBigNum(item.netSwapAsset)}`
      //             break;
      //           }
      //         }
      //       } else {
      //         total = `$${currentHoldRate ? Global.formatBigNum(currentHoldRate.data.totalHoldAsset) : ''}`;
      //       }
      //       return (
      //         <div className="center-box">
      //           <div>{total}</div>
      //           <div className="total">{f('total')}</div>
      //         </div>
      //       ) as unknown as string
      //     } else {
      //       return <></> as unknown as string
      //     }
      //   },
      // },
    },
    animation: false as const,
  }
  return (
    <>
      <div className="adapt-width-table">
        <div
          style={{ boxShadow: 'none', padding: showMore ? '0 0 20px' : 0 }}
        >
          <div className="common-table" style={{ margin: '20px 0 0' }}>
            <Table
              rowKey="symbolAddr"
              className="buy-sell-table"
              loading={smTransactionRankLoading}
              columns={columnsRow}
              dataSource={smTransactionRankList?.list.slice(0, 10)}
              onChange={handleChange}
              pagination={false}
              rowClassName={(record, index) => {
                if (record.symbolAddr == activeAdd) {
                  return 'SM-table-row-highlight'
                } else {
                  return ''
                }
              }}
              onRow={record => {
                return {
                  onMouseEnter: event => {
                    handleMouseEnter(record)
                  }, 
                  onMouseLeave: event => {
                    handleMouseLeave(record);
                  },
                };
              }}
            />
            <WaterMarkContent bottom={20} />
          </div>
          {
            smTransactionRankList && smTransactionRankList.list &&
              smTransactionRankList.list.length >= 10 ? (
              <div
                className="view-more-rank"
                onClick={(event) => {
                  Global.openNewTag(event, router, `/smart-money-detail/smart-money/${type}`)
                }}
              >
                <span>+<span className="rank-more-text">{f('smSeeMore')}</span></span>
              </div>
            ) : null
          }
        </div>
      </div>
      <div style={{ width: '300px', height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {!(smTransactionRankList && smTransactionRankList.list.length > 0) ?
          smTransactionRankLoading ?
            <div className="loading-pie">
              < Spin ></Spin>
            </div>
            :
            null
          :
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Pie
              {...config}
              fallback={
                <div className="loading-pie">
                  <Spin></Spin>
                </div>
              }
              onReady={(plot: Options) => {
                setPlot(plot);
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span>{f(`sm${type}TokenRankTitle`)}</span>
              <span>{sortedInfo.columnKey === 'netSwapAsset' ? f(`sm${type}PiePrice`) : f(`sm${type}PieAddrNum`)}</span>
            </div>
          </div>
        }
      </div>
    </>
  )
}


function DetailCom({ smTransactionRankList, smTransactionRankLoading, smTransactionRankNoMore, type, showMore, sortChange, smTransactionRankListCondition, setSmTransactionRankListCondition }: TablePaops) {
  const { formatMessage } = useIntl()
  const f = (id: string) => formatMessage({ id })
  const dispatch = useDispatch()

  const scrollTop = () => {
    const element = document.getElementsByClassName('currency-addr-rank-scroll')[0] as unknown as HTMLElement;
    element.scrollTop = 0;
  }
  const [sortedInfo, setSortedInfo] = useState<SorterResult<ColumnsItem>>({ columnKey: 'netSwapAsset', order: "descend" })
  const handleChange = (pagination: TablePaginationConfig, filters: Record<string, (Key | boolean)[] | null>, sorter: SorterResult<ColumnsItem> | SorterResult<ColumnsItem>[], extra: TableCurrentDataSource<ColumnsItem>) => {
    scrollTop();
    if (!Array.isArray(sorter)) {
      if (sortedInfo.columnKey == sorter.columnKey) {
        if (sorter.columnKey == 'netSwapAsset') {
          sorter = { ...sorter, columnKey: 'netSwapAddrCount', field: 'netSwapAddrCount', order: "descend" }
        } else {
          sorter = { ...sorter, columnKey: 'netSwapAsset', field: 'netSwapAsset', order: "descend" }
        }
      }
      setSortedInfo(sorter)
      sortChange(sorter as SorterResult<ColumnsItem>)
    }
  }

  const router = useRouter()
  const handleItemClick = (event: any, record: ColumnsItem) => {
    const url = `/smart-money-info/smart-money/${record.symbolAddr}`;
    Global.openNewTag(event, router, url)
  }
  const columnsRow: ColumnType<ColumnsItem>[] = [
    {
      title: f('smToken'),
      dataIndex: 'symbol',
      key: 'symbol',
      render: (text: any, record: ColumnsItem) => {
        return (
          <Link
            href={`/market-detail/market-page/${record.symbolAddr}`}
          >
            <a className="url-link">
              {record.symbol}
            </a>
          </Link>
        )
      },
    },
    {
      title: f(`sm${type}Price`),
      dataIndex: 'netSwapAsset',
      key: 'netSwapAsset',
      align: 'right',
      sortDirections: ['descend'],
      sorter: true,
      sortOrder:
        sortedInfo.columnKey === 'netSwapAsset' ? sortedInfo.order : undefined,
      render: (text, record) => {
        return <span>$ {Global.formatBigNum(record.netSwapAsset)}</span>
      },
    },
    {
      title: f(`sm${type}AddrNum`),
      dataIndex: 'netSwapAddrCount',
      key: 'netSwapAddrCount',
      align: 'right',
      sortDirections: ['descend'],
      sorter: true,
      sortOrder:
        sortedInfo.columnKey === 'netSwapAddrCount' ? sortedInfo.order : undefined,
      render: (text, record) => {
        return (
          <span>
            {Global.formatBigNum(record.netSwapAddrCount)}
          </span>
        )
      },
    },
    {
      title: f('smGetTotalAmount'),
      dataIndex: 'holdAsset',
      key: 'holdAsset',
      align: 'right',
      render: (text, record) => {
        return <span>$ {Global.formatBigNum(record.holdAsset)}</span>
      },
    },
    {
      title: f(`sm${type}AvgPrice`),
      dataIndex: 'netSwapAvgPrice',
      key: 'netSwapAvgPrice',
      align: 'right',
      render: (text, record) => {
        return <span>$ {Global.formatBigNum(record.netSwapAvgPrice)}</span>
      },
    }, 
    {
      title: ' ',
      dataIndex: 'action',
      key: 'action',
      align: 'right',
      width: 50,
      render: (text, record) => {
        return <img src="/images/detail-icon.svg" className="img-details" onClick={event => handleItemClick(event, record)} />
      }
    }, 
  ]

  const smTransactionRankScroll = () => {
    const fatherHeight = (document.getElementsByClassName('currency-addr-rank-scroll')[0] as HTMLDivElement).offsetHeight
    const bodyHeight = (document.getElementsByClassName('ant-table-wrapper')[0] as HTMLDivElement).offsetHeight
    const bodyTop = (document.getElementsByClassName('currency-addr-rank-scroll')[0] as HTMLDivElement).scrollTop
    const dom = (document.querySelector('.currency-addr-rank-scroll .ant-spin') as HTMLDivElement)

    if (dom) {
      dom.style.top = `${bodyTop}px`
    }
    if (bodyHeight - bodyTop < fatherHeight + 100) {
      if (bodyTop != 0 && smTransactionRankLoading === false) {
        if (dataMore && dataMore.list && dataMore.list.length > 0 && !smTransactionRankLoading && !smTransactionRankNoMore) {
          if (dom) {
            dom.style.top = `${bodyTop}px`
          }
          getMoreData();
        }
      }
    }
  }
  useEffect(() => {
    if (smTransactionRankLoading) {
      setTimeout(() => {
        const bodyTop = (document.getElementsByClassName('currency-addr-rank-scroll')[0] as HTMLDivElement).scrollTop
        const dom = (document.querySelector('.currency-addr-rank-scroll .ant-spin') as HTMLDivElement)
        if (dom) {
          dom.style.top = `${bodyTop}px`
        }
      }, 100);
    }
  }, [smTransactionRankLoading])
  const getMoreData = async () => {
    type == 'Buy' ? dispatch(smTransactionBuyListLoading(true)) : dispatch(smTransactionSellListLoading(true))
    try {
      const apiClient = new ApiClient<SMRankListResponse>()
      const data = await apiClient.post(
        `/smart/money/swap/netBuy/${type == 'Buy' ? 'in' : 'out'}`,
        {
          data: {
            addressType: smTransactionRankListCondition?.addressType,
            dateType: smTransactionRankListCondition?.dateType,// 30d, 7d, 3d, 24h, 4h    
            sortField: smTransactionRankListCondition?.sortField,
            sortType: smTransactionRankListCondition?.sortType,
            pageSize: smTransactionRankListCondition?.pageSize,
            pageNo: smTransactionRankListCondition?.pageNo as number + 1,
          }
        }
      )
      if (data.data.list && data.data.list.length > 0) {
        const arr = dataMore?.list.concat(data.data.list)
        setDataMore({ ...data.data, list: arr as ColumnsItem[] })
        setSmTransactionRankListCondition({
          ...smTransactionRankListCondition as SMTransactionRankListParams,
          pageNo: smTransactionRankListCondition?.pageNo as number + 1,
        })
        if (data.data.list.length < 100) {
          type == 'Buy' ? dispatch(smTransactionBuyListNoMore(true)) : dispatch(smTransactionSellListNoMore(true))
        }
        type == 'Buy' ? dispatch(smTransactionBuyListLoading(false)) : dispatch(smTransactionSellListLoading(false))
      } else {
        
        type == 'Buy' ? dispatch(smTransactionBuyListNoMore(true)) : dispatch(smTransactionSellListNoMore(true))
        type == 'Buy' ? dispatch(smTransactionBuyListLoading(true)) : dispatch(smTransactionSellListLoading(true))
      }
    } catch (e) {
      type == 'Buy' ? dispatch(smTransactionBuyListLoading(false)) : dispatch(smTransactionSellListLoading(false))
    }
  }
  const [dataMore, setDataMore] = useState<SMRankListResponse>()
  useEffect(() => {
    setDataMore(smTransactionRankList as SMRankListResponse)
  }, [smTransactionRankList])
  return (
    <div
      style={{ boxShadow: 'none', padding: showMore ? '0 0 20px' : 0, marginTop: 30, position: 'relative' }}
    >
      <WaterMarkContent />
      <div className="currency-addr-rank-scroll" style={{
        position: 'relative', height: window.innerHeight < 850
          ? window.innerHeight - 180
          : window.innerHeight - 250, overflow: 'auto'
      }} onScroll={smTransactionRankScroll}>
        <Table
          rowKey="symbolAddr"
          className="buy-sell-table"
          loading={smTransactionRankLoading}
          columns={columnsRow}
          dataSource={smTransactionRankListCondition?.pageNo == 1 ? smTransactionRankList?.list : dataMore?.list}
          onChange={handleChange}
          pagination={false}
          sticky
        />
        <BackTop target={() => {
          return document.getElementsByClassName('currency-addr-rank-scroll')[0] as unknown as HTMLElement
        }}>
          <div style={{
            height: 40,
            width: 40,
            borderRadius: 4,
            backgroundColor: 'rgba(16, 136, 233, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}><UpCircleOutlined style={{ fontSize: 27 }} /></div>
        </BackTop>
      </div>
      {!smTransactionRankLoading && smTransactionRankNoMore && (smTransactionRankList && smTransactionRankList.list &&
        smTransactionRankList.list.length > 0) ? (
        <div className="btnBox">
          <Divider className="no-more">
            {f('noMore')}
          </Divider>
        </div>
      ) : null}
    </div>
  )
}
