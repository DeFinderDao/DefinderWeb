import { Table } from "antd";
import { ColumnsType, Key, SorterResult, TableCurrentDataSource, TablePaginationConfig } from "antd/lib/table/interface";
import AddressDetail from "components/MarketComponents/AddressDetail";
import UpdateTimeCom from "components/UpdateTimeCom";
import WaterMarkContent from "components/WaterMarkContent";
import { PrimitiveType, FormatXMLElementFn } from "intl-messageformat";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { getSMInfoRankList } from "redux/actions/SmartMoneyInfoAction";
import { AppState } from "redux/reducers";
import { ColumnsItem, SMInfoRankListParams, SMInfoRankListResponse } from "redux/types/SmartMoneyInfoTypes";
import { SMCateroryItem } from "redux/types/SmartMoneyTypes";
import { DefaultLocale, NOT_A_NUMBER } from "utils/env";
import Global from "utils/Global";
import SMAddressType from "./SMAddressType";

interface CurrencyHoldingRankingProps {
  categoryData: SMCateroryItem[],
  symbolAddr: string,
  symbol: string,
}
export default function CurrencyHoldingRanking({ symbolAddr, symbol, categoryData }: CurrencyHoldingRankingProps) {
  const { formatMessage } = useIntl()
  const f = (id: string) => formatMessage({ id })
  const router = useRouter()
  const { locale = DefaultLocale } = router
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
      getSMInfoRankList(arr)
    )
  }
  const infoLoading = useSelector(
    (state: AppState) => state.smartMoneyInfoReducer.infoLoading
  )
  const infoList = useSelector(
    (state: AppState) => state.smartMoneyInfoReducer.infoList
  )
  const infoListUpdateTime = useSelector(
    (state: AppState) => state.smartMoneyInfoReducer.infoListUpdateTime
  )

  const [tableCondition, setTableCondition] = useState<SMInfoRankListParams>({
    symbolAddr: symbolAddr,
    addressType: '0',
    sortType: undefined,
    sortField: undefined,
    pageNo: 1,
    pageSize: 10,
  })
  useEffect(() => {
    dispatchType({
      symbolAddr: symbolAddr,
      addressType: tableCondition.addressType,
      sortType: undefined,
      sortField: undefined,
      pageSize: 10,
      pageNo: 1,
    })
  }, [tableCondition.addressType, symbolAddr])
  const tableChange = (pagination: TablePaginationConfig, sorter: SorterResult<any> | SorterResult<any>[]) => {
    //
    let field = Array.isArray(sorter) ? sorter[0].field : sorter.field;
    let order = Array.isArray(sorter) ? sorter[0].order : sorter.order;
    const sortField = order ? field as string : undefined;
    const sortType = order ? (order === 'ascend' ? 1 : 0) : undefined;
    setTableCondition({
      ...tableCondition,
      sortField,
      sortType,
      pageNo: tableCondition.pageNo == pagination.current as number ? 1 : pagination.current as number,
      pageSize: pagination.pageSize as number,
    })
    dispatchType({
      ...tableCondition,
      sortField,
      sortType,
      pageNo: tableCondition.pageNo == pagination.current as number ? 1 : pagination.current as number,
      pageSize: pagination.pageSize as number,
    })
  }

  return (
    <div className="block-item item-small">
      <div className="item-title">
        <span>
          {f('currencyHoldingRankingTitle')}
        </span>
        <UpdateTimeCom updateTime={infoListUpdateTime} />
      </div>
      <div className="item-title">
        <span>
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
          symbolAddr={symbolAddr}
          symbol={symbol}
          locale={locale as string}
          params={{
            loading: infoLoading,
            pageNo: tableCondition.pageNo,
            pageSize: tableCondition.pageSize,
          }}
          groupList={infoList}
          handleTableChange={(pagination, filters, sorter, extra) => {
            tableChange(pagination, sorter)
          }}
        />
        <WaterMarkContent bottom={70} />
      </div>
    </div>
  )
}


