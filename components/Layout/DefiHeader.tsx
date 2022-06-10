import { getUserInfo, showWalletDialog, hideWalletDialog, setMetamaskConnectStatus, connectMetamaskWallet, requestLoginOut, changeAddress, changeUserTeachState, handleWalletConnect, setConnectType, getUserInviteDetailInfo } from 'redux/actions/UserInfoAction';
import storage, { isUserLogined, KEY_CONNECT_WALLET_TYPE } from 'utils/storage';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button, Spin, Menu, Dropdown, Carousel, Popover, Image } from 'antd';
import { LoadingOutlined, LeftOutlined, RightOutlined, CloseOutlined, CheckCircleFilled, DownOutlined } from '@ant-design/icons';
import React, { useState, useEffect, useMemo } from 'react';
import { trackAction, LAYOUT_TOP } from 'utils/analyse/YMAnalyse';
import { useIntl } from 'react-intl';
import { AppState } from 'redux/reducers';
import type { MenuInfo } from 'rc-menu/lib/interface';
import { useRouter } from 'next/router';
import { startWorker, stopWorker } from 'utils/webWorker/worker';
import { UserInfoState } from 'redux/types/UserInfoTypes';
import ApiClient from 'utils/ApiClient';
import Link from 'next/link';
import { DefaultLocale } from 'utils/env';
import {
    ExclamationCircleOutlined,
    GiftOutlined,
    CopyOutlined,
    TwitterOutlined,
    ArrowRightOutlined
} from '@ant-design/icons'
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import EllipsisMenu from './EllipsisMenu';
import InviteModal from 'components/InviteModal';
import ExcardsModal from 'components/ExcardsModal';

const handleAddress = (address: string) => {
    if (address && address.length > 10) {
        return `${address.substring(0, 6)}...${address.substring(
            address.length - 4,
            address.length
        )}`
    } else {
        return address
    }
}

