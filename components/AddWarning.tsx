import React, { useState, useEffect, SyntheticEvent } from 'react'
import { Select, Input, Button, message, Modal, Checkbox, Tooltip } from 'antd'
const { Option } = Select
import { useIntl } from 'react-intl'
import ApiClient from 'utils/ApiClient'
import { useDispatch, useSelector } from 'react-redux'
import { CODE_SUCCESS } from 'utils/ApiServerError'
import Global from 'utils/Global'
import {
    getSymbolList,
} from 'redux/actions/SetWarningAction'
import {
    QuestionCircleOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons'
import 'styles/addWarning.less'
import { AppState } from 'redux/reducers'
import { CheckboxValueType } from 'antd/lib/checkbox/Group'
import type { OptionData, OptionGroupData, OptionsType } from 'rc-select/lib/interface'
import { useRouter } from 'next/router'
import type { WarningAddressItem, WarningDetailResponse } from 'redux/types/SetWarningTypes'
import type { Response } from 'redux/types';
import { TokenLogo } from './TokenLogo'
import { DefaultLocale } from 'utils/env'


interface SearchResult {
    symbol: string,
    address: string,
    logo: string
}
interface AddWarningProps {
    data: WarningDetailResponse,
    addressList: WarningAddressItem[],
    onShow: boolean,
    onClose: (val: string) => void,
    fromPage?: string,
    fromType?: string,
    title?: string
}

interface SymbolSelectProps<OptionsType extends object[], ValueType> {
    value: number | string | undefined,
    disabled: boolean,
    onChange: (value: ValueType, option: OptionsType[number] | OptionsType) => void
}

  
export default function AddWarning({ data, onShow, onClose, addressList, fromPage, fromType, title }: AddWarningProps) {
    const userInfo = useSelector((state: AppState) => state.userInfo)
    const apiClient = new ApiClient()
      
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id })
    let addDisabled = false
    const dispatch = useDispatch()
    const router = useRouter()
    const { locale = DefaultLocale } = useRouter();
    useEffect(() => {
        if (onShow) {
            setAddressTag(f('ModalTips4'))
            dispatch(getSymbolList())
        }
    }, [onShow])

    const [submitData, setSubmitData] = useState<WarningDetailResponse>(data)

    const [defaultAddr, setDefaultAddr] = useState<null | string>(null)
    const [address, setAddress] = useState('')
    const [addressTag, setAddressTag] = useState(f('ModalTips4'))
    const [contractAddressShow, setContractAddressShow] = useState(
        submitData?.symbolLimit == 1 ? true : false
    )
    const optionsWithDisabled = [
        { label: f('warnWay1'), value: 1, disabled: true },
        { label: f('warnWay2'), value: 2 },
          
        { label: f('warnWay4'), value: 4 },
    ]
    const warningAddressList = addressList;
    const symbolList = useSelector((state: AppState) => state.setWarning.symbolList)
    useEffect(() => {
        if (fromPage == 'setWarning') {
            setAddress(data.address as string)
            setAddressTag(data.addressTag as string)
        } else {
            if (data.groupId) {
                warningAddressList.filter((item) => {
                    if (item.groupId == data.groupId) {
                        setDefaultAddr(
                            `${Global.abbrSymbolAddress(item.address)}(${item.addressTag
                            })`
                        )
                        setAddressTag(item.addressTag)
                        setSubmitData({ ...submitData, groupId: data.groupId })
                    }
                })
            }
            if (onShow && warningAddressList.length == 0) {
                Modal.confirm({
                    title: f('addWarningNoAddrTips'),
                    icon: <ExclamationCircleOutlined />,
                    onOk() {
                        router.push('/address-combination')
                        onClose('cancel')
                    },
                    onCancel() {
                        onClose('cancel')
                    },
                })
            }
        }
    }, [onShow, fromPage])

    const [loading, setLoading] = useState(false)
    
    const addNewWarning = async (data: WarningDetailResponse) => {
        setLoading(true)
        try {
            await apiClient.post(`/warn/add`, {
                data: data,
            })
            message.success(f('successed'))
            setDefaultAddr(null)
            setAddressTag(f('ModalTips4'))
            onClose('confirm')
            setLoading(false)
            clearInput();
        } catch (e) {
            message.error((e as unknown as Error).message)
            setLoading(false)
        }
    }
    
    const editWarning = async (data: WarningDetailResponse) => {
        try {
            await apiClient.post(`/warn/update`, {
                data: data,
            })
            message.success(f('successed'))
            setDefaultAddr(null)
            setAddressTag(f('ModalTips4'))
            onClose('confirm')
            setLoading(false)
            clearInput();
        } catch (e) {
            message.error((e as unknown as Error).message)
        }
    }
    
    function SymbolSelect({ value, disabled, onChange }: SymbolSelectProps<any, number>) {
          
          
          
          
          
          
          
        const [symbolLists, setSymbolLists] = useState(symbolList)

        const [loading, setLoading] = useState(false)
        let timeout
        const [timer, setTimer] = useState<number | null>(null)
        const getSearchData = (value: string, callback: (data: SearchResult[]) => void) => {
            if (timer) {
                clearTimeout(timer)
                timeout = null
                setTimer(null)
            }
            if (value) {
                const getData = async () => {
                    try {
                        const data = await apiClient.get(`/search/symbol/list?key=${value}`)
                        if (data.code === CODE_SUCCESS) {
                            callback((data as unknown as Response<SearchResult[]>).data)
                        } else {
                            setLoading(false)
                            message.error(data.message)
                        }
                    } catch (e) {
                        setLoading(false)
                        message.error((e as unknown as Error).message)
                    }
                }
                timeout = window.setTimeout(getData, 800)
                setTimer(timeout)
            } else {
                setSymbolLists(symbolList)
                setLoading(false)
            }
        }

        const handleSearch = (value: string) => {
            setLoading(true)
            getSearchData(value, (data: SearchResult[]) => {
                setSymbolLists(data)
                setLoading(false)
            })
        };

        return (
            <Select
                showSearch
                defaultValue={value as number}
                style={{ width: 220 }}
                onSearch={handleSearch}
                onChange={onChange}
                disabled={disabled}
                loading={loading}
                  
                  
                  
                  
                  
                  
                filterOption={false}
            >
                <Option value={0}>{f('allSymbol')}</Option>
                <Option value={1}>{f('contractAddress')}</Option>
                {symbolLists.map((item) => {
                    return (
                        <Option value={`${item.address}|${item.symbol}`} key={item.address}>
                            <TokenLogo
                                className="contect-logo"
                                src={item.logo}
                                style={{
                                    width: 16,
                                    height: 16,
                                    marginRight: 10
                                }}
                            />{item.symbol}
                        </Option>
                    )
                })}
            </Select>
        )
    }

    function MoadlTitletTips() {
        return (
            <div style={{ width: '500px', maxHeight: 500, overflow: 'auto', paddingRight: 10 }}>
                <p>{f('ModalTitleTips1')}</p>
                <p>{f('ModalTitleTips2')}</p>
                <p>{f('ModalTitleTips3')}</p>
                <p>{f('ModalTitleTips4')}</p>
                <p>{f('ModalTitleTips5')}</p>
                <p>{f('ModalTitleTips6')}</p>
                <p>{f('ModalTitleTips7')}</p>
                <p>{f('ModalTitleTips8')}</p>
                <p>{f('ModalTitleTips9')}</p>
            </div>
        )
    }

    const [isWarnTypeCreate, setIsWarnTypeCreate] = useState(false);

    const clearInput = () => {
        setAddressTag(f('ModalTips4'));
        setIsWarnTypeCreate(false);
        setContractAddressShow(false)
        setDefaultAddr(null)
        setSubmitData({
            ...submitData,
            ...data
        });
    }

    return (
        <Modal
            centered
            wrapClassName="add-warning"
            closable={false}
            footer={null}
            visible={onShow}
            width={800}
            onCancel={() => {
                setDefaultAddr(null)
                setAddressTag(f('ModalTips4'))
                onClose('cancel')
                clearInput()
            }}
        >
            <p className="modal-title">
                {title ? title : f('addWarning')}
                <Tooltip
                    overlayClassName={'modal-title-tips'}
                    placement="bottom"
                    title={<MoadlTitletTips />}
                >
                    <QuestionCircleOutlined
                        style={{ fontSize: '16px', marginLeft: '10px' }}
                    />
                </Tooltip>
            </p>
            <div className="modal-item">
                {fromPage != 'setWarning' ?
                    <>
                        <span className="item-tit">{f('warningAdderss')}</span>
                        <Select
                            style={{ width: '100%' }}
                            showSearch
                            placeholder={f('ModalTips4')}
                            value={addressTag}
                            onChange={(value, option: OptionsType | OptionData | OptionGroupData) => {
                                setSubmitData({
                                    ...submitData,
                                    groupId: (option as OptionData).key
                                });
                                setAddressTag((option as OptionData).value as string)
                            }}
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option?.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {warningAddressList && warningAddressList.map((item) => {
                                return (
                                    <Option value={item.addressTag} key={item.groupId}>
                                        {`${item.address}(${item.addressTag
                                            })`}
                                    </Option>
                                )
                            })}
                        </Select>
                    </> :
                    <>
                        <span className="item-tit">{f('warningAdderss')}</span>
                        <span>{address}</span>
                    </>
                }
            </div>
            <div className="modal-item">
                <span className="item-tit">{f('adderssTag')}</span>
                <span>{addressTag}</span>
            </div>
            <div className="modal-item choose-box-item">
                <span className="choose-box">
                    <span className="item-tit">{f('warningType')}</span>
                    <Select
                        mode={fromPage == 'setWarning' && fromType != 'add'
                            ? undefined
                            : 'multiple'
                        }
                        value={submitData.warnTypeList}
                        style={{ minWidth: 220 }}
                        placeholder={f('ModalTips3')}
                        onChange={(value) => {
                            if (value.length === 1 && value[0].toString() === '8') {
                                setIsWarnTypeCreate(true);
                                setSubmitData({
                                    ...submitData,
                                    symbol: undefined,
                                    accountForce: undefined,
                                    symbolAddress: undefined,
                                    warnTypeList: value
                                });
                            } else {
                                setIsWarnTypeCreate(false);
                                setSubmitData({
                                    ...submitData,
                                    warnTypeList: value
                                });
                            }
                        }}
                        disabled={addDisabled}
                    >
                        <Option value={1}>{f('warnType1')}</Option>
                        <Option value={2}>{f('warnType2')}</Option>
                        <Option value={3}>{f('warnType3')}</Option>
                        <Option value={4}>{f('warnType4')}</Option>
                        <Option value={5}>{f('warnType5')}</Option>
                        <Option value={6}>{f('warnType6')}</Option>
                        <Option value={7}>{f('warnType7')}</Option>
                        <Option value={8}>{f('warnType8')}</Option>
                        <Option value={9}>{f('warnType9')}</Option>
                        <Option value={10}>{f('warnType10')}</Option>
                    </Select>
                </span>
            </div>
            <div className="modal-item choose-box-item" style={{ display: !isWarnTypeCreate ? 'block' : 'none' }}>
                <span className="choose-box">
                    <span className="item-tit">{f('symbolLimit')}</span>
                    <SymbolSelect
                        value={
                            submitData.symbolLimit == 2
                                ? submitData.symbol
                                : submitData.symbolLimit
                        }
                        onChange={(value, key) => {
                            const data = {
                                ...submitData
                            }
                            data.symbolAddress = ''
                            if (value == 1) {
                                setContractAddressShow(true)
                            } else {
                                setContractAddressShow(false)
                            }

                            if (value != 0 && value != 1) {
                                data.symbolLimit = 2
                                data.symbolAddress = key.key
                                const symbol = (value as any as string).split('|')[1];
                                data.symbol = symbol
                            } else {
                                data.symbolLimit = value
                            }
                            setSubmitData(data);
                        }}
                        disabled={addDisabled}
                    />
                </span>
            </div>
            {contractAddressShow ? (
                <div className="modal-item">
                    <span className="item-tit">{f('contractAddressTit')}</span>
                    <Input
                        placeholder={f('contractAddressTips')}
                        value={submitData.symbolAddress}
                        disabled={addDisabled}
                        onChange={({ target: { value } }) => {
                            setSubmitData({
                                ...submitData,
                                symbolAddress: value
                            });
                        }}
                    />
                </div>
            ) : (
                ''
            )}
            <div className="modal-item" style={{ display: !isWarnTypeCreate ? 'flex' : 'none' }}>
                <span className="item-tit">{f('accountForce')}</span>
                <Input
                    type="number"
                    prefix="$"
                    placeholder={f('accountForceTips')}
                    value={submitData.accountForce}
                    disabled={addDisabled}
                    onChange={({ target: { value } }) => {
                        setSubmitData({
                            ...submitData,
                            accountForce: value
                        });
                    }}
                />
            </div>
            <div className="modal-item">
                <span className="item-tit">{f('warnWay')}</span>
                <span style={{ fontSize: 12 }}>
                    {f('warnWayDesc')}
                    <span style={{ fontSize: 12 }}>
                        <a onClick={(event) => { Global.openNewTag(event, router, `/${locale}/user-setting`) }}>
                            {f('warnWayDesc1')}
                        </a>
                    </span>
                    {f('warnWayDesc2')}
                </span>
                {/* <Checkbox.Group
                    options={optionsWithDisabled}
                    value={submitData.warnWay}
                    onChange={(e: Array<CheckboxValueType>) => {
                        setSubmitData({
                            ...submitData,
                            warnWay: e as number[]
                        });
                    }}
                    disabled={addDisabled}
                /> */}
            </div>

            <div className="btn-box">
                <Button
                    style={{ marginRight: '30px' }}
                    type="text"
                    onClick={(e: SyntheticEvent) => {
                        e.stopPropagation();
                        onClose('cancel')
                        clearInput();
                    }}
                >
                    {f('cancel')}
                </Button>

                <Button
                    type="primary"
                    loading={loading}
                    onClick={(e: SyntheticEvent) => {
                        e.stopPropagation();
                        if (submitData.warnWay?.includes(3) && !userInfo.phone) {
                            Modal.confirm({
                                centered: true,
                                content: f('ModalTips5'),
                                onOk() {
                                    router.push('/user-setting')
                                },
                            });
                            return
                        }
                        if (submitData.warnWay?.includes(4) && !userInfo.mail) {
                            Modal.confirm({
                                centered: true,
                                content: f('ModalTips6'),
                                onOk() {
                                    router.push('/user-setting')
                                },
                            });
                            return
                        }
                        if (
                            !submitData.groupId
                        ) {
                            message.error(f('ModalTips4'))
                            return
                        }
                        if (
                            submitData.warnTypeList == [] ||
                            submitData.warnTypeList?.length == 0
                        ) {
                            message.error(f('ModalTips3'))
                            return
                        }
                        if (
                            submitData.symbolLimit == 1 &&
                            !submitData.symbolAddress
                        ) {
                            message.error(f('ModalTips1'))
                            return
                        }
                        if (!submitData.accountForce && !isWarnTypeCreate) {
                            message.error(f('ModalTips2'))
                            return
                        }
                        if (fromPage == 'setWarning' && fromType != 'add') {
                            submitData.warnType = Array.isArray(submitData.warnTypeList) ? submitData.warnTypeList[0] : submitData.warnTypeList;
                            delete submitData["warnTypeList"];
                            editWarning(submitData)
                        } else {
                            addNewWarning(submitData)
                        }
                    }}
                >
                    {fromPage == 'setWarning' && fromType != 'add' ? f('edit') : f('confirm')}
                </Button>
            </div>
        </Modal>
    )
}
