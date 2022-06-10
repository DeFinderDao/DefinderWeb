import { Table } from "antd";
import { SwapRightOutlined, SwapLeftOutlined } from '@ant-design/icons'
import { ColumnsType, SorterResult, TableCurrentDataSource, TablePaginationConfig } from "antd/lib/table/interface";
import AddressDetail from "components/MarketComponents/AddressDetail";
import WaterMarkContent from "components/WaterMarkContent";
import { useRouter } from "next/router";
import { Key, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { getSMInfoRecordList } from "redux/actions/SmartMoneyInfoAction";
import { AppState } from "redux/reducers";
import { InfoRecordItem, SMInfoRankListParams, SMInfoRecordListResponse } from "redux/types/SmartMoneyInfoTypes";
import Global from "utils/Global";
import { SMCateroryItem } from "redux/types/SmartMoneyTypes";
import SMAddressType from "./SMAddressType";

interface TransactionRecordProps {
  categoryData: SMCateroryItem[],
  symbolAddr: string,
  symbol: string,
}
export default function TransactionRecord({ symbolAddr, symbol, categoryData }: TransactionRecordProps) {
  const { formatMessage } = useIntl()
  const f = (id: string) => formatMessage({ id })
  const router = useRouter()
  const { locale } = router
  const dispatch = useDispatch()

  const handleDropdownClick = (type: string) => {
    setTableCondition({
      ...tableCondition,
      addressType: type,
      pageNo: 1,
    })
  }
  const dispatchType = (arr: SMInfoRankListParams) => {
    dispatch(
      getSMInfoRecordList(arr)
    )
  }
  const infoRecordLoading = useSelector(
    (state: AppState) => state.smartMoneyInfoReducer.infoRecordLoading
  )
  const infoRecordList = useSelector(
    (state: AppState) => state.smartMoneyInfoReducer.infoRecordList
  )
  const [tableCondition, setTableCondition] = useState<SMInfoRankListParams>({
    symbolAddr: symbolAddr,
    addressType: '0',
    pageNo: 1,
    pageSize: 10,
  })
  useEffect(() => {
    dispatchType({
      symbolAddr: symbolAddr,
      addressType: tableCondition.addressType,
      pageSize: 10,
      pageNo: 1,
    })
  }, [tableCondition.addressType, symbolAddr])
  const tableChange = (pagination: TablePaginationConfig) => {
    setTableCondition({
      ...tableCondition,
      pageNo: pagination.current as number,
      pageSize: pagination.pageSize as number,
    })
    dispatchType({
      ...tableCondition,
      pageNo: pagination.current as number,
      pageSize: pagination.pageSize as number,
    })
  }

  return (
    <div className="block-item item-small">
      <div className="item-title">
        <span>
          {f('transactionRecordTitle')}
        </span>
        <div className="defi-radio-group-time">
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: 30 }}>
            <div style={{ marginLeft: 10, fontSize: 14 }}>
              <SMAddressType smCategories={categoryData} addressType={tableCondition.addressType} handleDropdownClick={handleDropdownClick} />
            </div>
          </div>
        </div>
      </div>
      <div
        className="common-table"
        style={{ boxShadow: 'none', padding: '0 0 20px', margin: '20px 0 0' }}
      >
        <TableRanking
          symbol={symbol}
          symbolAddr={symbolAddr}
          locale={locale as string}
          params={{
            loading: infoRecordLoading,
            pageNo: tableCondition.pageNo,
            pageSize: tableCondition.pageSize,
          }}
          groupList={infoRecordList}
          handleTableChange={(pagination) => {
            tableChange(pagination)
          }}
        />
        <WaterMarkContent bottom={70} />
      </div>
    </div>
  )
}


