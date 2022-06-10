import { Menu } from "antd";
import { useState } from "react";
import { useIntl } from "react-intl";
import type { MenuInfo } from 'rc-menu/lib/interface'
import CurrencyAddrRank from "./CurrencyAddrRank";
import SMAddrRank from "./SMAddrRank";

interface AddressRankProps {
  symbolAddr: string,
  symbol: string,
}

export default function AddressRank({
  symbolAddr,
  symbol,
}: AddressRankProps) {
  const { formatMessage } = useIntl()
  const f = (id: string) => formatMessage({ id })

  const [current, setCurrent] = useState<string>('Token')
  const menuClick = (e: MenuInfo) => {
    setCurrent(e.key)
  }

  return (
    <>
      <Menu
        selectedKeys={[current as string]}
        mode="horizontal"
        style={{ background: 'transparent', borderBottom: 0, color: '#fff', width: 900, fontSize: 20, marginLeft: '-20px' }}
        onClick={menuClick}
      >
        <Menu.Item key="Token">
          {f('marketDetailAddrRankTitle')}
        </Menu.Item>
        <Menu.Item key="SM">
          {f('marketDetailSMRankTitle')}
        </Menu.Item>
      </Menu>

      {current == 'Token' ?
        <CurrencyAddrRank
          flex="row"
          symbolAddr={symbolAddr}
          showMore={true}
          symbol={symbol}
        />
        :
        <SMAddrRank
          flex="row"
          symbolAddr={symbolAddr}
          showMore={true}
          symbol={symbol}
        />
      }
    </>
  )
}