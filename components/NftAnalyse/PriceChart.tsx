import * as echarts from 'echarts/core';
import {
    LineChart,
    LineSeriesOption,
    ScatterChart,
    ScatterSeriesOption,
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
    QuestionCircleOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import { DefaultLocale, NOT_A_NUMBER } from 'utils/env';
import { useSelector } from 'react-redux';
import type { AppState } from 'redux/reducers';
import UpdateTimeCom from 'components/UpdateTimeCom';
import WaterMarkContent from 'components/WaterMarkContent';

type ECOption = echarts.ComposeOption<
    | LineSeriesOption
    | TitleComponentOption
    | TooltipComponentOption
    | GridComponentOption
    | ScatterSeriesOption
    | LegendComponentOption
    | DataZoomComponentOption
>;

echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LineChart,
    LabelLayout,
    ScatterChart,
    UniversalTransition,
    CanvasRenderer,
    DataZoomComponent,
    LegendComponent
]);

type Price = {
    values: Array<Array<number>>
}

type Order = {
    bc: string,
    addr: string,
    tokenId: string,
    buyer: string,
    seller: string,
    nftName: string,
    buyerLabel: string,
    sellerLabel: string
}

type Scatter = {
    values: Array<Array<number>>,
    meta: {
        orders: Array<Order>,
        min: number,
        max: number,
    }
}

type AddrTags = {
    [key: string]: {
        addr: string,
        blockchain: string,
        isContract: boolean,
        isWhale: boolean
    }
}

type Meta = {
    avgPriceEth: string,
    avgPriceDollar: string,
    avgPriceIncrease: string,
    floorPriceEth: string,
    floorPriceDollar: string,
    floorPriceIncrease: string,
    minPrice: string,
    minPriceIncrease: string,
    maxPrice: string,
    maxPriceIncrease: string,
    txNum: string,
    txIncrease: string,
}

type PriceData = {
    floorPrice: Price,
    avgPrice: Price,
    salesScatter: Scatter | null,
    type: number,
    meta: Meta | null,
    addrTags: AddrTags | null
}

type TimeSegements = {
    [key: string]: string
}

const colors = ['#5470c6', '#299bef', '#3ba272', '#ee6666', '#5470c6'];

const CLICK_INDEX_FLOOR_PRICE = 0;

const CLICK_INDEX_AVG_PRICE = 1;

const CLICK_INDEX_MAX_PRICE = 2;

const CLICK_INDEX_MIN_PRICE = 3;

const CLICK_INDEX_NORMAL_SALES = 4;

const CLICK_INDEX_WHEALS = 5;

let SERIES_FLOOR_PRICE: string;

let SERIES_AVG_PRICE: string;

let SERIES_MAX_PRICE: string;

let SERIES_MIN_PRICE: string;

let SERIES_NORMAL_SALES: string;

let SERIES_WHEALS: string;

