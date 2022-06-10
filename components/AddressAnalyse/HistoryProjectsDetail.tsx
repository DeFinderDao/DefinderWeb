import { useIntl } from "react-intl";
import { message, Switch, Table, Tooltip } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "redux/reducers";
import type { TablePaginationConfig } from 'antd/lib/table'
import type { ColumnsType, Key, SorterResult, TableCurrentDataSource } from 'antd/lib/table/interface'
import { HistoryHoldDetailFilter, HistoryHoldDetailItem, HistoryHoldDetailResponse, RelatedAddressItem } from "redux/types/AddressAnalyseTypes";
import { setRelatedAddressListPageNo, requestRelatedAddressList, changeHistoryHoldDetailFilter, getHistoryHoldDetailList, setGoProDialogVisible } from 'redux/actions/AddressAnalyseAction';
import { useEffect, useState } from "react";
import Global from "utils/Global";
import { useRouter } from "next/router";
import { DefaultLocale } from "utils/env";
import Identicon from 'identicon.js/identicon.js';
import { QuestionCircleOutlined } from '@ant-design/icons';
import ApiClient from "utils/ApiClient";
import moment from "moment";
import { TokenLogo } from "components/TokenLogo";
import WaterMarkContent from "components/WaterMarkContent";

const PAGESIZE = 10;

function scrollTop() {
    const element = document.getElementsByClassName('defi-content')[0];
    element.scrollTop = 0;
}