function ConnectWallet({ visible, onCancel }: { visible: boolean, onCancel: (e: React.MouseEvent<HTMLElement>) => void }) {
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id })
    const dispatch = useDispatch()
    const userInfo = useSelector((state: AppState) => state.userInfo)
    const { address, connectWalletPageState, connectType } = userInfo;
    const [connector, setConnector] = useState<WalletConnect | null>(null);

    useEffect(() => {
        const connectType = localStorage.getItem(KEY_CONNECT_WALLET_TYPE);
        if (connectType) {
            dispatch(setConnectType(connectType));
        }
    }, []);

    useEffect(() => {
        if (address && connectWalletPageState !== 'INIT') {
            setMetamaskConnectStatus('INIT')
        }
    }, [address, connectWalletPageState])

    useEffect(() => {
        return () => {
            if (connector !== null && connector.connected) {
                connector.killSession();
            }
        }
    }, [connector]);

    const connectMetamask = async () => {
        trackAction(LAYOUT_TOP.category, LAYOUT_TOP.actions.login)
        dispatch(connectMetamaskWallet(userInfo.inviteCode));
    }

    const handleWalletConnectClick = async () => {
        let conn: WalletConnect = new WalletConnect({
            bridge: "https://bridge.walletconnect.org", // Required
            qrcodeModal: QRCodeModal,
        });
        setConnector(conn);

        if (!conn.connected) {
            // create new session
            await conn.createSession();
        } else {
            await conn.killSession();
            await conn.createSession();
        }

        // Subscribe to connection events
        conn.on("connect", async (error, payload) => {
            if (error) {
                dispatch(setMetamaskConnectStatus('CONNECT_FAIL'));
                console.log(error);
                return;
            }
            // Get provided accounts and chainId
            const { accounts } = payload.params[0];
            if (accounts && accounts.length > 0) {
                const account = accounts[0];
                dispatch(handleWalletConnect(account, conn, userInfo.inviteCode));
            } else {
                dispatch(setMetamaskConnectStatus('CONNECT_FAIL'));
            }
        });
    }

    const unConnect = () => {
        dispatch(requestLoginOut())
    }

    const installMetamaskPlugin = () => {
        window.open('https://metamask.io/download.html', '_blank')
    }

    const backToInitState = () => {
        dispatch(setMetamaskConnectStatus('INIT'));
    }

    const handleAddressMemo = useMemo(() => handleAddress(address), [address])

    let content = <></>

    switch (connectWalletPageState) {
        case 'INIT':
            const rightMetamaskPart = address && connectType == '0' ? (
                <div className="address-status">
                    <span className="wallet-address">{handleAddressMemo}</span>
                </div>
            ) : (
                <Button
                    type="primary"
                    className="connect-button"
                    onClick={connectMetamask}
                    disabled={!!address && connectType == '1'}
                >
                    {f('connect')}
                </Button>
            )

            const rightConnectWalletPart = address && connectType == '1' ? (
                <div className="address-status">
                    <span className="wallet-address">{handleAddressMemo}</span>
                </div>
            ) : (
                <Button
                    type="primary"
                    className="connect-button"
                    onClick={handleWalletConnectClick}
                    disabled={!!address && connectType == '0'}
                >
                    {f('connect')}
                </Button>
            )

            const unConnectButton = address ? (
                <div className="loading">
                    <Button type="default" onClick={unConnect}>
                        {f('disconnect')}
                    </Button>
                </div>
            ) : null
            content = (
                <>
                    <p className="dialog-title" style={{ marginBottom: '10px' }}>{f('connectWallet')}</p>
                    <p className="dialog-title2">{f('connectDesc')}</p>
                    <div className="wallet-column">
                        <div className="wallet-logo" />
                        <span className="wallet-title">Metamask</span>
                        {rightMetamaskPart}
                    </div>
                    {/*<div className="wallet-column" style={{marginTop: 20}}>
                        <div className="wallet-connect-logo" />
                        <span className="wallet-title">WalletConnect</span>
                        {rightConnectWalletPart}
                    </div>*/}
                    {unConnectButton}
                </>
            )
            break
        case 'CONNECTING':
            const antIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />
            content = (
                <>
                    <div className="back-img" onClick={backToInitState}>
                        <LeftOutlined style={{
                            fontSize: 25,
                            color: '#dbdbdb'
                        }} />
                    </div>
                    <p className="dialog_title1">{f('connecting')}</p>
                    <p className="dialog_title2">
                        {f('connectingDesc')}
                    </p>
                    <div className="loading">
                        <Spin indicator={antIcon} />
                    </div>
                </>
            )
            break
        case 'CONNECT_FAIL':
            content = (
                <>
                    <div className="back-img" onClick={backToInitState}>
                        <LeftOutlined style={{
                            fontSize: 25,
                            color: '#dbdbdb'
                        }} />
                    </div>
                    <p className="dialog_title1">{f('connectFail')}</p>
                    <p className="dialog_title2">
                        {f('connectFailDesc')}
                    </p>
                    <div className="loading">
                        <Button onClick={connectType === '0' ? connectMetamask : handleWalletConnectClick} type="primary">
                            {f('retry')}
                        </Button>
                    </div>
                </>
            )
            break
        case 'CONNECT_NO_PLUGIN':
            content = (
                <>
                    <div className="back-img" onClick={backToInitState}>
                        <LeftOutlined style={{
                            fontSize: 25,
                            color: '#dbdbdb'
                        }} />
                    </div>
                    <p className="dialog_title1">{f('connectNoPlugin')}</p>
                    <p className="dialog_title2" style={{ textAlign: 'center', marginBottom: '2px' }}>{f('connectNoPluginDesc1')}</p>
                    <p className="dialog_title3">{f('connectNoPluginDesc2')}</p>
                    <div className="loading">
                        <Button onClick={installMetamaskPlugin} type="primary">
                            {f('goDownload')}
                        </Button>
                    </div>
                </>
            )
            break
    }

    const closeButton = (
        <CloseOutlined style={{
            fontSize: 25,
            color: '#dbdbdb'
        }} />
    )
    return (
        <Modal
            className="wallet-dialog"
            visible={visible}
            footer={null}
            onCancel={onCancel}
            centered={true}
            closeIcon={closeButton}
            zIndex={1000}
        >
            {content}
        </Modal>
    )
}

