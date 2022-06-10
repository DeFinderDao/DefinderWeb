import { useIntl } from "react-intl";
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, List, message, Modal, Spin, Table, TablePaginationConfig, Tooltip } from 'antd';
import moment from "moment";
import loadable from "@loadable/component";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "redux/reducers";
import { ANT_CHARTS_DARK, DefaultLocale, NOT_A_NUMBER } from "utils/env";
import { Key, useEffect, useRef, useState } from "react";
import Global from "utils/Global";
import router, { useRouter } from "next/router";
import ApiClient from "utils/ApiClient";
import { AddressNFTAssetItem, CurrentHoldRateItem, CurrentHoldRateResponse } from "redux/types/AddressAnalyseTypes";
import { changeNftAddressAssetsFilter, getCurrentNftHoldRateSuccess, requestCurrentNFTHoldDetailList, setGoProDialogVisible } from "redux/actions/AddressAnalyseAction";
import { TokenLogo } from "components/TokenLogo";
import { SorterResult, TableCurrentDataSource } from "antd/lib/table/interface";
import DefinEmpty from "components/Header/definEmpty";
import type { Datum } from '@antv/g2plot/lib/types/common'
const Pie = loadable(() => import('@ant-design/plots/lib/components/pie'))
import { Options } from "@ant-design/plots/lib/hooks/useChart";
import WaterMarkContent from "components/WaterMarkContent";
import GlobalLabel from "components/GlobalLabel";
import UpdateTimeCom from "components/UpdateTimeCom";

const colors = ["#5B8FF9", "#61DDAA", "#65789B", "#F6BD16", "#7262fd", "#78D3F8", "#9661BC", "#F6903D", "#008685", "#F08BB4", "#EF5F81"];

const OTHER_SYMBOLS = 'others';

