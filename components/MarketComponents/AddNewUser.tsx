import { useEffect, useState } from 'react'
import { Spin, Empty, DatePicker, message } from 'antd'
import Global from 'utils/Global'
import moment, { Moment } from 'moment'
import loadable from '@loadable/component'
import React from 'react'
const { RangePicker } = DatePicker
const DualAxes = loadable(() => import('@ant-design/plots/lib/components/dualAxes'))
import type { RangeValue } from 'rc-picker/lib/interface'
import { useIntl } from 'react-intl'
import ApiClient from 'utils/ApiClient'
import { ANT_CHARTS_DARK, CHART_AXIS_COLOR, LINESTYLE_WIDTH } from 'utils/env'
import { useSelector } from 'react-redux'
import { AppState } from 'redux/reducers'
import DefinEmpty from 'components/Header/definEmpty'
import WaterMarkCahrtContent from 'components/WaterMarkCahrtContent'

const dateFormat = 'YYYY-MM-DD'

function daysNum(data: { startTime: Moment, endTime: Moment; }) {
    let days = data.endTime.diff(
        data.startTime,
        'days'
    )
    let d = 1 - 7 / days
    let max = 0.9
    return d > max ? max : d
}

interface Trend {
    date: number,
    increaseAddress: number,
    netBuy: number,
    time?: string
}

const apiClient = new ApiClient<Trend[]>();

export default function LinChart({ symbolAddr }: { symbolAddr: string }) {

    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id })
    const [data, setData] = useState<Trend[]>([]);
    const [loading, setLoading] = useState(true);
    const [startTime, setStartTime] = useState<Moment>(moment().subtract(30, 'd'));
    const [endTime, setEndTime] = useState<Moment>(moment());

    useEffect(() => {
        asyncFetch();
    }, [symbolAddr, startTime, endTime]);

    const asyncFetch = async () => {
        try {
            const result = await apiClient.post('market/netBuy/add/trend', {
                data: {
                    symbolAddr,
                    startTime: Math.floor(startTime.valueOf() / 1000),
                    endTime: Math.floor(endTime.valueOf() / 1000)
                }
            });
            if (result.data) {
                result.data.forEach((item: Trend) => {
                    item.time = moment(Number(item.date)).format('YYYY/MM/DD')
                });
            }
            setData(result.data);
            setLoading(false)
        } catch (e) {
            setData([]);
            setLoading(false)
            message.error((e as Error).message);
        }
    }

    const handleDatePickerChange = (dates: RangeValue<Moment>, dateStrings: string[]) => {
        setStartTime(moment(dates![0]));
        setEndTime(moment(dates![1]));
    }

    return (
        <div className="block-item item-small" style={{ paddingBottom: 0 }}>
            <div className="item-title">
                {f('addNewUser')}
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
            {data && data.length > 0 ? (
                <div style={{ marginTop: '23px', height: '305px' }}>
                    <Lines data={data} />
                    <WaterMarkCahrtContent right={100} top={240} />
                </div>
            ) : (<div className="table-empty"><DefinEmpty spinning={loading} /></div>)}
        </div>
    )
}

function Lines({ data }: { data: Trend[] }) {
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id })
    let maxIncrease, maxNetBuy, minIncrease, minNetBuy;
    if (data.length === 2) {
        maxIncrease = Math.max(data[0].increaseAddress, data[1].increaseAddress);
        maxNetBuy = Math.max(data[0].netBuy, data[1].netBuy);

        if (maxIncrease < maxNetBuy) {
            minIncrease = Math.min(data[0].increaseAddress, data[1].increaseAddress);
            maxIncrease = maxIncrease + (maxIncrease - minIncrease) / 2;
        } else {
            minNetBuy = Math.min(data[0].netBuy, data[1].netBuy);
            maxNetBuy = maxNetBuy + (maxNetBuy - minNetBuy) / 2;
        }
    }
    const { pageMode } = useSelector((state: AppState) => state.userInfo);
    const config = {
        data: [data, data],
        xField: 'date',
        yField: ['increaseAddress', 'netBuy'],
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
            increaseAddress: {
                label: {
                    formatter: (text: string) => {
                        return Global.formatYAxis(text, f);
                    },
                },
                max: maxIncrease,
                grid: null,
                line: {
                    style: {
                        stroke: CHART_AXIS_COLOR,
                        ...LINESTYLE_WIDTH
                    },
                },
            },
            netBuy: {
                label: {
                    formatter: (text: string) => {
                        return Global.formatYAxis(text, f);
                    },
                },
                max: maxNetBuy,
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
        },
        padding: [20, 30, 70, 30],
        tooltip: {
            title: 'time'
        },
        meta: {
            
            increaseAddress: {
                alias: f('newUser'),
                formatter: (increaseAddress: number) => {
                    return `${increaseAddress}`
                },
            },
            netBuy: {
                alias: f('newUserBuyNumber'),
                formatter: (netBuy: number) => {
                    return `${Global.formatNum(netBuy)}`
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
                    return moment(Number(time)).format('MM/DD')
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
        <DualAxes
            {...config}
            style={{ height: '355px' }}
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
    );
}