function HeaderRight({ address, level }: { address: string, level: number }) {
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id })
    const router = useRouter();
    const { locale = DefaultLocale } = router;
    const dispatch = useDispatch()
    const userInfo = useSelector((state: AppState) => state.userInfo)
    const {inviteDetail} = userInfo;
    const [isBeginGuideOpen, setBeginGuideOpen] = useState(false);
    const [userGuideTipsShow, setUserGuideTipsShow] = useState(false);
    useEffect(() => {
        //let timeoutId = 0;
        if (userInfo.address) {
            if (userInfo.noviceBootStatus === 0) {
                setBeginGuideOpen(true)
                // setUserGuideTipsShow(true);
                // timeoutId = window.setTimeout(() => {
                //     setUserGuideTipsShow(false);
                //     timeoutId = 0;
                // },5000)
            }
        }
        /*return () => {
            if (timeoutId !== 0) {
                clearTimeout(timeoutId);
                timeoutId = 0;
            }
        }*/
    }, [userInfo.address,userInfo.noviceBootStatus]);

    const openWallet = () => {
        if (typeof navigator !== 'undefined' && navigator.cookieEnabled) {
            dispatch(showWalletDialog());
        } else {
            Modal.warning({
                content: f('enableCookie')
            });
        }
    }

    const onCancel = () => {
        dispatch(hideWalletDialog());
        dispatch(setMetamaskConnectStatus('INIT'));
    }

    let userCenter;
    if (address) {
        const onMenuItemClick = (info: MenuInfo) => {
            switch (info.key) {
                case 'warning-setting':
                    router.push('/user-setting');
                    break;
                case "pro-setting":
                    router.push('/member');
                    break;
                case "learn-to-use":
                    setBeginGuideOpen(true);
                    break;
                case "my-invite":
                    router.push('/my-invite');
                    break;    
            }
        }
        const dropDown = (
            <Menu onClick={onMenuItemClick}>
                <Menu.Item key="pro-setting">
                    <div className="menu-set-warning">
                        <svg className="icon" aria-hidden="true" style={{ width: '16px', height: '16px', marginRight: '16px' }}>
                            <use xlinkHref="#icon-menu-member"></use>
                        </svg>
                        {f('myMember')}
                    </div>
                </Menu.Item>
                <Menu.Item key="my-invite">
                    <div className="menu-set-warning">
                        <svg className="icon" aria-hidden="true" style={{ width: '16px', height: '16px', marginRight: '16px' }}>
                            <use xlinkHref="#icon-invite"></use>
                        </svg>
                        {f('myInvite')}
                    </div>
                </Menu.Item>
                <Menu.Item key="warning-setting">
                    <div className="menu-set-warning">
                        <svg className="icon" aria-hidden="true" style={{ width: '16px', height: '16px', marginRight: '16px' }}>
                            <use xlinkHref="#icon-set-warning"></use>
                        </svg>
                        {f('warningSetting')}</div>
                </Menu.Item>
                <Menu.Item key="learn-to-use">
                    <div className="menu-set-warning">
                        <svg className="icon" aria-hidden="true" style={{ width: '16px', height: '16px', marginRight: '16px' }}>
                            <use xlinkHref="#icon-guide"></use>
                        </svg>
                        {f('teachNewUser')}</div>
                </Menu.Item>
            </Menu>);
        const userLogo = userInfo.level === 1 ?
            (<div style={{ position: 'relative' }}>
                <img src='/images/user_vip.svg' style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 15,
                    width: 18,
                    height: 18
                }} />
                <svg className="icon user-logo" aria-hidden="true" style={{ marginTop: 10 }}>
                    <use xlinkHref="#icon-user"></use>
                </svg>
            </div>) :
            (<svg className="icon user-logo" aria-hidden="true">
                <use xlinkHref="#icon-user"></use>
            </svg>);
        userCenter = (
            <>
                <span className="user-address" onClick={openWallet}>{handleAddress(address)}</span>
                <Dropdown overlay={dropDown} placement="bottomCenter"
                    overlayClassName="set-warning-overlay" arrow>
                    <Popover
                        content={f('viewGuideAnyTime')}
                        visible={false}
                    >{userLogo}</Popover>
                </Dropdown>
                <div className='user-guide-tip' style={{ display: userGuideTipsShow ? 'block' : 'none' }}>
                    <div className='user-guide-arrow'>

                    </div>
                    <div className='user-guide-tip-content'>
                        {f('viewGuideAnyTime')}
                    </div>
                </div>
            </>
        );
    } else {
        userCenter = (
            <div onClick={openWallet}
                className="open-wallet"
            >
                <div className="wallet-icon-div">
                    <svg className="icon wallet-icon" aria-hidden="true">
                        <use xlinkHref="#icon-wallet"></use>
                    </svg>
                </div>
                <span>{f('connectWallet')}</span>
            </div>);
    }

    const handleGoProClick = () => {
        const url = process.env.SERVICES_ENV !== 'production' ? 'http://192.168.1.114:3001/?tab=price' : 'https://definder.info/?tab=price';
        window.open(url, '_blank');
    }

    const SlickButtonFix = ({ currentSlide, slideCount, children, ...props }: any) => (
        <span {...props}>{children}</span>
    );

    const [guideSectionOpen, setGuideSectionOpen] = useState(false);
    const [guideFinishOpen, setGuideFinishOpen] = useState(false);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [earnUsdtOpen,setEarnUsdtOpen] = useState(false);
    const [excardOpen,setExcardOpen] = useState(false);

    let timeout
    const [timer, setTimer] = useState<number | null>(null)
    const handleChangeUserBeginGuide = () => {
        if (timer) {
            clearTimeout(timer)
            timeout = null
            setTimer(null)
        }
        setBeginGuideOpen(false);
        setUserGuideTipsShow(true);
        timeout = window.setTimeout(() => {
            setUserGuideTipsShow(false);
        }, 5000)
        setTimer(timeout)
        changeUserGuideState();
    }

    const changeUserGuideState = () => {
        if (userInfo.noviceBootStatus === 0 || !userInfo.noviceBootStatus) {
            const apiClient = new ApiClient();
            apiClient.post('/auth/updateNoviceBootStatus', {
                data: {
                    noviceBootStatus: 1
                }
            }).then(success => {
                dispatch(changeUserTeachState(1));
            });
        }
    }

    const beginGuideUrl = '/images/teach';
    const [beginGuideSection, setBeginGuideSection] = useState(1);
    const [beginGuideImgSrc, setBeginGuideImgSrc] = useState<string[]>([]);
    const [finishGuideTitle, setFinishGuideTitle] = useState<string>(f('marketPage'));
    const handleViewGuides = (section: number) => {
        setGuideSectionOpen(true);
        setBeginGuideOpen(false);
        setBeginGuideSection(section);
        const imgSrcs = [];
        if (section === 1) {
            for (let i = 0; i < 11; i++) {
                imgSrcs.push(`${beginGuideUrl}/${locale}/token/token_${i + 1}.png`);
            }
            setFinishGuideTitle(f('marketPage'));
        } else if (section === 2) {
            for (let i = 0; i < 8; i++) {
                imgSrcs.push(`${beginGuideUrl}/${locale}/address/address_${i + 1}.png`);
            }
            setFinishGuideTitle(f('addressAnalyse'));
        } else {
            for (let i = 0; i < 9; i++) {
                imgSrcs.push(`${beginGuideUrl}/${locale}/sm/sm_${i + 1}.png`);
            }
            setFinishGuideTitle(f('smPage'));
        }

        setBeginGuideImgSrc(imgSrcs);
    }

    const contentStyle = {
        height: '675px',
        width: '100%',
        color: '#fff',
        lineHeight: '675px',
        textAlign: 'center' as const,
        borderRadius: 12,
    };

    const carousel = beginGuideImgSrc.map((src: string, index: number) => {
        return (
            <div key={src}>
                <Image preview={false} style={contentStyle} src={src} placeholder={
                    <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
                    </div>
                } />
            </div>
        );
    });

    const handleExitBeginGuideSection = () => {
        Modal.confirm({
            content: f('sureToExit'),
            icon: <ExclamationCircleOutlined />,
            onOk: () => {
                if (timer) {
                    clearTimeout(timer)
                    timeout = null
                    setTimer(null)
                }
                setGuideSectionOpen(false);
                setUserGuideTipsShow(true);
                timeout = window.setTimeout(() => {
                    setUserGuideTipsShow(false);
                }, 5000)
                setTimer(timeout)
                changeUserGuideState();
            }
        });
    }

    const handleOtherTutorial = () => {
        setGuideFinishOpen(false);
        setBeginGuideOpen(true);
        if (beginGuideSection === 1) {
            setBeginGuideSection(2);
        } else if (beginGuideSection === 2) {
            setBeginGuideSection(3);
        } else {
            setBeginGuideSection(1);
        }
    }

    const handleFinishGuide = () => {
        setGuideFinishOpen(false);
        changeUserGuideState();
    }

    const handleEarnUsdtButtonClick = () => {
        if(userInfo.address) {
            if(typeof inviteDetail === 'undefined') {
                dispatch(getUserInviteDetailInfo());
            }
            setEarnUsdtOpen(true);
        } else {
            dispatch(showWalletDialog());
        }
    }

    const handleCancelEarnUsdtDialog = () => {
        setEarnUsdtOpen(false);
    }

    const handleViewExcardClick = () => {
        setExcardOpen(true);
    }

    const handleCancelViewExcardDialog = () => {
        setExcardOpen(false);
    }

    return (
        <>
            <Button className='earn-usdt-container' icon={<GiftOutlined />} onClick={handleEarnUsdtButtonClick}>
                {f('earnUsdt')}
            </Button>
            {userInfo.level === 1 ? <></> : <Button onClick={handleGoProClick} type='primary' style={{ marginRight: 20 }}>Pro</Button>}
            {userCenter}
            {userInfo.address ? <EllipsisMenu /> : null}
            <ConnectWallet
                visible={userInfo.showWalletDialog}
                onCancel={onCancel}
            />
            <Modal
                closable={false}
                visible={isBeginGuideOpen}
                footer={null}
                className="welcome-user-guide-dialog"
                centered={true}
                width={500}
            >
                <div>
                    <p className='guide-p1'>{f('userGuideTitle1')}</p>
                    <p className='guide-p2'>{f('userGuideTitle2')}</p>
                    <p className='guide-p3'>{f('userGuideTitle3')}</p>
                    <div className='guide-buttons'>
                        <Button
                            onClick={handleViewGuides.bind(null, 1)}
                            className={beginGuideSection === 1 ? 'button-1' : 'button-1 button-gray'}
                            type={beginGuideSection === 1 ? 'primary' : 'default'}>
                            {f('marketPage')}
                        </Button>
                        <Button
                            onClick={handleViewGuides.bind(null, 2)}
                            className={beginGuideSection === 2 ? 'button-1' : 'button-1 button-gray'}
                            type={beginGuideSection === 2 ? 'primary' : 'default'}>
                            {f('addressAnalyse')}
                        </Button>
                        <Button
                            onClick={handleViewGuides.bind(null, 3)}
                            className={beginGuideSection === 3 ? 'button-1' : 'button-1 button-gray'}
                            type={beginGuideSection === 3 ? 'primary' : 'default'}
                        >Smart Money</Button>
                        <Button onClick={handleChangeUserBeginGuide} className="button-4" type='text'>{f('seeItLater')}</Button>
                    </div>
                </div>
            </Modal>
            <Modal
                closable={true}
                closeIcon={<CloseOutlined style={{ color: '#fff', fontSize: 20 }} />}
                footer={null}
                visible={guideSectionOpen}
                className="teach-user-dialog"
                centered
                width={1200}
                onCancel={handleExitBeginGuideSection}
                maskStyle={{
                    backgroundColor: 'rgba(0,0,0,0.6)'
                }}
            >
                <Carousel
                    arrows={true}
                    dotPosition={'bottom'}
                    prevArrow={<SlickButtonFix>{showLeftArrow ? <LeftOutlined /> : ''}</SlickButtonFix>}
                    nextArrow={<SlickButtonFix><RightOutlined /></SlickButtonFix>}
                    beforeChange={(from: number, to: number) => {
                        if (from === beginGuideImgSrc.length - 1 && to === 0) {
                            setGuideSectionOpen(false);
                            setGuideFinishOpen(true);
                        }
                        if (to === 0) {
                            setShowLeftArrow(false);
                        } else {
                            setShowLeftArrow(true);
                        }
                    }}

                >
                    {carousel}
                </Carousel>
            </Modal>
            <Modal
                closable={false}
                footer={null}
                visible={guideFinishOpen}
                className="guide-finish-dialog"
                width={600}
            >
                <div>
                    <p className='title1'>{f('finishGuideTitle1Part1')}
                        <span>{finishGuideTitle}</span>
                        {f('finishGuideTitle1Part2')}
                    </p>
                    <img src='/images/figner.png' className='figner-image' />
                    <p className='title2'>{f('finishGuideTitle2')}</p>
                    <div className='guide-buttons'>
                        <Button type='primary' className='learned-button' onClick={handleFinishGuide}>{f('gotIt')}</Button>
                        <Button className='other-lesson-button' onClick={handleOtherTutorial}>{f('otherTutorial')}</Button>
                    </div>
                </div>
            </Modal>
            <InviteModal 
                visible={earnUsdtOpen}
                setVisible={handleCancelEarnUsdtDialog}
                userInfo={userInfo}
                handleViewExcardClick={handleViewExcardClick}
            />
            <ExcardsModal 
                visible={excardOpen}
                setVisible={handleCancelViewExcardDialog}
                userInfo={userInfo}
            />
        </>
    )
}

