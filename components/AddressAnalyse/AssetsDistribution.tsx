import { useIntl } from "react-intl";
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, List, message, Modal, Spin, Table, TablePaginationConfig, Tooltip } from 'antd';
import moment from "moment";
import loadable from "@loadable/component";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "redux/reducers";
import { ANT_CHARTS_DARK, NOT_A_NUMBER } from "utils/env";
import { Key, MouseEvent, useEffect, useRef, useState } from "react";
import Global from "utils/Global";
import { useRouter } from "next/router";
import ApiClient from "utils/ApiClient";
import { AddressAssetItem, CurrentHoldRateItem, CurrentHoldRateResponse, LpDetailItem } from "redux/types/AddressAnalyseTypes";
import { changeAddressAssetsFilter, getCurrentHoldRateSuccess, requestAddressAssetsList, requestCurrentHoldDetailList, requestLpDetailList, setGoProDialogVisible, setLpDetailsListPageNo } from "redux/actions/AddressAnalyseAction";
import { TokenLogo } from "components/TokenLogo";
import { SorterResult, TableCurrentDataSource } from "antd/lib/table/interface";
import DefinEmpty from "components/Header/definEmpty";
import type { Datum } from '@antv/g2plot/lib/types/common';
const Pie = loadable(() => import('@ant-design/plots/lib/components/pie'))
import { Options } from "@ant-design/plots/lib/hooks/useChart";
import WaterMarkContent from "components/WaterMarkContent";
import UpdateTimeCom from "components/UpdateTimeCom";

const colors = ANT_CHARTS_DARK.colors10;

