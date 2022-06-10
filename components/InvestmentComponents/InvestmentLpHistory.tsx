import { Table } from 'antd';
import { ColumnsType, SorterResult, TableCurrentDataSource, TablePaginationConfig } from 'antd/lib/table/interface';
import { TokenLogo } from 'components/TokenLogo';
import WaterMarkContent from 'components/WaterMarkContent';
import { useRouter, NextRouter } from 'next/router';
import React, { useState, Key, useEffect } from 'react'
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { getInvestmentLpHistoryList, historyLpListLoading } from 'redux/actions/InvestmentDetails/InvestmentLpHistoryAction';
import { AppState } from 'redux/reducers';
import { InvestmentLpHistoryItem, InvestmentLpHistoryParams } from 'redux/types/InvestmentLpHistoryTypes';
import { DefaultLocale } from 'utils/env';
import Global from 'utils/Global';
export default function InvestmentLpHistory(props: InvestmentLpHistoryParams) {
  const { formatMessage } = useIntl()
  const f = (id: string) => formatMessage({ id })
  const dispatch = useDispatch()
  const router = useRouter()
  const { locale = DefaultLocale }: NextRouter = router;

  const [lpCondition, setLpCondition] = useState<InvestmentLpHistoryParams>({
    pageNo: 1,
    pageSize: 20,
  })
  const loadingLp = useSelector(
    (state: AppState) => state.investmentLpHistoryReducer.loadingLp
  )
  const lpHistoryBusList = useSelector(
    (state: AppState) => state.investmentLpHistoryReducer.investmentLpHistoryList
  )
  const lpListTotalsize = useSelector(
    (state: AppState) => state.investmentLpHistoryReducer.lpListTotalsize
  )

  useEffect(() => {
    setLpCondition({
      ...lpCondition,
      pageNo: 1,
      pageSize: 20,
    })
    dispatch(getInvestmentLpHistoryList({
      ...lpCondition,
      pageNo: 1,
      pageSize: 20,
      ...props
    })
    )
  }, [JSON.stringify(props)])

  const handleTableChange = (pagination: TablePaginationConfig, filters: Record<string, (Key | boolean)[] | null>, sorter: SorterResult<any> | SorterResult<any>[], extra: TableCurrentDataSource<any>) => {
    setLpCondition({
      ...lpCondition,
      pageNo: pagination.current,
      pageSize: pagination.pageSize,
    })
    dispatch(getInvestmentLpHistoryList({
      ...lpCondition,
      pageNo: pagination.current,
      pageSize: pagination.pageSize,
      ...props
    })
    )
    dispatch(historyLpListLoading(true))
  }

  const typeFilters = (type: number) => {
    switch (type) {
      case 0:
        return f('investmentHistoryType0')
      case 5:
        return f('investmentHistoryType5')
      case 6:
        return f('investmentHistoryType6')
      default:
        return f('investmentHistoryType0')
    }
  }

  const groupLpColumns: ColumnsType<InvestmentLpHistoryItem> = [
    {
      title: f('investmentTableDate'),
      dataIndex: 'date',
      key: 'date',
      render: (text, record) => {
        return Global.distanceFromCurrent(record.date, locale, true)
      },
    },
    {
      title: f('investmentTableType'),
      dataIndex: 'type',
      key: 'type',
      render: (text, record) => {
        return (
          <span style={{ color: record.type == 5 ? '#00A700' : '#F25959' }}> {typeFilters(record.type)}</span>
        )
      },
    },
    {
      title: f('investmentTableMarketMaking'),
      dataIndex: 'marketMaking',
      key: 'marketMaking',
      render: (text, record) => {
        return (
          <div>
            {
              record.type == 5
                ?
                <>
                  <SymbolBox
                    symbol={record.symbol0}
                    logo={record.symbol0Logo}
                    price={record.symbol0Amount}
                    value={record.symbol0Value} />
                  <div className="symbol-box"><span className="symbol-logo">+</span></div>
                  <SymbolBox
                    symbol={record.symbol1}
                    logo={record.symbol1Logo}
                    price={record.symbol1Amount}
                    value={record.symbol1Value} />
                </>
                :
                <>
                  <SymbolBox
                    symbol="SLP"
                    logo={record.contractLogo}
                    price=''
                    value={record.lpTotalValue} />
                </>
            }
          </div>
        )
      },
    },
    {
      title: ' ',
      dataIndex: 'action',
      width: 50,
      key: 'action',
      render: (text, record) => {
        return (
          <span>
            <svg
              className="icon"
              aria-hidden="true"
              style={{ width: 16, height: 16 }}>
              <use xlinkHref='#icon-right'></use>
            </svg>
          </span>
        )
      },
    },
    {
      title: f('investmentTableTargetCurrency'),
      dataIndex: 'targetCurrency',
      key: 'targetCurrency',
      render: (text, record) => {
        return (
          <div>
            {
              record.type == 6
                ?
                <>
                  <SymbolBox
                    symbol={record.symbol0}
                    logo={record.symbol0Logo}
                    price={record.symbol0Amount}
                    value={record.symbol0Value} />
                  <div className="symbol-box"><span className="symbol-logo">+</span></div>
                  <SymbolBox
                    symbol={record.symbol1}
                    logo={record.symbol1Logo}
                    price={record.symbol1Amount}
                    value={record.symbol1Value} />
                </>
                :
                <>
                  <SymbolBox
                    symbol="SLP"
                    logo={record.contractLogo}
                    price=''
                    value={record.lpTotalValue} />
                </>
            }
          </div>
        )
      },
    },
    {
      title: f('investmentTableUnitPrice'),
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (text, record) => {
        return (
          <div>
            <div>
              1 <span>{record.symbol0}</span> = $ <span>{Global.formatNum(record.symbol0Price)}</span>
            </div>
            <div>
              1 <span>{record.symbol1}</span> = $ <span>{Global.formatNum(record.symbol1Price)}</span>
            </div>
          </div>
        )
      },
    },
    {
      title: f('investmentTableTxHashUrl'),
      dataIndex: 'txHashUrl',
      key: 'txHashUrl',
      align: 'right',
      render: (text, record) => {
        return (
          <svg
            className="icon"
            aria-hidden="true"
            style={{ width: 16, height: 16, cursor: 'pointer' }}
            onClick={() => {
              window.open(record.txHashUrl)
            }}>
            <use xlinkHref='#icon-etherscan'></use>
          </svg>
        )
      },
    }
  ]
  return (
    <div
      className="common-table"
      style={{ boxShadow: 'none', padding: '0 0 20px', margin: 0 }}
    >
      <WaterMarkContent />
      <Table
        rowKey="key"
        columns={groupLpColumns}
        pagination={{
          showQuickJumper: true,
          showSizeChanger: false,
          current: lpCondition.pageNo,
          pageSize: lpCondition.pageSize,
          total: lpListTotalsize,
          position: ['bottomCenter'],
        }}
        dataSource={lpHistoryBusList.list}
        loading={loadingLp}
        onChange={handleTableChange}
      />
    </div>
  );
}

interface SymbolBoxProps {
  symbol: string,
  logo: string,
  price: number | string,
  value: number,
}
function SymbolBox(params: SymbolBoxProps) {
  return (
    <>
      <div className="symbol-box">
        <div>
          <TokenLogo className="symbol-logo" src={params.logo} />
        </div>
        <div className="symbol-right">
          {params.symbol != 'SLP' ? <span>{Global.formatNum(params.price)} {params.symbol}</span> : <span>{params.symbol}</span>}
          <span className="symbol-value">$ {Global.formatNum(params.value)}</span>
        </div>
      </div>
    </>
  )
}