export default function PriceChart({ symbolAddr }: { symbolAddr: string }) {
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id })
    const [chart, setChart] = useState<echarts.ECharts | undefined>();
    const [showFloorPrice, setShowFloorPrice] = useState(true);
    const [showAvgPrice, setShowAvgPrice] = useState(true);
    const [showMaxPrice, setShowMaxPrice] = useState(true);
    const [showMinPrice, setShowMinPrice] = useState(true);
    const [showNormalSales, setShowNormalSales] = useState(true);
    const [showWheals, setShowWheals] = useState(true);
    const { locale = DefaultLocale } = useRouter();
    
    const [time, setTime] = useState<string>("2");
    const [loading, setLoading] = useState(false);
    const [priceData, setPriceData] = useState<undefined | PriceData>();
    const [updateTime, setUpdateTime] = useState<null | number>();
    const { isOpen } = useSelector((state: AppState) => state.menuList);

    SERIES_FLOOR_PRICE = f('floorPrice');
    SERIES_AVG_PRICE = f('avgPrice');
    SERIES_MAX_PRICE = f('maxPrice');
    SERIES_MIN_PRICE = f('minPrice');
    SERIES_NORMAL_SALES = f('normalSales');
    SERIES_WHEALS = f('whealsTrade');

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

    const toolTipFormatter = (priceData: PriceData, series: string, params: any | Array<any>, ticket: string, callback: (ticket: string, html: string) => string | HTMLElement | HTMLElement[], f: (key: string) => string) => {
        //console.log(params.data[0],moment(parseInt(params.data[0])).format("MMM DD,YYYY,HH:mm"));
        const date = params.data[0];
        const index = priceData.salesScatter === null ? -1 : priceData.salesScatter.values.findIndex((item: Array<number>) => {
            return item[0] === date
        });
        let marker = '';
        let priceText = f('unifiedSearchPrice');
        switch (series) {
            case SERIES_MAX_PRICE:
                priceText = f('maxPrice');
                marker = `<span style="display:inline-block;width: 10px;height: 10px;border-radius: 5px;background-color: ${colors[2]};margin-right: 10px"></span>`
                break;
            case SERIES_MIN_PRICE:
                priceText = f('minPrice');
                marker = `<span style="display:inline-block;width: 10px;height: 10px;border-radius: 5px;background-color: ${colors[3]};margin-right: 10px"></span>`
                break;
            case SERIES_WHEALS:
            case SERIES_NORMAL_SALES:
                marker = `<span style="display:inline-block;width: 10px;height: 10px;border-radius: 5px;background-color: ${colors[4]};margin-right: 10px"></span>`;
                break;
        }

        if (index === -1) {
            return (
                "<div>" +
                "<div>" +
                marker +
                `${moment(parseInt(params.data[0])).format("YYYY/MM/DD HH:mm:ss")}` +
                "</div>" +
                '<div style="margin-top: 5px;">' +
                `<span>${priceText} ${params.data[1]}ETH</span>` +
                "</div>" +
                "</div>");
        } else {
            const order = priceData.salesScatter === null ? null : priceData.salesScatter.meta.orders[index];
            const buyerTag = priceData.addrTags === null || order === null ? null : priceData.addrTags[order.buyer];
            const sellerTag = priceData.addrTags === null || order === null ? null : priceData.addrTags[order.seller];
            const nftName = order === null ? '' : '<div style="margin-top: 5px;">' +
                `<span>${order.nftName === null ? '' : order.nftName} #${order.tokenId.length > 20 ? `${order.tokenId.slice(0, 10)}...${order.tokenId.slice(order.tokenId.length - 5, order.tokenId.length)}` : order.tokenId}</span>` +
                "</div>";
            return (
                "<div>" +
                "<div>" +
                marker +
                `${moment(parseInt(params.data[0])).format("YYYY/MM/DD HH:mm:ss")}` +
                "</div>" +
                nftName +
                '<div style="margin-top: 5px;">' +
                `<span>${priceText} ${params.data[1]}${order === null ? '' : order.bc}</span>` +
                "</div>" +
                '<div style="margin-top: 5px;">' +
                `[${sellerTag !== null && sellerTag.isWhale ? '🐋' : ''}${order === null ? '' : (order.sellerLabel !== null ? order.sellerLabel : Global.abbrSymbolAddress(order.seller))}] -> [${buyerTag !== null && buyerTag.isWhale ? '🐋' : ''}${order === null ? '' : (order.buyerLabel !== null ? order.buyerLabel : Global.abbrSymbolAddress(order.buyer))}]` +
                "</div>" +
                "</div>");
        }
    }

    const isTradeContainsWheal = (data: PriceData, index: number) => {
        return data.addrTags !== null &&
            (data.addrTags[data.salesScatter!.meta.orders[index].buyer].isWhale ||
                data.addrTags[data.salesScatter!.meta.orders[index].seller].isWhale);
    }

    useEffect(() => {
        let myChart: echarts.ECharts | undefined;
        const apiClient = new ApiClient<PriceData>();
        setLoading(true);
        apiClient.get('/market/nft/prices', {
            params: {
                type: time,
                symbolAddr: symbolAddr
            }
        }).then(
            success => {
                setLoading(false);
                const priceData = success.data;
                setUpdateTime(success.updateTime);            
                myChart = echarts.init(document.getElementById('price-chart')!);
                let salesScatterValues: any = [];
                let minPointData: number[] = [];
                let isMinPointWheal = false;
                let maxPointData: number[] = [];
                let isMaxPointWheal = false;
                let whealsPointData: Array<number[]> = [];
                if (priceData.salesScatter !== null && priceData.salesScatter.values) {
                    salesScatterValues = priceData.salesScatter.values.map((value, index) => {
                        if (value[1] === priceData.salesScatter!.meta.min) {
                            minPointData = value;
                            isMinPointWheal = isTradeContainsWheal(priceData, index);
                            return {
                                value,
                                itemStyle: {
                                    opacity: 0
                                }
                            };
                        } else if (value[1] === priceData.salesScatter!.meta.max) {
                            maxPointData = value;
                            isMaxPointWheal = isTradeContainsWheal(priceData, index);
                            return {
                                value,
                                itemStyle: {
                                    opacity: 0
                                }
                            };
                        } else if (isTradeContainsWheal(priceData, index)) {
                            whealsPointData.push(value);
                            return {
                                value,
                                itemStyle: {
                                    opacity: 0
                                }
                            }
                        } else {
                            return value;
                        }
                    });
                }
                console.log(whealsPointData);
                setPriceData(priceData);
                setChart(myChart);
                myChart.setOption({
                    title: {
                        show: false,
                    },
                    legend: {
                        show: false
                    },
                    color: colors,
                    grid: {
                        top: 30,
                        right: 40,
                        //width: 800,
                    },
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
                        valueFormatter: (value: any) => value === null ? '--' : value + 'ETH'
                    },
                    dataZoom: [
                        {
                            type: 'slider',
                            yAxisIndex: 0,
                            filterMode: 'none',
                            width: 15,
                            right: 10,
                            borderColor: '#35343D',
                            showDetail: false,
                            showDataShadow: false,
                            brushSelect: false,
                            handleStyle: {
                                borderCap: 'round'
                            },
                            //handleIcon: 'M224 96h576a128 128 0 0 1 128 128v576a128 128 0 0 1-128 128H224a128 128 0 0 1-128-128V224a128 128 0 0 1 128-128z m0 32a96 96 0 0 0-96 96v576a96 96 0 0 0 96 96h576a96 96 0 0 0 96-96V224a96 96 0 0 0-96-96H224z'
                        },
                        {
                            type: 'slider',
                            xAxisIndex: 0,
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
                    xAxis: [
                        {
                            type: 'time',
                            axisLabel: {
                                formatter: function (value: string, index: number) {
                                    if (time === '1') {
                                        return `${moment(parseInt(value)).format("HH")}:00`;
                                    } else
                                        return moment(parseInt(value)).format("MMM DD");
                                },
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
                            name: `${f('avgPrice')}(ETH)`,
                            nameLocation: 'center',
                            nameGap: 45,
                            boundaryGap: false,
                            min: 'dataMin'
                        }
                    ],
                    series: [
                        {
                            type: 'line',
                            name: SERIES_AVG_PRICE,
                            xAxisIndex: 0,
                            yAxisIndex: 0,
                            connectNulls: true,
                            data: priceData.avgPrice === null ? [] : priceData.avgPrice.values
                        },
                        {
                            type: 'line',
                            name: SERIES_FLOOR_PRICE,
                            xAxisIndex: 0,
                            yAxisIndex: 0,
                            connectNulls: true,
                            data: priceData.floorPrice === null ? [] : priceData.floorPrice.values
                        },
                        {
                            type: 'scatter',
                            name: SERIES_NORMAL_SALES,
                            data: salesScatterValues,
                            xAxisIndex: 0,
                            symbolSize: 15,
                            symbol: 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAA0pJREFUWEfNl01ME1EQx/+zLVQTIRxMiEpMRAMnTxiVrUbQgx9Ro+kWDlwVE41h6wcGL+JF4meXGE1Erxyg20jQiB4UiHZRIydPEIWEoIaEA1ETLbQ75pUF29LCVkrqnpruvJn/25k383uEHD+U4/iwLaDu7NvC35JZSYQ9IOwhRjEDxWIDBEwwYQKMfmb0rzKlgfa7O7/b2ZwtAUpD6DSILgHYaMcpgDEwX9db3feXsl9UQFVzr3PtlKsbwEHhiMHDRNITcOSpQ8r/+ss58038vzqSty5qTq8HOQ8zm0cIVGYF7pksCh/ta66OpBOSVoDHN1BDzB3WwkEC2gKa3LbUjsR7r2rUM1APoCImnKg26K/sTLU2pQCvGtrLoJexBYSA7pdr7AROtlF8RicY3lk3vC+guV8l2ywQ4PV2OnhDifXJ+KquuZv/JfjcGkUNNQN0JSbiy7gzEKiJxvtbIMDjM24Q4yKAFl2TLy8n+F8RxjUATUy4GfTLjWkFxOV9UNfkbdkIHifig6iJ5HqY/wLH1N4iJ1yDAEoJOGW34OyKtArzAYCRCMIVXVr1lNVDZl14VOMYAY/BGNVb5VK7jjOxUxqMERA2MXA8qMldCQIU1fADUAF+pGvuk5k4tmurqKGHAJ0AoOma7EsU4DNCYMhAtFrXdvfZdZqJnaK+rgIcvSAYul92JwjwqsYnBjY7JEd5x50dw5k4tmtbe+5dWdSMDhHwOaDJW5JT8APAmul8s7D7xi7xO+vP0cY3BfnTkhhSP3VNLvi/BOQ+BbkuQkWdbZcguq37Ky9kvQAAKL6BW2A+H9/m5zuhp8HYT4TnYuYHNXf5SgjwqKEhwQrMOBBslV8kFKFArrDD/CioZ4Vb8ZgrKm2dQ7aEaWih1z0AKzaMwHwmHtUWjGNFNZ7FEGwZIJKcvjgw6dE1+dCiPGBx4MysUXaBZLIonJfMhymRLIkH/xlM5k/WIlyYFkoTuBBYFpSm48GEU5Dq2Ak+NEtKWixEE1w+CuKXgNmeEssh1YFpn5j5sQQSbkrj403JHLhoDaQSYqWkRdCSzf4wwkRN6VA8YwFigUA2B1xVhNjVbHuaq9l7BvqjCPfNIddSgm1dzZZyspz3ORfwB0VThzA9CqPaAAAAAElFTkSuQmCC',
                            emphasis: {
                                scale: 1.5,
                            },
                            tooltip: {
                                trigger: 'item',
                                formatter: function (params: any | Array<any>, ticket: string, callback: (ticket: string, html: string) => string | HTMLElement | HTMLElement[]) {
                                    return toolTipFormatter(priceData, SERIES_NORMAL_SALES, params, ticket, callback, f);
                                }
                            }
                        },
                        {
                            type: 'scatter',
                            name: SERIES_MAX_PRICE,
                            data: [maxPointData],
                            xAxisIndex: 0,
                            symbolSize: isMaxPointWheal ? 20 : 15,
                            symbol: isMaxPointWheal ? `image://${window.location.protocol}//${window.location.host}/images/whale-01.svg` :
                                'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAA2ZJREFUWEfNl09ME0EUxr+3bdWDoDciCSSiwZMnjIYuiSAH/0SNHoCDdhujYqIxgS1q8CJeJAJdSIwmooZ0qwfhoFEjelAgYUs0cvIkUUggwXBT9CC23Wd2aSstLUz5E+htu99775vZNzO/Iazxj9a4PoQN7Ht8OVcyN5RK4P0E7GcgD4Q8ewCMKQKmGBgwQQOm9Hfow+k70yKDEzLgDtRfJKJrAApFkgIYZ+bbIW/7vcX0Cxoo72tyhsd/vgDR4ViiEQa9lKLRV5CkSY44v1v/kzOyDaaZbzocRwl8DEDx7Mxwr6twy/H+iqZIJiMZDcjBhmqw+TQ2xcMkUeegx9+52Iis92VBXy2bXAtCia0nqcbwtHWni01rwK3XHSBI72IBPYaiVYsUTtXIumoVrZptE7MypHS8T9XMM1DVXeWY/FNgTxkzboa8WtNSisdj3AG1iQg3rOf8TRPOnuqe6Nx88wzIQV8LmK8AaDYU7fpyisdjZV29BaARRK2Gx381owE5WF8NpqdgDBtebc9KFE+YCKif7J4grjE87Yl+SMxAeVfd1rBDGgZQREQXRBtO1KTdmMz3AYy6omZJ/5mOH3Z/xhOUBn0nJOZnAMYMRSsSTZyNTtbVUQDbTaKTQx7/8yQDsq62A6gD4aHh0c5nk1hUKwfVB2CcA9BhKFp9koEyXTUYcFPUrBg809EvmjQbXVlXXTk7pD4CQoOKJqfOwFcAO4ixa9CrjWSTWFRbFlCLmfAFwDdD0XYmGwiqv8DYjLAz1zjb8ks0aTY6+dHVHLgi0yD8NjxazjozoKtr+wnWQxPa2yWD/CHF35DNtxXVunVfG4F9c7f5/xuR7jsogd8AGDEUbZdo0mx0sq5aK6DYBB0aUvxvk5rQQi6n6fpsUc8qb8XjESm8O45sSadhDL3uruZhxMyX5qLa/OM4UP86hmBLBpHUz5IAE+Zew9t+ZEEesDlwYjpsiVYaSFwFua5UPkyLZEk8uAwwSYCI3W3puTAjlCZxIWNZUJqJB5NWQbrlZPPhTGFzDNEsyRgI7yhiPkmH5eyUToFRaZ35dj6i1vyN442pHLhgD6QzEkO1ZouWBNf9KIgb56JXpjihm5EVbCHbjNNRLrF9Ndub4Wr20SQa2BiJ9seRazHDwgYWS7TU92tu4B8L55IwXT8sOgAAAABJRU5ErkJggg==',
                            tooltip: {
                                trigger: 'item',
                                formatter: function (params: any | Array<any>, ticket: string, callback: (ticket: string, html: string) => string | HTMLElement | HTMLElement[]) {
                                    return toolTipFormatter(priceData, SERIES_MAX_PRICE, params, ticket, callback, f);
                                }
                            }
                        },
                        {
                            type: 'scatter',
                            name: SERIES_MIN_PRICE,
                            data: [minPointData],
                            xAxisIndex: 0,
                            symbolSize: isMinPointWheal ? 20 : 15,
                            symbol: isMinPointWheal ? `image://${window.location.protocol}//${window.location.host}/images/whale-02.svg` :
                                'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAA0xJREFUWEfNl01IVFEUx//3zTTjIsU3k0SzCLLQVSsjqBZaBn1QUQt10UZk3lUKoegL2zRtkrIokELvG8RNC3VRVGSBli4qiFy1UkrBhRE288RaODbzTtzxKW/GGX3jB9OFB+/j3HP+977zzvk9hjwPluf4cCwg0txchLm5A0xRKkFUCWC7dcg1/EwejA2TaQ6joOCTv7191sniHAmIatoFMHYDwE4nTgFMguiuT9efrGa/ogAKhdzG1NQLACekIwLGFOBl3DRfeRmbiiUSP+R9r8u1I0YUcCvKKRM4zYAyK3C/GgicYaFQPJuQrAJmmppqTdPssQKPABB+IcRqK5LPI5xzAJwBFfJaUZS64o6O3kxzMwqYCQaPmIoyKCcwoE8VotZJ4HQbg/NeAmqSIkyzujgcfpdus0xAb02N66iqJreMgNt+IUJrCb44J8J5iAG35PWAYbhr+/oSdn/LBEQ5vwfgGhhr9XV23lxP8MW50cbGOyBqAdDmE+J6VgERTatljPUQMOIXYt9GBLftxBeZE0RU59f1pXxY2gGjvr6YPB6ZbKUENDpNOKciZWIyoBPAOJufr1C7u2esHFtw8YvzswrwDMCET4hSp45zsYtyPg5glwmc2ybE8xQBBucPCbjEgLAqhJaLY6e2Buc6AUEGPFKFuJwiIMr5BwAHE6Z5uCQcHnLqNBe76WCwyqUo7wF89AlxKF3ANwC73UTlRbo+lotjp7azmlYWZ2wUwHefEHvSBfwGsDURjxeVdHXJ8w0f0w0NhS63WzapPz4hCv87AXl/BXlOQqtcMuCBKsTVDU8AAAbn9wm4Yi/zS5UwomnHGGNvZM/3C1G+GQIinI9KViCi435df5uShBK5WCz2VVLPJpfiSfJ69y4iW0o3tNDr8WY2IxBdtKNapnb8WiLYekAk/fXZwKTfJ8TJFXnA4sC/0mijgUQNBLak82FmJLPx4HrAxAYiWbkwO5TauFDmxLqgNAsPpnwFmT47iw9bk4i2MCYYMBg3zadZsPw8AdWy51v2bQOG0ZLOgSvmQCYhFqpJIU5BZZyIWuzola2uOPozkpMlsiU8nioXUEnA/ky/Zgz4nACGXfPzQ4vItVpBcyxgNUdrfZ53Af8AtbmHMFORVM8AAAAASUVORK5CYII=',
                            tooltip: {
                                trigger: 'item',
                                formatter: function (params: any | Array<any>, ticket: string, callback: (ticket: string, html: string) => string | HTMLElement | HTMLElement[]) {
                                    return toolTipFormatter(priceData, SERIES_MIN_PRICE, params, ticket, callback, f);
                                }
                            }
                        },
                        {
                            type: 'scatter',
                            name: SERIES_WHEALS,
                            data: whealsPointData,
                            xAxisIndex: 0,
                            symbolSize: 20,
                            symbol: `image://${window.location.protocol}//${window.location.host}/images/whale-03.svg`,
                            tooltip: {
                                trigger: 'item',
                                formatter: function (params: any | Array<any>, ticket: string, callback: (ticket: string, html: string) => string | HTMLElement | HTMLElement[]) {
                                    return toolTipFormatter(priceData, SERIES_WHEALS, params, ticket, callback, f);
                                }
                            }
                        }
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
                setChart(undefined);
            }
        }
    }, [time, symbolAddr, locale]);

    useEffect(() => {
        if (typeof chart !== 'undefined' && !chart.isDisposed()) {
            chart.resize({
                animation: {
                    duration: 200
                }
            });
        }
    }, [isOpen]);

    const handleLegendItemClick = (index: number) => {
        switch (index) {
            case CLICK_INDEX_FLOOR_PRICE: {
                setShowFloorPrice(!showFloorPrice);
                dispatchLegendAction(SERIES_FLOOR_PRICE, !showFloorPrice);
                break;
            }
            case CLICK_INDEX_AVG_PRICE: {
                setShowAvgPrice(!showAvgPrice);
                dispatchLegendAction(SERIES_AVG_PRICE, !showAvgPrice);
                break;
            }
            case CLICK_INDEX_MAX_PRICE: {
                setShowMaxPrice(!showMaxPrice);
                dispatchLegendAction(SERIES_MAX_PRICE, !showMaxPrice);
                break;
            }
            case CLICK_INDEX_MIN_PRICE: {
                setShowMinPrice(!showMinPrice);
                dispatchLegendAction(SERIES_MIN_PRICE, !showMinPrice);
                break;
            }
            case CLICK_INDEX_NORMAL_SALES: {
                setShowNormalSales(!showNormalSales);
                dispatchLegendAction(SERIES_NORMAL_SALES, !showNormalSales);
                break;
            }
            case CLICK_INDEX_WHEALS: {
                setShowWheals(!showWheals);
                dispatchLegendAction(SERIES_WHEALS, !showWheals);
                break;
            }
        }
    }

    const dispatchLegendAction = (name: string, isSelected: boolean) => {
        if (typeof chart !== 'undefined' && !chart.isDisposed()) {
            chart.dispatchAction({
                type: isSelected ? 'legendSelect' : 'legendUnSelect',
                name: name
            });
        }
    }

    const legendShowClassName = 'price-chart-legend-item';
    const legendUnshowClassName = 'price-chart-legend-item price-chart-legend-item-disable';

    const onChange = (e: RadioChangeEvent) => {
        setTime(e.target.value);
        setShowFloorPrice(true)
        setShowAvgPrice(true)
        setShowMaxPrice(true)
        setShowMinPrice(true)
        setShowNormalSales(true)
        setShowWheals(true)
    }

    const avgPrice = typeof priceData === 'undefined' || priceData.meta === null || !priceData.meta.avgPriceEth ? NOT_A_NUMBER : priceData.meta.avgPriceEth;
    const avgFlow = typeof priceData === 'undefined' || priceData.meta === null || !priceData.meta.avgPriceIncrease ? '' : Global.formatIncreaseNumber(priceData.meta.avgPriceIncrease);
    const avgPriceDollar = typeof priceData === 'undefined' || priceData.meta === null || !priceData.meta.avgPriceDollar ? NOT_A_NUMBER : `$${Global.formatNum(priceData.meta.avgPriceDollar)}`;

    const floorPrice = typeof priceData === 'undefined' || priceData.meta === null || !priceData.meta.floorPriceEth ? NOT_A_NUMBER : priceData.meta.floorPriceEth;
    const floorFlow = typeof priceData === 'undefined' || priceData.meta === null || !priceData.meta.floorPriceIncrease ? '' : Global.formatIncreaseNumber(priceData.meta.floorPriceIncrease);
    const floorPriceDollar = typeof priceData === 'undefined' || priceData.meta === null || !priceData.meta.floorPriceDollar ? NOT_A_NUMBER : `$${Global.formatNum(priceData.meta.floorPriceDollar)}`;

    const maxPrice = typeof priceData === 'undefined' || priceData.meta === null || !priceData.meta.maxPrice ? NOT_A_NUMBER : priceData.meta.maxPrice;
    const maxPriceFlow = typeof priceData === 'undefined' || priceData.meta === null || !priceData.meta.maxPriceIncrease ? '' : Global.formatIncreaseNumber(priceData.meta.maxPriceIncrease);

    const minPrice = typeof priceData === 'undefined' || priceData.meta === null || !priceData.meta.minPrice ? NOT_A_NUMBER : priceData.meta.minPrice;
    const minPriceFlow = typeof priceData === 'undefined' || priceData.meta === null || !priceData.meta.minPriceIncrease ? '' : Global.formatIncreaseNumber(priceData.meta.minPriceIncrease);

    const txNum = typeof priceData === 'undefined' || priceData.meta === null || !priceData.meta.txNum ? NOT_A_NUMBER : priceData.meta.txNum;
    const txNumFlow = typeof priceData === 'undefined' || priceData.meta === null || !priceData.meta.txIncrease ? '' : Global.formatIncreaseNumber(priceData.meta.txIncrease);

    const isDatasetEmpty = typeof priceData === 'undefined';

    return (
        <div className='price-chart-container'>

            <div className='price-chart-header'>
                <div className='header-label'>{f('unifiedSearchPrice')}</div>
                <div>
                    <Radio.Group
                        options={options}
                        onChange={onChange}
                        value={time}
                        optionType="button"
                        buttonStyle="solid"
                    />
                    <UpdateTimeCom updateTime={updateTime} style={{ marginLeft: 30 }} />
                </div>
            </div>

            <div style={{ position: 'relative', width: '100%' }}>
                <div style={{ width: '100%', height: 420, display: 'flex', position: 'absolute' }}>
                    <div style={{ width: '75%', position: 'relative' }}>
                        <div className='price-chart-legend'>
                            <div className={showAvgPrice ? legendShowClassName : legendUnshowClassName} onClick={handleLegendItemClick.bind(null, CLICK_INDEX_AVG_PRICE)}>
                                <div className='legend-item-column-1'>
                                    <span className='line' style={{ backgroundColor: showAvgPrice ? colors[0] : '' }}></span>
                                    {f('avgPrice')}
                                </div>
                            </div>
                            <div className={showFloorPrice ? legendShowClassName : legendUnshowClassName} onClick={handleLegendItemClick.bind(null, CLICK_INDEX_FLOOR_PRICE)}>
                                <div className='legend-item-column-1'>
                                    <span className='line' style={{ backgroundColor: showFloorPrice ? colors[1] : '' }}></span>
                                    {f('floorPrice')}
                                </div>
                            </div>
                            <div className={showMaxPrice ? legendShowClassName : legendUnshowClassName} onClick={handleLegendItemClick.bind(null, CLICK_INDEX_MAX_PRICE)}>
                                <div className='legend-item-column-1'>
                                    <span className='point' style={showMaxPrice ? { border: `1px solid ${colors[2]}`, backgroundColor: 'transparent' } : {}}></span>
                                    {f('maxPrice')}
                                </div>
                            </div>
                            <div className={showMinPrice ? legendShowClassName : legendUnshowClassName} onClick={handleLegendItemClick.bind(null, CLICK_INDEX_MIN_PRICE)}>
                                <div className='legend-item-column-1'>
                                    <span className='point' style={showMinPrice ? { border: `1px solid ${colors[3]}`, backgroundColor: 'transparent' } : {}}></span>
                                    {f('minPrice')}
                                </div>
                            </div>
                            <div className={showNormalSales ? legendShowClassName : legendUnshowClassName} onClick={handleLegendItemClick.bind(null, CLICK_INDEX_NORMAL_SALES)}>
                                <div className='legend-item-column-1' style={{ display: 'flex', alignItems: 'center' }}>
                                    <span className='point' style={showNormalSales ? { border: `1px solid ${colors[4]}`, backgroundColor: 'transparent' } : {}}></span>
                                    {f('normalSales')}
                                </div>
                            </div>
                            <div className={showWheals ? legendShowClassName : legendUnshowClassName} onClick={handleLegendItemClick.bind(null, CLICK_INDEX_WHEALS)}>
                                <div className='legend-item-column-1' style={{ display: 'flex', alignItems: 'center' }}>
                                    <span style={{ marginRight: 4 }}>🐋</span>
                                    {f('whealsTrade')}
                                </div>
                            </div>
                        </div>
                        <div id="price-chart" style={{ height: '100%', visibility: isDatasetEmpty || loading ? 'hidden' : 'visible' }}>

                        </div>
                        {isDatasetEmpty ? '' : <WaterMarkContent right={80} />}
                        <div className="table-empty" style={{
                            position: 'absolute',
                            height: '100%',
                            width: '100%',
                            display: (isDatasetEmpty || loading ? 'block' : 'none'),
                            top: 0,
                            marginTop: 60,
                            zIndex: 2
                        }}>
                            <DefinEmpty spinning={loading} />
                        </div>
                    </div>
                    <div className='chart-meta-data'>
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
                                {f('floorPrice')}
                                <Tooltip
                                    placement="top"
                                    title={f('floorPriceTip')}
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
                                {floorPrice}&nbsp;&nbsp;{floorFlow}
                            </div>
                            <div className='value-column-2'>{floorPriceDollar}</div>
                        </div>
                        <div className='meta-data-item'>
                            <div className='title defi-color0'>{`${f('maxPrice')}(${timeMap[time]})`}</div>
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
                                {maxPrice}&nbsp;&nbsp;{maxPriceFlow}
                            </div>
                        </div>
                        <div className='meta-data-item'>
                            <div className='title defi-color0'>{`${f('minPrice')}(${timeMap[time]})`}</div>
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
                                {minPrice}&nbsp;&nbsp;{minPriceFlow}
                            </div>
                        </div>
                        <div className='meta-data-item'>
                            <div className='title defi-color0'>{`${f('transactionsNumber')}(${timeMap[time]})`}</div>
                            <div className='value-column-1'>{txNum}&nbsp;&nbsp;{txNumFlow}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 