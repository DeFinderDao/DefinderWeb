//Stablecoins vs All Coins
import { useIntl } from "react-intl";
import moment from "moment";
import loadable from '@loadable/component'
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "redux/reducers";
import { useEffect, useRef, useState } from "react";
import { requestCoinsPercentSuccess, requestPiePercentSuccess } from "redux/actions/SmartMoneyAction";
import { message, Spin } from "antd";
import DefinEmpty from "components/Header/definEmpty";
import { ANT_CHARTS_DARK, CHART_AXIS_COLOR, LINESTYLE_WIDTH } from "utils/env";
import Global from "utils/Global";
import { CoinsPercentItem, PiePercents } from "redux/types/SmartMoneyTypes";
const DualAxes = loadable(() => import('@ant-design/plots/lib/components/dualAxes'))
const Pie = loadable(() => import('@ant-design/plots/lib/components/pie'))
import type { Datum } from '@antv/g2plot/lib/types/common'
import ApiClient from "utils/ApiClient";
import usePrevious from "components/UsePreviousHook";
import WaterMarkCahrtContent from "components/WaterMarkCahrtContent";
import BigNumber from 'bignumber.js'
import UpdateTimeCom from "components/UpdateTimeCom";

export default function BottomCharts() {
    const { formatMessage } = useIntl();
    const f = (id: string) => formatMessage({ id });
    const { coinsPercent, coinsPercentUpdateTime, addressType, piePercents, showTab } = useSelector((state: AppState) => state.smartMoneyReducer);
    const dispatch = useDispatch();
    const [tableLoading, setTableLoading] = useState(false);
    const [pieLoading, setPieLoading] = useState(false);

    function requestData(addressType: string) {
        setTableLoading(true);
        const apiClient = new ApiClient<any>();
        apiClient.post('/smart/money/hold/symbol/rate/trend', {
            data: {
                addressType: addressType === '0' ? null : parseInt(addressType)
            }
        }).then(success => {
            dispatch(requestCoinsPercentSuccess(
                success.data,
                success.updateTime));
        }, fail => {
            message.error(fail.message);
        }).finally(() => {
            setTableLoading(false);
        });
    }

    function requestPieData(addressType: string) {
        setPieLoading(true);
        const apiClient = new ApiClient<any>();
        apiClient.post('/smart/money/hold/symbol/rate/pie', {
            data: {
                addressType: parseInt(addressType)
            }
        }).then(success => {
            dispatch(requestPiePercentSuccess(success.data));
        }, fail => {
            message.error(fail.message);
        }).finally(() => {
            setPieLoading(false);
        });
    }

    const preAddressType = usePrevious(addressType);
    useEffect(() => {
        if (showTab === 'hold' && (addressType !== preAddressType || typeof piePercents === 'undefined')) {
            requestPieData(addressType);
        }
        if (showTab === 'hold' && (addressType !== preAddressType || coinsPercent.length === 0)) {
            requestData(addressType);
        }
    }, [addressType, showTab, coinsPercent, piePercents])

    return (
        <div className="bottom-charts">
            <div className="sva">
                <div className="title">
                    <div>Stablecoins vs All Coins</div>
                    <UpdateTimeCom updateTime={coinsPercentUpdateTime} />
                </div>

                <Axes coinsPercent={coinsPercent} loading={tableLoading} />
            </div>

            <PieComponent piePercents={piePercents} loading={pieLoading} />
        </div>);
}

