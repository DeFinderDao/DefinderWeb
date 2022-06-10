import { useIntl } from "react-intl";
import { Modal, Table, Form, Input, Radio, Button } from 'antd';
import { Key, MouseEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { DefaultLocale, NOT_A_NUMBER } from "utils/env";
import { AddressAssetItem, AddressAssetsFilter, LpDetailItem } from 'redux/types/AddressAnalyseTypes';
import { useDispatch, useSelector } from "react-redux";
import { changeAddressAssetsFilter, requestAddressAssetsList, requestLpDetailList, setLpDetailsListPageNo } from 'redux/actions/AddressAnalyseAction';
import { AppState } from "redux/reducers";
import Global from "utils/Global";
import type { TablePaginationConfig } from 'antd/lib/table'
import type { ColumnsType, SorterResult, TableCurrentDataSource } from 'antd/lib/table/interface'
import { TokenLogo } from "components/TokenLogo";

const LP_DETAIL_PAGESIZE = 10;

export default function AddressAssets({ addrName, addressList, groupId }: { addrName: string | undefined, addressList: string[], groupId: string | undefined }) {
    const { formatMessage } = useIntl();
    const f = (id: string) => formatMessage({ id });
    const dispatch = useDispatch();
    const { addressAssetsFilter, addressAssetsListLoading, addressAssetsList, addressAssetsTotal, addressBaseInfo } = useSelector((state: AppState) => state.addressAnalyse);

    const onHandleLpClick = () => {
        setLpVisible(true);
    }
    const onHandleFilterClick = () => {
        setFilterVisible(true);
    }

    const columns = [{
        title: f('token'),
        dataIndex: 'token',
        width: '10%',
        align: 'left' as const,
        render: (text: string, record: AddressAssetItem) => {
            return (
                <span className="token table-item-color">
                    <TokenLogo src={record.symbolLogo} style={{ width: 16, height: 16, marginRight: 10 }} />
                    {record.symbol}
                </span>)
        }
    }, {
        title: f('currentPrice'),
        dataIndex: 'price',
        width: '9%',
        align: 'center' as const,
        render: (text: string) => {
            return <span className="table-item-color">$&nbsp;{Global.formatNum(text)}</span>
        }
    }, {
        title: f('holdNum'),
        dataIndex: 'holdAmount',
        width: '9%',
        align: 'center' as const,
        render: (text: string) => {
            return <span className="table-item-color">{Global.formatNum(text)}</span>
        }
    }, {
        title: f('currentValue'),
        dataIndex: 'amountValue',
        width: '9%',
        sorter: true,
        sortDirections: ['descend' as const, 'ascend' as const],
        align: 'center' as const,
        render: (text: string) => {
            return <span className="table-item-color">$&nbsp;{Global.formatBigNum(text)}</span>
        }
    }, {
        title: f('buyAve'),
        dataIndex: 'inAvgPrice',
        width: '9%',
        align: 'center' as const,
        render: (text: string) => {
            const price = Global.formatNum(text);
            const priceText = price === NOT_A_NUMBER ? NOT_A_NUMBER : <>$&nbsp;{price}</>;
            return <span className="table-item-color">{priceText}</span>
        }
    }, {
        title: f('buyNum'),
        dataIndex: 'inAmount',
        width: '9%',
        align: 'center' as const,
        render: (text: string) => {
            return <span className="table-item-color">{Global.formatNum(text)}</span>
        }
    }, {
        title: f('sellAve'),
        dataIndex: 'outAvgPrice',
        width: '9%',
        align: 'center' as const,
        render: (text: string) => {
            const price = Global.formatNum(text);
            const priceText = price === NOT_A_NUMBER ? NOT_A_NUMBER : <>$&nbsp;{price}</>;
            return <span className="table-item-color">{priceText}</span>
        }
    }, {
        title: f('sellNum'),
        dataIndex: 'outAmount',
        width: '9%',
        align: 'center' as const,
        render: (text: string) => {
            return <span className="table-item-color">{Global.formatNum(text)}</span>
        }
    }, {
        title: f('currentCost'),
        dataIndex: 'costPrice',
        width: '9%',
        align: 'center' as const,
        render: (text: string) => {
            const price = Global.formatNum(text);
            const priceText = price === NOT_A_NUMBER ? NOT_A_NUMBER : <>$&nbsp;{price}</>;
            return <span className="table-item-color">{priceText}</span>
        }
    }, {
        title: f('totalInput'),
        dataIndex: 'totalProfit',
        width: '9%',
        sorter: true,
        sortDirections: ['descend' as const, 'ascend' as const],
        align: 'center' as const,
        render: (text: string) => {
            const number = Number(text);
            if (number === 0) {
                return <span className="table-item-color">0</span>
            } else if (number > 0) {
                return <span className="defi-color-Increase">$&nbsp;{Global.formatBigNum(text)}</span>
            } else {
                return <span className="defi-color-reduce">-$&nbsp;{Global.formatBigNum(text.substring(1))}</span>
            }
        }
    }, {
        title: f('yield'),
        dataIndex: 'profitRate',
        width: '9%',
        sorter: true,
        sortDirections: ['descend' as const, 'ascend' as const],
        align: 'center' as const,
        render: (text: string) => {
            return Global.formatIncreaseNumber(text)
        }
    }];

    const [filterVisible, setFilterVisible] = useState<boolean>(false);
    const earningStatusLabels = [f('all'), f('profit'), f('loss')];
    const earningStatusButtons = earningStatusLabels.map((value, index) => {
        const classNames = addressAssetsFilter.type === index ? 'status-item status-item-selected' : 'status-item';
        const handleClick = () => {
            dispatch(changeAddressAssetsFilter({
                type: index
            }));
        }
        return (<span onClick={handleClick} className={classNames} key={`earningStatusButton${index}`}>{value}</span>);
    });

    useEffect(() => {
        if (addrName && addrName !== addressBaseInfo.addrName) {
            const filter = {
                addrName,
                groupId,
                type: 0,
                pageNo: 1,
                pageSize: 20,
                holdValueLeft: undefined,
                holdValueRight: undefined,
                profit: undefined,
                profitRate: undefined,
            }
            dispatch(changeAddressAssetsFilter(filter));
            dispatch(requestAddressAssetsList({
                ...filter,
                addrName,
                groupId
            }));
        }
    }, [addrName, groupId, addressBaseInfo.addrName]);

    const onResetClick = () => {
        const filter = {
            type: 0,
            pageNo: 1,
            pageSize: 20,
            holdValueLeft: undefined,
            holdValueRight: undefined,
            profit: undefined,
            profitRate: undefined,
        }
        dispatch(changeAddressAssetsFilter(filter));
        dispatch(requestAddressAssetsList({
            ...filter,
            addrName,
            groupId
        }));
        setFilterEmpty(true);
        setFilterVisible(false);
    }

    const onSubmitClick = () => {
        setFilterVisible(false);
        setFilterEmpty(isFilterEmpty(addressAssetsFilter));
        dispatch(requestAddressAssetsList(addressAssetsFilter));
    }

    const handleValueChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        switch (index) {
            case 0:
                dispatch(changeAddressAssetsFilter({
                    holdValueLeft: e.target.value
                }));
                break;
            case 1:
                dispatch(changeAddressAssetsFilter({
                    holdValueRight: e.target.value
                }));
                break;
            case 2:
                dispatch(changeAddressAssetsFilter({
                    profit: e.target.value
                }));
                break;
            case 3:
                dispatch(changeAddressAssetsFilter({
                    profitRate: e.target.value
                }));
                break;
        }
    }

    const router = useRouter();
    const { locale = DefaultLocale } = router;
    const formItemClassName = locale === DefaultLocale ? 'form-item-en' : 'form-item';
    const plLabel = addressAssetsFilter.type === 0 ? f('plAbsBigger') : f('plBigger');
    const rateLabel = addressAssetsFilter.type === 0 ? f('profitAbsRateBigger') : (addressAssetsFilter.type === 1 ? f('profitRateBigger') : f('profitRateSmaller'));

    const handleTableChange = (pagination: TablePaginationConfig, filters: Record<string, (Key | boolean)[] | null>, sorter: SorterResult<AddressAssetItem> | SorterResult<AddressAssetItem>[], extra: TableCurrentDataSource<any>) => {
        let field = Array.isArray(sorter) ? sorter[0].field : sorter.field;
        let order = Array.isArray(sorter) ? sorter[0].order : sorter.order;
        const sortField = order ? field as string : undefined;
        const sortType = order ? (order === 'ascend' ? 1 : 2) : undefined;
        dispatch(changeAddressAssetsFilter({
            sortField,
            sortType,
            pageNo: addressAssetsFilter.pageNo == pagination.current as number ? 1 : pagination.current as number,
        }));
        dispatch(requestAddressAssetsList({
            ...addressAssetsFilter,
            sortField,
            sortType,
            pageNo: addressAssetsFilter.pageNo == pagination.current as number ? 1 : pagination.current as number,
        }));
    }

    const { lpDetailsLoading, lpDetailsTotal, lpDetailsList, lpDetailsListPageNo } = useSelector((state: AppState) => state.addressAnalyse);
    const [lpVisible, setLpVisible] = useState<boolean>(false);
    const lpColumns = [
        {
            title: f('token'),
            dataIndex: 'token',
            align: 'left' as const,
            render: (text: string, item: LpDetailItem) => {
                return (
                    <span className="symbol-name">
                        <TokenLogo className="symbol-logo" src={item.symbol0Logo} />
                        &nbsp;
                        &nbsp;
                        <TokenLogo className="symbol-logo" src={item.symbol1Logo} />
                        &nbsp;
                        &nbsp;
                        {`${item.symbol0} + ${item.symbol1}`}
                    </span>);
            }
        },
        {
            title: f('tokenNumber'),
            dataIndex: 'tokenNumber',
            align: 'center' as const,
            render: (text: string, item: LpDetailItem) => {
                return (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 48
                    }}>
                        <TokenLogo className="symbol-logo" src={item.symbol0Logo} />
                        <div className="logo-margin">
                            <div className="symbol-amount">{item.symbol0Amount}&nbsp;{item.symbol0}</div>
                            <div className="symbol-item-value">{`$${Global.formatBigNum(item.symbol0Value)}`}</div>
                        </div>
                        <span className="add">+</span>
                        <TokenLogo className="symbol-logo" src={item.symbol1Logo} />
                        <div className="logo-margin">
                            <div className="symbol-amount">{item.symbol1Amount}&nbsp;{item.symbol1}</div>
                            <div className="symbol-item-value">{`$${Global.formatBigNum(item.symbol1Value)}`}</div>
                        </div>
                    </div>
                );
            }
        },
        {
            title: f('totalValue'),
            dataIndex: 'totalValue',
            align: 'right' as const,
            render: (text: string, item: LpDetailItem) => {
                return <span className="symbol-total-value">$&nbsp;{Global.formatBigNum(item.lpTotalValue)}</span>
            }
        },
    ];

    const handleLpTableChange = (pagination: TablePaginationConfig, filters: Record<string, (Key | boolean)[] | null>, sorter: SorterResult<LpDetailItem> | SorterResult<LpDetailItem>[], extra: TableCurrentDataSource<any>) => {
        if (pagination) {
            dispatch(setLpDetailsListPageNo(pagination.current!));
            dispatch(requestLpDetailList(addressList, groupId, pagination.current!, LP_DETAIL_PAGESIZE));
        }
    }

    useEffect(() => {
        if (lpVisible && lpDetailsList.length === 0) {
            dispatch(requestLpDetailList(addressList, groupId, lpDetailsListPageNo, LP_DETAIL_PAGESIZE));
        }
    }, [addressList, groupId, lpDetailsListPageNo, lpVisible]);

    const isFilterEmpty = (addressAssetsFilter: AddressAssetsFilter) => {
        /*
        holdValueLeft?: string,
        holdValueRight?: string,
        type?: number;
        profit?: string,
        profitRate?: string,
        sortField?: string,
        sortType?: number,
        */
        return !(addressAssetsFilter.holdValueLeft ||
            addressAssetsFilter.holdValueRight ||
            addressAssetsFilter.type !== 0 ||
            addressAssetsFilter.profit ||
            addressAssetsFilter.profitRate)
    }

    const [filterEmpty, setFilterEmpty] = useState(true);
    useEffect(() => {
        setFilterEmpty(true);
    }, [addrName]);

    return (
        <div className="address-assets">
            <div className="assets-header">
                <span className="title">{f('addressAssets')}</span>
                <span>
                    <span className="top-right-button" onClick={onHandleLpClick}>
                        <svg
                            className="icon"
                            aria-hidden="true"
                            style={{
                                width: 16,
                                height: 16,
                                marginRight: 8,
                                verticalAlign: 'middle',
                            }}>
                            <use xlinkHref='#icon-lp-detail'></use>
                        </svg>
                        {f('lpDetail')}
                    </span>
                    <span className={filterEmpty ? "top-right-button" : "top-rigth-button-selected"} onClick={onHandleFilterClick}>
                        <svg
                            className="icon"
                            aria-hidden="true"
                            style={{
                                width: 16,
                                height: 16,
                                marginRight: 8,
                                verticalAlign: 'middle',
                            }}>
                            <use xlinkHref={filterEmpty ? '#icon-filter' : '#icon-filter-selected'}></use>
                        </svg>
                        {f('filter')}
                    </span>
                </span>
            </div>
            <div className="common-table" style={{ margin: 0 }}>
                <Table
                    columns={columns}
                    rowKey="symbolAddr"
                    dataSource={addressAssetsList}
                    loading={addressAssetsListLoading}
                    onRow={record => {
                        return {
                            onClick: event => {
                                const url = typeof groupId === 'undefined' ?
                                    `/investment-details/address-analyse/${record.symbolAddr}/${addrName}`
                                    : `/investment-details/address-analyse/${record.symbolAddr}/${addrName}/${groupId}`;
                                Global.openNewTag(event, router, url)
                            }, 
                        };
                    }}
                    pagination={{
                        showQuickJumper: true,
                        showSizeChanger: false,
                        current: addressAssetsFilter.pageNo,
                        pageSize: addressAssetsFilter.pageSize,
                        total: addressAssetsTotal,
                        position: ['bottomCenter'],
                    }}
                    onChange={handleTableChange}
                    style={{ marginTop: '20px' }}
                />
            </div>
            <Modal
                footer={null}
                visible={filterVisible}
                onCancel={() => setFilterVisible(false)}
                width={locale === DefaultLocale ? 800 : 500}
                centered>

                <div className="modal-filter">
                    <p className="modal-title">{f('filter')}</p>
                    <div className={formItemClassName}>
                        <div className="form-title">{f('holdValueBigger')}</div>
                        <Input
                            placeholder={f('holderValuePlaceholder')}
                            type="number"
                            value={addressAssetsFilter.holdValueLeft}
                            onChange={handleValueChange.bind(null, 0)}
                            style={{ width: 145 }}
                        />
                        <span className="seperator">-</span>
                        <Input
                            placeholder={f('holderValuePlaceholder')}
                            type="number"
                            value={addressAssetsFilter.holdValueRight}
                            onChange={handleValueChange.bind(null, 1)}
                            style={{ width: 145 }}
                        />
                    </div>
                    <div className={formItemClassName}>
                        <div className="form-title">{f('earningStatus')}</div>
                        <div className="earning-status">
                            {earningStatusButtons}
                        </div>
                    </div>
                    <div className={formItemClassName}>
                        <div className="form-title">{plLabel}</div>
                        <Input
                            placeholder={f('holderValuePlaceholder')}
                            type="number"
                            value={addressAssetsFilter.profit}
                            onChange={handleValueChange.bind(null, 2)}
                        />
                    </div>
                    <div className={formItemClassName}>
                        <div className="form-title">{rateLabel}</div>
                        <Input
                            placeholder={f('profitRatePlaceholder')}
                            type="number"
                            value={addressAssetsFilter.profitRate}
                            onChange={handleValueChange.bind(null, 3)}
                        />
                    </div>
                    <div className="footer">
                        <Button type="text" className="reset" onClick={onResetClick}>{f('reset')}</Button>
                        <Button type="primary" onClick={onSubmitClick}>{f('ok')}</Button>
                    </div>
                </div>
            </Modal>

            <Modal
                visible={lpVisible}
                onOk={() => setLpVisible(false)}
                width={1000}
                centered
                closable={true}
                onCancel={() => {
                    setLpVisible(false);
                }}
                bodyStyle={{ paddingBottom: '0px' }}
                footer={[
                    <Button type="primary" onClick={() => setLpVisible(false)} style={{ margin: '10px' }}>
                        {f('close')}
                    </Button>
                ]}
            >
                <div className="modal-filter">
                    <p className="modal-title" style={{ marginLeft: '0px', marginBottom: '30px' }}>{f('lpDetail')}</p>
                    <div className="common-table" style={{ margin: 0 }}>
                        <Table
                            className="lp-detail-table"
                            columns={lpColumns}
                            rowKey={(record: LpDetailItem) => {
                                return `${record.pairAddress}`;
                            }}
                            dataSource={lpDetailsList as any}
                            loading={lpDetailsLoading}
                            pagination={{
                                showQuickJumper: true,
                                showSizeChanger: false,
                                current: lpDetailsListPageNo,
                                pageSize: LP_DETAIL_PAGESIZE,
                                total: lpDetailsTotal,
                                position: ['bottomCenter'],
                            }}
                            onChange={handleLpTableChange}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
}