export default function HistoryProjectsDetail({ addrName, groupId }: { addrName: string | undefined, groupId: string | undefined }) {
    const { formatMessage } = useIntl();
    const f = (id: string) => formatMessage({ id });
    const router = useRouter();
    const { locale = DefaultLocale } = router;
    const dispatch = useDispatch();
    const [loading, setLoading] = useState<boolean>(false);
    const { historyHoldDetailFilter, historyHoldDetailResponse, addressBaseInfo } = useSelector((state: AppState) => state.addressAnalyse);
    const { level } = useSelector((state: AppState) => state.userInfo);
    const columns = [{
        title: f('projectName'),
        dataIndex: 'symbol',
        width: '10%',
        align: 'left' as const,
        render: (text: string, record: HistoryHoldDetailItem) => {
            return (
                <span style={{ cursor: 'pointer' }} className="token table-item-color" onClick={event => Global.openNewTag(event, router, `/market-detail/market-page/${record.symbolAddr}`)}>
                    <TokenLogo src={record.symbolLogo} style={{ width: 16, height: 16, marginRight: 10 }} />
                    {record.symbol}
                </span>)
        }
    }, {
        title: f('currentPrice'),
        dataIndex: 'price',
        width: '15%',
        align: 'center' as const,
        render: (text: string) => {
            return <span className="table-item-color">$&nbsp;{Global.formatNum(text)}</span>
        }
    }, {
        title: f('firstBuyPrice'),
        dataIndex: 'firstInPrice',
        width: '15%',
        align: 'center' as const,
        render: (text: string) => {
            return <span className="table-item-color">{text ? <>$&nbsp;</> : ''}{Global.formatNum(text)}</span>
        }
    }, {
        title: f('firstBuyPriceCurrentPrice'),
        dataIndex: 'priceRate',
        width: '15%',
        align: 'center' as const,
        sorter: true,
        sortDirections: ['descend' as const, 'ascend' as const],
        render: (text: string) => {
            return <span className="table-item-color">{text ? <>{`${text}%`}</> : ''}</span>
        }
    }, {
        title: f('firstBuyTime'),
        dataIndex: 'firstInTime',
        width: '12%',
        align: 'center' as const,
        sorter: true,
        sortDirections: ['descend' as const, 'ascend' as const],
        render: (text: string) => {
            return <span className="table-item-color">{text ? moment(text).format('YYYY-MM-DD HH:mm') : ''}</span>
        }
    }, {
        title: f('totalProfitAndLoss'),
        dataIndex: 'totalProfit',
        width: '18%',
        align: 'center' as const,
        sorter: true,
        sortDirections: ['descend' as const, 'ascend' as const],
        render: (text: string, record: HistoryHoldDetailItem) => {
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
        width: '10%',
        align: 'center' as const,
        sorter: true,
        sortDirections: ['descend' as const, 'ascend' as const],
        render: (text: string, record: HistoryHoldDetailItem) => {
            const number = Number(text);
            if (number === 0) {
                return <span className="table-item-color">0%</span>
            } else if (number > 0) {
                return <span className="defi-color-Increase">{text}%</span>
            } else {
                return <span className="defi-color-reduce">{text}%</span>
            }
        }
    }, {
        title: '',
        dataIndex: '',
        width: '5%',
        align: 'right' as const,
        render: (text: string, record: HistoryHoldDetailItem) => {
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
                hidden: 1
            }
            dispatch(changeHistoryHoldDetailFilter(filter));
            requestHistoryHoldDetailList(filter);
        }
    }, [addrName, groupId, addressBaseInfo]);

    const requestHistoryHoldDetailList = (filter: HistoryHoldDetailFilter) => {
        setLoading(true);
        const apiClient = new ApiClient();
        apiClient.post('/addr/history/hold/detail', {
            data: filter
        }).then(success => {
            dispatch(getHistoryHoldDetailList(success as any as HistoryHoldDetailResponse));
        }, err => {
            dispatch(getHistoryHoldDetailList(null));
            message.error(err.message);
        }).finally(() => {
            setLoading(false);
        });
    }

    const handleTableChange = (pagination: TablePaginationConfig, filters: Record<string, (Key | boolean)[] | null>, sorter: SorterResult<HistoryHoldDetailItem> | SorterResult<HistoryHoldDetailItem>[], extra: TableCurrentDataSource<any>) => {
        if (pagination) {
            let field = Array.isArray(sorter) ? sorter[0].field : sorter.field;
            let order = Array.isArray(sorter) ? sorter[0].order : sorter.order;
            const sortField = order ? field as string : undefined;
            const sortType = order ? (order === 'ascend' ? 1 : 2) : undefined;
            dispatch(changeHistoryHoldDetailFilter({
                ...historyHoldDetailFilter,
                sortField,
                sortType,
                pageNo: historyHoldDetailFilter?.pageNo == pagination.current as number ? 1 : pagination.current as number,
            }));
            requestHistoryHoldDetailList({
                ...historyHoldDetailFilter,
                sortField,
                sortType,
                pageNo: historyHoldDetailFilter?.pageNo == pagination.current as number ? 1 : pagination.current as number,
            });
        }
    }

    const handleSwitchChange = (checked: boolean) => {
        dispatch(changeHistoryHoldDetailFilter({
            ...historyHoldDetailFilter,
            hidden: checked ? 1 : 0,
            pageNo: 1,
        }));
        requestHistoryHoldDetailList({
            ...historyHoldDetailFilter,
            hidden: checked ? 1 : 0,
            pageNo: 1,
        });
    }

    const handleItemClick = (event: any, record: HistoryHoldDetailItem) => {
        if (level !== 1) {
            dispatch(setGoProDialogVisible(true));
            return;
        }

        const url = typeof groupId === 'undefined' ?
            `/investment-details/address-analyse/${record.symbolAddr}/${addrName}`
            : `/investment-details/address-analyse/${record.symbolAddr}/${addrName}/${groupId}`;
        Global.openNewTag(event, router, url)
    }

    return (
        <div className="potentialRelateAddr address-assets">
            <div className="assets-header">
                <span className="title">
                    {f('historyProjectsDetail')}
                    <Tooltip
                        placement="right"
                        title={
                            <div>
                                {f('historyProjectsDetailTips')}
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
                    {f('hideInactiveToken')}
                    <Switch style={{ marginLeft: 10 }} checked={historyHoldDetailFilter === null ? true : historyHoldDetailFilter.hidden === 1} onChange={handleSwitchChange} />
                </span>
            </div>

            <div className="common-table" style={{ margin: 0 }}>
                <Table
                    columns={columns}
                    rowKey={(record: HistoryHoldDetailItem) => {
                        return record.symbolAddr;
                    }}
                    dataSource={historyHoldDetailResponse?.data ? historyHoldDetailResponse?.data.list : []}
                    loading={loading}
                    pagination={{
                        showQuickJumper: true,
                        showSizeChanger: false,
                        current: historyHoldDetailFilter?.pageNo,
                        pageSize: historyHoldDetailFilter?.pageSize,
                        total: historyHoldDetailResponse?.data.totalSize,
                        position: ['bottomCenter'],
                    }}
                    onChange={handleTableChange}
                    style={{ marginTop: '20px' }}
                />
                <WaterMarkContent />
            </div>
        </div>
    );
}