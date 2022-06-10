import loadable from '@loadable/component'
import { Modal, Table, Button, message, Spin } from 'antd'
import { CODE_SUCCESS } from 'utils/ApiServerError'
import { useState } from 'react'
const Pie = loadable(() => import('@ant-design/plots/lib/components/pie'))
import { AnalysisBuyingTodayItem, AnalysisBuyingTodayResponse, AnalysisBuyingTodayActions } from 'redux/types/AnalysisBuyingTodayTypes'
import type { ColumnType, Key, SorterResult, TableCurrentDataSource } from 'antd/lib/table/interface'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import ApiClient from 'utils/ApiClient'
import Global from 'utils/Global'
import type { TablePaginationConfig } from 'antd/lib/table'
import { useSelector } from 'react-redux'
import { AppState } from 'redux/reducers'
import { ANT_CHARTS_DARK, DefaultLocale } from 'utils/env'
import Link from 'next/link'
import WaterMarkContent from 'components/WaterMarkContent'
import AddressDetail from './AddressDetail'

interface AnalysisDetailProps {
    tableClass: string,
    hasDesc: boolean,
    params: {
        symbol: string,
        num?: number
        quantity?: number | string
    },
    pieData: AnalysisBuyingTodayItem[],
    tableData: AnalysisBuyingTodayItem[],
    columns: ColumnType<AnalysisBuyingTodayItem>[],
    localText: {
        des1?: string,
        des2?: string,
        comPeo?: string,
        comBum?: string,
    },
    type: string,
    symbolAddr: string,
    analysisType?: number | null,
    dateType?: number | string | null,
}
interface AnalysisModalParams {
    symbolAddr: string,
    analysisType: number | null,
    index: number,
    dateType: number | string | null,
    field: string | null,
    sort: string | null,
    pageNo: number,
    pageSize: number,
}
interface AnalysisModalResponse {
    list: AnalysisModalItems[],
    totalSize: number
}
interface AnalysisModalItems {
    address: string,
    addressLabel: string,
    addressAsset: number,
    holdAmount: number,
    netAmount: number,
    titles: string[]
}
interface PaginationProps {
    pageNo: number,
    pageSize: number,
}
export default function AnalysisDetail({
    tableClass,
    hasDesc,
    params,
    pieData,
    tableData,
    columns,
    localText,
    type,
    symbolAddr,
    analysisType,
    dateType,
}: AnalysisDetailProps) {
    const [activeAdd, setActiveAdd] = useState('')
    const pieSelected = ({ event }: Record<string, any>) => {
        if (event.type == 'element:mouseleave') {
            setActiveAdd('')
        } else {
            setActiveAdd(event.data.data.range)
        }
        setTimeout(() => {
            setActiveAdd('')
        }, 5000)
    }
    const { pageMode } = useSelector((state: AppState) => state.userInfo);
    var config = {
        appendPadding: 10,
        data: pieData || [],
        angleField: 'rate',
        colorField: 'range',
        radius: 1,
        theme: pageMode === 'dark' ? ANT_CHARTS_DARK : undefined,
        innerRadius: 0.45,
        legend: false as const,
        tooltip: false as const,
        pieStyle: {
            stroke: null
        },
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
        label: false as const,
        statistic: {
            title: false as const,
            content: {
                customHtml: function formatter() {
                    if (pieData && pieData.length > 0) {
                        return (
                            <img
                                src={'/images/definder_logo_d.svg'}
                                style={{ width: '25px' }}
                            />
                        ) as unknown as string
                    } else {
                        return <></> as unknown as string
                    }
                },
            },
        },
        animation: false as const,
    }
    const [index, setIndex] = useState(0)
    const getSearchData = async (pagination: PaginationProps, val: number = index, sorter: SorterResult<AnalysisModalItems> | SorterResult<AnalysisModalItems>[] | undefined) => {
        setTableLoading(true)
        let field = typeof sorter !== 'undefined' ? (Array.isArray(sorter) ? sorter[0].field : sorter.field) : null;
        let order = typeof sorter !== 'undefined' ? (Array.isArray(sorter) ? sorter[0].order : sorter.order) : null;
        const sortField = order ? field as string | null : null;
        const sortType = order ? (order === 'ascend' ? '1' : '2') : null;
        try {
            const params: AnalysisModalParams = {
                symbolAddr: symbolAddr,
                analysisType: analysisType || null,
                index: val,
                dateType: dateType || null,
                pageNo: pagination.pageNo,
                pageSize: pagination.pageSize,
                field: sortField,
                sort: sortType
            }
            const apiClient = new ApiClient<AnalysisModalResponse>()
            if (type == 'in' || type == 'out' || type == 'today') {
                const data = await apiClient.post(`/market/netBuy/list/detail/${type}`, { data: params })
                if (data.code === CODE_SUCCESS) {
                    setTableDataModal(data.data)
                    setTableLoading(false)
                } else {
                    message.error(data.message)
                    setTableLoading(false)
                }
            } else {
                const data = await apiClient.post(`/market/hold/list/detail/${type}`, { data: params })
                if (data.code === CODE_SUCCESS) {
                    setTableDataModal(data.data)
                    setTableLoading(false)
                } else {
                    message.error(data.message)
                    setTableLoading(false)
                }
            }
        } catch (e) {
            message.error((e as unknown as Error).message)
            setTableLoading(false)
        }
    }

    const [isModalVisible, setIsModalVisible] = useState(false)

    const showModal = (num: number, val: number) => {
        if (num == 0) {
            return
        }
        setAnalysisCondition({
            pageNo: 1,
            pageSize: 10,
        })
        getSearchData({
            pageNo: 1,
            pageSize: 10,
        }, val, undefined)
        setIsModalVisible(true)
    }
    const handleCancel = () => {
        setIsModalVisible(false)
    }
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id })
    const router = useRouter()
    const { locale } = router;
    const netAmountTitleNum = ['in', 'out', 'increase', 'decrease', 'today']
    const netAmountTitle = [f('analysisModalAddrBuyNum'), f('analysisModalAddSellNum'), f('analysisModalAddIncreaseNum'), f('analysisModalAddDecreaseNum'), f('analysisModalAddrBuyNum')]
    const columnsModal: ColumnType<AnalysisModalItems>[] = [
        {
            title: f('analysisModalAddr'),
            dataIndex: 'address',
            key: 'address',
            align: 'left',
            render: (text, record) => {
                return <AddressDetail
                    symbol={params.symbol}
                    address={record.address}
                    symbolAddr={symbolAddr}
                    titles={record.titles}
                    label={record.addressLabel}
                />
            }
        },
        {
            title: f('analysisModalAddrAmount'),
            dataIndex: 'addressAsset',
            key: 'addressAsset',
            align: 'right',
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            render: (text, record) => {
                return <span>{`$ ${Global.formatBigNum(record.addressAsset)}`}</span>
            },
        },
        {
            title: f('analysisModalAddrNum'),
            dataIndex: 'holdAmount',
            key: 'holdAmount',
            align: 'right',
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            render: (text, record) => {
                return <span>{Global.formatNum(record.holdAmount)}</span>
            },
        },
        {
            title: netAmountTitle[netAmountTitleNum.indexOf(type)],
            dataIndex: 'netAmount',
            key: 'netAmount',
            align: 'right',
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            render: (text, record) => {
                return <span>{Global.formatNum(record.netAmount)}</span>
            },
        },
    ]
    const [analysisCondition, setAnalysisCondition] = useState<PaginationProps>({
        pageNo: 1,
        pageSize: 10,
    })
    const [tableLoading, setTableLoading] = useState(false)
    const [tableDataModal, setTableDataModal] = useState<AnalysisModalResponse>({
        list: [],
        totalSize: 0
    })
    const handleTableChange = (pagination: TablePaginationConfig, filters: Record<string, (Key | boolean)[] | null>, sorter: SorterResult<AnalysisModalItems> | SorterResult<AnalysisModalItems>[], extra: TableCurrentDataSource<any>) => {
        setAnalysisCondition({
            pageNo: analysisCondition.pageNo == pagination.current as number ? 1 : pagination.current as number,
            pageSize: pagination.pageSize as number,
        })
        getSearchData({
            pageNo: analysisCondition.pageNo == pagination.current as number ? 1 : pagination.current as number,
            pageSize: pagination.pageSize as number,
        }, undefined, sorter)
    }

    return (
        <div className="analysis-detail">
            {hasDesc ? (
                <div className="analysis-detail-desc">
                    <div style={{ marginBottom: 10 }}>
                        <span className="defi-color0" style={{ width: locale === DefaultLocale ? '220px' : '90px', display: 'inline-block' }}>{localText.comPeo}: </span><span>{params.num}</span>
                    </div>
                    <div style={{ wordBreak: 'break-all', marginBottom: 20 }} className="defi-flex">
                        <span className="defi-color0" style={{ width: locale === DefaultLocale ? '220px' : '90px', display: 'inline-block' }}>{localText.comBum}:</span>
                        <div>
                            <span>{params.quantity}</span>{' '}
                            {params.symbol}
                        </div>
                    </div>
                </div>
            ) : null}
            <div className="defi-flex">
                <div className="analysis-detail-box" style={{ width: 150 }}>
                    <div className="analysis-detail-pie-box">
                        <div className="analysis-detail-pie">
                            <Pie
                                {...config}
                                fallback={
                                    <div className="loading-pie">
                                        <Spin></Spin>
                                    </div>
                                }
                            />
                        </div>
                        <p className="pie-desc">
                            <span>{localText.des1}</span>
                            <span>{localText.des2}</span>
                        </p>
                    </div>
                </div>
                <div
                    className="analysis-detail-table"
                    style={{ width: 'calc(100% - 150px)', paddingLeft: 10 }}
                >
                    <div className={`common-table ${tableClass}`}>
                        <Table
                            rowKey="range"
                            columns={columns}
                            rowClassName={(record) => {
                                if (record.range == activeAdd) {
                                    return 'table-row active-table-line'
                                } else {
                                    return 'table-row'
                                }
                            }}
                            dataSource={tableData}
                            pagination={false}
                            onRow={record => {
                                return {
                                    onClick: event => {
                                        //console.log(event);
                                        setIndex(record.index);
                                        showModal(record.person, record.index);
                                    }, 
                                };
                            }}
                        />
                        <WaterMarkContent bottom={50} />
                        <Modal
                            width="80%"
                            visible={isModalVisible}
                            onCancel={handleCancel}
                            footer={
                                [
                                    <Button type="primary" onClick={handleCancel} style={{ margin: '10px' }}>
                                        {f('close')}
                                    </Button>
                                ]
                            }
                        >
                            <div className="modal-filter">
                                <p className="modal-title" style={{ marginLeft: '0px', marginBottom: '30px' }}>{f('analysisModalTitle')}</p>
                                <div className="common-table" style={{ margin: 0 }}>
                                    <Table
                                        rowKey="address"
                                        columns={columnsModal}
                                        dataSource={tableDataModal.list}
                                        loading={tableLoading}
                                        pagination={{
                                            showQuickJumper: true,
                                            showSizeChanger: false,
                                            current: analysisCondition.pageNo,
                                            pageSize: analysisCondition.pageSize,
                                            total: tableDataModal.totalSize,
                                            position: ['bottomCenter'],
                                        }}
                                        onChange={handleTableChange}
                                    />
                                    <WaterMarkContent bottom={50} />
                                </div>
                            </div>
                        </Modal>
                    </div>
                </div>
            </div>
        </div>
    )
}
