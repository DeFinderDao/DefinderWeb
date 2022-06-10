import loadable from "@loadable/component";
import { List, message, Spin } from "antd";
const Pie = loadable(() => import('@ant-design/plots/lib/components/pie'))
import { Options } from "@ant-design/plots/lib/hooks/useChart";
import { useEffect, useState } from "react";
import { ANT_CHARTS_DARK } from "utils/env";
import { AppState } from "redux/reducers";
import { useDispatch, useSelector } from "react-redux";
import { requestSmTypeSuccess } from "redux/actions/SmartMoneyAction";
import { SMCateroryItem } from "redux/types/SmartMoneyTypes";
import { useIntl } from "react-intl";
import DefinEmpty from "components/Header/definEmpty";
import ApiClient from "utils/ApiClient";
import { CODE_SUCCESS } from "utils/ApiServerError";
import Global from "utils/Global";
import { useRouter } from "next/router";
import usePrevious from "components/UsePreviousHook";
import WaterMarkContent from "components/WaterMarkContent";

const colors = ANT_CHARTS_DARK.colors10;

interface Category {
    list: SMCateroryItem[],
    total: number
}

export default function SmartMoneyHeader() {
    const { formatMessage } = useIntl();
    const f = (id: string) => formatMessage({ id });
    const { pageMode } = useSelector((state: AppState) => state.userInfo);
    const { smCategories, smCategoriesTotal } = useSelector((state: AppState) => state.smartMoneyReducer);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    function requestData() {
        setLoading(true);
        const apiClient = new ApiClient<Category>();
        apiClient.get('/smart/money/category').then(result => {
            if (result.code === CODE_SUCCESS) {
                dispatch(requestSmTypeSuccess(result.data.list, result.data.total));
            } else {
                setLoading(false)
                message.error(result.message)
            }
        }, fail => {
            message.error(fail.message);
        }).finally(() => {
            setLoading(false);
        });
    }

    const router = useRouter();
    const { locale } = router;
    const prevLocale = usePrevious(locale);
    useEffect(() => {
        if (smCategories.length === 0 || prevLocale !== locale) {
            requestData();
        }
    }, [locale]);

    const config = {
        width: 200,
        height: 200,
        appendPadding: 10,
        data: smCategories,
        angleField: 'rate',
        colorField: 'type',
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
        ],
        label: {
            type: 'inner',
            offset: '-50%',
            formatter: function formatter(item: Record<string, number>, mappingData: any, index: number) {
                const rate = item.rate * 100;
                if (rate < 2) {
                    return '';
                } else {
                    const percent = rate.toFixed(2);
                    return `${percent}%`
                }
            },
            style: {
                textAlign: 'center',
                fontSize: 12,
                fill: '#ffffff'
            },
        },
        statistic: {
            title: false as const,
            content: {
                customHtml: function formatter() {
                    if (smCategories && smCategories.length > 0) {
                        let total;
                        if (activeAdd) {
                            for (let item of smCategories) {
                                if (item.type === activeAdd) {
                                    total = item.count;
                                    break;
                                }
                            }
                        } else {
                            total = smCategoriesTotal;
                        }
                        return (
                            <div className="center-box">
                                <div>{total}</div>
                                <div className="total">Total</div>
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

    const [plot, setPlot] = useState<undefined | Options>();
    const [activeAdd, setActiveAdd] = useState('')
    const pieSelected = ({ event }: Record<string, any>) => {
        if (event.type == 'element:mouseleave') {
            setActiveAdd('')
        } else {
            setActiveAdd(event.data.data.type)
        }
    }
    useEffect(() => {
        if (typeof plot !== 'undefined') {
            plot.setState('active', (item: SMCateroryItem) => {
                if (item.type === activeAdd) {
                    return true;
                } else {
                    return false;
                }
            });
        }
    }, [plot, activeAdd]);

    const handleMouseEnter = (data: SMCateroryItem) => {
        setActiveAdd(data.type);
    }

    const handleMouseLeave = (data: SMCateroryItem) => {
        setActiveAdd('');
    }

    return (
        <div className="header">
            <p className="title">Smart Money</p>
            <p className="desc">{f('smartDesc1')}</p>
            <p className="desc">{f('smartDesc2')}</p>
            <div className="header-data">
                <div className="list-container" style={{ position: 'relative' }}>
                    <List
                        loading={loading}
                        header={
                            <div className="list-header">
                                <div className="item flex-2">{f('type')}</div>
                                <div className="item">{f('num')}</div>
                                <div className="item">{f('percent')}</div>
                                <div className="item flex-5">{f('categoryMark')}</div>
                            </div>
                        }
                        renderItem={
                            (item: SMCateroryItem, index: number) => {
                                return (
                                    <List.Item>
                                        <Item
                                            data={item}
                                            index={index}
                                            selected={activeAdd === item.type}
                                            handleMouseEnter={handleMouseEnter}
                                            handleMouseLeave={handleMouseLeave}
                                        />
                                    </List.Item>)
                            }
                        }
                        dataSource={smCategories}
                    >
                    </List>
                    <WaterMarkContent bottom={10} />
                </div>

                <div className="pie-container">
                    {!loading ?
                        (<Pie
                            {...config}
                            fallback={
                                <div className="loading-pie">
                                    <Spin></Spin>
                                </div>
                            }
                            onReady={(plot: Options) => {
                                setPlot(plot);
                            }}
                        />) :
                        (<div className="table-empty" style={{ height: 200, marginTop: 50 }}>
                            <DefinEmpty spinning={loading} />
                        </div>)}

                </div>
            </div>
        </div>);
}

function Item({ data, index, selected, handleMouseEnter, handleMouseLeave }: { data: SMCateroryItem, index: number, selected: boolean, handleMouseEnter: (data: SMCateroryItem) => void, handleMouseLeave: (data: SMCateroryItem) => void }) {

    const listClassName = selected ? "item-data item-data-selected" : "item-data";

    const onHandleMouseEnter = () => {
        handleMouseEnter(data);
    }

    const onHandleMouseLeave = () => {
        handleMouseLeave(data);
    }

    return (
        <div className={listClassName} onMouseEnter={onHandleMouseEnter} onMouseLeave={onHandleMouseLeave}>
            <div className="item flex-2">
                <span className="circle" style={{ backgroundColor: colors[index] }} />
                {data.category}
            </div>
            <div className="item">{Global.formatNum(data.count)}</div>
            <div className="item">{`${(data.rate * 100).toFixed(1)}%`}</div>
            <div className="item flex-5">{data.mark}</div>
        </div>
    );
}