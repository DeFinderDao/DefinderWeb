import { Button, message, Table, Modal } from "antd";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import 'styles/member.less'
import moment from "moment";
import ApiClient from "utils/ApiClient";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "redux/reducers";
import { isUserLogined } from "utils/storage";
import { setPaySuccessDialogVisible, showWalletDialog } from "redux/actions/UserInfoAction";
import { useRouter } from "next/router";
import MetamaskPayDialog from "components/Member/MetamaskPayDialog";
import Trc20Dialog from "components/Member/Trc20Dialog";
import { PayConfig, Trc20PayInfo } from "./pay/[[...type]]";
import NetworkUtils from "utils/NetworkUtils";
import Web3 from "web3";
import ERC20ABI from 'utils/erc20.json';
import type {AbiItem} from 'web3-utils/types/index';
import type {TransactionReceipt} from 'web3-core/types/index';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import Global from "utils/Global";

interface OrderLog {
    startTime: number | null,
    endTime: number | null,
    level: number,
    amount: number,
    orderNo: string,
    chain: number,
    status: number,
    txHash: string,
    rechargeAddr: string,
    effectiveTime: number,
    address: string,
    actualAmount: number | null,
    discountPrice: number | null,
}

export default function Member() {
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id });
    const userInfo = useSelector((state: AppState) => state.userInfo);
    const dispatch = useDispatch();
    const router = useRouter();
    const { level, endTime, address } = userInfo;
    const [isLogin, setLogin] = useState(false)
    const [orderLogs,setOrderLogs] = useState<OrderLog[]>([]);
    const [loading,setLoading] = useState<boolean>(false);
    
    const [payConfig,setPayConfig] = useState<PayConfig | undefined>(undefined);
    
    const [metamaskDialogVisible,setMetamaskDialogVisible] = useState<boolean>(false);
    const [payLoading,setPayLoading] = useState<boolean>(false);
    
    const [trc20Info,setTrc20Info] = useState<Trc20PayInfo | undefined>(undefined);
    
    const [trc20DialogVisible,setTrc20DialogVisible] = useState<boolean>(false);
    
    const [order,setOrder] = useState<OrderLog | undefined>(undefined);
    
    const [web3, setWeb3] = useState<undefined | Web3>(undefined);

    const columns = [
        {
            title: f('buyType'),
            dataIndex: 'effectiveTime',
            align: 'center' as const,
            width: '10%',
            render: (text: string, record: OrderLog) => {
                return (<span className="table-text">{`Pro-${text}${f('unit4')}`}</span>)
            }
        },
        {
            title: f('startTime'),
            dataIndex: 'startTime',
            align: 'center' as const,
            width: '10%',
            render: (text: string, record: OrderLog) => {
                return (<span className="table-gray-text">{record.startTime !== null ? moment(text).format('yyyy.MM.DD') : '-'}</span>)
            }
        },
        {
            title: f('expireTitle'),
            dataIndex: 'endTime',
            align: 'left' as const,
            width: '10%',
            render: (text: string, record: OrderLog) => {
                return (
                <span className="table-gray-text">
                    {record.endTime !== null ? moment(text).format('yyyy.MM.DD') : <span style={{marginLeft: 20}}>-</span>}
                </span>)
            }
        },
        {
            title: f('payMoney'),
            dataIndex: 'amount',
            align: 'left' as const,
            width: '10%',
            render: (text: string, record: OrderLog) => {
                return (<span className="table-gray-text" style={{paddingLeft: 10}}>{text}</span>)
            }
        },
        {
            title: f('payWay'),
            dataIndex: 'chain',
            align: 'left' as const,
            width: '12%',
            render: (text: number, record: OrderLog) => {
                let payWay;
                if(text === 1 || text === 2) {
                    payWay = 'Metamask';
                } else if(text === 3) {
                    payWay = f('excard');
                } else {
                    payWay = f('transfer');
                }
                return (<span className="table-gray-text">{payWay}</span>)
            }
        },
        {
            title: "Hash",
            dataIndex: 'txHash',
            align: 'left' as const,
            width: '15%',
            render: (text: string, record: OrderLog) => {
                return (
                <span className="table-gray-text">
                    {shortHash(text)}{text ? (
                    <>
                        <svg
                            className="icon"
                            aria-hidden="true"
                            style={{
                                width: '14px',
                                height: '16px',
                                marginLeft: '8px',
                                cursor: 'pointer',
                                verticalAlign: 'middle'
                            }}
                            onClick={() => {
                                let addr = document.querySelector(`#copyObj${record.orderNo}`);
                                (addr as HTMLTextAreaElement).select()   
                                document.execCommand('Copy')
                                message.success(f('copySuccess'))
                            }}>
                            <use xlinkHref="#icon-copy-blue"></use>
                        </svg>
                        <textarea
                            id={`copyObj${record.orderNo}`}
                            readOnly
                            style={{
                                position: 'absolute',
                                top: '0',
                                left: '0',
                                opacity: '0',
                                zIndex: -10,
                            }}
                            value={text}
                        />
                    </>
                    ): <span style={{marginLeft: 10}}>-</span>}
                    
                </span>)
            }
        },
        {
            title: f('orderStatus'),
            dataIndex: 'status',
            align: 'left' as const,
            width: '10%',
            render: (text: string, record: OrderLog) => {
                let statusText = '';
                let textClassName = 'table-gray-text';
                if(record.status === -1) {
                    statusText = f('canceledStatus');
                } else if(record.status === 0) {
                    statusText = f('unpayStatus');
                } else if(record.status === 1) {
                    statusText = f('ensureStatus');
                } else if(record.status === 2) {
                    statusText = f('paySuccessStatus');
                    textClassName = 'table-green-text';
                } else if(record.status === 3){
                    statusText = f('payFailStatus');
                }
                return (<span className={textClassName}>{statusText}</span>)
            }
        },
        {
            title: f('action'),
            dataIndex: 'status',
            align: 'left' as const,
            width: '28%',
            render: (status: number, record: OrderLog) => {
                let buttons = <span style={{marginLeft: 10}}>-</span>;
                if(status === 0) {
                    buttons = (
                    <>
                        <Button onClick={handlePay.bind(null,record)} className="pay-button" type="text">{f('goPay')}</Button>
                        <Button onClick={()=> {
                            cancelOrder(record.orderNo);
                        }} className="pay-button" type="text" style={{marginLeft: 20}}>{f('cancelOrder')}</Button>
                    </>);
                } else if(status === 1 && record.chain === 0) {
                    buttons = (
                    <>
                        <Button onClick={handlePay.bind(null,record)} className="pay-button" type="text">{f('goPay')}</Button>
                    </>);
                } 
                return (<span className="table-text">{buttons}</span>)
            }
        },
    ];

    useEffect(() => {
        
        setLogin(isUserLogined())
        if(userInfo.address) {
            requestOrderLog();
        }
    }, [userInfo.address])

    const shortHash = (text: string | null) => {
        return text !== null ? `${text.substring(0,7)}....${text.substring(text.length - 7,text.length)}` : ''
    }

    
    const requestOrderLog = () => {
        const apiClient = new ApiClient<OrderLog[]>();
        setLoading(true);
        apiClient.get('/member/order/log')
        .then(success => {
            setOrderLogs(success.data ? success.data : []);
        },fail => {
            message.error(fail.message);
        }).finally(() => {
            setLoading(false);
        });
    }

    
    const cancelOrder = (orderNo: string) => {
        Modal.confirm({
            title: f('sureToCancelOrder'),
            icon: <ExclamationCircleOutlined />,
            onOk: async () => {
                const apiClient = new ApiClient();
                try {
                    await apiClient.get('/member/order/status',{
                        params: {
                            orderNo: orderNo,
                            status: -1
                        }
                    });
                    if(metamaskDialogVisible) {
                        setMetamaskDialogVisible(false);
                    }
                    if(trc20DialogVisible) {
                        setTrc20DialogVisible(false);
                    }
                    message.success(f('success'));
                    setOrder(undefined);
                    setPayConfig(undefined);
                    requestOrderLog();
                } catch(e) {
                    message.error((e as any).message);
                }
            }
        });
    }

    
    const requestTrc20Info = () => {
        const apiClient = new ApiClient<Trc20PayInfo>();
        apiClient.get('/member/addr').then(success => {
            setTrc20Info(success.data);
            setTrc20DialogVisible(true);
        }, fail => {
            message.error(fail.message);
        })
    }

    const handleLogin = () => {
        dispatch(showWalletDialog());
    }

    const handleOrderPro = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        Global.openNewTag(e,router,'/pay');
    }

    const handlePriceDetail = () => {
        const url = 'https://definder.info?tab=price';
        window.open(url,'_blank');
    }

    const handlePay = (order: OrderLog) => {
        setOrder(order);
        const config : PayConfig = {
            level: order.level.toString(),
            effectiveTime: order.effectiveTime,
            amount: order.amount,
            id: 0,
            isLimit: false
        }
        setPayConfig(config);
        if(order.chain === 1) {
            //eth
            setMetamaskDialogVisible(true);
        } else if(order.chain === 2) {
            //bsc
            setMetamaskDialogVisible(true);
        } else {
            //trc20
            if(typeof trc20Info === 'undefined') {
                requestTrc20Info();
            } else {
                setTrc20DialogVisible(true);
            }
        }
    }

    //
    const handleCancelOrder = () => {
        if(typeof order !== 'undefined') {
            cancelOrder(order.orderNo);
        }
    }

    //
    const handleMetamaskPay = async () => {
        //
        if(typeof order !== 'undefined') {
            const chain = order.chain
            if(checkChainEnv(chain.toString())) {
                if(order.actualAmount !== 0) {
                    if(await checkAccount(order.address)) {
                        callMetamaskPay();
                    }
                } else {
                    
                    callMetamaskPay();
                }
            }
        }
    }

    const checkChainEnv = (chain : string) => {
        if(typeof window.ethereum === 'undefined') {
            message.error(f('ensureWeb3Browser'));  
            return false;
        }
        const netWorkId = window.ethereum.networkVersion;
        if(NetworkUtils.getNetworkType(netWorkId) !== chain) {
            
            const networkIds = NetworkUtils.getNetworkId();
            let chainId;
            if(chain === '1') {
                chainId = networkIds[0];
            } else {
                chainId = networkIds[1];
            }
            switchNetwork(chainId);
            return false;
        }

        return true;
    }

    const checkAccount = async (address : string) => {
        const web3js = await initWeb3();
        const current: string = web3js.eth.accounts.givenProvider.selectedAddress;
        const str = f('accountNotSame');
        if(current.toLowerCase() !== address.toLowerCase()) {
            Modal.warn({
                content: str.replace('address',Global.abbrSymbolAddress(address))
            });
            return false;
        } else {
            return true;
        }
    }

    
    const switchNetwork = async (chainId: string) => {
        try {
            await NetworkUtils.switchNetwork(chainId)
            //setWeb3(undefined);
            //await callMetamaskPay(networkId);
        } catch (error) {
            if ((error as any).code === 4902) {
                //This error code indicates that the chain has not been added to MetaMask.
                try {
                  //
                  await NetworkUtils.addNetwork(chainId,NetworkUtils.getNetworkName(chainId),NetworkUtils.getRpcUrl(chainId))
                  //await callMetamaskPay(networkId);
                } catch (addError) {
                    message.error(f('addNetworkToMetamaskError'));
                }
            } else {
                message.error(f('switchNetwork'));
            }
        }
    }

    const initWeb3 = async () => {
        let web3js;
        const netWorkId = window.ethereum.networkVersion;
        if(typeof web3 === 'undefined') {
            web3js = await NetworkUtils.initWeb3(netWorkId);
            setWeb3(web3js); 
        } else {
            web3js = web3;
        }
        return web3js;
    }

    
    const callMetamaskPay = async () => {
        if(typeof order === 'undefined') {
            return;
        }
        const web3js = await initWeb3();
        const account = web3js.eth.accounts.givenProvider.selectedAddress;
        if(typeof order !== 'undefined') {
            if(order.actualAmount === null || order.actualAmount === 0) {
                
                try {
                    setPayLoading(true);
                    const apiClient = new ApiClient();
                    const netWorkId = window.ethereum.networkVersion;

                    await apiClient.post('/member/order/result',{
                        data: {
                            txHash: '',
                            orderNo: order.orderNo,
                            chain: NetworkUtils.getNetworkType(netWorkId),
                            from: account,
                            to: order.rechargeAddr
                        }
                    })
                    await apiClient.get('/member/notice/recharge',{params: {isNotice: 1}});
                    dispatch(setPaySuccessDialogVisible(true));
                    requestOrderLog();
                } catch(e) {
                    message.error((e as any).message);
                }
            } else {
                setPayLoading(true);
                const apiClient = new ApiClient();
                const account = web3js.eth.accounts.givenProvider.selectedAddress;
                
                const netWorkId = window.ethereum.networkVersion;
                const usdtContractAddr = NetworkUtils.getUsdtContractAddress(netWorkId);
                const contract = new web3js.eth.Contract(
                    ERC20ABI as AbiItem[],
                    usdtContractAddr
                );
                const balance = await contract.methods.balanceOf(account).call();
                
                const decimal = NetworkUtils.getContractDecimalUnit(netWorkId);
                const actualAmountInWei = web3js.utils.toWei(order.actualAmount.toString(),decimal as any);
                if(web3js.utils.toBN(balance).lt(web3js.utils.toBN(actualAmountInWei))) {
                    const hint = f('notEnoughMoney').replace('{address}',account);
                    message.warn({
                        content: hint
                    });
                    setPayLoading(false);
                    return;
                }

                try {
                    const toAddress = order.rechargeAddr;
                    const data = contract.methods.transfer(toAddress,actualAmountInWei).encodeABI();
                    const count = await web3js.eth.getTransactionCount(account);
                    const stResult : TransactionReceipt = await web3js.eth.sendTransaction({
                        from: account,
                        nonce: web3js.utils.toHex(count) as any as number,
                        to: usdtContractAddr,
                        chain: NetworkUtils.getNetworkShortName(netWorkId),
                        "value": "0x0",
                        data: data
                        });
                    
                    setMetamaskDialogVisible(false);
                    await apiClient.post('/member/order/result',{
                        data: {
                            txHash: stResult.transactionHash,
                            orderNo: order.orderNo,
                            chain: NetworkUtils.getNetworkType(netWorkId),
                            from: account,
                            to: toAddress
                        }
                    })
                    if(order.status !== 1) {
                        await apiClient.get('/member/order/status',{
                            params: {
                                orderNo: order.orderNo,
                                status: 1
                            }
                        });
                    }
                    
                    requestOrderLog();
                } catch(e) {
                    //message.error((e as any).message);
                } finally {
                    setPayLoading(false);
                }
            }
        }
    }


    const handleTrc20FinishPay = async () => {
        if(typeof order !== 'undefined') {
            const apiClient = new ApiClient();
            if(order.actualAmount !== null && order.actualAmount === 0) {
                try {
                    setPayLoading(true);
                    const netWorkId = window.ethereum.networkVersion;
                    let web3js = await initWeb3();
                    const account = web3js.eth.accounts.givenProvider.selectedAddress;
                    await apiClient.post('/member/order/result',{
                        data: {
                            txHash: '',
                            orderNo: order.orderNo,
                            chain: NetworkUtils.getNetworkType(netWorkId),
                            from: account,
                            to: order.rechargeAddr
                        }
                    })
                    await apiClient.get('/member/notice/recharge',{params: {isNotice: 1}});
                    dispatch(setPaySuccessDialogVisible(true));
                } catch(e) {
                    message.error((e as any).message);
                }
            } else {
                await apiClient.get('/member/order/status',{
                    params: {
                        orderNo: order.orderNo,
                        status: 1
                    }
                });
            }
        }
        requestOrderLog();
        setTrc20DialogVisible(false);
    }

    const handleGoUseExcardClick = (e : React.MouseEvent) => {
        Global.openNewTag(e,router,'/pay/0');
    }

    return (
        <div className="member">
            <div className="title">
                {f('myMember')}
            </div>

            {
                (!isLogin) ?
                    <div className="no-login">
                        <span>{f('buyPro')}</span>
                        <span className="login-button" onClick={handleLogin}>{f('loginRightNow')}</span>
                    </div> :
                    <>
                        <div className="current-level">
                            <span className="label">{f('currentLevel')}</span>
                            {
                                level === 1 ?
                                    <>
                                        <img className="icon" src="/images/ic-level-pro.svg" />
                                        <span className="level-text">{Global.isExpVip(userInfo) ?  f('vipProExpVersion') : f('profession')}</span>
                                    </> :
                                    <>
                                        <div className="bd2">
                                            <div className="layer3"></div>
                                        </div>
                                        <span className="level-text">{f('standand')}</span>
                                        <button className="order-pro" onClick={handleOrderPro}>{f('orderPro')}</button>
                                        <Button className="use-excard" disabled={userInfo.experienceCardStatus === 0} onClick={handleGoUseExcardClick}>{f('useExcard')}</Button>
                                    </>
                            }
                        </div>

                        {level === 1 ? <div className="expire-time">{f('expireTime')}{moment(endTime).format("yyyy.MM.DD")}</div> : null}

                        {
                            level === 1 ?
                                <>
                                    <div className="intro-header">
                                        <span className="label">{f('privileges')}</span>
                                    </div>
                                    <div className="intro-content">
                                        <div className="item"><img src="/images/ic-pro-token-wide.svg" />{f('tokenWide')}</div>
                                        <div className="item"><img src="/images/ic-pro-address-deep.svg" />{f('addressDeep')}</div>
                                        <div className="item"><img src="/images/ic-pro-smart-money-allview.svg" />{f('smartMoney')}</div>
                                        <div className="item"><img src="/images/ic-pro-more-resource.svg" />{f('moreResource')}</div>
                                    </div>
                                </> :
                                <>
                                    <div className="intro-header">
                                        <span className="label">{f('updatePro')}</span>
                                        <span className="compare" onClick={handlePriceDetail}>{f('moreDetail')}</span>
                                    </div>

                                    <div className="intro-content">
                                        <div className="item">
                                            <div className="outer1">
                                                <div className="main1"></div>
                                            </div>
                                            <div className="text">
                                                {f('tokenWide')}
                                            </div>
                                        </div>

                                        <div className="item">
                                            <div className="outer1">
                                                <div className="main2"></div>
                                            </div>
                                            <div className="text">
                                                {f('addressDeep')}
                                            </div>
                                        </div>

                                        <div className="item">
                                            <div className="outer1">
                                                <div className="main3"></div>
                                            </div>
                                            <div className="text">
                                                {f('smartMoney')}
                                            </div>
                                        </div>

                                        <div className="item">
                                            <div className="outer1">
                                                <div className="main4"></div>
                                            </div>
                                            <div className="text">
                                                {f('moreResource')}
                                            </div>
                                        </div>
                                    </div>
                                </>
                        }

                        <div className="seperator">

                        </div>

                        <div className="usdt-records">
                            <p className="table-header">{f('memberBuyRecord')}</p>
                            <div className="common-table" style={{margin: 0}}>
                                <Table 
                                    rowKey="orderNo"
                                    columns={columns}
                                    loading={loading}
                                    dataSource={orderLogs}
                                    pagination={false}
                                />
                            </div>
                        </div>
                        
                    </>

            }

            <MetamaskPayDialog 
                actualAmount={typeof order !== 'undefined' ? order.actualAmount : null}
                discountPrice={typeof order !== 'undefined' ? order.discountPrice : null}
                visible={metamaskDialogVisible} 
                setVisible={setMetamaskDialogVisible}
                payConfig={payConfig}
                handleMetamaskPay={handleMetamaskPay}
                handleCancelOrder={handleCancelOrder}
                payLoading={payLoading}
            />
            <Trc20Dialog 
                actualAmount={typeof order !== 'undefined' ? order.actualAmount : null}
                discountPrice={typeof order !== 'undefined' ? order.discountPrice : null}
                trc20PayInfo={trc20Info}
                visible={trc20DialogVisible}
                setVisible={setTrc20DialogVisible}
                payConfig={payConfig}
                handleCancelOrder={handleCancelOrder}
                handleFinishPay={handleTrc20FinishPay}
            />
        </div>);
}

