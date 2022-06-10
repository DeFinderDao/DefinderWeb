import { Button, Modal } from "antd";
import { Order, PayConfig } from "pages/pay/[[...type]]";
import { useIntl } from "react-intl";
import "styles/metamask-pay-dialog.less";

export interface MetamaskPayDialogProps {
    visible: boolean,
    setVisible: (visible: boolean) => void,
    payConfig: PayConfig | undefined,
    handleMetamaskPay: () => void,
    handleCancelOrder: () => void,
    payLoading: boolean,
    actualAmount: number | null,
    discountPrice: number | null,
}

export default function MetamaskPayDialog({visible,setVisible,payConfig,handleMetamaskPay,handleCancelOrder,payLoading,actualAmount,discountPrice}: MetamaskPayDialogProps) {
    const { formatMessage } = useIntl();
    const f = (id: string) => formatMessage({ id });
    const handleCancelDialog = () => {
        setVisible(false);
    }
    const hasDiscount = discountPrice !== null && discountPrice !== 0 ? (
    <div className="row">
        <div className="row-title">{f('discountDeduction')}</div>
        <div className="row-content"><span style={{fontSize: 18,marginRight: 5}}>-{discountPrice}</span>USDT</div>
    </div>) : (<></>);
    return (
    <Modal
        className="metamask-pay-dialog"
        visible={visible}
        maskClosable={false}
        centered={true}
        footer={null}
        title={f('orderPayTitle')}
        width={370}
        onCancel={handleCancelDialog}
    >
        <div>
            <div className="row">
                <div className="row-title">{f('memberType')}</div>
                <div className="row-content">{f('proOffical')}-{payConfig?.effectiveTime}{f('unit4')}</div>
            </div>
            {hasDiscount}
            <div className="row">
                <div className="row-title">{f('payAmount')}</div>
                <div className="row-content">
                    <span style={{fontSize: 18,marginRight: 5}}>
                        { actualAmount !== null? actualAmount : payConfig?.amount}
                    </span>USDT
                </div>
            </div>
            <div className="button-container">
                <Button className="cancel" type="text" onClick={handleCancelOrder}>{f('cancelOrder')}</Button>
                <Button type="primary" loading={payLoading} style={{marginLeft: 20}} onClick={handleMetamaskPay}>
                    {actualAmount !== null && actualAmount === 0 ? f('confirm') : 
                     <>
                     <svg
                        className="icon"
                        aria-hidden="true"
                        style={{
                            width: '17px',
                            height: '17px',
                            marginRight: '6px',
                            cursor: 'pointer',
                            verticalAlign: 'middle'
                        }}
                        >
                        <use xlinkHref="#icon-metamask-fox"></use>
                    </svg>
                    {f('payByMetamask')}</>}
                </Button>
            </div>
        </div>
    </Modal>);
}
