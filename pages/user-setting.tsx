import { useIntl } from "react-intl";
import "styles/user-setting.less"
import { Divider, Button, Modal, Input, message, Radio, Switch } from "antd";
import type { AppState } from "redux/reducers";
import { useDispatch, useSelector } from "react-redux";
import { ChangeEvent, useEffect, useState } from "react";
import ApiClient from "utils/ApiClient";
import { setUserPhone, setUserEmail, troggleAlertStatus, setUserTelegram, showWalletDialog } from 'redux/actions/UserInfoAction'
import { RadioChangeEvent } from "antd/lib/radio";
import { CODE_SUCCESS } from "utils/ApiServerError";
import { isUserLogined } from "utils/storage";
import NoLogin from 'components/NoLogin'

const COUNT_DOWN = 60;

export default function UserSetting() {
    const { formatMessage } = useIntl();
    const f = (id: string) => formatMessage({ id });
    const { phone, mail, languageType, browserWarn, emailWarn, telegramWarn, telegramId, address } = useSelector((state: AppState) => state.userInfo);
    const [phoneModalVisible, setPhoneModalVisible] = useState<boolean>(false);
    const [emailModalVisible, setEmailModalVisible] = useState<boolean>(false);
    const [telegramModalVisible, setTelegramModalVisible] = useState<boolean>(false);
    const [troggleWebPushLoading, setTroggleWebPushLoading] = useState(false);
    const [troggleEmailPushLoading, setTroggleEmailPushLoading] = useState(false);
    const [troggleTelegramPushLoading, setTroggleTelegramPushLoading] = useState(false);
    const showPhoneBindModal = () => {
        //console.log(111);
        if (!address) {
            dispatch(showWalletDialog());
            return;
        }
        setPhoneModalVisible(true);
    }

    const showEmailBindModal = () => {
        if (!address) {
            dispatch(showWalletDialog());
            return;
        }
        setEmailModalVisible(true);
    }

    const showTelegramBindModal = () => {
        if (!address) {
            dispatch(showWalletDialog());
            return;
        }
        setTelegramModalVisible(true)
    }

    const hidePhoneBindModal = () => {
        setPhoneModalVisible(false);
    }

    const hideEmailBindModal = () => {
        setEmailModalVisible(false);
    }

    const handleLanguageChange = async (e: RadioChangeEvent) => {
        handleTroggle(1, true)
    }

    const dispatch = useDispatch();

    const handleTroggle = async (type: number, checked: boolean) => {
        if (!address) {
            dispatch(showWalletDialog());
            return;
        }
        switch (type) {
            case 1:
                break;
            case 2:
                setTroggleWebPushLoading(true);
                break;
            case 3:
                setTroggleTelegramPushLoading(true);
                break;
            case 4:
                setTroggleEmailPushLoading(true);
                break;
        }

        const apiClient = new ApiClient();
        try {
            const result = await apiClient.get(`/auth/set/warn/${type}`, {
                params: {
                    type
                }
            });
            if (result.code === CODE_SUCCESS) {
                dispatch(troggleAlertStatus(type));
            } else {
                message.error(result.message);
            }
        } catch (e) {
            message.error(e.message);
        }

        switch (type) {
            case 1:
                break;
            case 2:
                setTroggleWebPushLoading(false);
                break;
            case 3:
                setTroggleTelegramPushLoading(false);
                break;
            case 4:
                setTroggleEmailPushLoading(false);
                break;
        }
    }
    const userInfo = useSelector((state: AppState) => state.userInfo)
    const [isLogin, setLogin] = useState(false)
    useEffect(() => {
     
        setLogin(isUserLogined())
    }, [userInfo.address])

    return (
        <>
            {
                !isLogin ? (
                <NoLogin
                    desc={f('noLoginDesc1')}
                    btnText={f('login')}
                />) :(
                <div className="user-setting">
                    <div className="title">{f('title')}</div>
                    <div className="language-setting">
                        <span className="language-desc">{f('languageTitle')}</span>
                        <Radio.Group onChange={handleLanguageChange} value={languageType} style={{ marginLeft: 40 }}>
                            <Radio value={0}>English</Radio>
                            <Radio value={1}>中文</Radio>
                        </Radio.Group>
                    </div>
                    <div className="setting-block" style={{ marginTop: 20 }}>
                        <div className="block-left">
                            <svg className="icon block-icon" aria-hidden="true">
                                <use xlinkHref="#icon-web-push"></use>
                            </svg>
                            <div>
                                <div className="block-title">
                                    {f('browserPushTitle')}
                                    <Switch loading={troggleWebPushLoading} checked={browserWarn === 1} size="small" onChange={handleTroggle.bind(null, 2)} style={{ marginLeft: 20 }} />
                                </div>
                                <p className="block-desc">{f('browserPushDesc')}</p>
                            </div>
                        </div>
                    </div>

                    {/*<div className="setting-block">
                            <div className="block-left">
                                <svg className="icon block-icon" aria-hidden="true">
                                    <use xlinkHref="#icon-dianhua"></use>
                                </svg>
                                <div>
                                    <p className="block-title">{f('modifyPhoneTitle')}</p>
                                    <p className="block-desc">{f('modifyPhoneDesc')}</p>
                                </div>
                            </div>
                            {
                                phone ? (<div className="modify-block">
                                            <span>{phone}</span>
                                            <Button className="modify-button" type="link" onClick={showPhoneBindModal}>{f('modify')}</Button>
                                        </div>) : 
                                (<Button className="set-button" type="primary" onClick={showPhoneBindModal}>{f('set')}</Button>)
                            }
                        </div>
                        <Divider className="divider" />
                        */}
                    <div className="setting-block">
                        <div className="block-left">
                            <svg className="icon block-icon" aria-hidden="true">
                                <use xlinkHref="#icon-email-push"></use>
                            </svg>
                            <div>
                                <div className="block-title">
                                    {f('modifyMailTitle')}
                                    {
                                        mail ? (<Switch loading={troggleEmailPushLoading} checked={emailWarn === 1} size="small" onChange={handleTroggle.bind(null, 4)} style={{ marginLeft: 20 }} />) : <></>
                                    }
                                </div>
                                <p className="block-desc">{f('modifyMailDesc')}</p>
                            </div>
                        </div>
                        {
                            mail ? (<div className="modify-block">
                                <span>{mail}</span>
                                <Button className="modify-button" type="link" onClick={showEmailBindModal}>{f('modify')}</Button>
                            </div>) :
                                (<Button className="set-button" type="primary" onClick={showEmailBindModal}>{f('set')}</Button>)
                        }
                    </div>
                    <div className="setting-block">
                        <div className="block-left">
                            <svg className="icon block-icon" aria-hidden="true">
                                <use xlinkHref="#icon-telegram-push"></use>
                            </svg>
                            <div>
                                <div className="block-title">
                                    {f('telegramTitle')}
                                    {
                                        telegramId ? (<Switch loading={troggleTelegramPushLoading} checked={telegramWarn === 1} size="small" onChange={handleTroggle.bind(null, 3)} style={{ marginLeft: 20 }} />) : <></>
                                    }
                                </div>
                                <p className="block-desc">{f('telegramDesc')}</p>
                            </div>
                        </div>
                        {
                            telegramId ? (<div className="modify-block">
                                <span>{telegramId}</span>
                                <Button className="modify-button" type="link" onClick={showTelegramBindModal}>{f('modify')}</Button>
                            </div>) :
                                (<Button className="set-button" type="primary" onClick={showTelegramBindModal}>{f('set')}</Button>)
                        }
                    </div>
                    {/*<BindInfoModal visible={phoneModalVisible} bindType={1} onCancel={hidePhoneBindModal} 
                hideBindModal={hidePhoneBindModal} />*/}
                    <BindInfoModal visible={emailModalVisible} bindType={2} onCancel={hideEmailBindModal}
                        hideBindModal={hideEmailBindModal} />
                    <BindTelegram visible={telegramModalVisible} onCancel={() => setTelegramModalVisible(false)}
                    />
                </div>
                    )
            }
        </>
    );
}

