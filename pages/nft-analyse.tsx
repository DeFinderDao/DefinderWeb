import { Key, useEffect, useRef, useState } from "react"
import { Button, Col, Divider, InputNumber, Menu, message, Modal, Row, Spin, Table, Tooltip } from "antd"
import { FilterFilled, QuestionCircleOutlined } from '@ant-design/icons'
import type { MenuInfo } from 'rc-menu/lib/interface'
import type { CustomizeScrollBody } from 'rc-table/lib/interface';
import { useIntl } from "react-intl"
import { useDispatch, useSelector } from "react-redux"
import { editAllList, editOptionalList, getNFTAnalyseAllList, getNFTAnalyseOptionalList, nftAnalysePaginationAllInfo, nftAnalysePaginationOptionalInfo, setAllListLoading, setOptionalListLoading, getNFTAnalyseAllRefreshList, getNFTAnalyseOptionalRefreshList, nftAnalyseFilterFilled, nftAnalyseMenuType } from "redux/actions/NFTAnalyseAction"
import { AppState } from "redux/reducers"
import { FilterFilledList, NFTAnalyseDataList, paginationOptionalList, ResponseBodyList, TrendListItem } from "redux/types/NFTAnalyseTypes"
import 'styles/nft-analyse.less'
import { DefaultLocale } from "utils/env"
import { NextRouter, useRouter } from "next/router"
import { SubscriptionMarketPageModal } from "components/Subscription/marketPageModal"
import moment from "moment"
import { trackAction, trackPage, NFT_ANALYSE } from 'utils/analyse/YMAnalyse'
import { TokenLogo } from "components/TokenLogo"
import { VariableSizeGrid } from "react-window"
import ResizeObserver from 'rc-resize-observer'
import { ColumnType, SorterResult, TablePaginationConfig } from "antd/lib/table/interface"
import Global from "utils/Global"
import { PrimitiveType, FormatXMLElementFn } from "intl-messageformat"
import NoLogin from "components/NoLogin"
import { showWalletDialog } from "redux/actions/UserInfoAction"
import ApiClient from "utils/ApiClient"
import { CODE_SUCCESS } from "utils/ApiServerError"
import type { Response } from 'redux/types';
import loadable from '@loadable/component';
const Line = loadable(() => import('@ant-design/plots/lib/components/line'));

const MENU_TYPE_ALL = 'nftAll';
const MENU_TYPE_OPTIONAL = 'nftOptional';

