import { useRouter } from 'next/router'
import './layout.less'
import { Button, Layout, Modal } from 'antd'
const {  Content } = Layout
import React, { useEffect } from 'react'
import { useIntl } from 'react-intl'
import LoadableHeader from './DefiHeader'
import { useDispatch, useSelector } from 'react-redux'
import UnifiedSearchCom from 'components/Header/unifiedSearchCom'
import type { ReactNode } from 'react'
import type { AppState } from 'redux/reducers'
import type { QueryLog, UserInfoState } from 'redux/types/UserInfoTypes'
import ApiClient from 'utils/ApiClient'
import { setPaySuccessDialogVisible } from 'redux/actions/UserInfoAction'
import usePrevious from 'components/UsePreviousHook'
import loadable from '@loadable/component';
const DefiMenu = loadable(() => import('./DefiMenu'))

type Props = {
    children?: ReactNode
}

export default function CustomLayout({ children }: Props) {
    const userInfo: UserInfoState = useSelector((state: AppState) => state.userInfo)
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id });
    const dispatch = useDispatch();
    
    const {address,level} = userInfo;
    const {pathname} = useRouter();
    const excludeQueryPage = '/pay';
    //const prevLevel = usePrevious(level);
    useEffect(() => {
        let intervalId = 0;
        if(level !== 1) {
            if(address && !pathname.startsWith(excludeQueryPage) && intervalId === 0) {
                const apiClient = new ApiClient<QueryLog>();
                intervalId = window.setInterval(() => {
                apiClient.get('/member/notice/recharge').then(success => {
                        if(success.data.isNotice === 0) {
                            apiClient.get('/member/notice/recharge',{params: {isNotice: 1}});

                            dispatch(setPaySuccessDialogVisible(true));
                            clearInterval(intervalId);
                            intervalId = 0;
                        } else if(success.data.isNotice === 1) {
                            clearInterval(intervalId);
                            intervalId = 0;
                        }
                    });
                },10 * 1000);
            } else if(address && pathname.startsWith(excludeQueryPage)) {
                if(intervalId !== 0) {
                    clearInterval(intervalId);
                    intervalId = 0;
                }
            } else {
                if(intervalId !== 0) {
                    clearInterval(intervalId);
                    intervalId = 0;
                }
            } 
        } else {
            if(intervalId !== 0) {
                clearInterval(intervalId);
                intervalId = 0;
            }
        }
        
        return () => {
            if(intervalId !== 0) {
                clearInterval(intervalId);
            }
        }
    },[address,pathname,level]);

    const handleRefresh = () => {
        window.location.reload();
    }

    return (
        <Layout className="defi-layout">
            <LoadableHeader>
                <UnifiedSearchCom
                    placeholder={
                        userInfo.address ? f('headerSearchTipsLogin') : ''
                    }
                />
            </LoadableHeader>
            <Layout className="defi-body">
                <DefiMenu />
                <Content className="defi-content">{children}</Content>
            </Layout>
            <Modal 
                closable={false}
                visible={userInfo.showPaySuccessDialog} 
                footer={null} 
                width={450}
                centered
                onCancel={handleRefresh}>
                <div className="pay-success-dialog">
                    <div className="title">
                        <img src="/images/ic-pay-success.svg" />
                        <div className='text1'>{f('paySuccess')}</div>
                        <div className='text2'>{f('becomePro')}</div>
                    </div>
                    <Button type="primary" className="retry-button" onClick={handleRefresh}>{f('refresh')}</Button>
                </div>
            </Modal>
        </Layout>
    )
}

