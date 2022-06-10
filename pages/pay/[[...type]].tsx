import { Breadcrumb, Button, message, Spin, Radio, RadioChangeEvent, Modal, Input } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { setPaySuccessDialogVisible, showWalletDialog } from "redux/actions/UserInfoAction";
import { AppState } from "redux/reducers";
import 'styles/pay.less'
import ApiClient from "utils/ApiClient";
import NetworkUtils from "utils/NetworkUtils";
import { isUserLogined } from "utils/storage";
import Web3 from "web3";
import ERC20ABI from 'utils/erc20.json';
import type { AbiItem } from 'web3-utils/types/index';
import type { TransactionReceipt } from 'web3-core/types/index';
import { CODE_DISCOUNT_ERROR, CODE_ORDER_IN_PAYING, CODE_UN_PAY } from "utils/ApiServerError";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import MetamaskPayDialog from "components/Member/MetamaskPayDialog";
import Trc20Dialog from "components/Member/Trc20Dialog";
import SelectNetworkModal from "components/Member/SelectNetworkModal";
import { DefaultLocale } from "utils/env";
import Global from "utils/Global";
import { PrimitiveType, FormatXMLElementFn } from "intl-messageformat";
import loadable from '@loadable/component';
const CodeInput = loadable(() => import('react-code-input'))

export interface Trc20PayInfo {
    address: string,
    addressQr: string,
    chain: string,
    amount: string
}

export interface PayConfig {
    level: string,
    effectiveTime: number,
    amount: number,
    id: number,
    isLimit: boolean
}

export interface Order {
    orderNo: string,
    rechargeAddr: string,
    actualAmount: number | null,
    discountPrice: number | null,
}

export interface Trc20DialogProps {
    visible: boolean,
    setVisible: (visible: boolean) => void,
    handleFinishPay: () => void,
    handleCancelOrder: () => void,
    payConfig: PayConfig | undefined,
    trc20PayInfo: Trc20PayInfo | undefined
}

const isQueryEmpty = (type: undefined | string[] | string) => {
    return typeof type === 'undefined' || !Array.isArray(type) || (Array.isArray(type) && type[0] === '[[...type]]');
}

const CodeInputLenght = 6;

