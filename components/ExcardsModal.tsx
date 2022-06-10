import { message, Modal, Tooltip } from "antd";
import { useIntl } from "react-intl";
import type { PrimitiveType, FormatXMLElementFn } from "intl-messageformat";
import {
    CopyOutlined,
} from '@ant-design/icons'
import type { UserInfoState } from "redux/types/UserInfoTypes";
import Global from "utils/Global";
import Link from "next/link";
import type { SyntheticEvent } from 'react';
import moment from "moment";

interface ExcardModalInterface {
    visible: boolean,
    setVisible: (visible : boolean) => void,
    userInfo : UserInfoState
}

interface Excard {
    number : string,
    isUsed : boolean
}

export default function ExcardsModal({visible,setVisible,userInfo} : ExcardModalInterface) {
    const { formatMessage } = useIntl()
    const f = (id: string, value?: Record<string, PrimitiveType | FormatXMLElementFn<string, string>> | undefined) => formatMessage({ id }, value);

    let excardDesc;
    if(userInfo.level === 1) {
        if(Global.isExpVip(userInfo)) {
            excardDesc = (<>{f('becomeVip') + f('sendExcardToFriend') + f('descSubfix')}</>)
        } else if(userInfo.levelId === 1) {
            excardDesc = f('excard5Desc') + f('descSubfix');
        } else {
            excardDesc = f('excardDesc', { level: Global.mapLevelId2Days(userInfo.levelId), num: Global.mapLevelId2ExcardNum(userInfo.levelId) }) + f('descSubfix');
        }
    } else {
        excardDesc = (<><Link href="/pay"><a onClick={() => setVisible(false)} style={{textDecoration: 'underline'}}>{f('becomeVip')}</a></Link>{f('sendExcardToFriend') + f('descSubfix')}</>)
    }

    const excards : Array<Excard> = [];

    if(typeof userInfo.inviteDetail !== 'undefined') {
        let unusedCards : Array<Excard>;
        if(userInfo.inviteDetail.enableList === null) {
            unusedCards = [];
        } else {
            unusedCards = userInfo.inviteDetail.enableList.map(number => {
                return {
                    number,
                    isUsed: false
                }
            });
        }
        
        let usedCards : Array<Excard>;
        if(userInfo.inviteDetail.disableList === null) {
            usedCards = [];
        } else {
            usedCards = userInfo.inviteDetail.disableList.map(number => {
                return {
                    number,
                    isUsed: true
                }
            });
        }
       
        excards.push(...unusedCards);
        excards.push(...usedCards)
    }

    return (
    <Modal
        className='excard-dialog'
        footer={null}
        visible={visible}
        onCancel={() => setVisible(true)}    
        centered    
        zIndex={998}
    >
        <div>
            <h2>{f('defiExcard')}</h2>
            <p className='defi-excard-desc'>{excardDesc}</p>
            <div className='card-grid'>
                {
                    excards.map(card => {
                        return (
                            <div className='card-item' key={card.number}>
                                <div className='card-content' style={{textDecoration : card.isUsed ? 'line-through' : 'none'}}>
                                    {card.number}
                                </div>
                                <textarea
                                    id={`copyObjInviteCode${card.number}`}
                                    readOnly
                                    style={{
                                        position: 'absolute',
                                        top: '0',
                                        left: '0',
                                        opacity: '0',
                                        zIndex: -10,
                                    }}
                                    value={createExpLink(card.number,typeof userInfo.inviteDetail === 'undefined' ? '' : userInfo.inviteDetail.inviteCode)}
                                />
                                <Tooltip
                                    title={f('copyLink')}
                                    >
                                    <CopyOutlined onClick={(e: SyntheticEvent) => {
                                        e.stopPropagation();
                                        let addr = document.querySelector(`#copyObjInviteCode${card.number}`);
                                        (addr as HTMLTextAreaElement).select()
                                        document.execCommand('Copy')
                                        message.success(f('copySuccess'))
                                    }} style={{marginRight: 10,cursor: 'pointer'}}/>
                                </Tooltip>
                            </div>            
                        );
                    })
                }
            </div>
            {
                userInfo.inviteDetail?.expireTime ? (
                <div className="expire-date">
                    {f('excardExpires',{date : moment(userInfo.inviteDetail?.expireTime).format('YYYY-MM-DD')})}
                </div>) : (<></>)
            }
        </div>
    </Modal>);
}

function createExpLink(cardNo : string,inviteCode: string) {
    return `${Global.getCurrentEnvHost()}/market-page/expcode/${cardNo}/inviteCode/${inviteCode}`;
}