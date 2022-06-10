import { Radio, RadioChangeEvent, Table, TablePaginationConfig, Tooltip } from "antd";
import { QuestionCircleOutlined } from '@ant-design/icons'
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { PrimitiveType, FormatXMLElementFn } from "intl-messageformat";
import { Key, useEffect, useState } from "react";
import { NFTHoldRankListItem, NFTHoldRankParams, ResponseBodyList } from "redux/types/NFTAnalyseHoldTypes";
import { ColumnsType, SorterResult, TableCurrentDataSource } from "antd/lib/table/interface";
import Global from "utils/Global";
import WaterMarkContent from "components/WaterMarkContent";
import { AppState } from "redux/reducers";
import { getNFTHoldRankList } from "redux/actions/NFTAnalyseHoldAction";
import Link from "next/link";
import { useRouter } from "next/router";
import { DefaultLocale } from "utils/env";
import UpdateTimeCom from "components/UpdateTimeCom";
import GlobalLabel from "components/GlobalLabel";

export default function NFTHoldProfitRank({ symbol, symbolAddr }: { symbol: string, symbolAddr: string }) {
  const { formatMessage } = useIntl();
  const f = (id: string, value?: Record<string, PrimitiveType | FormatXMLElementFn<string, string>> | undefined) => formatMessage({ id }, value);
  const dispatch = useDispatch()
  const router = useRouter();
  const { locale = DefaultLocale } = router;

  const rankLoading = useSelector((state: AppState) => state.NFTAnalyseHoldReducer.rankLoading)
  const rankList = useSelector((state: AppState) => state.NFTAnalyseHoldReducer.rankList)
  const rankListupdateTime = useSelector((state: AppState) => state.NFTAnalyseHoldReducer.rankListupdateTime)

  const [condition, setCondition] = useState<NFTHoldRankParams>({
    symbolAddr: symbolAddr,
    pageNo: 1,
    pageSize: 20,
    type: 1, 
    sortFiled: undefined, 
    sort: undefined, 
  })
  const rankDispatch = (params: NFTHoldRankParams) => {
    setCondition(params)
    dispatch(getNFTHoldRankList(params))
  }
  useEffect(() => {
    rankDispatch(condition)
  }, [symbolAddr])
  const handleOptionalTableChange = (pagination: TablePaginationConfig, filters: Record<string, (Key | boolean)[] | null>, sorter: SorterResult<any> | SorterResult<any>[], extra: TableCurrentDataSource<any>) => {
    
    let field = Array.isArray(sorter) ? sorter[0].field : sorter.field;
    let order = Array.isArray(sorter) ? sorter[0].order : sorter.order;
    const sortFiled = order ? field as string : undefined;
    const sort = order ? (order === 'ascend' ? 1 : 2) : undefined;
    rankDispatch({
      ...condition,
      symbolAddr: condition.symbolAddr,
      pageNo: condition.pageNo == pagination.current as number ? 1 : pagination.current as number,
      pageSize: pagination.pageSize,
      sortFiled,
      sort,
    })
  }

  const options = [
    { label: f('nftHoldRankRadio2'), value: '2', disabled: rankList.whaleNum > 0 ? false : true },
    { label: f('nftHoldRankRadio1'), value: '1' },
  ];
  const [radioValue, setRadioValue] = useState('1')
  const radioValueChange = (e: RadioChangeEvent) => {
    setRadioValue(e.target.value)
    rankDispatch({
      ...condition,
      pageNo: 1,
      type: e.target.value,
    })
  }
  return (
    <div className="block-item item-small">
      <div className="item-title">
        <div>
          <span>{f('nftHoldProfitRankTitle')}</span>
          <span className="title-desc">{f('nftHoldProfitRankPersonNum', { num: rankList.whaleNum || 0 })}</span>
          <Tooltip
            placement="right"
            title={f('nftHoldProfitRankDesc')}
          >
            <QuestionCircleOutlined
              style={{
                color: '#BEC4CC',
                fontSize: '16px',
                marginLeft: '10px',
              }}
            />
          </Tooltip>
        </div>
        <div>
          <UpdateTimeCom updateTime={rankListupdateTime} style={{ marginRight: 30 }} />
          <Radio.Group
            options={options}
            onChange={radioValueChange}
            value={radioValue}
            optionType="button"
            buttonStyle="solid"
          />
        </div>
      </div>
      <div
        className="common-table"
        style={{ boxShadow: 'none', padding: '0 0 20px', margin: '20px 0 0' }}
      >
        <WaterMarkContent />
        <TableList
          params={{
            symbol: symbol,
            loading: rankLoading,
            pageNo: condition.pageNo,
            pageSize: condition.pageSize,
          }}
          groupList={rankList}
          handleTableChange={handleOptionalTableChange}
        />
      </div>
    </div>
  )
}


interface TableListProps {
  params: {
    symbol: string,
    loading: boolean,
    pageNo: number | undefined,
    pageSize: number | undefined,
  },
  groupList: ResponseBodyList | null,
  handleTableChange: (pagination: TablePaginationConfig, filters: Record<string, (Key | boolean)[] | null>, sorter: SorterResult<NFTHoldRankListItem> | SorterResult<NFTHoldRankListItem>[], extra: TableCurrentDataSource<NFTHoldRankListItem>) => void;
}