export default function Pay() {
    const { formatMessage } = useIntl();
    const f = (id: string, value?: Record<string, PrimitiveType | FormatXMLElementFn<string, string>> | undefined) => formatMessage({ id }, value);
    const router = useRouter();
    const { query } = router;
    const { locale = DefaultLocale } = router;
    const userInfo = useSelector((state: AppState) => state.userInfo);
    const dispatch = useDispatch();
    const [buyType, setBuyType] = useState<number | undefined>(undefined);
    const [isLoading, setLoading] = useState<boolean>(true);
    
    const [isLoadError, setLoadError] = useState<boolean>(false);
    
    const [isPaySuccess, setPaySuccess] = useState<boolean>(false);
    const [payInfo, setPayInfo] = useState<PayConfig[]>([]);
    
    const [isLogin, setLogin] = useState(false)
    
    const [payWay, setPayWay] = useState<number>(0);
    
    const [metamaskDialogVisible, setMetamaskDialogVisible] = useState<boolean>(false);
    const [selectNetworkDialogVisible, setSelectNetworkDialogVisible] = useState<boolean>(false);
    const [payLoading, setPayLoading] = useState<boolean>(false);
    
    const [web3, setWeb3] = useState<undefined | Web3>(undefined);
    
    const [createOrderLoading, setCreateOrderLoading] = useState<boolean>(false);
    
    const [order, setOrder] = useState<Order | undefined>(undefined);
    
    const [trc20Info, setTrc20Info] = useState<Trc20PayInfo | undefined>(undefined);
    
    const [trc20DialogVisible, setTrc20DialogVisible] = useState<boolean>(false);
    
    const [discount, setDiscount] = useState('');
    
    const [discountErrorShow, setDiscountErrorShow] = useState(false);
    
    const [experienceCode,setExperienceCode] = useState('');

    const handleBack = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        Global.openNewTag(e, router, '/member')
    }

    
    const handlePaySuccessBack = () => {
        window.location.href = '/member';
    }

    const handleLogin = () => {
        dispatch(showWalletDialog());
    }

    const handleRefresh = () => {
        const apiClient = new ApiClient<PayConfig[]>();
        setLoading(true);
        apiClient.get('/member/list/config').then(success => {
            setLoadError(false);
    
            success.data.push({
                level: '',
                effectiveTime: 3,
                amount: 0,
                id: 0,
                isLimit: false
            });
            setPayInfo(success.data);
    
    
            const { type } = query;
            const t = type && type.length > 0 && !isQueryEmpty(type) ? type[0] : undefined;
            if (typeof t !== 'undefined') {
                let destType;
                for (let payConfig of success.data) {
                    if (payConfig.id.toString() === t && !payConfig.isLimit) {
                        destType = payConfig.id;
                        break;
                    }
                }
                if (typeof destType !== 'undefined') {
                    setBuyType(destType);
                } else {
                    setBuyType(success.data[success.data.length - 2].id);
                }
            } else {
                setBuyType(success.data[success.data.length - 2].id);
            }
        }, fail => {
            setLoadError(true);
        }).finally(() => {
            setLoading(false);
        });
    }

    useEffect(() => {
    
        setLogin(isUserLogined())
    }, [userInfo.address])

    
    function handleEnvChange(web3: Web3 | undefined, order: Order | undefined, payWay: number) {
        if (typeof web3 !== 'undefined' && typeof order !== 'undefined' && payWay === 0) {
            const apiClient = new ApiClient();
            try {
                apiClient.get('/member/order/status', {
                    params: {
                        orderNo: order!.orderNo,
                        status: -1
                    }
                });
                setMetamaskDialogVisible(false);
                setOrder(undefined);
            } catch (e) {
                message.error((e as any).message);
            }
        }
    }

    useEffect(() => {
        if (typeof window.ethereum !== 'undefined') {
    
            window.ethereum.on('chainChanged', (chainId: number) => {
                setWeb3(undefined);
                handleEnvChange(web3, order, payWay);
            });
            window.ethereum.on('accountsChanged', (account: number) => {
                if (account && isUserLogined()) {
                    handleEnvChange(web3, order, payWay);
                }
            });
        }
        return () => {
            if (typeof window.ethereum !== 'undefined') {
                window.ethereum.removeListener('chainChanged', handleEnvChange);
                window.ethereum.removeListener('accountsChanged', handleEnvChange);
            }
        }
    }, [web3, order, payWay])

    useEffect(() => {
        if (userInfo.address) {
            handleRefresh();
        }
    }, [userInfo.address]);

    
    let proTypes = <></>;
    const handlePayTypeButtonClick = (id: number) => {
        setBuyType(id);
    }
    if (payInfo.length > 0) {
        const payTypeButtons = payInfo.map((item: PayConfig, index: number) => {
            const isSelected = item.id === buyType;
            return (
            <Button 
                disabled={item.isLimit || userInfo.level === 1 || (item.id === 0 && userInfo.experienceCardStatus === 0)} 
                style={{ marginLeft: index !== 0 ? 20 : (locale === DefaultLocale ? 50 : 0) }} 
                type={isSelected ? 'primary' : 'default'} key={`payType${item.id}`} 
                onClick={handlePayTypeButtonClick.bind(null, item.id)}>
                    {item.id === 0 ? f('excard') : `${item.effectiveTime}${f('days')}`}
                </Button>)
        });
        proTypes = <>{payTypeButtons}</>
    }

    
    const handlePayWayChange = (e: RadioChangeEvent) => {
        setPayWay(e.target.value);
    }

    
    const handlePay = async () => {
        if(payInfo.find((item) => item.id === buyType)?.id === 0) {
    
            if(experienceCode && experienceCode.length === CodeInputLenght) {
                setCreateOrderLoading(true);
                const web3js = await initWeb3();
                const pay: PayConfig = payInfo.find(item => item.id === buyType)!;
                const account = web3js.eth.accounts.givenProvider.selectedAddress;
                const excardChain = '3';
                await createOrder(pay.id, account, excardChain,experienceCode);
                setCreateOrderLoading(false);
            } else {
                message.error(f('invalidExcode'));
            }
        } else {
            if (payWay === 0) {

                if (checkChainEnv()) {
                    const web3js = await initWeb3();
                    const pay: PayConfig = payInfo.find(item => item.id === buyType)!;
                    const account = web3js.eth.accounts.givenProvider.selectedAddress;
                    const netWorkId = window.ethereum.networkVersion;
                    const chain = NetworkUtils.getNetworkType(netWorkId);
                    setCreateOrderLoading(true);
                    const isCreateSuccess = await createOrder(pay.id, account, chain);
                    setCreateOrderLoading(false);
                    if (isCreateSuccess) {
                        setMetamaskDialogVisible(true);
                    }
                    /*if(typeof order === 'undefined') {
                        const chain = chainType === 0 ? '1' : '2'
                        setCreateOrderLoading(true);
                        const isCreateSuccess = await createOrder(pay.id,account,chain);
                        setCreateOrderLoading(false);
                        if(isCreateSuccess) {
                            setMetamaskDialogVisible(true);
                        }
                    } else {
                        setMetamaskDialogVisible(true);
                    }*/
                }
            } else {
                //Trc20
                showTrc20Dialog();
            }
        }
    }

    const showTrc20Dialog = async () => {
        const apiClient = new ApiClient<Trc20PayInfo>();

        const pay: PayConfig | undefined = payInfo.find(item => item.id === buyType);
        if (typeof pay === 'undefined') {
            return;
        }
        setCreateOrderLoading(true);
        const isCreateSuccess = await createOrder(pay.id, '', '0');
        setCreateOrderLoading(false);
        if (isCreateSuccess) {
            if (typeof trc20Info === 'undefined') {
                apiClient.get('/member/addr').then(success => {
                    setTrc20Info(success.data);
                    setTrc20DialogVisible(true);
                }, fail => {
                    message.error(fail.message);
                })
            } else {
                setTrc20DialogVisible(true);
            }
        }
    }

    const handleMetamaskPay = async () => {

        if (checkChainEnv()) {
            await callMetamaskPay();
        }
    }

    const handleCancelOrder = async () => {
        const apiClient = new ApiClient();
        try {
            apiClient.get('/member/order/status', {
                params: {
                    orderNo: order!.orderNo,
                    status: -1
                }
            });
            setOrder(undefined);
            if (metamaskDialogVisible) {
                setMetamaskDialogVisible(false);
            }
            if (trc20DialogVisible) {
                setTrc20DialogVisible(false);
            }
            message.success(f('success'));
        } catch (e) {
            message.error((e as any).message);
        }
        /*if(typeof order === 'undefined') {
            if(metamaskDialogVisible) {
                setMetamaskDialogVisible(false);
            }
            if(trc20DialogVisible) {
                setTrc20DialogVisible(false);
            }
        } else {
            
        }*/
    }

    const checkChainEnv = () => {
        if (typeof window.ethereum === 'undefined') {
            message.error(f('ensureWeb3Browser'));
            return false;
        }
        const netWorkId = window.ethereum.networkVersion;
        if (!NetworkUtils.isRightNetwork(netWorkId)) {
            setSelectNetworkDialogVisible(true);
            return false;
        }

        return true;
    }

    const initWeb3 = async () => {
        let web3js;
        const netWorkId = window.ethereum.networkVersion;
        if (typeof web3 === 'undefined') {
            web3js = await NetworkUtils.initWeb3(netWorkId);
            setWeb3(web3js);
        } else {
            web3js = web3;
        }
        return web3js;
    }

    const handleSelectNetwork = async (newChainType: number) => {
        //setChainType(newChainType);
        switchNetwork(NetworkUtils.getNetworkId()[newChainType]);
    }

    const switchNetwork = async (networkId: string) => {
        try {
            await NetworkUtils.switchNetwork(networkId)
            //setWeb3(undefined);
            //await callMetamaskPay(networkId);
        } catch (error) {
            if ((error as any).code === 4902) {
                //This error code indicates that the chain has not been added to MetaMask.
                try {
                    await NetworkUtils.addNetwork(networkId, NetworkUtils.getNetworkName(networkId), NetworkUtils.getRpcUrl(networkId))
                    //await callMetamaskPay(networkId);
                } catch (addError) {
                    message.error(f('addNetworkToMetamaskError'));
                }
            } else {
                message.error(f('switchNetwork'));
            }
        }
    }

    const callMetamaskPay = async () => {
        let web3js = await initWeb3();
        const account = web3js.eth.accounts.givenProvider.selectedAddress;
        if (typeof order !== 'undefined') {
            if (order.actualAmount !== 0 && order.actualAmount !== null) {
                setPayLoading(true);
                const netWorkId = window.ethereum.networkVersion;
                const usdtContractAddr = NetworkUtils.getUsdtContractAddress(netWorkId);
                const contract = new web3js.eth.Contract(
                    ERC20ABI as AbiItem[],
                    usdtContractAddr
                );
                const balance = await contract.methods.balanceOf(account).call();
                let decimal = NetworkUtils.getContractDecimalUnit(netWorkId);
                const actualAmountInWei = web3js.utils.toWei(order.actualAmount.toString(), decimal as any);
                if (web3js.utils.toBN(balance).lt(web3js.utils.toBN(actualAmountInWei))) {
                    const hint = f('notEnoughMoney').replace('{address}', Global.abbrSymbolAddress(account));
                    message.warn({
                        content: hint
                    });
                    setPayLoading(false);
                    return;
                }
                try {
                    const apiClient = new ApiClient();
                    const toAddress = order.rechargeAddr;
                    //bsc:wei,bsc testnet:mwei,rinkby eth mainnet: ether,
                    const data = contract.methods.transfer(toAddress, actualAmountInWei).encodeABI();
                    const count = await web3js.eth.getTransactionCount(account);
                    const stResult: TransactionReceipt = await web3js.eth.sendTransaction({
                        from: account,
                        nonce: web3js.utils.toHex(count) as any as number,
                        to: usdtContractAddr,
                        chain: NetworkUtils.getNetworkShortName(netWorkId),
                        "value": "0x0",
                        data: data
                    });
                    
                    setMetamaskDialogVisible(false);
                    
                    await apiClient.get('/member/order/status', {
                        params: {
                            orderNo: order.orderNo,
                            status: 1
                        }
                    });
                    await apiClient.post('/member/order/result', {
                        data: {
                            txHash: stResult.transactionHash,
                            orderNo: order.orderNo,
                            chain: NetworkUtils.getNetworkType(netWorkId),
                            from: account,
                            to: toAddress
                        }
                    })
                    router.push('/member');
                } catch (e) {
                    //message.error((e as any).message);
                } finally {
                    setPayLoading(false);
                }
            } else {
                try {
                    setPayLoading(true);
                    const apiClient = new ApiClient();
                    const netWorkId = window.ethereum.networkVersion;
                    
                    await apiClient.post('/member/order/result', {
                        data: {
                            txHash: '',
                            orderNo: order.orderNo,
                            chain: NetworkUtils.getNetworkType(netWorkId),
                            from: account,
                            to: order.rechargeAddr
                        }
                    })
                    await apiClient.get('/member/notice/recharge', { params: { isNotice: 1 } });
                    dispatch(setPaySuccessDialogVisible(true));
                    router.push('/member');
                } catch (e) {
                    message.error((e as any).message);
                }
            }
        }
    }

    const createOrder = async (id: number, from: string, chain: string,experienceCode?: string) => {
        const apiClient = new ApiClient<Order>();
        let isSuccess = false;
        try {
            const result = await apiClient.post('/member/submit/order', {
                data: {
                    levelId: id,
                    from: from,
                    chain: chain,
                    code: discount,
                    experienceCode
                }
            });
            const payOrder = result.data;
            setOrder(payOrder);
            isSuccess = true;
            
            if(typeof experienceCode !== 'undefined') {
                const apiClient = new ApiClient();
            
                await apiClient.post('/member/order/result', {
                    data: {
                        txHash: '',
                        orderNo: payOrder.orderNo,
                        chain: chain,
                        from: from,
                        to: payOrder.rechargeAddr
                    }
                })
                await apiClient.get('/member/notice/recharge', { params: { isNotice: 1 } });
                setCreateOrderLoading(false);
                dispatch(setPaySuccessDialogVisible(true));
                router.push('/member');
            }
        } catch (e) {
            isSuccess = false;
            
            if ((e as any).code === CODE_ORDER_IN_PAYING) {
                Modal.confirm({
                    title: f('onGoingOrder'),
                    icon: <ExclamationCircleOutlined />,
                    content: f('gotoMember'),
                    onOk() {
                        router.push('/member');
                    }
                });
            } else if ((e as any).code === CODE_UN_PAY) {
                Modal.confirm({
                    title: f('unpayOrder'),
                    icon: <ExclamationCircleOutlined />,
                    content: f('gotoMember'),
                    onOk() {
                        router.push('/member');
                    }
                });
            } else if ((e as any).code === CODE_DISCOUNT_ERROR) {
                setDiscountErrorShow(true);
            } else if((e as any).code === 'experience.card.invalid.error') {
                message.error(f('invalidExcode'));
            } else if((e as any).code === 'experience.card.limit.error') {
                message.error(f('usedExcode'));
            } else {
                message.error((e as any).message);        
            }
        }
        return isSuccess;
    }

    const handleTrc20FinishPay = async () => {
        if (typeof order !== 'undefined') {
            if (order.actualAmount !== null && order.actualAmount === 0) {
                try {
                    setPayLoading(true);
                    const apiClient = new ApiClient();
                    const netWorkId = window.ethereum.networkVersion;
                    let web3js = await initWeb3();
                    const account = web3js.eth.accounts.givenProvider.selectedAddress;
                    
                    await apiClient.post('/member/order/result', {
                        data: {
                            txHash: '',
                            orderNo: order.orderNo,
                            chain: NetworkUtils.getNetworkType(netWorkId),
                            from: account,
                            to: order.rechargeAddr
                        }
                    })
                    await apiClient.get('/member/notice/recharge', { params: { isNotice: 1 } });
                    dispatch(setPaySuccessDialogVisible(true));
                } catch (e) {
                    message.error((e as any).message);
                }
            } else {
                const apiClient = new ApiClient();
                apiClient.get('/member/order/status', {
                    params: {
                        orderNo: order.orderNo,
                        status: 1
                    }
                });
            }
        }
        router.push('/member');
    }

    const handleDiscountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDiscount(event.target.value);
        if (discountErrorShow) {
            setDiscountErrorShow(false);
        }
    }

    const handleExperienceCodeChange = (code : string) => {
        setExperienceCode(code);
    }

    const infoColumnTitle = locale === DefaultLocale ? 'info-column-title' : 'info-column-title-zh';

    return (
        <div className="pay">
            <div className="defi-breadcrumb" style={{ borderBottom: 'none', marginLeft: 18 }}>
                <Breadcrumb separator=">">
                    <Breadcrumb.Item key='member' onClick={handleBack}>{f('myMember')}</Breadcrumb.Item>
                    <Breadcrumb.Item key='pay'>{f('buy')}</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            {
                !isLogin ?
                    (<div className="no-login">
                        <span>{f('buyPro')}</span>
                        <span className="login-button" onClick={handleLogin}>{f('loginRightNow')}</span>
                    </div>) :
                    (isLoading ?
                        (<div className="loading-content">
                            <Spin size="default" />
                        </div>) :
                        (isLoadError ?
                            <LoadInfoError handleRefresh={handleRefresh} /> :
                            <div className="pay-content">
                                <div className="info">
                                    <div className="info-column" style={{flex: 1.5}}>
                                        <div className="pro-type">
                                            <span className={infoColumnTitle}>{f('accountType')}</span>{f(buyType == 1 ? 'proTry' : 'pro')}
                                        </div>
                                        <div className="pro-type-buttons">
                                            {proTypes}
                                        </div>
                                        <div style={{ marginTop: 10 }} className="defi-color-reduce">
                                            <span className={infoColumnTitle}></span>
                                            {f('buyOnceDesc', { day: payInfo.length > 0 ? payInfo[0].effectiveTime : 5 })}
                                        </div>

                                        {
                                            
                                            payInfo.find((item) => item.id === buyType)?.id === 0 ? 
                                            (
                                                <>
                                                    <div className="invite-code">
                                                        <span className={infoColumnTitle}>{f('inviteCode')}</span>
                                                        <CodeInput 
                                                        fields={CodeInputLenght} 
                                                        name="code-input" 
                                                        type="text" 
                                                        inputMode="latin" 
                                                        value={experienceCode}
                                                        onChange={handleExperienceCodeChange}
                                                        inputStyle={{
                                                            width: 40,
                                                            height: 40,
                                                            backgroundColor: '#737E82',
                                                            marginRight: 10,
                                                            border: 'none',
                                                            borderRadius: 5,
                                                            fontSize: 16,
                                                            textAlign: 'center'
                                                        }}/>
                                                    </div>
                                                    <div className="invite-code-note" style={{marginLeft: locale === DefaultLocale ? 155 : 100}}>
                                                        {f('inviteCodeHint')}
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="pay-money">
                                                        <span className={infoColumnTitle}>{f('orderMoney')}</span>
                                                        <span className="money-amount">{payInfo.find((item) => item.id === buyType)?.amount}</span>USDT
                                                    </div>
                                                    <div className="pay-way">
                                                        <span className={infoColumnTitle}>{f('payMethod')}</span>
                                                        <Radio.Group onChange={handlePayWayChange} value={payWay}>
                                                            <Radio value={0}>
                                                                <svg
                                                                    className="icon"
                                                                    aria-hidden="true"
                                                                    style={{
                                                                        width: '17px',
                                                                        height: '17px',
                                                                        marginLeft: '8px',
                                                                        marginRight: '6px',
                                                                        cursor: 'pointer',
                                                                        verticalAlign: 'middle'
                                                                    }}
                                                                >
                                                                    <use xlinkHref="#icon-metamask-fox"></use>
                                                                </svg>Metamask
                                                            </Radio>
                                                            <Radio value={1}>{f('usdtRecharge')}</Radio>
                                                        </Radio.Group>
                                                    </div>
                                                    <div className="network-note" style={
                                                        {
                                                            marginLeft: locale === DefaultLocale ? 150 : 100,
                                                            marginRight: 30
                                                        }
                                                    }>
                                                        {payWay === 0 ? f('metamaskNote') : f('trc20Node')}
                                                    </div>
                                                    <div className="pay-discount">
                                                        <span className={infoColumnTitle}>
                                                            {f('payDiscount')}
                                                        </span>
                                                        <Input
                                                            className="discount-input"
                                                            placeholder={f('payDiscountHint')}
                                                            value={discount}
                                                            onChange={handleDiscountChange}
                                                        />
                                                        <div className="pay-discount-error"
                                                            style={{
                                                                display: discountErrorShow ? 'block' : 'none',
                                                                marginLeft: locale === DefaultLocale ? 150 : 100
                                                            }}>
                                                            {f('payDiscountError')}
                                                        </div>
                                                    </div>
                                                </>
                                            )
                                        }

                                        <Button disabled={userInfo.level === 1} loading={createOrderLoading} className="sure" type="primary" onClick={handlePay}
                                            style={{
                                                marginLeft: locale === DefaultLocale ? 150 : 100
                                            }}
                                        >
                                            {f('sure')}
                                        </Button>
                                    </div>
                                    <div className="center-border"></div>
                                    <div className="pro-column">
                                        <div className="center-text">VIP&nbsp;PRO</div>
                                    </div>
                                </div>
                            </div>
                        )
                    )
            }
            <MetamaskPayDialog
                actualAmount={typeof order !== 'undefined' ? order.actualAmount : null}
                discountPrice={typeof order !== 'undefined' ? order.discountPrice : null}
                visible={metamaskDialogVisible}
                setVisible={setMetamaskDialogVisible}
                payConfig={payInfo.find((item) => item.id === buyType)}
                handleMetamaskPay={handleMetamaskPay}
                handleCancelOrder={handleCancelOrder}
                payLoading={payLoading}
            />
            <SelectNetworkModal
                visible={selectNetworkDialogVisible}
                setVisible={setSelectNetworkDialogVisible}
                handleOk={handleSelectNetwork}
            />
            <Trc20Dialog
                actualAmount={typeof order !== 'undefined' ? order.actualAmount : null}
                discountPrice={typeof order !== 'undefined' ? order.discountPrice : null}
                trc20PayInfo={trc20Info}
                visible={trc20DialogVisible}
                setVisible={setTrc20DialogVisible}
                payConfig={payInfo.find((item) => item.id === buyType)}
                handleCancelOrder={handleCancelOrder}
                handleFinishPay={handleTrc20FinishPay}
            />
        </div>
    );
}

function LoadInfoError({ handleRefresh }: { handleRefresh: () => void }) {
    const { formatMessage } = useIntl();
    const f = (id: string) => formatMessage({ id });
    return (
        <div className="err-content">
            <div className="err-title">
                <img src="/images/ic-payinfo-neterr.svg" />
                {f('getPayInfoFail')}
            </div>
            <Button type="primary" className="retry-button" onClick={handleRefresh}>{f('retry')}</Button>
        </div>
    );
}