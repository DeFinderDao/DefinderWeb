import { Button, message, Table } from 'antd';
import moment from 'moment';
import { useEffect, useState, Key } from 'react';
import { useIntl } from 'react-intl';
import 'styles/my-invite.less'
import ApiClient from 'utils/ApiClient';
import Global from 'utils/Global';
import type { TablePaginationConfig } from 'antd/lib/table'
import type { ColumnsType, SorterResult, TableCurrentDataSource } from 'antd/lib/table/interface'
import { useDispatch, useSelector } from 'react-redux';
import type { AppState } from 'redux/reducers';
import NoLogin from 'components/NoLogin';
import type { PrimitiveType, FormatXMLElementFn } from "intl-messageformat";
import Link from 'next/link';
import InviteModal from 'components/InviteModal';
import { getUserInviteDetailInfo } from 'redux/actions/UserInfoAction';
import ExcardsModal from 'components/ExcardsModal';
import NetworkUtils from 'utils/NetworkUtils';
import type { AbiItem } from 'web3-utils/types/index';
import RewardAbi from 'utils/reward.json';
import Web3 from 'web3';
import type { TransactionReceipt, HttpProvider } from 'web3-core/types/index';
import { isSuccessfulTransaction, waitTransaction } from 'utils/CheckTxMined';

interface InviteItemsData {
    totalSize: number,
    list: InviteItem[]
}

interface InviteItem {
    date: number,
    address: string,
    experienceCode: string,
}

interface RewardItemsData {
    totalSize: number,
    list: RewardItem[]
}

interface RewardItem {
    orderTime: number,
    orderType: number,
    amount: number,
    symbol: string,
    status: number
}

interface WithdrawData {
    address: string,
    amount: number,
    orderId: number,
    nonce: number,
    v: number,
    r: string,
    s: string
}

const TABLE_INVITE = 'invite';

const TABLE_REWARD = 'reward';

const TABLE_EXCARD = 'excard';

const DEV_CLAIM_REWARD_CONTRACT_ADDRESS = '0x20a0Eb77ac3B6dD6E9aE03A8f38207042Ef13130';

const TEST_CLAIM_REWARD_CONTRACT_ADDRESS = "0xf1c0034F7572d34546B16D597E26Db813b2a43eD";

const PRODUCTION_CLAIM_REWARD_CONTRACT_ADDRESS = "0xf9152fBd54FF2e9bd57C2D2700B06490d7768bEf";