export default function AssetsDistribution({ addrName, groupId }: { addrName: string | undefined, groupId: string | undefined }) {
    const { formatMessage } = useIntl();
    const f = (id: string) => formatMessage({ id });
    const { pageMode, level } = useSelector((state: AppState) => state.userInfo);

    const { addressBaseInfo, currentHoldRate } = useSelector((state: AppState) => state.addressAnalyse);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState<boolean>(false);
    useEffect(() => {
        if (addressBaseInfo.addrName !== addrName) {
            const apiClient = new ApiClient<any>();
            setLoading(true);
            apiClient.post(`/addr/current/hold/rate`, {
                data: {
                    addrName,
                    groupId
                }
            }).then(success => {
                let totalPercent = 0;
                if ((success as CurrentHoldRateResponse).data === null) {
                    dispatch(getCurrentHoldRateSuccess(success as CurrentHoldRateResponse));
                } else {
                    (success as CurrentHoldRateResponse).data.list.forEach(item => {
                        totalPercent += (item.profitRate === null ? 0 : Math.abs(parseFloat(item.profitRate)));
                    });
                    (success as CurrentHoldRateResponse).data.list.forEach(item => {
                        item.percent = (item.profitRate === null ? 0 : Math.abs(parseFloat(item.profitRate)) / totalPercent);
                    });
                    dispatch(getCurrentHoldRateSuccess(success as CurrentHoldRateResponse));
                }
            }, e => {
                message.error(f('sysErr'));
                dispatch(getCurrentHoldRateSuccess(null));
            }).finally(() => {
                setLoading(false);
            });
        }
    }, [addrName, groupId, addressBaseInfo]);

    const [activeAdd, setActiveAdd] = useState('')
    const pieSelected = ({ event }: Record<string, any>) => {
        if (event.type == 'element:mouseleave') {
            setActiveAdd('')
        } else {
            setActiveAdd(event.data.data.symbolAddr)
        }
    }

    const pieData = currentHoldRate && currentHoldRate.data && currentHoldRate.data.list ? currentHoldRate.data.list : [];
    const config = {
        width: 372,
        height: 372,
        appendPadding: 10,
        data: pieData,
        angleField: 'rate',
        colorField: 'symbolAddr',
        radius: 1,
        theme: pageMode === 'dark' ? ANT_CHARTS_DARK : undefined,
        innerRadius: 0.45,
        legend: false as const,
        tooltip: {
            fields: ['symbol', 'rate'],
            formatter: (datum: Datum) => {
                return { name: datum.symbol, value: datum.rate.toFixed(2) + '%' };
            },
        },
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
                if (item.rate < 2) {
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
                        let total;
                        if (activeAdd) {
                            for (let item of pieData) {
                                if (item.symbolAddr === activeAdd) {
                                    total = `$${Global.formatBigNum(item.holdValue)}`
                                    break;
                                }
                            }
                        } else {
                            total = `$${currentHoldRate ? Global.formatBigNum(currentHoldRate.data.totalHoldAsset) : ''}`;
                        }
                        return (
                            <div className="center-box">
                                <div>{total}</div>
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

    const [plot, setPlot] = useState<undefined | Options>();

    const handleMouseEnter = (data: CurrentHoldRateItem) => {
        setActiveAdd(data.symbolAddr);
    }

    useEffect(() => {
        if (typeof plot !== 'undefined') {
            plot.setState('active', (item: CurrentHoldRateItem) => {
                if (item.symbolAddr === activeAdd) {
                    return true;
                } else {
                    return false;
                }
            });
        }
    }, [plot, activeAdd]);

    const handleMouseLeave = (data: CurrentHoldRateItem) => {
        setActiveAdd('');
    }

    const [visible, setVisible] = useState<boolean>(false);

    const handleFooterClick = () => {
        setVisible(true);
    }

    return (
        <div className="assets-distribution">
            <div className="header" style={{ marginRight: '40px' }}>
                <div className="title">
                    {f('currentHoldAssetDistribution')}
                    <Tooltip
                        placement="right"
                        title={
                            <div>
                                {f('currentHoldAssetDistributionTips')}
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
                <UpdateTimeCom updateTime={currentHoldRate?.updateTime} />
            </div>

            {
                (currentHoldRate === null || currentHoldRate.data === null || loading) ?
                    <div className="table-empty empty">
                        <DefinEmpty spinning={loading} />
                    </div> :
                    <div className="data-box">
                        <div className="pie-box">
                            <Pie
                                {...config}
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
                            <List
                                header={
                                    <div className="list-header">
                                        <div className="item-column">{f('unifiedSearchProject')}</div>
                                        <div className="item-column">{f('currentValue')}</div>
                                        <div className="item-column">{f('percent')}</div>
                                        <div className="item-column">{f('totalInput')}</div>
                                        <div className="item-column" style={{ flex: 2 }}>{f('currentHoldingProfitRate')}</div>
                                        <div style={{ width: 50, marginLeft: 10 }}></div>
                                    </div>
                                }
                                footer={
                                    currentHoldRate && currentHoldRate.data ?
                                        (<div className="list-footer" onClick={handleFooterClick}>
                                            {f('moreDetail')}
                                        </div>) : null
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
                            <WaterMarkContent />
                        </div>
                    </div>
            }

            <MoreDetailsModal addrName={addrName} groupId={groupId} visible={visible} setVisible={setVisible} />
        </div>
    );
}

function ListItem({ addrName, groupId, selected, index, data, level, handleMouseEnter, handleMouseLeave }: { addrName: string | undefined, groupId: string | undefined, selected: boolean, index: number, data: CurrentHoldRateItem, level: number, handleMouseEnter: (data: CurrentHoldRateItem) => void, handleMouseLeave: (data: CurrentHoldRateItem) => void }) {
    const { formatMessage } = useIntl();
    const f = (id: string) => formatMessage({ id });
    const router = useRouter();
    const dispatch = useDispatch();

    const listClassName = selected ? "list-item list-item-selected" : "list-item";

    const onHandleMouseEnter = () => {
        handleMouseEnter(data);
    }

    const onHandleMouseLeave = () => {
        handleMouseLeave(data);
    }

    let profitValue;
    const number = Number(data.profit);
    if (number === 0) {
        profitValue = <span className="table-item-color">0</span>
    } else if (number > 0) {
        profitValue = <span className="defi-color-Increase">$&nbsp;{Global.formatBigNum(data.profit, 0)}</span>
    } else {
        profitValue = <span className="defi-color-reduce">-$&nbsp;{Global.formatBigNum(data.profit.substring(1), 0)}</span>
    }

    const profitRateFloat = data.profitRate !== null ? parseFloat(data.profitRate) : 0;
    return (
        <div className={listClassName} onMouseEnter={onHandleMouseEnter} onMouseLeave={onHandleMouseLeave}>
            <div className="item-column"
                onClick={event => {
                    Global.openNewTag(event, router, `/market-detail/market-page/${data.symbolAddr}`)
                }} style={{ cursor: 'pointer' }}>
                <div>
                    <span className="circle" style={{ backgroundColor: colors[index] }} />
                    <span className="project-name">{data.symbol}</span>
                </div>
            </div>

            <div className="item-column">
                ${Global.formatBigNum(data.holdValue, 0)}
            </div>

            <div className="item-column">
                {data.rate}%
            </div>

            <div className="item-column">
                {profitValue}
            </div>

            <div className="item-column percent">
                {
                    data.profitRate !== null ?
                        <>
                            <div style={{
                                color: profitRateFloat > 0 ? '#44BE90' : (profitRateFloat === 0 ? '#ffffff' : '#EF5F81'),
                                fontSize: 10,
                                marginRight: profitRateFloat !== 0 ? 8 : 0
                            }}>
                                {profitRateFloat > 0 ? "+" : ''}{data.profitRate}%
                            </div>
                            <div style={{
                                background: profitRateFloat > 0 ? '#44BE90' : '#EF5F81',
                                width: `${data.percent * 100}%`,
                                height: 8
                            }}
                            />
                        </> : ''
                }
            </div>
            <div className="details" onClick={(event) => {
                if (level !== 1) {
                    dispatch(setGoProDialogVisible(true));
                    return;
                }
                const url = typeof groupId === 'undefined' ?
                    `/investment-details/address-analyse/${data.symbolAddr}/${addrName}`
                    : `/investment-details/address-analyse/${data.symbolAddr}/${addrName}/${groupId}`;
                Global.openNewTag(event, router, url)
            }}>
                <img src="/images/detail-icon.svg" className="img-details" />
            </div>
        </div>
    );
}

const PAGE_SIZE = 10;

function MoreDetailsModal({ addrName, groupId, visible, setVisible }: { addrName: string | undefined, groupId: string | undefined, visible: boolean, setVisible: (visible: boolean) => void }) {
    const { formatMessage } = useIntl();
    const f = (id: string) => formatMessage({ id });
    const dispatch = useDispatch();
    const { addressAssetsFilter, addressAssetsListLoading, addressAssetsList, addressAssetsTotal, addressBaseInfo } = useSelector((state: AppState) => state.addressAnalyse);
    const router = useRouter();
    const { level } = useSelector((state: AppState) => state.userInfo);


    const columns = [{
        title: f('token'),
        dataIndex: 'token',
        width: '8.6%',
        align: 'left' as const,
        render: (text: string, record: AddressAssetItem) => {
            return (
                <span className="token table-item-color" style={{ cursor: 'pointer' }}
                    onClick={event => Global.openNewTag(event, router, `/market-detail/market-page/${record.symbolAddr}`)}>
                    <TokenLogo src={record.symbolLogo} style={{ width: 16, height: 16, marginRight: 10 }} />
                    {record.symbol}
                </span>)
        }
    }, {
        title: f('currentPrice'),
        dataIndex: 'price',
        width: '8.6%',
        align: 'center' as const,
        render: (text: string) => {
            return <span className="table-item-color">$&nbsp;{Global.formatBigNum(text)}</span>
        }
    }, {
        title: f('holdNum'),
        dataIndex: 'holdAmount',
        width: '8.6%',
        align: 'center' as const,
        render: (text: string) => {
            return <span className="table-item-color">{Global.formatBigNum(text)}</span>
        }
    }, {
        title: f('currentValue'),
        dataIndex: 'amountValue',
        width: '8.6%',
        align: 'center' as const,
        render: (text: string) => {
            return <span className="table-item-color">$&nbsp;{Global.formatBigNum(text, 0)}</span>
        }
    }, {
        title: f('currentCost'),
        dataIndex: 'costPrice',
        width: '8.6%',
        align: 'center' as const,
        render: (text: string) => {
            const price = Global.formatBigNum(text);
            const priceText = price === NOT_A_NUMBER ? NOT_A_NUMBER : <>$&nbsp;{price}</>;
            return <span className="table-item-color">{priceText}</span>
        }
    }, {
        title: f('totalInput'),
        dataIndex: 'totalProfit',
        width: '8.6%',
        align: 'center' as const,
        sorter: true,
        sortDirections: ['descend' as const, 'ascend' as const],
        render: (text: string) => {
            const number = Number(text);
            if (number === 0) {
                return <span className="table-item-color">0</span>
            } else if (number > 0) {
                return <span className="defi-color-Increase">$&nbsp;{Global.formatBigNum(text, 0)}</span>
            } else {
                return <span className="defi-color-reduce">-$&nbsp;{Global.formatBigNum(text.substring(1), 0)}</span>
            }
        }
    }, {
        title: f('yield'),
        dataIndex: 'profitRate',
        width: '8.6%',
        align: 'center' as const,
        sorter: true,
        sortDirections: ['descend' as const, 'ascend' as const],
        render: (text: string) => {
            return Global.formatIncreaseNumber(text)
        }
    }, {
        title: f('buyNum'),
        dataIndex: 'inAmount',
        width: '8.6%',
        align: 'center' as const,
        render: (text: string) => {
            return <span className="table-item-color">{Global.formatBigNum(text)}</span>
        }
    }, {
        title: f('buyAve'),
        dataIndex: 'inAvgPrice',
        width: '8.6%',
        align: 'center' as const,
        render: (text: string) => {
            const price = Global.formatBigNum(text);
            const priceText = price === NOT_A_NUMBER ? NOT_A_NUMBER : <>$&nbsp;{price}</>;
            return <span className="table-item-color">{priceText}</span>
        }
    }, {
        title: f('sellNum'),
        dataIndex: 'outAmount',
        width: '8.6%',
        align: 'center' as const,
        render: (text: string) => {
            return <span className="table-item-color">{Global.formatBigNum(text)}</span>
        }
    }, {
        title: f('sellAve'),
        dataIndex: 'outAvgPrice',
        width: '8.6%',
        align: 'center' as const,
        render: (text: string) => {
            const price = Global.formatBigNum(text);
            const priceText = price === NOT_A_NUMBER ? NOT_A_NUMBER : <>$&nbsp;{price}</>;
            return <span className="table-item-color">{priceText}</span>
        }
    }, {
        title: '',
        dataIndex: '',
        width: '5.4%',
        align: 'right' as const,
        render: (text: string, record: AddressAssetItem) => {
            return <img src="/images/detail-icon.svg" className="img-details"
                onClick={event => {
                    if (level !== 1) {
                        dispatch(setGoProDialogVisible(true));
                        return;
                    }

                    const url = typeof groupId === 'undefined' ?
                        `/investment-details/address-analyse/${record.symbolAddr}/${addrName}`
                        : `/investment-details/address-analyse/${record.symbolAddr}/${addrName}/${groupId}`;
                    Global.openNewTag(event, router, url)
                }} />
        }
    }];

    useEffect(() => {
        if (addrName && addrName !== addressBaseInfo.addrName) {
            const body = {
                addrName,
                groupId,
                pageNo: 1,
                pageSize: PAGE_SIZE,
            }
            dispatch(changeAddressAssetsFilter(body));
            dispatch(requestCurrentHoldDetailList(body));
        }
    }, [addrName, groupId, addressBaseInfo.addrName]);

    const handleTableChange = (pagination: TablePaginationConfig, filters: Record<string, (Key | boolean)[] | null>, sorter: SorterResult<AddressAssetItem> | SorterResult<AddressAssetItem>[], extra: TableCurrentDataSource<any>) => {
        if (addrName && pagination.current) {
            let field = Array.isArray(sorter) ? sorter[0].field : sorter.field;
            let order = Array.isArray(sorter) ? sorter[0].order : sorter.order;
            const sortField = order ? field as string : undefined;
            const sortType = order ? (order === 'ascend' ? 1 : 2) : undefined;
            dispatch(changeAddressAssetsFilter({
                pageNo: addressAssetsFilter.pageNo == pagination.current ? 1 : pagination.current,
                sortField: sortField,
                sortType: sortType
            }));
            dispatch(requestCurrentHoldDetailList({
                addrName,
                groupId,
                pageSize: PAGE_SIZE,
                pageNo: addressAssetsFilter.pageNo == pagination.current ? 1 : pagination.current,
                sortField: sortField,
                sortType: sortType
            }));
        }
    }

    return (
        <Modal
            visible={visible}
            onOk={() => setVisible(false)}
            width={1200}
            centered
            closable={true}
            onCancel={() => {
                setVisible(false);
            }}
            bodyStyle={{ paddingBottom: '0px' }}
            footer={[
                <Button key="assets-distribution-modal-close" type="primary" onClick={() => setVisible(false)} style={{ margin: '10px' }}>
                    {f('close')}
                </Button>
            ]}
        >
            <div className="modal-filter">
                <p className="modal-title" style={{ marginLeft: '0px', marginBottom: '30px' }}>{f('currentHoldAssetDistributionDetail')}</p>
                <div className="common-table" style={{ margin: 0 }}>
                    <WaterMarkContent />
                    <Table
                        columns={columns}
                        rowKey="symbolAddr"
                        dataSource={addressAssetsList}
                        loading={addressAssetsListLoading}
                        pagination={{
                            showQuickJumper: true,
                            showSizeChanger: false,
                            current: addressAssetsFilter.pageNo,
                            pageSize: PAGE_SIZE,
                            total: addressAssetsTotal,
                            position: ['bottomCenter'],
                        }}
                        onChange={handleTableChange}
                        style={{ marginTop: '20px' }}
                    />
                </div>
            </div>
        </Modal>
    );
}