import { message, Table } from 'antd';
import { ColumnsType, SorterResult, TableCurrentDataSource, TablePaginationConfig } from 'antd/lib/table/interface';
import { NextRouter, useRouter } from 'next/router';
import React, { useState, Key, useEffect } from 'react'
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { getInvestmentSwapHistoryList, historySwapListLoading } from 'redux/actions/InvestmentDetails/InvestmentSwapHistoryAction';
import { AppState } from 'redux/reducers';
import { InvestmentSwapHistoryItem, InvestmentSwapHistoryParams } from 'redux/types/InvestmentSwapHistoryTypes';
import { DefaultLocale } from 'utils/env';
import Global from 'utils/Global';
import Identicon from 'identicon.js/identicon.js'
import GlobalLabel from 'components/GlobalLabel';
import WaterMarkContent from 'components/WaterMarkContent';

export default function InvestmentSwapHistory(props: InvestmentSwapHistoryParams) {
  const {
    type,
    startTime,
    endTime,
    addressList,
    symbolAddr,
  } = props;
  const { formatMessage } = useIntl()
  const f = (id: string) => formatMessage({ id })
  const dispatch = useDispatch()
  const router = useRouter()
  const { locale = DefaultLocale }: NextRouter = router;

  const [swapCondition, setSwapCondition] = useState<InvestmentSwapHistoryParams>({
    pageNo: 1,
    pageSize: 20,
  })
  const loadingSwap = useSelector(
    (state: AppState) => state.investmentSwapHistoryReducer.loadingSwap
  )
  const swapHistoryBusList = useSelector(
    (state: AppState) => state.investmentSwapHistoryReducer.investmentSwapHistoryList
  )
  const swapListTotalsize = useSelector(
    (state: AppState) => state.investmentSwapHistoryReducer.swapListTotalsize
  )

  useEffect(() => {
    setSwapCondition({
      ...swapCondition,
      pageNo: 1,
      pageSize: 20,
    })
    dispatch(
      getInvestmentSwapHistoryList({
        ...swapCondition,
        pageNo: 1,
        pageSize: 20,
        ...props
      })
    )
  }, [JSON.stringify(props)])

  const handleTableChange = (pagination: TablePaginationConfig, filters: Record<string, (Key | boolean)[] | null>, sorter: SorterResult<any> | SorterResult<any>[], extra: TableCurrentDataSource<any>) => {
    setSwapCondition({
      ...swapCondition,
      pageNo: pagination.current,
      pageSize: pagination.pageSize,
    })
    dispatch(
      getInvestmentSwapHistoryList({
        ...swapCondition,
        pageNo: pagination.current,
        pageSize: pagination.pageSize,
        ...props
      })
    )
  }

  const typeFilters = (type: number) => {
    switch (type) {
      case 0:
        return f('investmentHistoryType0')
      case 1:
        return f('investmentHistoryType1')
      case 2:
        return f('investmentHistoryType2')
      case 3:
        return f('investmentHistoryType3')
      case 4:
        return f('investmentHistoryType4')
      default:
        return f('investmentHistoryType0')
    }
  }

  const groupSwapColumns: ColumnsType<InvestmentSwapHistoryItem> = [
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
          <span style={{ color: record.type == 1 || record.type == 3 ? '#00A700' : '#F25959' }}> {typeFilters(record.type)}</span>
        )
      },
    },
    {
      title: f('investmentTablePrice'),
      dataIndex: 'price',
      key: 'price',
      align: 'right',
      render: (text, record) => {
        return `$ ${Global.formatNum(record.price)}`
      },
    },
    {
      title: f('investmentTableAmount'),
      dataIndex: 'amount',
      key: 'amount',
      align: 'right',
      render: (text, record) => {
        return <span>{Global.formatNum(record.amount)} <span style={{ color: '#999' }}>{record.symbol}</span></span>
      },
    },
    {
      title: f('investmentTableOrderValue'),
      dataIndex: 'orderValue',
      key: 'orderValue',
      align: 'right',
      render: (text, record) => {
        return `$ ${Global.formatBigNum(text,0)}`
      },
    },
    {
      title: f('investmentTableAssociateAddr'),
      dataIndex: 'associateAddr',
      key: 'associateAddr',
      align: 'center',
      render: (text, record) => {
        if (record.associateAddr) {
          return (
            <div style={{cursor: 'pointer',textAlign:'left',paddingLeft: 220}} onClick={() => {
              let addr = record.associateAddr;
              const copyUrlBtn = document.createElement('input');
              copyUrlBtn.value = addr;
              document.body.appendChild(copyUrlBtn);
              copyUrlBtn.select();
              document.execCommand('Copy');
              document.body.removeChild(copyUrlBtn);
              message.success(f('copySuccess'))
            }}>
              <img style={{ borderRadius: 40, marginRight: 10 }} src={`data:image/png;base64,${new Identicon(record.associateAddr, 24).toString()}`} />
              <GlobalLabel addr={record.associateAddr} label={record.associateAddrLabel} />
              {`${record.isContract ? f('contractAddresses') : ''}`}
            </div>
          )
        } else {
          return null
        }
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
    },
  ]
  return (
    <div
      className="common-table"
      style={{ boxShadow: 'none', padding: '0 0 20px', margin: 0 }}
    >
      <WaterMarkContent />
      <Table
        rowKey='key'
        columns={groupSwapColumns}
        pagination={{
          showQuickJumper: true,
          showSizeChanger: false,
          current: swapCondition.pageNo,
          pageSize: swapCondition.pageSize,
          total: swapListTotalsize,
          position: ['bottomCenter'],
        }}
        dataSource={swapHistoryBusList.list}
        loading={loadingSwap}
        onChange={handleTableChange}
      />
    </div>
  );
}
