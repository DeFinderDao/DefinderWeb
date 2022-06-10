import { message, Radio, Spin, Empty } from "antd";
import { RadioChangeEvent } from "antd/lib/radio";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import moment, { Moment } from 'moment'
import ApiClient from "utils/ApiClient";
import loadable from '@loadable/component';
const Line = loadable(() => import('@ant-design/plots/lib/components/line'));
import { ANT_CHARTS_DARK, CHART_AXIS_COLOR, DefaultLocale, LINESTYLE_WIDTH, NOT_A_NUMBER } from 'utils/env';
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "redux/reducers";
import DefinEmpty from "components/Header/definEmpty";
import Global from "utils/Global";
import { Datum } from '@antv/g2plot/lib/types/common'
import WaterMarkCahrtContent from "components/WaterMarkCahrtContent";
import { useRouter } from "next/router";
import UpdateTimeCom from "components/UpdateTimeCom";
const dateFormat = 'YYYY-MM-DD'

interface Trend {
    date: number,
    profit: number,
    time?: string
}

const apiClient = new ApiClient<Trend[]>();

export default function EarningsTrend({ addrName, groupId }: { addrName: string | undefined, groupId: undefined | string }) {
    const { formatMessage } = useIntl();
    const f = (id: string) => formatMessage({ id });
    const router = useRouter();
    const { locale = DefaultLocale } = router;
    const options = [
        { label: f('investmentRadio30'), value: 1 },
        { label: f('investmentRadio180'), value: 2 },
        { label: f('investmentRadio1'), value: 3 },
        { label: f('investmentRadioMax'), value: 0 },
    ];
    const onChange = (e: RadioChangeEvent) => {
        setType(e.target.value);
    }

    const [data, setData] = useState<Trend[]>([]);
    const [undateTime, setUndateTime] = useState<number | null>();
    const [type, setType] = useState<number>(0);
    const [isLoading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (addrName) {
            asyncFetch();
        }
    }, [addrName, groupId, type]);

    const asyncFetch = async () => {
        try {
            setLoading(true);
            const result = await apiClient.post('/addr/trend/profit', {
                data: {
                    addrName,
                    groupId,
                    type
                }
            });
            result.data.forEach((item: Trend) => {
                item.time = moment(item.date).format('YYYY/MM/DD')
            })
            setData(result.data);
            setUndateTime(result.updateTime)
            setLoading(false);
        } catch (e) {
            setData([]);
            setUndateTime(null)
            setLoading(false);
            message.error((e as Error).message);
        }
    }

    return (
        <div className="white-block earnings-trend" style={{ borderBottom: 'none' }}>
            <div className="header">
                <div className="title">{f('accountEarningTrend')}</div>
                <UpdateTimeCom updateTime={undateTime} />
            </div>
            <div className="header" style={{ marginTop: 0 }}>
                <span className="title">
                </span>
                <div>
                    <Radio.Group
                        options={options}
                        onChange={onChange}
                        value={type}
                        optionType="button"
                        buttonStyle="solid"
                    />
                </div>
            </div>
            {data && data.length > 0 && !isLoading ? (
                <div style={{ margin: '10px' }}>
                    <MemoTrend data={data} />
                    <WaterMarkCahrtContent />
                </div>
            ) : (
                <div className="table-empty" style={{ height: 200 }}>
                    <DefinEmpty spinning={isLoading} />
                </div>
            )}
        </div>
    );
}

const MemoTrend = React.memo(Trend);

function Trend({ data }: { data: Trend[] }) {
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id })
    const { pageMode } = useSelector((state: AppState) => state.userInfo);
    const config = {
        data: data,
        xField: 'time',
        yField: 'profit',
        theme: pageMode === 'dark' ? ANT_CHARTS_DARK : undefined,
        lineStyle: LINESTYLE_WIDTH,
        yAxis: {
            label: {
                formatter: (profit: string) => {
                    return Global.formatYAxis(profit, f);
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
        xAxis: {
            line: {
                style: {
                    stroke: CHART_AXIS_COLOR,
                    ...LINESTYLE_WIDTH
                },
            },
        },
        tooltip: {
            title: f('investmentPositionIncomeChartTitle'),
            formatter: (itemData: Datum) => {
                const profitText = Global.formatBigNum(Math.abs(itemData.profit));
                let profit = '';
                if (profitText === NOT_A_NUMBER) {
                    profit = NOT_A_NUMBER;
                } else if (itemData.profit > 0) {
                    profit = `+&nbsp;$&nbsp;${profitText}`
                } else if (itemData.profit < 0) {
                    profit = `-&nbsp;$&nbsp;${profitText}`
                } else {
                    profit = `$${Global.formatBigNum(itemData.profit)}`
                }

                return {
                    name: itemData.time,
                    value: profit,
                }
            },
        },
        meta: {
            time: {
                range: [0, 1]
            },
        },
        padding: 'auto' as const,
        appendPadding: 8,
        slider: {
            start: 0,
            end: 1,
        },
    }

    return (
        <Line
            {...config}
            style={{ height: '300px' }}
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