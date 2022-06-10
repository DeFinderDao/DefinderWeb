import { Select, DatePicker, List, Spin, message, Divider } from 'antd';
import { MouseEventHandler, SyntheticEvent, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
const { Option } = Select;
const { RangePicker } = DatePicker;
import moment, { Moment } from 'moment';
import type { RangeValue } from 'rc-picker/lib/interface';
import InfiniteScroll from 'react-infinite-scroller';
import { useDispatch, useSelector } from 'react-redux';
import { getTradeAddressList, changeTradeListCondition, refreshTradeRecordsList, setTradeRecordClickIndex } from 'redux/actions/AddressAnalyseAction';
import type { AppState } from 'redux/reducers'
import { AddressItem, TradeRecordItem } from 'redux/types/AddressAnalyseTypes';
import Global from 'utils/Global';
import Identicon from 'identicon.js/identicon.js'
import { useRouter } from 'next/router';
import { DefaultLocale } from 'utils/env';
import type { OptionsType } from 'rc-select/lib/interface'
import { TokenLogo } from 'components/TokenLogo';
import GlobalLabel from 'components/GlobalLabel';
import WaterMarkContent from 'components/WaterMarkContent';
import usePrevious from 'components/UsePreviousHook';
import { DownOutlined,UpOutlined } from '@ant-design/icons';

const dateFormat = 'YYYY-MM-DD';

function scrollTop() {
    //const element = document.getElementsByClassName('infinite-container')[0];
    //element.scrollTop = 0;
}

function getScrollListHeight() {
    return window.document.body.clientHeight - 230;
}

export default function TradeRecords({ addressList, addrName, groupId }: { addressList: string[], addrName: string | undefined, groupId: string | undefined }) {
    const { formatMessage } = useIntl();
    const f = (id: string) => formatMessage({ id });
    const dispatch = useDispatch();
    //states
    const {
        tradeAddressListLoading,
        tradeAddressList, 
        showTab,
        tradeListCondition,
        tradeListLoading,
        tradeListHasMore,
        tradeListData,
        addressBaseInfo
    } = useSelector((state: AppState) => state.addressAnalyse);
    
    //events
    const handleTokenSelectChange = (newValue: string[], option: OptionsType[number] | OptionsType) => {
        const symbolAddrList: string[] = [];
        if (newValue.length > 0) {
            newValue.forEach((value: string) => {
                const data = value.split('|');
                symbolAddrList.push(data[0]);
            });
        }
        dispatch(changeTradeListCondition({
            symbolAddrList: symbolAddrList,
            selectedTradeSymbol: newValue,
            pageNo: 1,
        }));
        scrollTop();
    }

    const handleTypeSelectChange = (value: string) => {
        dispatch(changeTradeListCondition({
            type: value,
            pageNo: 1,
        }));
        scrollTop();
    }

    const handleDatePickerChange = (dates: RangeValue<Moment>, dateStrings: string[]) => {
        if (dates && dates.length === 2 && dates[0] && dates[1]) {
            dispatch(changeTradeListCondition({
                startTime: moment(dates[0]),
                endTime: moment(dates[1]),
                pageNo: 1,
            }));
            scrollTop();
        } else {
            dispatch(changeTradeListCondition({
                startTime: undefined,
                endTime: undefined,
                pageNo: 1,
            }));
            scrollTop();
        }
    }

    const [loadMoreTime,setLoadMoreTime] = useState(0);

    const handleInfiniteOnLoad = (page: number) => {
        setLoadMoreTime((prevTimestamp: number) => {
            const timestamp = new Date().valueOf();
            if(timestamp - loadMoreTime > 200) {
                if (!tradeListLoading) {
                    dispatch(changeTradeListCondition({
                        pageNo: tradeListCondition.pageNo! + 1,
                    }));
                }
                return timestamp;
            } else 
                return prevTimestamp;
        });
    }

    /*useEffect(() => {
        if(addressList.length > 0 && showTab === 'address-transactions') {
            if(tradeAddressList.length === 0) {
                dispatch(getTradeAddressList(addressList));
            }
        }
    }, [addressList,showTab,tradeAddressList]);

    useEffect(() => {
        if(addressList.length > 0 && showTab === 'address-transactions') {
            dispatch(changeTradeListCondition({
                pageNo: 1,
                addressList
            }));
        }
    },[addressList,showTab]);*/

    const prevAddressList = usePrevious(addressList);
    useEffect(() => {
        if (addressList !== prevAddressList && addressList.length > 0) {
            const listHeight = getScrollListHeight();
            const pageSize = Math.floor(listHeight / 60) + (listHeight % 60 === 0 ? 0 : 1); 
            dispatch(getTradeAddressList(addressList));
            dispatch(changeTradeListCondition({
                pageNo: 1,
                addressList,
                pageSize : pageSize < 20 ? 20 : pageSize,
                selectedTradeSymbol: [],
                symbolAddrList: []
            }));
        }

        return () => {
            dispatch(changeTradeListCondition({
                type: '0',
                startTime: undefined,
                endTime: undefined,
                pageNo: 1,
                symbolAddrList: [],
                addressList: [],
            }));
        }
    }, [addressList]);

    useEffect(() => {
        if (tradeListCondition.addressList && tradeListCondition.addressList.length > 0) {
            dispatch(refreshTradeRecordsList(tradeListCondition));
        }
    }, [tradeListCondition]);

    const [listHeight, setListHeight] = useState(200);
    useEffect(() => {
        setListHeight(getScrollListHeight());
    }, []);

    const router = useRouter();
    const { locale = DefaultLocale } = router;
    const selectTypeWidth = locale === DefaultLocale ? 160 : 100;

    const { tradeClickIndex } = useSelector((state: AppState) => state.addressAnalyse);
    const onCancelSelect = () => {
        if (tradeClickIndex >= 0) {
            dispatch(setTradeRecordClickIndex(-1));
        }
    }

    return (
        <div onClick={onCancelSelect}>
            <div className="trade-header">
                <Select defaultValue={[]}
                    mode="multiple"
                    style={{ minWidth: 210, height: 32 }}
                    loading={tradeAddressListLoading}
                    maxTagCount={2}
                    onChange={handleTokenSelectChange}
                    placeholder={f('allToken')}
                    value={tradeListCondition.selectedTradeSymbol}
                >
                    {
                        tradeAddressList.map((item: AddressItem) => {
                            return (<Option value={`${item.symbolAddr}|${item.symbol}`} key={`${item.symbolAddr}|${item.symbol}`}>
                                <TokenLogo style={{ width: 16, height: 16, marginRight: 10 }} src={item.symbolLogo} />
                                {item.symbol}
                            </Option>);
                        })
                    }
                </Select>
                <Select
                    value={tradeListCondition.type}
                    style={{ marginLeft: '40px', width: selectTypeWidth }}
                    onChange={handleTypeSelectChange}
                >
                    <Option value="0">{f('all')}</Option>
                    <Option value="1">{f('swapDirection0')}</Option>
                    <Option value="2">{f('out')}</Option>
                    <Option value="3">{f('transferDirection1')}</Option>
                    <Option value="4">{f('lpDirection1')}</Option>
                    <Option value="5">{f('lpDirection2')}</Option>
                </Select>
                <RangePicker
                    style={{ marginLeft: '40px' }}
                    format={dateFormat}
                    value={
                        typeof tradeListCondition.startTime === 'undefined' && typeof tradeListCondition.endTime === 'undefined' ?
                            undefined : [tradeListCondition.startTime!, tradeListCondition.endTime!]}
                    onChange={handleDatePickerChange}
                />
            </div>

            <div className="infinite-container" style={{ height: listHeight, overflow: 'auto' }}>
                <WaterMarkContent position='fixed' right={40} />
                <InfiniteScroll
                    initialLoad={false}
                    pageStart={0}
                    loadMore={handleInfiniteOnLoad}
                    hasMore={tradeListHasMore}
                    useWindow={false}
                    loader={
                        tradeListCondition.pageNo! > 1 ?
                            <div className="loading-container" key="loader">
                                <Spin />
                            </div> : undefined}
                >
                    <List
                        loading={tradeListLoading && tradeListCondition.pageNo === 1}
                        dataSource={tradeListData}
                        renderItem={(item: TradeRecordItem, index: number) => (
                            <List.Item key={createUniqueKey(item)}>
                                <RecordListItem index={index} tradeListData={tradeListData} addrName={addrName!} groupId={groupId} />
                            </List.Item>
                        )}
                        footer={(!tradeListHasMore && tradeListData.length > 0) ?
                            <Divider className="no-more">
                                {f('noMore')}
                            </Divider>
                            : undefined}
                    >
                    </List>
                </InfiniteScroll>
            </div>
        </div>
    );
}

function RecordListItem({ index, tradeListData, addrName, groupId }: { index: number, tradeListData: TradeRecordItem[], addrName: string, groupId: string | undefined }) {
    const item = tradeListData[index];
    const currentTime = item.date;
    const currentMoment = moment(parseInt(currentTime));
    let hasHeader = false;
    if (index > 0) {
        const beforeMoment = moment(parseInt(tradeListData[index - 1].date));
        //console.log(currentMoment.year(),beforeMoment.month());
        if (currentMoment.year() !== beforeMoment.year() || currentMoment.month() !== beforeMoment.month()
            || currentMoment.date() !== beforeMoment.date()) {
            hasHeader = true;
        }
    } else {
        hasHeader = true;
    }

    const dispatch = useDispatch();
    const { tradeClickIndex } = useSelector((state: AppState) => state.addressAnalyse);
    const onItemClick = (e: SyntheticEvent) => {
        e.stopPropagation();
        dispatch(setTradeRecordClickIndex(index));
    }

    const router = useRouter();
    const tokenRouter = (token: string, e: SyntheticEvent) => {
        e.stopPropagation();
        const url = typeof groupId === 'undefined' ?
            `/investment-details/address-analyse/${token}/${addrName}`
            : `/investment-details/address-analyse/${token}/${addrName}/${groupId}`;
        Global.openNewTag(e as any, router, url)
    }

    return hasHeader ? (
        <div style={{ width: '100%' }}>
            <ItemHeader time={currentMoment.format(dateFormat)} />
            <ItemContent onTokenRouter={tokenRouter} isSelected={tradeClickIndex === index} record={item} onItemClick={onItemClick} />
        </div>
    ) : (<ItemContent onTokenRouter={tokenRouter} isSelected={tradeClickIndex === index} record={item} onItemClick={onItemClick} />);
}


function ItemContent({ isSelected, record, onItemClick, onTokenRouter }: { isSelected: boolean, record: TradeRecordItem, onItemClick: MouseEventHandler<HTMLDivElement>, onTokenRouter: (token: string, e: SyntheticEvent) => void }) {
    switch (record.type) {
        case 1:
            return <Trade isSelected={isSelected} record={record} onClick={onItemClick} onTokenRouter={onTokenRouter} />;
        case 2:
        case 3:
            return <Transfer isSelected={isSelected} record={record} onClick={onItemClick} onTokenRouter={onTokenRouter} />;
        case 4:
        case 5:
            return <LP isSelected={isSelected} record={record} onClick={onItemClick} onTokenRouter={onTokenRouter} />;
        default:
            return <></>
    }
}

function formatTime(time: number): string {
    const m = moment(time);
    const hour = m.hour();
    const minute = m.minute();
    let timestring = '';
    let timeSuffix = '';
    if (hour < 12) {
        timestring += (hour >= 10) ? hour : `0${hour}`;
        //timeSuffix = ' AM';
    } else {
        timestring += hour;
        //timeSuffix = ' PM';
    }
    if (minute > 9) {
        timestring += `:${minute} ${timeSuffix}`;
    } else {
        timestring += `:0${minute} ${timeSuffix}`;
    }
    return timestring;
}

function Trade({ record, isSelected, onClick, onTokenRouter }: { record: TradeRecordItem, isSelected: boolean, onClick: MouseEventHandler<HTMLDivElement>, onTokenRouter: (token: string, e: SyntheticEvent) => void }) {
    const { swap, txHash, txHashUrl, date } = record;
    const { formatMessage } = useIntl();
    const f = (id: string) => formatMessage({ id });

    return (
        <div className={!isSelected ? 'swap-container' : 'container-selected swap-container'}
            onClick={onClick}>
            <div className="column">
                <div className="column-item">
                    <div className="left-block">
                        <svg
                            className="icon"
                            aria-hidden="true"
                            style={{
                                width: 20,
                                height: 20,
                                marginRight: 8,
                            }}>
                            <use xlinkHref='#icon-trade'></use>
                        </svg>
                        <div>
                            <div className="trade-type">{f('swapDirection0')}</div>
                            <div className="trade-time">{formatTime(parseInt(date))}</div>
                        </div>
                    </div>
                </div>
                <div className="column-item">
                    <div className="trade-direction">
                        <div className="symbol-block" style={{ flex: 1 }}>
                            <TokenLogo className="logo" src={swap.symbol0Logo} />
                            <div>
                                <div className="symbol-amount">{swap.symbol0Amount}<span onClick={(e) => {
                                    onTokenRouter(swap.symbol0Addr, e)
                                }}>&nbsp;{swap.symbol0}</span></div>
                                <div className="symbol-value">{`$ ${Global.formatBigNum(swap.symbol0Value, 0)}`}</div>
                            </div>
                        </div>
                        <svg
                            className="icon"
                            aria-hidden="true"
                            style={{
                                width: 14,
                                height: 7,
                                flex: 1,
                            }}>
                            <use xlinkHref='#icon-right'></use>
                        </svg>
                        <div className="symbol-block" style={{ flex: 1 }}>
                            <TokenLogo className="logo" src={swap.symbol1Logo} />
                            <div>
                                <div className="symbol-amount">{swap.symbol1Amount}<span onClick={(e) => { onTokenRouter(swap.symbol1Addr, e) }}>&nbsp;{swap.symbol1}</span></div>
                                <div className="symbol-value">{`$ ${Global.formatBigNum(swap.symbol1Value, 0)}`}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="column-item" style={{display: 'flex',alignItems: 'center',justifyContent: 'end'}}>
                    {!isSelected ? <DownOutlined style={{color: '#7377de',marginRight: 40}} /> : <UpOutlined style={{color: '#7377de',marginRight: 40}}/>}
                </div>
            </div>

            {
                !isSelected ? null :
                    (<div className="column">
                        <div className="column-item">
                            <div className="price-label symbol0-margin">
                                <div className="symbol-name">{`${swap.symbol0}  ${f('price')}`}</div>
                                <div>{`1${swap.symbol0} = $ ${Global.formatBigNum(swap.symbol0Price)}`}</div>
                            </div>
                        </div>
                        <div className="column-item">
                            <div className="price-label symbol1-margin">
                                <div className="symbol-name">{`${swap.symbol1}  ${f('price')}`}</div>
                                <div>{`1${swap.symbol1} = $ ${Global.formatBigNum(swap.symbol1Price)}`}</div>
                            </div>
                        </div>
                        <div className="column-item">
                            <div className="txt-hash">
                                <div>
                                    <div className="txt-hash-label">{f('tradeHash')}</div>
                                    <div className="txt-hash-content">
                                        {Global.abbrSymbolAddress(txHash)}
                                        <textarea
                                            id={`copyObj${createUniqueKey(record)}`}
                                            readOnly
                                            style={{
                                                position: 'absolute',
                                                top: '0',
                                                left: '0',
                                                opacity: '0',
                                                zIndex: -10,
                                            }}
                                            value={txHash}
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
                                            onClick={() => {
                                                let addr = document.querySelector(`#copyObj${createUniqueKey(record)}`);
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
                                            onClick={() => {
                                                window.open(txHashUrl);
                                            }}>
                                            <use xlinkHref="#icon-share"></use>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>)
            }
        </div>
    );
}

function Transfer({ record, isSelected, onClick, onTokenRouter }: { record: TradeRecordItem, isSelected: boolean, onClick: MouseEventHandler<HTMLDivElement>, onTokenRouter: (token: string, e: SyntheticEvent) => void }) {
    const { transfer, txHash, txHashUrl, type, date } = record;
    const { formatMessage } = useIntl();
    const f = (id: string) => formatMessage({ id });
    const formatPrice = (symbol: string, type: number) => {
        const template = type === 3 ? f('receiveTokenPrice') : f('sendTokenPrice');
        return template.replace('{symbol}', symbol);
    }

    return (
        <div className={!isSelected ? 'swap-container' : 'container-selected swap-container'}
            onClick={onClick}
        >
            <div className="column">
                <div className="column-item">
                    <div className="left-block">
                        <svg
                            className="icon"
                            aria-hidden="true"
                            style={{
                                width: 20,
                                height: 20,
                                marginRight: 8,
                            }}>
                            <use xlinkHref={type == 3 ? '#icon-incoming' : '#icon-outcoming'}></use>
                        </svg>
                        <div>
                            <div className="trade-type">{type === 3 ? f('transferDirection1') : f('out')}</div>
                            <div className="trade-time">{formatTime(parseInt(date))}</div>
                        </div>
                    </div>
                </div>
                <div className="column-item">
                    <div className="trade-direction">
                        <div className="symbol-block">
                            <TokenLogo className="logo" src={transfer.symbolLogo} />
                            <div>
                                <div className="symbol-amount">{transfer.symbolAmount}<span onClick={(e) => { onTokenRouter(transfer.symbolAddr, e) }}>&nbsp;{transfer.symbol}</span></div>
                                <div className="symbol-value">{`$ ${Global.formatNum(transfer.symbolValue)}`}</div>
                            </div>
                        </div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
                <div className="column-item" style={{display: 'flex',alignItems: 'center'}}>
                    <div className="trade-address">
                        <div className="trade-address-label">
                            {type === 3 ? f('sendAddress') : f('receiverAddress')}
                        </div>
                        <textarea
                            id={`copyObj${createUniqueKey(record)}`}
                            readOnly
                            style={{
                                position: 'absolute',
                                top: '0',
                                left: '0',
                                opacity: '0',
                                zIndex: -10,
                            }}
                            value={transfer.address}
                        />
                        <span>
                            <span className="address-mark" onClick={(e: SyntheticEvent) => {
                                e.stopPropagation();
                                let addr = document.querySelector(`#copyObj${createUniqueKey(record)}`);
                                (addr as HTMLTextAreaElement).select()   
                                document.execCommand('Copy')
                                message.success(f('copySuccess'))
                            }}>
                                <img style={{ borderRadius: 40, marginRight: 10, width: 14 }} src={`data:image/png;base64,${new Identicon(transfer.address, 24).toString()}`} />
                                {/* {record.titles && record.titles.length > 0 ? (record.titles.join('/')) : Global.abbrSymbolAddress(transfer.address)} */}
                                <GlobalLabel addr={transfer.address} label={transfer.addressLabel} />
                            </span>
                            {record.transfer.isContract ? <span className='contract-address'>({f('contractAddress')})</span> : <></>}
                        </span>
                    </div>

                    {!isSelected ? <DownOutlined style={{color: '#7377de',marginRight: 40}} /> : <UpOutlined style={{color: '#7377de',marginRight: 40}}/>}
                </div>
            </div>

            {
                !isSelected ? null :
                    (<div className="column">
                        <div className="column-item">
                            <div className="price-label symbol0-margin">
                                <div>{formatPrice(transfer.symbol, type)}</div>
                                <div>{`1${transfer.symbol} = $ ${Global.formatNum(transfer.symbolPrice)}`}</div>
                            </div>
                        </div>
                        <div className="column-item">
                            <div className="txt-hash" style={{ marginLeft: '35px' }}>
                                <div>
                                    <div className="txt-hash-label">{f('tradeHash')}</div>
                                    <div className="txt-hash-content">
                                        {Global.abbrSymbolAddress(txHash)}
                                        <textarea
                                            id={`copyTxHashObj${createUniqueKey(record)}`}
                                            readOnly
                                            style={{
                                                position: 'absolute',
                                                top: '0',
                                                left: '0',
                                                opacity: '0',
                                                zIndex: -10,
                                            }}
                                            value={txHash}
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
                                            onClick={() => {
                                                let addr = document.querySelector(`#copyTxHashObj${createUniqueKey(record)}`);
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
                                            onClick={() => {
                                                window.open(txHashUrl);
                                            }}>
                                            <use xlinkHref="#icon-share"></use>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>)
            }
        </div>
    );
}

function LP({ record, isSelected, onClick, onTokenRouter }: { record: TradeRecordItem, isSelected: boolean, onClick: MouseEventHandler<HTMLDivElement>, onTokenRouter: (token: string, e: SyntheticEvent) => void }) {
    const { lp, type, date, txHash, txHashUrl } = record;
    const { formatMessage } = useIntl();
    const f = (id: string) => formatMessage({ id });

    const formatPrice = (symbol: string, type: number) => {
        const template = type === 4 ? f('receiveLpPrice') : f('sendLpPrice');
        return template.replace('{symbol}', symbol);
    }

    const inPool = (<div style={{ flex: 1 }}>
        <div className="symbol-block">
            <TokenLogo className="logo" src={lp.symbol0Logo} />
            <div>
                <div className="symbol-amount">{lp.symbol0Amount}<span onClick={(e) => { onTokenRouter(lp.symbol0Addr, e) }}>&nbsp;{lp.symbol0}</span></div>
                <div className="symbol-value">{`$ ${Global.formatNum(lp.symbol0Value)}`}</div>
            </div>
        </div>
        <div style={{
            textAlign: 'center',
            marginTop: '10px',
            marginBottom: '10px'
        }}>+</div>
        <div className="symbol-block">
            <TokenLogo className="logo" src={lp.symbol1Logo} />
            <div>
                <div className="symbol-amount">{lp.symbol1Amount}<span onClick={(e) => { onTokenRouter(lp.symbol1Addr, e) }}>&nbsp;{lp.symbol1}</span></div>
                <div className="symbol-value">{`$ ${Global.formatNum(lp.symbol1Value)}`}</div>
            </div>
        </div>
    </div>);

    const outPool = (<div className="symbol-block" style={{ flex: 1 }}>
        <TokenLogo className="logo" src={lp.contractLogo} />
        <div>
            <div className="symbol-amount">SLP</div>
            <div className="symbol-value">{`$ ${Global.formatNum(lp.lpTotalValue)}`}</div>
        </div>
    </div>);

    return (
        <div className={!isSelected ? 'swap-container' : 'lp-container-selected swap-container'}
            style={{ height: isSelected ? 220 : 160 }}
            onClick={onClick}>
            <div className="column" style={{ height: 160 }}>
                <div className="column-item">
                    <div className="left-block">
                        <svg
                            className="icon"
                            aria-hidden="true"
                            style={{
                                width: 20,
                                height: 20,
                                marginRight: 8,
                            }}>
                            <use xlinkHref={type == 4 ? '#icon-in-market' : '#icon-cancel-market'}></use>
                        </svg>
                        <div>
                            <div className="trade-type">{type === 4 ? f('lpDirection1') : f('lpDirection2')}</div>
                            <div className="trade-time">{formatTime(parseInt(date))}</div>
                        </div>
                    </div>
                </div>
                <div className="column-item">
                    <div className="trade-direction">
                        {type === 4 ? inPool : outPool}
                        <svg
                            className="icon"
                            aria-hidden="true"
                            style={{
                                width: 14,
                                height: 7,
                                flex: 1,
                            }}>
                            <use xlinkHref='#icon-right'></use>
                        </svg>
                        {type === 4 ? outPool : inPool}
                    </div>
                </div>
                <div className="column-item" style={{display: 'flex',alignItems: 'center',justifyContent: 'end'}}>
                    {!isSelected ? <DownOutlined style={{color: '#7377de',marginRight: 40}} /> : <UpOutlined style={{color: '#7377de',marginRight: 40}}/>}
                </div>
            </div>

            {
                !isSelected ? null :
                    (<div className="column">
                        <div className="column-item">
                            <div className="price-label symbol0-margin">
                                <div>{formatPrice(lp.symbol0, type)}</div>
                                <div>{`1${lp.symbol0} = $ ${lp.symbol0Price}`}</div>
                            </div>
                        </div>
                        <div className="column-item">
                            <div className="price-label symbol0-margin">
                                <div>{formatPrice(lp.symbol1, type)}</div>
                                <div>{`1${lp.symbol1} = $ ${lp.symbol1Price}`}</div>
                            </div>
                        </div>
                        <div className="column-item">
                            <div className="txt-hash" style={{ marginLeft: '35px' }}>
                                <div>
                                    <div className="txt-hash-label">{f('tradeHash')}</div>
                                    <div className="txt-hash-content">
                                        {Global.abbrSymbolAddress(txHash)}
                                        <textarea
                                            id={`copyObj${createUniqueKey(record)}`}
                                            readOnly
                                            style={{
                                                position: 'absolute',
                                                top: '0',
                                                left: '0',
                                                opacity: '0',
                                                zIndex: -10,
                                            }}
                                            value={txHash}
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
                                            onClick={() => {
                                                let addr = document.querySelector(`#copyObj${createUniqueKey(record)}`);
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
                                            onClick={() => {
                                                window.open(txHashUrl);
                                            }}>
                                            <use xlinkHref="#icon-share"></use>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="column-item">
                        </div>
                    </div>)
            }
        </div>
    );
}

function ItemHeader({ time }: { time: string }) {
    return (
        <div className="time-header">
            {time}
        </div>
    );
}

function createUniqueKey(record: TradeRecordItem) {
    return `${record.txHash}${record.type}${record.id}`;
}