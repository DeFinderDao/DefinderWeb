import React, { useState, useEffect, useRef, Key } from 'react'
import ApiClient from 'utils/ApiClient'
import Image from 'next/image'
import { useIntl } from 'react-intl'
import { Table, message, Menu, Divider, Modal, Button, Row, Col, DatePicker, InputNumber, Tooltip, Spin } from 'antd'
import { FilterFilled } from '@ant-design/icons'
import 'styles/market-page.less'
import { NextRouter, useRouter } from 'next/router'
import NoLogin from 'components/NoLogin'
import Global from 'utils/Global'
import { CODE_SUCCESS } from 'utils/ApiServerError'
import { useDispatch, useSelector } from 'react-redux'
import {
    getMarketOptionalList,
    getMarketAllList,
    marketPagePaginationOptionalInfo,
    marketPagePaginationAllInfo,
    marketPageFilterFilled,
    marketPageMenuType,
    editAllList,
    editOptionalList,
    setAllListLoading,
    setOptionalListLoading,
    getMarketOptionalRefreshList,
    getMarketAllRefreshList,
} from 'redux/actions/MarketPageAction'
import { trackAction, trackPage, MARKET_PAGE } from 'utils/analyse/YMAnalyse'
import { isUserLogined } from 'utils/storage'
import { VariableSizeGrid } from 'react-window'
import ResizeObserver from 'rc-resize-observer'
import { showWalletDialog } from 'redux/actions/UserInfoAction'
import { AppState } from 'redux/reducers'
import type { MenuInfo } from 'rc-menu/lib/interface'
import type {
    ResponseBodyList,
    MarketPageDataList,
    paginationOptionalList,
    FilterFilledList,
    TrendListItem,
} from 'redux/types/MarketPageTypes';
import type { Response } from 'redux/types';
import type { ColumnType, SorterResult, TablePaginationConfig } from 'antd/lib/table/interface'
import type { CustomizeScrollBody } from 'rc-table/lib/interface';
import { DefaultLocale } from 'utils/env'
import Discover from 'components/MarketComponents/Discover'
import { TokenLogo } from 'components/TokenLogo'
import moment, { Moment } from 'moment'
import type { RangeValue } from 'rc-picker/lib/interface'
import { SubscriptionMarketPageModal } from 'components/Subscription/marketPageModal'
import WaterMarkContent from 'components/WaterMarkContent'
import ExcardModal from 'components/MarketComponents/ExcardModal'
const { RangePicker } = DatePicker
import { QuestionCircleOutlined } from '@ant-design/icons'
import loadable from '@loadable/component';
const Line = loadable(() => import('@ant-design/plots/lib/components/line'));

const MENU_TYPE_ALL = 'marketAll';

const MENU_TYPE_OPTIONAL = 'marketOptional';

const MENU_TYPE_DISCOVER = 'marketDiscover';