export default function NFTAnalyse() {
  useEffect(() => {
    trackPage(NFT_ANALYSE.url)
  }, [])
  
  const { formatMessage } = useIntl()
  const f = (id: string) => formatMessage({ id })
  const dispatch = useDispatch()
  const apiClient = new ApiClient()
  const router = useRouter()
  const { locale = DefaultLocale }: NextRouter = router;

  const { address, level } = useSelector((state: AppState) => state.userInfo)
  const menuType = useSelector((state: AppState) => state.NFTAnalyseReducer.menuType)
  const allListLoading = useSelector((state: AppState) => state.NFTAnalyseReducer.allListLoading)
  const nftAllList = useSelector((state: AppState) => state.NFTAnalyseReducer.nftAllList)
  const paginationAllInfo = useSelector((state: AppState) => state.NFTAnalyseReducer.paginationAllInfo)
  const optionalListLoading = useSelector((state: AppState) => state.NFTAnalyseReducer.optionalListLoading)
  const nftOptionalList = useSelector((state: AppState) => state.NFTAnalyseReducer.nftOptionalList)
  const paginationOptionalInfo = useSelector((state: AppState) => state.NFTAnalyseReducer.paginationOptionalInfo)
  const filterFilled = useSelector((state: AppState) => state.NFTAnalyseReducer.filterFilled)

  const dispatchRefreshList = (type: string, pagination: paginationOptionalList, filter: FilterFilledList, connot: boolean) => {
    if (type == 'all') {
      if (!connot) {
        dispatch(
          nftAnalysePaginationAllInfo({
            ...pagination,
          })
        )
      }
      dispatch(
        getNFTAnalyseAllRefreshList({
          ...pagination,
          ...filter
        }, level)
      )
    } else {
      if (!connot) {
        dispatch(
          nftAnalysePaginationOptionalInfo({
            ...pagination,
          })
        )
      }
      dispatch(
        getNFTAnalyseOptionalRefreshList({
          ...pagination,
          ...filter
        }, level)
      )
    }
  }

  const dispatchList = (type: string, pagination: paginationOptionalList, filter: FilterFilledList, connot: boolean) => {
    if (type == 'all') {
      if (!connot) {
        dispatch(
          nftAnalysePaginationAllInfo({
            ...pagination,
          })
        )
      }
      dispatch(
        getNFTAnalyseAllList({
          ...pagination,
          ...filter
        }, level)
      )
    } else {
      if (!connot) {
        dispatch(
          nftAnalysePaginationOptionalInfo({
            ...pagination,
          })
        )
      }
      dispatch(
        getNFTAnalyseOptionalList({
          ...pagination,
          ...filter
        }, level)
      )
    }
  }
  useEffect(() => {
    if (address) {
      dispatchRefreshList('optional', {
        ...paginationOptionalInfo,
        pageNo: 1,
        pageSize: paginationOptionalInfo.pageNo * paginationOptionalInfo.pageSize,
      }, filterFilled, true)
    }
    dispatchRefreshList('all', {
      ...paginationAllInfo,
      pageNo: 1,
      pageSize: paginationAllInfo.pageNo * paginationAllInfo.pageSize,
    }, filterFilled, true)
  }, [address])
  // useEffect(() => {
  //   if (nftAllList.list.length <= 0) {
  //     dispatchRefreshList('all', {
  //       ...paginationAllInfo,
  //       pageNo: 1,
  //       pageSize: paginationAllInfo.pageNo * paginationAllInfo.pageSize,
  //     }, filterFilled)
  //   }
  // }, [nftAllList.list.length])
  useEffect(() => {
    if (menuType == '') {
      if (nftOptionalList.list.length > 0) {
        setCurrent(MENU_TYPE_OPTIONAL)
        dispatch(nftAnalyseMenuType(MENU_TYPE_OPTIONAL))
      } else {
        setCurrent(MENU_TYPE_ALL)
      }
    }
  }, [nftOptionalList.list.length])

  const [current, setCurrent] = useState(MENU_TYPE_ALL)
  const [isModalVisible, setIsModalVisible] = useState(false);
  const labelSpan = locale == 'zh' ? 8 : 8
  const itemSpan = locale == 'zh' ? 16 : 16
  const [searchMenuColor, setSearchMenuColor] = useState(false)
  const [query, setQuery] = useState(filterFilled)
  useEffect(() => {
    if (query.minMarketValue || query.minTradingVolume24H || query.minTradingVolume7d || query.minHoldAddressCount) {
      setSearchMenuColor(true)
    } else {
      setSearchMenuColor(false)
    }
  }, [query])
  const menuClick = (e: MenuInfo) => {
    if (e.key == 'SearchMenu') {
      setIsModalVisible(true)
      return
    }
    setCurrent(e.key as string)
    if (e.key == MENU_TYPE_OPTIONAL) {
      if (address) {
        dispatchRefreshList('optional', {
          ...paginationOptionalInfo,
          pageNo: 1,
          pageSize: paginationOptionalInfo.pageNo * paginationOptionalInfo.pageSize,
        }, filterFilled, true)
      }
    }
  }
  const handleCancel = () => {
    setIsModalVisible(false)
    getDataList({
      pageNo: 1,
      pageSize: 20,
      sortFiled: '',
      sort: '',
      minMarketValue: null,
      minTradingVolume24H: null,
      minTradingVolume7d: null,
      minHoldAddressCount: null,
    })
  }
  const handleOk = () => {
    setIsModalVisible(false)
    getDataList({
      pageNo: 1,
      pageSize: 20,
      sortFiled: '',
      sort: '',
      ...query
    })
    dispatch(
      nftAnalyseFilterFilled({
        ...query
      })
    )
  }
  const getDataList = (info: paginationOptionalList & FilterFilledList) => {
    if (document.getElementsByClassName('virtual-grid').length > 1) {
      document.getElementsByClassName('virtual-grid')[0].scrollTop = 0
      document.getElementsByClassName('virtual-grid')[1].scrollTop = 0
    } else if (document.getElementsByClassName('virtual-grid').length == 1) {
      document.getElementsByClassName('virtual-grid')[0].scrollTop = 0
    }
    const pagination = {
      pageNo: info.pageNo,
      pageSize: info.pageSize,
      sortFiled: info.sortFiled,
      sort: info.sort,
    }
    const filter = {
      minMarketValue: info.minMarketValue,
      minTradingVolume24H: info.minTradingVolume24H,
      minTradingVolume7d: info.minTradingVolume7d,
      minHoldAddressCount: info.minHoldAddressCount,
    }
    setQuery(filter)
    dispatchRefreshList('optional', pagination, filter, false)
    dispatchRefreshList('all', pagination, filter, false)
    setLoading(true)
  }

  const handleInfiniteOnLoad = (top: number) => {
    if (top == 0) {
      return
    }
    if (current == MENU_TYPE_OPTIONAL) {
      let optationPH = (document.getElementsByClassName('virtual-grid')[0] as HTMLDivElement).offsetHeight
      let optationCH = (document.getElementsByClassName('virtual-grid')[0].children[0] as HTMLDivElement).offsetHeight
      
      if (top + optationPH > optationCH - 10) {
        if (nftOptionalList.totalSize > nftOptionalList.list.length) {
          dispatchList('optional', {
            ...paginationOptionalInfo,
            pageNo: paginationOptionalInfo.pageNo + 1,
            pageSize: paginationOptionalInfo.pageSize,
          }, filterFilled, false)
        }
      }
    } else {
      let alllPH = document.getElementsByClassName('virtual-grid').length > 1
        ? (document.getElementsByClassName('virtual-grid')[1] as HTMLDivElement).offsetHeight
        : (document.getElementsByClassName('virtual-grid')[0] as HTMLDivElement).offsetHeight
      let alllCH = document.getElementsByClassName('virtual-grid').length > 1
        ? (document.getElementsByClassName('virtual-grid')[1].children[0] as HTMLDivElement).offsetHeight
        : (document.getElementsByClassName('virtual-grid')[0].children[0] as HTMLDivElement).offsetHeight
      
      if (top + alllPH > alllCH - 10) {
        if (nftAllList.totalSize > nftAllList.list.length) {
          dispatchList('all', {
            ...paginationAllInfo,
            pageNo: paginationAllInfo.pageNo + 1,
            pageSize: paginationAllInfo.pageSize,
          }, filterFilled, false)
        }
      }
    }
  }
  const tableSorterClick = (sorter: SorterResult<NFTAnalyseDataList> | SorterResult<NFTAnalyseDataList>[]) => {
    if (!Array.isArray(sorter)) {
      const sortList = sorter.order ? {
        sortFiled: sorter.field as string,
        sort: sorter.order == 'ascend' ? 1 : 0,
      } : {
        sortFiled: '',
        sort: '',
      }
      setLoading(true)
      if (current == MENU_TYPE_OPTIONAL) {
        document.getElementsByClassName('virtual-grid')[0].scrollTop = 0
        dispatchRefreshList('optional', {
          pageNo: 1,
          pageSize: paginationOptionalInfo.pageSize,
          ...sortList,
        }, filterFilled, false)
      } else {
        if (document.getElementsByClassName('virtual-grid').length > 1) {
          document.getElementsByClassName('virtual-grid')[1].scrollTop = 0
        } else {
          document.getElementsByClassName('virtual-grid')[0].scrollTop = 0
        }
        dispatchRefreshList('all', {
          pageNo: 1,
          pageSize: paginationAllInfo.pageSize,
          ...sortList,
        }, filterFilled, false)
      }
    }
  }
  
  const [starLoading, setStarLoading] = useState(false)
  
  const followClick = async (item: NFTAnalyseDataList) => {
    dispatch(nftAnalyseMenuType(current))
    if (!address) {
      dispatch(showWalletDialog())
    } else {
      if (starLoading) {
        return
      }
      setStarLoading(true)
      setLoading()
      try {
        const response = await apiClient.post(`/market/follow`, {
          data: {
            id: item.id,
            star: item.isStar ? 0 : 1,
            symbolAddr: item.symbolAddress,
            symbolType: 2
          },
        })
        const data = response as unknown as Response<number>;
        if (data.code === CODE_SUCCESS) {
          setStarLoading(false)
          if (item.isStar) {
            message.success(f('nftAnalyseOptionalCancelSuc'))
          } else {
            message.success(f('nftAnalyseOptionalConfirmSuc'))
          }
          item.id = data.data
          if (current == MENU_TYPE_OPTIONAL) {
            dispatch(editOptionalList(JSON.stringify(item)))
          } else {
            dispatch(editAllList(JSON.stringify(item)))
          }
        } else {
          setStarLoading(false)
          message.error(data.message)
          setLoading()
        }
      } catch (e) {
        setStarLoading(false)
        message.error((e as unknown as Error).message)
        setLoading()
      }
    }
  }
  const setLoading = (flag = false) => {
    if (current != MENU_TYPE_OPTIONAL) {
      dispatch(setAllListLoading(flag))
    } else {
      dispatch(setOptionalListLoading(flag))
    }
  }

  useEffect(() => {
    
    let timeout1 = 0
    let timeout2 = 0
    if (current == MENU_TYPE_OPTIONAL) {
      if (address && nftOptionalList.totalSize) {
        if (nftOptionalList.list.length < 101 && nftOptionalList.list.length > 0) {
          timeout1 = window.setInterval(() => {
            dispatch(
              getNFTAnalyseAllRefreshList({
                ...paginationOptionalInfo,
                pageNo: 1,
                pageSize:
                  paginationOptionalInfo.pageNo *
                  paginationOptionalInfo.pageSize,
                sortFiled: paginationOptionalInfo.sortFiled,
                sort: paginationOptionalInfo.sort,
                ...filterFilled
              }, level)
            )
          }, 5000 * 12)
        }
      }
    } else {
      if (nftAllList.list.length < 101) {
        timeout2 = window.setInterval(() => {
          dispatch(
            getNFTAnalyseOptionalRefreshList({
              ...paginationAllInfo,
              pageNo: 1,
              pageSize:
                paginationAllInfo.pageNo *
                paginationAllInfo.pageSize,
              sortFiled: paginationAllInfo.sortFiled,
              sort: paginationAllInfo.sort,
              ...filterFilled
            }, level)
          )
        }, 5000 * 12)
      }
    }
    return () => {
      clearTimeout(timeout1)
      clearTimeout(timeout2)
    }
  }, [
    current,
    nftAllList.list.length,
    nftOptionalList.list.length,
    paginationOptionalInfo,
    paginationAllInfo,
  ])

  return (
    <>
      <div className="nft-analyse">
        <div className="menuBox">
          <Menu
            selectedKeys={[current]}
            mode="horizontal"
            className="top-menu"
            onClick={menuClick}
          >
            <Menu.Item key={MENU_TYPE_OPTIONAL}>
              {f('nftOptional')}
            </Menu.Item>
            <Menu.Item key={MENU_TYPE_ALL}>{f('nftAll')}</Menu.Item>
            <Menu.Item className={`search-menu ${searchMenuColor ? 'search-menu-active' : ''}`} key="SearchMenu">
              {f('SearchMenu')}<FilterFilled />
            </Menu.Item>
          </Menu>
        </div>
        <div>
          <div
            style={{
              display:
                current == MENU_TYPE_OPTIONAL ? 'block' : 'none',
            }}
          >
            {!address ? (
              <NoLogin
                desc={f('noLoginDesc')}
                btnText={f('login')}
              />
            ) : nftOptionalList.list &&
              nftOptionalList.list.length > 0 ? (
              <div className="common-table nft-table common-dark-table">
                <TableList
                  loading={optionalListLoading}
                  tableName={MENU_TYPE_OPTIONAL}
                  groupList={nftOptionalList}
                  handleInfiniteOnLoad={handleInfiniteOnLoad}
                  followClick={followClick}
                  tableSorterClick={tableSorterClick}
                  paginationArr={paginationOptionalInfo}
                />
                {nftOptionalList.list.length > 0 && nftOptionalList.list.length >= nftOptionalList.totalSize ? (
                  <Divider className="no-more">
                    {f('noMore')}
                  </Divider>
                ) : null}
              </div>
            ) : (
              <div className="no-login">
                <span>
                  {f('noNFTOptionalSymbol')}
                  <span
                    style={{
                      color: '#7377de',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      setCurrent(MENU_TYPE_ALL)
                      dispatchRefreshList('all', {
                        ...paginationAllInfo,
                        pageNo: 1,
                        pageSize: paginationAllInfo.pageNo * paginationAllInfo.pageSize,
                      }, filterFilled, true)
                    }}
                  >
                    {f('nftOptionalAdd')}&gt;&gt;
                  </span>
                </span>
              </div>
            )}
          </div>
          <div
            className="common-table nft-table common-dark-table"
            style={{
              display:
                current === MENU_TYPE_ALL ? 'block' : 'none',
            }}
          >
            <TableList
              loading={allListLoading}
              groupList={nftAllList}
              tableName={MENU_TYPE_ALL}
              handleInfiniteOnLoad={handleInfiniteOnLoad}
              followClick={followClick}
              tableSorterClick={tableSorterClick}
              paginationArr={paginationAllInfo}
            />
            {nftAllList.list.length > 0 && nftAllList.list.length >= nftAllList.totalSize ? (
              <Divider className="no-more">
                {f('noMore')}
              </Divider>
            ) : null}
          </div>
        </div>
      </div>
      <Modal
        visible={isModalVisible}
        forceRender
        onCancel={() => { setIsModalVisible(false) }}
        width={locale == 'zh' ? 520 : 620}
        footer={null}>
        {
          level == 0 ?
            <>
              <SubscriptionMarketPageModal />
            </>
            :
            <>
              <p className="modal-title">
                {f('SearchMenu')}
              </p>
              <Row style={{ marginBottom: 16 }}>
                <Col span={labelSpan} className="flex-center-end">
                  {f('nftFilterMinMarketValue')}：
                </Col>
                <Col span={itemSpan}>
                  <InputNumber placeholder={f('searchMenuMinMarketValuePlaceholder')} value={query.minMarketValue as number} onChange={(value) => {
                    setQuery({
                      ...query,
                      minMarketValue: value as number || null,
                    })
                  }}
                    style={{ width: '100%' }} />
                </Col>
              </Row>
              <Row style={{ marginBottom: 16 }}>
                <Col span={labelSpan} className="flex-center-end">
                  {f('nftFilterMinTradingVolume24H')}：
                </Col>
                <Col span={itemSpan}>
                  <InputNumber placeholder={f('searchMinTradingVolume24HPlaceholder')} value={query.minTradingVolume24H as number} onChange={(value) => {
                    setQuery({
                      ...query,
                      minTradingVolume24H: value as number || null,
                    })
                  }}
                    style={{ width: '100%' }} />
                </Col>
              </Row>
              <Row style={{ marginBottom: 16 }}>
                <Col span={labelSpan} className="flex-center-end">
                  {f('nftFilterMinTradingVolume7d')}：
                </Col>
                <Col span={itemSpan}>
                  <InputNumber placeholder={f('searchMinTradingVolume7dPlaceholder')} value={query.minTradingVolume7d as number} onChange={(value) => {
                    setQuery({
                      ...query,
                      minTradingVolume7d: value as number || null,
                    })
                  }}
                    style={{ width: '100%' }} />
                </Col>
              </Row>
              <Row style={{ marginBottom: 16 }}>
                <Col span={labelSpan} className="flex-center-end">
                  {f('nftFilterMinHoldAddressCount')}：
                </Col>
                <Col span={itemSpan}>
                  <InputNumber placeholder={f('searchMinHoldAddressCountPlaceholder')} value={query.minHoldAddressCount as number} onChange={(value) => {
                    setQuery({
                      ...query,
                      minHoldAddressCount: value as number || null,
                    })
                  }}
                    style={{ width: '100%' }} />
                </Col>
              </Row>
              <div className="form-btns">
                <Button style={{ marginRight: 100 }} onClick={handleCancel}>
                  {f('resetBtn')}
                </Button>
                <Button type="primary" onClick={handleOk}>
                  {f('searchBtn')}
                </Button>
              </div>
            </>
        }
      </Modal>
    </>
  )
}


