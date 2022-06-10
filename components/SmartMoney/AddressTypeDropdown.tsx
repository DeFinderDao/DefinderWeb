import { Dropdown, Menu } from "antd";
import { useIntl } from "react-intl";
import { DownOutlined } from '@ant-design/icons';
import type { MenuInfo } from 'rc-menu/lib/interface';
import type { AppState } from "redux/reducers";
import { useSelector } from "react-redux";

export type AddressTypeDropdownProps = {
  addressType: string,
  handleDropdownClick: (type: string) => void
}

export default function AddressTypeDropdown({ addressType, handleDropdownClick }: AddressTypeDropdownProps) {
  const { formatMessage } = useIntl();
  const f = (id: string) => formatMessage({ id });
  const { smCategories } = useSelector((state: AppState) => state.smartMoneyReducer);
  //smCategories
  const addressTypeText = addressType === '0' ? f('all') : smCategories.find(item => item.type === addressType)?.category;

  const handleAddressTypeClick = (e: MenuInfo) => {
    if (e.key) {
      handleDropdownClick(e.key as string);
    }
  }
  
  const addressTypeMenu = (
    <Menu onClick={handleAddressTypeClick}>
      <Menu.Item key="0">
        {f('all')}
      </Menu.Item>
      {
        smCategories.map(item => {
          return (<Menu.Item key={item.type}>{item.category}</Menu.Item>)
        })
      }
    </Menu>
  );

  return (
    <Dropdown overlay={addressTypeMenu}>
      <div>{f('addressType')} {addressTypeText} <DownOutlined /></div>
    </Dropdown>
  );
}