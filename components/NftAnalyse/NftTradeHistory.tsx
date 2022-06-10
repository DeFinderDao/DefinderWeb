import { useIntl } from "react-intl";
import { FilterFilled } from '@ant-design/icons'
import { message, Modal, Table, Tooltip, DatePicker, Input, Button,Image } from "antd";
import { useEffect, useState, Key, ChangeEventHandler, ChangeEvent } from "react";
import ApiClient from "utils/ApiClient";
import Global from "utils/Global";
import { useRouter } from "next/router";
import { DefaultLocale, NOT_A_NUMBER } from "utils/env";
import {
    QuestionCircleOutlined,
} from '@ant-design/icons';
import moment, { Moment } from 'moment';
import type { RangeValue } from 'rc-picker/lib/interface';
import type { TablePaginationConfig } from 'antd/lib/table'
import type { SorterResult, TableCurrentDataSource } from 'antd/lib/table/interface'
import Link from "next/link";
import WaterMarkContent from "components/WaterMarkContent";

const { RangePicker } = DatePicker

interface NftTradeHistoryData {
    totalSize: number,
    list: NftTradeHistoryItem[]
}

interface NftTradeHistoryItem {
    time: number,
    symbol: string,
    tokenId: string,
    buyer: string,
    seller: string,
    txPrice: string,
    highestPrice: string,
    uint: string,
    platform: string,
    txHashUrl: string,
    buyerLabel: string | null,
    sellerLabel: string | null,
    logo: string | null,
}

interface Filter {
    pageNo: number,
    pageSize: number,
    symbolAddr: string,
    startTime?: string,
    endTime?: string,
    tokenId?: string,
    address?: string,
    price?: string,
    sortField?: string,
    sortType?: number
}

const dateFormat = 'YYYY-MM-DD'

