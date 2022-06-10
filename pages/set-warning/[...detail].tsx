import React, { useState, useEffect } from 'react'
import { useIntl } from 'react-intl'
import {
    Select,
    Table,
    Button,
    message,
    Modal,
    Popover,
} from 'antd'
const { Option } = Select
import 'styles/setWarning.less'
import { useRouter } from 'next/router'
import ApiClient from 'utils/ApiClient'
import Breadcrumb from 'components/Breadcrumb/breadcrumb'
import {
    CODE_PRO_COUNT_LIMIT,
    CODE_PRO_NO,
    CODE_SUCCESS,
    CODE_TOKEN_INVALID,
    CODE_TOKEN_NO,
} from 'utils/ApiServerError'
import { useDispatch, useSelector } from 'react-redux'
import { Dispatch } from "../../redux/types";
import {
    getWarningList,
    getWarningDetail,
} from 'redux/actions/SetWarningAction'
import { isUserLogined } from 'utils/storage'
import { trackAction, trackPage, SET_WARNING } from 'utils/analyse/YMAnalyse'
import { AppState } from 'redux/reducers'
import { ColumnType, TableRowSelection } from 'antd/lib/table/interface'
import { PaginationProps } from 'antd/lib/pagination/'
import { WarningListResponse, WarningItem, WarningListParams, WarningDetailResponse } from 'redux/types/SetWarningTypes'
import Global from 'utils/Global'
import AddWarning from 'components/AddWarning'
import SubscriptionWarning from 'components/Subscription/combination'
import { getFollowList } from 'redux/actions/AddressCombinationAction'
import NoLogin from 'components/NoLogin'
import WaterMarkContent from 'components/WaterMarkContent'

