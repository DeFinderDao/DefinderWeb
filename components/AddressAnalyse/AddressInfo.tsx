import { Button, message, Popover, Modal, Form, Input, Tooltip } from "antd";
import { useRouter } from "next/router";
import React from "react";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { showWalletDialog } from 'redux/actions/UserInfoAction';
import { AppState } from "redux/reducers";
import { InfoDataProps, Item } from "redux/types/AddressAnalyseTypes";
import ApiClient from "utils/ApiClient";
import { CODE_SUCCESS } from "utils/ApiServerError";
import { ADMIN_ADDRESS, DefaultLocale } from "utils/env";
import Global from "utils/Global";
import { WarningFilled } from '@ant-design/icons'

const apiClient = new ApiClient();

declare const ValidateStatuses: ["success", "warning", "error", "validating", ""];

interface FormDataRule {
    validateStatus: typeof ValidateStatuses[number],
    errorMsg: string | null
}

export default function AddressInfo(props: InfoDataProps) {
    const { formatMessage } = useIntl();
    const f = (id: string) => formatMessage({ id });
    const [modalLoading, setModalLoading] = useState(false);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalLabelVisible, setIsModalLabelVisible] = useState(false);

    const userInfo = useSelector((state: AppState) => state.userInfo);
    const { isOpen } = useSelector((state: AppState) => state.menuList);
    const dispatch = useDispatch();
    const router = useRouter();
    const { locale = DefaultLocale, query } = router;
    const { detail } = query;
    
    const groupId = detail && detail.length > 1 ? detail[1] : null;

    const {
        followCount,
        addressList,
        addrSystemTagList,
        addrTime,
        lastActiveTime,
        addrName,
        isNeedAdd,
        contract,
        chainUrlMap,
        ethBalance
    } = props;

      
    const [isFollow, setIsFollow] = useState(props.isFollow);
    const [addrUserTagList, setAddrUserTagList] = useState(props.addrUserTagList);

    useEffect(() => {
        setAddrUserTagList(props.addrUserTagList);
    }, [props.addrName]);

    useEffect(() => {
          
        setIsFollow(props.isFollow);
    }, [followCount, props.isFollow]);

    const addressFollow = async () => {
        if (!userInfo.address) {
            dispatch(showWalletDialog());
            return
        }
        if (isFollow) {
            if ((userInfo.type !== 1 && addressList.length > 1 && addrName.indexOf(ADMIN_ADDRESS) < 0)
                || (userInfo.type === 1)
            ) {
                Modal.warning({
                    content: f('cancelFollowText'),
                    onOk: () => {
                        router.push('/address-combination');
                    }
                });
                return
            }
            setIsModalVisible(true)
        } else {
            if (isNeedAdd) {
                setIsModalLabelVisible(true)
            } else {
                try {
                    const data = await followAddr('', true);
                    if (data.code === CODE_SUCCESS) {
                        setIsFollow(true)
                        message.success(f('followSuccess'))
                          
                    } else {
                        message.error(data.message);
                    }
                } catch (e) {
                    message.error((e as unknown as Error).message);
                }
            }
        }
    }

    const addressFollowCancel = async () => {
        if (modalLoading) {
            return
        }
        setModalLoading(true)
        try {
            const data = await followAddr('', false);
            if (data.code === CODE_SUCCESS) {
                setIsFollow(false)
                setModalLoading(false)
                setIsModalVisible(false)
                message.success(f('followCancelSuccess'))
                  
                setAddrUserTagList([]);
            } else {
                setModalLoading(false);
                message.error(data.message);
            }
        } catch (e) {
            setModalLoading(false);
            message.error((e as unknown as Error).message);
        }
    }

    const Address = ({ addressList, chainUrlMap, addrName }: { addressList: string[], chainUrlMap: Item, addrName: string }) => {
        if (addressList) {
            if (addressList.length > 1) {
                let addrNameComponent = f('addressGroup');
                return (
                    <>
                        <Popover
                            placement="bottomLeft"
                            content={
                                <div>
                                    {addressList.map((address: string) => {
                                        return <div key={address}>
                                            {address}
                                            <svg
                                                className="icon"
                                                aria-hidden="true"
                                                style={{
                                                    width: '14px',
                                                    height: '16px',
                                                    marginLeft: '10px',
                                                    cursor: 'pointer',
                                                    verticalAlign: 'middle'
                                                }}
                                                onClick={() => {
                                                    const copyUrlBtn = document.createElement('input');
                                                    copyUrlBtn.value = address;
                                                    document.body.appendChild(copyUrlBtn);
                                                    copyUrlBtn.select();
                                                    document.execCommand('Copy');
                                                    document.body.removeChild(copyUrlBtn);
                                                    message.success(f('copySuccess'))
                                                }}>
                                                <use xlinkHref="#icon-copy-blue"></use>
                                            </svg>
                                            <svg
                                                className="icon"
                                                aria-hidden="true"
                                                style={{
                                                    width: 16, height: 16, marginLeft: 10, cursor: 'pointer',
                                                    verticalAlign: 'middle'
                                                }}
                                                onClick={() => {
                                                    window.open(chainUrlMap[address])
                                                }}>
                                                <use xlinkHref='#icon-etherscan'></use>
                                            </svg>
                                        </div>
                                    })}
                                </div>
                            }
                            trigger="hover"
                            overlayClassName="pop-list"
                        >
                            <span className="sub-content-group">{addrNameComponent}</span>
                        </Popover>
                    </>
                )
            } else {
                return (
                    <>
                        <span className="sub-content-group">
                            {addressList[0]}
                            <svg
                                className="icon"
                                aria-hidden="true"
                                style={{
                                    width: '14px',
                                    height: '16px',
                                    marginLeft: '30px',
                                    cursor: 'pointer',
                                    verticalAlign: 'middle'
                                }}
                                onClick={() => {
                                    let addr = document.querySelector('#copyObj');
                                    (addr as HTMLTextAreaElement).select()   
                                    document.execCommand('Copy')
                                    message.success(f('copySuccess'))
                                }}>
                                <use xlinkHref="#icon-copy-blue"></use>
                            </svg>
                        </span>
                        <textarea
                            id="copyObj"
                            readOnly
                            style={{
                                position: 'absolute',
                                top: '0',
                                left: '0',
                                opacity: '0',
                                zIndex: -10,
                            }}
                            value={addressList[0]}
                        />
                    </>);
            }
        } else {
            return <></>
        }
    }

    const addAddrLabel = async () => {
        let name = form.getFieldValue('addressLabel') || ''

        if (name.replace(/(^\s*)|(\s*$)/g, '') == '') {
            setGroupAddressNameRule({
                validateStatus: 'error',
                errorMsg: f('dialogAddressLabelRequired'),
            })
            return
        }
        if (
            userInfo.type !== 1 &&
            name.toLowerCase().indexOf('definder') > -1
        ) {
            setGroupAddressNameRule({
                validateStatus: 'error',
                errorMsg: f('dialogAddressLabelRuleRequired'),
            })
            return
        }
        setGroupAddressNameRule({
            validateStatus: 'success',
            errorMsg: null,
        })
        if (modalLoading) {
            return
        }
        setModalLoading(true)
        try {
            const data = await followAddr(name, true);
            if (data.code === CODE_SUCCESS) {
                setIsFollow(true)
                setModalLoading(false)
                setIsModalLabelVisible(false)
                message.success(f('followSuccess'))
                  
                setAddrUserTagList(addrUserTagList ? addrUserTagList.concat(name) : [name]);
                form.resetFields();
            } else {
                setModalLoading(false)
                message.error(data.message);
            }
        } catch (e) {
            setModalLoading(false)
            message.error((e as unknown as Error).message);
        }
    }

    const followAddr = (addressTag: string, flag: boolean) => {
        return apiClient.post(`/addr/follow`, {
            data: {
                address: encodeURIComponent(addrName),
                groupId: groupId ? groupId : null,
                addressTag: addressTag,
                isFollow: flag,
            },
        })
    }

    const layout = {
        labelCol: { span: 0 },
        wrapperCol: { span: 224 },
    }
    const [form] = Form.useForm()
    const [groupAddressNameRule, setGroupAddressNameRule] = useState<FormDataRule>({
        validateStatus: 'success',
        errorMsg: null,
    })

    let leftLabelClassName = locale === DefaultLocale ? "label en-label-left-column" : "label cn-label-column";
    let rightLabelClassName = locale === DefaultLocale ? "label en-label-right-column" : "label cn-label-column";

    const marksMinWidth = !isOpen ? 520 : 460;
    return (
        <div className="white-block base-info base-info-all">
            <div className="header" style={{ justifyContent: 'flex-start', alignItems: 'center' }}>
                <div className="title">{f('baseInfo')}</div>{
                    contract ?
                        (<div className="contract-warning" style={{ margin: 0, paddingLeft: 20 }}>
                            <span className="contract-warning-text"><WarningFilled style={{ marginRight: 3, color: '#fff' }} />{f('contractWarning')}</span>
                        </div>) : <></>
                }
            </div>
            <div className="info-content" style={{ position: 'relative', display: 'flex' }}>
                <div style={{ flex: addressList.length > 1 ? 2 : 3 }}>
                    <div className="address-line">
                        <span className={leftLabelClassName}>{f('baseInfoMes')}</span>
                        <Address addressList={addressList} chainUrlMap={chainUrlMap} addrName={addrName} />
                        <div>
                            {/*followPeople*/}
                            <Button type="primary" onClick={addressFollow} style={{ marginRight: 35 }}>
                                {!isFollow ? f('follow') : f('unfollow')}
                            </Button>
                        </div>
                    </div>
                    <div className="address-labels">
                        <span className={leftLabelClassName} style={{ display: "inline-flex", alignItems: "center" }}>{f('addressMarks')}</span>
                        <span className="marks" style={{ minWidth: marksMinWidth }}>
                            <MemoMarks minWidth={marksMinWidth} systemTagList={addrSystemTagList} userTagList={addrUserTagList} moreText={f("more")} />
                        </span>
                    </div>
                </div>

                <div className="horizantol" style={{ flexDirection: 'column', flex: 1 }}>
                    <div className="horizantol-item right-padding" style={{ marginTop: 0 }}>
                        <span className={leftLabelClassName}>{f('registerTime')}</span>
                        <span className="sub-content">{addrTime === null ? '' : `${addrTime}${f('unit4')}`}</span>
                    </div>
                    <div className="horizantol-item">
                        <span className={rightLabelClassName}>{f('lastActive')}</span>
                        <span className="sub-content">{lastActiveTime === null ? '' : Global.distanceFromCurrent(lastActiveTime, locale, true)}</span>
                    </div>
                </div>
                <div className="horizantol" style={{ flexDirection: 'column', paddingLeft: 50, flex: 1 }}>
                    <div className="horizantol-item right-padding defi-flex defi-align-center" style={{ marginTop: 0, height: 20, flex: 'auto' }}>
                        {addressList.length > 1 ?
                            null
                            :
                            <Button type="primary" shape="round" className="defi-flex defi-align-center defi-justify-center"
                                onClick={() => {
                                    window.open(chainUrlMap[addressList[0]]);
                                }} >
                                <svg
                                    className="icon"
                                    aria-hidden="true"
                                    style={{
                                        width: '16px',
                                        height: '16px',
                                        marginRight: 5,
                                        cursor: 'pointer',
                                    }}>
                                    <use xlinkHref="#icon-share-grey"></use>
                                </svg>
                                Explorer
                            </Button>
                        }
                    </div>
                    <div className="horizantol-item">
                        <span className={rightLabelClassName}>{f('baseInfoBalance')}</span>
                        <span className="sub-content">{ethBalance === null ? '' : `${Global.formatBigNum(ethBalance)} ETH`}</span>
                    </div>
                </div>
            </div>
            <Modal
                closable={false}
                visible={isModalVisible}
                footer={null}
                width={380}
                centered
            >
                <div className="followDialog">
                    <p className="followDialogTitle">
                        {f('followAddress')}
                    </p>
                    <p className="followDialogDesc">
                        {f('followAddressDesc')}
                    </p>
                    <div className="followDialogBtn">
                        <Button
                            type="text"
                            onClick={() => {
                                setIsModalVisible(false)
                            }}
                            style={{ marginRight: '84px' }}
                        >
                            {f('cancel')}
                        </Button>
                        <Button
                            type="primary"
                            loading={modalLoading}
                            onClick={addressFollowCancel}
                        >
                            {f('comfirm')}
                        </Button>
                    </div>
                </div>
            </Modal>
            <Modal
                closable={false}
                visible={isModalLabelVisible}
                footer={null}
                width={450}
                centered
            >
                <div className="followDialog">
                    <p className="followDialogTitle">
                        {f('addressLabel')}
                    </p>
                    <Form
                        {...layout}
                        form={form}
                        name="control-hooks"
                    >
                        <Form.Item
                            name="addressLabel"
                            validateStatus={
                                groupAddressNameRule.validateStatus
                            }
                            help={groupAddressNameRule.errorMsg}
                        >
                            <Input
                                placeholder={f('addressLabelDesc')}
                                maxLength={locale === DefaultLocale ? 40 : 20}
                                autoComplete="off"
                            />
                        </Form.Item>
                    </Form>
                    <div className="followDialogBtn">
                        <Button
                            type="text"
                            onClick={() => {
                                form.resetFields()
                                setIsModalLabelVisible(false)
                            }}
                            style={{ marginRight: '84px' }}
                        >
                            {f('cancel')}
                        </Button>
                        <Button
                            type="primary"
                            loading={modalLoading}
                            onClick={() => {
                                form.validateFields()
                                    .then((values) => {
                                        addAddrLabel()
                                    })
                                    .catch((info) => { })
                            }}
                        >
                            {f('comfirm')}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div >
    );
}