function BindInfoModal({ visible, onCancel, bindType, hideBindModal }:
    { visible: boolean, bindType: 1 | 2, onCancel: () => void, hideBindModal: () => void, }) {

    const { formatMessage } = useIntl();
    const f = (id: string) => formatMessage({ id });
    const dispatch = useDispatch();
    
    const [isSending, setSending] = useState<boolean>(false);
    
    const [countDownNumber, setCountDownNumber] = useState<number>(COUNT_DOWN);
    
    const [isBinding, setBinding] = useState<boolean>(false);
    
    const [content, setContent] = useState<string>('');
    
    const [code, setCode] = useState<string>('');
    
    const [intervalId, setIntervalId] = useState<number>(0);
    
    const [intervalWorking, setIntervalWorking] = useState<boolean>(false);

    useEffect(() => {
        return () => {
            if (intervalId !== 0) {
                clearInterval(intervalId);
            }
        }
    }, [intervalId]);

    useEffect(() => {
        
        if (!intervalWorking && intervalId !== 0) {
            clearInterval(intervalId);
            setIntervalId(0);
        }
    }, [intervalWorking, intervalId]);

    
    const resetCountDownButton = () => {
        setCountDownNumber(COUNT_DOWN);
        setIntervalWorking(false);
    }

    
    const requestCode = async () => {
        const apiClient = new ApiClient<boolean>();
        const url = (bindType === 1) ? `auth/sms/code/${encodeURIComponent(content)}` : `auth/mail/code?mail=${encodeURIComponent(content)}`;
        setSending(true);
        setIntervalWorking(true);
        try {
            const result = await apiClient.get(url);
            setSending(false);
            if (result.data) {
                
                let number = COUNT_DOWN;
                const id = window.setInterval(() => {
                    number--;
                    if (number === 0) {
                        resetCountDownButton();
                    } else {
                        setCountDownNumber(number);
                    }
                }, 1000);
                setIntervalId(id);
            } else {
                message.error(result.message);
                setIntervalWorking(false);
            }
        } catch (e) {
            setSending(false);
            setIntervalWorking(false);
            message.error((e as Error).message);
        }
    }

    
    const onContentChange = (event: ChangeEvent<HTMLInputElement>) => {
        setContent(event.target.value);
    }

    
    const onCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
        setCode(event.target.value);
    }

    const bindUserInfo = async () => {
        const url = `auth/bind/${bindType}`;
        setBinding(true);
        const apiClient = new ApiClient<string>();
        try {
            const result = await apiClient.post(url, {
                data: {
                    code,
                    typeContent: content
                }
            });
            if (result.data) {
                if (bindType === 1) {
                    dispatch(setUserPhone(result.data));
                } else {
                    dispatch(setUserEmail(result.data));
                }
                setContent('');
                setCode('');
                resetCountDownButton();
                hideBindModal();
                message.success(f('success'));
            } else {
                message.error(result.message);
            }
            setBinding(false);
        } catch (e) {
            setBinding(false);
            message.error((e as Error).message);
        }
    }

    return (
        <Modal
            className="user-setting-modal"
            visible={visible}
            footer={null}
            onCancel={onCancel}
            centered={true}
            closable={false}
            title={bindType === 1 ? f('modifyPhoneTitle') : f('modifyMailTitle')}
        >
            <div style={{ marginTop: '20px' }}>
                <Input bordered={false} placeholder={bindType === 1 ? f('inputPhone') : f('inputEmail')} className="border-bottom-input"
                    value={content} onChange={onContentChange} addonBefore={bindType === 1 ? '+86' : null} maxLength={bindType === 1 ? 11 : undefined} />
                <div className="sms-block">
                    <Input placeholder={f('code')} bordered={false} className="border-bottom-input"
                        value={code} onChange={onCodeChange} maxLength={4} />
                    <Button className="sms-button" onClick={requestCode} loading={isSending} disabled={!content || intervalWorking}>{intervalWorking ? `${countDownNumber}s` : f('getCode')}</Button>
                </div>
                <div className="buttons-block">
                    <Button type="primary" onClick={bindUserInfo} loading={isBinding} disabled={!content || !code}>{f('sureBind')}</Button>
                    <Button type="link" className="cancel-button" onClick={hideBindModal}>{f('defiHeaderCancel')}</Button>
                </div>
            </div>
        </Modal>
    );
}

