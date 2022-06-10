import React, { useState, useEffect, SyntheticEvent } from 'react'
import { useIntl } from 'react-intl'
import { Select, Button, message, Modal, InputNumber, List, Progress, Spin, Input, Affix, Skeleton, Tooltip } from 'antd'
const { Option } = Select
import 'styles/chanceWarning.less'
import { useRouter } from 'next/router'
import NoLogin from 'components/NoLogin'
import Global from 'utils/Global'
import moment from 'moment'
import {
    ExclamationCircleOutlined,
} from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import {
    getWarningAddrList,
    getWarningLogList,
    getWarningStatistics,
    setWarningItemIndex,
    setWarningLogCondition,
    markAllWarningLogReaded,
    markOneWarningLogReaded,
    getWarningSymbolList
} from 'redux/actions/ChanceWarningAction'
import { isUserLogined } from 'utils/storage'
import { trackAction, trackPage, CHANCE_WARNING } from 'utils/analyse/YMAnalyse'
import AddWarning from 'components/AddWarning'
import { AppState } from 'redux/reducers'
import type { SearchInfo, WarningDataResponse, WarningData, WarningDataItem, InnerData, WarnSymbol } from 'redux/types/ChanceWarningTypes'
import ApiClient from 'utils/ApiClient'
import type { WarningAddressItem } from 'redux/types/SetWarningTypes'
import InfiniteScroll from 'react-infinite-scroller';
import { DefaultLocale, NOT_A_NUMBER } from 'utils/env'
import type { OptionsType, OptionData, OptionGroupData } from 'rc-select/lib/interface'
import { getLogDetail } from 'utils/WarnLogDetailLruCache'
import { TokenLogo } from 'components/TokenLogo'
import SubscriptionWarning from 'components/Subscription/warning'
import WaterMarkContent from 'components/WaterMarkContent'
import { QuestionCircleOutlined,DownOutlined,UpOutlined } from '@ant-design/icons'

export default function chanceWarning() {
    useEffect(() => {
        
        trackPage(CHANCE_WARNING.url)
    }, [])
    
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id })
    const userInfo = useSelector((state: AppState) => state.userInfo)
    const dispatch = useDispatch()

    const handleBgClick = (e: SyntheticEvent) => {
        dispatch(setWarningItemIndex(-1))
    }

    const [isLogin, setLogin] = useState(false)
    useEffect(() => {
        
        setLogin(isUserLogined())
    }, [userInfo.address])

    return (
        <>
            <div className="chance-warning" onClick={handleBgClick}>
                {
                    !isLogin ? (<NoLogin
                        desc={f('noLoginDesc1')}
                        btnText={f('login')}
                    />) :
                        (<>
                            <UnreadMessages />
                            <WaterMarkContent position='fixed' />
                        </>)
                }
            </div>
        </>
    )
}

function UnreadNumbersHeader({ unreadWarnCount, setAmountCount, unreadAmountCount }: { unreadWarnCount: number, setAmountCount: number, unreadAmountCount: number }) {
    const { formatMessage } = useIntl();
    const f = (id: string) => formatMessage({ id })
    const router = useRouter();
    const handleClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        Global.openNewTag(e, router, '/address-combination/1');
    }
    const warnLogCondition = useSelector(
        (state: AppState) => state.chanceWarning.warnLogCondition
    )
    const dispatch = useDispatch();
    const handleUnreadClick = () => {
        dispatch(setWarningLogCondition({
            ...warnLogCondition,
            isView: '1',
            pageNo: 1,
        }))
    }
    return (
        <div className="unread-numbers-header">
            <p>{f('label')}</p>
            <div className="blocks">
                <div className="unread-total block" onClick={handleUnreadClick}>
                    <div className="block-title">{f('unreadNumber')}</div>
                    <div className="block-number">{unreadWarnCount > 99 ? '99+' : unreadWarnCount}</div>
                </div>
                <div className="unread-accounts block" onClick={handleUnreadClick}>
                    <div className="block-title">{f('unreadAccount')}</div>
                    <div className="block-number">{unreadAmountCount > 99 ? '99+' : unreadAmountCount}</div>
                </div>
                <div className="set-accounts block" onClick={handleClick}>
                    <div className="block-title">{f('settedAccount')}</div>
                    <div className="block-number">{setAmountCount > 99 ? '99+' : setAmountCount}</div>
                </div>
            </div>
        </div>
    );
}