interface TableListProps {
  loading: boolean,
  groupList: ResponseBodyList<NFTAnalyseDataList[]>,
  handleInfiniteOnLoad: (top: number) => void,
  followClick: (item: NFTAnalyseDataList) => Promise<void>,
  tableName: string,
  tableSorterClick: (sorter: SorterResult<NFTAnalyseDataList> | SorterResult<NFTAnalyseDataList>[]) => void,
  paginationArr: paginationOptionalList,
}

function TableList({
  loading,
  groupList,
  handleInfiniteOnLoad,
  followClick,
  tableSorterClick,
  paginationArr,
}: TableListProps) {
  const { formatMessage } = useIntl()
  const f = (id: string, value?: Record<string, PrimitiveType | FormatXMLElementFn<string, string>> | undefined) => formatMessage({ id }, value)
  const router = useRouter()
  const [sortedInfo, setSortedInfo] = useState<SorterResult<NFTAnalyseDataList>>({})

  useEffect(() => {
    setSortedInfo({
      columnKey: paginationArr.sortFiled,
      order: paginationArr.sortFiled
        ? paginationArr.sort == 1
          ? 'ascend'
          : 'descend'
        : undefined,
    })
  }, [paginationArr])
  const handleChange = (pagination: TablePaginationConfig, filters: Record<string, (Key | boolean)[] | null>, sorter: SorterResult<NFTAnalyseDataList> | SorterResult<NFTAnalyseDataList>[]) => {
    if (!Array.isArray(sorter)) {
      setSortedInfo(sorter)
      tableSorterClick(sorter)
    }
  }

  const { locale = DefaultLocale } = router

  let labelTotalWidth = locale === DefaultLocale ? 1690 : 1690;

  const groupColumns: ColumnType<NFTAnalyseDataList>[] = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      align: 'center',
    },
    {
      title: f('nftAnalyseSymbol'),
      dataIndex: 'symbol',
      key: 'symbol',
      width: 190,
      align: 'left',
    },
    {
      title: f('nftAnalyseTradingVolume24H'),
      dataIndex: 'tradingVolume24H',
      width: 120,
      key: 'tradingVolume24H',
      align: 'right',
      showSorterTooltip: false,
      sorter: true,
      sortDirections: ['descend' as const, 'ascend' as const],
      sortOrder:
        sortedInfo.columnKey === 'tradingVolume24H' ? sortedInfo.order : undefined,
    },
    {
      title: f('nftAnalyseIncrease', { str: '24H' }),
      dataIndex: 'tradingVolumeIncrease24H',
      width: 100,
      key: 'tradingVolumeIncrease24H',
      align: 'left',
      showSorterTooltip: false,
      sorter: true,
      sortDirections: ['descend' as const, 'ascend' as const],
      sortOrder:
        sortedInfo.columnKey === 'tradingVolumeIncrease24H' ? sortedInfo.order : undefined,
    },
    {
      title: f('nftAnalyseTradingVolume7d'),
      dataIndex: 'tradingVolume7d',
      width: 120,
      key: 'tradingVolume7d',
      align: 'right',
      showSorterTooltip: false,
      sorter: true,
      sortDirections: ['descend' as const, 'ascend' as const],
      sortOrder: sortedInfo.columnKey === 'tradingVolume7d' ? sortedInfo.order : undefined,
    },
    {
      title: f('nftAnalyseIncrease', { str: '7D' }),
      dataIndex: 'tradingVolumeIncrease7d',
      width: 100,
      key: 'tradingVolumeIncrease7d',
      align: 'left',
      showSorterTooltip: false,
      sorter: true,
      sortDirections: ['descend' as const, 'ascend' as const],
      sortOrder: sortedInfo.columnKey === 'tradingVolumeIncrease7d' ? sortedInfo.order : undefined,
    },
    {
      title: () => {
        return (
          <span>
            {f('nftAnalyseMarketValue')}
            <Tooltip
              placement="top"
              title={<div>{f('nftAnalyseMarketValueDesc')}</div>}
            >
              <QuestionCircleOutlined
                style={{
                  fontSize: '14px',
                  marginLeft: '2px',
                }}
              />
            </Tooltip>
          </span>
        )
      },
      dataIndex: 'marketValue',
      width: 140,
      key: 'marketValue',
      align: 'right',
      showSorterTooltip: false,
      sorter: true,
      sortDirections: ['descend' as const, 'ascend' as const],
      sortOrder: sortedInfo.columnKey === 'marketValue' ? sortedInfo.order : undefined,
    },
    {
      title: f('nftAnalyseIncrease', { str: '24H' }),
      dataIndex: 'marketValueIncrease',
      width: 100,
      key: 'marketValueIncrease',
      align: 'left',
      showSorterTooltip: false,
      sorter: true,
      sortDirections: ['descend' as const, 'ascend' as const],
      sortOrder:
        sortedInfo.columnKey === 'marketValueIncrease' ? sortedInfo.order : undefined,
    },
    {
      title: () => {
        return (
          <span>
            {f('nftAnalyseHoldAddressCount')}
            <Tooltip
              placement="top"
              title={<div>{f('nftAnalyseHoldAddressCountDesc')}</div>}
            >
              <QuestionCircleOutlined
                style={{
                  fontSize: '14px',
                  marginLeft: '2px',
                }}
              />
            </Tooltip>
          </span>
        )
      },
      dataIndex: 'holdAddressCount',
      width: 120,
      key: 'holdAddressCount',
      align: 'right',
      showSorterTooltip: false,
      sorter: true,
      sortDirections: ['descend' as const, 'ascend' as const],
      sortOrder: sortedInfo.columnKey === 'holdAddressCount' ? sortedInfo.order : undefined,
    },
    {
      title: f('nftAnalyseIncrease', { str: '24H' }),
      dataIndex: 'holdAddressCountIncrease',
      width: 100,
      key: 'holdAddressCountIncrease',
      align: 'left',
      showSorterTooltip: false,
      sorter: true,
      sortDirections: ['descend' as const, 'ascend' as const],
      sortOrder: sortedInfo.columnKey === 'holdAddressCountIncrease' ? sortedInfo.order : undefined,
    },
    {
      title: () => {
        return (
          <span>
            {f('nftAnalyseWhaleNum')}
            <Tooltip
              placement="top"
              title={<div>{f('nftAnalyseWhaleNumDesc')}</div>}
            >
              <QuestionCircleOutlined
                style={{
                  fontSize: '14px',
                  marginLeft: '2px',
                }}
              />
            </Tooltip>
          </span>
        )
      },
      dataIndex: 'whaleNum',
      width: 140,
      key: 'whaleNum',
      align: 'right',
      showSorterTooltip: false,
      sorter: true,
      sortDirections: ['descend' as const, 'ascend' as const],
      sortOrder: sortedInfo.columnKey === 'whaleNum' ? sortedInfo.order : undefined,
    },
    {
      title: () => {
        return (
          <span>
            {f('nftAnalyseFloorPrice')}
            <Tooltip
              placement="top"
              title={<div>{f('nftAnalyseFloorPriceDesc')}</div>}
            >
              <QuestionCircleOutlined
                style={{
                  fontSize: '14px',
                  marginLeft: '2px',
                }}
              />
            </Tooltip>
          </span>
        )
      },
      dataIndex: 'floorPrice',
      width: 140,
      key: 'floorPrice',
      align: 'right',
      showSorterTooltip: false,
      sorter: true,
      sortDirections: ['descend' as const, 'ascend' as const],
      sortOrder: sortedInfo.columnKey === 'floorPrice' ? sortedInfo.order : undefined,
    },
    {
      title: f('nftAnalyseIncrease', { str: '24H' }),
      dataIndex: 'floorPriceIncrease',
      width: 100,
      key: 'floorPriceIncrease',
      align: 'left',
      showSorterTooltip: false,
      sorter: true,
      sortDirections: ['descend' as const, 'ascend' as const],
      sortOrder: sortedInfo.columnKey === 'floorPriceIncrease' ? sortedInfo.order : undefined,
    },
    {
      title: f('nftAnalyseTrendList'),
      key: 'trendList',
      align: 'left',
      width: 140,
    },
  ]
  const [tableWidth, setTableWidth] = useState(0)
  const [tableHeight, setTableHeight] = useState(0)

  const gridRef = useRef<VariableSizeGrid | null>(null)
  const [connectObject] = useState(() => {
    const obj = { scrollTop: NaN }
    Object.defineProperty(obj, 'scrollLeft', {
      get: () => null,
      set: (scrollLeft: number) => {
        if (gridRef.current) {
          gridRef.current.scrollTo({
            scrollLeft,
          } as { scrollLeft: number; scrollTop: number; })
        }
      },
    })
    return obj
  })
  const resetVirtualGrid = () => {
    gridRef.current &&
      gridRef.current.resetAfterIndices({
        columnIndex: 0,
        shouldForceUpdate: true,
      } as {
        columnIndex: number;
        rowIndex: number;
        shouldForceUpdate?: boolean | undefined;
      })
  }
  useEffect(() => resetVirtualGrid, [tableWidth])
  useEffect(() => resetVirtualGrid, [locale]);

  // let timeout
  // const [timer, setTimer] = useState<number | null>(null)
  // const [classScrollbar, setClassScrollbar] = useState('');
  // const setClassName = (callback: () => void) => {
  //   if (timer) {
  //     clearTimeout(timer)
  //     timeout = null
  //     setTimer(null)
  //   }
  //   const getData = () => {
  //     callback()
  //   }
  //   timeout = window.setTimeout(getData, 800)
  //   setTimer(timeout)
  // }
  const getStyle = (display: string, alignItems: string, justifyContent: string) => {
    return {
      display: display,
      alignItems: alignItems,
      justifyContent: justifyContent
    }
  }
  const getClass = (index: number) => {
    return `virtual-grid-item ${index % 2 == 0 ? 'virtual-grid-item1' : 'virtual-grid-item2'}`
  }
  const getItemDom = (value: number | string, rate: number) => {
    if (rate < 0) {
      rate = 0
    } else if (rate > 100) {
      rate = 100
    }
    return (
      <div className="virtual-grid-item-box" >
        <span className="virtual-grid-item-value">{Global.formatBigNum(value)}</span>
        {value !== null ?
          <div className="virtual-grid-item-rate">
            <div style={{ width: `${rate}%` }}></div>
          </div>
          : null}
      </div>
    )
  }
  const findMinAndMax = (numbers: number[]) => {
    const sorted = numbers.sort();
    if (sorted[0] === sorted[sorted.length - 1]) {
      return {
        min: sorted[0] / 2 || -50,
        max: sorted[0] + sorted[0] / 2 || 50
      }
    } else {
      return {
        min: null,
        max: null
      }
    }
  }
  const getConfig = (data: TrendListItem[], floorPriceIncrease: string) => {
    const colors = Number(floorPriceIncrease) == 0 ? '#5B8FF9' : Number(floorPriceIncrease) > 0 ? '#44BE90' : '#EF5F81'
    data = data.map(item => {
      item.value = Number(item.value)
      return item
    })
    return {
      data,
      xField: 'date',
      yField: 'value',
      smooth: true,
      renderer: 'svg' as const,
      animation: false as const,
      padding: [10],
      tooltip: {
        position: 'top' as const,
        customContent: (title: any, data: any) => {
          if (data.length > 0) {
            return (
              <div className="line-tooltip-box">
                <span style={{ marginBottom: 5 }}>{moment(data[0].data.date).format('MMM DD, YYYY')}</span>
                <span>{Global.formatBigNum(data[0].data.value)} ETH</span>
              </div>
            ) as unknown as string
          } else {
            return <></> as unknown as string
          }
        }
      },
      color: colors,
      yAxis: {
        ...findMinAndMax(data.map((item: TrendListItem) => {
          return Number(item.value);
        })),
        label: null,
        grid: null,
        line: null,
      },
      xAxis: {
        label: null,
        grid: null,
        line: null,
      },
    }
  }
  const itemClick = (index: number, e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    trackAction(
      NFT_ANALYSE.category,
      NFT_ANALYSE.actions.nft_detail
    )
    Global.openNewTag(e, router, `/nft-analyse-detail/nft-analyse/${groupList.list[index].symbolAddress}`);
  }
  const renderVirtualList = (rawData: NFTAnalyseDataList[], info: {
    scrollbarSize: number;
    ref: any;
    onScroll: (info: {
      currentTarget?: HTMLElement;
      scrollLeft?: number;
    }) => void;
  },) => {
    const { ref, onScroll } = info
    ref.current = connectObject
    return (
      <>
        <VariableSizeGrid
          ref={gridRef}
          // className={`virtual-grid ${classScrollbar}`}
          className={`virtual-grid`}
          columnCount={groupColumns.length}
          columnWidth={(index: number) => {
            return tableWidth > labelTotalWidth
              ? tableWidth * ((groupColumns[index].width as number) / labelTotalWidth)
              : (groupColumns[index].width as number)
          }}
          height={tableHeight}
          rowCount={groupList.list.length}
          rowHeight={() => 50}
          width={tableWidth}
          onScroll={({ scrollLeft, scrollTop }) => {
            // setClassScrollbar('virtual-grid-scrollbar')
            // setClassName(() => { setClassScrollbar('') })
            handleInfiniteOnLoad(scrollTop)
            onScroll({
              scrollLeft,
            })
          }}
        >
          {({ columnIndex, rowIndex, style }) => {
            let key = groupColumns[columnIndex].key
            switch (key) {
              case 'id':
                return (
                  <div
                    style={{
                      ...style,
                      ...getStyle('flex', 'center', 'center')
                    }}
                    className={getClass(rowIndex)}
                  >
                    <svg
                      className="icon iconsItem"
                      aria-hidden="true"
                      onClick={() => {
                        followClick(
                          groupList.list[rowIndex]
                        )
                      }}>
                      <title>{!groupList.list[rowIndex].isStar ? f('nftOptionalConfirm') : f('nftOptionalCancel')}</title>
                      <use xlinkHref={!groupList.list[rowIndex].isStar ? '#icon-collect' : '#icon-collect_active'}></use>
                    </svg>
                    <span style={{ width: 40, textAlign: 'center' }}>{rowIndex + 1}</span>
                  </div>
                )
              case 'symbol':
                return (
                  <div
                    style={{
                      ...style,
                      ...getStyle('flex', 'center', 'flex-start')
                    }}
                    className={getClass(rowIndex)}
                    onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => { itemClick(rowIndex,e) }}
                  >
                    {groupList.list[rowIndex].logo ?
                      <TokenLogo
                        className="iconsItem"
                        src={groupList.list[rowIndex].logo}
                        alt=""
                        title={groupList.list[rowIndex].symbol}
                      /> : null}
                    <span style={{ display: 'inline-block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={groupList.list[rowIndex].symbol}>
                      &nbsp;
                      {groupList.list[rowIndex].symbol}
                    </span>
                  </div>
                )
              case 'marketValue':
                return (
                  <div
                    style={{
                      ...style,
                      ...getStyle('flex', 'center', 'flex-end')
                    }}
                    className={getClass(rowIndex)}
                    onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => { itemClick(rowIndex, e) }}
                  >
                    {getItemDom(groupList.list[rowIndex].marketValue, groupList.list[rowIndex].marketValueRate)}
                  </div>
                )
              case 'marketValueIncrease':
                return (
                  <div
                    style={{
                      ...style,
                      ...getStyle('flex', 'center', 'flex-start')
                    }}
                    className={getClass(rowIndex)}
                    onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => { itemClick(rowIndex, e) }}
                  >
                    {Global.formatIncreaseNumber(groupList.list[rowIndex].marketValueIncrease)}
                  </div>
                )
              case 'tradingVolume24H':
                return (
                  <div
                    style={{
                      ...style,
                      ...getStyle('flex', 'center', 'flex-end')
                    }}
                    className={getClass(rowIndex)}
                    onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => { itemClick(rowIndex, e) }}
                  >
                    {getItemDom(groupList.list[rowIndex].tradingVolume24H, groupList.list[rowIndex].tradingVolumeRate24H)}
                  </div>
                )
              case 'tradingVolumeIncrease24H':
                return (
                  <div
                    style={{
                      ...style,
                      ...getStyle('flex', 'center', 'flex-start')
                    }}
                    className={getClass(rowIndex)}
                    onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => { itemClick(rowIndex, e) }}
                  >
                    {Global.formatIncreaseNumber(groupList.list[rowIndex].tradingVolumeIncrease24H)}
                  </div>
                )
              case 'tradingVolume7d':
                return (
                  <div
                    style={{
                      ...style,
                      ...getStyle('flex', 'center', 'flex-end')
                    }}
                    className={getClass(rowIndex)}
                    onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => { itemClick(rowIndex, e) }}
                  >
                    {getItemDom(groupList.list[rowIndex].tradingVolume7d, groupList.list[rowIndex].tradingVolumeRate7d)}
                  </div>
                )
              case 'tradingVolumeIncrease7d':
                return (
                  <div
                    style={{
                      ...style,
                      ...getStyle('flex', 'center', 'flex-start')
                    }}
                    className={getClass(rowIndex)}
                    onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => { itemClick(rowIndex, e) }}
                  >
                    {Global.formatIncreaseNumber(groupList.list[rowIndex].tradingVolumeIncrease7d)}
                  </div>
                )
              case 'holdAddressCount':
                return (
                  <div
                    style={{
                      ...style,
                      ...getStyle('flex', 'center', 'flex-end')
                    }}
                    className={getClass(rowIndex)}
                    onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => { itemClick(rowIndex, e) }}
                  >
                    {getItemDom(groupList.list[rowIndex].holdAddressCount, groupList.list[rowIndex].holdAddressCounRate)}
                  </div>
                )
              case 'holdAddressCountIncrease':
                return (
                  <div
                    style={{
                      ...style,
                      ...getStyle('flex', 'center', 'flex-start')
                    }}
                    className={getClass(rowIndex)}
                    onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => { itemClick(rowIndex, e) }}
                  >
                    {Global.formatIncreaseNumber(groupList.list[rowIndex].holdAddressCountIncrease)}
                  </div>
                )
              case 'whaleNum':
                return (
                  <div
                    style={{
                      ...style,
                      ...getStyle('flex', 'center', 'flex-end')
                    }}
                    className={getClass(rowIndex)}
                    onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => { itemClick(rowIndex, e) }}
                  >
                    {getItemDom(groupList.list[rowIndex].whaleNum, groupList.list[rowIndex].whaleNumRate)}
                  </div>
                )
              case 'floorPrice':
                return (
                  <div
                    style={{
                      ...style,
                      ...getStyle('flex', 'center', 'flex-end')
                    }}
                    className={getClass(rowIndex)}
                    onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => { itemClick(rowIndex, e) }}
                  >
                    {getItemDom(groupList.list[rowIndex].floorPrice, groupList.list[rowIndex].floorPricRate)}
                  </div>
                )
              case 'floorPriceIncrease':
                return (
                  <div
                    style={{
                      ...style,
                      ...getStyle('flex', 'center', 'flex-start')
                    }}
                    className={getClass(rowIndex)}
                    onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => { itemClick(rowIndex, e) }}
                  >
                    {Global.formatIncreaseNumber(groupList.list[rowIndex].floorPriceIncrease)}
                  </div>
                )
              case 'trendList':
                return (
                  <div
                    style={{
                      ...style,
                      ...getStyle('flex', 'center', 'flex-start')
                    }}
                    className={getClass(rowIndex)}
                  >
                    {
                      groupList.list[rowIndex].trendList !== null && groupList.list[rowIndex].trendList.length > 0 ?
                        <Line
                          {...getConfig(groupList.list[rowIndex].trendList, groupList.list[rowIndex].floorPriceIncrease)}
                          style={{ width: '100%', height: '50px' }}
                          fallback={
                            <div
                              style={{
                                width: '100%',
                                height: '50px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Spin></Spin>
                            </div>
                          }
                        /> :
                        null
                    }
                  </div>
                )
              default:
                return <></>
            }
          }}
        </VariableSizeGrid>
      </>
    )
  }

  return (
    <>
      <ResizeObserver
        onResize={({ width }) => {
          setTableWidth(width)
          setTableHeight(
            window.innerHeight < 850
              ? window.innerHeight - 200
              : window.innerHeight - 320
          )
        }}
      >
        {groupList.list.length > 0 ? (
          <Table
            rowKey="symbolAddress"
            columns={groupColumns}
            pagination={false}
            dataSource={groupList.list}
            loading={loading}
            onChange={handleChange}
            scroll={{ y: 400, x: '1480px' }}
            components={{
              body: renderVirtualList as CustomizeScrollBody<NFTAnalyseDataList>,
            }}
          />
        ) : (
          <NoDataTable
            loading={loading}
            groupList={groupList.list}
          />
        )}
      </ResizeObserver>
    </>
  )
}