export default function NftTradeHistory({symbolAddr}: {symbolAddr : string}) {
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id })
    const router = useRouter();
    const { locale = DefaultLocale } = router;

    const [data, setData] = useState<NftTradeHistoryData | undefined>();
    const [loading, setLoading] = useState<boolean>(false);
    const [filter,setFilter] = useState<Filter>({
        pageNo: 1,
        pageSize: 20,
        symbolAddr: symbolAddr,
        startTime: '',
        endTime: '',
        tokenId: '',
        address: '',
        price: '',
    });
    const [filterVisible,setFilterVisible] = useState(false);
    const [isFilterEmpty,setFilterEmpty] = useState(false);

    const filterIsEmpty = (filter : Filter) => filter.startTime !== '' || filter.endTime !== '' || filter.tokenId !== '' || filter.address !== '' || filter.price !== ''; 

    useEffect(() => {
        setFilter((filter: Filter) => {
            const newFilter = {
                ...filter,
                pageNo: 1,
                pageSize: 20,
                symbolAddr: symbolAddr,
                startTime: '',
                endTime: '',
                tokenId: '',
                address: '',
                price: '',
            }
            startQuery(newFilter);
            return newFilter;
        });
    },[symbolAddr]);

    const startQuery = (filter: Filter) => {
        const apiClient = new ApiClient<NftTradeHistoryData>();
        setLoading(true);
        setFilterEmpty(filterIsEmpty(filter));
        apiClient.post('market/nft/history/trade', {
            data: {
                ...filter,
                startTime: filter.startTime ? Math.floor(moment(filter.startTime).valueOf() / 1000) : undefined,
                endTime: filter.endTime ? Math.floor(moment(filter.endTime).valueOf() / 1000) : undefined
            }
        }).then(
            success => {
                setLoading(false);
                setData(success.data);
            }, fail => {
                setLoading(false);
                message.error(fail.message);
            }
        );
    }

    const columns = [
        {
            title: f('tableTime'),
            dataIndex: 'time',
            align: 'left' as const,
            render: (text: string, item: NftTradeHistoryItem) => {
                return (<span>{Global.distanceFromCurrent(item.time, locale, true)}</span>);
            }
        },
        {
            title: "NFT",
            dataIndex: 'nft',
            align: 'left' as const,
            render: (text: string, item: NftTradeHistoryItem) => {
                return (<div style={{display: 'flex',alignItems: 'center'}}>{item.logo !== null ? 
                            <Image 
                                style={{borderRadius: 5, cursor: 'pointer'}} 
                                preview={{
                                    src: item.logo
                                }}
                                width={30}
                                src={Global.ossImageScale(item.logo,60,60)}/> : ''}
                            <div style={{marginLeft: item.logo === null ? 0 : 5}}>
                                {item.symbol}{`#${item.tokenId}`}
                            </div>
                        </div>);
            }
        },
        {
            title: f('buyer'),
            dataIndex: 'buyer',
            align: 'left' as const,
            render: (text: string, item: NftTradeHistoryItem) => {
                return (
                    <Link href={`/address-analyse/${text}`}><a style={{color: '#CCD3DB'}}><span>{item.buyerLabel !== null ? item.buyerLabel : Global.abbrSymbolAddress(text)}</span></a></Link>
                );
            }
        },
        {
            title: f('seller'),
            dataIndex: 'seller',
            align: 'left' as const,
            render: (text: string, item: NftTradeHistoryItem) => {
                return (
                    <Link href={`/address-analyse/${text}`}><a style={{color: '#CCD3DB'}}><span>{item.sellerLabel !== null ? item.sellerLabel : Global.abbrSymbolAddress(text)}</span></a></Link>
                );
            }
        },
        {
            title: f('transactionPrice'),
            dataIndex: 'price',
            align: 'left' as const,
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            render: (text: string, item: NftTradeHistoryItem) => {
                return (<span>{text}&nbsp;{item.uint}</span>);
            }
        },
        {
            title: () => {
                return (<>
                <Tooltip
                    title={f('highestPriceTip')}
                >
                    <QuestionCircleOutlined style={{marginRight: 5}}/>
                </Tooltip>
                {f('highestPrice')}
                </>);
            },
            dataIndex: 'highestPrice',
            align: 'left' as const,
            showSorterTooltip: false,
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            render: (text: string, item: NftTradeHistoryItem) => {
                return (<span>{text ? `${text} ${item.uint}` : NOT_A_NUMBER}</span>);
            }
        },
        {
            title: f('platform'),
            dataIndex: 'platform',
            align: 'left' as const,
            render: (text: string, item: NftTradeHistoryItem) => {
                return (<span>{text}</span>);
            }
        },
        {
            title: f('tradeHash'),
            dataIndex: 'txHashUrl',
            align: 'left' as const,
            render: (text: string, item: NftTradeHistoryItem) => {
                return (<svg
                    className="icon"
                    aria-hidden="true"
                    style={{ width: 16, height: 16,marginLeft: 25, cursor: 'pointer' }}
                    onClick={() => {
                        window.open(text)
                    }}>
                    <use xlinkHref='#icon-etherscan'></use>
                </svg>);
            }
        },
    ];

    const handleClickFilter = () => {
        setFilterVisible(true);
    }

    const handleCancelDialog = () => {
        setFilterVisible(false);
    }

    const handleDatePickerChange = (dates: RangeValue<Moment>, dateStrings: string[]) => {
        setFilter({
            ...filter,
            startTime: dateStrings[0],
            endTime: dateStrings[1]
        });
    }

    const handleResetClick = () => {
        setFilter((filter: Filter) => {
            const newFilter = {
                ...filter,
                startTime: '',
                endTime: '',
                tokenId: '',
                address: '',
                price: ''
            }
            startQuery(newFilter);
            return newFilter;
        });
        setFilterVisible(false);
    }

    const handleSearchClick = () => {
        setFilter((filter: Filter) => {
            const newFilter = {
                ...filter,
                pageNo: 1
            }
            startQuery(newFilter);
            return newFilter;
        });
        setFilterVisible(false);
    }

    const handleTableChange = (pagination: TablePaginationConfig, filters: Record<string, (Key | boolean)[] | null>, sorter: SorterResult<any> | SorterResult<any>[], extra: TableCurrentDataSource<any>) => {
        let field = Array.isArray(sorter) ? sorter[0].field : sorter.field;
        let order = Array.isArray(sorter) ? sorter[0].order : sorter.order;
        const sortField = order ? field as string : undefined;
        const sortType = order ? (order === 'ascend' ? 1 : 2) : undefined; 
        setFilter((filter: Filter) => {
            const newFilter = {
                ...filter,
                sortField,
                sortType,
                pageNo: filter.pageNo == pagination.current as number ? 1 : pagination.current as number,
            }
            startQuery(newFilter);
            return newFilter;
        });
    }

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name;
        switch(name) {
            case "name": {
                setFilter({
                    ...filter,
                    tokenId: event.target.value
                });
                break;
            }
            case "address": {
                setFilter({
                    ...filter,
                    address: event.target.value
                });
                break;
            }
            case "price": {
                setFilter({
                    ...filter,
                    price: event.target.value
                });
                break;
            }
        }
    }

    return (
        <div className="nft-trade-history">
            <div className="nft-trade-history-header">
                <div>
                    {f('tradeRecords')}
                </div>
                <div className="filter" onClick={handleClickFilter} style={{color: isFilterEmpty ? '#7377de' : ''}}>
                    {f('SearchMenu')}<FilterFilled style={{color: isFilterEmpty ? '#7377de' : ''}}/>
                </div>
            </div>

            <div className="common-table" style={{margin: 0}}>
                <Table
                    className="nft-trade-history-table"
                    columns={columns}
                    loading={loading}
                    dataSource={typeof data === 'undefined' ? [] : data.list}
                    pagination={{
                        position: ['bottomCenter'],
                        current: filter.pageNo,
                        pageSize: filter.pageSize,
                        showQuickJumper: true,
                        total: typeof data === 'undefined' ? 0 : data.totalSize,
                        showSizeChanger: false,
                    }}
                    onChange={handleTableChange}
                />
                {typeof data !== 'undefined' && data.totalSize > 0 ? <WaterMarkContent right={80} /> : ''}
            </div>

            <Modal
                className="nft-trade-history-modal"
                visible={filterVisible}
                centered={true}
                closable={true}
                footer={null}
                title={f('SearchMenu')}
                onCancel={handleCancelDialog}
            >
                <div className="modal-column" style={{marginTop: 0}}>
                    <div className="label">{f('searchMenuTimeInterval')}:</div>
                    <RangePicker
                        className="input-field"
                        format={dateFormat}
                        allowClear={false}
                        value={filter.startTime ? [moment(filter.startTime), moment(filter.endTime)]: [] as any}
                        onChange={handleDatePickerChange}
                    />
                </div>
                <div className="modal-column">
                    <div className="label">{f('nftNumber')}:</div>
                    <Input placeholder={f('nftNumberHint')} name="name" className="input-field" value={filter.tokenId} autoComplete="off" onChange={handleInputChange}/>
                </div>
                <div className="modal-column">
                    <div className="label">{f('address')}:</div>
                    <Input placeholder={f('addressHint')} name="address" className="input-field" value={filter.address} autoComplete="off" onChange={handleInputChange}/>
                </div>
                <div className="modal-column">
                    <div className="label">{f('transactionPrice')}:</div>
                    <Input placeholder={f('txPriceHint')} name="price" className="input-field" value={filter.price} autoComplete="off" onChange={handleInputChange}/>
                </div>
                <div className="buttons">
                    <Button className="reset" onClick={handleResetClick} >{f('resetBtn')}</Button>
                    <Button className="query" type="primary" onClick={handleSearchClick}>{f('searchBtn')}</Button>
                </div>
            </Modal>
        </div>
    );
}