function UnreadMessages() {
    const router = useRouter()
    const { locale = DefaultLocale, query } = router;
    const { filters } = query;
    const { formatMessage } = useIntl();
    const f = (id: string) => formatMessage({ id })
    const dispatch = useDispatch()
    
    const warnLogCondition = useSelector(
        (state: AppState) => state.chanceWarning.warnLogCondition
    )

    const warnListHasMore = useSelector(
        (state: AppState) => state.chanceWarning.warnListHasMore
    )

    const warningLoading = useSelector(
        (state: AppState) => state.chanceWarning.warningLoading
    )

    const selectedWarningItem = useSelector(
        (state: AppState) => state.chanceWarning.selectedWarnItemIndex
    )

    const warningData = useSelector((state: AppState) => state.chanceWarning.warningData)
    const userInfo = useSelector((state: AppState) => state.userInfo)
    useEffect(() => {
        if (userInfo.address) {
            dispatch(getWarningAddrList())
            dispatch(getWarningSymbolList());
            dispatch(getWarningStatistics());
        }
    }, [userInfo.address])
    useEffect(() => {
        if (userInfo.address) {
            if (!isFilterEmpty(filters)) {
                dispatch(setWarningLogCondition({
                    ...warnLogCondition,
                    addressTag: filters![0],
                    isView: '1'
                }));
                router.replace('/chance-warning', undefined, { shallow: true });
            } else {
                dispatch(getWarningLogList(warnLogCondition))
            }
        }
    }, [userInfo.address, warnLogCondition, filters]);
    
    useEffect(() => {
        if (userInfo.address && router.query.refresh) {
            dispatch(setWarningLogCondition({ ...warnLogCondition, pageNo: 1 }))
        }
    }, [router.query.refresh, userInfo.address])
    
    const isFilterEmpty = (filters: undefined | string[] | string) => {
        return typeof filters === 'undefined' || !Array.isArray(filters) || (Array.isArray(filters) && filters[0] === '[[...filters]]');
    }
    useEffect(() => {
        if (!isFilterEmpty(filters)) {
            dispatch(setWarningLogCondition({
                ...warnLogCondition,
                addressTag: filters![0],
                isView: '1'
            }));
        }
    }, [filters]);

    const warningAddrList = useSelector(
        (state: AppState) => state.chanceWarning.warningAddrList ? state.chanceWarning.warningAddrList.innerData : []
    )

    const warningSymbolList = useSelector((state: AppState) => state.chanceWarning.warningSymbolList);

    const [listHeight, setListHeight] = useState(200);
    useEffect(() => {
        setListHeight(window.document.body.clientHeight - 80);
    }, []);

    const handleInfiniteOnLoad = () => {
        if (!warningLoading) {
            dispatch(setWarningLogCondition({
                ...warnLogCondition,
                pageNo: warnLogCondition.pageNo! + 1,
            }));
        }
    }

    
    const [markAllReadedLoading, setMarkAllReadedLoading] = useState<boolean>(false);
    const markAllReadedHandler = async (e: SyntheticEvent) => {
        e.stopPropagation();
        const apiClient = new ApiClient();
        try {
            setMarkAllReadedLoading(true);
            await apiClient.post('warn/clear/read', {
                data: {
                    ids: []
                }
            });
            setMarkAllReadedLoading(false);
            dispatch(markAllWarningLogReaded());
            message.success(f('success'));
        } catch (e) {
            setMarkAllReadedLoading(false);
        }
    }

      
    const [addWarningShow, setAddWarningShow] = useState(false)
    const [newWarningDetail, setNewWarningDetail] = useState({
        groupId: null,
        warnTypeList: [],
        symbolLimit: 0,
        symbolAddress: '',
        symbol: '',
        accountForce: '',
        warnWay: [1, 2],
    })

    const addWarningClickCallback = async (e: SyntheticEvent) => {
        e.stopPropagation();
        trackAction(
            CHANCE_WARNING.category,
            CHANCE_WARNING.actions.attention_add
        )

        try {
            setNewAlertLoading(true);
            const data = await apiClient.post(`/warn/follow/list/all`);
            const items = data.data;
            setWarningAddressList(items);
            if (items.length === 0) {
                Modal.confirm({
                    title: f('addWarningNoAddrTips'),
                    icon: <ExclamationCircleOutlined />,
                    onOk() {
                        router.push('/address-combination')
                    },
                    onCancel() {
                    },
                })
            } else {
                setAddWarningShow(true)
            }
        } catch (e) {
            message.error(f('sysErr'));
        } finally {
            setNewAlertLoading(false);
        }
    }

    const onClose = () => {
        setAddWarningShow(false)
    }

    const apiClient = new ApiClient<WarningAddressItem[]>();
    const [isNewAlertLoading, setNewAlertLoading] = useState<boolean>(false);
    const [warningAddressList, setWarningAddressList] = useState<WarningAddressItem[]>([]);

    const handleListItemClick = (index: number, e: SyntheticEvent) => {
        e.stopPropagation();
        dispatch(setWarningItemIndex(index))
        if (warningData.list !== null && warningData.list[index].isView === 0) {
            dispatch(markOneWarningLogReaded(warningData.list[index].id));
        }
    }

    const [thresholdId, setThresholdId] = useState(0);

    const [moneyValue, setMoneyValue] = useState(warnLogCondition.money);
    const [onlineDaysValue, setOnlineDaysValue] = useState(warnLogCondition.days);

    const handleInputChange = (type: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        let numberValue = '0';
        if (!isNaN(Number(value))) {
            if (Number(value) < 0) {
                numberValue = '0';
            } else {
                numberValue = value;
            }
        } else {
            numberValue = value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
        }

        if (type === 0) {
            setMoneyValue(numberValue);
        } else {
            setOnlineDaysValue(numberValue);
        }

        if (thresholdId !== 0) {
            clearTimeout(thresholdId);
        }
        const id = window.setTimeout(() => {
            if (type === 0) {
                if (numberValue !== warnLogCondition.money) {
                      
                    dispatch(setWarningLogCondition({
                        ...warnLogCondition,
                        money: numberValue,
                        pageNo: 1,
                    }))
                }
            } else {
                if (numberValue !== warnLogCondition.days) {
                      
                    dispatch(setWarningLogCondition({
                        ...warnLogCondition,
                        days: numberValue,
                        pageNo: 1,
                    }))
                }
            }

        }, 250);
        setThresholdId(id);
    }

    const statistics = useSelector((state: AppState) => state.chanceWarning.statistics);

    const [container, setContainer] = useState<HTMLDivElement | null>(null);

    return (
        <div className="unread-messages-list">
            <div className="infinite-container" style={{ height: listHeight, overflow: 'auto' }} ref={setContainer}>
                <InfiniteScroll
                    initialLoad={false}
                    pageStart={0}
                    loadMore={handleInfiniteOnLoad}
                    hasMore={warnListHasMore}
                    useWindow={false}
                    loader={
                        warnLogCondition.pageNo! > 1 ?
                            <div className="loading-container" key="loader">
                                <Spin />
                            </div> : undefined}
                >
                    <List
                        loading={warningLoading && warnLogCondition.pageNo === 1}
                        dataSource={warningData.list === null ? [] : warningData.list}
                        renderItem={(item: WarningDataItem, index: number) => (
                            <List.Item key={index} onClick={handleListItemClick.bind(null, index)}>
                                <WarnItem index={index} warnItem={item} selected={selectedWarningItem === index} />
                            </List.Item>
                        )}
                        header={
                            <>
                                <UnreadNumbersHeader
                                    unreadAmountCount={statistics.unreadAmountCount}
                                    unreadWarnCount={statistics.unreadWarnCount}
                                    setAmountCount={statistics.setAmountCount} />
                                {userInfo.level != 1 ? <SubscriptionWarning /> : null}
                                <p className="title" style={{ marginTop: 30 }}>{f('alertList')}</p>
                                <Affix target={() => container}>
                                    <div className="selects">
                                        <Select
                                            value={warnLogCondition.addressTag}
                                            style={{
                                                width: 160,
                                                marginRight: '20px',
                                            }}
                                            onChange={(value: string) => {
                                                dispatch(setWarningLogCondition({
                                                    ...warnLogCondition,
                                                    addressTag: value,
                                                    pageNo: 1,
                                                }))
                                            }}
                                            showSearch={true}
                                        >
                                            <Option value={'0'} key={0}>
                                                {f('allAddress')}
                                            </Option>
                                            {warningAddrList && warningAddrList.map((item: InnerData) => {
                                                return (
                                                    <Option
                                                        value={item.addressTag}
                                                        key={item.addressTag}
                                                    >
                                                        {item.addressTag}
                                                    </Option>
                                                )
                                            })}
                                        </Select>

                                        <Select
                                            value={warnLogCondition.symbolName}
                                            style={{
                                                width: 160,
                                                marginRight: '20px',
                                            }}
                                            onChange={(value: string, option: OptionsType | OptionData | OptionGroupData) => {
                                                const inputValue = typeof value === 'undefined' ? '0' : value;
                                                dispatch(setWarningLogCondition({
                                                    ...warnLogCondition,
                                                    symbolName: inputValue,
                                                    symbolAddr: inputValue === '0' ? undefined : ((option! as OptionData).key! as string).split('|')[0],
                                                    pageNo: 1,
                                                }))
                                            }}
                                            showSearch={true}
                                            allowClear={true}
                                        >
                                            <Option value={'0'} key={0}>
                                                {f('allToken')}
                                            </Option>
                                            {warningSymbolList && warningSymbolList.map((item: WarnSymbol) => {
                                                return (
                                                    <Option
                                                        value={`${item.symbolAddr}|${item.symbolName}`}
                                                        key={`${item.symbolAddr}|${item.symbolName}`}
                                                    >
                                                        <TokenLogo style={{ width: 16, height: 16, marginRight: 10 }} src={item.symbolLogo} />{item.symbolName}
                                                    </Option>
                                                )
                                            })}
                                        </Select>

                                        <Select
                                            value={warnLogCondition.warnType}
                                            style={{
                                                width: locale === DefaultLocale ? 140 : 100,
                                                marginRight: 20
                                            }}
                                            onChange={(value) => {
                                                dispatch(setWarningLogCondition({
                                                    ...warnLogCondition,
                                                    warnType: value,
                                                    pageNo: 1,
                                                }))
                                            }}
                                        >
                                            <Option value={'0'}>{f('allType')}</Option>
                                            <Option value="1">{f('warnType1')}</Option>
                                            <Option value="2">{f('warnType2')}</Option>
                                            <Option value="3">{f('warnType3')}</Option>
                                            <Option value="4">{f('warnType4')}</Option>
                                            <Option value="5">{f('warnType5')}</Option>
                                            <Option value="6">{f('warnType6')}</Option>
                                            <Option value="7">{f('warnType7')}</Option>
                                            <Option value="8">{f('warnType8')}</Option>
                                            <Option value="9">{f('warnType9')}</Option>
                                            <Option value="10">{f('warnType10')}</Option>
                                        </Select>

                                        <Select
                                            value={warnLogCondition.isView}
                                            style={{
                                                width: 100,
                                                marginRight: 20
                                            }}
                                            onChange={(value) => {
                                                dispatch(setWarningLogCondition({
                                                    ...warnLogCondition,
                                                    isView: value,
                                                    pageNo: 1,
                                                }))
                                            }}
                                        >
                                            <Option value="0">{f('allStatus')}</Option>
                                            <Option value="2">{f('readed')}</Option>
                                            <Option value="1">{f('unread')}</Option>
                                        </Select>

                                        <Input
                                            value={moneyValue}
                                            style={{ width: 100, marginRight: 20 }}
                                            min={0}
                                            placeholder={f('moneyPlaceHolder')}
                                            onChange={handleInputChange.bind(null, 0)}
                                        />

                                        <Input
                                            value={onlineDaysValue}
                                            style={{ width: 100 }}
                                            min={0}
                                            placeholder={f('onlineTimePlaceHolder')}
                                            onChange={handleInputChange.bind(null, 1)}
                                        />

                                        <div className="right-buttons">
                                            <Button
                                                type="primary"
                                                style={{ marginRight: 30 }}
                                                loading={isNewAlertLoading}
                                                onClick={addWarningClickCallback}
                                            >{f('addWarning')}</Button>
                                            <Button
                                                type="text"
                                                className="all-set-readed-button"
                                                onClick={markAllReadedHandler}
                                                loading={markAllReadedLoading}
                                            >{f('allSetReaded')}</Button>
                                            <svg
                                                className="icon"
                                                aria-hidden="true"
                                                style={{
                                                    width: 20,
                                                    height: 20,
                                                    marginLeft: 30,
                                                    cursor: 'pointer'
                                                }}
                                                onClick={(event) => {
                                                    Global.openNewTag(event, router, '/user-setting');
                                                }}
                                            >
                                                <use xlinkHref='#icon-go-warning-setting'></use>
                                            </svg>
                                        </div>
                                    </div>

                                    <div className="list-header">
                                        <div className="list-header-item">
                                            <span>{f('time')}</span>
                                        </div>
                                        <div className="list-header-item">
                                            <span>{f('addressTag')}</span>
                                        </div>
                                        <div className="list-header-item">{f('warnType')}</div>
                                        <div className="list-header-item-2">{f('symbol')}</div>
                                        {/* <div className="list-header-item">{f('symbolNum')}</div> */}
                                        <div className="list-header-item">{f('totalMoney')}</div>
                                        <div className="list-header-item">
                                            <Tooltip title={f('onlineTimeExplain')}>
                                                {f('onlineTime')}
                                                <QuestionCircleOutlined
                                                    style={{
                                                        fontSize: '12px',
                                                        marginLeft: '5px',
                                                        cursor: 'pointer'
                                                    }}
                                                />
                                            </Tooltip>
                                        </div>
                                        <div className="list-header-item">{f('singlePrice')}</div>
                                    </div>
                                </Affix>
                            </>}
                    >
                    </List>
                </InfiniteScroll>
            </div>
            <AddWarning
                addressList={warningAddressList}
                data={newWarningDetail}
                onShow={addWarningShow}
                onClose={onClose}
            />
        </div>
    );
}

