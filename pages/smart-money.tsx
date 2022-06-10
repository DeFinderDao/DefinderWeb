import "styles/smart-money.less"
import SmartMoneyHeader from "components/SmartMoney/SmartMoneyHeader";
import { Menu, Dropdown } from "antd";
import { DownOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from "react-redux";
import type { MenuInfo } from 'rc-menu/lib/interface';
import { changeShowTab, changeAddressType } from "redux/actions/SmartMoneyAction";
import { AppState } from "redux/reducers";
import { Divider } from 'antd';
import SMTransferData from "components/SmartMoney/TransferData/Index";
import TransactionData from "components/SmartMoney/TransactionData/Index";
import HoldInfo from "components/SmartMoney/HoldInfo/HoldInfo";
import { useIntl } from "react-intl";
import AddressTypeDropdown from "components/SmartMoney/AddressTypeDropdown";
import SubscriptionSmartMoney from "components/Subscription/smartMoney";

export default function SmartMoney() {
    const { formatMessage } = useIntl();
    const f = (id: string) => formatMessage({ id });
    const dispatch = useDispatch();

    const userInfo = useSelector((state: AppState) => state.userInfo)

    const handleMenuClick = (e: MenuInfo) => {
        if (e.key) {
            dispatch(changeShowTab(e.key as string));
        }
    }
    const { showTab, addressType } = useSelector((state: AppState) => state.smartMoneyReducer);
    const handleDropdownClick = (type: string) => {
        dispatch(changeAddressType(type));
    }

    const showComponent = showTab === 'trade' ? <Trade /> : showTab === 'transfer' ? <Transfer /> : <HoldInfo />

    return (
        <div className="smart-money">
            <SmartMoneyHeader />

            {userInfo.level == 1 ?
                <>
                    <Menu className="menu-header" onClick={handleMenuClick} selectedKeys={[showTab]} mode="horizontal">
                        <Menu.Item key="trade">{f('tradeData')}</Menu.Item>
                        {/* <Menu.Item key="transfer">{f('transferRecords')}</Menu.Item> */}
                        <Menu.Item key="hold">{f('holdInfo')}</Menu.Item>
                        <Menu.Item disabled key="disabled">
                            <AddressTypeDropdown addressType={addressType} handleDropdownClick={handleDropdownClick} />
                        </Menu.Item>
                    </Menu>
                    <div className="content">
                        {showComponent}
                    </div>
                </>
                :
                <SubscriptionSmartMoney />
            }
        </div>);
}

function Trade() {
    return (
        <div>
            <TransactionData />
        </div>
    )
}

function Transfer() {
    return (
        <div>
            <SMTransferData />
        </div>
    )
}