function TableList({ params, groupList, handleTableChange }: TableListProps) {
  const { formatMessage } = useIntl()
  const f = (id: string, value?: Record<string, PrimitiveType | FormatXMLElementFn<string, string>> | undefined) => formatMessage({ id }, value)

  const groupItem = (num: string | number, rate: number | number, color?: boolean) => {
    // if (rate < 0) {
    //   rate = 0
    // } else 
    if (Math.abs(rate) > 100) {
      rate = 100
    }
    return (
      <div className="grid-item-box" >
        <span className="grid-item-value">{Global.formatBigNum(num)}</span>
        {num ?
          <div className="grid-item-rate">
            <div style={color ? { width: `${Math.abs(rate)}%`, backgroundColor: num > 0 ? '#44be90' : '#ef5f81' } : { width: `${Math.abs(rate)}%` }}></div>
          </div>
          :
          null
        }
      </div>
    )
  }
  const groupColumns: ColumnsType<NFTHoldRankListItem> = [
    {
      title: f('nftHoldRankAddress'),
      dataIndex: 'address',
      key: 'address',
      render: (text: any, record: NFTHoldRankListItem) => {
        return (
          <GlobalLabel addr={record.address} label={record.addressLabel} link="/address-analyse/" />
        )
      },
    },
    {
      title: f('nftHoldRankHoldValues'),
      dataIndex: 'holdValues',
      key: 'holdValues',
      sorter: true,
      sortDirections: ['descend' as const, 'ascend' as const],
      render: (text, record) => {
        return groupItem(record.holdValues, record.holdValuesRate)
      },
    },
    {
      title: () => {
        return (
          <span>
            {f('nftHoldRankTotalValues', { symbol: params.symbol })}
            <Tooltip
              placement="top"
              title={<div>{f('nftHoldRankTotalValuesDesc')}</div>}
            >
              <QuestionCircleOutlined
                style={{
                  fontSize: '14px',
                  marginLeft: '2px',
                }}
              />
            </Tooltip>
          </span>
        )
      },
      dataIndex: 'totalValues',
      key: 'totalValues',
      showSorterTooltip: false,
      sorter: true,
      sortDirections: ['descend' as const, 'ascend' as const],
      render: (text, record) => {
        return groupItem(record.totalValues, record.totalValuesRate)
      },
    },
    {
      title: () => {
        return (
          <span>
            {f('nftHoldRankEstHvValues', { symbol: params.symbol })}
            <Tooltip
              placement="top"
              title={<div>{f('nftHoldRankEstHvValuesDesc')}</div>}
            >
              <QuestionCircleOutlined
                style={{
                  fontSize: '14px',
                  marginLeft: '2px',
                }}
              />
            </Tooltip>
          </span>
        )
      },
      dataIndex: 'estHvValues',
      key: 'estHvValues',
      showSorterTooltip: false,
      sorter: true,
      sortDirections: ['descend' as const, 'ascend' as const],
      render: (text, record) => {
        return groupItem(record.estHvValues, record.estHvValuesRate)
      },
    },
    {
      title: f('nftHoldRankTotalCost', { symbol: params.symbol }),
      dataIndex: 'totalCost',
      key: 'totalCost',
      sorter: true,
      sortDirections: ['descend' as const, 'ascend' as const],
      render: (text, record) => {
        return groupItem(record.totalCost, record.totalCostRate)
      },
    },
    {
      title: f('nftHoldRankTotalRevenue', { symbol: params.symbol }),
      dataIndex: 'totalRevenue',
      key: 'totalRevenue',
      sorter: true,
      sortDirections: ['descend' as const, 'ascend' as const],
      render: (text, record) => {
        return groupItem(record.totalRevenue, record.totalRevenueRate)
      },
    },
    {
      title: () => {
        return (
          <span>
            {f('nftHoldRankRealizedIncome', { symbol: params.symbol })}
            <Tooltip
              placement="top"
              title={<div>{f('nftHoldRankRealizedIncomeDesc')}</div>}
            >
              <QuestionCircleOutlined
                style={{
                  fontSize: '14px',
                  marginLeft: '2px',
                }}
              />
            </Tooltip>
          </span>
        )
      },
      dataIndex: 'realizedIncome',
      key: 'realizedIncome',
      showSorterTooltip: false,
      sorter: true,
      sortDirections: ['descend' as const, 'ascend' as const],
      render: (text, record) => {
        return groupItem(record.realizedIncome, record.realizedIncomeRate, true)
      },
    },
    {
      title: () => {
        return (
          <span>
            {f('nftHoldRankEstimateProfitRate', { symbol: params.symbol })}
            <Tooltip
              placement="top"
              title={<div>{f('nftHoldRankEstimateProfitRateDesc')}</div>}
            >
              <QuestionCircleOutlined
                style={{
                  fontSize: '14px',
                  marginLeft: '2px',
                }}
              />
            </Tooltip>
          </span>
        )
      },
      dataIndex: 'estimateProfit',
      key: 'estimateProfit',
      showSorterTooltip: false,
      sorter: true,
      sortDirections: ['descend' as const, 'ascend' as const],
      render: (text, record) => {
        return groupItem(record.estimateProfit, record.estimateProfitRate as number, true)
      },
    },
  ]
  return (
    <Table
      rowKey="address"
      columns={groupColumns}
      pagination={{
        showQuickJumper: true,
        showSizeChanger: false,
        current: params.pageNo,
        pageSize: params.pageSize,
        total: groupList?.totalSize,
        position: ['bottomCenter'],
      }}
      dataSource={groupList?.list}
      loading={params.loading}
      onChange={handleTableChange}
    />
  )
}