function WarnItem({ index, warnItem, selected }: { index: number, warnItem: WarningDataItem, selected: boolean }) {
    const itemClassName = selected ? 'warn-item warn-item-selected' : 'warn-item';
    const column1ClassName = selected ? 'column1 column1-selected' : 'column1 column1-unselected';
    const { formatMessage } = useIntl();
    const f = (id: string) => formatMessage({ id })
    let warnTypeString = '';
    let warnTypeIconfont = '';
    if (warnItem.warnType === 1) {
        warnTypeString = f('warnType1');
        warnTypeIconfont = 'icon-shoucimairu';
    } else if (warnItem.warnType === 2) {
        warnTypeString = f('warnType2');
        warnTypeIconfont = 'icon-daemairu';
    } else if (warnItem.warnType === 3) {
        warnTypeString = f('warnType3');
        warnTypeIconfont = 'icon-daemaichu';
    } else if (warnItem.warnType === 4) {
        warnTypeString = f('warnType4');
        warnTypeIconfont = 'icon-daezhuanru';
    } else if (warnItem.warnType === 5) {
        warnTypeString = f('warnType5');
        warnTypeIconfont = 'icon-daezhuanchu';
    } else if (warnItem.warnType === 6) {
        warnTypeString = f('warnType6');
        warnTypeIconfont = 'icon-zengchi';
    } else if (warnItem.warnType === 7) {
        warnTypeString = f('warnType7');
        warnTypeIconfont = 'icon-jianchi';
    } else if (warnItem.warnType === 8) {
        warnTypeString = f('warnType8');
        warnTypeIconfont = 'icon-chuangjiandizhi';
    } else if (warnItem.warnType === 9) {
        warnTypeString = f('warnType9');
        warnTypeIconfont = 'icon-add-lp';
    } else if (warnItem.warnType === 10) {
        warnTypeString = f('warnType10');
        warnTypeIconfont = 'icon-remove-lp';
    }

    const router = useRouter();
    const onAddressTagClick = (address: string, groupId: number, e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.stopPropagation();
        Global.openNewTag(e, router, `/address-analyse/${address}/${groupId}`);
    }

    const [loading, setLoading] = useState(false);
    const [logDetailData, setLogDetailData] = useState<LogDetail>({
        ethUrl: '',
        costPrice: '',
        averagePrice: '',
        walletBalance: '',
        walletValue: '',
        txHash: '',
        symbolBuyNum: '',
        position: ''
    });

    useEffect(() => {
        if (selected) {
            setLoading(true);
            getLogDetail(warnItem.id).then(data => {
                setLoading(false);
                setLogDetailData(data.data);
            }, e => {
                setLoading(false);
                message.error(f('sysErr'));
            });
        }
    }, [selected]);

    return (
        <div className={itemClassName}>
            <div className={column1ClassName}>
                <div className="column1-item" style={{ justifyContent: 'center' }}>
                    <div className="unread-mark" style={{ visibility: warnItem.isView === 0 ? 'visible' : 'hidden' }}></div>
                    <div style={{ paddingLeft: 10 }}>{moment(warnItem.time).format('MM-DD HH:mm')}</div>
                </div>
                <div className="column1-item" style={{
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }} onClick={onAddressTagClick.bind(null, warnItem.address, warnItem.groupId)}>
                    <div title={warnItem.addressTag} style={{
                        width: '100%',
                        paddingLeft: 20,
                        paddingRight: 20,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textAlign: 'center',
                        textOverflow: 'ellipsis'
                    }}>{warnItem.addressTag}</div>
                </div>
                <div className="column1-item">
                    <svg
                        className="icon"
                        aria-hidden="true"
                        style={{
                            width: '16px',
                            height: '16px',
                            marginRight: '10px'
                        }}
                    >
                        <use xlinkHref={`#${warnTypeIconfont}`}></use>
                    </svg>
                    {warnTypeString}
                </div>
                <div className="column2-item">
                    {warnItem.warnType === 8 ? 'N/A' :
                        warnItem.warnType === 9 || warnItem.warnType === 10 ?
                            <>
                                <div className='defi-flex defi-align-center'>
                                    <img src={warnItem.symbolLogo} style={{ width: 14, height: 14, marginRight: 5, borderRadius: 50 }} />
                                    <div>{Global.formatBigNum(warnItem.symbolNum)}</div>
                                    <div>&nbsp;{warnItem.symbol}</div>
                                    {warnItem.isVerified === false ?
                                        <Tooltip
                                            placement="top"
                                            title={f('warningNotOpenSource')}
                                        >
                                            <ExclamationCircleOutlined style={{ marginLeft: 5, fontSize: '14px' }} />
                                        </Tooltip> : ''}
                                </div>
                                <div style={{margin: '-5px 0'}}>
                                    +
                                </div>
                                <div className='defi-flex defi-align-center'>
                                    <img src={warnItem.otherSymbolLogo} style={{ width: 14, height: 14, marginRight: 5, borderRadius: 50 }} />
                                    <div>{Global.formatBigNum(warnItem.otherSymbolNum)}</div>
                                    <div>&nbsp;{warnItem.otherSymbol}</div>
                                    {warnItem.otherSymbolIsVerified === false ?
                                        <Tooltip
                                            placement="top"
                                            title={f('warningNotOpenSource')}
                                        >
                                            <ExclamationCircleOutlined style={{ marginLeft: 5, fontSize: '14px' }} />
                                        </Tooltip> : ''}
                                </div>
                            </>
                            :
                            <div className='defi-flex defi-align-center' >
                                <img src={warnItem.symbolLogo} style={{ width: 14, height: 14, marginRight: 5, borderRadius: 50 }} />
                                <div>{Global.formatBigNum(warnItem.symbolNum)}</div>
                                <div>&nbsp;{warnItem.symbol}</div>
                                {warnItem.isVerified === false ?
                                    <Tooltip
                                        placement="top"
                                        title={f('warningNotOpenSource')}
                                    >
                                        <ExclamationCircleOutlined style={{ marginLeft: 5, fontSize: '14px' }} />
                                    </Tooltip> : ''}
                            </div>}
                </div>
                {/* <div className="column1-item">
                    {warnItem.warnType === 8 ? 'N/A' : Global.formatBigNum(warnItem.symbolNum)}
                </div> */}
                <div className="column1-item">
                    {warnItem.warnType === 8 ? 'N/A' : <>$&nbsp;{Global.formatBigNum(warnItem.totalMoney)}</>}
                </div>
                <div className="column1-item">
                    <>{warnItem.days === null ? NOT_A_NUMBER : `${warnItem.days}${f('unit4')}`}</>
                </div>
                <div className="column1-item" style={{justifyContent: 'end'}}>
                    {Global.formatBigNum(warnItem.price) === NOT_A_NUMBER ? NOT_A_NUMBER : <>$&nbsp;{Global.formatBigNum(warnItem.price)}</>}
                    {!selected ? <DownOutlined style={{color: '#7377de',marginRight: 20,marginLeft: 20}} /> : <UpOutlined style={{color: '#7377de',marginRight: 20,marginLeft: 20}}/>}
                </div>
            </div>
            {selected ?
                (loading ? <div className="column2" style={{ justifyContent: 'center', alignItems: 'center' }}><Spin /></div> :
                    <div className="column2">
                        <div className="cost-price-number clolumn2-item">
                            {
                                warnItem.warnType === 8 ? <></> :
                                    <>
                                        <div className="column2-title">{f('currentCost').replace('{symbol}', warnItem.symbol)}</div>
                                        <div className="column2-content">$&nbsp;{Global.formatNum(logDetailData.costPrice)}</div>
                                    </>
                            }
                        </div>
                        <div className="buy-price-number clolumn2-item">
                            {
                                warnItem.warnType === 8 ? <></> :
                                    <>
                                        <div className="column2-title">{f('buyAveAndNumber')}</div>
                                        <div className="column2-content">$&nbsp;{Global.formatNum(logDetailData.averagePrice)}&nbsp;/&nbsp;{Global.formatBigNum(logDetailData.symbolBuyNum)}&nbsp;{f('coinUnit')}</div>
                                    </>
                            }
                        </div>
                        <div className="account-number clolumn2-item">
                            {
                                warnItem.warnType === 8 ? <></> :
                                    <>
                                        <div className="column2-title">{f('addrBitNumber').replace('{symbol}', warnItem.symbol)}</div>
                                        <div className="column2-content">{Global.formatBigNum(logDetailData.walletBalance)}</div>
                                    </>
                            }
                        </div>
                        <div className="account-value clolumn2-item">
                            {
                                warnItem.warnType === 8 ? <></> :
                                    <>
                                        <div className="column2-title">{f('addrBitAccount').replace('{symbol}', warnItem.symbol)}</div>
                                        <div className="column2-content">{Global.formatBigNum(logDetailData.walletValue)}</div>
                                    </>
                            }
                        </div>
                        <div className="token-rate clolumn2-item">
                            <div className="column2-title">{f('tokenRate')}</div>
                            <div className="column2-content">
                                <Progress percent={Number(logDetailData.position)} size="small" />
                            </div>
                        </div>
                        <div className="trade-hash clolumn2-item">
                            <div className="column2-title">{f('tradeHash')}</div>
                            <div className="column2-content">
                                {Global.abbrSymbolAddress(logDetailData.txHash)}
                                <textarea
                                    id={`copyWarnObj${warnItem.id}`}
                                    readOnly
                                    style={{
                                        position: 'absolute',
                                        top: '0',
                                        left: '0',
                                        opacity: '0',
                                        zIndex: -10,
                                    }}
                                    value={warnItem.txHash}
                                />
                                <svg
                                    className="icon"
                                    aria-hidden="true"
                                    style={{
                                        width: '12px',
                                        height: '12px',
                                        marginLeft: '16px',
                                        cursor: 'pointer',
                                    }}
                                    onClick={(e: SyntheticEvent) => {
                                        e.stopPropagation();
                                        let addr = document.querySelector(`#copyWarnObj${warnItem.id}`);
                                        (addr as HTMLTextAreaElement).select() 
                                        document.execCommand('Copy')
                                        message.success(f('copySuccess'))
                                    }}>
                                    <use xlinkHref="#icon-copy-blue"></use>
                                </svg>
                                <svg
                                    className="icon"
                                    aria-hidden="true"
                                    style={{
                                        width: '12px',
                                        height: '12px',
                                        marginLeft: '12px',
                                        cursor: 'pointer',
                                    }}
                                    onClick={(e: SyntheticEvent) => {
                                        e.stopPropagation();
                                        window.open(warnItem.ethUrl);
                                    }}>
                                    <use xlinkHref="#icon-share"></use>
                                </svg>
                            </div>
                        </div>
                    </div>) : <></>}
        </div>);
}

export interface LogDetail {
    ethUrl: string,
    costPrice: string,
    averagePrice: string,
    walletBalance: string,
    walletValue: string,
    txHash: string,
    symbolBuyNum: string,
    position: string
}