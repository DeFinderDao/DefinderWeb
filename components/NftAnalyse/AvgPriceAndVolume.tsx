import * as echarts from 'echarts/core';
import {
    LineChart,
    LineSeriesOption,
    BarChart,
    BarSeriesOption
} from 'echarts/charts';
import {
    TitleComponent,
    TitleComponentOption,
    TooltipComponent,
    TooltipComponentOption,
    GridComponent,
    GridComponentOption,
    DataZoomComponent,
    DataZoomComponentOption,
    LegendComponent,
    LegendComponentOption
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { useEffect, useState } from 'react';
import ApiClient from 'utils/ApiClient';
import moment from "moment";
import "styles/nft-price-chart.less"
import Global from 'utils/Global';
import { useIntl } from 'react-intl';
import { message, RadioChangeEvent, Radio, Tooltip } from 'antd';
import DefinEmpty from 'components/Header/definEmpty';
import {
    QuestionCircleOutlined,
} from '@ant-design/icons';
import { DefaultLocale, NOT_A_NUMBER } from 'utils/env';
import { useRouter } from 'next/router';
import { useSelector } from "react-redux";
import type { AppState } from "redux/reducers";
import UpdateTimeCom from 'components/UpdateTimeCom';
import WaterMarkContent from 'components/WaterMarkContent';

type ECOption = echarts.ComposeOption<
    | LineSeriesOption
    | TitleComponentOption
    | TooltipComponentOption
    | GridComponentOption
    | BarSeriesOption
    | LegendComponentOption
    | DataZoomComponentOption
>;

echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LineChart,
    LabelLayout,
    BarChart,
    UniversalTransition,
    CanvasRenderer,
    DataZoomComponent,
    LegendComponent
]);

type Price = {
    values: Array<Array<number>>
}

type Meta = {
    avgPriceEth: string,
    avgPriceDollar: string,
    avgPriceIncrease: string,
    valueInEth: string,
    valueInDollar: string,
    valueInIncrease: string,
    txNum: string,
    type: number,
    txIncrease: string
}

type Volume = {
    values: Array<Array<number>>
}

type PriceData = {
    avgPrice: Price,
    volume: Volume,
    meta: Meta | null,
    type: number
}

type TimeSegements = {
    [key: string]: string
}

const colors = ['#5470c6', '#299bef'];

const SERIES_VOLUME = "Volume";

const SERIES_AVG_PRICE = "Avg Price";

const CHART_HEIGHT = 400;