interface TableProps {
  locale: string,
  symbolAddr: string,
  symbol: string,
  params: {
    loading: boolean,
    pageNo: number | undefined,
    pageSize: number | undefined,
  },
  groupList: SMInfoRankListResponse | null,
  handleTableChange: (pagination: TablePaginationConfig, filters: Record<string, (Key | boolean)[] | null>, sorter: SorterResult<ColumnsItem> | SorterResult<ColumnsItem>[], extra: TableCurrentDataSource<ColumnsItem>) => void;
}
function TableRanking({ symbol, symbolAddr, locale, params, groupList, handleTableChange }: TableProps) {
  const { formatMessage } = useIntl()
  const f = (id: string, value?: Record<string, PrimitiveType | FormatXMLElementFn<string, string>> | undefined) => formatMessage({ id }, value)

  function showMoney({ text }: { text: string }) {
    const prefix = Number(text) >= 0 ? '+' : '-';
    if (text) {
      text = text.startsWith('-') ? text.substring(1, text.length) : text;
    }
    return (
      <>
        {text ? `${prefix}$${Global.formatBigNum(text)}` : NOT_A_NUMBER}
      </>
    );
  }
  const columns: ColumnsType<ColumnsItem> = [
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
      title: f('smInfoHoldVolum'),
      dataIndex: 'holdAmount',
      key: 'holdAmount',
      sorter: true,
      sortDirections: ['descend' as const, 'ascend' as const],
      render: (text, record) => {
        return <span>{Global.formatBigNum(record.holdAmount)}</span>
      },
    },
    {
      title: f('smInfoRate'),
      dataIndex: 'holdRate',
      key: 'holdRate',
      align: 'right',
      render: (text, record) => {
        return <span>{record.holdRate}%</span>
      },
    },
    {
      title: f('smInfoHoldNum', { num: '24H' }),
      dataIndex: 'holdChange24h',
      key: 'holdChange24h',
      align: 'right',
      className: 'table-right-0',
      sorter: true,
      sortDirections: ['descend' as const, 'ascend' as const],
      render: (text, record) => {
        return showMoney({ text: record.holdChange24h })
      },
    },
    {
      title: `/${f('smInfoHoldRate')}`,
      dataIndex: 'holdChange24hRate',
      key: 'holdChange24hRate',
      width: 100,
      align: 'left',
      className: 'table-left-0',
      sorter: true,
      sortDirections: ['descend' as const, 'ascend' as const],
      render: (text, record) => {
        return <span>&nbsp;{Global.formatIncreaseNumber(record.holdChange24hRate)}</span>
      },
    },
    {
      title: f('smInfoHoldNum', { num: '3D' }),
      dataIndex: 'holdChange3d',
      key: 'holdChange3d',
      align: 'right',
      className: 'table-right-0',
      sorter: true,
      sortDirections: ['descend' as const, 'ascend' as const],
      render: (text, record) => {
        return showMoney({ text: record.holdChange3d })
      },
    },
    {
      title: `/${f('smInfoHoldRate')}`,
      dataIndex: 'holdChange3dRate',
      key: 'holdChange3dRate',
      width: 100,
      align: 'left',
      className: 'table-left-0',
      sorter: true,
      sortDirections: ['descend' as const, 'ascend' as const],
      render: (text, record) => {
        return <span>&nbsp;{Global.formatIncreaseNumber(record.holdChange3dRate)}</span>
      },
    },
    {
      title: f('smInfoCostPrice'),
      dataIndex: 'costPrice',
      key: 'costPrice',
      sorter: true,
      sortDirections: ['descend' as const, 'ascend' as const],
      render: (text, record) => {
        return showMoney({ text: record.costPrice })
      },
    },
    {
      title: f('smInfoProfit'),
      dataIndex: 'profit',
      key: 'profit',
      sorter: true,
      sortDirections: ['descend' as const, 'ascend' as const],
      render: (text, record) => {
        return <span>{Global.formatFluctuationRange(record.profit)}</span>
      },
    },
    {
      title: f('smInfoProfitRate'),
      dataIndex: 'profitRate',
      key: 'profitRate',
      sorter: true,
      sortDirections: ['descend' as const, 'ascend' as const],
      render: (text, record) => {
        return <span>{Global.formatIncreaseNumber(record.profitRate)}</span>
      },
    },
    {
      title: f('smInfoOrders'),
      dataIndex: 'orders',
      key: 'orders',
      sorter: true,
      sortDirections: ['descend' as const, 'ascend' as const],
    },
    {
      title: f('smInfoTimestamp'),
      dataIndex: 'firstTime',
      key: 'firstTime',
      align: 'right',
      sorter: true,
      sortDirections: ['descend' as const, 'ascend' as const],
      render: (text, record) => {
        return Global.distanceFromCurrent(record.firstTime, locale, true)
      },
    },
  ]
  return (
    <Table
      rowKey="address"
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