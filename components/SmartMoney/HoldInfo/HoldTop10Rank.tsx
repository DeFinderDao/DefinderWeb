import { message, Spin, Table, Progress } from "antd";
import { useEffect, useMemo, useState, Key } from "react";
import { CHART_AXIS_COLOR, LINESTYLE_WIDTH } from "utils/env";
import loadable from "@loadable/component";
import { HoldAssetRankItem } from "redux/types/SmartMoneyTypes";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "redux/reducers";
import usePrevious from "components/UsePreviousHook";
import { requestHoldAssetRankSuccess } from "redux/actions/SmartMoneyAction";
import Global from "utils/Global";
import { useIntl } from "react-intl";
import type { Options } from "@ant-design/plots/lib/hooks/useChart";
import type { TablePaginationConfig } from 'antd/lib/table'
import type { SorterResult, TableCurrentDataSource, SortOrder } from 'antd/lib/table/interface'
import React from "react";
import DefinEmpty from "components/Header/definEmpty";
import ApiClient from "utils/ApiClient";
import type { Datum } from '@antv/g2plot/lib/types/common'
import GlobalLabel from "components/GlobalLabel";
import WaterMarkContent from "components/WaterMarkContent";

const Column = loadable(() => import('@ant-design/plots/lib/components/column'))

type HoldTop10RankItemColumn = {
    addr: string,
    type: string,
    value: number,
    valueStr: string,
}

export default function HoldTop10Rank() {
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id })
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [sort, setSort] = useState({
        sortField: '',
        sortType: ''
    });
    const { holdAssetRank, addressType, showTab } = useSelector((state: AppState) => state.smartMoneyReducer);
    const addressTitle = f('address');
    const totalAssetTitle = f('totalAsset');
    const unStableAssetTitle = f('unStableAsset');
    const ethAssetTitle = f('ethAsset');

    function mapTableDataToChartData(data: HoldAssetRankItem[]) {
        const array = [];
        for (const item of data) {
            array.push({
                addr: item.address,
                value: item.totalAssetNum,
                type: totalAssetTitle,
                valueStr: item.totalAsset
            });
            array.push({
                addr: item.address,
                value: item.unStableAssetNum,
                type: unStableAssetTitle,
                valueStr: item.unStableAsset,
            });
            array.push({
                addr: item.address,
                value: item.ethAssetNum,
                type: ethAssetTitle,
                valueStr: item.ethAsset
            });
        }
        return array;
    }

    function requestData(addressType: string, sortField: string, sortType: string) {
        setLoading(true);
        const apiClient = new ApiClient<any>();
        apiClient.post('/smart/money/hold/asset/rank', {
            data: {
                addressType: parseInt(addressType),
                sortField,
                sortType
            }
        }).then(success => {
            dispatch(requestHoldAssetRankSuccess(success.data.list));
        }, fail => {
            message.error(fail.message);
        }).finally(() => {
            setLoading(false)
        });
    }

    //const [isFirstMount, setFirstMount] = useState(true);
    //const preMounted = usePrevious(isFirstMount);
    const preSort = usePrevious(sort);
    const preAddressType = usePrevious(addressType);
    useEffect(() => {
        if (showTab === 'hold' && (preSort !== sort || preAddressType !== addressType)) {
            requestData(addressType, sort.sortField, sort.sortType);
        }
        /*setFirstMount(false);
        if (preMounted) {
            if (holdAssetRank.length === 0) {
                requestData(addressType, sort.sortField, sort.sortType);
            }
        } else {
            requestData(addressType, sort.sortField, sort.sortType);
        }*/
    }, [sort, addressType, showTab])

    const columns = [
        {
            title: addressTitle,
            dataIndex: 'address',
            align: 'left' as const,
            render: (text: string, record: HoldAssetRankItem) => {
                return <GlobalLabel addr={record.address} label={record.addressLabel} />
            }
        },
        {
            title: totalAssetTitle,
            dataIndex: 'totalAsset',
            sorter: true,
            sortDirections: ['descend' as const],
            align: 'left' as const,
            render: (text: string, data: HoldAssetRankItem) => {
                return <>${Global.formatBigNum(data.totalAsset)}<Progress showInfo={false} percent={data.totalAssetRate} /></>;
            }
        },
        {
            title: unStableAssetTitle,
            dataIndex: 'unStableAsset',
            sorter: true,
            sortDirections: ['descend' as const],
            align: 'left' as const,
            render: (text: string, data: HoldAssetRankItem) => {
                return <>${Global.formatBigNum(data.unStableAsset)}<Progress showInfo={false} percent={data.unStableAssetRate} /></>;
            }
        },
        {
            title: ethAssetTitle,
            dataIndex: 'ethAsset',
            sorter: true,
            sortDirections: ['descend' as const],
            align: 'left' as const,
            render: (text: string, data: HoldAssetRankItem) => {
                return <>${Global.formatBigNum(data.ethAsset)}<Progress showInfo={false} percent={data.ethAssetRate} /></>;
            }
        },
    ];

    const columnData = useMemo(() => mapTableDataToChartData(holdAssetRank), [holdAssetRank]);

    const [plot, setPlot] = useState<undefined | Options>();
    const [activeAdd, setActiveAdd] = useState('')
    useEffect(() => {
        if (typeof plot !== 'undefined') {
            plot.setState('active', (item: HoldTop10RankItemColumn) => {
                if (item.addr === activeAdd) {
                    return true;
                } else {
                    return false;
                }
            });
        }
    }, [plot, activeAdd]);

    const pieSelected = ({ event }: Record<string, any>) => {
        if (event.type == 'element:mouseleave') {
            setActiveAdd('')
        } else {
            if (event.data) {
                setActiveAdd(event.data.data.addr)
            }
        }
    }

    const config = {
        animation: undefined,
        data: columnData,
        xField: 'addr',
        yField: 'value',
        seriesField: 'type',
        isGroup: true,
        legend: {
            offsetY: -5
        },
        columnStyle: {
            radius: [20, 20, 0, 0],
        },
        padding: 'auto' as any,
        xAxis: {
            line: null,
            grid: null,
            label: null
        },
        yAxis: {
            label: {
                formatter: (text: string) => {
                    return Global.formatYAxis(text, f);
                },
            },
        },
        tooltip: {
            fields: ['type', 'valueStr'],
            formatter: (datum: Datum) => {
                return { name: datum.type, value: `$${Global.formatBigNum(datum.valueStr)}` };
            },
        },
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
            }
        ],
    };

    const handleTableChange = (pagination: TablePaginationConfig, filters: Record<string, (Key | boolean)[] | null>, sorter: SorterResult<any> | SorterResult<any>[], extra: TableCurrentDataSource<any>) => {
        let field = Array.isArray(sorter) ? sorter[0].field : sorter.field;
        let order = Array.isArray(sorter) ? sorter[0].order : sorter.order;
        const sortField = typeof order !== 'undefined' ? field as string : '';
        const sortType = typeof order !== 'undefined' ? (order === 'descend' ? '0' : '') : '';
        const newSort = {
            ...sort
        }
        newSort.sortField = sortField;
        newSort.sortType = sortType;
        setSort(newSort);
    }

    const { isOpen } = useSelector((state: AppState) => state.menuList);

    return (
        <div className="hold-top10">
            <p className="title">{f('holdMoneyRankTop10')}</p>
            <div className="hold-top10-horizontal">
                <div className="common-table hold-top10-table" style={{ marginLeft: 0, marginTop: 0 }}>
                    <Table
                        columns={columns}
                        rowKey="address"
                        dataSource={holdAssetRank}
                        loading={loading}
                        onRow={record => {
                            return {
                                onMouseEnter: event => {
                                    setActiveAdd(record.address);
                                },
                                onMouseLeave: event => {
                                    setActiveAdd('');
                                },
                            };
                        }}
                        pagination={false}
                        onChange={handleTableChange}
                        rowClassName={
                            (record: HoldAssetRankItem, index) => {
                                let className = '';
                                if (record.address === activeAdd) {
                                    className += "ant-table-row-selected";
                                }
                                if (isOpen) {
                                    className += " short"
                                }
                                return className;
                            }
                        }
                    />
                    <WaterMarkContent bottom={25} />
                </div>
                <div className="distribute-chart">
                    {
                        !loading && columnData.length > 0 ? (
                            <div style={{ height: '400px', position: 'relative' }}>
                                <p>{f('holdMoneyRankTop10Distribution')}</p>
                                <Column
                                    {...config}
                                    onReady={(plot: Options) => {
                                        setPlot(plot);
                                    }} />
                                <WaterMarkContent right={50} bottom={125} />
                            </div>) : (
                            <div className="table-empty" style={{ height: 200, marginTop: 50 }}>
                                <p style={{ textAlign: 'center' }}>{f('holdMoneyRankTop10Distribution')}</p>
                                <DefinEmpty spinning={loading} />
                            </div>)
                    }
                </div>
            </div>
        </div>
    );
}

