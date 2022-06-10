import { message, Radio } from "antd";
import { useIntl } from "react-intl";
import { PrimitiveType, FormatXMLElementFn } from "intl-messageformat";
import { useEffect, useState } from "react";
import { CODE_SUCCESS } from "utils/ApiServerError";
import ApiClient from "utils/ApiClient";
import Global from "utils/Global";
import { SMCateroryItem } from "redux/types/SmartMoneyTypes";
import SMAddressType from "./SMAddressType";
import { DefaultLocale, NOT_A_NUMBER } from "utils/env";
import { useRouter } from "next/router";
import UpdateTimeCom from "components/UpdateTimeCom";

interface TransactionDataProps {
  categoryData: SMCateroryItem[],
  symbolAddr: string,
  symbol: string,
}
interface DataProps {
  netBuyAddrCount: number, 
  netSellAddrCount: number,
  swapInAmount: number, 
  swapInValue: number, 
  swapOutAmount: number,
  swapOutValue: number, 
  holdAmount: number, 
  holdValue: number,
  swapCount: number, 
  swapInAvgPrice: number, 
  swapOutAvgPrice: number,
}
export default function TransactionData({ symbolAddr, symbol, categoryData }: TransactionDataProps) {
  const { formatMessage } = useIntl()
  const f = (id: string, value?: Record<string, PrimitiveType | FormatXMLElementFn<string, string>> | undefined) => formatMessage({ id }, value)
  const apiClient = new ApiClient<DataProps>()
  const router = useRouter();
  const { locale = DefaultLocale } = router;

  const [addressType, setAddressType] = useState("0")
  const handleDropdownClick = (type: string) => {
    setAddressType(type);
  }

  const [timeChoose, setTimeChoose] = useState("2")
  const timeTitle = ['24H', '3D', '7D', '30D', '4H']
  const [data, setData] = useState<DataProps | null>()
  const [updateTime, setUpdateTime] = useState<number | null>()
  const getData = async (addressType: string, timeChoose: string, symbolAddr: string) => {
    try {
      const data = await apiClient.post(`/smart/money/swap/base`, {
        data: {
          addressType: addressType,
          dateType: timeChoose,
          symbolAddr: symbolAddr
        },
      })
      if (data.code === CODE_SUCCESS) {
        setData(data.data ? data.data : null)
        setUpdateTime(data.updateTime)
      } else {
        message.error(data.message)
      }
    } catch (e) {
      message.error((e as unknown as Error).message)
    }
  }
  useEffect(() => {
    getData(addressType, timeChoose, symbolAddr)
  }, [addressType, timeChoose, symbolAddr])

  return (
    <div className="block-item item-small">
      <div className="item-title">
        <span>
          {f('transactionDataTitle')}
        </span>
        <UpdateTimeCom updateTime={updateTime} />
      </div>
      <div className="item-title">
        <span>
        </span>
        <div className="defi-radio-group-time">
          <div style={{ display: 'flex', alignItems: 'center', marginRight: 30 }}>
            <div style={{ marginRight: 10, fontSize: 14 }}>
              <SMAddressType smCategories={categoryData} addressType={addressType} handleDropdownClick={handleDropdownClick} />
            </div>
          </div>
          <Radio.Group
            defaultValue={timeChoose}
            buttonStyle="solid"
            onChange={(e) => {
              setTimeChoose(e.target.value,)
            }}
          >
            <Radio.Button value="4">
              {f('marketDetailTimeChoose30Days')}
            </Radio.Button>
            <Radio.Button value="3">
              {f('marketDetailTimeChoose7Days')}
            </Radio.Button>
            <Radio.Button value="2">
              {f('marketDetailTimeChoose3Days')}
            </Radio.Button>
            <Radio.Button value="1">
              {f('marketDetailTimeChoose24Hours')}
            </Radio.Button>
            <Radio.Button value="5">
              {f('marketDetailTimeChoose4Hours')}
            </Radio.Button>
          </Radio.Group>
        </div>
      </div>
      <div className="comparison">
        <div className="sm-data-box">
          <DataItem title={f('netBuyingAddresses', { day: timeTitle[Number(timeChoose) - 1] })} num={Global.formatBigNum(data?.netBuyAddrCount)} />
          <DataItem title={f('netSellingAddresses', { day: timeTitle[Number(timeChoose) - 1] })} num={Global.formatBigNum(data?.netSellAddrCount)} />
          <DataItem title={f('currentPosition')} num={`${Global.formatBigNum(data?.holdAmount)} ${symbol}`} dollar={Global.formatBigNum(data?.holdValue)} />
          <DataItem title={f('transactionsNumber', { day: timeTitle[Number(timeChoose) - 1] })} num={Global.formatBigNum(data?.swapCount)} right={0} />
        </div>
        <div className="sm-data-box">
          <DataItem title={f('DEXBuyingVolume', { day: timeTitle[Number(timeChoose) - 1] })} num={`${Global.formatBigNum(data?.swapInAmount)} ${symbol}`} dollar={Global.formatBigNum(data?.swapInValue)} />
          <DataItem title={f('DEXSellingVolume', { day: timeTitle[Number(timeChoose) - 1] })} num={`${Global.formatBigNum(data?.swapOutAmount)} ${symbol}`} dollar={Global.formatBigNum(data?.swapOutValue)} />
          <DataItem title={f('averageBuyingPrice', { day: timeTitle[Number(timeChoose) - 1] })} num={data?.swapInAvgPrice === null ? `${NOT_A_NUMBER}` : `$ ${Global.formatBigNum(data?.swapInAvgPrice)}`} />
          <DataItem title={f('averageSellingPrice', { day: timeTitle[Number(timeChoose) - 1] })} num={data?.swapOutAvgPrice === null ? `${NOT_A_NUMBER}`:`$ ${Global.formatBigNum(data?.swapOutAvgPrice)}`} right={0} />
        </div>
      </div>
    </div>
  )
}

interface DataItemProps {
  title: string,
  num: string,
  dollar?: string,
  right?: number
}
function DataItem({ title, num, dollar, right = 20 }: DataItemProps) {
  return (
    <div className="sm-data-item" style={{ marginRight: right }}>
      <span className="title">{title}</span>
      <span className="num">{num}</span>
      {dollar ? <span className="dollar">$≈ {dollar}</span> : null}
    </div>
  )
}