export default function AvgPriceAndVolume({ symbolAddr }: { symbolAddr: string }) {
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id })
    const { locale = DefaultLocale } = useRouter();
    const [time, setTime] = useState<string>("2");
    const [loading, setLoading] = useState(false);
    const [priceData, setPriceData] = useState<undefined | PriceData>();
    const [updateTime, setUpdateTime] = useState<null | number>();
    const { isOpen } = useSelector((state: AppState) => state.menuList);
    const [myChart, setMyChart] = useState<echarts.ECharts | undefined>();

    const timeMap: TimeSegements = {
        "1": f('radio24H'),
        "2": f('radio7D'),
        "3": f('radio30d'),
        "4": f('radio3m'),
        "5": f('radio1Y'),
        "6": f('radioAll')
    }

    const computeInterval = (time: string) => {
        switch (time) {
            case "1":
                return 3600 * 1000;
            case "2":
                return 3600 * 1000 * 4;
            case "3":
            case "4":
            case "5":
            case "6":
            default:
                return 3600 * 1000 * 24;
        }
    }

    const options = [
        { label: timeMap["1"], value: "1" },
        { label: timeMap["2"], value: "2" },
        { label: timeMap["3"], value: "3" },
        { label: timeMap["4"], value: "4" },
        { label: timeMap["5"], value: "5" },
        { label: timeMap["6"], value: "6" },
    ];

    useEffect(() => {
        const apiClient = new ApiClient<PriceData>();
        setLoading(true);
        apiClient.get('/market/nft/avg/price/volume', {
            params: {
                type: time,
                symbolAddr: symbolAddr
            }
        }).then(
            success => {
                setLoading(false);
                const priceData = success.data;
                const chart = echarts.init(document.getElementById('avg-volume-chart')!);
                setMyChart(chart);
                setPriceData(priceData);
                setUpdateTime(success.updateTime);
                
                chart.setOption({
                    title: {
                        show: false,
                    },
                    legend: {
                        show: false
                    },
                    color: colors,
                    grid: {
                        top: 30,
                        right: 50,
                        //width: 800,
                    },
                    dataZoom: [
                        {
                            type: 'slider',
                            xAxisIndex: [0,1],
                            filterMode: 'none',
                            height: 15,
                            borderColor: '#09090A',
                            showDetail: false,
                            showDataShadow: false,
                            brushSelect: false,
                            handleStyle: {
                                borderCap: 'round'
                            },
                        },
                    ],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'line',
                            lineStyle: {
                                type: 'dashed',
                                dashOffset: 5,
                                color: '#35343D'
                            },
                        },
                        valueFormatter: (value: any) => value + 'ETH'
                    },
                    xAxis: [
                        {
                            type: 'time',
                            axisLabel: {
                                formatter: function (value: string, index: number) {
                                    if (time === "1") {
                                        return `${moment(parseInt(value)).format("HH")}:00`;
                                    } else {
                                        return moment(parseInt(value)).format("MMM DD");
                                    }
                                },
                                hideOverlap: true
                            },
                            interval: computeInterval(time),
                            boundaryGap: false,
                            axisLine: {
                                show: false
                            },
                            axisTick: {
                                show: false
                            },
                            axisPointer: {
                                label: {
                                    formatter: (params: any) => {
                                        return moment(parseInt(params.value)).format("YYYY/MM/DD HH:mm:ss")
                                    }
                                }
                            },
                        },
                        {
                            type: 'time',
                            show: false,
                        },
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            splitLine: {
                                lineStyle: {
                                    type: 'dashed',
                                    dashOffset: 5,
                                    color: '#35343D'
                                }
                            },
                            axisLabel: {
                                formatter: function (value: number) {
                                    return Global.formatYAxis(value.toString(),f);
                                }
                            },
                            name: `${f('avgPrice')}(ETH)`,
                            nameLocation: 'center',
                            nameGap: 35,
                            boundaryGap: false,
                        },
                        {
                            type: 'value',
                            splitLine: {
                                show: false
                            },
                            axisLabel: {
                                formatter: function (value: number) {
                                    return Global.formatYAxis(value.toString(),f);
                                }
                            },
                            name: `${f('volume')}(ETH)`,
                            nameLocation: 'center',
                            nameGap: 35,
                            boundaryGap: false,
                        },
                    ],
                    series: [
                        {
                            type: 'line',
                            name: f('avgPrice'),
                            xAxisIndex: 0,
                            yAxisIndex: 0,
                            data: priceData.avgPrice === null ? [] : priceData.avgPrice.values
                        },
                        {
                            type: 'bar',
                            name: f('volume'),
                            xAxisIndex: 0,
                            yAxisIndex: 1,
                            data: priceData.volume === null ? [] : priceData.volume.values,
                            barMaxWidth: 10,
                        },
                    ]
                });
            },
            fail => {
                setLoading(false);
                message.error(fail.message);
            }
        );


        return () => {
            if (typeof myChart !== 'undefined') {
                myChart.dispose();
                setMyChart(undefined);
            }
        }
    }, [time, symbolAddr, locale]);

    useEffect(() => {
        if (typeof myChart !== 'undefined' && !myChart.isDisposed()) {
            myChart.resize({
                animation: {
                    duration: 200
                }
            });
        }
    }, [isOpen]);

    const onChange = (e: RadioChangeEvent) => {
        setTime(e.target.value);
    }

    const avgPrice = typeof priceData === 'undefined' || priceData.meta === null || !priceData.meta.avgPriceEth ? NOT_A_NUMBER : priceData.meta.avgPriceEth;
    const avgFlow = typeof priceData === 'undefined' || priceData.meta === null || !priceData.meta.avgPriceIncrease ? '' : Global.formatIncreaseNumber(priceData.meta.avgPriceIncrease);
    const avgPriceDollar = typeof priceData === 'undefined' || priceData.meta === null || !priceData.meta.avgPriceDollar ? NOT_A_NUMBER : `$${Global.formatNum(priceData.meta.avgPriceDollar)}`;

    const volumePrice = typeof priceData === 'undefined' || priceData.meta === null || !priceData.meta.valueInEth ? NOT_A_NUMBER : priceData.meta.valueInEth;
    const volumeFlow = typeof priceData === 'undefined' || priceData.meta === null || !priceData.meta.valueInIncrease ? '' : Global.formatIncreaseNumber(priceData.meta.valueInIncrease);
    const volumePriceDollar = typeof priceData === 'undefined' || priceData.meta === null || !priceData.meta.valueInDollar ? NOT_A_NUMBER : `$${Global.formatNum(priceData.meta.valueInDollar)}`;

    const txNum = typeof priceData === 'undefined' || priceData.meta === null || !priceData.meta.txNum ? NOT_A_NUMBER : priceData.meta.txNum;
    const txNumFlow = typeof priceData === 'undefined' || priceData.meta === null || !priceData.meta.txIncrease ? '' : Global.formatIncreaseNumber(priceData.meta.txIncrease);

    const isDatasetEmpty = typeof priceData === 'undefined' ||
    priceData.avgPrice === null ||
    priceData.volume === null;

    return (
        <div className='price-chart-container' style={{ minHeight: 480 }}>

            <div className='price-chart-header'>
                <div className='header-label'>
                    {f('avgPriceAndVolume')}
                </div>
                <div>
                    <Radio.Group
                        options={options}
                        onChange={onChange}
                        value={time}
                        optionType="button"
                        buttonStyle="solid"
                    />
                    <UpdateTimeCom updateTime={updateTime} style={{marginLeft: 30}} />
                </div>
            </div>

            <div style={{ position: 'relative', width: '100%' }}>
                <div style={{ width: '100%', height: CHART_HEIGHT, display: 'flex', position: 'absolute'}}>
                    <div style={{ width: '75%',position: 'relative' }}>
                        <div className='price-chart-legend'>
                            <div className='price-chart-legend-item'>
                                <div className='legend-item-column-1'>
                                    <span className='line' style={{ backgroundColor: colors[0] }}></span>
                                    {f('avgPrice')}
                                </div>
                            </div>
                            <div className='price-chart-legend-item'>
                                <div className='legend-item-column-1'>
                                    <span className='square' style={{ backgroundColor: colors[1] }}></span>
                                    {f('volume')}
                                </div>
                            </div>
                        </div>
                        <div id="avg-volume-chart" style={{ height: '100%',visibility: isDatasetEmpty || loading ? 'hidden' : 'visible' }}>

                        </div>
                        {isDatasetEmpty ? '' : <WaterMarkContent right={80} />}
                        <div className="table-empty" style={{
                            position: 'absolute',
                            height: CHART_HEIGHT,
                            width: '100%',
                            display: (isDatasetEmpty || loading ? 'block' : 'none'),
                            zIndex: 2,
                            top: 0,
                            marginTop: 60
                        }}>
                            <DefinEmpty spinning={loading} />
                        </div>
                    </div>
                    <div className='chart-meta-data' style={{ height: 300, marginTop: 50 }}>
                        <div className='meta-data-item'>
                            <div className='title defi-color0'>
                                {`${f('avgPrice')}(${timeMap[time]})`}
                                <Tooltip
                                    placement="top"
                                    title={f('avgPriceTip')}
                                >
                                    <QuestionCircleOutlined
                                        style={{ fontSize: '16px', marginLeft: '10px' }}
                                    />
                                </Tooltip>
                            </div>
                            <div className='value-column-1'>
                                <svg
                                    className="icon"
                                    aria-hidden="true"
                                    style={{
                                        width: 12,
                                        height: 12,
                                        marginRight: 4,
                                        verticalAlign: 'middle',
                                    }}>
                                    <use xlinkHref='#icon-ETH1'></use>
                                </svg>
                                {avgPrice}&nbsp;&nbsp;{avgFlow}
                            </div>
                            <div className='value-column-2'>{avgPriceDollar}</div>
                        </div>
                        <div className='meta-data-item'>
                            <div className='title defi-color0'>
                                {`${f('volume')}(${timeMap[time]})`}
                            </div>
                            <div className='value-column-1'>
                                <svg
                                    className="icon"
                                    aria-hidden="true"
                                    style={{
                                        width: 12,
                                        height: 12,
                                        marginRight: 4,
                                        verticalAlign: 'middle',
                                    }}>
                                    <use xlinkHref='#icon-ETH1'></use>
                                </svg>
                                {volumePrice}&nbsp;&nbsp;{volumeFlow}
                            </div>
                            <div className='value-column-2'>{volumePriceDollar}</div>
                        </div>
                        <div className='meta-data-item'>
                            <div className='title defi-color0'>
                                {`${f('txNum')}(${timeMap[time]})`}
                                <Tooltip
                                    placement="top"
                                    title={f('txNumTips')}
                                >
                                    <QuestionCircleOutlined
                                        style={{ fontSize: '16px', marginLeft: '10px' }}
                                    />
                                </Tooltip>
                            </div>
                            <div className='value-column-1'>{txNum}&nbsp;&nbsp;{txNumFlow}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 