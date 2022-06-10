import { message, Modal } from "antd";
import { useIntl } from "react-intl";
import { SyntheticEvent } from 'react';
import { UserInfoState } from "redux/types/UserInfoTypes";
import type { PrimitiveType, FormatXMLElementFn } from "intl-messageformat";
import Link from "next/link";
import {
    CopyOutlined,
    TwitterOutlined,
    ArrowRightOutlined
} from '@ant-design/icons'
import Global from "utils/Global";

export interface InviteModalProps {
    visible : boolean,
    setVisible : (visible : boolean) => void,
    userInfo : UserInfoState,
    handleViewExcardClick: () => void
}

export default function InviteModal(props: InviteModalProps) {
    const { formatMessage } = useIntl()
    const f = (id: string, value?: Record<string, PrimitiveType | FormatXMLElementFn<string, string>> | undefined) => formatMessage({ id }, value);
    const {visible,setVisible,userInfo,handleViewExcardClick} = props;
    const {level,inviteDetail} = userInfo;

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
        excardDesc = (<><Link href="/pay"><a onClick={() => setVisible(false)} style={{textDecoration: 'underline'}}>{f('becomeVip')}</a></Link>{f('sendExcardToFriend') + f('descSubfix')}</>)
    }

    const shareLink = `${Global.getCurrentEnvHost()}/market-page/${typeof inviteDetail === 'undefined' ? '' : `inviteCode/${inviteDetail.inviteCode}`}`;

    const handleCopyClick = (e: SyntheticEvent) => {
        e.stopPropagation();
        let addr = document.querySelector("#copyObjInviteLink");
        (addr as HTMLTextAreaElement).select() 
        document.execCommand('Copy')
        message.success(f('copySuccess'))
    }

    const handleTwitterShareClick = () => {
        const shareContent = f('shareExcodeTwitter',{link : shareLink})
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareContent)}`,'_blank');
    }

    return (
        <Modal
                closable={true}
                footer={null}
                visible={visible}
                className="earn-usdt-dialog"
                centered
                onCancel={() => setVisible(false)}
                width={550}
                title={level === 1 ? f('earnUsdtDialogTitle1') : f('earnUsdtDialogTitle2')}
                zIndex={997}
            >
                <div>
                    <p>{f('earnUsdtDialogDesc1')}</p>
                    <p style={{marginBottom: 0}}>
                        {excardDesc}
                    </p>
                    <div style={{textAlign: 'right'}}><Link href="/my-invite"><a onClick={() =>setVisible(false)}>Learn More<ArrowRightOutlined style={{fontSize: 12}}/></a></Link></div>
                    <div className='invite-link-container'>
                        <div className='share-link'>
                            {shareLink}
                            <textarea
                                id="copyObjInviteLink"
                                readOnly
                                style={{
                                    position: 'absolute',
                                    top: '0',
                                    left: '0',
                                    opacity: '0',
                                    zIndex: -10,
                                }}
                                value={shareLink}
                            />
                        </div>
                        <div className='share-buttons'>
                            <CopyOutlined onClick={handleCopyClick} style={{marginRight: 10,cursor: 'pointer'}}/>
                            <TwitterOutlined onClick={handleTwitterShareClick} style={{cursor: 'pointer'}}/>
                        </div>
                    </div>
                    {level === 1 && !Global.isExpVip(userInfo) ? 
                        (<div className='footer'>
                            <span>
                                {f('exCard',{ num : typeof inviteDetail === 'undefined' || inviteDetail.enableCount === null ? 0 : inviteDetail.enableCount })}
                            </span>
                            <span className='use-ex-card' onClick={handleViewExcardClick}>
                                {f('useExCard')}
                                <ArrowRightOutlined />
                            </span>
                        </div>) : <></>}
                </div>
            </Modal>
    );
}