const MemoMarks = React.memo(Marks);

function Marks({ systemTagList, userTagList, moreText, minWidth }: { systemTagList: string[] | null, userTagList: string[] | null, moreText: string, minWidth: number }) {
    const { formatMessage } = useIntl();
    const f = (id: string) => formatMessage({ id });
    const tagsData: { text: string, hasOverflowWidth: boolean, isSystem: boolean }[] = [];
    const splitedTags = (tag: string) => {
        if (tag.length > 10) {
            return tag.substr(0, 3) + '....' + tag.substr(-3)
        } else {
            return tag;
        }
    }

    if (userTagList && userTagList.length > 0) {
        userTagList.forEach((tag) => {
            tagsData.push({
                text: tag,
                hasOverflowWidth: false,
                isSystem: false
            });
        });
    }

    if (systemTagList && systemTagList.length > 0) {
        systemTagList.forEach((tag) => {
            if (tag.startsWith(ADMIN_ADDRESS)) {
                tag = tag.substring(ADMIN_ADDRESS.length, tag.length);
            }
            tagsData.push({
                text: tag,
                hasOverflowWidth: false,
                isSystem: true
            });
        });
    }

    const { showTab } = useSelector((state: AppState) => state.addressAnalyse);
    if (tagsData.length > 0) {
        const tags = document.getElementsByClassName("marks")[0];
        const paddingRight = 48;
        const holderWidth = (typeof tags === 'undefined' || (typeof tags !== 'undefined' && (tags as HTMLElement).offsetWidth === 0))
            ? minWidth - paddingRight : minWidth - paddingRight;
        let tempWidth = 0;
        const padding = 8 * 2;
        const margin = 10;
        let lastShowTagIndex = -1;
        let hasOverflow = tagsData.some((item, index) => {
            let tagWidth = getTextWidth(item.text, getCanvasFontSize(tags));
            item.hasOverflowWidth = tagWidth + padding > 100;
              
            tempWidth += (tagWidth + padding + margin);
            if (tempWidth > holderWidth) {
                lastShowTagIndex = index;
                return true;
            } else {
                return false;
            }
        });
        if (!hasOverflow) {
            lastShowTagIndex = tagsData.length;
        }
        let tagsComponent = [];
        for (let i = 0; i < lastShowTagIndex; i++) {
            const tagData = tagsData[i];
            const className = tagData.isSystem ? 'mark system-mark' : 'mark user-mark';
            if (tagData.hasOverflowWidth) {
                tagsComponent.push(
                    <span className={className} key={`tag${i}`}>
                        <Tooltip placement="top" title={tagData.text}>{tagData.text}</Tooltip>
                    </span>);
            } else {
                tagsComponent.push(<span className={className} key={`tag${i}`}>{tagData.text}</span>);
            }
        }

        const handleMoreSpanClick = () => {
            let allTagComponent = [];
            for (let i = 0; i < tagsData.length; i++) {
                const tagData = tagsData[i];
                const className = tagData.isSystem ? 'mark system-mark' : 'mark user-mark';
                allTagComponent.push(
                    <span className={className} key={`tag${i}`}>
                        {tagData.text}
                    </span>);
            }
            Modal.info({
                width: 800,
                icon: undefined,
                okText: f('close'),
                content: <div className="marks-modal-container">{allTagComponent}</div>
            });
        }

        if (lastShowTagIndex >= tagsData.length) {
            return <>{tagsComponent}</>
        } else {
            return <><div>{tagsComponent}<Button style={{ cursor: 'pointer', padding: '2px 7px' }} onClick={handleMoreSpanClick}>{moreText}</Button></div></>;
        }
    } else {
        return <></>;
    }
}

const canvasHolder: { canvas: HTMLCanvasElement | null } = {
    canvas: null
};

function getCssStyle(element: Element, prop: string) {
    return window.getComputedStyle(element, null).getPropertyValue(prop);
}

function getCanvasFontSize(el: Element = document.body) {
    const fontWeight = getCssStyle(el, 'font-weight') || 'normal';
    const fontSize = getCssStyle(el, 'font-size') || '16px';
    const fontFamily = getCssStyle(el, 'font-family');
    return `${fontWeight} ${fontSize} ${fontFamily}`;
}

function getTextWidth(text: string, font: string): number {
      
    const canvas = canvasHolder.canvas || (canvasHolder.canvas = document.createElement("canvas"));
    const context = canvas.getContext("2d");
    if (context != null) {
        context.font = font;
        const metrics = context.measureText(text);
        return metrics.width;
    } else {
        return 0;
    }
}