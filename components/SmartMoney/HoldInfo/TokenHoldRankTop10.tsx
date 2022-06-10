import { message, Progress, Spin, Table } from "antd";
import { useEffect, useState, Key } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "redux/reducers";
import { ANT_CHARTS_DARK } from "utils/env";
import loadable from "@loadable/component";
const Pie = loadable(() => import('@ant-design/plots/lib/components/pie'))
import type { Options } from "@ant-design/plots/lib/hooks/useChart";
import { useIntl } from "react-intl";
import { HoldSymbolRankItem } from "redux/types/SmartMoneyTypes";
import { requestHoldSymbolRankSuccess } from "redux/actions/SmartMoneyAction";
import usePrevious from "components/UsePreviousHook";
import type { TablePaginationConfig } from 'antd/lib/table'
import type { SorterResult, TableCurrentDataSource } from 'antd/lib/table/interface'
import Global from "utils/Global";
import DefinEmpty from "components/Header/definEmpty";
import ApiClient from "utils/ApiClient";
import Link from "next/link";
import WaterMarkContent from "components/WaterMarkContent";
import { useRouter } from "next/router";

const colors = ANT_CHARTS_DARK.colors10;

export default function TokenHoldRankTop10() {
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id })
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [sort, setSort] = useState({
        sortField: 'totalAsset',
        sortType: '0'
    });

    const { holdSymbolRank, addressType, showTab } = useSelector((state: AppState) => state.smartMoneyReducer);

    function requestData(addressType: string, sortField: string, sortType: string) {
        setLoading(true);
        const apiClient = new ApiClient<any>();
        apiClient.post('/smart/money/hold/symbol/rank', {
            data: {
                addressType: parseInt(addressType),
                sortField,
                sortType
            }
        }).then(success => {
            dispatch(requestHoldSymbolRankSuccess(success.data));
        }, fail => {
            message.error(fail.message);
        }).finally(() => {
            setLoading(false)
        });
    }

    //const [isFirstMount, setFirstMount] = useState(true);
    //const preMounted = usePrevious(isFirstMount);
    const preAddressType = usePrevious(addressType);
    const preSort = usePrevious(sort);

    useEffect(() => {
        /*setFirstMount(false);
        if (preMounted) {
            if (holdSymbolRank.length === 0) {
                requestData(addressType, sort.sortField, sort.sortType);
            }
        } else {
            requestData(addressType, sort.sortField, sort.sortType);
        }*/
        if (showTab === 'hold' && (addressType !== preAddressType || sort !== preSort)) {
            requestData(addressType, sort.sortField, sort.sortType);
        }
    }, [sort, addressType, showTab])

    const router = useRouter()
    const handleItemClick = (event: any, record: HoldSymbolRankItem) => {
        const url = `/smart-money-info/smart-money/${record.symbolAddr}`;
        Global.openNewTag(event, router, url)
    }
    const columns = [{
        title: f('symbol'),
        dataIndex: 'symbol',
        align: 'left' as const,
        render: (text: string, item: HoldSymbolRankItem) => {
            const index = holdSymbolRank.list.indexOf(item);
            return (
                <div style={{ lineHeight: '100%' }}>
                    <span className="circle" style={{ backgroundColor: colors[index] }} />
                    <Link href={`/market-detail/market-page/${item.symbolAddr}`}>
                        <a className="url-link">
                            {text}
                        </a>
                    </Link>
                </div>);
        }
    }, {
        title: f('holdTotalMoney'),
        dataIndex: 'totalAsset',
        sorter: true,
        sortDirections: ['descend' as const],
        sortOrder: sort.sortField === 'totalAsset' && sort.sortType === '0' ? 'descend' as const : undefined,
        align: 'left' as const,
        render: (text: string) => {
            return Global.formatBigNum(text);
        }
    }, {
        title: f('holdTotalMoneyPercent'),
        dataIndex: 'totalAssetRate',
        align: 'left' as const,
        render: (text: string) => {
            return `${text}%`;
        }
    }, {
        title: f('holdTotalLP'),
        dataIndex: 'symbolRate',
        align: 'left' as const,
        render: (text: string, item: HoldSymbolRankItem) => {
            return `${item.symbolRate}%`;
        }
    }, {
        title: f('holdAddressNum'),
        dataIndex: 'holdAddrCount',
        align: 'left' as const,
        sorter: true,
        sortDirections: ['descend' as const],
        sortOrder: sort.sortField === 'holdAddrCount' && sort.sortType === '0' ? 'descend' as const : undefined,
        render: (text: string, item: HoldSymbolRankItem) => {
            return <>{text}<Progress showInfo={false} percent={item.holdAddrCountRate} /></>;
        }
    }, {
        title: ' ',
        dataIndex: 'action',
        key: 'action',
        align: 'right' as const,
        width: 50,
        render: (text: string, data: HoldSymbolRankItem) => {
            return <img src="/images/detail-icon.svg" className="img-details" onClick={event => handleItemClick(event, data)} />
        }
    },];

    const [activeAdd, setActiveAdd] = useState('')
    const pieSelected = ({ event }: Record<string, any>) => {
        if (event.type == 'element:mouseleave') {
            setActiveAdd('')
        } else {
            setActiveAdd(event.data.data.symbolAddr)
        }
    }

    const { pageMode } = useSelector((state: AppState) => state.userInfo);
    const config = {
        width: 200,
        height: 200,
        appendPadding: 10,
        data: holdSymbolRank.list.slice(0, 10).concat([{
            totalAssetRate: holdSymbolRank.others ? holdSymbolRank.others.rate : 0,
            symbol: f('smOther'),
            symbolAddr: '0x0000000000000000000000',
            totalAsset: '',
            symbolRate: 0,
            holdAddrCount: 0,
            holdAddrCountRate: 0,
            top10Rate: 0
        }]) as HoldSymbolRankItem[],
        angleField: 'totalAssetRate',
        colorField: 'symbolAddr',
        radius: 1,
        theme: pageMode === 'dark' ? ANT_CHARTS_DARK : undefined,
        innerRadius: 0.45,
        legend: false as const,
        tooltip: {
            position: 'bottom' as const,
            enterable: true,
            customContent: (title: string, data: any[]) => {
                if (data.length > 0 && (data[0].data as HoldSymbolRankItem).symbolAddr == '0x0000000000000000000000') {
                    return (
                        <div style={{ padding: '20px 10px', minWidth: 50 }}>
                            <div style={{ padding: '10px 0' }}>
                                <span>{(data[0].data as HoldSymbolRankItem).symbol}：</span>
                                <span>{Global.formatNum((data[0].data as HoldSymbolRankItem).totalAssetRate)}%</span>
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
        color: colors.concat(['#CDF3E4']),
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
                if (item.totalAssetRate < 2) {
                    return '';
                } else {
                    return `${item.totalAssetRate}%`
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
                    if (holdSymbolRank.list && holdSymbolRank.list.length > 0) {
                        return (
                            <img
                                src={'/images/definder_logo_d.svg'}
                                style={{ width: '25px' }}
                            />
                        ) as unknown as string
                    } else {
                        return <></> as unknown as string
                    }
                },
            },
        },
        animation: false as const,
    }

    const [plot, setPlot] = useState<undefined | Options>();
    useEffect(() => {
        if (typeof plot !== 'undefined') {
            plot.setState('active', (item: HoldSymbolRankItem) => {
                if (item.symbolAddr === activeAdd) {
                    return true;
                } else {
                    return false;
                }
            });
        }
    }, [plot, activeAdd]);

    const handleMouseLeave = (data: HoldSymbolRankItem) => {
        setActiveAdd('');
    }
    const handleMouseEnter = (data: HoldSymbolRankItem) => {
        setActiveAdd(data.symbolAddr);
    }

    const handleTableChange = (pagination: TablePaginationConfig, filters: Record<string, (Key | boolean)[] | null>, sorter: SorterResult<any> | SorterResult<any>[], extra: TableCurrentDataSource<any>) => {
        let field = Array.isArray(sorter) ? sorter[0].field : sorter.field;
        let order = Array.isArray(sorter) ? sorter[0].order : sorter.order;
        const sortField = typeof order !== 'undefined' ? field as string : (sort.sortField === 'totalAsset' ? 'holdAddrCount' : 'totalAsset');
        const sortType = typeof order !== 'undefined' ? (order === 'descend' ? '0' : '') : '0';
        const newSort = {
            ...sort
        }
        newSort.sortField = sortField;
        newSort.sortType = sortType;
        setSort(newSort);
    }

    return (
        <div className="token-hold-rank-top10">
            <p className="title">{f('symbolHoldRankTop10')}</p>
            <div className="token-hold-top10-horizontal">
                <div className="common-table hold-top10-table" style={{ marginLeft: 0, marginTop: 0 }}>
                    <Table
                        columns={columns}
                        rowKey="symbolAddr"
                        dataSource={holdSymbolRank.list}
                        loading={loading}
                        onRow={record => {
                            return {
                                onMouseEnter: event => {
                                    handleMouseEnter(record);
                                },
                                onMouseLeave: event => {
                                    handleMouseLeave(record);
                                }
                            };
                        }}
                        pagination={false}
                        onChange={handleTableChange}
                        rowClassName={
                            (record: HoldSymbolRankItem, index) => {
                                if (record.symbolAddr === activeAdd) {
                                    return "ant-table-row-selected";
                                } else {
                                    return '';
                                }
                            }
                        }
                    />
                    <WaterMarkContent bottom={25} />
                </div>
                <div className="distribute-chart">
                    {
                        holdSymbolRank.list.length > 0 ? (
                            <div style={{ height: '350px' }}>
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
                                <p style={{ marginTop: 10, textAlign: 'center' }}>{sort.sortField === 'totalAsset' ? f('symbolHoldRankTop10Distribution') : f('symbolHoldAddrNumRankTop10Distribution')}</p>
                            </div>
                        ) : (
                            <div className="table-empty" style={{ height: 200, marginTop: 50 }}>
                                <DefinEmpty spinning={loading} />
                                <p style={{ marginTop: 10, textAlign: 'center' }}>{sort.sortField === 'totalAsset' ? f('symbolHoldRankTop10Distribution') : f('symbolHoldAddrNumRankTop10Distribution')}</p>
                            </div>)
                    }
                </div>
            </div>
        </div>
    );
}