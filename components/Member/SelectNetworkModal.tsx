import { Button, Modal, Radio, RadioChangeEvent } from "antd";
import { useState } from "react";
import { useIntl } from "react-intl";

interface SelectNetworkModalProps {
    visible: boolean,
    setVisible: (visible: boolean) => void,
    handleOk: (chainType: number) => void,
}

export default function SelectNetworkModal({visible,setVisible,handleOk}: SelectNetworkModalProps) {
    const { formatMessage } = useIntl();
    const f = (id: string) => formatMessage({ id });
    
    const [chainType,setChainType] = useState(0);

    const handleChainTypeChange = (e: RadioChangeEvent) => {
        setChainType(e.target.value)
    }

    return (
        <Modal
                title={f('selectNetwork')}
                visible={visible}
                footer={null}
                className="select-charge-chain-dialog"
                closable={false}
            >
                <div style={{textAlign: 'center'}}>
                    <Radio.Group onChange={handleChainTypeChange} value={chainType}>
                        <Radio value={0}>Ethereum main network</Radio>
                        <Radio value={1}>Binance Smart Chain</Radio>
                    </Radio.Group>
                    <div className="footer">
                        <Button type="text" style={{color: '#666666'}} onClick={()=> {setVisible(false)}}>Cancel</Button>
                        <Button type="primary" style={{marginLeft: '40px'}} onClick={() => {
                            handleOk(chainType);
                            setVisible(false);
                        }}>OK</Button>
                    </div>
                </div>
            </Modal>
    );
}