/*type ColumnProps = {
    activeAdd: string,
    setActiveAdd: (value: string) => void,
    columnData: HoldTop10RankItemColumn[]
}

const MemoColumn = React.memo(RightColumn);

function RightColumn({activeAdd,setActiveAdd,columnData} : ColumnProps) {
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id })
    const [plot,setPlot] = useState<undefined | Options>();
    const pieSelected = ({ event }: Record<string, any>) => {
        if (event.type == 'element:mouseleave') {
            setActiveAdd('')
        } else {
            setActiveAdd(event.data.data.addr)
        }
    }

    useEffect(() => {
        if(typeof plot !== 'undefined') {
            plot.setState('active', (item: HoldTop10RankItemColumn)=>{
                if(item.type === activeAdd) {
                    return true;
                } else {
                    return false;
                }
            });
        }
    },[plot,activeAdd]);

    const config = {
        data: columnData,
        xField: 'addr',
        yField: 'value',
        seriesField: 'type',
        isGroup: true,
        columnStyle: {
            radius: [20, 20, 0, 0],
        },
        padding: 'auto' as any,
        xAxis: {
            line: null,
            grid: null,
            label: null
        },
        yAxis: {
            label: {
                formatter: (text: string) => {
                  return Global.formatYAxis(text, f);
                },
            },
        },
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
            {
                type: 'active-region',
                cfg: {
                    start: [
                        {
                            trigger: 'plot:mousemove',
                            action: 'active-region:show',
                            callback(context: Record<string, any>) {
                                pieSelected(context)
                            },
                        }],
                    end: [{
                        trigger: 'plot:mouseleave', action: 'active-region:hide',
                        callback(context: Record<string, any>) {
                            pieSelected(context)
                        },
                    }],
                },
            },
        ],
        
      };

    return (
        <Column 
        {...config} 
        onReady={(plot: Options) => {
            setPlot(plot);
        }}/>
    );
}*/