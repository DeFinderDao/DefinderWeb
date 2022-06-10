import { BackTop, Divider, Radio, RadioChangeEvent, Spin, Table, Tooltip } from "antd";
import { useIntl } from "react-intl";
import { UpCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { Key, useEffect, useState } from "react";
import { ColumnType } from "antd/lib/table";
import Global from "utils/Global";
import { SorterResult, TableCurrentDataSource, TablePaginationConfig } from "antd/lib/table/interface";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "redux/reducers";
import React from "react";
import { ANT_CHARTS_DARK } from "utils/env";
import loadable from '@loadable/component'
import { getSMHOTRankList, smHOTListLoading, smHOTListNoMore } from "redux/actions/SmartMoney/TransferData/HotContractAddRankAction";
import { useRouter } from "next/router";
import TimeChoose from "components/MarketComponents/TimeChoose";
import { Options } from "@ant-design/plots/lib/hooks/useChart";
import { ColumnsItem, SMHOTRankListParams, SMHOTRankListResponse } from "redux/types/SmartMoney/TransferData/HotContractAddRankTypes";
import ApiClient from "utils/ApiClient";
import { TokenLogo } from "components/TokenLogo";
import AddressTypeDropdown from "../AddressTypeDropdown";
import { changeAddressType } from "redux/actions/SmartMoneyAction";
const Pie = loadable(() => import('@ant-design/plots/lib/components/pie'))
import GlobalLabel from "components/GlobalLabel";
import Link from "next/link";
import WaterMarkContent from "components/WaterMarkContent";

interface HotContractAddRankProps {
  // addressType: string,
  showMore: boolean
}
export default function HotContractAddRank({ showMore }: HotContractAddRankProps) {
  const { formatMessage } = useIntl()
  const f = (id: string) => formatMessage({ id })
  const dispatch = useDispatch()

  const { addressType } = useSelector((state: AppState) => state.smartMoneyReducer);
  const { level } = useSelector((state: AppState) => state.userInfo);

  const pageSize = showMore || level == 0 ? 10 : 100
  const [HOTRankListCondition, setHOTRankListCondition] =
    useState<SMHOTRankListParams>({
      addressType: addressType,
      dateType: '2',
      sortField: 'asset',
      sortType: '0', // 1 asc  ; 0 desc
      pageNo: 1,
      pageSize: pageSize,
    })
  const dispatchType = (arr: SMHOTRankListParams) => {
    dispatch(
      getSMHOTRankList(arr)
    )
  }
  useEffect(() => {
    setHOTRankListCondition({
      ...HOTRankListCondition,
      addressType: addressType,
      pageSize: pageSize,
      pageNo: 1,
    })
    dispatchType({
      ...HOTRankListCondition,
      addressType: addressType,
      pageSize: pageSize,
      pageNo: 1,
    })
  }, [addressType])

  const [radioType, setRadioType] = useState('2')
  const radioChange = (e: RadioChangeEvent) => {
    setRadioType(e.target.value)
    setHOTRankListCondition({
      ...HOTRankListCondition,
      dateType: e.target.value,
      pageSize: pageSize,
      pageNo: 1,
    })
    dispatchType({
      ...HOTRankListCondition,
      dateType: e.target.value,
      pageSize: pageSize,
      pageNo: 1,
    })
  }
  const HOTLoading = useSelector(
    (state: AppState) => state.HotContractAddRankReducer.HOTLoading
  )
  const HOTRankList = useSelector(
    (state: AppState) => state.HotContractAddRankReducer.HOTRankList
  )
  const HOTNoMore = useSelector(
    (state: AppState) => state.HotContractAddRankReducer.HOTNoMore
  )
  const sortChange = (sorter: SorterResult<ColumnsItem>) => {
    setHOTRankListCondition({
      ...HOTRankListCondition,
      sortField: sorter.columnKey as string,
      pageSize: pageSize,
      pageNo: 1,
    })
    dispatchType({
      ...HOTRankListCondition,
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
                  {f("smContractAddrRankTitle")}
                  <Tooltip
                    placement="right"
                    title={<div>{f(`smContractAddrRankTips`)}</div>}
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
              <ShowMoreCom
                HOTRankList={HOTRankList}
                HOTLoading={HOTLoading}
                HOTNoMore={HOTNoMore}
                showMore={showMore}
                sortChange={(sorter) => { sortChange(sorter) }}
                HOTRankListCondition={HOTRankListCondition}
                setHOTRankListCondition={setHOTRankListCondition} />
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
                  setHOTRankListCondition({
                    ...HOTRankListCondition,
                    dateType: e.target.value,
                    pageSize: pageSize,
                    pageNo: 1,
                  })
                  dispatchType({
                    ...HOTRankListCondition,
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
            <DetailCom
              HOTRankList={HOTRankList}
              HOTLoading={HOTLoading}
              HOTNoMore={HOTNoMore}
              showMore={showMore}
              sortChange={(sorter) => { sortChange(sorter) }}
              HOTRankListCondition={HOTRankListCondition}
              setHOTRankListCondition={setHOTRankListCondition} />
          </div>
      }
    </>
  )
}

interface TablePaops {
  HOTRankList: SMHOTRankListResponse | null,
  HOTLoading: boolean,
  HOTNoMore: boolean,
  showMore: boolean,
  sortChange: (sorter: SorterResult<ColumnsItem>) => void,
  HOTRankListCondition: SMHOTRankListParams,
  setHOTRankListCondition: React.Dispatch<React.SetStateAction<SMHOTRankListParams>>,
}

function ShowMoreCom({ HOTRankList, HOTLoading, HOTNoMore, showMore, sortChange }: TablePaops) {
  const { formatMessage } = useIntl()
  const f = (id: string) => formatMessage({ id })
  const router = useRouter()

  const [sortedInfo, setSortedInfo] = useState<SorterResult<ColumnsItem>>({ columnKey: 'asset', order: "descend" })
  const handleChange = (pagination: TablePaginationConfig, filters: Record<string, (Key | boolean)[] | null>, sorter: SorterResult<ColumnsItem> | SorterResult<ColumnsItem>[], extra: TableCurrentDataSource<ColumnsItem>) => {
    if (!Array.isArray(sorter)) {
      if (sortedInfo.columnKey == sorter.columnKey) {
        if (sorter.columnKey == 'asset') {
          sorter = { ...sorter, columnKey: 'addressCount', field: 'addressCount', order: "descend" }
        } else if (sorter.columnKey == 'addressCount') {
          sorter = { ...sorter, columnKey: 'count', field: 'count', order: "descend" }
        } else {
          sorter = { ...sorter, columnKey: 'asset', field: 'asset', order: "descend" }
        }
      }
      setSortedInfo(sorter)
      sortChange(sorter as SorterResult<ColumnsItem>)
    }
  }

  const [activeAdd, setActiveAdd] = useState('')
  const handleMouseEnter = (data: ColumnsItem) => {
    (setActiveAdd as React.Dispatch<React.SetStateAction<string>>)(data.contractAddr);
  }
  const handleMouseLeave = (data: ColumnsItem) => {
    (setActiveAdd as React.Dispatch<React.SetStateAction<string>>)('');
  }
  const columnsRow: ColumnType<ColumnsItem>[] = [
    {
      title: f('smContractAddr'),
      dataIndex: 'contractAddr',
      key: 'contractAddr',
      width: 220,
      render: (text, record, index) => {
        return (
          <Link href={`/address-analyse/${record.contractAddr}`} >
            <a className="url-link">
              <span className="circle" style={{ backgroundColor: ANT_CHARTS_DARK.colors10[index] }} />
              <TokenLogo
                className="contect-logo"
                src={record.logo}
                alt=''
              />
              {
                record.contractName ?
                  <span>{record.contractName}</span>
                  :
                  <GlobalLabel addr={record.contractAddr} label={record.contractAddrLabel} />
              }
            </a>
          </Link>
        )
      },
    },
    {
      title: f(`smAsset`),
      dataIndex: 'asset',
      key: 'asset',
      align: 'right',
      sortDirections: ['descend'],
      sorter: true,
      sortOrder:
        sortedInfo.columnKey === 'asset' ? sortedInfo.order : undefined,
      render: (text, record) => {
        return <span>$ {Global.formatBigNum(record.asset)}</span>
      },
    },
    {
      title: f(`smAddressCount`),
      dataIndex: 'addressCount',
      key: 'addressCount',
      align: 'right',
      sortDirections: ['descend'],
      sorter: true,
      sortOrder:
        sortedInfo.columnKey === 'addressCount' ? sortedInfo.order : undefined,
      render: (text, record) => {
        return (
          <span>
            {Global.formatBigNum(record.addressCount)}
          </span>
        )
      },
    },
    {
      title: f('smCount'),
      dataIndex: 'count',
      key: 'count',
      align: 'right',
      sortDirections: ['descend'],
      sorter: true,
      sortOrder:
        sortedInfo.columnKey === 'count' ? sortedInfo.order : undefined,
      render: (text, record) => {
        return <span>{Global.formatBigNum(record.count)}</span>
      },
    },
    {
      title: f(`smContractAsset`),
      dataIndex: 'contractAsset',
      key: 'contractAsset',
      align: 'right',
      render: (text, record) => {
        return <span>$ {Global.formatBigNum(record.contractAsset)}</span>
      },
    },
  ]

  const { pageMode } = useSelector((state: AppState) => state.userInfo);

  const pieSelected = ({ event }: Record<string, any>) => {
    if (event.type == 'element:mouseleave') {
      setActiveAdd('')
    } else {
      setActiveAdd(event.data.data.contractAddr)
    }
  }
  const [plot, setPlot] = useState<undefined | Options>();

  useEffect(() => {
    if (typeof plot !== 'undefined') {
      plot.setState('active', (item: ColumnsItem) => {
        if (item.contractAddr === activeAdd) {
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
    data: HOTRankList?.list.slice(0, 10) as unknown as ColumnsItem[],
    angleField: 'top10Rate',
    colorField: 'contractAddr',
    radius: 1,
    theme: pageMode === 'dark' ? ANT_CHARTS_DARK : undefined,
    innerRadius: 0.45,
    legend: false as const,
    tooltip: false as const,
    pieStyle: {
      stroke: null
    },
    color: ANT_CHARTS_DARK.colors10,
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
        if (item.top10Rate < 2) {
          return '';
        } else {
          return `${item.top10Rate}%`
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
          if (HOTRankList && HOTRankList.list && HOTRankList.list.length > 0) {
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
      //     if (HOTRankList && HOTRankList.length > 0) {
      //       let total;
      //       if (activeAdd) {
      //         for (let item of HOTRankList) {
      //           if (item.contractAddr === activeAdd) {
      //             total = `$${Global.formatBigNum(item.asset)}`
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
              rowKey="contractAddr"
              className="buy-sell-table"
              loading={HOTLoading}
              columns={columnsRow}
              dataSource={HOTRankList?.list.slice(0, 10) as unknown as ColumnsItem[]}
              onChange={handleChange}
              pagination={false}
              rowClassName={(record, index) => {
                if (record.contractAddr == activeAdd) {
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
            <WaterMarkContent bottom={25} />
          </div>
          {
            HOTRankList && HOTRankList.list &&
              HOTRankList.list.length >= 10 ? (
              <div
                className="view-more-rank"
                onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
                  Global.openNewTag(e,router,'/smart-money-detail/smart-money/Hot');
                }}
              >
                <span>+<span className="rank-more-text">{f('smSeeMore')}</span></span>
              </div>
            ) : null
          }
        </div>
      </div>
      <div style={{ width: '300px', height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {!(HOTRankList && HOTRankList.list.length > 0) ?
          HOTLoading ?
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
              <span>{f(`smContractAddrRankTitleTop10`)}</span>
              <span>{sortedInfo.columnKey === 'asset' ? f(`smContractAddrRankAssetTitle`) : sortedInfo.columnKey === 'addressCount' ? f(`smContractAddrRankAddressCountTitle`) : f(`smContractAddrRankCountTitle`)}</span>
            </div>
          </div>
        }
      </div>
    </>
  )
}


function DetailCom({ HOTRankList, HOTLoading, HOTNoMore, showMore, sortChange, HOTRankListCondition, setHOTRankListCondition }: TablePaops) {
  const { formatMessage } = useIntl()
  const f = (id: string) => formatMessage({ id })
  const dispatch = useDispatch()
  const router = useRouter()

  const scrollTop = () => {
    const element = document.getElementsByClassName('currency-addr-rank-scroll')[0] as unknown as HTMLElement;
    element.scrollTop = 0;
  }
  const [sortedInfo, setSortedInfo] = useState<SorterResult<ColumnsItem>>({ columnKey: 'asset', order: "descend" })
  const handleChange = (pagination: TablePaginationConfig, filters: Record<string, (Key | boolean)[] | null>, sorter: SorterResult<ColumnsItem> | SorterResult<ColumnsItem>[], extra: TableCurrentDataSource<ColumnsItem>) => {
    scrollTop();
    if (!Array.isArray(sorter)) {
      if (sortedInfo.columnKey == sorter.columnKey) {
        if (sorter.columnKey == 'asset') {
          sorter = { ...sorter, columnKey: 'addressCount', field: 'addressCount', order: "descend" }
        } else if (sorter.columnKey == 'addressCount') {
          sorter = { ...sorter, columnKey: 'count', field: 'count', order: "descend" }
        } else {
          sorter = { ...sorter, columnKey: 'asset', field: 'asset', order: "descend" }
        }
      }
      setSortedInfo(sorter)
      sortChange(sorter as SorterResult<ColumnsItem>)
    }
  }

  const columnsRow: ColumnType<ColumnsItem>[] = [
    {
      title: f('smContractAddr'),
      dataIndex: 'contractAddr',
      key: 'contractAddr',
      render: (text, record) => {
        return (
          <Link href={`/address-analyse/${record.contractAddr}`} >
            <a className="url-link">
              <TokenLogo
                className="contect-logo"
                src={record.logo}
                alt=''
              />
              {
                record.contractName ?
                  <span>{record.contractName}</span>
                  :
                  <GlobalLabel addr={record.contractAddr} label={record.contractAddrLabel} />
              }
            </a>
          </Link>
        )
      },
    },
    {
      title: f(`smAsset`),
      dataIndex: 'asset',
      key: 'asset',
      align: 'right',
      sortDirections: ['descend'],
      sorter: true,
      sortOrder:
        sortedInfo.columnKey === 'asset' ? sortedInfo.order : undefined,
      render: (text, record) => {
        return <span>$ {Global.formatBigNum(record.asset)}</span>
      },
    },
    {
      title: f(`smAddressCount`),
      dataIndex: 'addressCount',
      key: 'addressCount',
      align: 'right',
      sortDirections: ['descend'],
      sorter: true,
      sortOrder:
        sortedInfo.columnKey === 'addressCount' ? sortedInfo.order : undefined,
      render: (text, record) => {
        return (
          <span>
            {Global.formatBigNum(record.addressCount)}
          </span>
        )
      },
    },
    {
      title: f('smCount'),
      dataIndex: 'count',
      key: 'count',
      align: 'right',
      sortDirections: ['descend'],
      sorter: true,
      sortOrder:
        sortedInfo.columnKey === 'count' ? sortedInfo.order : undefined,
      render: (text, record) => {
        return <span>{Global.formatBigNum(record.count)}</span>
      },
    },
    {
      title: f(`smContractAsset`),
      dataIndex: 'contractAsset',
      key: 'contractAsset',
      align: 'right',
      render: (text, record) => {
        return <span>$ {Global.formatBigNum(record.contractAsset)}</span>
      },
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
      if (bodyTop != 0 && HOTLoading === false) {
        if (dataMore && dataMore.list && dataMore.list.length > 0 && !HOTLoading && !HOTNoMore) {
          if (dom) {
            dom.style.top = `${bodyTop}px`
          }
          getMoreData();
        }
      }
    }
  }
  useEffect(() => {
    if (HOTLoading) {
      setTimeout(() => {
        const bodyTop = (document.getElementsByClassName('currency-addr-rank-scroll')[0] as HTMLDivElement).scrollTop
        const dom = (document.querySelector('.currency-addr-rank-scroll .ant-spin') as HTMLDivElement)
        if (dom) {
          dom.style.top = `${bodyTop}px`
        }
      }, 100);
    }
  }, [HOTLoading])
  const getMoreData = async () => {
    dispatch(smHOTListLoading(true))
    try {
      const apiClient = new ApiClient<SMHOTRankListResponse>()
      const data = await apiClient.post(
        `/smart/money/transfer/hot/contract/rank`,
        {
          data: {
            addressType: HOTRankListCondition?.addressType, 
            dateType: HOTRankListCondition?.dateType,// 30d, 7d, 3d, 24h, 4h    
            sortField: HOTRankListCondition?.sortField,
            sortType: HOTRankListCondition?.sortType,
            pageSize: HOTRankListCondition?.pageSize,
            pageNo: HOTRankListCondition?.pageNo as number + 1,
          }
        }
      )
      if (data.data.list && data.data.list.length > 0) {
        const arr = dataMore?.list.concat(data.data.list)
        setDataMore({ ...data.data, list: arr as ColumnsItem[] })
        setHOTRankListCondition({
          ...HOTRankListCondition as SMHOTRankListParams,
          pageNo: HOTRankListCondition?.pageNo as number + 1,
        })
        if (data.data.list.length < 100) {
          dispatch(smHOTListNoMore(true))
        }
        dispatch(smHOTListLoading(false))
      } else {
        dispatch(smHOTListNoMore(true))
        dispatch(smHOTListLoading(false))
      }
    } catch (e) {
      dispatch(smHOTListLoading(false))
    }
  }
  const [dataMore, setDataMore] = useState<SMHOTRankListResponse>()
  useEffect(() => {
    setDataMore(HOTRankList as SMHOTRankListResponse)
  }, [HOTRankList])
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
          rowKey="contractAddr"
          className="buy-sell-table"
          loading={HOTLoading}
          columns={columnsRow}
          dataSource={HOTRankListCondition?.pageNo == 1 ? HOTRankList?.list : dataMore?.list}
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
      {!HOTLoading && HOTNoMore && (HOTRankList && HOTRankList.list &&
        HOTRankList.list.length > 0) ? (
        <div className="btnBox">
          <Divider className="no-more">
            {f('noMore')}
          </Divider>
        </div>
      ) : null}
    </div>
  )
}