export default function marketPage() {
    useEffect(() => {
        trackPage(MARKET_PAGE.url)
    }, [])
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id })
    const dispatch = useDispatch()
    const apiClient = new ApiClient()
    const router = useRouter()
    const { locale = DefaultLocale }: NextRouter = router;

    const userInfo = useSelector((state: AppState) => state.userInfo)
    useEffect(() => {
        if (userInfo.address) {
            dispatch(
                marketPagePaginationOptionalInfo({
                    pageNo: 1,
                    pageSize: 20,
                    sortFiled: 'symbolTurnover',
                    sort: 0,
                })
            )
            dispatch(
                getMarketOptionalRefreshList({
                    pageNo: 1,
                    pageSize: 20,
                    sortFiled: 'symbolTurnover',
                    sort: 0,
                    startTime: null,
                    endTime: null,
                    minSymbolTurnover: null,
                    minHoldCount: null,
                    minNetBuyCount: null,
                    minAddHoldCount: null,
                    minLpValue: null,
                }, userInfo.level)
            )
        }
        // if (marketAllList.list.length < 1) {
        //     dispatch(
        //         getMarketAllRefreshList({
        //             pageNo: 1,
        //             pageSize:
        //                 paginationAll.pageNo * paginationAll.pageSize,
        //             sortFiled: paginationAll.sortFiled,
        //             sort: paginationAll.sort,
        //             ...filterFilled
        //         }, userInfo.level)
        //     )
        // }
    }, [userInfo.address])
    const paginationOptional = useSelector(
        (state: AppState) => state.marketPage.paginationOptionalInfo
    )
    const paginationAll = useSelector(
        (state: AppState) => state.marketPage.paginationAllInfo
    )
    const filterFilled = useSelector(
        (state: AppState) => state.marketPage.filterFilled
    )
    const menuType = useSelector((state: AppState) => state.marketPage.menuType)
    const optionalListLoading = useSelector(
        (state: AppState) => state.marketPage.optionalListLoading
    )
    const allListLoading = useSelector(
        (state: AppState) => state.marketPage.allListLoading
    )
    const marketOptionalList = useSelector(
        (state: AppState) => state.marketPage.marketOptionalList
    )
    const marketAllList = useSelector((state: AppState) => state.marketPage.marketAllList)

    const [current, setCurrent] = useState('')
    useEffect(() => {
        let timeout1 = 0
        let timeout2 = 0
        if (current == MENU_TYPE_OPTIONAL) {
            if (userInfo.address && marketOptionalList.totalSize) {
                if (marketOptionalList.list.length < 101) {
                    timeout1 = window.setInterval(() => {
                        dispatch(
                            getMarketOptionalRefreshList({
                                pageNo: 1,
                                pageSize:
                                    paginationOptional.pageNo *
                                    paginationOptional.pageSize,
                                sortFiled: paginationOptional.sortFiled,
                                sort: paginationOptional.sort,
                                ...filterFilled
                            }, userInfo.level)
                        )
                    }, 5000 * 12)
                }
            }
        } else {
            if (marketAllList.list.length < 101) {
                timeout2 = window.setInterval(() => {
                    dispatch(
                        getMarketAllRefreshList({
                            pageNo: 1,
                            pageSize:
                                paginationAll.pageNo * paginationAll.pageSize,
                            sortFiled: paginationAll.sortFiled,
                            sort: paginationAll.sort,
                            ...filterFilled
                        }, userInfo.level)
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
        marketAllList.list.length,
        marketOptionalList.list.length,
        paginationOptional,
        paginationAll,
    ])

    useEffect(() => {
        if (menuType == '') {
            if (marketAllList.list.length < 1) {
                dispatch(getMarketAllRefreshList({
                    pageNo: 1,
                    pageSize:
                        paginationAll.pageNo * paginationAll.pageSize,
                    sortFiled: paginationAll.sortFiled,
                    sort: paginationAll.sort, ...filterFilled
                }, userInfo.level))
            }
            if (!userInfo.address) {
                setCurrent(MENU_TYPE_ALL)
            }
        } else {
            dispatch(getMarketAllRefreshList({
                pageNo: 1,
                pageSize:
                    paginationAll.pageNo * paginationAll.pageSize,
                sortFiled: paginationAll.sortFiled,
                sort: paginationAll.sort, ...filterFilled
            }, userInfo.level))
            setCurrent(menuType)
        }
    }, [userInfo.address])
    useEffect(() => {
        if (menuType == '') {
            if (marketOptionalList.totalSize || (marketOptionalList.totalSize == 0 && paginationOptional.pageNo > 1)) {
                dispatch(marketPageMenuType(MENU_TYPE_OPTIONAL))
                setCurrent(MENU_TYPE_OPTIONAL)
            } else {
                setCurrent(MENU_TYPE_ALL)
            }
        }
    }, [marketOptionalList.totalSize])

    const menuClick = (e: MenuInfo) => {
        if (e.key == 'SearchMenu') {
            setIsModalVisible(true)
            return
        }
        setCurrent(e.key as string)
        dispatch(marketPageMenuType(e.key as string))
        trackAction(
            MARKET_PAGE.category,
            MARKET_PAGE.actions.market_tab,
            MARKET_PAGE.actions['market_tab_' + e.key]
        )
        if (e.key == MENU_TYPE_OPTIONAL) {
            if (userInfo.address) {
                dispatch(
                    marketPagePaginationOptionalInfo({
                        ...paginationOptional,
                        pageNo: 1,
                        pageSize: paginationOptional.pageSize,
                    })
                )
                dispatch(
                    getMarketOptionalList({
                        ...paginationOptional,
                        pageNo: 1,
                        pageSize: paginationOptional.pageSize,
                        ...filterFilled
                    }, userInfo.level)
                )
            }
        }
    }

    const [starLoading, setStarLoading] = useState(false)

    const followClick = async (item: MarketPageDataList) => {
        if (!userInfo.address) {
            dispatch(showWalletDialog())
        } else {
            if (starLoading) {
                return
            }
            setStarLoading(true)
            if (current != MENU_TYPE_OPTIONAL) {
                dispatch(setAllListLoading(true))
            } else {
                dispatch(setOptionalListLoading(true))
            }
            try {
                const response = await apiClient.post(`/market/follow`, {
                    data: {
                        id: item.id,
                        star: item.isStar ? 0 : 1,
                        symbolAddr: item.symbolAddr,
                    },
                })
                const data = response as unknown as Response<number>;
                if (data.code === CODE_SUCCESS) {
                    setStarLoading(false)
                    if (item.isStar) {
                        message.success(f('marketOptionalCancelSuc'))
                    } else {
                        message.success(f('marketOptionalConfirmSuc'))
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
                    if (current != MENU_TYPE_OPTIONAL) {
                        dispatch(setAllListLoading(false))
                    } else {
                        dispatch(setOptionalListLoading(false))
                    }
                }
            } catch (e) {
                setStarLoading(false)
                message.error((e as unknown as Error).message)
                if (current != MENU_TYPE_OPTIONAL) {
                    dispatch(setAllListLoading(false))
                } else {
                    dispatch(setOptionalListLoading(false))
                }
            }
        }
    }

    const [hasMoreOptional, setHasMoreOptional] = useState(true)
    const [hasMoreAll, setHasMoreAll] = useState(true)
    useEffect(() => {
        if (!optionalListLoading) {
            if (
                marketOptionalList.list.length >= marketOptionalList.totalSize
            ) {
                setHasMoreOptional(false)
            } else {
                setHasMoreOptional(true)
            }
        }
    }, [optionalListLoading, marketOptionalList.list.length, marketOptionalList.totalSize])
    useEffect(() => {
        if (!allListLoading) {
            if (marketAllList.list.length >= marketAllList.totalSize) {
                setHasMoreAll(false)
            } else {
                setHasMoreAll(true)
            }
        }
    }, [allListLoading])
    
    const handleInfiniteOnLoad = (top: number) => {
        if (top == 0) {
            return
        }
        if (current == MENU_TYPE_OPTIONAL) {
            let optationPH =
                (document.getElementsByClassName('virtual-grid')[0] as HTMLDivElement).offsetHeight
            let optationCH =
                (document.getElementsByClassName('virtual-grid')[0].children[0] as HTMLDivElement)
                    .offsetHeight
            
            if (top + optationPH > optationCH - 10) {
                if (
                    marketOptionalList.totalSize >
                    marketOptionalList.list.length
                    && !optionalListLoading
                ) {
                    dispatch(
                        marketPagePaginationOptionalInfo({
                            ...paginationOptional,
                            pageNo: paginationOptional.pageNo + 1,
                            pageSize: paginationOptional.pageSize,
                        })
                    )
                    dispatch(
                        getMarketOptionalList({
                            ...paginationOptional,
                            pageNo: paginationOptional.pageNo + 1,
                            pageSize: paginationOptional.pageSize,
                            ...filterFilled
                        }, userInfo.level)
                    )
                }
            }
        } else {
            let alllPH =
                document.getElementsByClassName('virtual-grid').length > 1
                    ? (document.getElementsByClassName('virtual-grid')[1] as HTMLDivElement)
                        .offsetHeight
                    : (document.getElementsByClassName('virtual-grid')[0] as HTMLDivElement)
                        .offsetHeight
            let alllCH =
                document.getElementsByClassName('virtual-grid').length > 1
                    ? (document.getElementsByClassName('virtual-grid')[1]
                        .children[0] as HTMLDivElement).offsetHeight
                    : (document.getElementsByClassName('virtual-grid')[0]
                        .children[0] as HTMLDivElement).offsetHeight
            
            if (top + alllPH > alllCH - 10) {
                if (marketAllList.totalSize > marketAllList.list.length && !allListLoading) {
                    dispatch(
                        marketPagePaginationAllInfo({
                            ...paginationAll,
                            pageNo: paginationAll.pageNo + 1,
                            pageSize: paginationAll.pageSize,
                        })
                    )
                    dispatch(
                        getMarketAllList({
                            ...paginationAll,
                            pageNo: paginationAll.pageNo + 1,
                            pageSize: paginationAll.pageSize,
                            ...filterFilled
                        }, userInfo.level)
                    )
                }
            }
        }
    }

    const tableSorterClick = (sorter: SorterResult<MarketPageDataList> | SorterResult<MarketPageDataList>[]) => {
        if (!Array.isArray(sorter)) {
            const sortList = sorter.order
                ? {
                    sortFiled: sorter.field as string,
                    sort: sorter.order == 'ascend' ? 1 : 0,
                }
                : {
                    sortFiled: '',
                    sort: '',
                }
            if (current == MENU_TYPE_OPTIONAL) {
                document.getElementsByClassName('virtual-grid')[0].scrollTop = 0
                document.getElementsByClassName('virtual-fix-grid')[0].scrollTop = 0
                dispatch(
                    marketPagePaginationOptionalInfo({
                        pageNo: 1,
                        pageSize: paginationOptional.pageSize,
                        ...sortList,
                    })
                )
                dispatch(
                    getMarketOptionalRefreshList({
                        pageNo: 1,
                        pageSize: paginationOptional.pageSize,
                        ...sortList,
                        ...filterFilled
                    }, userInfo.level)
                )
            } else {
                if (document.getElementsByClassName('virtual-grid').length > 1) {
                    document.getElementsByClassName('virtual-grid')[1].scrollTop = 0
                } else {
                    document.getElementsByClassName('virtual-grid')[0].scrollTop = 0
                }
                if (
                    document.getElementsByClassName('virtual-fix-grid').length > 1
                ) {
                    document.getElementsByClassName(
                        'virtual-fix-grid'
                    )[1].scrollTop = 0
                } else {
                    document.getElementsByClassName(
                        'virtual-fix-grid'
                    )[0].scrollTop = 0
                }
                dispatch(
                    marketPagePaginationAllInfo({
                        pageNo: 1,
                        pageSize: paginationAll.pageSize,
                        ...sortList,
                    })
                )
                dispatch(
                    getMarketAllRefreshList({
                        pageNo: 1,
                        pageSize: paginationAll.pageSize,
                        ...sortList,
                        ...filterFilled
                    }, userInfo.level)
                )
            }
        }
    }

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [query, setQuery] = useState(filterFilled)
    const [searchMenuColor, setSearchMenuColor] = useState(false)
    const handleDatePickerChange = (dates: RangeValue<Moment>, dateStrings: string[]) => {
        setQuery({
            ...query,
            startTime: Math.floor(moment(dates![0]).valueOf()),
            endTime: Math.floor(moment(dates![1]).valueOf()),
        })
    }
    const labelSpan = locale == 'zh' ? 8 : 8
    const itemSpan = locale == 'zh' ? 16 : 16
    const handleCancel = () => {
        setIsModalVisible(false)
        getDataList({
            pageNo: 1,
            pageSize: 20,
            sortFiled: 'symbolTurnover',
            sort: 0,
            startTime: null,
            endTime: null,
            minSymbolTurnover: null,
            minHoldCount: null,
            minNetBuyCount: null,
            minAddHoldCount: null,
            minLpValue: null,
        })
    }
    const handleOk = () => {
        setIsModalVisible(false)
        getDataList({
            pageNo: 1,
            pageSize: 20,
            sortFiled: 'symbolTurnover',
            sort: 0,
            ...query
        })
    }
    const getDataList = (info: paginationOptionalList & FilterFilledList) => {
        if (document.getElementsByClassName('virtual-grid').length > 1) {
            document.getElementsByClassName('virtual-grid')[0].scrollTop = 0
            document.getElementsByClassName('virtual-grid')[1].scrollTop = 0
        } else if (document.getElementsByClassName('virtual-grid').length == 1) {
            document.getElementsByClassName('virtual-grid')[0].scrollTop = 0
        }
        if (document.getElementsByClassName('virtual-fix-grid').length > 1) {
            document.getElementsByClassName('virtual-fix-grid')[0].scrollTop = 0
            document.getElementsByClassName('virtual-fix-grid')[1].scrollTop = 0
        } else if (document.getElementsByClassName('virtual-fix-grid').length == 1) {
            document.getElementsByClassName('virtual-fix-grid')[0].scrollTop = 0
        }
        const pagination = {
            pageNo: info.pageNo,
            pageSize: info.pageSize,
            sortFiled: info.sortFiled,
            sort: info.sort,
        }
        const filter = {
            startTime: info.startTime,
            endTime: info.endTime,
            minSymbolTurnover: info.minSymbolTurnover,
            minHoldCount: info.minHoldCount,
            minNetBuyCount: info.minNetBuyCount,
            minAddHoldCount: info.minAddHoldCount,
            minLpValue: info.minLpValue,
        }
        setQuery(filter)
        dispatch(
            marketPageFilterFilled(filter)
        )
        dispatch(
            setOptionalListLoading(true)
        )
        dispatch(
            marketPagePaginationOptionalInfo(pagination)
        )
        dispatch(
            getMarketOptionalRefreshList(info, userInfo.level)
        )
        dispatch(
            setAllListLoading(true)
        )
        dispatch(
            marketPagePaginationAllInfo(pagination)
        )
        dispatch(
            getMarketAllRefreshList(info, userInfo.level)
        )
    }
    useEffect(() => {
        if (query.startTime || query.endTime || query.minSymbolTurnover || query.minHoldCount || query.minNetBuyCount || query.minAddHoldCount || query.minLpValue) {
            setSearchMenuColor(true)
        } else {
            setSearchMenuColor(false)
        }
    }, [query, current])

    return (
        <>
            <p className="defi-label">{f('label')}</p>
            <div className="market-page">
                <div className="menuBox">
                    <Menu
                        selectedKeys={[current]}
                        mode="horizontal"
                        className="top-menu"
                        onClick={menuClick}
                    >
                        <Menu.Item key={MENU_TYPE_OPTIONAL}>
                            {f('marketOptional')}
                        </Menu.Item>
                        {/* <Menu.Item key={MENU_TYPE_DISCOVER}>
                            {f('marketDiscover')}
                        </Menu.Item> */}
                        <Menu.Item key={MENU_TYPE_ALL}>{f('marketAll')}</Menu.Item>
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
                        {!userInfo.address ? (
                            <NoLogin
                                desc={f('noLoginDesc')}
                                btnText={f('login')}
                            />
                        ) : marketOptionalList.list &&
                            marketOptionalList.list.length > 0 ? (
                            <div className="common-table market-table common-dark-table">
                                <TableList
                                    loading={optionalListLoading}
                                    tableName={MENU_TYPE_OPTIONAL}
                                    groupList={marketOptionalList}
                                    handleInfiniteOnLoad={handleInfiniteOnLoad}
                                    followClick={followClick}
                                    tableSorterClick={tableSorterClick}
                                    paginationArr={paginationOptional}
                                />
                                <WaterMarkContent right={150} bottom={100} />
                                {marketOptionalList.list.length > 0 ? (
                                    !hasMoreOptional ? (
                                        <Divider className="no-more">
                                            {f('noMore')}
                                        </Divider>
                                    ) : null
                                ) : null}
                            </div>
                        ) : (
                            <div className="no-login">
                                <span>
                                    {f('noMarketOptionalSymbol')}
                                    <span
                                        style={{
                                            color: '#7377de',
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => {
                                            setCurrent(MENU_TYPE_ALL)
                                            dispatch(
                                                marketPageMenuType(MENU_TYPE_ALL)
                                            )
                                            trackAction(
                                                MARKET_PAGE.category,
                                                MARKET_PAGE.actions.market_tab,
                                                MARKET_PAGE.actions[
                                                'market_tab_marketAll'
                                                ]
                                            )
                                            dispatch(
                                                getMarketAllRefreshList({
                                                    pageNo: 1,
                                                    pageSize:
                                                        paginationAll.pageNo * paginationAll.pageSize,
                                                    sortFiled: paginationAll.sortFiled,
                                                    sort: paginationAll.sort,
                                                    ...filterFilled
                                                }, userInfo.level)
                                            )
                                        }}
                                    >
                                        {f('marketOptionalAdd')}&gt;&gt;
                                    </span>
                                </span>
                            </div>
                        )}
                    </div>
                    {/* <div className="discover-container" style={{
                            display:
                                current === MENU_TYPE_DISCOVER ? 'block' : 'none',
                        }}>
                        <Discover />
                    </div> */}
                    <div
                        className="common-table market-table common-dark-table"
                        style={{
                            display:
                                current === MENU_TYPE_ALL ? 'block' : 'none',
                        }}
                    >
                        <TableList
                            loading={allListLoading}
                            groupList={marketAllList}
                            tableName={MENU_TYPE_ALL}
                            handleInfiniteOnLoad={handleInfiniteOnLoad}
                            followClick={followClick}
                            tableSorterClick={tableSorterClick}
                            paginationArr={paginationAll}
                        />
                        <WaterMarkContent right={150} bottom={100} />
                        {marketAllList.list.length > 0 ? (
                            !hasMoreAll ? (
                                <Divider className="no-more">
                                    {f('noMore')}
                                </Divider>
                            ) : null
                        ) : null}
                    </div>
                </div>
                <ExcardModal />
            </div>
            <Modal
                visible={isModalVisible}
                forceRender
                onCancel={() => { setIsModalVisible(false) }}
                width={locale == 'zh' ? 520 : 620}
                footer={null}>
                {
                    userInfo.level == 0 ?
                        <>
                            <SubscriptionMarketPageModal />
                        </>
                        :
                        <>
                            <p className="modal-title">
                                {f('SearchMenu')}
                            </p>
                            <Row style={{ marginBottom: 16 }}>
                                <Col span={labelSpan} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end'
                                }}>
                                    {f('marketTableSymbolVolume')}：
                                </Col>
                                <Col span={itemSpan}>
                                    <InputNumber placeholder={f('searchMenuNumberPricePlaceholder')} value={query.minSymbolTurnover as number} onChange={(value) => {
                                        setQuery({
                                            ...query,
                                            minSymbolTurnover: value as number || null,
                                        })
                                    }}
                                        style={{ width: '100%' }} />
                                </Col>
                            </Row>
                            <Row style={{ marginBottom: 16 }}>
                                <Col span={labelSpan} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end'
                                }}>
                                    {f('marketDetailAccountCount')}：
                                </Col>
                                <Col span={itemSpan}>
                                    <InputNumber placeholder={f('searchMenuNumberPlaceholder')} value={query.minHoldCount as number} onChange={(value) => {
                                        setQuery({
                                            ...query,
                                            minHoldCount: value as number || null,
                                        })
                                    }}
                                        style={{ width: '100%' }} />
                                </Col>
                            </Row>
                            <Row style={{ marginBottom: 16 }}>
                                <Col span={labelSpan} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end'
                                }}>
                                    {f('marketDetailNetBuyCount')}：
                                </Col>
                                <Col span={itemSpan}>
                                    <InputNumber placeholder={f('searchMenuNumberPlaceholder')} value={query.minNetBuyCount as number} onChange={(value) => {
                                        setQuery({
                                            ...query,
                                            minNetBuyCount: value as number || null,
                                        })
                                    }}
                                        style={{ width: '100%' }} />
                                </Col>
                            </Row>
                            <Row style={{ marginBottom: 16 }}>
                                <Col span={labelSpan} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end'
                                }}>
                                    {f('marketDetailHoldIncreaseCount')}：
                                </Col>
                                <Col span={itemSpan}>
                                    <InputNumber placeholder={f('searchMenuNumberPlaceholder')} value={query.minAddHoldCount as number} onChange={(value) => {
                                        setQuery({
                                            ...query,
                                            minAddHoldCount: value as number || null,
                                        })
                                    }}
                                        style={{ width: '100%' }} />
                                </Col>
                            </Row>
                            <Row style={{ marginBottom: 16 }}>
                                <Col span={labelSpan} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end'
                                }}>
                                    {f('onlineTime')}：
                                </Col>
                                <Col span={itemSpan}>
                                    <RangePicker
                                        format={'YYYY-MM-DD'}
                                        allowClear={false}
                                        value={query.startTime ? [moment(query.startTime), moment(query.endTime)] : [] as unknown as [Moment, Moment]}
                                        onChange={handleDatePickerChange}
                                        style={{ width: '100%' }}
                                    />
                                </Col>
                            </Row>
                            <Row style={{ marginBottom: 40 }}>
                                <Col span={labelSpan} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end'
                                }}>
                                    {f('marketTableLpVolume')}：
                                </Col>
                                <Col span={itemSpan}>
                                    <InputNumber placeholder={f('searchMenuNumberPricePlaceholder')} value={query.minLpValue as number} onChange={(value) => {
                                        setQuery({
                                            ...query,
                                            minLpValue: value as number || null,
                                        })
                                    }}
                                        style={{ width: '100%' }} />
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
                        </>
                }
            </Modal>
        </>
    )
}
interface PaginationInfo {
    pageNo: number,
    pageSize: number,
    sortFiled: string | undefined,
    sort: number | string | undefined,
}
interface TableListProps {
    loading: boolean,
    groupList: ResponseBodyList<MarketPageDataList[]>,
    handleInfiniteOnLoad: (top: number) => void,
    followClick: (item: MarketPageDataList) => Promise<void>,
    tableName: string,
    tableSorterClick: (sorter: SorterResult<MarketPageDataList> | SorterResult<MarketPageDataList>[]) => void,
    paginationArr: PaginationInfo,
}