export default function MyInvite() {
    const { formatMessage } = useIntl()
    const f = (id: string, value?: Record<string, PrimitiveType | FormatXMLElementFn<string, string>> | undefined) => formatMessage({ id }, value);
    const dispatch = useDispatch();
    const userInfo = useSelector((state: AppState) => state.userInfo);
    const {inviteDetail} = userInfo;
    const [inviteDialogVisible,setInviteDialogVisible] = useState(false);
    const [excardOpen,setExcardOpen] = useState(false);
    const [web3, setWeb3] = useState<undefined | Web3>(undefined);
    const [claimRewarding,setClaimRewarding] = useState(false);
    const [needRefreshReward,setNeedRefreshReward] = useState(false);
    const apiClient = new ApiClient();

    useEffect(() => {
        if (userInfo.address) {
            dispatch(getUserInviteDetailInfo());
        } 
    }, [userInfo.address]);

    const handleInviteClick = () => {
        setInviteDialogVisible(true);
    }

    const handleViewExcardClick = () => {
        setExcardOpen(true);
    }

    const handleShareClick = () => {
        setExcardOpen(true);
    }

    const handleClaimReward = async () => {
        try {
            
            const env = process.env.SERVICES_ENV;
            let networkId: string;
            if(env === 'development') {
                networkId = '4';
            } else if(env === 'test') {
                networkId = '97';
            } else {
                networkId = '56';
            }
            
            if (typeof window.ethereum === 'undefined') {
                message.error(f('ensureWeb3Browser'));
                setClaimRewarding(false);
                return;
            }
            
            if(window.ethereum.networkVersion !== networkId) {
                await switchNetwork(networkId);
            }
            setClaimRewarding(true);
            const result = await apiClient.get("/invite/withdraw")    
            const data = result.data as WithdrawData;
            const web3js = await initWeb3();
            
            const account = web3js.eth.accounts.givenProvider.selectedAddress;
            //console.log(account,data.address.toLowerCase());
            if(account.toLowerCase() !== data.address.toLowerCase()) {
                await cancelClaimRewardOrder(data.orderId);
            
                message.warn(f('switchAccount',{address: data.address}));
                setClaimRewarding(false);
                return;
            }

            
            let rewardContractAddr;
            if(env === 'development') {
                rewardContractAddr = DEV_CLAIM_REWARD_CONTRACT_ADDRESS;
            } else if(env === 'test') {
                rewardContractAddr = TEST_CLAIM_REWARD_CONTRACT_ADDRESS;
            } else {
                rewardContractAddr = PRODUCTION_CLAIM_REWARD_CONTRACT_ADDRESS;
            }
            const contract = new web3js.eth.Contract(
                RewardAbi as AbiItem[],
                rewardContractAddr
            );

            
            /*try {
                const gas = await contract.methods.claimReward(data.orderId, data.amount,data.v,data.r,data.s).estimateGas({
                    from: account
                });
                console.log(gas);
                const balance = await web3js.eth.getBalance(account);
                if(web3js.utils.toBN(balance).lt(gas)) {
                    const hint = f('notEnoughMoney').replace('{address}', Global.abbrSymbolAddress(account));
                    message.warn({
                        content: hint
                    });
                    await cancelClaimRewardOrder(data.orderId);
                    setClaimRewarding(false);
                    return;
                }
            } catch(e) {
                console.log(e);
                await cancelClaimRewardOrder(data.orderId);
                message.warn({
                    content: e
                });
                setClaimRewarding(false);
                return;
            }*/
            try {
                await contract.methods.claimReward(data.orderId,data.nonce, data.amount.toString(),data.v,data.r,data.s)
                .call({
                    from: account
                })
            } catch(error) {
                message.error(f('rpcInvokeError'));
                await cancelClaimRewardOrder(data.orderId);
                setClaimRewarding(false);    
                return;
            }

            contract.methods.claimReward(data.orderId,data.nonce, data.amount.toString(),data.v,data.r,data.s)
            .send({
                from: account
            }).on("transactionHash",function(hash: string) {
                apiClient.post('/invite/withdraw/confirm',{
                    data: {
                        txHash: hash,
                        orderId: data.orderId
                    }
                });
                waitTransaction(web3js,hash,{
                    interval: 500,
                    blocksToWait: 4
                }).then(async success => {
                    console.log(success);
                    if(isSuccessfulTransaction(success)) {
                        message.success(f('claimRewardSuccess'));
                        setClaimRewarding(false);
                        dispatch(getUserInviteDetailInfo());
                        setNeedRefreshReward(true);
                    } else {
                        await cancelClaimRewardOrder(data.orderId);
                        setClaimRewarding(false);    
                    }
                },async fail => {
                    await cancelClaimRewardOrder(data.orderId);
                    setClaimRewarding(false);    
                });
            }).on("error",async function(error: Error) { 
                if((error as any).code === 4001) {
                    message.error(f('txRejected'));
                } else {
                    message.error(f('rpcInvokeError'));
                }
                setClaimRewarding(false);    
                await cancelClaimRewardOrder(data.orderId);
            });
        } catch(e) {
            //console.log('outside');
            setClaimRewarding(false);
            message.error((e as any).message);
        }
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

    
    const switchNetwork = async (networkId: string) => {
        try {
            await NetworkUtils.switchNetwork(`0x${Number(networkId).toString(16)}`)
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

    const cancelClaimRewardOrder = async (orderId: number) => {
        //cancel a order
        return apiClient.post('/invite/withdraw/cancel',{
            data: {
                orderId : orderId
            }
        });
    }

    let excardDesc;
    if(userInfo.level === 1) {
        if(Global.isExpVip(userInfo)) {
            excardDesc = (<>{f('becomeVip') + f('sendExcardToFriend') + f('descSubfix')}</>)
        } else if(userInfo.levelId === 1){
            excardDesc = f('excard5Desc') + f('descSubfix');
        } else {
            excardDesc = f('excardDesc', { level: Global.mapLevelId2Days(userInfo.levelId), num: Global.mapLevelId2ExcardNum(userInfo.levelId) }) + f('descSubfix');
        }
    } else {
        excardDesc = (<><Link href="/pay"><a style={{textDecoration: 'underline'}}>{f('becomeVip')}</a></Link>{f('sendExcardToFriend') + f('descSubfix')}</>)
    }

    
    let claimRewardAmout = 0;
    if(typeof inviteDetail !== 'undefined') {
        claimRewardAmout = inviteDetail.freezeAmount > 0 ? inviteDetail.freezeAmount : inviteDetail.rewardAmount;
    }

    return (
        <div className="my-invite">
            {
                userInfo.address ? (
                    <>
                        <div className='title'>{f('title')}</div>
                        <div className='sub-title'>{f('subTitle')}</div>
                        <div className='info'>
                            <div className='info-column' style={{ marginRight: 40 }}>
                                <div className='info-row1'>
                                    {f('title')}
                                </div>
                                <div className='info-row2'>
                                    <div className='num'>
                                        {inviteDetail?.inviteCount}
                                    </div>
                                    <div>
                                        <Button className='round-button' disabled={typeof inviteDetail === 'undefined'} type='primary' onClick={handleInviteClick}>{f('invite')}</Button>
                                    </div>
                                </div>
                                <div className='info-row3'>
                                    {f('inviteDesc')}
                                </div>
                            </div>
                            <div className='info-column' style={{ marginRight: 40 }}>
                                <div className='info-row1'>
                                    <div>{f('reward')}</div>
                                    <div className='reward-level'>{f('rewardLevel', { level: typeof inviteDetail === 'undefined' ?  '' : inviteDetail.rewardRatio })}</div>
                                </div>
                                <div className='info-row2'>
                                    <div className='num'>
                                        {claimRewardAmout}<span className="usdt">{inviteDetail?.rewardSymbol}</span>
                                    </div>
                                    <div>
                                        <Button className='round-button' loading={claimRewarding} onClick={handleClaimReward} type='primary'>{f('get')}</Button>
                                    </div>
                                </div>
                                <div className='info-row3'>
                                    {f('rewardLevelDesc', { level: typeof inviteDetail === 'undefined' ?  '' : inviteDetail.rewardRatio })}
                                </div>
                            </div>
                            <div className='info-column' >
                                <div className='info-row1'>
                                    {f('excard')}
                                </div>
                                <div className='info-row2'>
                                    <div className='num'>
                                        {typeof inviteDetail === 'undefined' || inviteDetail.enableCount === null ? 0 : inviteDetail.enableCount}
                                    </div>
                                    <div>
                                        <Button className='round-button' type='primary' disabled={typeof inviteDetail === 'undefined' || Global.isExpVip(userInfo)} onClick={handleShareClick}>{f('share')}</Button>
                                    </div>
                                </div>
                                <div className='info-row3'>
                                    {excardDesc}
                                </div>
                            </div>

                        </div>
                        <div className='level-reward-desc'>
                            {f('rewardLevelMoreDesc')}
                        </div>
                        <Tables needRefreshReward={needRefreshReward}/>
                    </>
                ) : (
                    <NoLogin
                        desc={f('noLoginDesc')}
                        btnText={f('login')}
                    />
                )
            }
            <InviteModal 
                visible={inviteDialogVisible} 
                setVisible={setInviteDialogVisible}
                userInfo={userInfo} 
                handleViewExcardClick={handleViewExcardClick}   
            />    
            <ExcardsModal 
                visible={excardOpen}
                setVisible={() => setExcardOpen(false)}
                userInfo={userInfo}
            />
        </div>
    );
}

function Tables({needRefreshReward} : {needRefreshReward : boolean}) {
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id });
    const [inviteItems, setInviteItems] = useState<InviteItem[]>([]);
    const [inviteItemsLoading, setInviteItemsLoading] = useState(false);
    const [inviteItemsTotalSize, setInviteItemsTotalSize] = useState(0);
    const [inviteItemsPage, setInviteItemsPage] = useState({
        pageNo: 1,
        pageSize: 10
    });

    const [rewardItems, setRewardItems] = useState<RewardItem[]>([]);
    const [rewardItemsLoading, setRewardItemsLoading] = useState(false);
    const [rewardItemsTotalSize, setRewardItemsTotalSize] = useState(0);
    const [rewardItemsPage, setRewardItemsPage] = useState({
        pageNo: 1,
        pageSize: 10
    });

    const [excardItems, setExcardItems] = useState<InviteItem[]>([]);
    const [excardItemsLoading, setExcardItemsLoading] = useState(false);
    const [excardItemsTotalSize, setExcardItemsTotalSize] = useState(0);
    const [excardItemsPage, setExcardItemsPage] = useState({
        pageNo: 1,
        pageSize: 10
    });

    useEffect(() => {
        const apiClient = new ApiClient();
        setInviteItemsLoading(true);
        apiClient.get('/invite/detail', {
            params: inviteItemsPage
        }).then(
            success => {
                setInviteItemsLoading(false);
                setInviteItems((success.data as InviteItemsData).list);
                setInviteItemsTotalSize((success.data as InviteItemsData).totalSize);
            },
            fail => {
                setInviteItemsLoading(false);
                message.error(fail.message);
            }
        );
    }, [inviteItemsPage]);

    useEffect(() => {
        const apiClient = new ApiClient();
        setRewardItemsLoading(true);
        apiClient.get('/invite/reward/detail', {
            params: rewardItemsPage
        }).then(
            success => {
                setRewardItemsLoading(false);
                setRewardItems((success.data as RewardItemsData).list);
                setRewardItemsTotalSize((success.data as RewardItemsData).totalSize);
            },
            fail => {
                setRewardItemsLoading(false);
                message.error(fail.message);
            }
        );
    }, [rewardItemsPage,needRefreshReward]);

    useEffect(() => {
        const apiClient = new ApiClient();
        setExcardItemsLoading(true);
        apiClient.get('/invite/experience/detail', {
            params: excardItemsPage
        }).then(
            success => {
                setExcardItemsLoading(false);
                setExcardItems((success.data as InviteItemsData).list);
                setExcardItemsTotalSize((success.data as InviteItemsData).totalSize);
            },
            fail => {
                setExcardItemsLoading(false);
                message.error(fail.message);
            }
        );
    }, [excardItemsPage]);

    const inviteColumn = [
        {
            title: f('time'),
            dataIndex: 'inviteTime',
            align: 'left' as const,
            render: (text: string, record: InviteItem) => {
                //console.log(text);
                return (<span>{moment(text).format("YYYY-MM-DD HH:mm:ss")}</span>)
            }
        },
        {
            title: f('address'),
            dataIndex: 'address',
            align: 'right' as const,
            render: (text: string, record: InviteItem) => {
                return (<span>{Global.abbrSymbolAddress(text)}</span>)
            }
        },
    ];

    const rewardColumn = [
        {
            title: f('time'),
            dataIndex: 'orderTime',
            align: 'left' as const,
            render: (text: string, record: RewardItem) => {
                return (<span>{moment(text).format("YYYY-MM-DD HH:mm:ss")}</span>)
            }
        },
        {
            title: f('type'),
            dataIndex: 'orderType',
            align: 'left' as const,
            render: (text: string, record: RewardItem) => {
                let reward = '';
                if(record.orderType === 1) {
                    reward = f('rewardType1');
                } else if(record.orderType === 2) {
                    reward = f('rewardType2');
                } else {
                    reward = f('rewardType3')
                }
                return <span>{reward}</span>;
            }
        },
        {
            title: f('totalMoney'),
            dataIndex: 'amount',
            align: 'center' as const,
            render: (text: string, record: RewardItem) => {
                return (<span>{`${record.orderType === 2 ? '-' : '+'}${record.amount}${record.symbol}`}</span>)
            }
        },
        {
            title: f('status'),
            dataIndex: 'status',
            align: 'right' as const,
            render: (text: string, record: RewardItem) => {
                return (<span>{record.status === 2 ? f('onGoing') : f('finished')}</span>)
            }
        }
    ];

    const excardColumn = [
        {
            title: f('time'),
            dataIndex: 'inviteTime',
            align: 'left' as const,
            width: '33%',
            render: (text: string, record: InviteItem) => {
                return (<span>{moment(text).format("YYYY-MM-DD HH:mm:ss")}</span>)
            }
        },
        {
            title: f('excard'),
            dataIndex: 'experienceCode',
            align: 'center' as const,
            width: '33%',
            render: (text: string, record: InviteItem) => {
                return text;
            }
        },
        {
            title: f('address'),
            dataIndex: 'address',
            align: 'right' as const,
            width: '34%',
            render: (text: string, record: InviteItem) => {
                return (<span>{Global.abbrSymbolAddress(text)}</span>)
            }
        },
    ];

    const handleTableChange = (type: string, pagination: TablePaginationConfig, filters: Record<string, (Key | boolean)[] | null>, sorter: SorterResult<any> | SorterResult<any>[], extra: TableCurrentDataSource<any>) => {
        
        if (type === TABLE_INVITE) {
            setInviteItemsPage({
                ...inviteItemsPage,
                pageNo: pagination.current!
            });
        } else if (type === TABLE_REWARD) {
            setRewardItemsPage({
                ...rewardItemsPage,
                pageNo: pagination.current!
            });
        } else if(type === TABLE_EXCARD) {
            setExcardItemsPage({
                ...excardItemsPage,
                pageNo: pagination.current!
            });
        }
    }
    return (
        <>
            <div className='table-columns'>
                <div className='common-table column' style={{ margin: '0px 20px 0px 0px' }}>
                    <div className='title'>{f('inviteDetail')}</div>
                    <Table
                        rowKey={(record: InviteItem) => {
                            return JSON.stringify(record);
                        }}
                        columns={inviteColumn}
                        dataSource={inviteItems}
                        loading={inviteItemsLoading}
                        onChange={handleTableChange.bind(null, TABLE_INVITE)}
                        pagination={{
                            showQuickJumper: true,
                            showSizeChanger: false,
                            current: inviteItemsPage.pageNo,
                            pageSize: inviteItemsPage.pageSize,
                            total: inviteItemsTotalSize,
                            position: ['bottomCenter'],
                        }}
                    />
                </div>
                <div className='common-table column' style={{ margin: '0px 20px 0px 0px' }}>
                    <div className='title'>{f('rewardDetail')}</div>
                    <Table
                        rowKey={(record: RewardItem) => {
                            return JSON.stringify(record);
                        }}
                        columns={rewardColumn}
                        dataSource={rewardItems}
                        loading={rewardItemsLoading}
                        onChange={handleTableChange.bind(null, TABLE_REWARD)}
                        pagination={{
                            showQuickJumper: true,
                            showSizeChanger: false,
                            current: rewardItemsPage.pageNo,
                            pageSize: rewardItemsPage.pageSize,
                            total: rewardItemsTotalSize,
                            position: ['bottomCenter'],
                        }}
                    />
                </div>
            </div>
            <div className='table-columns'>
                <div className='common-table column' style={{ margin: '0px 20px 0px 0px' }}>
                    <div className='title'>{f('excardsDetail')}</div>
                    <Table
                        rowKey={(record: InviteItem) => {
                            return JSON.stringify(record);
                        }}
                        columns={excardColumn}
                        dataSource={excardItems}
                        loading={excardItemsLoading}
                        onChange={handleTableChange.bind(null, TABLE_EXCARD)}
                        pagination={{
                            showQuickJumper: true,
                            showSizeChanger: false,
                            current: excardItemsPage.pageNo,
                            pageSize: excardItemsPage.pageSize,
                            total: excardItemsTotalSize,
                            position: ['bottomCenter'],
                        }}
                    />
                </div>
                <div className='common-table column' style={{ margin: '0px 20px 0px 0px' }}>
                
                </div>
            </div>
        </>
    );
}