interface TableProps {
  symbol: string,
  symbolAddr: string,
  locale: string,
  params: {
    loading: boolean,
    pageNo: number | undefined,
    pageSize: number | undefined,
  },
  groupList: SMInfoRecordListResponse | null,
  handleTableChange: (pagination: TablePaginationConfig, filters: Record<string, (Key | boolean)[] | null>, sorter: SorterResult<InfoRecordItem> | SorterResult<InfoRecordItem>[], extra: TableCurrentDataSource<InfoRecordItem>) => void;
}
function TableRanking({ symbol, symbolAddr, locale, params, groupList, handleTableChange }: TableProps) {
  const { formatMessage } = useIntl()
  const f = (id: string) => formatMessage({ id })

  const TransactionBus = [
    <span style={{ color: '#1FA300', display: 'flex' }}>
      <SwapLeftOutlined />
    </span >,
    <span style={{ color: '#EF6D59', display: 'flex' }}>
      <SwapRightOutlined />
    </span>,
  ]
  const columns: ColumnsType<InfoRecordItem> = [
    {
      title: f('smInfoTime'),
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (text, record) => {
        return Global.distanceFromCurrent(record.timestamp, locale, true)
      },
    },
    {
      title: f('smInfoSymbolAddr'),
      dataIndex: 'address',
      width: 150,
      key: 'address',
      render: (text, record) => {
        return (
          <AddressDetail
            symbol={symbol}
            address={record.address}
            symbolAddr={symbolAddr}
            label={record.addressLabel}
            link={false}
            addrShow={false}
          />
        )
      },
    },
    {
      title: f('smInfoType'),
      dataIndex: 'direction',
      key: 'direction',
      render: (text, record) => {
        return (
          <>
            {
              Number(record.direction) == 1 ?
                <span className="defi-color-Increase">{f('smInfoTypeBuy')}</span>
                :
                <span className="defi-color-reduce">{f('smInfoTypeSell')}</span>
            }
          </>
        )
      },
    },
    {
      title: f('smInfoDetail'),
      dataIndex: 'value',
      key: 'value',
      render: (text, record) => {
        return (
          <>
            {
              Number(record.direction) == 1 ?
                <span>{Global.formatBigNum(record.makerAmount)}&nbsp;{record.makerToken}</span>
                :
                <span>{Global.formatBigNum(record.takerAmount)}&nbsp;{record.takerToken}</span>
            }
          </>
        )
      },
    },
    {
      title: ' ',
      dataIndex: 'price',
      key: 'price',
      width: 50,
      align: 'center',
      render: (text, record) => {
        return TransactionBus[Number(record.direction) - 1]
      },
    },
    {
      title: ' ',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right',
      render: (text, record) => {
        return (
          <>
            {
              Number(record.direction) == 1 ?
                <span>{Global.formatBigNum(record.takerAmount)}&nbsp;{record.takerToken}</span>
                :
                <span>{Global.formatBigNum(record.makerAmount)}&nbsp;{record.makerToken}</span>
            }
          </>
        )
      },
    },
    {
      title: f('smInfoPrice'),
      dataIndex: 'price',
      key: 'price',
      align: 'right',
      render: (text, record) => {
        return <span>{Global.formatBigNum(record.price)}&nbsp;{record.priceSymbol}</span>
      },
    },
    {
      title: f('smInfoPriceDoller'),
      dataIndex: 'usdPrice',
      key: 'usdPrice',
      align: 'right',
      render: (text, record) => {
        return <span>{Global.formatBigNum(record.usdPrice)}</span>
      },
    },
    {
      title: f('smInfoTxHash'),
      dataIndex: 'txHash',
      key: 'txHash',
      align: 'right',
      render: (text, record) => {
        return (
          <svg
            className="icon"
            aria-hidden="true"
            style={{ width: 16, height: 16, cursor: 'pointer' }}
            onClick={() => {
              window.open(record.txHash)
            }}>
            <use xlinkHref='#icon-etherscan'></use>
          </svg>
        )
      },
    }
  ]
  return (
    <Table
      rowKey={(record: InfoRecordItem) => {
        return `${record.txHash}--${record.index}`;
      }}
      columns={columns}
      pagination={{
        showQuickJumper: true,
        showSizeChanger: false,
        current: params.pageNo,
        pageSize: params.pageSize,
        total: groupList?.totalSize as number,
        position: ['bottomCenter'],
      }}
      dataSource={groupList?.list}
      loading={params.loading}
      onChange={handleTableChange}
    />
  )
}