function Axes({ coinsPercent, loading }: { coinsPercent: CoinsPercentItem[], loading: boolean }) {
    const { formatMessage } = useIntl();
    const f = (id: string) => formatMessage({ id });
    const { pageMode } = useSelector((state: AppState) => state.userInfo);
    const [width, setWidth] = useState(0);
    useEffect(() => {
        if (coinsPercent.length > 0) {
            //console.log(document.getElementById('dualaxes')!.offsetWidth);
            setWidth(document.getElementById('dualaxes')!.offsetWidth);
        }
    }, [coinsPercent]);
    const config = {
        width,
        data: [coinsPercent, coinsPercent],
        xField: 'date',
        yField: ['stableRate', 'ethRate'],
        theme: pageMode === 'dark' ? ANT_CHARTS_DARK : undefined,
        geometryOptions: [
            {
                lineStyle: LINESTYLE_WIDTH
            },
            {
                lineStyle: LINESTYLE_WIDTH
            }
        ],
        yAxis: {
            stableRate: {
                label: {
                    formatter: (text: string) => {
                        return Global.formatYAxis(text, f);
                    },
                },
                ...Global.findMinAndMax(coinsPercent.map((item: CoinsPercentItem) => {
                    return item.stableRate;
                })),
                grid: null,
                line: {
                    style: {
                        stroke: CHART_AXIS_COLOR,
                        ...LINESTYLE_WIDTH
                    },
                },
            },
            ethRate: {
                label: {
                    formatter: (text: string) => {
                        return Global.formatYAxis(text, f);
                    },
                },
                ...Global.findMinAndMax(coinsPercent.map((item: CoinsPercentItem) => {
                    return item.ethRate;
                })),
                grid: null,
                line: {
                    style: {
                        stroke: CHART_AXIS_COLOR,
                        ...LINESTYLE_WIDTH
                    },
                },
            }
        },
        slider: {
            ...ANT_CHARTS_DARK.components.slider.common,
            start: 0,
            end: 1,
            formatter(time: number) {
                return moment(Number(time)).format('YYYY/MM/DD')
            },
            padding: [0, 0, -22, 0]
        },
        padding: [20, 20, 30, 20],
        tooltip: {
            title: 'time'
        },
        meta: {
            
            stableRate: {
                alias: f('stableRate'),
                formatter: (stableRate: number, index?: number) => {
                    if (stableRate < 0.0001) {
                        return '<0.01%'
                    }
                    return `${(stableRate * 100).toFixed(2)}%`
                },
            },
            
            ethRate: {
                alias: f('ethRate'),
                formatter: (ethRate: number, index?: number) => {
                    if (ethRate < 0.0001) {
                        return '<0.01%'
                    }
                    return `${(ethRate * 100).toFixed(2)}%`
                },
            },
            date: {
                sync: false,
            },
        },
        xAxis: {
            tickCount: 10,
            label: {
                formatter: (time: string) => {
                    return moment(Number(time)).format('yyyy/MM/DD')
                },
            },
            line: {
                style: {
                    stroke: CHART_AXIS_COLOR,
                    ...LINESTYLE_WIDTH
                },
            },
        },
    }
    return (
        <div style={{ height: '312px', position: 'relative', marginTop: 20 }} id="dualaxes">
            {!loading && coinsPercent.length > 0 ? (width > 0 ?
                (<><DualAxes
                    {...config}
                    fallback={
                        <div
                            style={{
                                width: '100%',
                                height: '200px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Spin></Spin>
                        </div>
                    }
                />
                    <WaterMarkCahrtContent right={100} top={194} />
                </>) : '') :
                (<div className="table-empty" style={{ height: 200, marginTop: 50 }}>
                    <DefinEmpty spinning={loading} />
                </div>)}

        </div>);
}

function PieComponent({ piePercents, loading }: { piePercents: PiePercents | undefined, loading: boolean }) {
    const { pageMode } = useSelector((state: AppState) => state.userInfo);
    const array = [];
    const { formatMessage } = useIntl();
    const f = (id: string) => formatMessage({ id });
    if (typeof piePercents !== 'undefined') {
        array.push({
            type: f('holdingInStablecoins'),
            percent: piePercents.stableRate
        });
        array.push({
            type: f('holdingInEth'),
            percent: piePercents.ethRate
        });
        array.push({
            type: f('holdingOther'),
            percent: piePercents.other
        });
    }
    const config = {
        width: 350,
        height: 350,
        appendPadding: 10,
        data: array,
        angleField: 'percent',
        colorField: 'type',
        radius: 1,
        theme: pageMode === 'dark' ? ANT_CHARTS_DARK : undefined,
        innerRadius: 0.45,
        legend: {
            layout: 'vertical' as const,
            position: 'top' as const
        },
        tooltip: {
            formatter: (datum: Datum) => {
                return { name: datum.type, value: datum.percent.toFixed(2) + '%' };
            },
        },
        pieStyle: {
            stroke: null
        },
        label: {
            type: 'inner',
            offset: '-50%',
            formatter: function formatter(item: Record<string, number>, mappingData: any, index: number) {
                return `${(item.percent * 100).toFixed(2)}%`
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
                    if (array.length > 0) {
                        return (
                            <img
                                src={'/images/definder_logo_d.svg'}
                                style={{ width: '40px' }}
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
    return (
        <div className="pie-container" style={{ height: 350, marginTop: 30 }}>
            {array.length > 0 && !loading ?
                <Pie
                    {...config}
                    fallback={
                        <div className="loading-pie">
                            <Spin></Spin>
                        </div>
                    }
                /> :
                <div className="table-empty" style={{ height: 200, marginTop: 50 }}>
                    <DefinEmpty spinning={loading} />
                </div>
            }
        </div>
    )
}