import { useEffect, useState } from 'react'
import { Spin, Empty, DatePicker, message, Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import moment, { Moment } from 'moment'
import loadable from '@loadable/component'
import React from 'react'
const { RangePicker } = DatePicker
const Line = loadable(() => import('@ant-design/plots/lib/components/line'));
import type { RangeValue } from 'rc-picker/lib/interface'
import { useIntl } from 'react-intl'
import ApiClient from 'utils/ApiClient'
import { ANT_CHARTS_DARK, CHART_AXIS_COLOR, LINESTYLE_WIDTH } from 'utils/env'
import { useSelector } from 'react-redux'
import { AppState } from 'redux/reducers'
import { useRouter } from 'next/router'
import DefinEmpty from 'components/Header/definEmpty'
import Global from 'utils/Global'
import WaterMarkCahrtContent from 'components/WaterMarkCahrtContent'

const dateFormat = 'YYYY-MM-DD'

interface Trend {
    date: number,
    value: number,
    category: number,
    time?: string
}

const apiClient = new ApiClient<Trend[]>();

export default function BuySellLine({ symbolAddr }: { symbolAddr: string }) {
    const { formatMessage } = useIntl()
    const router = useRouter();
    const { locale } = router;
    const f = (id: string) => formatMessage({ id })
    const [data, setData] = useState<Trend[]>([])
    const [loading, setLoading] = useState(true)
    
    const [startTime, setStartTime] = useState<Moment>(moment().subtract(30, 'd'));
    const [endTime, setEndTime] = useState<Moment>(moment());

    useEffect(() => {
        asyncFetch();
    }, [symbolAddr, startTime, endTime, locale]);

    const asyncFetch = async () => {
        try {
            const result = await apiClient.post('market/netBuy/trend/v2', {
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
        <div
            className="block-item item-small"
            style={{ minHeight: '400px' }}
        >
            <div className="item-title">
                <span>
                    {f('marketDetailBuySellTitle')}
                    <Tooltip
                        placement="right"
                        title={
                            <div>
                                {f(
                                    'buySellLineTips'
                                )}
                            </div>
                        }
                    >
                        <QuestionCircleOutlined
                            style={{
                                fontSize: '16px',
                                marginLeft: '10px',
                            }}
                        />
                    </Tooltip>
                </span>
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
            {(data && data.length > 0) ? (
                <div style={{ marginTop: '23px', height: '305px' }}>
                    <TwoLine data={data} />
                    <WaterMarkCahrtContent top={285} />
                </div>) :
                (
                    <div className="table-empty">
                        <DefinEmpty spinning={loading} />
                    </div>
                )}
        </div>
    )
}

function TwoLine({ data }: { data: Trend[] }) {
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id })
    const { pageMode } = useSelector((state: AppState) => state.userInfo);
    const config = {
        data: data,
        xField: 'time',
        yField: 'value',
        seriesField: 'category',
        lineStyle: LINESTYLE_WIDTH,
        theme: pageMode === 'dark' ? ANT_CHARTS_DARK : undefined,
        meta: {
            time: {
                range: [0, 1]
            }
        },
        xAxis: {
            line: {
                style: {
                    stroke: CHART_AXIS_COLOR,
                    ...LINESTYLE_WIDTH
                },
            },
        },
        yAxis: {
            label: {
                formatter: (time: string) => {
                    return Global.formatYAxis(time, f);
                },
            },
            grid: null,
            line: {
                style: {
                    stroke: CHART_AXIS_COLOR,
                    ...LINESTYLE_WIDTH
                },
            },
        },
        padding: [40, 25, 62, 40],
        slider: {
            start: 0,
            end: 1,
        },
        tooltip: {
            title: 'time'
        },
        color: ['#62daaa', '#5b8ff9']
    }

    return (
        <Line
            {...config}
            style={{ height: '320px' }}
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