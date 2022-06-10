import { useIntl } from "react-intl";
import { useEffect, useState } from 'react'
import { DatePicker, message, Tooltip } from 'antd'
import Global from 'utils/Global'
import moment, { Moment } from 'moment'
import loadable from '@loadable/component'
import React from 'react'
const { RangePicker } = DatePicker
import type { RangeValue } from 'rc-picker/lib/interface'
import DefinEmpty from 'components/Header/definEmpty'
import WaterMarkCahrtContent from 'components/WaterMarkCahrtContent'
import ApiClient from 'utils/ApiClient'
import * as echarts from 'echarts/core';
import {
    LineChart,
    LineSeriesOption,
} from 'echarts/charts';
import {
    TooltipComponent,
    TooltipComponentOption,
    GridComponent,
    GridComponentOption,
    DataZoomComponent,
    DataZoomComponentOption,
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

type ECOption = echarts.ComposeOption<
    | LineSeriesOption
    | TooltipComponentOption
    | GridComponentOption
    | DataZoomComponentOption
>;

echarts.use([
    TooltipComponent,
    GridComponent,
    LineChart,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer,
    DataZoomComponent,
]);

const colors = ['#3ba272', '#5470c6'];

type BuyersAndSellers = {
    buyers: Array<{
        time: string,
        value: number
    }>,
    sellers: Array<{
        time: string,
        value: number
    }>
}

const dateFormat = 'YYYY-MM-DD'

export default function BuyersAndSellersMarket({symbolAddr} : {symbolAddr: string}) {
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id })
    const { locale = DefaultLocale } = useRouter();

    const [loading, setLoading] = useState(true);
    const [startTime, setStartTime] = useState<Moment>(moment().subtract(30, 'd'));
    const [endTime, setEndTime] = useState<Moment>(moment());
    const [updateTime,setUpdateTime] = useState<null | number>();
    const [buyersAndSellers, setBuyersAndSellers] = useState<undefined | BuyersAndSellers>();
    const { isOpen } = useSelector((state: AppState) => state.menuList);
    const [myChart,setMyChart] = useState<echarts.ECharts | undefined>();

    const handleDatePickerChange = (dates: RangeValue<Moment>, dateStrings: string[]) => {
        setStartTime(moment(dates![0]));
        setEndTime(moment(dates![1]));
    }

    useEffect(() => {
        const apiClient = new ApiClient<BuyersAndSellers>();
        const st = moment(startTime).hour(0).minute(0).second(0);
        const et = moment(endTime).hour(0).minute(0).second(0);
        const promise = apiClient.post('/market/nft/buyer/seller', {
            data: {
                symbolAddr,
                startTime: st.unix(),
                endTime: et.unix(),
            }
        });
        setLoading(true);
        promise.then((success) => {
            const buyersAndSellers = success.data;
            setBuyersAndSellers(buyersAndSellers);
            setUpdateTime(success.updateTime);
            const chart = echarts.init(document.getElementById('buyers-sellers-chart')!);
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
                    top: 20,
                    right: 40
                },
                dataZoom: [
                    {
                        type: 'slider',
                        xAxisIndex: 0,
                        filterMode: 'none',
                        height: 15,
                        borderColor: '#35343D',
                        showDetail: false,
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
                        boundaryGap: false
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
                    }
                ],
                series: [
                    {
                        name: f('buyerGD'),
                        type: 'line',
                        tooltip: {
                            valueFormatter: function (value: number) {
                                return Global.formatNum(value) + 'ETH';
                            }
                        },
                        data: buyersAndSellers.buyers.map(item => {
                            return [item.time,item.value]
                        })
                    },
                    {
                        name: f('sellerGD'),
                        type: 'line',
                        tooltip: {
                            valueFormatter: function (value: number) {
                                return Global.formatNum(value) + 'ETH';
                            }
                        },
                        data: buyersAndSellers.sellers.map(item => {
                            return [item.time,item.value]
                        })
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

    const isDatesetEmpty = typeof buyersAndSellers === 'undefined' || buyersAndSellers.buyers === null;
    //console.log(isDatesetEmpty,loading);
    return (
        <div className="item-column">

            <div className="column-header">
                <div className="header-label">
                    {f('buyersAndSellersMarket')}
                    <Tooltip
                        title={f('buyersTip')}>
                        <QuestionCircleOutlined style={{
                            fontSize: '14px',
                            marginLeft: '5px',
                            display: 'inline-flex',
                            alignItems: 'center',
                        }} />
                    </Tooltip>
                    <div className="bar-line-legend">
                        <div className="legend-item">
                            <span className="bar" style={{ backgroundColor: colors[0] }}></span>
                            {f('buyer')}
                        </div>
                        <div className="legend-item">
                            <span className="bar" style={{ backgroundColor: colors[1] }}></span>
                            {f('seller')}
                        </div>
                    </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                    <UpdateTimeCom updateTime={updateTime} style={{ marginLeft: 30 }} />
                    <div style={{marginTop: 15}}>
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
                    <div id="buyers-sellers-chart" style={{ height: '100%',visibility: isDatesetEmpty ? 'hidden' : 'visible'}}>

                    </div>

                    {isDatesetEmpty ? '' : <WaterMarkContent right={80} />}

                    <div className="table-empty" style={{
                        position: 'absolute',
                        height: '100%',
                        width: '100%',
                        marginTop: 40,
                        top: 0,
                        display: isDatesetEmpty || loading ? 'block' : 'none',
                        zIndex: 2
                    }}>
                        <DefinEmpty spinning={loading} />
                    </div>
                </div>
            </div>
        </div>
    );
}