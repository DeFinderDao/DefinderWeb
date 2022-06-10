import { Button, message, Modal } from "antd";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import type { PrimitiveType, FormatXMLElementFn } from "intl-messageformat";
import { useDispatch, useSelector } from "react-redux";
import type { AppState } from "redux/reducers";
import { setPaySuccessDialogVisible, setUserInviteCode, showWalletDialog } from "redux/actions/UserInfoAction";
import { useRouter } from "next/router";
import Web3 from "web3";
import NetworkUtils from "utils/NetworkUtils";
import ApiClient from "utils/ApiClient";
import { Order } from "pages/pay/[[...type]]";
import { DefaultLocale } from "utils/env";

const CODE_INPUT_LENGTH = 6;

export default function ExcardModal() {
    const dispatch = useDispatch();
    const router = useRouter();
    const {locale = DefaultLocale} = router;
    const { formatMessage } = useIntl()
    const f = (id: string, value?: Record<string, PrimitiveType | FormatXMLElementFn<string, string>> | undefined) => formatMessage({ id }, value);
    const [excardOpen,setExcardOpen] = useState(false);
    const userInfo = useSelector((state: AppState) => state.userInfo)
    const {level,inviteDetail} = userInfo;
    const [buttonText,setButtonText] = useState('');
    const [buttonDisable,setButtonDisable] = useState(false);
    const [buttonLoading,setButtonLoading] = useState(false);
    const [codeInvalid,setCodeInvalid] = useState(false);
    const [web3, setWeb3] = useState<undefined | Web3>(undefined);
    const [excode,setExcode] = useState('');
    useEffect(() => {
        if(router.asPath !== router.route) {
            const {code} = router.query;
            if(code && Array.isArray(code) && code.length % 2 === 0) {
                if(code.length === 2) {
                    if(code[0] === 'inviteCode') {
                        dispatch(setUserInviteCode(code[1]));
                    } else if(code[0] === 'expcode') {
                        setExcode(code[1]);
                        setExcardOpen(true);
                    }
                } else if(code.length === 4) {
                    if(code[0] === 'expcode') {
                        setExcode(code[1]);
                        setExcardOpen(true);
                    }
                    if(code[2] === 'inviteCode') {
                        dispatch(setUserInviteCode(code[3]));
                    }
                }
            }
        }
    }, [router])

    useEffect(() => {
        if(userInfo.address) {
            if(userInfo.level === 1) {
                setButtonText(f('alreadyVip'));
                setButtonDisable(true);
            } else if(userInfo.level === 0 && userInfo.experienceCardStatus === 0) {
                setButtonText(f('useExcardAlready'));
                setButtonDisable(true);
            } else if(userInfo.level === 0 && userInfo.experienceCardStatus === 1) {
                setButtonText(f('useExcard'));
                setButtonDisable(false);
            }
        } else {
            setButtonText(f('linkWallet'));
            setButtonDisable(false);
        }
    },[userInfo.address,userInfo.level,locale]);

    const handleCancelExcardDialog = () => {
        setExcardOpen(false);
    }

    const handleButtonClick = async () => {
        if(userInfo.address && userInfo.level === 0 && userInfo.experienceCardStatus === 1) {
            setButtonLoading(true);
            const web3js = await initWeb3();
            const account = web3js.eth.accounts.givenProvider.selectedAddress;
            const excardChain = '3';
            try {
                const apiClient = new ApiClient<Order>();
                const result = await apiClient.post('/member/submit/order', {
                    data: {
                        levelId: 0,
                        from: account,
                        chain: excardChain,
                        experienceCode: excode
                    }
                });
                const payOrder = result.data;
                const netWorkId = window.ethereum.networkVersion;
                  
                await apiClient.post('/member/order/result', {
                    data: {
                        txHash: '',
                        orderNo: payOrder.orderNo,
                        chain: excardChain,
                        from: account,
                        to: payOrder.rechargeAddr
                    }
                })
                await apiClient.get('/member/notice/recharge', { params: { isNotice: 1 } });
                dispatch(setPaySuccessDialogVisible(true));
                router.push('/member');
            } catch(e) {
                if((e as any).code === 'experience.card.invalid.error') {
                    setButtonText(f('excardInvalid'));
                    setButtonDisable(true);
                    setCodeInvalid(true);
                } else if((e as any).code === 'experience.card.limit.error') {
                    setButtonText(f('excardInvalid'));
                    setButtonDisable(true);
                    setCodeInvalid(true);
                } else {
                    message.error((e as any).message);        
                }
            } finally {
                setButtonLoading(false);
            }  
        } else if(userInfo.address.length === 0) {
            dispatch(showWalletDialog());
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

    return (<Modal
        title={f('vipProExp')}
        centered
        closable
        onCancel={handleCancelExcardDialog}
        visible={excardOpen}
        footer={null}
        className='vip-pro-excard-dialog'
        width={locale === DefaultLocale ? 900 : 700}
        zIndex={999}
    >
        <div className="vip-pro-excard-title">
            {f('gotExcard')}
        </div>
        <div className="intro-content">
            <div className="item"><img src="/images/ic-pro-token-wide.svg" />{f('tokenWide')}</div>
            <div className="item"><img src="/images/ic-pro-address-deep.svg" />{f('addressDeep')}</div>
            <div className="item"><img src="/images/ic-pro-smart-money-allview.svg" />{f('smartMoney')}</div>
            <div className="item"><img src="/images/ic-pro-more-resource.svg" />{f('moreResource')}</div>
        </div>
        <div className="excard-content">
            <div className="excard" style={{textDecoration: !codeInvalid ? 'none' : 'line-through'}}>
                {excode}
            </div>
        </div>
        <div className="excard-button">
            <Button loading={buttonLoading} className="use-excard-button" onClick={handleButtonClick} disabled={buttonDisable} type="primary">{buttonText}</Button>
        </div>
        <div style={{marginTop: 20,fontSize: 12}}>
            {f('useOnlyOnce')}
        </div>
    </Modal>);
}