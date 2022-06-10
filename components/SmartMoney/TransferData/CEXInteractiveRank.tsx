import { Radio, RadioChangeEvent, Table, TablePaginationConfig, Tooltip } from "antd";
import { ColumnType, SorterResult, TableCurrentDataSource } from "antd/lib/table/interface";
import { QuestionCircleOutlined } from '@ant-design/icons'
import Link from "next/link";
import { Key, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { getSMCEXRankList } from "redux/actions/SmartMoney/TransferData/CEXInteractiveRankAction";
import { AppState } from "redux/reducers";
import { ColumnsItem, SMCEXRankListParams } from "redux/types/SmartMoney/TransferData/CEXInteractiveRankTypes";
import Global from "utils/Global";
import WaterMarkContent from "components/WaterMarkContent";


interface CEXInteractiveRankProps {
  addressType: string,
}
export default function CEXInteractiveRank() {
  const { formatMessage } = useIntl()
  const f = (id: string) => formatMessage({ id })
  const dispatch = useDispatch()

  const { addressType } = useSelector((state: AppState) => state.smartMoneyReducer);

  const [smCEXRankListCondition, setSmCEXRankListCondition] =
    useState<SMCEXRankListParams>({
      addressType: addressType, 
      sortField: null, 
      sortType: null, 
      pageSize: 10,
      pageNo: 1,
      dateType: '2', // 30d, 7d, 3d, 24h, 4h
    })

  useEffect(() => {
    setSmCEXRankListCondition({
      ...smCEXRankListCondition,
      addressType: addressType,
      pageSize: 10,
      pageNo: 1,
    })
    dispatch(
      getSMCEXRankList({
        ...smCEXRankListCondition,
        addressType: addressType,
        pageSize: 10,
        pageNo: 1,
      })
    )
  }, [addressType])

  const CEXLoading = useSelector(
    (state: AppState) => state.CEXInteractiveRankReducer.CEXLoading
  )
  const CEXRankList = useSelector(
    (state: AppState) => state.CEXInteractiveRankReducer.CEXRankList
  )

  const [radioType, setRadioType] = useState('2')
  const radioChange = (e: RadioChangeEvent) => {
    setRadioType(e.target.value)
    setSmCEXRankListCondition({
      ...smCEXRankListCondition,
      dateType: e.target.value,
    })
    dispatch(
      getSMCEXRankList({
        ...smCEXRankListCondition,
        dateType: e.target.value,
      }))
  }

  const handleChange = (pagination: TablePaginationConfig, filters: Record<string, (Key | boolean)[] | null>, sorter: SorterResult<ColumnsItem> | SorterResult<ColumnsItem>[], extra: TableCurrentDataSource<ColumnsItem>) => {
    const { key, order } = sorterCall(sorter)
    setSmCEXRankListCondition({
      ...smCEXRankListCondition,
      pageNo: smCEXRankListCondition.pageNo == pagination.current as number ? 1 : pagination.current as number,
      pageSize: pagination.pageSize as number,
      sortField: key as string,
      sortType: order
    })
    dispatch(
      getSMCEXRankList({
        ...smCEXRankListCondition,
        pageNo: smCEXRankListCondition.pageNo == pagination.current as number ? 1 : pagination.current as number,
        pageSize: pagination.pageSize as number,
        sortField: key as string,
        sortType: order
      }))
  }
  const sorterCall = (sorter: SorterResult<ColumnsItem> | SorterResult<ColumnsItem>[]) => {
    if (!Array.isArray(sorter)) {
      if (sorter.order == 'descend') {
        return { key: sorter.columnKey, order: '0' }
      } else if (sorter.order == 'ascend') {
        return { key: sorter.columnKey, order: '1' }
      } else {
        return { key: null, order: null }
      }
    } else {
      return { key: null, order: null }
    }
  }

  const columnsRow: ColumnType<ColumnsItem>[] = [
    {
      title: f('smToken'),
      dataIndex: 'symbol',
      key: 'symbol',
      render: (text, record) => {
        return <Link
          href={`/market-detail/market-page/${record.symbolAddr}`}
        >
          <a className="url-link">
            {record.symbol}
          </a>
        </Link>
      },
    },
    {
      title: f(`smCEXInAsset`),
      dataIndex: 'inAsset',
      key: 'inAsset',
      align: 'right',
      sorter: true,
      sortDirections: ['descend' as const, 'ascend' as const],
      render: (text, record) => {
        return <span>$ {Global.formatBigNum(record.inAsset)}</span>
      },
    },
    {
      title: f(`smCEXInCount`),
      dataIndex: 'inCount',
      key: 'inCount',
      sorter: true,
      sortDirections: ['descend' as const, 'ascend' as const],
      align: 'right',
      render: (text, record) => {
        return <span>{Global.formatBigNum(record.inCount)}</span>
      },
    },
    {
      title: f('smCEXOutAsset'),
      dataIndex: 'outAsset',
      key: 'outAsset',
      sorter: true,
      sortDirections: ['descend' as const, 'ascend' as const],
      align: 'right',
      render: (text, record) => {
        return <span>$ {Global.formatBigNum(record.outAsset)}</span>
      },
    },
    {
      title: f(`smCEXOutCount`),
      dataIndex: 'outCount',
      key: 'outCount',
      sorter: true,
      sortDirections: ['descend' as const, 'ascend' as const],
      align: 'right',
      render: (text, record) => {
        return <span>{Global.formatBigNum(record.outCount)}</span>
      },
    },
    {
      title: f('smCEXHoldAsset'),
      dataIndex: 'holdAsset',
      key: 'holdAsset',
      align: 'right',
      render: (text, record) => {
        return <span>$ {Global.formatBigNum(record.holdAsset)}</span>
      },
    },
  ]

  return (
    <>
      <div className="SM-block-item">
        < div className="item-title" >
          <div className="adapt-width">
            <span>
              {f("smCEXRankTitle")}
              <Tooltip
                placement="right"
                title={<div>{f(`smCEXRankTips`)}</div>}
              >
                <QuestionCircleOutlined
                  style={{
                    fontSize: '16px',
                    marginLeft: '10px',
                  }}
                />
              </Tooltip>
            </span>
          </div>
          <div className="defi-radio-group-time">
            <Radio.Group
              defaultValue={radioType}
              buttonStyle="solid"
              onChange={radioChange}
            >
              <Radio.Button value="4">
                {f('smTimeChoose30Days')}
              </Radio.Button>
              <Radio.Button value="3">
                {f('smTimeChoose7Days')}
              </Radio.Button>
              <Radio.Button value="2">
                {f('smTimeChoose3Days')}
              </Radio.Button>
              <Radio.Button value="1">
                {f('smTimeChoose24Hours')}
              </Radio.Button>
              <Radio.Button value="5">
                {f('smTimeChoose4Hours')}
              </Radio.Button>
            </Radio.Group>
          </div>
        </div >
        <div className="common-table" style={{ margin: '20px 0 0' }}>
          <Table
            rowKey="symbolAddr"
            className="buy-sell-table"
            loading={CEXLoading}
            columns={columnsRow}
            dataSource={CEXRankList?.list.slice(0, 10)}
            onChange={handleChange}
            pagination={{
              showQuickJumper: true,
              showSizeChanger: false,
              current: smCEXRankListCondition.pageNo,
              pageSize: smCEXRankListCondition.pageSize,
              total: CEXRankList?.totalSize as number,
              position: ['bottomCenter'],
            }}
          />
          <WaterMarkContent />
        </div>
      </div>
    </>
  )
}