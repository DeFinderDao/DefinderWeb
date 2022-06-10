import React, { useState, useEffect, useCallback } from 'react'
import { useIntl } from 'react-intl'
import {
  Select,
  Table,
  Button,
  message,
  Modal,
  Menu,
  Popover,
  Form,
  Input,
  Checkbox,
  Dropdown,
  Radio,
  Popconfirm,
} from 'antd'
import { EllipsisOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { MinusOutlined } from '@ant-design/icons'
const { Option } = Select
import 'styles/chanceWarning.less'
import { useRouter } from 'next/router'
import NoLogin from 'components/NoLogin'
import Global from 'utils/Global'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import {
  getSymbolList,
  getFollowList,
  getRecommendList,
  getFollow,
  setRecommendList,
} from 'redux/actions/AddressCombinationAction'
import { isUserLogined } from 'utils/storage'
import AddWarning from 'components/AddWarning'
import ApiClient from 'utils/ApiClient'
import { CODE_PRO_COUNT_LIMIT, CODE_PRO_NO, CODE_SUCCESS } from 'utils/ApiServerError'
import 'styles/address-combination.less'
import {
  trackAction,
  trackPage,
  ADDRESS_COMBINATION,
} from 'utils/analyse/YMAnalyse'
import { showWalletDialog } from 'redux/actions/UserInfoAction'
import { AppState } from 'redux/reducers'
import type { MenuInfo } from 'rc-menu/lib/interface'
import type { OptionData } from 'rc-select/lib/interface'
import type {
  ResponseBodyList,
  FindGroupAddressInfo,
  CombinationFollowDataList,
  CombinationRecommendDataList,
  CombinationSymbolList
} from 'redux/types/AddressCombinationTypes';
import type { Response } from 'redux/types';
import type { ColumnType, Key, SorterResult, TableCurrentDataSource, TablePaginationConfig } from 'antd/lib/table/interface'
import type { ReactNode } from 'react'
import type { WarningAddressItem } from 'redux/types/SetWarningTypes'
import locales from 'locales'
import { DefaultLocale } from 'utils/env'
import Identicon from 'identicon.js/identicon.js'
import EditTableCom from 'components/AddressCombination/EditTableCom';
import { RadioChangeEvent } from 'antd/lib/radio/interface';
import SubscriptionCombination from 'components/Subscription/combination';
import WaterMarkContent from 'components/WaterMarkContent';
export interface NewWarningDetail {
  groupId: null | string | number,
  warnTypeList: string[],
  symbolLimit: number,
  symbolAddress: string,
  symbol: string,
  accountForce: string,
  warnWay: number[],
}



export default function addressCombination() {
  useEffect(() => {
    trackPage(ADDRESS_COMBINATION.url)
  }, [])
  const apiClient = new ApiClient()
  const { formatMessage } = useIntl()
  const f = (id: string) => formatMessage({ id })
  const [isLogin, setIsLogin] = useState(false)
  const userInfo = useSelector((state: AppState) => state.userInfo)
  useEffect(() => {
    setIsLogin(isUserLogined())
    dispatch(getRecommendList(recommendCondition))
    // !userInfo.address ? '' : dispatch(getFollowList(followCondition))
  }, [userInfo.address])
  const router = useRouter()
  const dispatch = useDispatch()

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

  const [recommendCondition, setRecommendCondition] = useState<{
    pageNo: number,
    pageSize: number | undefined,
    sort: string,
    sortFiled: string,
  }>({
    pageNo: 1,
    pageSize: 10,
    sort: '',
    sortFiled: '',
  })
  
  const [followTableChooseList, setFollowTableChooseList] = useState<React.Key[]>([])
  
  const [recommendTableChooseList, setRecommendTableChooseList] = useState<React.Key[]>([])
  // const [url, setUrl] = useState('')
  const [addWarningShow, setAddWarningShow] = useState(false)
  const [newWarningDetail, setNewWarningDetail] = useState<NewWarningDetail>({
    groupId: null,
    warnTypeList: [],
    symbolLimit: 0,
    symbolAddress: '',
    symbol: '',
    accountForce: '',
    warnWay: [1, 2],
  })

  //loading
  const warningFollowLoading = useSelector(
    (state: AppState) => state.addressCombination.warningFollowLoading
  )
  const warningRecommendLoading = useSelector(
    (state: AppState) => state.addressCombination.warningRecommendLoading
  )
  
  const followData = useSelector(
    (state: AppState) => state.addressCombination.followData
  )
  
  const recommendData = useSelector(
    (state: AppState) => state.addressCombination.recommendData
  )
  
  // const menuClick = (e: MenuInfo) => {
  //     trackAction(
  //         ADDRESS_COMBINATION.category,
  //         ADDRESS_COMBINATION.actions[e.key]
  //     )
  //     setCurrent(e.key as string)
  //     // if (e.key == 'recommend') {
  //     //     dispatch(getRecommendList(recommendCondition))
  //     // }
  // }
  
  const onClose = useCallback(
    (val) => {
      if (val == 'confirm') {
        setFollowTableChooseList([])
        dispatch(getFollowList(followCondition))
      }
      setAddWarningShow(false)
    },
    [addWarningShow]
  )
  
  function setFollow(ids: string[] | number[], isFollow: number, call: () => void) {
    if (warningRecommendLoading) {
      return
    }
    if (ids.length <= 0) {
      message.error(f('chooseAddress'))
      return
    }
    dispatch(
      getFollow(
        {
          ids: ids,
          isFollow: isFollow,
        },
        () => {
          message.success(f('successed'))
          call()
        },
        () => {
          message.error(f('failed'))
        }
      )
    )
  }

  const [editFlag, setEditFlag] = useState(false)
  const [recommendAddressFlag, setRecommendAddressFlag] = useState(false)
  const editGroupAddressDefaultInfo: FindGroupAddressInfo = {
    id: '',
    groupAddressName: '', 
    symbol: null, 
    symbolAddr: '', 
    groupAddressList: [], 
    isFollow: true,
    isWarn: false,
    labelList: [],
    isAdmin: 0,
    radioValue: 'single'
  }
  const [editGroupAddressInfo, setEditGroupAddressInfo] = useState(
    editGroupAddressDefaultInfo
  )

  const editGroupAddress = async (id?: number) => {
    if (id) {

      try {
        const response = await apiClient.get(
          `/groupAddr/findGroupAddressInfo?id=${id}`
        )
        const data = response as unknown as Response<FindGroupAddressInfo>;
        if (data.code === CODE_SUCCESS) {
          setEditGroupAddressInfo({ ...data.data, radioValue: data.data.labelList && data.data.labelList.length > 1 ? "multiple" : "single" })
          setEditFlag(true)
          trackAction(
            ADDRESS_COMBINATION.category,
            ADDRESS_COMBINATION.actions.btn_edit
          )
        }
      } catch (e) {
        message.error((e as unknown as Error).message)
      }
    } else {
      setEditGroupAddressInfo(editGroupAddressDefaultInfo)
      setEditFlag(true)
      trackAction(
        ADDRESS_COMBINATION.category,
        ADDRESS_COMBINATION.actions.btn_group
      )
    }
  }
  
  const topGroupAddress = async (id?: number) => {
    try {
      const response = await apiClient.get(
        `/warn/set/top?id=${id}&isTop=1`
      )
      const data = response as unknown as Response<FindGroupAddressInfo>;
      if (data.code === CODE_SUCCESS) {
        message.success(f('successed'))
        dispatch(getFollowList(followCondition))
      }
    } catch (e) {
      message.error((e as unknown as Error).message)
    }
  }
  
  const showTable = (val: number) => {
    setEditFlag(false)
    if (val == 0) {
      return
    }
    if (val == 2) {
      setFollowCondition({
        ...followCondition,
        pageNo: 1,
        pageSize: 20,
      })
    }
    dispatch(getFollowList({
      ...followCondition,
      pageNo: 1,
      pageSize: 20,
    }))
  }


  const [subscriptionWarningVisible, setSubscriptionWarningVisible] = useState(false)
  const [subscriptionWarningText, setSubscriptionWarningText] = useState({
    title: f('subscriptionCombinationTitle'),
    desc: f('subscriptionCombinationDesc'),
    okText: f('subscriptionBtn'),
  })
  const subscriptionWarningCancel = () => {
    setSubscriptionWarningVisible(false)
  }
  const checkAuth = async (callBack: () => void) => {
    try {
      const data = await apiClient.get(`/warn/check/auth`)
      if (data.code === CODE_SUCCESS) {
        callBack();
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

  const [sortedInfo, setSortedInfo] = useState<SorterResult<CombinationFollowDataList>>({})
  const [sortedInfoRecommend, setSortedInfoRecommend] = useState<SorterResult<CombinationRecommendDataList>>({})
  
  const attentionColumns: ColumnType<CombinationFollowDataList>[] = [
    {
      title: '#',
      dataIndex: 'address',
      align: 'center' as const,
      width: 40,
      render: (text: any, record: CombinationFollowDataList, index: number) => <div>{index + 1}</div>
    },
    {
      title: f('address'),
      dataIndex: 'address',
      key: 'address',
      width: 160,
      render: (text: any, record: CombinationFollowDataList) => {
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
            <div className="address-detail-popover"
              style={{ display: 'inline-block' }}
              onClick={(event) => {
                trackAction(
                  ADDRESS_COMBINATION.category,
                  ADDRESS_COMBINATION.actions.recommend_view
                )
                const url = `/address-analyse/${record.addressAll}/${record.id}`;
                Global.openNewTag(event,router,url);
              }}>
              {record.addresses.length > 1
                ? <div>
                  <img style={{ borderRadius: 40, marginRight: 10 }} src={`data:image/png;base64,${new Identicon(`${record.addressAll}definder.info.${record.addressAll}`, 10).toString()}`} />
                  {f('addressGroup')}
                </div>
                : <div>
                  <img style={{ borderRadius: 40, marginRight: 10 }} src={`data:image/png;base64,${new Identicon(record.addresses[0], 10).toString()}`} />
                  {Global.abbrSymbolAddress(record.address)}
                </div>}
            </div>
          </Popover>
        )
      },
    },
    {
      title: f('addressTag'),
      dataIndex: 'addressTag',
      key: 'addressTag',
      ellipsis: true,
    },
    {
      title: f('addrMoney'),
      dataIndex: 'totalMoney',
      key: 'totalMoney',
      width: 175,
      render: (text: any, record: CombinationFollowDataList) => {
        return '$ ' + Global.formatBigNum(record.totalMoney)
      },
      showSorterTooltip: false,
      sorter: true,
      sortDirections: ['descend' as const, 'ascend' as const],
      sortOrder: sortedInfo.columnKey === 'totalMoney' ? sortedInfo.order : undefined,
    },
    {
      title: f('incomeAllAmount'),
      dataIndex: 'incomeAmount',
      key: 'incomeAmount',
      render: (text: string, record: CombinationFollowDataList) => {
        return Global.formatFluctuationRange(text)
      },
      showSorterTooltip: false,
      sorter: true,
      sortDirections: ['descend' as const, 'ascend' as const],
      sortOrder: sortedInfo.columnKey === 'incomeAmount' ? sortedInfo.order : undefined,
    },
    {
      title: f('positionLabel'),
      dataIndex: 'position',
      key: 'position',
      width: 220,
      render: (text: any, record: CombinationFollowDataList) => {
        const num = Number(record.position) < 0 ? 0 : Number(record.position) > 100 ? 100 : Number(record.position);
        return <div className="defi-flex defi-align-center">
          <div className="position-box">
            <div className="position-item" style={{ width: num }}></div>
          </div>
          <span>{num}%</span>
        </div>
      },
      showSorterTooltip: false,
      sorter: true,
      sortDirections: ['descend' as const, 'ascend' as const],
      sortOrder: sortedInfo.columnKey === 'position' ? sortedInfo.order : undefined,
    },
    {
      title: f('warnTimes'),
      dataIndex: 'warnTimes',
      key: 'warnTimes',
      width: 120,
      render: (text: any, record: CombinationFollowDataList) => {
        if (record.warnTimes) {
          return <div
            style={{ cursor: 'pointer' }}
            onClick={(e) => {
              const suffix = `${record.addressTag}`;
              Global.openNewTag(e,router,`/chance-warning/${encodeURIComponent(suffix)}`);
            }}
          >{Global.formatNum(record.warnTimes)}</div>
        } else {
          return <span>/</span>
        }
      },
      showSorterTooltip: false,
      sorter: true,
      sortDirections: ['descend' as const, 'ascend' as const],
      sortOrder: sortedInfo.columnKey === 'warnTimes' ? sortedInfo.order : undefined,
    },
    {
      title: f('addressAlert'),
      dataIndex: 'addressAlert',
      key: 'addressAlert',
      width: 70,
      align: 'center',
      render: (text: any, record: CombinationFollowDataList) => {
        return <div className="action-box" style={{ justifyContent: 'center' }}>
          <svg
            className="icon"
            aria-hidden="true"
            onClick={(e) => {
              trackAction(
                ADDRESS_COMBINATION.category,
                ADDRESS_COMBINATION.actions.set_warning
              )
              const addressAll = encodeURIComponent(record.addressAll || '');
              const addressTag = encodeURIComponent(record.addressTag || '');
              const groupId = encodeURIComponent(record.groupId || '');
              const suffix = `${addressAll}&${addressTag}&${groupId}`;
              if (record.isWarn == 1) {
                Global.openNewTag(e,router,`/set-warning/address-combination/${suffix}`);
              } else {
                checkAuth(() => {
                  Global.openNewTag(e,router,`/set-warning/address-combination/${suffix}`);
                })
              }
            }}>
            <use xlinkHref={`#icon-${record.isWarn == 1 ? 'warning-active' : 'set_warning'}`}></use>
          </svg>
        </div>
      },
    },
    {
      title: f('action'),
      dataIndex: 'action',
      key: 'action',
      align: 'right',
      width: 100,
      render: (text: any, record: CombinationFollowDataList) => {
        const actionMenu = (
          <div className="action-dropdown">
            {/* {record.edit == 0 ? null : ( */}
            <div
              className="action-dropdown-item"
              onClick={() => {
                if (record.addresses.length > 1 && userInfo.level == 0) {
                  setSubscriptionWarningText({
                    title: f('subscriptionVipDesc'),
                    desc: f('subscriptionCombinationDesc2'),
                    okText: f('subscriptionBtn'),
                  })
                  setSubscriptionWarningVisible(true)
                } else {
                  editGroupAddress(record.groupId)
                }
              }}>
              <svg
                className="icon action-dropdown-icon"
                aria-hidden="true">
                <use xlinkHref='#icon-edit-white'></use>
              </svg>
              <span className="action-dropdown-label">{f('editTitle')}</span>
            </div>
            {/* )} */}
            <div
              className="action-dropdown-item"
              onClick={() => {
                Modal.confirm({
                  content: f('cancelFollowTips'),
                  async onOk() {
                    trackAction(
                      ADDRESS_COMBINATION.category,
                      ADDRESS_COMBINATION.actions.dele_follow
                    )
                    try {
                      const data = await apiClient.post(
                        `/warn/batch/delete`,
                        {
                          data: {
                            ids: [record.groupId],
                          },
                        }
                      )
                      if (data.code === CODE_SUCCESS) {
                        setFollowTableChooseList([])
                        dispatch(
                          getFollowList({
                            ...followCondition,
                            pageNo: 1,
                          })
                        )
                        dispatch(getRecommendList(recommendCondition))
                      } else {
                        message.error(data.message)
                      }
                    } catch (e) {
                      message.error((e as unknown as Error).message)
                    }
                  }
                })
              }}>
              <svg
                className="icon action-dropdown-icon"
                aria-hidden="true">
                <use xlinkHref='#icon-delete-white'></use>
              </svg>
              <span className="action-dropdown-label">{f('deleteAddr')}</span>
            </div>
            <div
              className="action-dropdown-item"
              onClick={() => {
                topGroupAddress(record.groupId)
              }}>
              <svg
                className="icon action-dropdown-icon"
                aria-hidden="true">
                <use xlinkHref='#icon-zhiding'></use>
              </svg>
              <span className="action-dropdown-label">{f('toppingAddr')}</span>
            </div>
          </div>
        )
        return (
          <div className="action-box">
            <Dropdown overlay={actionMenu} placement="bottomRight">
              <EllipsisOutlined className="defi-primary-color" />
            </Dropdown>
          </div>
        )
      },
    },
  ]
  
  const recommendColumns: ColumnType<CombinationRecommendDataList>[] = [
    {
      title: '#',
      dataIndex: 'address',
      align: 'center' as const,
      width: 40,
      render: (text: any, record: CombinationRecommendDataList, index: number) => <div>{index + 1}</div>
    },
    {
      title: f('address'),
      dataIndex: 'address',
      key: 'address',
      align: 'left',
      render: (text: any, record: CombinationRecommendDataList) => {
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
            <div className="address-detail-popover"
              style={{ display: 'inline-block' }}
              onClick={(event) => {
                trackAction(
                  ADDRESS_COMBINATION.category,
                  ADDRESS_COMBINATION.actions.recommend_view
                )
                const url = `/address-analyse/${record.addressAll}/${record.id}`;
                Global.openNewTag(event,router,url);
              }}>
              {record.addresses.length > 1
                ?
                <div>
                  <img style={{ borderRadius: 40, marginRight: 10 }} src={`data:image/png;base64,${new Identicon(`${record.addressAll}definder.info.${record.addressAll}`, 10).toString()}`} />
                  {f('addressGroup')}
                </div>
                :
                <div>
                  <img style={{ borderRadius: 40, marginRight: 10 }} src={`data:image/png;base64,${new Identicon(record.addresses[0], 10).toString()}`} />
                  {Global.abbrSymbolAddress(record.address)}
                </div>
              }
            </div>
          </Popover>
        )
      },
    },
    {
      title: f('addressTag'),
      dataIndex: 'addressTag',
      key: 'addressTag',
      ellipsis: true,
    },
    {
      title: f('addrMoney'),
      dataIndex: 'totalMoney',
      key: 'totalMoney',
      render: (text: any, record: CombinationRecommendDataList) => {
        return '$ ' + Global.formatBigNum(record.totalMoney)
      },
      showSorterTooltip: false,
      sorter: true,
      sortDirections: ['descend' as const, 'ascend' as const],
      sortOrder: sortedInfoRecommend.columnKey === 'totalMoney' ? sortedInfoRecommend.order : undefined,
    },
    {
      title: f('incomeAllAmount'),
      dataIndex: 'incomeAmount',
      key: 'incomeAmount',
      render: (text: string, record: CombinationRecommendDataList) => {
        return Global.formatFluctuationRange(text)
      },
      showSorterTooltip: false,
      sorter: true,
      sortDirections: ['descend' as const, 'ascend' as const],
      sortOrder: sortedInfoRecommend.columnKey === 'incomeAmount' ? sortedInfoRecommend.order : undefined,
    },
    {
      title: f('positionLabel'),
      dataIndex: 'position',
      key: 'position',
      width: 220,
      render: (text: any, record: CombinationRecommendDataList) => {
        const num = Number(record.position) < 0 ? 0 : Number(record.position) > 100 ? 100 : Number(record.position);
        return <div className="defi-flex defi-align-center">
          <div className="position-box">
            <div className="position-item" style={{ width: num }}></div>
          </div>
          <span>{num}%</span>
        </div>
      },
      showSorterTooltip: false,
      sorter: true,
      sortDirections: ['descend' as const, 'ascend' as const],
      sortOrder: sortedInfoRecommend.columnKey === 'position' ? sortedInfoRecommend.order : undefined,
    },
    // {
    //     title: f('lateTime'),
    //     dataIndex: 'lateTime',
    //     key: 'lateTime',
    //     align: 'right',
    //     render: (text: any, record: CombinationRecommendDataList) => {
    //         return (
    //             <span>{moment(record.lateTime).format('MM-DD HH:mm')}</span>
    //         )
    //     },
    // },
    {
      title: f('action'),
      dataIndex: 'action',
      key: 'action',
      width: 100,
      align: 'right',
      render: (text: any, record: CombinationRecommendDataList) => {
        return (
          <div className="action-box">
            {record.isFollow == 0 ? (
              <svg
                className="icon"
                aria-hidden="true"
                onClick={() => {
                  if (isLogin) {
                    trackAction(
                      ADDRESS_COMBINATION.category,
                      ADDRESS_COMBINATION.actions
                        .attention_follow
                    )
                    setFollow([record.id], 1, () => {
                      dispatch(
                        setRecommendList({
                          ids: [record.id],
                          isFollow: 1,
                        })
                      )
                      dispatch(
                        getFollowList(followCondition)
                      )
                    })
                  } else {
                    dispatch(showWalletDialog());
                  }
                }}>
                <title>{f('follow')}</title>
                <use xlinkHref='#icon-collect'></use>
              </svg>
            ) : (
              <svg
                className="icon"
                aria-hidden="true"
                onClick={() => {
                  if (isLogin) {
                    trackAction(
                      ADDRESS_COMBINATION.category,
                      ADDRESS_COMBINATION.actions
                        .attention_cancel
                    )
                    setFollow([record.id], 0, () => {
                      dispatch(
                        setRecommendList({
                          ids: [record.id],
                          isFollow: 0,
                        })
                      )
                      dispatch(
                        getFollowList(followCondition)
                      )
                    })
                  } else {
                    Modal.confirm({
                      centered: true,
                      content: f('loginCancelFollowTips'),
                      onOk() {
                        dispatch(showWalletDialog());
                      },
                    })
                  }
                }}>
                <title>{f('cancelFollow')}</title>
                <use xlinkHref='#icon-collect_active'></use>
              </svg>
            )}
          </div>
        )
      },
    },
  ]

  const [isNewAlertLoading, setNewAlertLoading] = useState<boolean>(false);
  const [warningAddressList, setWarningAddressList] = useState<WarningAddressItem[]>([]);


  const [addressAlertValue, setAddressAlertValue] = useState('all')

  const handleChange = (value: string) => {
    setAddressAlertValue(value)
    router.replace('/address-combination', undefined, { shallow: true });
  }

  const { filters } = router.query;
  useEffect(() => {
    if (filters && Array.isArray(filters) && filters.length > 0) {
      if (filters[0] == '1') {
        setAddressAlertValue(filters[0])
        router.replace('/address-combination', undefined, { shallow: true });
      } else {
        setAddressAlertValue('all')
        router.replace('/address-combination', undefined, { shallow: true });
      }
    }
  }, [filters])

  useEffect(() => {
    if (isLogin) {
      const isWarn = addressAlertValue == 'all' ? null : addressAlertValue;
      setFollowCondition({
        ...followCondition,
        isWarn: isWarn,
      })
      dispatch(
        getFollowList({
          ...followCondition,
          isWarn: isWarn,
        })
      )
    }
  }, [isLogin, addressAlertValue])

  function AttentionAddress() {


    const addWarningClickCallback = async () => {
      trackAction(
        ADDRESS_COMBINATION.category,
        ADDRESS_COMBINATION.actions.attention_add
      )

      if (userInfo.level == 1) {
        getFollowListAll();
      } else {
        checkAuth(() => {
          getFollowListAll();
        })
      }
    }

    const getFollowListAll = async () => {
      try {
        setNewAlertLoading(true);
        const data = await apiClient.post(`/warn/follow/list/all`);
        const items = data.data as WarningAddressItem[];
        setWarningAddressList(items);
        if (items.length === 0) {
          message.error(f('addFollowTips'));
          // setCurrent('recommend');
          // if (current !== 'recommend') {
          //     setCurrent('recommend');
          // }
          setRecommendAddressFlag(true)
        } else {
          setAddWarningShow(true)
        }
      } catch (e) {
        message.error(f('sysErr'));
      } finally {
        setNewAlertLoading(false);
      }
    }

    return (
      <div className="common-table attention-address common-table-tip">
        <WaterMarkContent />
        <div className="tableAction" style={{ justifyContent: 'space-between' }}>
          <div className="" style={{ fontSize: 18 }}>
            <span style={{ color: '#fff' }}>{f('followListTitle')}</span>
            {/* <span className="tableTipHorn"></span>
                        <span className="tableTipTriangle"></span> */}
            <Select value={addressAlertValue} style={{ width: 200, marginLeft: 60 }} onChange={handleChange}>
              <Option key="all" value="all">{f('addressAlertAll')}</Option>
              <Option key="1" value="1">{f('addressAlert1')}</Option>
              <Option key="0" value="0">{f('addressAlert0')}</Option>
            </Select>
          </div>
          <div>
            <Button
              type="primary"
              style={{ marginRight: '30px' }}
              onClick={() => {
                editGroupAddress()
              }}
            >
              {f('addFollow')}
            </Button>
            <Button
              loading={isNewAlertLoading}
              disabled={warningFollowLoading}
              type="primary"
              style={{ marginRight: '30px' }}
              onClick={addWarningClickCallback}
            >
              {f('addWarning')}
            </Button>
            <Button
              disabled={
                followTableChooseList.length > 0 ? false : true
              }
              onClick={() => {
                Modal.confirm({
                  content: f('cancelFollowTips'),
                  async onOk() {
                    trackAction(
                      ADDRESS_COMBINATION.category,
                      ADDRESS_COMBINATION.actions.dele_follow
                    )
                    try {
                      const data = await apiClient.post(
                        `/warn/batch/delete`,
                        {
                          data: {
                            ids: followTableChooseList,
                          },
                        }
                      )
                      if (data.code === CODE_SUCCESS) {
                        setFollowTableChooseList([])
                        dispatch(
                          getFollowList({
                            ...followCondition,
                            pageNo: 1,
                          })
                        )
                        dispatch(getRecommendList(recommendCondition))
                      } else {
                        message.error(data.message)
                      }
                    } catch (e) {
                      message.error((e as unknown as Error).message)
                    }
                  }
                })
              }}
              style={{ marginRight: '30px' }}
            >
              {f('deleFollow')}
            </Button>
            <Button
              type="primary"
              onClick={() => {
                setRecommendAddressFlag(true)
              }}
            >
              {f('adminAddr')}
            </Button>
            {/* {userInfo.type === 1 ?
                            <Button
                                type="primary"
                                onClick={() => {
                                    setRecommendAddressFlag(true)
                                }}
                            >
                                {f('adminAddr')}
                            </Button> : null
                        } */}
          </div>
        </div>
        <SubscriptionCombination
          visible={subscriptionWarningVisible}
          onCancel={subscriptionWarningCancel}
          text={subscriptionWarningText} />
        <CombinationFollowTableList
          rowKey={'groupId'}
          groupList={followData}
          groupColumns={attentionColumns}
          params={{
            loading: warningFollowLoading,
          }}
          pagination={{
            current: followCondition.pageNo,
            pageSize: followCondition.pageSize,
            onChange: (page: number, pageSize: number | undefined) => {
              // setFollowTableChooseList([])
              // setFollowCondition({
              //     ...followCondition,
              //     pageNo: page,
              //     pageSize: pageSize,
              // })
              // dispatch(
              //     getFollowList({
              //         ...followCondition,
              //         pageNo: page,
              //         pageSize: pageSize,
              //     })
              // )
            },
          }}
          rowSelection={{
            selectedRowKeys: followTableChooseList,
            onChange: (selectedRowKeys: React.Key[]) => {
              setFollowTableChooseList(selectedRowKeys)
              if (selectedRowKeys.length > 0) {
                setNewWarningDetail({
                  ...newWarningDetail,
                  groupId: selectedRowKeys[0],
                })
              } else {
                setNewWarningDetail({
                  ...newWarningDetail,
                  groupId: null,
                })
              }
            },
          }}
          sorterChange={(pagination, sorter) => {
            if (!Array.isArray(sorter)) {
              setFollowTableChooseList([])
              setSortedInfo(sorter)
              const sortList = (sorter).order
                ? {
                  sortFiled: sorter.field as string,
                  sort: sorter.order == 'ascend' ? 1 : 0,
                }
                : {
                  sortFiled: '',
                  sort: '',
                }
              setFollowCondition({
                ...followCondition,
                pageNo: followCondition.pageNo == pagination.current as number ? 1 : pagination.current as number,
                sortFiled: sortList.sortFiled,
                sort: sortList.sort as string,
              })
              dispatch(
                getFollowList({
                  ...followCondition,
                  pageNo: followCondition.pageNo == pagination.current as number ? 1 : pagination.current as number,
                  sortFiled: sortList.sortFiled,
                  sort: sortList.sort as string,
                })
              )
            }
          }}
        />
      </div>
    )
  }
  
  function RecommendAddress() {
    return (
      <div className="common-table common-dark-table common-table-tip">
        <WaterMarkContent />
        <div className="tableAction" style={{ justifyContent: 'space-between' }}>
          <div className="" style={{ fontSize: 18 }}>
            <span>{f('addressList')}</span>
            {/* <span className="tableTipHorn"></span>
                        <span className="tableTipTriangle"></span> */}
          </div>
          <div>
            <Button
              disabled={
                recommendTableChooseList.length > 0
                  ? false
                  : true
              }
              type="primary"
              style={{ marginRight: '30px' }}
              onClick={() => {
                if (isLogin) {
                  trackAction(
                    ADDRESS_COMBINATION.category,
                    ADDRESS_COMBINATION.actions
                      .attention_follow
                  )
                  setFollow(
                    recommendTableChooseList as number[],
                    1,
                    () => {
                      setRecommendTableChooseList([])
                      dispatch(
                        setRecommendList({
                          ids: recommendTableChooseList as number[],
                          isFollow: 1,
                        })
                      )
                      dispatch(
                        getFollowList(followCondition)
                      )
                    }
                  )
                } else {
                  dispatch(showWalletDialog());
                }
              }}
            >
              {f('batchFollow')}
            </Button>
            <Button
              disabled={
                recommendTableChooseList.length > 0
                  ? false
                  : true
              }
              onClick={() => {
                if (isLogin) {
                  trackAction(
                    ADDRESS_COMBINATION.category,
                    ADDRESS_COMBINATION.actions
                      .attention_cancel
                  )
                  setFollow(
                    recommendTableChooseList as number[],
                    0,
                    () => {
                      setRecommendTableChooseList([])
                      dispatch(
                        setRecommendList({
                          ids: recommendTableChooseList as number[],
                          isFollow: 0,
                        })
                      )
                      dispatch(
                        getFollowList(followCondition)
                      )
                    }
                  )
                } else {
                  Modal.confirm({
                    centered: true,
                    content: f('loginCancelFollowTips'),
                    onOk() {
                      dispatch(showWalletDialog());
                    },
                  })
                }
              }}
            >
              {f('cancelFollow')}
            </Button>
          </div>
        </div>
        <RecommendFollowTableList
          rowKey={'id'}
          groupList={recommendData}
          groupColumns={recommendColumns}
          params={{
            loading: warningRecommendLoading,
          }}
          pagination={{
            current: recommendCondition.pageNo,
            onChange: (page: number, pageSize: number | undefined) => {
              // setRecommendTableChooseList([])
              // setRecommendCondition({
              //     ...recommendCondition,
              //     pageNo: page,
              //     pageSize: pageSize,
              // })
              // dispatch(
              //     getRecommendList({
              //         ...recommendCondition,
              //         pageNo: page,
              //         pageSize: pageSize,
              //     })
              // )
            },
          }}
          rowSelection={{
            selectedRowKeys: recommendTableChooseList,
            onChange: (selectedRowKeys: React.Key[]) => {
              setRecommendTableChooseList(selectedRowKeys)
            },
          }}
          sorterChange={(pagination, sorter) => {
            if (!Array.isArray(sorter)) {
              setRecommendTableChooseList([])
              setSortedInfoRecommend(sorter)
              const sortList = sorter.order
                ? {
                  sortFiled: sorter.field as string,
                  sort: sorter.order == 'ascend' ? 1 : 0,
                }
                : {
                  sortFiled: '',
                  sort: '',
                }
              setRecommendCondition({
                ...recommendCondition,
                pageNo: recommendCondition.pageNo == pagination.current as number ? 1 : pagination.current as number,
                sortFiled: sortList.sortFiled,
                sort: sortList.sort as string,
              })
              dispatch(
                getRecommendList({
                  ...recommendCondition,
                  pageNo: recommendCondition.pageNo == pagination.current as number ? 1 : pagination.current as number,
                  sortFiled: sortList.sortFiled,
                  sort: sortList.sort as string,
                })
              )
            }
          }}
        />
      </div>
    )
  }

  return (
    <>
      <div className="chance-warning">
        <p className="defi-label">{f('label')}</p>
        {/* <div className="menuBox">
                    <Menu
                        selectedKeys={[current]}
                        mode="horizontal"
                        className="top-menu"
                        onClick={menuClick}
                    >
                        <Menu.Item key="attention">{f('followList')}</Menu.Item>
                        <Menu.Item key="recommend">
                            {f('recommendAddress')}
                        </Menu.Item>
                    </Menu>
                </div> */}
        <div className="contentContainer">
          {!isLogin ? (
            <NoLogin
              desc={f('noLoginDesc2')}
              btnText={f('login')}
            />
          ) : (
            <AttentionAddress />
          )}
        </div>
        <Modal
          centered
          width={'90%'}
          footer={null}
          visible={recommendAddressFlag}
          onCancel={(e) => {
            setRecommendAddressFlag(false)
          }}
          className="chance-warning">
          <div className="contentContainer" style={{ height: 632 }}>
            <RecommendAddress />
          </div>
        </Modal>
        <Modal
          centered
          closable={false}
          width={800}
          footer={null}
          visible={editFlag}
          destroyOnClose
          style={{ top: 50, verticalAlign: 'top' }}
        >
          <EditComponent
            editGroupAddressInfo={editGroupAddressInfo}
            // symbolList={symbolList}
            showTable={showTable}
            setEditGroupAddressInfo={setEditGroupAddressInfo}
            setFollowTableChooseList={setFollowTableChooseList}
            setSubscriptionWarningVisible={setSubscriptionWarningVisible}
            setSubscriptionWarningText={setSubscriptionWarningText}
          />
        </Modal>
        <AddWarning
          data={newWarningDetail}
          onShow={addWarningShow}
          addressList={warningAddressList}
          onClose={onClose}
        />
      </div>
    </>
  )
}

interface TableListProps<DataList> {
  children?: ReactNode,
  rowKey: string,
  params: {
    loading: boolean
  },
  pagination: {
    current: number,
    pageSize?: number,
    onChange: (page: number, pageSize?: number) => void
  },
  groupList: ResponseBodyList<DataList[]>,
  groupColumns: ColumnType<DataList>[],
  rowSelection: {
    selectedRowKeys: React.Key[],
    onChange: (selectedRowKeys: React.Key[]) => void
  }
  sorterChange: (pagination: TablePaginationConfig, sorter: SorterResult<DataList> | SorterResult<DataList>[]) => void
}

const CombinationFollowTableList: React.FunctionComponent<TableListProps<CombinationFollowDataList>> = ({
  rowKey,
  params,
  pagination,
  groupList,
  groupColumns,
  rowSelection,
  sorterChange,
}) => {
  return (
    <Table
      rowKey={rowKey}
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
      onChange={(pagination, filters, sorter, extra) => {
        sorterChange(pagination, sorter)
      }}
    />
  )
}

const RecommendFollowTableList: React.FunctionComponent<TableListProps<CombinationRecommendDataList>> = ({
  rowKey,
  params,
  pagination,
  groupList,
  groupColumns,
  rowSelection,
  sorterChange,
}) => {
  return (
    <Table
      rowKey={rowKey}
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
      onChange={(pagination, filters, sorter, extra) => {
        sorterChange(pagination, sorter)
      }}
    />
  )
}

declare const ValidateStatuses: ["success", "warning", "error", "validating", ""];
interface FormDataRule {
  validateStatus: typeof ValidateStatuses[number],
  errorMsg: string | null
}
interface EditComponentProps {
  editGroupAddressInfo: FindGroupAddressInfo,
  // symbolList: CombinationSymbolList[],
  showTable: (val: number) => void,
  setEditGroupAddressInfo: React.Dispatch<React.SetStateAction<FindGroupAddressInfo>>,
  setFollowTableChooseList: React.Dispatch<React.SetStateAction<React.Key[]>>,
  setSubscriptionWarningVisible: React.Dispatch<React.SetStateAction<boolean>>,
  setSubscriptionWarningText: React.Dispatch<React.SetStateAction<{
    title: string;
    desc: string;
    okText: string;
  }>>,
}

interface SearchResult {
  symbol: string,
  address: string,
  logo: string
}

function EditComponent({
  editGroupAddressInfo,
  // symbolList,
  showTable,
  setEditGroupAddressInfo,
  setFollowTableChooseList,
  setSubscriptionWarningVisible,
  setSubscriptionWarningText
}: EditComponentProps) {
  const { formatMessage } = useIntl()
  const f = (id: string) => formatMessage({ id })
  const [groupAddressForn] = Form.useForm()
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  }

  if (editGroupAddressInfo.id && editGroupAddressInfo.radioValue == 'single') {
    editGroupAddressInfo.groupAddressValue = editGroupAddressInfo.labelList![0].address
  }

  const [editLoading, setEditLoading] = useState(false)
  const [isRepeatVisible, setIsRepeatVisible] = useState(false)
  const [repeatGropuName, setRepeatGropuName] = useState('')
  const [addBtnFlag, setAddBtnFlag] = useState(true)
  const [groupAddressListRule, setGroupAddressListRule] = useState<FormDataRule>({
    validateStatus: 'success',
    errorMsg: null,
  })
  const [groupAddressNameRule, setGroupAddressNameRule] = useState<FormDataRule>({
    validateStatus: 'success',
    errorMsg: null,
  })
  const userInfo = useSelector((state: AppState) => state.userInfo)
  const [repeatFlag, setRepeatFlag] = useState(false)
  const apiClient = new ApiClient()
  const operationGroup = async (val: string) => {
    if (editLoading) {
      return
    }
    let name = groupAddressForn.getFieldValue('groupAddressName') || ''
    if (name.replace(/(^\s*)|(\s*$)/g, '') == '') {
      setGroupAddressNameRule({
        validateStatus: 'error',
        errorMsg: f('dialogGroupAddressNameRequired'),
      })
      return
    }
    if (name.startsWith('0x') || name.startsWith('0X')) {
      setGroupAddressNameRule({
        validateStatus: 'error',
        errorMsg: f('dialogGroupAddressNameRule1Required'),
      })
      return;
    }
    if (
      userInfo.type !== 1 &&
      name.toLowerCase().indexOf('definder') > -1
    ) {
      setGroupAddressNameRule({
        validateStatus: 'error',
        errorMsg: f('dialogGroupAddressNameRuleRequired'),
      })
      return
    }
    setGroupAddressNameRule({
      validateStatus: 'success',
      errorMsg: null,
    })
    let groupInfo = groupAddressForn.getFieldsValue(true)
    if (editGroupAddressInfo.radioValue == 'single') {
      let add = groupAddressForn.getFieldValue('groupAddressValue')
      if (!add) {
        setGroupAddressListRule({
          validateStatus: 'error',
          errorMsg: f('addAddNoSpaceSingle'),
        })
        return
      }
      groupInfo.labelList = [{ label: null, address: add }]
    } else {
      let arr = editTableData.filter((item) => { return item.address != '' })
      if (arr.length < 2) {
        setGroupAddressListRule({
          validateStatus: 'error',
          errorMsg: f('addAddNoSpace'),
        })
        return
      }
      if (repeatFlag) {
        setGroupAddressListRule({
          validateStatus: 'error',
          errorMsg: f('addAddNoSpace1'),
        })
        return
      }
      groupInfo.labelList = editTableData
    }
    setEditLoading(true)
    groupInfo.isFollow = true
    if (val == 'add') {
      checkAuth(groupInfo)
    } else {
      if (userInfo.type == 1 || editGroupAddressInfo.isAdmin == 0) {
        editGroup(groupInfo)
      } else {
        checkAuth(groupInfo)
      }
    }
  }

  const checkAuth = async (groupInfo: any) => {
    try {
      const data = await apiClient.get(`/warn/check/auth`)
      if (data.code === CODE_SUCCESS) {
        addGroup(groupInfo)
      } else if (data.code === CODE_PRO_NO) {
        setSubscriptionWarningText({
          title: f('subscriptionCombinationTitle'),
          desc: f('subscriptionCombinationDesc'),
          okText: f('subscriptionBtn'),
        })
        setSubscriptionWarningVisible(true)
        setEditLoading(false)
      } else if (data.code === CODE_PRO_COUNT_LIMIT) {
        setSubscriptionWarningText({
          title: f('subscriptionCombinationTitle'),
          desc: f('subscriptionCombinationDesc1'),
          okText: '',
        })
        setSubscriptionWarningVisible(true)
        setEditLoading(false)
      }
    } catch (e) {
    }
  }
  const addGroup = async (groupInfo: any) => {
    try {
      const response = await apiClient.post(`/groupAddr/addGroupAddress`, {
        data: {
          ...groupInfo,
        },
      })
      const data = response as unknown as Response<{ groupName: string, id: number }>;
      if (data.code === CODE_SUCCESS) {
        setFollowTableChooseList([])
        if (data.data.groupName) {
          setRepeatGropuName(data.data.groupName)
          setIsRepeatVisible(true)
          setEditLoading(false)
        } else {
          groupAddressForn.resetFields()
          showTable(2)
          trackAction(
            ADDRESS_COMBINATION.category,
            ADDRESS_COMBINATION.actions.btn_group_confirm
          )
          setEditLoading(false)
        }
      } else {
        message.error(data.message)
      }
      setEditLoading(false)
    } catch (e) {
      message.error((e as unknown as Error).message)
      setEditLoading(false)
    }
  }
  const editGroup = async (groupInfo: any) => {
    try {
      const response = await apiClient.post(`/groupAddr/updateGroupAddress`, {
        data: {
          ...groupInfo,
        },
      })
      const data = response as unknown as Response<{ groupName: string, id: number }>;
      if (data.code === CODE_SUCCESS) {
        setFollowTableChooseList([])
        if (typeof data.data === 'boolean') {
          groupAddressForn.resetFields()
          showTable(1)
          trackAction(
            ADDRESS_COMBINATION.category,
            ADDRESS_COMBINATION.actions.btn_edit_confirm
          )
        } else if (typeof data.data === 'object') {
          if (data.data.groupName) {
            setRepeatGropuName(data.data.groupName)
            setIsRepeatVisible(true)
          }
        }
      } else {
        message.error(data.message)
      }
      setEditLoading(false)
    } catch (e) {
      message.error((e as unknown as Error).message)
      setEditLoading(false)
    }
  }

  const router = useRouter();
  const { locale } = router;



  interface DataType {
    key: number | string,
    label: string,
    address: string,
  }
  const [editTableData, setEditTableData] = useState<DataType[]>([
    {
      key: '0',
      label: '',
      address: '',
    },
    {
      key: '1',
      label: '',
      address: '',
    },
  ])
  useEffect(() => {
    if (editGroupAddressInfo.id && editGroupAddressInfo.radioValue == 'multiple') {
      const data = editGroupAddressInfo.labelList?.filter((item, index) => {
        item.key = index
        return item
      })
      setEditTableData(data as DataType[]);
    }
  }, [editGroupAddressInfo])
  const columns = [
    {
      title: f('editTableLabelNo'),
      dataIndex: 'key',
      align: 'center' as const,
      width: 50,
      render: (text: any, record: { key: React.Key }, index: number) => <div>{index + 1}</div>
    },
    {
      title: f('editTableLabelLabel'),
      dataIndex: 'label',
      width: 100,
      editable: true,
    },
    {
      title: f('editTableLabelAddress'),
      dataIndex: 'address',
      editable: true,
    },
    {
      title: ' ',
      dataIndex: 'operation',
      align: 'right' as const,
      width: 70,
      render: (text: any, record: { key: React.Key }, index: number) => {
        return (
          <div>
            {editTableData.length > 2 ? (
              <Popconfirm title={f('deleteAddressChild')} onConfirm={() => handleDelete(record.key)}>
                <svg
                  className="icon"
                  style={{ width: 12, height: 12, cursor: 'pointer' }}
                  aria-hidden="true">
                  <use xlinkHref='#icon-delete'></use>
                </svg>
              </Popconfirm>
            ) : null}
            {index == editTableData.length - 1 ? (
              <PlusCircleOutlined style={{ color: '#7377DE', marginLeft: 10 }} onClick={() => { handleAdd() }} />
            ) : null}
          </div>
        )
      }
    },
  ]

  const handleDelete = (key: React.Key) => {
    const dataSource = [...editTableData].filter((item, index) => {
      if (item.key !== key) {
        item.key = index
        return item
      }
    });
    setEditTableData(dataSource);
    const setArr = Array.from(new Set(dataSource.map((item) => {
      return item.address
    })))
    if (setArr.length != dataSource.length) {
      setRepeatFlag(true)
      setGroupAddressListRule({
        validateStatus: 'error',
        errorMsg: f('addAddNoSpace1'),
      })
    } else {
      setRepeatFlag(false)
      setGroupAddressListRule({
        validateStatus: 'success',
        errorMsg: null,
      })
    }
  };

  const handleAdd = () => {
    const dataSource = [...editTableData];
    const newData: DataType = {
      key: Number(dataSource[dataSource.length - 1].key) + 1,
      label: '',
      address: ``,
    };
    dataSource.push(newData)
    setEditTableData(dataSource);
  };

  const handleSave = (row: DataType) => {
    const newData = [...editTableData];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    if (row.label != item.label) {
      if (row.label) {
        if (row.label.startsWith('0x') || row.label.startsWith('0X')) {
          setGroupAddressListRule({
            validateStatus: 'error',
            errorMsg: f('dialogGroupAddressNameRule1Required'),
          })
          return;
        }
        if (userInfo.type !== 1 && row.label.toLowerCase().indexOf('definder') > -1) {
          setGroupAddressListRule({
            validateStatus: 'error',
            errorMsg: f('dialogGroupAddressNameRuleRequired'),
          })
          return
        }
      }
      const len = locale === DefaultLocale ? 100 : 100
      row.label = row.label.substring(0, len)
    }

    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setEditTableData(newData);
    let arr = newData.filter((item) => { return item.address != '' })

    const flag = newData.filter((item) => {
      return item.address == row.address
    })
    if (arr.length < 2) {
      setGroupAddressListRule({
        validateStatus: 'error',
        errorMsg: f('addAddNoSpace'),
      })
    } else {
      setRepeatFlag(false)
      if (flag.length > 1) {
        setRepeatFlag(true)
        setGroupAddressListRule({
          validateStatus: 'error',
          errorMsg: f('addAddNoSpace1'),
        })
      } else {
        setGroupAddressListRule({
          validateStatus: 'success',
          errorMsg: null,
        })
      }
    }
  };

  const [radioVal, setRadioVal] = useState('single')
  const radioGroupChange = (e: RadioChangeEvent) => {
    setGroupAddressListRule({
      validateStatus: 'success',
      errorMsg: null,
    })
    setRadioVal(e.target.value)
    editGroupAddressInfo.radioValue = e.target.value
  }
  return (
    <div className="address-combination">
      <p className="modal-title">
        {editGroupAddressInfo.id ? f('editTitle') : f('addTitle')}
      </p>
      <div>
        <Form
          {...layout}
          form={groupAddressForn}
          initialValues={editGroupAddressInfo}
          name="edit-group-address"
        >
          <Form.Item name="radioValue" label={[
            <span
              className="definder-form-required"
              key={'dialogGroupAddressName'}
            >
              {f('editAddressType')}
            </span>,
          ]}>
            {editGroupAddressInfo.id ?
              editGroupAddressInfo.labelList?.length == 1 ?
                <Radio.Group
                  disabled
                  buttonStyle="solid">
                  <Radio.Button value="single">{f('editAddressSingle')}</Radio.Button>
                </Radio.Group>
                :
                <Radio.Group
                  disabled
                  buttonStyle="solid">
                  <Radio.Button value="multiple">{f('editAddressMultiple')}</Radio.Button>
                </Radio.Group>
              :
              <Radio.Group
                buttonStyle="solid"
                value={radioVal}
                onChange={radioGroupChange}>
                <Radio.Button value="single">{f('editAddressSingle')}</Radio.Button>
                <Radio.Button value="multiple">{f('editAddressMultiple')}
                  <div className='subscription-pro-bg'>{f('subscriptionVipDesc')}</div>
                </Radio.Button>
              </Radio.Group>
            }
          </Form.Item>
          <Form.Item
            name="groupAddressName"
            label={[
              <span
                className="definder-form-required"
                key={'dialogGroupAddressName'}
              >
                {f('dialogGroupAddressName')}
              </span>,
            ]}

            validateStatus={groupAddressNameRule.validateStatus}
            help={groupAddressNameRule.errorMsg}
          >
            <Input
              placeholder={f('dialogGroupAddressNamePlaceholder')}
              maxLength={locale === DefaultLocale ? 100 : 100}
              autoComplete="off"
            />
          </Form.Item>
          <Form.Item
            name="groupAddressValue"
            label={[
              <span
                className="definder-form-required"
                key={'addressAssociated'}
              >
                {f('addressAssociated')}
              </span>,
            ]}
            className="form-item-btn"
            validateStatus={groupAddressListRule.validateStatus}
            help={groupAddressListRule.errorMsg}
          >
            {editGroupAddressInfo.radioValue == 'single' ?
              <Input
                placeholder={f('addressAssociatedPlaceholder')}
                autoComplete="off"
                onChange={() => {
                  let add = groupAddressForn.getFieldValue('groupAddressValue')
                  if (!add) {
                    setGroupAddressListRule({
                      validateStatus: 'error',
                      errorMsg: f('addAddNoSpaceSingle'),
                    })
                  } else {
                    setGroupAddressListRule({
                      validateStatus: 'success',
                      errorMsg: null,
                    })
                  }
                }}
              />
              :
              <EditTableCom<DataType>
                state={editTableData}
                columns={columns}
                handleSave={handleSave}
              />
            }
          </Form.Item>
          {editGroupAddressInfo.id ? null : (
            <>
              {/* <Form.Item label={f('followList')} name="isFollow" valuePropName="checked">
                                <Checkbox
                                    disabled
                                    checked={
                                        editGroupAddressInfo.isFollow
                                            ? true
                                            : false
                                    }
                                >
                                    {f('isFollowDesc')}
                                </Checkbox>
                            </Form.Item> */}
              <Form.Item label={f('chanceWarning')} name="isWarn" valuePropName="checked">
                <Checkbox
                  onChange={(e) => {
                    groupAddressForn.setFieldsValue({
                      isWarn: e.target.checked
                        ? true
                        : false,
                    })
                  }}
                >
                  {f('isWarnDesc')}
                </Checkbox>
              </Form.Item>
            </>
          )}
        </Form>
      </div>
      <div className="form-btns">
        <Button
          type="text"
          onClick={() => {
            groupAddressForn.resetFields()
            showTable(0)
          }}
          style={{
            marginRight: 100,
          }}
        >
          {f('cancel')}
        </Button>
        {editGroupAddressInfo.id ? (
          <Button
            type="primary"
            loading={editLoading}
            onClick={() => {
              groupAddressForn
                .validateFields()
                .then((values) => {
                  operationGroup('edit')
                })
                .catch((info) => { })
            }}
          >
            {f('editGroup')}
          </Button>
        ) : (
          <Button
            type="primary"
            loading={editLoading}
            disabled={editGroupAddressInfo.radioValue != 'single' && userInfo.level != 1}
            onClick={() => {
              groupAddressForn
                .validateFields()
                .then((values) => {
                  operationGroup('add')
                })
                .catch((info) => { })
            }}
          >
            {f('addGroup')}
          </Button>
        )}
      </div>
      <Modal
        closable={false}
        visible={isRepeatVisible}
        footer={null}
        width={500}
        centered
      // style={{ top: 300 }}
      >
        <div className="delete-dialog">
          <p className="delete-dialog-title">
            {f('repeatGroupName')}
          </p>
          <p className="delete-dialog-desc">
            {f('repeatGroupNameDesc1')}{' '}
            <span style={{ color: '#7377de', fontWeight: 'bold' }}>
              {repeatGropuName}
            </span>{' '}
            {f('repeatGroupNameDesc2')}
          </p>
          <div
            className="delete-dialog-btn"
            style={{ flexDirection: 'column' }}
          >
            <Button
              type="primary"
              onClick={() => {
                setIsRepeatVisible(false)
                setRepeatGropuName('')
              }}
            >
              {f('repeatGroupNameGo')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}