function BindTelegram({ visible, onCancel }: { visible: boolean, onCancel: () => void }) {
    const { formatMessage } = useIntl();
    const f = (id: string) => formatMessage({ id });
    const dispatch = useDispatch();
    
    const [telegramId, setTelegramId] = useState('');
    const handleTelegramIdChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTelegramId(e.target.value);
    }
    
    const [isBinding, setBinding] = useState<boolean>(false);
    const bindType = 3;
    const handleBindClick = async () => {
        const url = `/auth/bind/${bindType}`;
        setBinding(true);
        const apiClient = new ApiClient<string>();
        try {
            const result = await apiClient.post(url, {
                data: {
                    typeContent: telegramId
                }
            });
            if (result.data) {
                setTelegramId('');
                dispatch(setUserTelegram(result.data));
                onCancel();
                message.success(f('success'));
            } else {
                message.error(result.message);
            }
            setBinding(false);
        } catch (e) {
            setBinding(false);
            message.error((e as Error).message);
        }
    }

    return (
        <Modal
            className="telegram-modal"
            visible={visible}
            footer={null}
            onCancel={onCancel}
            centered={true}
            closable={false}
            title={f('telegramTitle')}
            width={580}
        >
            <div>
                <div className="input-container">
                    <Input value={telegramId} onChange={handleTelegramIdChange} className="telegram-id-input" placeholder={f('telegramHolderPlaceHolder')} />
                </div>
                <div className="button-container">
                    <Button loading={isBinding} type="primary" onClick={handleBindClick}>{f('sureBind')}</Button>
                    <Button type="text" className="cancel-button" onClick={onCancel}>{f('defiHeaderCancel')}</Button>
                </div>
                <div className="content-container">
                    <p className="how-to-get-telegram-id">{f('howToGetTelegramId')}</p>
                    <div className="pics-container">
                        <p className="intro">{f('telegramIdDesc0')}</p>
                        <p className="intro copy" onClick={() => {
                            let addr = document.querySelector('#copyDefinderRobot');
                            (addr as HTMLTextAreaElement).select()   
                            document.execCommand('Copy')
                            message.success(f('copySuccess'))
                        }}>{f('telegramCopyDefinderRobot')}</p>
                        <textarea
                            id="copyDefinderRobot"
                            readOnly
                            style={{
                                position: 'absolute',
                                top: '0',
                                left: '0',
                                opacity: '0',
                                zIndex: -10,
                            }}
                            value="@DeFinder_robot"
                        />
                        <img src='/images/telegram-bind-intro3.png' className="img-telegram-bind-intro3" />
                        <p className="intro" style={{ marginTop: 15 }}>{f('telegramIdDesc1')}</p>
                        <p className="intro copy" onClick={() => {
                            let addr = document.querySelector('#copyUserinfoBot');
                            (addr as HTMLTextAreaElement).select()   
                            document.execCommand('Copy')
                            message.success(f('copySuccess'))
                        }}>{f('telegramCopy')}</p>
                        <textarea
                            id="copyUserinfoBot"
                            readOnly
                            style={{
                                position: 'absolute',
                                top: '0',
                                left: '0',
                                opacity: '0',
                                zIndex: -10,
                            }}
                            value="@userinfobot"
                        />
                        <img src='/images/telegram-bind-intro1.png' className="img-telegram-bind-intro1" />
                        <p className="intro" style={{ marginTop: 20 }}>{f('telegramIdDesc2')}</p>
                        <img src='/images/telegram-bind-intro2.png' className="img-telegram-bind-intro2" />
                    </div>
                </div>
            </div>
        </Modal>);
}