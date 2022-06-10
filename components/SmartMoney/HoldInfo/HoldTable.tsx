import { message, Table, Progress } from "antd";
import type { TablePaginationConfig } from 'antd/lib/table'
import type { SorterResult, TableCurrentDataSource, SortOrder } from 'antd/lib/table/interface'
import ColumnTwoSort from "components/Table/ColumnTwoSort";
import { Key, useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "redux/reducers";
import { requestHoldList, requestHoldListSuccess } from 'redux/actions/SmartMoneyAction';
import Global from "utils/Global";
import { HolderInfoListItem, HoldInfoListFilter } from "redux/types/SmartMoneyTypes";
import { NOT_A_NUMBER } from "utils/env";
import ApiClient from "utils/ApiClient";
import usePrevious from "components/UsePreviousHook";
import Link from "next/link";
import WaterMarkContent from "components/WaterMarkContent";
import { useRouter } from "next/router";

function showMoneyWithRate({ text, rate }: { text: string, rate: number }) {
    const prefix = rate >= 0 ? '+' : '-';
    if (text) {
        text = text.startsWith('-') ? text.substring(1, text.length) : text;
    }
    return (
        <>
            {text ? `${prefix}$${Global.formatBigNum(text)}` : NOT_A_NUMBER}&nbsp;{Global.formatIncreaseNumber(rate)}
        </>
    );
}

export default function HoldTable() {
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id });
    const { holdInfoListFilter, holdInfoListTotalSize, holdInfoListData, addressType, showTab } = useSelector((state: AppState) => state.smartMoneyReducer);
    //first mounted
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [sortOrder, setSortOrder] = useState<SortOrder | undefined>(undefined);
    function requestData(filter: HoldInfoListFilter, addressType: string) {
        setLoading(true);
        const apiClient = new ApiClient<any>();
        apiClient.post('/smart/money/hold/list', {
            data: {
                ...filter,
                addressType: parseInt(addressType),
            }
        }).then(success => {
            dispatch(requestHoldListSuccess({
                data: success.data.list,
                totalSize: success.data.totalSize
            }));
        }, fail => {
            message.error(JSON.stringify(fail.message));
        }).finally(() => {
            setLoading(false);
        });
    }
    //const isInitialMount = useRef(true);
    const preAddressType = usePrevious(addressType);
    const preFilter = usePrevious(holdInfoListFilter);
    useEffect(() => {
        //component did mount
        /*if (isInitialMount.current) {
            isInitialMount.current = false;
            if(holdInfoListData.length == 0) {
                requestData(holdInfoListFilter,addressType);
            }
        } else {
            //filter change
            requestData(holdInfoListFilter,addressType);
        }*/
        if (showTab === 'hold' && (preAddressType !== addressType || holdInfoListTotalSize === 0 || holdInfoListFilter !== preFilter)) {
            requestData(holdInfoListFilter, addressType);
        }
    }, [holdInfoListFilter, addressType, showTab, holdInfoListTotalSize]);

    const [clear1, setClear1] = useState(false)
    const [clear2, setClear2] = useState(false)
    const [clear3, setClear3] = useState(false)
    const [clear4, setClear4] = useState(false)
    const [clear5, setClear5] = useState(false)
    const clearArrays = [clear1, clear2, clear3, clear4, clear5];
    const clearMethods = [setClear1, setClear2, setClear3, setClear4, setClear5];

    const comSortClick = (val: SortOrder | null, key: string, num: number) => {
        for (let i = 0; i < clearMethods.length; i++) {
            if (i === num) {
                clearMethods[i](false);
                setSortOrder(undefined);
            } else {
                clearMethods[i](true);
            }
        }
        holdInfoListFilter.sortField = key;
        let sortType = '';
        if (val == 'ascend') {
            sortType = '1';
        } else if (val == 'descend') {
            sortType = '0';
        } else {
            holdInfoListFilter.sortField = '';
        }
        holdInfoListFilter.sortType = sortType;
        holdInfoListFilter.pageNo = 1;
        dispatch(requestHoldList(holdInfoListFilter));
    }


    const router = useRouter()
    const handleItemClick = (event: any, record: HolderInfoListItem) => {
        const url = `/smart-money-info/smart-money/${record.symbolAddr}`;
        Global.openNewTag(event, router, url)
    }

    const columns = [
        {
            title: f('symbol'),
            dataIndex: 'symbol',
            align: 'left' as const,
            render: (text: string, data: HolderInfoListItem) => {
                return (
                    <Link href={`/market-detail/market-page/${data.symbolAddr}`}>
                        <a className="url-link">
                            {data.symbol}
                        </a>
                    </Link>)
            }
        },
        {
            title: () => {
                return (
                    <ColumnTwoSort
                        sortOne={{ name: 'holdChange4h', key: 'holdChange4h' }}
                        sortTwo={{ name: 'rate', key: 'holdChange4hRate' }}
                        clear={clearArrays[0]}
                        comSortClick={(val, key) => { comSortClick(val, key, 0) }}
                    />
                );
            },
            dataIndex: 'holdChange4h',
            align: 'left' as const,
            render: (text: string, data: HolderInfoListItem) => {
                return showMoneyWithRate({
                    text: data.holdChange4h,
                    rate: data.holdChange4hRate
                });
            }
        },
        {
            title: () => {
                return (
                    <ColumnTwoSort
                        sortOne={{ name: 'holdChange24h', key: 'holdChange24h' }}
                        sortTwo={{ name: 'rate', key: 'holdChange24hRate' }}
                        clear={clearArrays[1]}
                        comSortClick={(val, key) => { comSortClick(val, key, 1) }}
                    />
                );
            },
            dataIndex: 'holdChange24h',
            align: 'left' as const,
            render: (text: string, data: HolderInfoListItem) => {
                return showMoneyWithRate({
                    text: data.holdChange24h,
                    rate: data.holdChange24hRate
                });
            }
        },
        {
            title: () => {
                return (
                    <ColumnTwoSort
                        sortOne={{ name: 'holdChange3d', key: 'holdChange3d' }}
                        sortTwo={{ name: 'rate', key: 'holdChange3dRate' }}
                        clear={clearArrays[2]}
                        comSortClick={(val, key) => { comSortClick(val, key, 2) }}
                    />
                );
            },
            dataIndex: 'holdChange3d',
            align: 'left' as const,
            render: (text: string, data: HolderInfoListItem) => {
                return showMoneyWithRate({
                    text: data.holdChange3d,
                    rate: data.holdChange3dRate
                });
            }
        },
        {
            title: () => {
                return (
                    <ColumnTwoSort
                        sortOne={{ name: 'holdChange7d', key: 'holdChange7d' }}
                        sortTwo={{ name: 'rate', key: 'holdChange7dRate' }}
                        clear={clearArrays[3]}
                        comSortClick={(val, key) => { comSortClick(val, key, 3) }}
                    />
                );
            },
            dataIndex: 'holdChange7d',
            align: 'left' as const,
            render: (text: string, data: HolderInfoListItem) => {
                return showMoneyWithRate({
                    text: data.holdChange7d,
                    rate: data.holdChange7dRate
                });
            }
        },
        {
            title: () => {
                return (
                    <ColumnTwoSort
                        sortOne={{ name: 'holdChange30d', key: 'holdChange30d' }}
                        sortTwo={{ name: 'rate', key: 'holdChange30dRate' }}
                        clear={clearArrays[4]}
                        comSortClick={(val, key) => { comSortClick(val, key, 4) }}
                    />
                );
            },
            dataIndex: 'holdChange30d',
            align: 'left' as const,
            render: (text: string, data: HolderInfoListItem) => {
                return showMoneyWithRate({
                    text: data.holdChange30d,
                    rate: data.holdChange30dRate
                });
            }
        },
        {
            title: f('holdAddress'),
            dataIndex: 'holdAddress',
            align: 'left' as const,
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            sortOrder: sortOrder,
            render: (text: string, data: HolderInfoListItem) => {
                return <>{text}<Progress showInfo={false} percent={data.holdAddressRate} /></>;
            }
        },
        {
            title: ' ',
            dataIndex: 'action',
            key: 'action',
            align: 'right' as const,
            width: 50,
            render: (text: string, data: HolderInfoListItem) => {
                return <img src="/images/detail-icon.svg" className="img-details" onClick={event => handleItemClick(event, data)} />
            }
        },
    ]

    const handleTableChange = (pagination: TablePaginationConfig, filters: Record<string, (Key | boolean)[] | null>, sorter: SorterResult<any> | SorterResult<any>[], extra: TableCurrentDataSource<any>) => {
        let field = Array.isArray(sorter) ? sorter[0].field : sorter.field;
        let order = Array.isArray(sorter) ? sorter[0].order : sorter.order;
        const sortField = typeof order !== 'undefined' ? field as string : '';
        const sortType = typeof order !== 'undefined' ? (order === 'ascend' ? '1' : '0') : '';
        if (pagination && typeof pagination.current !== 'undefined') {
            holdInfoListFilter.pageNo = holdInfoListFilter.pageNo == pagination.current ? 1 : pagination.current;
        }
        if (sortField) {
            for (let func of clearMethods) {
                func(true);
            }
        }
        setSortOrder(order);
        if (field == "holdAddress" && typeof order !== 'undefined') {
            holdInfoListFilter.sortField = sortField;
            holdInfoListFilter.sortType = sortType.toString();
        }
        dispatch(requestHoldList(holdInfoListFilter));
    }

    const { isOpen } = useSelector((state: AppState) => state.menuList);

    return (
        <div className="common-table hold-info-table" style={{ margin: 0 }}>
            <Table
                columns={columns}
                rowKey="symbolAddr"
                dataSource={holdInfoListData}
                rowClassName={isOpen ? 'short' : ''}
                loading={loading}
                pagination={{
                    showQuickJumper: true,
                    showSizeChanger: false,
                    current: holdInfoListFilter.pageNo,
                    pageSize: holdInfoListFilter.pageSize,
                    total: holdInfoListTotalSize,
                    position: ['bottomCenter'],
                }}
                onChange={handleTableChange}
                style={{ marginTop: '20px' }}
            />
            <WaterMarkContent bottom={150} />
        </div>
    );
}