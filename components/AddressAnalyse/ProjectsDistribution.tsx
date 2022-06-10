import { useIntl } from "react-intl";
import { QuestionCircleOutlined } from '@ant-design/icons';
import { List, message, Spin, Tooltip } from 'antd';
import moment from "moment";
import loadable from "@loadable/component";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "redux/reducers";
import { ANT_CHARTS_DARK, NOT_A_NUMBER } from "utils/env";
import { useEffect, useRef, useState } from "react";
import Global from "utils/Global";
import { useRouter } from "next/router";
import ApiClient from "utils/ApiClient";
import { ProjectDistributionItem, ProjectsDistributionResponse } from "redux/types/AddressAnalyseTypes";
import { getProjectsDistributionSuccess, setGoProDialogVisible } from "redux/actions/AddressAnalyseAction";
import DefinEmpty from "components/Header/definEmpty";
import React from "react";
import { Options } from "@ant-design/plots/lib/hooks/useChart";
const Pie = loadable(() => import('@ant-design/plots/lib/components/pie'))
import WaterMarkContent from "components/WaterMarkContent";
import UpdateTimeCom from "components/UpdateTimeCom";

export interface ProjectItem {
    token: string,
    percent: number,
    index: number,
    amount: number,
}

const colors = ANT_CHARTS_DARK.colors10;

export default function ProjectsDistribution({ addrName, groupId, type }: { addrName: string | undefined, groupId: undefined | string, type: 'profit' | 'loss' }) {
    const { formatMessage } = useIntl();
    const f = (id: string) => formatMessage({ id });
    const { pageMode, level } = useSelector((state: AppState) => state.userInfo);

    const { addressBaseInfo, profitProjectsDistribution, lossProjectsDistribution } = useSelector((state: AppState) => state.addressAnalyse);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState<boolean>(false);
    useEffect(() => {
        if (addressBaseInfo.addrName !== addrName || (type === 'profit' && typeof profitProjectsDistribution.totalProfit === 'undefined')
            || (type === 'loss' && typeof lossProjectsDistribution.totalProfit === 'undefined')) {
            const apiClient = new ApiClient<any>();
            setLoading(true);
            apiClient.post(`/addr/rate/${type}`, {
                data: {
                    addrName,
                    groupId,
                    type
                }
            }).then(success => {
                dispatch(getProjectsDistributionSuccess(type, success as ProjectsDistributionResponse));
            }, e => {
                dispatch(getProjectsDistributionSuccess(type, { data: null }));
                message.error(f('sysErr'));
            }).finally(() => {
                setLoading(false);
            });
        }
    }, [addrName, groupId, type]);

    const [activeAdd, setActiveAdd] = useState('')
    const pieSelected = ({ event }: Record<string, any>) => {
        if (event.type == 'element:mouseleave') {
            setActiveAdd('')
        } else {
            setActiveAdd(event.data.data.symbolAddr)
        }
    }

    const data = type === 'loss' ? lossProjectsDistribution : profitProjectsDistribution;
    const pieData = data.list;
    const updateTime = data.updateTime;
    const total = data.totalProfit;

    const ref = React.useRef();

    const config = {
        width: 240,
        height: 240,
        appendPadding: 10,
        data: pieData || [],
        angleField: 'rate',
        colorField: 'symbolAddr',
        radius: 1,
        theme: pageMode === 'dark' ? ANT_CHARTS_DARK : undefined,
        innerRadius: 0.45,
        legend: false as const,
        tooltip: false as const,
        pieStyle: {
            stroke: null
        },
        color: colors,
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
            // { type: 'pie-statistic-active' },
        ],
        label: {
            type: 'inner',
            offset: '-50%',
            formatter: function formatter(item: Record<string, number>, mappingData: any, index: number) {
                if (item.rate < 3) {
                    return '';
                } else {
                    return `${item.rate}%`
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
                    if (pieData && pieData.length > 0) {
                        let totalAmount;
                        if (activeAdd) {
                            for (let item of pieData) {
                                if (item.symbolAddr === activeAdd) {
                                    totalAmount = item.profit;
                                    break;
                                }
                            }
                        } else {
                            totalAmount = total;
                        }

                        let totalAmountSpan;
                        if (typeof totalAmount === 'undefined') {
                            totalAmountSpan = NOT_A_NUMBER;
                        } else {
                            const number = parseInt(totalAmount);
                            if (number === 0) {
                                totalAmountSpan = <span>0</span>
                            } else if (number > 0) {
                                totalAmountSpan = <span>$&nbsp;{Global.formatBigNum(totalAmount)}</span>
                            } else {
                                totalAmountSpan = <span>-$&nbsp;{Global.formatBigNum(totalAmount).substring(1)}</span>
                            }
                        }

                        return (
                            <div className="center-box">
                                <div>{totalAmountSpan}</div>
                                <div className="total">{f('total')}</div>
                            </div>
                        ) as unknown as string
                    } else {
                        return <></> as unknown as string
                    }
                },
            },
        },
        animation: false as const,
    }

    const title = type === 'loss' ? f('lossProjectsRate') : f('gainProjectsRate');
    const tips = type === 'loss' ? f('lossProjectsRateTips') : f('gainProjectsRateTips');

    const [plot, setPlot] = useState<undefined | Options>();

    const handleMouseEnter = (data: ProjectDistributionItem) => {
        setActiveAdd(data.symbolAddr);
    }

    useEffect(() => {
        if (typeof plot !== 'undefined') {
            plot.setState('active', (item: ProjectDistributionItem) => {
                if (item.symbolAddr === activeAdd) {
                    return true;
                } else {
                    return false;
                }
            });
        }
    }, [plot, activeAdd]);

    const handleMouseLeave = (data: ProjectDistributionItem) => {
        setActiveAdd('');
    }

    return (
        <div className="projects-percent">
            <div className="header" style={{ marginRight: '40px' }}>
                <div className="title">
                    {title}
                    <Tooltip
                        placement="right"
                        title={
                            <div>
                                {tips}
                            </div>
                        }
                    >
                        <QuestionCircleOutlined
                            style={{
                                fontSize: '16px',
                                marginLeft: '10px',
                                display: 'inline-flex',
                                alignItems: 'center',
                            }}
                        />
                    </Tooltip>
                </div>
                <UpdateTimeCom updateTime={updateTime} />
            </div>

            <div className="data-box">
                {
                    data.list && data.list.length > 0 && !loading ?
                        <>
                            <div className="pie-box">
                                <Pie
                                    {...config}
                                    chartRef={ref}
                                    fallback={
                                        <div className="loading-pie">
                                            <Spin></Spin>
                                        </div>
                                    }
                                    onReady={(plot: Options) => {
                                        setPlot(plot);
                                    }}
                                />
                            </div>
                            <div className="list-box" style={{ position: 'relative' }}>
                                <WaterMarkContent right={50} bottom={25} />
                                <List
                                    header={
                                        <div className="list-header">
                                            <div className="item-column">{f('unifiedSearchProject')}</div>
                                            <div className="item-column">{f('percent')}</div>
                                            <div className="item-column">{f('yield')}</div>
                                            <div className="item-column">{f('totalMoney')}</div>
                                        </div>
                                    }
                                    dataSource={pieData}
                                    renderItem={(item, index) => <List.Item>
                                        <ListItem
                                            addrName={addrName}
                                            groupId={groupId}
                                            selected={activeAdd === item.symbolAddr}
                                            index={index}
                                            data={item}
                                            level={level}
                                            handleMouseEnter={handleMouseEnter}
                                            handleMouseLeave={handleMouseLeave}
                                        />
                                    </List.Item>}
                                />
                            </div>
                        </> :
                        <div className="table-empty" style={{ height: 200, marginTop: 50 }}>
                            <DefinEmpty spinning={loading} />
                        </div>
                }

            </div>
        </div>
    );
}