function DataSource() {
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id })
    const data = [
        {
            name: 'Ethereum',
            icon: 'ETH',
            choose: true,
            soon: false
        },
        {
            name: 'BSC',
            icon: 'BSC',
            choose: false,
            soon: true
        },
        {
            name: 'Polygon',
            icon: 'polygon',
            choose: false,
            soon: true
        }
    ]

    const dropDown = (
        <Menu>
            {data.map((item) => {
                return (
                    <Menu.Item key={`source-${item.name}`} disabled={!item.choose}>
                        <div className='data-source-item'>
                            <span>
                                <svg className="icon" aria-hidden="true">
                                    <use xlinkHref={`#icon-${item.icon}`}></use>
                                </svg>
                                {item.name}
                                {item.soon ? <span className='soon'>soon</span> : null}
                            </span>
                            {item.choose ? <CheckCircleFilled style={{ color: '#4f52af', fontSize: 16 }} /> : null}
                        </div>
                    </Menu.Item>
                )
            })}
            <Menu.Item key="source-more" disabled>
                <div className='data-source-item'>
                    {f('more')}
                </div>
            </Menu.Item>
        </Menu>);
    return (
        <div className='data-source-box'>
            <Dropdown overlay={dropDown} placement="bottomCenter"
                overlayClassName="data-source-list" arrow>
                <div className='choose-box'>
                    <span>
                        <svg className="icon" aria-hidden="true">
                            <use xlinkHref='#icon-ETH'></use>
                        </svg>
                        Ethereum
                    </span>
                    <DownOutlined />
                </div>
            </Dropdown>
        </div>
    )
}