function TableList({
    loading,
    groupList,
    handleInfiniteOnLoad,
    followClick,
    tableName,
    tableSorterClick,
    paginationArr,
}: TableListProps) {
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id })
    const router = useRouter()
    const [sortedInfo, setSortedInfo] = useState<SorterResult<MarketPageDataList>>({})

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
    const handleChange = (pagination: TablePaginationConfig, filters: Record<string, (Key | boolean)[] | null>, sorter: SorterResult<MarketPageDataList> | SorterResult<MarketPageDataList>[]) => {
        if (!Array.isArray(sorter)) {
            setSortedInfo(sorter)
            tableSorterClick(sorter)
        }
    }

    const { locale = DefaultLocale } = router
    const [currentLocale, setCurrentLocale] = useState(locale);
    useEffect(() => {
        setCurrentLocale(locale);
    }, [locale]);

    let labelTotalWidth = locale === DefaultLocale ? 1640 : 1590;

    const groupFixColumns: ColumnType<MarketPageDataList>[] = [
        {
            title: '#',
            dataIndex: 'id',
            key: 'id',
            width: 60,
            align: 'center'
        },
        {
            title: f('marketTableSymbol'),
            dataIndex: 'symbol',
            key: 'symbol',
            width: 90,
            align: 'left',
        },
    ]
    const groupColumns: ColumnType<MarketPageDataList>[] = [
        {
            title: '#',
            dataIndex: 'id',
            key: 'id',
            width: 60,
            align: 'center',
        },
        {
            title: f('marketTableSymbol'),
            dataIndex: 'symbol',
            key: 'symbol',
            width: 90,
            align: 'left',
        },
        {
            title: f('marketTableNowPrice'),
            dataIndex: 'price',
            width: 90,
            key: 'price',
            align: 'left',
            showSorterTooltip: false,
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            sortOrder: sortedInfo.columnKey === 'price' ? sortedInfo.order : undefined,
        },
        {
            title: f('marketTablePriceIncrease'),
            dataIndex: 'priceIncrease',
            width: 100,
            key: 'priceIncrease',
            align: 'left',
            showSorterTooltip: false,
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            sortOrder:
                sortedInfo.columnKey === 'priceIncrease' ? sortedInfo.order : undefined,
        },
        {
            title: f('marketTableSymbolVolume'),
            dataIndex: 'symbolTurnover',
            width: 110,
            key: 'symbolTurnover',
            align: 'right',
            showSorterTooltip: false,
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            sortOrder:
                sortedInfo.columnKey === 'symbolTurnover' ? sortedInfo.order : undefined,
        },
        {
            title: f('marketIncrease'),
            dataIndex: 'symbolTurnoverIncrease',
            width: 100,
            key: 'symbolTurnoverIncrease',
            align: 'left',
            showSorterTooltip: false,
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            sortOrder:
                sortedInfo.columnKey === 'symbolTurnoverIncrease' ? sortedInfo.order : undefined,
        },
        {
            title: f('marketDetailAccountCount'),
            dataIndex: 'holdAddressCount',
            width: 110,
            key: 'holdAddressCount',
            align: 'right',
            showSorterTooltip: false,
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            sortOrder: sortedInfo.columnKey === 'holdAddressCount' ? sortedInfo.order : undefined,
        },
        {
            title: f('marketIncrease'),
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
            title: f('marketDetailNetBuyCount'),
            dataIndex: 'netBuyCount',
            width: locale === DefaultLocale ? 160 : 110,
            key: 'netBuyCount',
            align: 'right',
            showSorterTooltip: false,
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            sortOrder: sortedInfo.columnKey === 'netBuyCount' ? sortedInfo.order : undefined,
        },
        {
            title: f('marketIncrease'),
            dataIndex: 'netBuyCountIncrease',
            width: 100,
            key: 'netBuyCountIncrease',
            align: 'left',
            showSorterTooltip: false,
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            sortOrder: sortedInfo.columnKey === 'netBuyCountIncrease' ? sortedInfo.order : undefined,
        },
        {
            title: f('marketDetailHoldIncreaseCount'),
            dataIndex: 'holdIncreaseCount',
            width: 120,
            key: 'holdIncreaseCount',
            align: 'right',
            showSorterTooltip: false,
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            sortOrder: sortedInfo.columnKey === 'holdIncreaseCount' ? sortedInfo.order : undefined,
        },
        {
            title: f('marketIncrease'),
            dataIndex: 'holdCountIncrease',
            width: 100,
            key: 'holdCountIncrease',
            align: 'left',
            showSorterTooltip: false,
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            sortOrder: sortedInfo.columnKey === 'holdCountIncrease' ? sortedInfo.order : undefined,
        },
        {
            title: () => {
                return (
                    <Tooltip title={f('onlineTimeExplain')}>
                        {f('onlineTime')}
                        <QuestionCircleOutlined
                            style={{
                                fontSize: '12px',
                                marginLeft: '5px',
                                marginRight: '5px',
                                cursor: 'pointer'
                            }}
                        />
                    </Tooltip>)
            },
            dataIndex: 'onlineTime',
            width: 130,
            key: 'onlineTime',
            align: 'left',
            showSorterTooltip: false,
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            sortOrder: sortedInfo.columnKey === 'onlineTime' ? sortedInfo.order : undefined,
        },
        {
            title: f('marketTableLpVolume'),
            dataIndex: 'lpVolume',
            width: 130,
            key: 'lpVolume',
            align: 'left',
            showSorterTooltip: false,
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            sortOrder: sortedInfo.columnKey === 'lpVolume' ? sortedInfo.order : undefined,
        },
        {
            title: f('marketTableTrendPic'),
            key: 'trendList',
            align: 'left',
            width: 140,
        },
    ]
    const groupColumnsNull = [
        {
            title: '#',
            dataIndex: 'id',
            key: 'id',
            width: 60,
            align: 'center' as const,
        },
        {
            title: f('marketTableSymbol'),
            dataIndex: 'symbol',
            key: 'symbol',
            // width: 150,
            align: 'left' as const,
        },
        {
            title: f('marketTableNowPrice'),
            dataIndex: 'price',
            // width: 150,
            key: 'price',
            align: 'left' as const,
        },
        {
            title: f('marketTablePriceIncrease'),
            dataIndex: 'priceIncrease',
            // width: 150,
            key: 'priceIncrease',
            align: 'left' as const,
        },
        {
            title: f('marketTableSymbolVolume'),
            dataIndex: 'symbolTurnover',
            // width: 200,
            key: 'symbolTurnover',
            align: 'right' as const,
        },
        {
            title: f('marketIncrease'),
            dataIndex: 'symbolTurnoverIncrease',
            // width: 200,
            key: 'symbolTurnoverIncrease',
            align: 'left' as const,
        },
        {
            title: f('marketDetailAccountCount'),
            dataIndex: 'holdAddressCount',
            // width: 120,
            key: 'holdAddressCount',
            align: 'right' as const,
        },
        {
            title: f('marketIncrease'),
            dataIndex: 'holdAddressCountIncrease',
            // width: 120,
            key: 'holdAddressCountIncrease',
            align: 'left' as const,
        },
        {
            title: f('marketDetailNetBuyCount'),
            dataIndex: 'netBuyCount',
            // width: 120,
            key: 'netBuyCount',
            align: 'right' as const,
        },
        {
            title: f('marketIncrease'),
            dataIndex: 'netBuyCountIncrease',
            // width: 120,
            key: 'netBuyCountIncrease',
            align: 'left' as const,
        },
        {
            title: f('marketDetailHoldIncreaseCount'),
            dataIndex: 'holdIncreaseCount',
            // width: 120,
            key: 'holdIncreaseCount',
            align: 'right' as const,
        },
        {
            title: f('marketIncrease'),
            dataIndex: 'holdCountIncrease',
            // width: 120,
            key: 'holdCountIncrease',
            align: 'left' as const,
        },
        {
            title: () => {
                return (
                    <Tooltip title={f('onlineTimeExplain')}>
                        {f('onlineTime')}
                        <QuestionCircleOutlined
                            style={{
                                fontSize: '12px',
                                marginLeft: '5px',
                                marginRight: '5px',
                                cursor: 'pointer'
                            }}
                        />
                    </Tooltip>)
            },
            dataIndex: 'onlineTime',
            // width: 120,
            key: 'onlineTime',
            align: 'left' as const,
        },
        {
            title: f('marketTableLpVolume'),
            dataIndex: 'lpVolume',
            // width: 200,
            key: 'lpVolume',
            align: 'left' as const,
        },
        {
            title: f('marketTableTrendPic'),
            key: 'trendList',
            align: 'left' as const,
            // width: 170,
        },
    ]
    const [tableWidth, setTableWidth] = useState(0)
    const [tableHeight, setTableHeight] = useState(0)

    const gridFixRef = useRef<VariableSizeGrid | null>(null)
    const gridRef = useRef<VariableSizeGrid | null>(null)
    const [connectFixObject] = useState(() => {
        const obj = {}
        Object.defineProperty(obj, 'scrollLeft', {
            get: () => null,
            set: (scrollLeft: number) => {
                if (gridFixRef && gridFixRef.current) {
                    gridFixRef.current.scrollTo({
                        scrollLeft,
                    } as { scrollLeft: number; scrollTop: number; })
                }
            },
        })
        return obj
    })
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
    const resetFixVirtualGrid = () => {
        gridFixRef.current &&
            gridFixRef.current.resetAfterIndices({
                columnIndex: 0,
                shouldForceUpdate: true,
            } as {
                columnIndex: number;
                rowIndex: number;
                shouldForceUpdate?: boolean | undefined;
            })
    }
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
    useEffect(() => resetFixVirtualGrid, [tableWidth])
    useEffect(() => resetVirtualGrid, [locale]);
    interface aaaa {
        scrollbarSize: number;
        ref: any;
        onScroll: (info: {
            currentTarget?: HTMLElement;
            scrollLeft?: number;
        }) => void;
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
                                <span>{Global.formatBigNum(data[0].data.value)} USDT</span>
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

    // type Mutable = {
    //     -readonly [K in keyof RefObject<{
    //         scrollLeft?: number;
    //     }>]: RefObject<{
    //         scrollLeft?: number;
    //     }>[K]
    // }
    const renderFixVirtualList = (
        rawData: MarketPageDataList[], info: aaaa
    ) => {
        const { scrollbarSize, ref, onScroll } = info
        if (ref) {
            ref.current = connectFixObject
        }
        return (
            <>
                <VariableSizeGrid
                    ref={gridFixRef}
                    className="virtual-fix-grid"
                    itemKey={(params: {
                        columnIndex: number;
                        rowIndex: number;
                        data: MarketPageDataList;
                    }) => {
                        //console.log(`left|${groupList.list[params.rowIndex].symbolAddr}|column${params.columnIndex}|rowIndex${params.rowIndex}`);
                        return `left|${groupList.list[params.rowIndex].symbolAddr}|column${params.columnIndex}|rowIndex${params.rowIndex}`;
                    }}
                    columnCount={groupFixColumns.length}
                    columnWidth={(index) => {
                        return tableWidth > labelTotalWidth
                            ? tableWidth *
                            (150 / labelTotalWidth) *
                            ((groupFixColumns[index].width as number) / 150)
                            : (groupFixColumns[index].width as number)
                    }}
                    height={tableHeight - 7}
                    rowCount={groupList.list.length}
                    rowHeight={() => 50}
                    width={tableWidth > labelTotalWidth ? tableWidth * (150 / labelTotalWidth) : 150}
                    onScroll={({ scrollLeft, scrollTop }) => {
                        handleInfiniteOnLoad(scrollTop)
                        if (tableName == MENU_TYPE_OPTIONAL) {
                            document.getElementsByClassName(
                                'virtual-grid'
                            )[0].scrollTop = scrollTop
                        } else {
                            if (
                                document.getElementsByClassName('virtual-grid')
                                    .length > 1
                            ) {
                                document.getElementsByClassName(
                                    'virtual-grid'
                                )[1].scrollTop = scrollTop
                            } else {
                                document.getElementsByClassName(
                                    'virtual-grid'
                                )[0].scrollTop = scrollTop
                            }
                        }
                        onScroll({
                            scrollLeft,
                        })
                    }}
                >
                    {({ columnIndex, rowIndex, style }) => {
                        let key = groupFixColumns[columnIndex].key
                        switch (key) {
                            case 'id':
                                return (
                                    <div
                                        style={{
                                            ...style,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                        className={`virtual-grid-item ${rowIndex % 2 == 0 ? 'virtual-grid-item1' : 'virtual-grid-item2'}`}
                                    >
                                        <svg
                                            className="icon iconsItem"
                                            aria-hidden="true"
                                            onClick={() => {
                                                followClick(
                                                    groupList.list[rowIndex]
                                                )
                                            }}>
                                            <title>{!groupList.list[rowIndex].isStar ? f('marketOptionalConfirm') : f('marketOptionalCancel')}</title>
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
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'flex-start',
                                        }}
                                        className={`virtual-grid-item ${rowIndex % 2 == 0 ? 'virtual-grid-item1' : 'virtual-grid-item2'}`}
                                        onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
                                            trackAction(
                                                MARKET_PAGE.category,
                                                MARKET_PAGE.actions.market_see
                                            )
                                            Global.openNewTag(e, router, `/market-detail/market-page/${groupList.list[rowIndex].symbolAddr}`);
                                        }}
                                    >
                                        <TokenLogo
                                            className="iconsItem"
                                            src={groupList.list[rowIndex].logo}
                                            alt=''
                                            title={
                                                groupList.list[rowIndex].symbol
                                            }
                                        />
                                        <span style={{
                                            display: 'inline-block',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }} title={groupList.list[rowIndex].symbol}>
                                            &nbsp;
                                            {groupList.list[rowIndex].symbol}
                                        </span>
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


    // let timeout
    // const [timer, setTimer] = useState<number | null>(null)
    // const [classScrollbar, setClassScrollbar] = useState('');
    // const setClassName = (callback: () => void) => {
    //     if (timer) {
    //         clearTimeout(timer)
    //         timeout = null
    //         setTimer(null)
    //     }
    //     const getData = () => {
    //         callback()
    //     }
    //     timeout = window.setTimeout(getData, 800)
    //     setTimer(timeout)
    // }
    const renderVirtualList = (rawData: MarketPageDataList[], info: {
        scrollbarSize: number;
        ref: any;
        onScroll: (info: {
            currentTarget?: HTMLElement;
            scrollLeft?: number;
        }) => void;
    },) => {
        const { scrollbarSize, ref, onScroll } = info
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
                    itemKey={(params: {
                        columnIndex: number;
                        rowIndex: number;
                        data: MarketPageDataList;
                    }) => {
                        //console.log(`right|${groupList.list[params.rowIndex].symbolAddr}|column${params.columnIndex}|rowIndex${params.rowIndex}`);
                        return `right|${groupList.list[params.rowIndex].symbolAddr}|column${params.columnIndex}|rowIndex${params.rowIndex}`;
                    }}
                    height={tableHeight}
                    rowCount={groupList.list.length}
                    rowHeight={() => 50}
                    width={tableWidth}
                    onScroll={({ scrollLeft, scrollTop }) => {
                        // setClassScrollbar('virtual-grid-scrollbar')
                        // setClassName(() => {
                        //     setClassScrollbar('')
                        // })
                        handleInfiniteOnLoad(scrollTop)
                        if (tableName == MENU_TYPE_OPTIONAL) {
                            document.getElementsByClassName(
                                'virtual-fix-grid'
                            )[0].scrollTop = scrollTop
                        } else {
                            if (
                                document.getElementsByClassName(
                                    'virtual-fix-grid'
                                ).length > 1
                            ) {
                                document.getElementsByClassName(
                                    'virtual-fix-grid'
                                )[1].scrollTop = scrollTop
                            } else {
                                document.getElementsByClassName(
                                    'virtual-fix-grid'
                                )[0].scrollTop = scrollTop
                            }
                        }
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
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                        className={`virtual-grid-item ${rowIndex % 2 == 0 ? 'virtual-grid-item1' : 'virtual-grid-item2'}`}
                                    >
                                        <svg
                                            className="icon iconsItem"
                                            aria-hidden="true"
                                            onClick={() => {
                                                followClick(
                                                    groupList.list[rowIndex]
                                                )
                                            }}>
                                            <title>{!groupList.list[rowIndex].isStar ? f('marketOptionalConfirm') : f('marketOptionalCancel')}</title>
                                            <use xlinkHref={!groupList.list[rowIndex].isStar ? '#icon-collect' : '#icon-collect_active'}></use>
                                        </svg>
                                        <span style={{ width: 40, textAlign: 'center' }}>{rowIndex}</span>
                                    </div>
                                )
                            case 'symbol':
                                return (
                                    <div
                                        style={{
                                            ...style,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'flex-start',
                                        }}
                                        className={`virtual-grid-item ${rowIndex % 2 == 0 ? 'virtual-grid-item1' : 'virtual-grid-item2'}`}
                                        onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
                                            trackAction(
                                                MARKET_PAGE.category,
                                                MARKET_PAGE.actions.market_see
                                            )
                                            Global.openNewTag(e, router, `/market-detail/market-page/${groupList.list[rowIndex].symbolAddr}`);
                                        }}
                                    >
                                        <TokenLogo
                                            className="iconsItem"
                                            src={groupList.list[rowIndex].logo}
                                            alt=""
                                            title={
                                                groupList.list[rowIndex].symbol
                                            }
                                        />
                                        <span style={{
                                            display: 'inline-block',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }} title={groupList.list[rowIndex].symbol}>
                                            &nbsp;
                                            {groupList.list[rowIndex].symbol}
                                        </span>
                                    </div>
                                )
                            case 'holdAddressCount':
                                return (
                                    <div
                                        style={{
                                            ...style,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'flex-end'
                                        }}
                                        className={`virtual-grid-item ${rowIndex % 2 == 0 ? 'virtual-grid-item1' : 'virtual-grid-item2'}`}
                                        onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
                                            trackAction(
                                                MARKET_PAGE.category,
                                                MARKET_PAGE.actions.market_see
                                            )
                                            Global.openNewTag(e, router, `/market-detail/market-page/${groupList.list[rowIndex].symbolAddr}`);
                                        }}
                                    >
                                        <span>{groupList.list[rowIndex].holdAddressCount}</span>
                                        &nbsp;
                                    </div>
                                )
                            case 'holdAddressCountIncrease':
                                return (
                                    <div
                                        style={{
                                            ...style,
                                            display: 'flex',
                                            alignItems: 'center',

                                        }}
                                        className={`virtual-grid-item ${rowIndex % 2 == 0 ? 'virtual-grid-item1' : 'virtual-grid-item2'}`}
                                        onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
                                            trackAction(
                                                MARKET_PAGE.category,
                                                MARKET_PAGE.actions.market_see
                                            )
                                            Global.openNewTag(e, router, `/market-detail/market-page/${groupList.list[rowIndex].symbolAddr}`);
                                        }}
                                    >
                                        {Global.formatIncreaseNumber(groupList.list[rowIndex].holdAddressCountIncrease)}
                                    </div>
                                )
                            case 'netBuyCount':
                                return (
                                    <div
                                        style={{
                                            ...style,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'flex-end'
                                        }}
                                        className={`virtual-grid-item ${rowIndex % 2 == 0 ? 'virtual-grid-item1' : 'virtual-grid-item2'}`}
                                        onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
                                            trackAction(
                                                MARKET_PAGE.category,
                                                MARKET_PAGE.actions.market_see
                                            )
                                            Global.openNewTag(e, router, `/market-detail/market-page/${groupList.list[rowIndex].symbolAddr}`);
                                        }}
                                    >
                                        {Global.formatBigNum(groupList.list[rowIndex].netBuyCount)}
                                        &nbsp;
                                    </div>
                                )
                            case 'netBuyCountIncrease':
                                return (
                                    <div
                                        style={{
                                            ...style,
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                        className={`virtual-grid-item ${rowIndex % 2 == 0 ? 'virtual-grid-item1' : 'virtual-grid-item2'}`}
                                        onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
                                            trackAction(
                                                MARKET_PAGE.category,
                                                MARKET_PAGE.actions.market_see
                                            )
                                            Global.openNewTag(e, router, `/market-detail/market-page/${groupList.list[rowIndex].symbolAddr}`);
                                        }}
                                    >
                                        {Global.formatIncreaseNumber(groupList.list[rowIndex].netBuyCountIncrease)}
                                    </div>
                                )
                            case 'holdIncreaseCount':
                                return (
                                    <div
                                        style={{
                                            ...style,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'flex-end'
                                        }}
                                        className={`virtual-grid-item ${rowIndex % 2 == 0 ? 'virtual-grid-item1' : 'virtual-grid-item2'}`}
                                        onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
                                            trackAction(
                                                MARKET_PAGE.category,
                                                MARKET_PAGE.actions.market_see
                                            )
                                            Global.openNewTag(e, router, `/market-detail/market-page/${groupList.list[rowIndex].symbolAddr}`);
                                        }}
                                    >
                                        {Global.formatBigNum(groupList.list[rowIndex].holdIncreaseCount)}
                                        &nbsp;
                                    </div>
                                )
                            case 'holdCountIncrease':
                                return (
                                    <div
                                        style={{
                                            ...style,
                                            display: 'flex',
                                            alignItems: 'center',

                                        }}
                                        className={`virtual-grid-item ${rowIndex % 2 == 0 ? 'virtual-grid-item1' : 'virtual-grid-item2'}`}
                                        onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
                                            trackAction(
                                                MARKET_PAGE.category,
                                                MARKET_PAGE.actions.market_see
                                            )
                                            Global.openNewTag(e, router, `/market-detail/market-page/${groupList.list[rowIndex].symbolAddr}`);
                                        }}
                                    >
                                        {Global.formatIncreaseNumber(groupList.list[rowIndex].holdCountIncrease)}
                                    </div>
                                )
                            case 'onlineTime':
                                return (
                                    <div
                                        style={{
                                            ...style,
                                            display: 'flex',
                                            alignItems: 'center',

                                        }}
                                        className={`virtual-grid-item ${rowIndex % 2 == 0 ? 'virtual-grid-item1' : 'virtual-grid-item2'}`}
                                        onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
                                            trackAction(
                                                MARKET_PAGE.category,
                                                MARKET_PAGE.actions.market_see
                                            )
                                            Global.openNewTag(e, router, `/market-detail/market-page/${groupList.list[rowIndex].symbolAddr}`);
                                        }}
                                    >
                                        {Global.distanceFromCurrent(groupList.list[rowIndex].onlineTime, currentLocale, true)}
                                    </div>
                                )
                            case 'price':
                                return (
                                    <div
                                        style={{
                                            ...style,
                                            display: 'flex',
                                            alignItems: 'center',

                                        }}
                                        className={`virtual-grid-item ${rowIndex % 2 == 0 ? 'virtual-grid-item1' : 'virtual-grid-item2'}`}
                                        onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
                                            trackAction(
                                                MARKET_PAGE.category,
                                                MARKET_PAGE.actions.market_see
                                            )
                                            Global.openNewTag(e, router, `/market-detail/market-page/${groupList.list[rowIndex].symbolAddr}`);
                                        }}
                                    >
                                        {groupList.list[rowIndex].price
                                            .toLowerCase()
                                            .includes('e')
                                            ? `$ ${groupList.list[rowIndex].price}`
                                            : Number(groupList.list[rowIndex].price) > 10000000000 ? 'N/A' : `$ ${Global.formatBigNum(
                                                groupList.list[rowIndex].price
                                            )}`}
                                    </div>
                                )
                            case 'priceIncrease':
                                return (
                                    <div
                                        style={{
                                            ...style,
                                            display: 'flex',
                                            alignItems: 'center',

                                        }}
                                        className={`virtual-grid-item ${rowIndex % 2 == 0 ? 'virtual-grid-item1' : 'virtual-grid-item2'}`}
                                        onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
                                            trackAction(
                                                MARKET_PAGE.category,
                                                MARKET_PAGE.actions.market_see
                                            )
                                            Global.openNewTag(e, router, `/market-detail/market-page/${groupList.list[rowIndex].symbolAddr}`);
                                        }}
                                    >
                                        {Global.formatIncreaseNumber(groupList.list[rowIndex].priceIncrease)}
                                    </div>
                                )
                            case 'symbolTurnover':
                                return (
                                    <div
                                        style={{
                                            ...style,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'flex-end'
                                        }}
                                        className={`virtual-grid-item ${rowIndex % 2 == 0 ? 'virtual-grid-item1' : 'virtual-grid-item2'}`}
                                        onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
                                            trackAction(
                                                MARKET_PAGE.category,
                                                MARKET_PAGE.actions.market_see
                                            )
                                            Global.openNewTag(e, router, `/market-detail/market-page/${groupList.list[rowIndex].symbolAddr}`);
                                        }}
                                    >
                                        {'$ ' + Global.formatBigNum(
                                            groupList.list[rowIndex]
                                                .symbolTurnover
                                        )}
                                        &nbsp;
                                    </div>
                                )
                            case 'symbolTurnoverIncrease':
                                return (
                                    <div
                                        style={{
                                            ...style,
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                        className={`virtual-grid-item ${rowIndex % 2 == 0 ? 'virtual-grid-item1' : 'virtual-grid-item2'}`}
                                        onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
                                            trackAction(
                                                MARKET_PAGE.category,
                                                MARKET_PAGE.actions.market_see
                                            )
                                            Global.openNewTag(e, router, `/market-detail/market-page/${groupList.list[rowIndex].symbolAddr}`);
                                        }}
                                    >
                                        {Global.formatIncreaseNumber(groupList.list[rowIndex].symbolTurnoverIncrease)}
                                    </div>
                                )
                            case 'lpVolume':
                                return (
                                    <div
                                        style={{
                                            ...style,
                                            display: 'flex',
                                            alignItems: 'center',

                                        }}
                                        className={`virtual-grid-item ${rowIndex % 2 == 0 ? 'virtual-grid-item1' : 'virtual-grid-item2'}`}
                                        onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
                                            trackAction(
                                                MARKET_PAGE.category,
                                                MARKET_PAGE.actions.market_see
                                            )
                                            Global.openNewTag(e, router, `/market-detail/market-page/${groupList.list[rowIndex].symbolAddr}`);
                                        }}
                                    >
                                        {'$ ' +
                                            Global.formatBigNum(
                                                groupList.list[rowIndex]
                                                    .lpVolume
                                            )}
                                    </div>
                                )
                            case 'trendList':
                                return (
                                    <div
                                        style={{
                                            ...style,
                                            display: 'flex',
                                            alignItems: 'center',

                                        }}
                                        className={`virtual-grid-item ${rowIndex % 2 == 0 ? 'virtual-grid-item1' : 'virtual-grid-item2'}`}
                                    >

                                        {
                                            groupList.list[rowIndex].trendList !== null && groupList.list[rowIndex].trendList.length > 0 ?
                                                <Line
                                                    {...getConfig(groupList.list[rowIndex].trendList, groupList.list[rowIndex].priceIncrease)}
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
                                        {/* <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',

                                            }}
                                        >
                                            {groupList.list[rowIndex]
                                                .trendList ? (
                                                <Image
                                                    unoptimized
                                                    priority
                                                    src={
                                                        groupList.list[rowIndex]
                                                            .trendList
                                                    }
                                                    alt=""
                                                    width={120}
                                                    height={48}
                                                />
                                                // <img src={
                                                //     groupList.list[rowIndex]
                                                //         .trendList
                                                // } alt="" style={{ width: 120, height: 48 }} />
                                            ) : null}
                                        </div> */}
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
    const antIcon = <></>

    return (
        <>
            <ResizeObserver
                onResize={({ width, height }) => {
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
                        rowKey="symbolAddr"
                        columns={groupColumns}
                        pagination={false}
                        dataSource={groupList.list}
                        loading={loading}
                        onChange={handleChange}
                        scroll={{ y: 400, x: '1480px' }}
                        components={{
                            body: renderVirtualList as CustomizeScrollBody<MarketPageDataList>,
                        }}
                    />
                ) : (
                    <Table
                        rowKey="symbolAddr"
                        columns={groupColumnsNull}
                        pagination={false}
                        dataSource={groupList.list}
                        loading={loading}
                    // scroll={{ y: 400, x: '1190px' }}
                    />
                )}
            </ResizeObserver>
            {groupList.list.length > 0 ? (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        zIndex: 900,
                        width:
                            tableWidth > labelTotalWidth ? tableWidth * (150 / labelTotalWidth) : 150,
                    }}
                >
                    <ResizeObserver>
                        <Table
                            rowKey="symbolAddr"
                            columns={groupFixColumns}
                            pagination={false}
                            dataSource={groupList.list}
                            loading={{
                                indicator: antIcon,
                                spinning: loading,
                            }}
                            scroll={{ y: 400, x: '180px' }}
                            components={{
                                body: renderFixVirtualList as CustomizeScrollBody<MarketPageDataList>,
                            }}
                        />
                    </ResizeObserver>
                </div>
            ) : null}
        </>
    )
}