const OTHER_LIST = 'other';

function ListItem({ addrName, groupId, selected, index, data, level, handleMouseEnter, handleMouseLeave }: { addrName: string | undefined, groupId: string | undefined, selected: boolean, index: number, level: number, data: ProjectDistributionItem, handleMouseEnter: (data: ProjectDistributionItem) => void, handleMouseLeave: (data: ProjectDistributionItem) => void }) {
    const router = useRouter();
    const dispatch = useDispatch();
    const handleTokenClick = (e: any, address: string) => {
        if (data.symbolAddr === OTHER_LIST) {
            return;
        }
        
        if (level !== 1) {
            dispatch(setGoProDialogVisible(true));
            return;
        }
        const url = typeof groupId === 'undefined' ?
            `/investment-details/address-analyse/${address}/${addrName}`
            : `/investment-details/address-analyse/${address}/${addrName}/${groupId}`;
        Global.openNewTag(e, router, url)
    }
    const listClassName = selected ? "list-item list-item-selected" : "list-item";

    let profitSpan;
    if (typeof data.profit === 'undefined') {
        profitSpan = NOT_A_NUMBER;
    } else {
        const number = parseInt(data.profit);
        if (number === 0) {
            profitSpan = <span className="table-item-color">0</span>
        } else if (number > 0) {
            profitSpan = <span className="defi-color-Increase">$&nbsp;{Global.formatBigNum(data.profit, 0)}</span>
        } else {
            profitSpan = <span className="defi-color-reduce">-$&nbsp;{Global.formatBigNum(data.profit, 0).substring(1)}</span>
        }
    }

    const onHandleMouseEnter = () => {
        handleMouseEnter(data);
    }

    const onHandleMouseLeave = () => {
        handleMouseLeave(data);
    }

    return (
        <div className={listClassName} onClick={e => handleTokenClick(e, data.symbolAddr)} onMouseEnter={onHandleMouseEnter} onMouseLeave={onHandleMouseLeave}>
            <div className="item-column" style={{
                whiteSpace: "nowrap",
                overflow: 'hidden',
                textOverflow: 'ellipsis'
            }}>
                <div style={{
                    whiteSpace: "nowrap",
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}>
                    <span className="circle" style={{ backgroundColor: colors[index] }} />
                    <span className="project-name">{data.symbol}</span>
                </div>
            </div>

            <div className="item-column">
                {`${data.rate}%`}
            </div>

            <div className="item-column">
                {data.profitRate === '--' ? data.profitRate : Global.formatIncreaseNumber(data.profitRate)}
            </div>

            <div className="item-column">
                {profitSpan}
            </div>
        </div>
    );
}