function NoDataTable({ loading, groupList }: { loading: boolean, groupList: NFTAnalyseDataList[] }) {

  const { formatMessage } = useIntl()
  const f = (id: string, value?: Record<string, PrimitiveType | FormatXMLElementFn<string, string>> | undefined) => formatMessage({ id }, value)
  const groupColumnsNull = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      align: 'center' as const,
    },
    {
      title: f('nftAnalyseSymbol'),
      dataIndex: 'symbol',
      key: 'symbol',
      align: 'left' as const,
    },
    {
      title: f('nftAnalyseTradingVolume24H'),
      dataIndex: 'tradingVolume24H',
      key: 'tradingVolume24H',
      align: 'right' as const,
      sorter: true,
      sortDirections: ['descend' as const, 'ascend' as const],
      showSorterTooltip: false,
    },
    {
      title: f('nftAnalyseIncrease', { str: '24H' }),
      dataIndex: 'tradingVolumeIncrease24H',
      key: 'tradingVolumeIncrease24H',
      align: 'left' as const,
      sorter: true,
      sortDirections: ['descend' as const, 'ascend' as const],
      showSorterTooltip: false,
    },
    {
      title: f('nftAnalyseTradingVolume7d'),
      dataIndex: 'tradingVolume7d',
      key: 'tradingVolume7d',
      align: 'right' as const,
      sorter: true,
      sortDirections: ['descend' as const, 'ascend' as const],
      showSorterTooltip: false,
    },
    {
      title: f('nftAnalyseIncrease', { str: '7D' }),
      dataIndex: 'tradingVolumeIncrease7d',
      key: 'tradingVolumeIncrease7d',
      align: 'left' as const,
      sorter: true,
      sortDirections: ['descend' as const, 'ascend' as const],
      showSorterTooltip: false,
    },
    {
      title: () => {
        return (
          <span>
            {f('nftAnalyseMarketValue')}
            <Tooltip
              placement="top"
              title={<div>{f('nftAnalyseMarketValueDesc')}</div>}
            >
              <QuestionCircleOutlined
                style={{
                  fontSize: '14px',
                  marginLeft: '2px',
                }}
              />
            </Tooltip>
          </span>
        )
      },
      dataIndex: 'marketValue',
      key: 'marketValue',
      align: 'left' as const,
      sorter: true,
      sortDirections: ['descend' as const, 'ascend' as const],
      showSorterTooltip: false,
    },
    {
      title: f('nftAnalyseIncrease', { str: '24H' }),
      dataIndex: 'marketValueIncrease',
      key: 'marketValueIncrease',
      align: 'left' as const,
      sorter: true,
      sortDirections: ['descend' as const, 'ascend' as const],
      showSorterTooltip: false,
    },
    {
      title: () => {
        return (
          <span>
            {f('nftAnalyseHoldAddressCount')}
            <Tooltip
              placement="top"
              title={<div>{f('nftAnalyseHoldAddressCountDesc')}</div>}
            >
              <QuestionCircleOutlined
                style={{
                  fontSize: '14px',
                  marginLeft: '2px',
                }}
              />
            </Tooltip>
          </span>
        )
      },
      dataIndex: 'holdAddressCount',
      key: 'holdAddressCount',
      align: 'right' as const,
      sorter: true,
      sortDirections: ['descend' as const, 'ascend' as const],
      showSorterTooltip: false,
    },
    {
      title: f('nftAnalyseIncrease', { str: '24H' }),
      dataIndex: 'holdAddressCountIncrease',
      key: 'holdAddressCountIncrease',
      align: 'left' as const,
      sorter: true,
      sortDirections: ['descend' as const, 'ascend' as const],
      showSorterTooltip: false,
    }, 
    {
      title: () => {
        return (
          <span>
            {f('nftAnalyseWhaleNum')}
            <Tooltip
              placement="top"
              title={<div>{f('nftAnalyseWhaleNumDesc')}</div>}
            >
              <QuestionCircleOutlined
                style={{
                  fontSize: '14px',
                  marginLeft: '2px',
                }}
              />
            </Tooltip>
          </span>
        )
      },
      dataIndex: 'whaleNum',
      key: 'whaleNum',
      align: 'right' as const,
      sorter: true,
      sortDirections: ['descend' as const, 'ascend' as const],
      showSorterTooltip: false,
    },
    {
      title: () => {
        return (
          <span>
            {f('nftAnalyseFloorPrice')}
            <Tooltip
              placement="top"
              title={<div>{f('nftAnalyseFloorPriceDesc')}</div>}
            >
              <QuestionCircleOutlined
                style={{
                  fontSize: '14px',
                  marginLeft: '2px',
                }}
              />
            </Tooltip>
          </span>
        )
      },
      dataIndex: 'floorPrice',
      key: 'floorPrice',
      align: 'right' as const,
      sorter: true,
      sortDirections: ['descend' as const, 'ascend' as const],
      showSorterTooltip: false,
    },
    {
      title: f('nftAnalyseIncrease', { str: '24H' }),
      dataIndex: 'floorPriceIncrease',
      key: 'floorPriceIncrease',
      align: 'left' as const,
      sorter: true,
      sortDirections: ['descend' as const, 'ascend' as const],
      showSorterTooltip: false,
    },
    {
      title: f('nftAnalyseTrendList'),
      dataIndex: 'trendList',
      key: 'trendList',
      align: 'left' as const,
    },
  ]
  return (
    <Table
      rowKey="symbolAddress"
      columns={groupColumnsNull}
      pagination={false}
      dataSource={groupList}
      loading={loading}
    />
  )
}