export default function NFTAssetsDistribution({ addrName, groupId }: { addrName: string | undefined, groupId: string | undefined }) {
    const { formatMessage } = useIntl();
    const f = (id: string) => formatMessage({ id });
    const { pageMode, level } = useSelector((state: AppState) => state.userInfo);
    const router = useRouter();
    const { locale = DefaultLocale } = router;
    const { addressBaseInfo, currentNFTHoldRate } = useSelector((state: AppState) => state.addressAnalyse);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState<boolean>(false);
    useEffect(() => {
        if (addressBaseInfo.addrName !== addrName) {
            const apiClient = new ApiClient<any>();
            setLoading(true);
            apiClient.post(`/addr/nft/current/hold/rate`, {
                data: {
                    addrName,
                    groupId
                }
            }).then(success => {
                let totalPercent = 0;
                if ((success as CurrentHoldRateResponse).data === null) {
                    dispatch(getCurrentNftHoldRateSuccess(success as CurrentHoldRateResponse));
                } else {
                    (success as CurrentHoldRateResponse).data.list.forEach((item) => {
                        if (item.symbol === OTHER_SYMBOLS) {
                            item.symbolAddr = OTHER_SYMBOLS;
                        }
                    });
                    (success as CurrentHoldRateResponse).data.list.forEach(item => {
                        totalPercent += (item.profitRate === null ? 0 : Math.abs(parseFloat(item.profitRate)));
                    });
                    (success as CurrentHoldRateResponse).data.list.forEach(item => {
                        item.percent = (item.profitRate === null ? 0 : Math.abs(parseFloat(item.profitRate)) / totalPercent);
                    });
                    dispatch(getCurrentNftHoldRateSuccess(success as CurrentHoldRateResponse));
                }
            }, e => {
                message.error(f('sysErr'));
                dispatch(getCurrentNftHoldRateSuccess(null));
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

    const pieData = currentNFTHoldRate && currentNFTHoldRate.data && currentNFTHoldRate.data.list ? currentNFTHoldRate.data.list : [];
    const listData = [...pieData];
    if (pieData.length > 0) {
        const other = pieData.find((item: CurrentHoldRateItem) => {
            return item.symbol === OTHER_SYMBOLS
        });
        if (typeof other !== 'undefined') {
            const otherIndex = pieData.indexOf(other);
            listData.splice(otherIndex, 1);
        }
    }

    const { isOpen } = useSelector((state: AppState) => state.menuList);
    //
    const pieWidth = isOpen ? (locale === 'en' ? 270 : 372) : 372;
    const pieHeight = isOpen ? (locale === 'en' ? 270 : 372) : 372;
    const config = {
        width: pieWidth,
        height: pieHeight,
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
                return { name: datum.symbol ? datum.symbol : '', value: datum.rate + '%' };
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
                                    total = `${Global.formatBigNum(item.holdValue)}ETH`
                                    break;
                                }
                            }
                        } else {
                            total = `${currentNFTHoldRate ? Global.formatBigNum(currentNFTHoldRate.data.totalHoldAsset) : ''}ETH`;
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
                    {f('currentNFTHoldAssetDistribution')}
                    <Tooltip
                        placement="right"
                        title={
                            <div>
                                {f('currentNFTHoldAssetDistributionTips')}
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
                <UpdateTimeCom updateTime={currentNFTHoldRate?.updateTime} />
            </div>

            {
                (currentNFTHoldRate === null || currentNFTHoldRate.data === null || loading) ?
                    <div className="table-empty empty">
                        <DefinEmpty spinning={loading} />
                    </div> :
                    <div className="data-box">
                        <div className="pie-box" style={{ width: pieWidth, height: pieHeight }}>
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
                            <WaterMarkContent right={40} />
                            <List
                                header={
                                    <div className="list-header">
                                        <div className="nft-item-column" style={{ textAlign: 'left', flex: 1.5 }}>{f('unifiedSearchProject')}</div>
                                        <div className="nft-item-column">{f('currentValue')}</div>
                                        <div className="nft-item-column">{f('holdNums')}</div>
                                        <div className="nft-item-column">{f('percent')}</div>
                                        <div className="nft-item-column" style={{ flex: locale === 'zh' ? 1.3 : 1.5 }}>
                                            {f('nftEarnAmount')}
                                            <Tooltip
                                                placement="top"
                                                title={
                                                    <>
                                                        <div>{f('nftEarnAmountTips')}</div>
                                                    </>}
                                            >
                                                <QuestionCircleOutlined
                                                    style={{
                                                        color: '#BEC4CC',
                                                        fontSize: '14px',
                                                        marginLeft: '5px',
                                                    }}
                                                />
                                            </Tooltip>
                                        </div>
                                        <div className="nft-item-column percent" style={{ textAlign: 'left' }}><div style={{ marginLeft: 10 }}>{f('currentHoldingProfitRate')}</div></div>
                                        <div className="details"></div>
                                    </div>
                                }
                                footer={
                                    currentNFTHoldRate && currentNFTHoldRate.data ?
                                        (<div className="list-footer" onClick={handleFooterClick}>
                                            {f('moreDetail')}
                                        </div>) : null
                                }
                                dataSource={listData}
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
    const { locale = DefaultLocale } = router;
    const dispatch = useDispatch();

    const handleTokenInvestmentClick = (event: any) => {
        if (level !== 1) {
            dispatch(setGoProDialogVisible(true));
            return;
        }
        const url = typeof groupId === 'undefined' ?
            `/nft-detail/address-analyse/${data.symbolAddr}/${addrName}`
            : `/nft-detail/address-analyse/${data.symbolAddr}/${addrName}/${groupId}`;
        Global.openNewTag(event, router, url)
    }

    const handleNftAnalyseClick = (e: any) => {
        Global.openNewTag(e, router, `/nft-analyse-detail/nft-analyse/${data.symbolAddr}`);
    }

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
        profitValue = <span className="defi-color-Increase">{data.profit}&nbsp;ETH</span>
    } else {
        profitValue = <span className="defi-color-reduce">-{data.profit.substring(1)}&nbsp;ETH</span>
    }

    const profitRateFloat = data.profitRate !== null ? parseFloat(data.profitRate) : 0;
    return (
        <div className={listClassName} onMouseEnter={onHandleMouseEnter} onMouseLeave={onHandleMouseLeave}>
            <div className="nft-item-column" style={{ textAlign: 'left', flex: 1.5 }}>
                <div style={{ whiteSpace: 'nowrap',display: 'flex',alignItems: 'center',height: '100%',cursor: 'pointer' }} onClick={handleNftAnalyseClick}>
                    <span className="circle" style={{ backgroundColor: colors[index + 1] }} />
                    {data.symbolLogo !== null && data.symbolLogo.length > 0 ? <img src={data.symbolLogo} style={{width: 15,height: 15,marginRight: 5}}/> : ''}
                    <span className="project-name">
                        <GlobalLabel label={data.symbol} maxLength={12} />
                    </span>
                </div>
            </div>

            <div className="nft-item-column" style={{ overflow: 'scroll' }}>
                {Global.formatBigNum(data.holdValue)}&nbsp;ETH
            </div>

            <div className="nft-item-column">
                <span>{data.holdAmount}</span>
            </div>

            <div className="nft-item-column">
                {data.rate === 0.01 ? '<0.01' : data.rate}%
            </div>

            <div className="nft-item-column" style={{ flex: locale === 'zh' ? 1.3 : 1.5 }}>
                {profitValue}
            </div>

            <div className="nft-item-column percent">
                {
                    data.profitRate !== null ?
                        <>
                            <div style={{
                                color: profitRateFloat > 0 ? '#44BE90' : (profitRateFloat === 0 ? '#ffffff' : '#EF5F81'),
                                fontSize: 10,
                                marginRight: profitRateFloat !== 0 ? 8 : 0,
                                marginLeft: 10
                            }}>
                                {profitRateFloat > 0 ? "+" : ''}{data.profitRate}%
                            </div>
                            <div style={{
                                marginLeft: 10,
                                background: profitRateFloat > 0 ? '#44BE90' : '#EF5F81',
                                width: `${data.percent * 100}%`,
                                height: 8
                            }}
                            />
                        </> : ''
                }
            </div>
            <div className="details" onClick={handleTokenInvestmentClick}>
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
    const { nftAddressAssetsFilter, nftAddressAssetsListLoading, nftAddressAssetsList, nftAddressAssetsTotal, addressBaseInfo } = useSelector((state: AppState) => state.addressAnalyse);
    const router = useRouter();
    const { level } = useSelector((state: AppState) => state.userInfo);

    const handleTokenInvestmentClick = (symbolAddr: string,event: any) => {
        if (level !== 1) {
            dispatch(setGoProDialogVisible(true));
            return;
        }
        const url = typeof groupId === 'undefined' ?
            `/nft-detail/address-analyse/${symbolAddr}/${addrName}`
            : `/nft-detail/address-analyse/${symbolAddr}/${addrName}/${groupId}`;
        Global.openNewTag(event, router, url)
    }

    const handleNftAnalyseClick = (symbolAddr: string,e: any) => {
        Global.openNewTag(e, router, `/nft-analyse-detail/nft-analyse/${symbolAddr}`);
    }

    const columns = [{
        title: f('unifiedSearchProject'),
        dataIndex: 'token',
        width: '10%',
        align: 'left' as const,
        render: (text: string, record: AddressNFTAssetItem) => {
            return (
                <span className="token table-item-color" style={{ whiteSpace: 'nowrap',display: 'flex',alignItems: 'center',cursor: 'pointer'}}
                    onClick={handleNftAnalyseClick.bind(null,record.symbolAddr)}>
                    {record.symbolLogo !== null ? <img src={record.symbolLogo} style={{width: 15,height: 15,marginRight: 5}}/> : ''}
                    <GlobalLabel label={record.symbol} maxLength={16} />
                </span>)
        }
    }, {
        title: f('currentValue'),
        dataIndex: 'amountValue',
        width: '10%',
        align: 'center' as const,
        render: (text: string) => {
            return <span className="table-item-color">{Global.formatBigNum(text)}&nbsp;ETH</span>
        }
    }, {
        title: f('holdNums'),
        dataIndex: 'holdAmount',
        width: '10%',
        align: 'center' as const,
        render: (text: string) => {
            return <span className="table-item-color">{Global.formatBigNum(text)}</span>
        }
    }, {
        title: () => {
            return (
                <>
                    {f('totalCost')}
                    <Tooltip
                        placement="top"
                        title={
                            <>
                                <div>{f('totalCostTips')}</div>
                            </>}
                    >
                        <QuestionCircleOutlined
                            style={{
                                color: '#BEC4CC',
                                fontSize: '14px',
                                marginLeft: '5px',
                            }}
                        />
                    </Tooltip>
                </>)
        },
        dataIndex: 'totalCost',
        width: '10%',
        align: 'center' as const,
        render: (text: string) => {
            return <span className="table-item-color">{text ? `${text} ETH` : NOT_A_NUMBER}</span>
        }
    }, {
        title: () => {
            return (
                <>
                    {f('nftEarnAmount')}
                    <Tooltip
                        placement="top"
                        title={
                            <>
                                <div>{f('nftEarnAmountTips')}</div>
                            </>}
                    >
                        <QuestionCircleOutlined
                            style={{
                                color: '#BEC4CC',
                                fontSize: '14px',
                                marginLeft: '5px',
                            }}
                        />
                    </Tooltip>
                </>)
        },
        dataIndex: 'totalProfit',
        width: '10%',
        align: 'center' as const,
        render: (text: string) => {
            const number = Number(text);
            if (number === 0) {
                return <span className="table-item-color">0</span>
            } else if (number > 0) {
                return <span className="defi-color-Increase">+{text}&nbsp;ETH</span>
            } else {
                return <span className="defi-color-reduce">{text}&nbsp;ETH</span>
            }
        }
    }, {
        title: f('yield'),
        dataIndex: 'profitRate',
        width: '10%',
        align: 'center' as const,
        render: (text: string) => {
            const number = Number(text);
            if (number === 0) {
                return <span className="table-item-color">0</span>
            } else if (number > 0) {
                return <span className="defi-color-Increase">+{text}%</span>
            } else {
                return <span className="defi-color-reduce">{text}%</span>
            }
        }
    }, {
        title: () => {
            return (
                <>
                    {f('averageHoldValue')}
                    <Tooltip
                        placement="top"
                        title={
                            <>
                                <div>{f('averageHoldValueTips')}</div>
                            </>}
                    >
                        <QuestionCircleOutlined
                            style={{
                                color: '#BEC4CC',
                                fontSize: '14px',
                                marginLeft: '5px',
                            }}
                        />
                    </Tooltip>
                </>)
        },
        dataIndex: 'avgCost',
        width: '10%',
        align: 'center' as const,
        render: (text: string) => {
            return <span className="table-item-color">{Global.formatBigNum(text)}&nbsp;ETH</span>
        }
    },
    {
        title: f('currentFloorPrice'),
        dataIndex: 'floorPrice',
        width: '10%',
        align: 'center' as const,
        render: (text: string) => {
            return <span className="table-item-color">{text}&nbsp;ETH</span>
        }
    },
    {
        title: f('lastestTradeDays'),
        dataIndex: 'lastTreadDay',
        width: '15%',
        align: 'center' as const,
        render: (text: string) => {
            return <span className="table-item-color">{text}</span>
        }
    }, {
        title: '',
        dataIndex: '',
        width: '5%',
        align: 'right' as const,
        render: (text: string, record: AddressNFTAssetItem) => {
            return <img src="/images/detail-icon.svg" className="img-details" onClick={handleTokenInvestmentClick.bind(null, record.symbolAddr)} />
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
            dispatch(changeNftAddressAssetsFilter(body));
            dispatch(requestCurrentNFTHoldDetailList(body));
        }
    }, [addrName, groupId, addressBaseInfo.addrName]);

    const handleTableChange = (pagination: TablePaginationConfig, filters: Record<string, (Key | boolean)[] | null>, sorter: SorterResult<AddressNFTAssetItem> | SorterResult<AddressNFTAssetItem>[], extra: TableCurrentDataSource<any>) => {
        if (addrName && pagination.current) {
            dispatch(changeNftAddressAssetsFilter({
                pageNo: pagination.current
            }));
            dispatch(requestCurrentNFTHoldDetailList({
                addrName,
                groupId,
                pageSize: PAGE_SIZE,
                pageNo: pagination.current
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
                <Button key="nft-assets-distribution-modal-close" type="primary" onClick={() => setVisible(false)} style={{ margin: '10px' }}>
                    {f('close')}
                </Button>
            ]}
        >
            <div className="modal-filter">
                <p className="modal-title" style={{ marginLeft: '0px', marginBottom: '30px' }}>{f('currentHoldAssetDistributionDetail')}</p>
                <div className="common-table" style={{ margin: 0 }}>
                    <WaterMarkContent right={40} />
                    <Table
                        columns={columns}
                        rowKey="symbolAddr"
                        dataSource={nftAddressAssetsList}
                        loading={nftAddressAssetsListLoading}
                        pagination={{
                            showQuickJumper: true,
                            showSizeChanger: false,
                            current: nftAddressAssetsFilter.pageNo,
                            pageSize: PAGE_SIZE,
                            total: nftAddressAssetsTotal,
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
