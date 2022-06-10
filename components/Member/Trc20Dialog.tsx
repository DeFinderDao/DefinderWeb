import { Button, message, Modal } from "antd";
import Link from "next/link";
import type { PayConfig, Trc20PayInfo } from "pages/pay/[[...type]]";
import { useIntl } from "react-intl";
import "styles/trc20-dialog.less";

interface Trc20DialogProps {
    visible: boolean,
    setVisible: (visible: boolean) => void,
    handleFinishPay: () => void,
    handleCancelOrder: () => void,
    payConfig: PayConfig | undefined,
    trc20PayInfo: Trc20PayInfo | undefined,
    actualAmount: number | null,
    discountPrice: number | null,
}

export default function Trc20Dialog({visible,setVisible,handleFinishPay,handleCancelOrder,payConfig,trc20PayInfo,actualAmount,discountPrice} : Trc20DialogProps) {
    const { formatMessage } = useIntl();
    const f = (id: string) => formatMessage({ id });
    if(typeof payConfig === 'undefined' || typeof trc20PayInfo === 'undefined') {
        return <></>;
    }
    const handleCancelDialog = () => {
        setVisible(false);
    }
    const hasDiscount = discountPrice !== null && discountPrice !== 0 ? (
        <div className="column" style={{marginTop: 20}}>
            <div className="row-title">{f('discountDeduction')}</div>
            <div className="row-content"><span style={{fontSize: 18,marginRight: 5}}>-{discountPrice}</span>USDT</div>
        </div>) : (<></>);
    return (
        <Modal
            visible={visible}
            onCancel={handleCancelDialog}
            centered={true}
            closable={true}
            maskClosable={false}
            title={f('orderPayTitle')}
            footer={null}
            className="trc20-dialog"
            width={600}
        >
            <div>
                <div className="column">
                    <div className="title">
                        {f('memberType')}
                    </div>
                    <div className="content">
                        {f('proOffical')}-{payConfig.effectiveTime}
                    </div>
                </div>
                {hasDiscount}
                <div className="column" style={{marginTop: 20}}>
                    <div className="title">
                        {f('orderMoney')}
                    </div>
                    <div className="content">
                        <span style={{fontSize: 18}}>{actualAmount !== null ? actualAmount : payConfig.amount}</span> USDT
                    </div>
                </div>
                <div className="line"></div>
                <p className="hint" style={{marginTop: 18}}>{f('trc20Note1').replace('1s',payConfig.amount.toString())}</p>
                <p className="hint">{f('trc20Note2')}</p>
                <p className="hint">{f('trc20Note3')}</p>
                <div className="details">
                    <div className="detail-info">
                        <p>{f('chargeAddress')}</p>
                        <div className="title">
                            {f('mainnet')}
                        </div>
                        <div className="content">
                            {f('trc20Net')}
                        </div>
                        <div className="title" style={{marginTop: 16}}>
                            {f('address')}
                        </div>
                        <div className="content">
                            {trc20PayInfo.address} 
                            <span className="copy" onClick={() => {
                                const copyUrlBtn = document.createElement('input');
                                copyUrlBtn.value = trc20PayInfo.address;
                                document.body.appendChild(copyUrlBtn);
                                copyUrlBtn.select();
                                document.execCommand('Copy');
                                document.body.removeChild(copyUrlBtn);
                                message.success(f('copySuccess'))
                                }}>
                                {f('copy')}
                            </span>
                        </div>
                    </div>
                    <div className="qrcode">
                        <img src={trc20PayInfo.addressQr}/>
                    </div>
                </div>
                <div className="footer">
                    <Button type="text" style={{color: '#666666'}} onClick={handleCancelOrder}>{f('cancelOrder')}</Button>
                    <Button type="primary" style={{marginLeft: '40px'}} onClick={handleFinishPay}>
                        {actualAmount !== null && actualAmount === 0 ? f('confirm') : f('finishTransfer')}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

