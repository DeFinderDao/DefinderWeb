import { useIntl } from "react-intl";
import { message, Switch, Table, Tooltip } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "redux/reducers";
import type { TablePaginationConfig } from 'antd/lib/table'
import type { Key, SorterResult, TableCurrentDataSource } from 'antd/lib/table/interface'
import { HistoryHoldDetailFilter, NFTHistoryHoldDetailItem, NFTHistoryHoldDetailResponse } from "redux/types/AddressAnalyseTypes";
import { changeNFTHistoryHoldDetailFilter, getNFTHistoryHoldDetailList, setGoProDialogVisible } from 'redux/actions/AddressAnalyseAction';
import { useEffect, useState } from "react";
import Global from "utils/Global";
import { useRouter } from "next/router";
import { DefaultLocale } from "utils/env";
import { QuestionCircleOutlined } from '@ant-design/icons';
import ApiClient from "utils/ApiClient";
import moment from "moment";
import { TokenLogo } from "components/TokenLogo";
import GlobalLabel from "components/GlobalLabel";

export default function NFTHistoryProjectsDetail({ addrName, groupId }: { addrName: string | undefined, groupId: string | undefined }) {
    const { formatMessage } = useIntl();
    const f = (id: string) => formatMessage({ id });
    const router = useRouter();
    const { locale = DefaultLocale } = router;
    const dispatch = useDispatch();
    const [loading, setLoading] = useState<boolean>(false);
    const { nftHistoryHoldDetailFilter, nftHistoryHoldDetailResponse, addressBaseInfo } = useSelector((state: AppState) => state.addressAnalyse);
    const { level } = useSelector((state: AppState) => state.userInfo);
    const columns = [{
        title: f('unifiedSearchProject'),
        dataIndex: 'symbol',
        //width: '10%',
        align: 'left' as const,
        render: (text: string, record: NFTHistoryHoldDetailItem) => {
            return (
                <span className="token table-item-color" style={{ cursor: 'pointer' }} onClick={handleNftAnalyseClick.bind(null,record.symbolAddr)}>
                    <TokenLogo src={record.symbolLogo} style={{ width: 16, height: 16, marginRight: 10 }} />
                    <GlobalLabel label={record.symbol} maxLength={16} />
                </span>)
        }
    }, {
        title: f('cumulativePurchaseNum'),
        dataIndex: 'totalBuyAmount',
        width: '10%',
        sorter: true,
        sortDirections: ['descend' as const, 'ascend' as const],
        align: 'center' as const,
        render: (text: string) => {
            return <span className="table-item-color">&nbsp;{Global.formatNum(text)}</span>
        }
    }, {
        title: f('currentHoldNum'),
        dataIndex: 'holdAmount',
        //width: '10%',
        sorter: true,
        sortDirections: ['descend' as const, 'ascend' as const],
        align: 'center' as const,
        render: (text: string) => {
            return <span className="table-item-color">{text ? <>&nbsp;</> : ''}{Global.formatNum(text)}</span>
        }
    }, {
        title: f('alreadySold'),
        dataIndex: 'sellRate',
        //width: '10%',
        align: 'center' as const,
        sorter: true,
        sortDirections: ['descend' as const, 'ascend' as const],
        render: (text: string) => {
            return <span className="table-item-color">{text ? <>{`${text}%`}</> : ''}</span>
        }
    }, {
        title: f('firstHoldTime'),
        dataIndex: 'firstInTime',
        //width: '15%',
        align: 'center' as const,
        sorter: true,
        sortDirections: ['descend' as const, 'ascend' as const],
        render: (text: string) => {
            return <span className="table-item-color">{text ? moment(text).format('YYYY-MM-DD HH:mm') : ''}</span>
        }
    }, {
        title: f('totalCost'),
        dataIndex: 'totalCost',
        //width: '10%',
        align: 'center' as const,
        sorter: true,
        sortDirections: ['descend' as const, 'ascend' as const],
        render: (text: string, record: NFTHistoryHoldDetailItem) => {
            return <span className="table-item-color">{Global.formatBigNum(text)}&nbsp;ETH</span>
        }
    }, {
        title: f('totalIncome'),
        dataIndex: 'totalIncome',
        //width: '10%',
        align: 'center' as const,
        sorter: true,
        sortDirections: ['descend' as const, 'ascend' as const],
        render: (text: string, record: NFTHistoryHoldDetailItem) => {
            return <span className="table-item-color">{text}&nbsp;ETH</span>
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
        showSorterTooltip: false,
        dataIndex: 'totalProfit',
        //width: '12%',
        align: 'center' as const,
        sorter: true,
        sortDirections: ['descend' as const, 'ascend' as const],
        render: (text: string, record: NFTHistoryHoldDetailItem) => {
            return <span className="table-item-color">{text}&nbsp;ETH</span>
        }
    }, {
        title: f('yield'),
        dataIndex: 'profitRate',
        //width: '8%',
        align: 'center' as const,
        sorter: true,
        sortDirections: ['descend' as const, 'ascend' as const],
        render: (text: string, record: NFTHistoryHoldDetailItem) => {
            const number = Number(text);
            if (number === 0) {
                return <span className="table-item-color">0%</span>
            } else if (number > 0) {
                return <span className="defi-color-Increase">+{text}%</span>
            } else {
                return <span className="defi-color-reduce">{text}%</span>
            }
        }
    }, {
        title: '',
        dataIndex: '',
        //width: '5%',
        align: 'right' as const,
        render: (text: string, record: NFTHistoryHoldDetailItem) => {
            return <img src="/images/detail-icon.svg" className="img-details" onClick={event => handleItemClick(event, record)} />
        }
    }
    ];

    useEffect(() => {
        if (addrName && addrName !== addressBaseInfo.addrName) {
            const filter = {
                addrName,
                groupId,
                pageNo: 1,
                pageSize: 10,
                hidden: 0
            }
            dispatch(changeNFTHistoryHoldDetailFilter(filter));
            requestHistoryHoldDetailList(filter);
        }
    }, [addrName, groupId, addressBaseInfo]);

    const requestHistoryHoldDetailList = (filter: HistoryHoldDetailFilter) => {
        setLoading(true);
        const apiClient = new ApiClient();
        apiClient.post('/addr/nft/history/hold/detail', {
            data: filter
        }).then(success => {
            dispatch(getNFTHistoryHoldDetailList(success as any as NFTHistoryHoldDetailResponse));
        }, err => {
            dispatch(getNFTHistoryHoldDetailList(null));
            message.error(err.message);
        }).finally(() => {
            setLoading(false);
        });
    }

    const handleTableChange = (pagination: TablePaginationConfig, filters: Record<string, (Key | boolean)[] | null>, sorter: SorterResult<NFTHistoryHoldDetailItem> | SorterResult<NFTHistoryHoldDetailItem>[], extra: TableCurrentDataSource<any>) => {
        if (pagination) {
            let field = Array.isArray(sorter) ? sorter[0].field : sorter.field;
            let order = Array.isArray(sorter) ? sorter[0].order : sorter.order;
            const sortField = order ? field as string : undefined;
            const sortType = order ? (order === 'ascend' ? 1 : 2) : undefined;
            dispatch(changeNFTHistoryHoldDetailFilter({
                ...nftHistoryHoldDetailFilter,
                sortField,
                sortType,
                pageNo: nftHistoryHoldDetailFilter?.pageNo == pagination.current ? 1 : pagination.current,
            }));
            requestHistoryHoldDetailList({
                ...nftHistoryHoldDetailFilter,
                sortField,
                sortType,
                pageNo: nftHistoryHoldDetailFilter?.pageNo == pagination.current ? 1 : pagination.current,
            });
        }
    }

    const handleSwitchChange = (checked: boolean) => {
        dispatch(changeNFTHistoryHoldDetailFilter({
            ...nftHistoryHoldDetailFilter,
            hidden: checked ? 1 : 0,
            pageNo: 1,
        }));
        requestHistoryHoldDetailList({
            ...nftHistoryHoldDetailFilter,
            hidden: checked ? 1 : 0,
            pageNo: 1,
        });
    }

    const handleItemClick = (event: any, record: NFTHistoryHoldDetailItem) => {
        if (level !== 1) {
            dispatch(setGoProDialogVisible(true));
            return;
        }
        const url = typeof groupId === 'undefined' ?
            `/nft-detail/address-analyse/${record.symbolAddr}/${addrName}`
            : `/nft-detail/address-analyse/${record.symbolAddr}/${addrName}/${groupId}`;
        Global.openNewTag(event, router, url)
    }

    const handleNftAnalyseClick = (symbolAddr: string,e: any) => {
        Global.openNewTag(e, router, `/nft-analyse-detail/nft-analyse/${symbolAddr}`);
    }

    return (
        <div className="potentialRelateAddr address-assets">
            <div className="assets-header">
                <span className="title">
                    {f('nftHistoryProjectsDetail')}
                    <Tooltip
                        placement="right"
                        title={
                            <div>
                                {f('nftHistoryProjectsDetailTips')}
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
                </span>

                <span style={{ color: '#fff' }}>
                    {f('onlySeeSold')}
                    <Switch style={{ marginLeft: 10 }} checked={nftHistoryHoldDetailFilter === null ? false : nftHistoryHoldDetailFilter.hidden === 1} onChange={handleSwitchChange} />
                </span>
            </div>

            <div className="common-table" style={{ margin: 0 }}>
                <Table
                    columns={columns}
                    rowKey={(record: NFTHistoryHoldDetailItem) => {
                        return record.symbolAddr;
                    }}
                    dataSource={nftHistoryHoldDetailResponse?.data ? nftHistoryHoldDetailResponse?.data.list : []}
                    loading={loading}
                    pagination={{
                        showQuickJumper: true,
                        showSizeChanger: false,
                        current: nftHistoryHoldDetailFilter?.pageNo,
                        pageSize: nftHistoryHoldDetailFilter?.pageSize,
                        total: nftHistoryHoldDetailResponse?.data ? nftHistoryHoldDetailResponse?.data.totalSize : 0,
                        position: ['bottomCenter'],
                    }}
                    onChange={handleTableChange}
                    style={{ marginTop: '20px' }}
                />
            </div>
        </div>
    );
}