import { useIntl } from "react-intl";
import { useEffect, useState } from 'react'
import { DatePicker, message, Tooltip } from 'antd'
import Global from 'utils/Global'
import moment, { Moment } from 'moment'
import React from 'react'
const { RangePicker } = DatePicker
import type { RangeValue } from 'rc-picker/lib/interface'
import DefinEmpty from 'components/Header/definEmpty'
import ApiClient from 'utils/ApiClient'
import * as echarts from 'echarts/core';
import {
    LineChart,
    BarChart
} from 'echarts/charts';
import {
    TooltipComponent,
    GridComponent,
    DataZoomComponent,
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import {
    QuestionCircleOutlined
} from '@ant-design/icons';
import { useRouter } from "next/router";
import { DefaultLocale } from "utils/env";
import { useSelector } from "react-redux";
import type { AppState } from "redux/reducers";
import UpdateTimeCom from "components/UpdateTimeCom";
import WaterMarkContent from "components/WaterMarkContent";

echarts.use([
    TooltipComponent,
    GridComponent,
    LineChart,
    LabelLayout,
    BarChart,
    UniversalTransition,
    CanvasRenderer,
    DataZoomComponent,
]);

const colors = ['#3ba272', '#5470c6', '#299bef',];

type HoldersAndTraders = {
    time: number[],
    holders: number[],
    buyers: number[],
    sellers: number[]
}

const dateFormat = 'YYYY-MM-DD'

export default function HoldersAndTraders({ symbolAddr }: { symbolAddr: string }) {
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id })
    const { locale = DefaultLocale } = useRouter();

    const [loading, setLoading] = useState(true);
    const [startTime, setStartTime] = useState<Moment>(moment().subtract(30, 'd'));
    const [endTime, setEndTime] = useState<Moment>(moment());
    const [holdersAndTraders, setHoldersAndTraders] = useState<undefined | HoldersAndTraders>();
    const [updateTime, setUpdateTime] = useState<null | number>();
    const { isOpen } = useSelector((state: AppState) => state.menuList);
    const [myChart,setMyChart] = useState<echarts.ECharts | undefined>();

    const handleDatePickerChange = (dates: RangeValue<Moment>) => {
        setStartTime(moment(dates![0]));
        setEndTime(moment(dates![1]));
    }

    useEffect(() => {
        const apiClient = new ApiClient<HoldersAndTraders>();
        const st = moment(startTime).hour(0).minute(0).second(0);
        const et = moment(endTime).hour(0).minute(0).second(0);
        const promise = apiClient.post('/market/nft/holders/traders', {
            data: {
                symbolAddr: symbolAddr,
                startTime: st.unix(),
                endTime: et.unix()
            }
        });
        setLoading(true);
        promise.then((success) => {
            const holdersAndTraders = success.data;
            setHoldersAndTraders(holdersAndTraders);
            setUpdateTime(success.updateTime);
            const chart = echarts.init(document.getElementById('holders-traders-chart')!);
            setMyChart(chart);
            
            chart.setOption({
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                    }
                },
                color: colors,
                grid: {
                    top: 20
                },
                dataZoom: [
                    {
                        type: 'slider',
                        xAxisIndex: 0,
                        filterMode: 'none',
                        height: 15,
                        borderColor: '#35343D',
                        showDetail: false,
                        labelFormatter: function (value: number) {
                            return moment(holdersAndTraders.time[value]).format("YYYY/MM/DD");
                        },
                        showDataShadow: 'auto',
                        brushSelect: false,
                        handleStyle: {
                            borderCap: 'round'
                        },
                        minSpan: 5,
                        //handleIcon: 'M224 96h576a128 128 0 0 1 128 128v576a128 128 0 0 1-128 128H224a128 128 0 0 1-128-128V224a128 128 0 0 1 128-128z m0 32a96 96 0 0 0-96 96v576a96 96 0 0 0 96 96h576a96 96 0 0 0 96-96V224a96 96 0 0 0-96-96H224z'
                    },
                ],
                xAxis: [
                    {
                        type: 'category',
                        data: holdersAndTraders.time,
                        axisLabel: {
                            formatter: function (value: string) {
                                return moment(parseInt(value)).format("YYYY/MM/DD");
                            },
                        },
                        axisPointer: {
                            label: {
                                formatter: (params: any) => {
                                    return moment(parseInt(params.value)).format("YYYY/MM/DD")
                                }
                            }
                        },
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        splitLine: {
                            show: false
                        },
                        axisLine: {
                            show: true
                        }
                    },
                    {
                        type: 'value',
                        splitLine: {
                            show: false
                        },
                        axisLine: {
                            show: true
                        },
                        min: holdersAndTraders.holders === null ? 0 : Math.min(...holdersAndTraders.holders),
                        max: holdersAndTraders.holders === null ? 0 : Math.max(...holdersAndTraders.holders)
                    }
                ],
                series: [
                    {
                        name: f('nftHolder'),
                        type: 'line',
                        yAxisIndex: 1,
                        tooltip: {
                            valueFormatter: function (value: number) {
                                return Global.formatNum(value);
                            }
                        },
                        data: holdersAndTraders.holders
                    },
                    {
                        name: f('buyers'),
                        type: 'bar',
                        tooltip: {
                            valueFormatter: function (value: number) {
                                return Global.formatNum(value);
                            }
                        },
                        data: holdersAndTraders.buyers
                    },
                    {
                        name: f('sellers'),
                        type: 'bar',
                        tooltip: {
                            valueFormatter: function (value: number) {
                                return Global.formatNum(value);
                            }
                        },
                        data: holdersAndTraders.sellers
                    },
                ]
            });
        }, fail => {
            message.error(fail.message);
        }).finally(() => {
            setLoading(false);
        });

        return () => {
            if (typeof myChart !== 'undefined') {
                myChart.dispose();
                setMyChart(undefined);
            }
        }
    }, [startTime, endTime, symbolAddr, locale]);

    useEffect(() => {
        if(typeof myChart !== 'undefined' && !myChart.isDisposed()) {
            myChart.resize({
                animation: {
                    duration: 200
                }
            });
        }
    },[isOpen]);

    const isDatasetEmpty = typeof holdersAndTraders === 'undefined' || 
    holdersAndTraders.buyers === null ||
    holdersAndTraders.sellers === null || 
    holdersAndTraders.holders === null;

    return (
        <div className="item-column">

            <div className="column-header">
                <div className="header-label">
                    {f('holdersAndTraders')}
                    <div className="bar-line-legend">
                        <div className="legend-item">
                            <span className="bar"></span>
                            {f('nftHolder')}
                        </div>
                        <div className="legend-item">
                            <span className="square" style={{ backgroundColor: colors[1] }}></span>
                            {f('buyers')}
                            <Tooltip
                                title={f('buyersTip')}>
                                <QuestionCircleOutlined style={{
                                    fontSize: '14px',
                                    marginLeft: '5px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                }} />
                            </Tooltip>
                        </div>
                        <div className="legend-item">
                            <span className="square" style={{ backgroundColor: colors[2] }}></span>
                            {f('sellers')}
                            <Tooltip
                                title={f('sellersTip')}>
                                <QuestionCircleOutlined style={{
                                    fontSize: '14px',
                                    marginLeft: '5px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                }} />
                            </Tooltip>
                        </div>
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <UpdateTimeCom updateTime={updateTime} style={{ marginLeft: 30 }} />
                    <div style={{ marginTop: 15 }}>
                        <RangePicker
                            defaultValue={[
                                startTime,
                                endTime,
                            ]}
                            format={dateFormat}
                            allowClear={false}
                            value={[startTime, endTime]}
                            onChange={handleDatePickerChange}
                        />
                    </div>
                </div>
            </div>
            <div style={{ position: 'relative', width: '100%', height: 370 }}>
                <div className="bar-line-chart-container" style={{ width: '100%', height: '100%', position: 'absolute'}}>
                    <div id="holders-traders-chart" style={{ height: '100%',visibility: isDatasetEmpty ? 'hidden' : 'visible'}}>

                    </div>
                    {isDatasetEmpty ? '' : <WaterMarkContent right={80} />}
                    <div className="table-empty" style={{
                        position: 'absolute',
                        height: '100%',
                        width: '100%',
                        display: (isDatasetEmpty || loading ? 'block' : 'none'),
                        marginTop: 40,
                        top: 0,
                        zIndex: 2
                    }}>
                        <DefinEmpty spinning={loading} />
                    </div>
                </div>
            </div>
        </div>
    );
}