interface DefiHeaderProps {
    children: React.ReactNode
}

export default function DefiHeader({ children }: DefiHeaderProps) {
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id })
    const userInfo: UserInfoState = useSelector((state: AppState) => state.userInfo)
    const dispatch = useDispatch()
    const [isLogin, setLogin] = useState(false)

    useEffect(() => {
        setLogin(isUserLogined())
        if (isUserLogined()) {
            dispatch(getUserInfo())
        }
    }, [userInfo.address])

    useEffect(() => {
        if (userInfo.address) {
            stopWorker();
            if (userInfo.browserWarn !== 0) {
                startWorker(userInfo.languageType === 0 ? 'en' : 'zh');
            }

            const apiClient = new ApiClient();
            apiClient.post('/auth/first/login/daily');
        }
    }, [userInfo.address, userInfo.browserWarn, userInfo.languageType]);

    if (typeof window != 'undefined') {
        useEffect(() => {

            function accountChange(accounts: string[]) {
                  
                if (typeof navigator !== 'undefined' && navigator.cookieEnabled) {
                      
                    /*if(!document.hidden) {
                        if (accounts.length > 0) {
                            if (isUserLogined()) {
                                dispatch(changeAddress(accounts[0]));
                            }
                        } else {
                              
                            if (isUserLogined()) {
                                dispatch(requestLoginOut());
                            }
                        }
                    }*/
                } else {
                    Modal.warning({
                        content: f('enableCookie')
                    });
                }
            }

            if (window.ethereum) {
                  
                window.ethereum.on('accountsChanged', accountChange);
            }
            return () => {
                if (window.ethereum) {
                    window.ethereum.removeListener('accountsChanged', accountChange);
                }
            }
        }, [window.ethereum]);
    }

    const headerRight = (
        <HeaderRight address={isLogin ? userInfo.address : ''} level={userInfo.level} />
    )

    return (
        <>
            <div className="defi-header">
                <div style={{display: 'flex',alignItems: 'center'}}>
                    <Link href="/">
                        <div id="logo">
                            <img className="defi-logo" src="/images/definder-logo.svg" alt="" />
                        </div>
                    </Link>
                    <div className="search-box">{children}</div>
                </div>
                <div className="defi-right-btns">
                    {headerRight}
                </div>
            </div>
        </>
    )
}