export default function setWarning() {
    useEffect(() => {
        
        trackPage(SET_WARNING.url)
    }, [])
    
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id })
    const apiClient = new ApiClient()
    const router = useRouter()
    const { detail } = router.query;
    const suffix = router.asPath.split('address-combination/')[1];
    const data = [decodeURIComponent(suffix.split('&')[0]), decodeURIComponent(suffix.split('&')[1]), decodeURIComponent(suffix.split('&')[2])];

    const groupId = data[2];
    const dispatch: Dispatch = useDispatch()
    const isUserLog = isUserLogined()
    const { address } = useSelector((state: AppState) => state.userInfo);
    // useEffect(() => {
    //     if (!isUserLog) {
    //         router.push(`/chance-warning`)
    //     }
    // }, [isUserLog])
    const setWarningLoading = useSelector(
        (state: AppState) => state.setWarning.setWarningLoading
    )
    
    const [warningCondition, setWarningCondition] = useState<WarningListParams>({
        pageNo: 1,
        pageSize: 10,
        groupId: groupId,
    })
    useEffect(() => {
        if (address) {
            dispatch(getFollowList(followCondition))
        }
    }, [address])
    useEffect(() => {
        if (address) {
            dispatch(getWarningList(warningCondition))
        }
    }, [address, warningCondition])
    
    const setWarningData = useSelector(
        (state: AppState) => state.setWarning.setWarningData
    )
    
    const setWarningDetail = useSelector(
        (state: AppState) => state.setWarning.setWarningDetail
    )
    
    const [warningTableChooseList, setWarningTableChooseList] = useState([])
    const [addWarningShow, setAddWarningShow] = useState(false)
    const [warningShowType, setWarningShowType] = useState('')
    useEffect(() => {
        if (warningShowType) {
            setAddWarningShow(true)
        }
    }, [warningShowType])
    const [newWarningDetail, setNewWarningDetail] = useState<WarningDetailResponse>({
        address: data[0],
        addressTag: data[1],
        groupId: groupId as unknown as number,
        warnTypeList: [],
        symbolLimit: 0,
        symbolAddress: '',
        symbol: '',
        accountForce: '',
        warnWay: [1],
    })

    const deleteWarning = (ids: number[]) => {
        Modal.confirm({
            content: f('sureToDelete'),
            onOk: async () => {
                try {
                    await apiClient.post(`/warn/delete`, {
                        data: { ids },
                    })
                    message.success(f('successed'))
                    trackAction(SET_WARNING.category, SET_WARNING.actions.del_warning)
                    dispatch(
                        getWarningList({
                            ...warningCondition,
                            pageNo: 1,
                        })
                    )
                } catch (e) {
                    message.error(f('failed'))
                }
            },
        });
    }
    
    const attentionColumns: ColumnType<WarningItem>[] = [
        {
            title: f('address'),
            dataIndex: 'address',
            key: 'address',
            render: (text, record) => {
                const content = (
                    <div>
                        {record.addresses.map((item, index) => {
                            if (index < 10) {
                                return <span key={index}>{item}</span>
                            }
                        })}
                        {record.addresses.length > 10 ? (
                            <span style={{ textAlign: 'center' }}>......</span>
                        ) : (
                            ''
                        )}
                    </div>
                )
                return (
                    <Popover
                        placement="bottom"
                        content={content}
                        trigger="hover"
                        overlayClassName="pop-list"
                    >
                        <span className="address-detail-popover"
                            onClick={(event) => {
                                const url = `/address-analyse/${record.address}/${record.groupId}`;
                                Global.openNewTag(event, router, url)
                            }}>
                            {record.addresses.length > 1
                                ? f('addressGroup')
                                : Global.abbrSymbolAddress(record.address)}
                        </span>
                    </Popover>
                )
            },
        },
        {
            title: f('addressTag'),
            dataIndex: 'addressTag',
            key: 'addressTag',
        },
        {
            title: f('warnType'),
            dataIndex: 'warnType',
            key: 'warnType',
            render: (text, record) => {
                switch (record.warnType) {
                    case 1:
                        return f('warnType1')
                    case 2:
                        return f('warnType2')
                    case 3:
                        return f('warnType3')
                    case 4:
                        return f('warnType4')
                    case 5:
                        return f('warnType5')
                    case 6:
                        return f('warnType6')
                    case 7:
                        return f('warnType7')
                    case 8:
                        return f('warnType8')
                    case 9:
                        return f('warnType9')
                    case 10:
                        return f('warnType10')
                }
            },
        },
        {
            title: f('symbol'),
            dataIndex: 'symbolLimit',
            key: 'symbolLimit',
            render: (text, record) => {
                if (record.symbolLimit == 0 || record.warnType == 8) {
                    return '/'
                } else {
                    return record.symbol
                }
            },
        },
        {
            title: f('totalMoney'),
            dataIndex: 'money',
            key: 'money',
            render: (text: string, record: WarningItem) => {
                if (text === null || record.warnType == 8) {
                    return '/'
                } else {
                    return '$ ' + Global.formatNum(text)
                }
            },
        },
        {
            title: f('warnTimes'),
            dataIndex: 'warnTimes',
            key: 'warnTimes',
        },
        {
            title: f('action'),
            dataIndex: 'action',
            key: 'action',
            align: 'right',
            render: (text, record) => {
                return (
                    <div className="action-box">
                        <svg
                            className="icon"
                            aria-hidden="true"
                            onClick={() => {
                                trackAction(
                                    SET_WARNING.category,
                                    SET_WARNING.actions.del_warning
                                )
                                deleteWarning([record.id])
                            }}>
                            <title>{f('delWarning')}</title>
                            <use xlinkHref='#icon-delete'></use>
                        </svg>
                        <svg
                            className="icon"
                            aria-hidden="true"
                            onClick={() => {
                                trackAction(
                                    SET_WARNING.category,
                                    SET_WARNING.actions.edit_warning
                                )
                                dispatch(
                                    getWarningDetail({ id: record.id })
                                ).then(() => {
                                    setWarningShowType('edit')
                                    setWarningtitle(f('editWarning'))
                                })
                            }}>
                            <title>{f('editWarning')}</title>
                            <use xlinkHref='#icon-edit'></use>
                        </svg>
                    </div>
                )
            },
        },
    ]

    
    const [batchDeleteDisabled, setBatchDeleteDisabled] = useState<boolean>(true);

    const [warningtitle, setWarningtitle] = useState('');
    
    const onClose = (val: string) => {
        if (val == 'confirm') {
            dispatch(getWarningList(warningCondition))
        }
        setWarningShowType('')
        setAddWarningShow(false)
        setNewWarningDetail({
            address: data[0],
            addressTag: data[1],
            groupId: groupId as unknown as number,
            warnTypeList: [],
            symbolLimit: 0,
            symbolAddress: '',
            symbol: '',
            accountForce: '',
            warnWay: [1],
        })
    }


    
    const followData = useSelector(
        (state: AppState) => state.addressCombination.followData
    )
    
    const [followCondition, setFollowCondition] = useState<{
        pageNo: number,
        pageSize: number | undefined,
        sort: string,
        sortFiled: string,
        isWarn: string | number | null
    }>({
        pageNo: 1,
        pageSize: 20,
        sort: '',
        sortFiled: '',
        isWarn: null
    })
    const [subscriptionWarningVisible, setSubscriptionWarningVisible] = useState(false)
    const [subscriptionWarningText, setSubscriptionWarningText] = useState({
        title: f('subscriptionCombinationTitle'),
        desc: f('subscriptionCombinationDesc'),
        okText: f('subscriptionBtn'),
    })
    const subscriptionWarningCancel = () => {
        setSubscriptionWarningVisible(false)
    }

    const checkAuth = async () => {
        try {
            const data = await apiClient.get(`/warn/check/auth`)
            if (data.code === CODE_SUCCESS) {
                setWarningShowType('add')
                setWarningtitle(f('addWarning'))
            } else if (data.code === CODE_PRO_NO) {
                setSubscriptionWarningText({
                    title: f('subscriptionCombinationTitle'),
                    desc: f('subscriptionCombinationDesc'),
                    okText: f('subscriptionBtn'),
                })
                setSubscriptionWarningVisible(true)
            } else if (data.code === CODE_PRO_COUNT_LIMIT) {
                setSubscriptionWarningText({
                    title: f('subscriptionCombinationTitle'),
                    desc: f('subscriptionCombinationDesc1'),
                    okText: '',
                })
                setSubscriptionWarningVisible(true)
            }
        } catch (e) {
        }
    }


    return (
        <div>
            {
                address ?
                    (<div>
                        <Breadcrumb lastItem={f('label')} />
                        <div className="set-warning">
                            <div className="contentContainer">
                                <div className="common-table common-dark-table common-table-tip">
                                    <WaterMarkContent />
                                    <div className="tableAction">
                                        <div className="tableTip">
                                            <span>{f('warningList')}</span>
                                            <span className="tableTipHorn"></span>
                                            <span className="tableTipTriangle"></span>
                                        </div>
                                        <div>
                                            <Button
                                                type="primary"
                                                style={{ marginRight: '30px' }}
                                                onClick={() => {
                                                    trackAction(
                                                        SET_WARNING.category,
                                                        SET_WARNING.actions.add_warning
                                                    )
                                                    if (setWarningData.list && setWarningData.list.length > 0) {
                                                        setWarningShowType('add')
                                                        setWarningtitle(f('addWarning'))
                                                    } else {
                                                        checkAuth()
                                                    }
                                                }}
                                            >
                                                {f('addWarning')}
                                            </Button>
                                            <Button
                                                disabled={batchDeleteDisabled}
                                                onClick={() => {
                                                    deleteWarning(warningTableChooseList)
                                                }}
                                            >
                                                {f('batchDelete')}
                                            </Button>
                                        </div>
                                    </div>
                                    <SubscriptionWarning
                                        visible={subscriptionWarningVisible}
                                        onCancel={subscriptionWarningCancel}
                                        text={subscriptionWarningText} />
                                    <TableList
                                        groupList={setWarningData}
                                        groupColumns={attentionColumns}
                                        params={{
                                            loading: setWarningLoading,
                                        }}
                                        pagination={{
                                            current: warningCondition.pageNo,
                                            onChange: (page: number) => {
                                                setWarningCondition({
                                                    ...warningCondition,
                                                    pageNo: page,
                                                })
                                            },
                                        }}
                                        rowSelection={{
                                            selectedRowKeys: warningTableChooseList,
                                            onChange: (selectedRowKeys) => {
                                                setBatchDeleteDisabled(selectedRowKeys.length == 0);
                                                setWarningTableChooseList(selectedRowKeys as any)
                                            },
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        {addWarningShow ?
                            <AddWarning
                                addressList={[]}
                                data={warningShowType == 'add' ? newWarningDetail : { ...setWarningDetail, warnTypeList: [setWarningDetail.warnType as string] }}
                                onShow={addWarningShow}
                                onClose={onClose}
                                fromPage='setWarning'
                                fromType={warningShowType}
                                title={warningtitle} /> : null}
                    </div>)
                    :
                    (<NoLogin
                        desc={f('noLoginDesc1')}
                        btnText={f('login')}
                    />)
            }
        </div>
    )
}
interface TableListProps<RecordType> {
    params: {
        loading: boolean
    },
    rowSelection: TableRowSelection<RecordType>,
    groupColumns: ColumnType<RecordType>[],
    groupList: WarningListResponse,
    pagination?: false | PaginationProps,
}

function TableList({
    params,
    rowSelection,
    pagination,
    groupList,
    groupColumns,
}: TableListProps<WarningItem>) {
    return (
        <Table
            rowKey="id"
            columns={groupColumns}
            pagination={{
                showQuickJumper: true,
                showSizeChanger: false,
                total: groupList.totalSize,
                position: ['bottomCenter'],
                ...pagination,
            }}
            dataSource={groupList.list}
            loading={params.loading}
            rowSelection={rowSelection}
        />
    )
}

export const getServerSideProps = () => {
    return {
        props: {

        }
    }
}