import { ColumnType } from "antd/lib/table"
import React from "react"
import { useIntl } from "react-intl"
import { IncreaseAndDecreaseItem, IncreaseAndDecreaseParams, IncreaseAndDecreaseResponse } from "redux/types/IncreaseAndDecreaseTypes"
import Global from "utils/Global"
import AnalysisDetail from "components/MarketComponents/AnalysisDetail"
import AnalysisModal from "components/MarketComponents/AnalysisModal"
import DefinEmpty from "components/Header/definEmpty"
import IncreaseAndDecreaseRank from "components/MarketComponents/AnalysisUsersCom/IncreaseAndDecreaseRank"

interface IncreaseAndDecreaseProps {
  symbolAddr: string,
  symbol: string,
  radioType: string,
  params: {
    decreaseUsersList: IncreaseAndDecreaseResponse,
    decreaseListCondition: IncreaseAndDecreaseParams,
    increaseUsersList: IncreaseAndDecreaseResponse,
    increaseListCondition: IncreaseAndDecreaseParams
  },
}
export default function IncreaseAndDecrease({ symbolAddr, symbol, radioType, params }: IncreaseAndDecreaseProps) {
  const { formatMessage } = useIntl()
  const f = (id: string) => formatMessage({ id })

  const columnsRow1: ColumnType<IncreaseAndDecreaseItem>[] = [
    {
      title: f('analysisRank'),
      dataIndex: 'range',
      key: 'range',
      align: 'left',
      width: 115,
    },
    {
      title: f('decreasePersonNumber'),
      dataIndex: 'person',
      key: 'person',
      align: 'center',
      width: 120,
      render: (text, record) => {
        return <AnalysisModal num={record.person} />
      },
    },
    {
      title: f('decreaseAmountNumber'),
      dataIndex: 'amount',
      key: 'amount',
      align: 'center',
      width: 120,
      render: (text, record) => {
        return <span>{Global.formatBigNum(record.amount)}</span>
      },
    },
    {
      title: f('decreaseRate'),
      dataIndex: 'rate',
      key: 'rate',
      align: 'right',
      width: 120,
      render: (text, record) => {
        return <span>{`${record.rate}%`}</span>
      },
    },
  ]
  const columnsRow2: ColumnType<IncreaseAndDecreaseItem>[] = [
    {
      title: f('analysisDistributeInterval'),
      dataIndex: 'range',
      key: 'range',
      align: 'left',
      width: 105,
    },
    {
      title: f('decreasePersonNumber'),
      dataIndex: 'person',
      key: 'person',
      align: 'center',
      width: 120,
      render: (text, record) => {
        return <AnalysisModal num={record.person} />
      },
    },
    {
      title: f('decreaseAmountNumber'),
      dataIndex: 'amount',
      key: 'amount',
      align: 'center',
      width: 120,
      render: (text, record) => {
        return <span>{Global.formatBigNum(record.amount)}</span>
      },
    },
    {
      title: f('decreaseRate'),
      dataIndex: 'rate',
      key: 'rate',
      align: 'right',
      width: 120,
      render: (text, record) => {
        return <span>{`${record.rate}%`}</span>
      },
    },
  ]
  const columnsRow3: ColumnType<IncreaseAndDecreaseItem>[] = [
    {
      title: f('analysisRank'),
      dataIndex: 'range',
      key: 'range',
      align: 'left',
      width: 115,
    },
    {
      title: f('increasePersonNumber'),
      dataIndex: 'person',
      key: 'person',
      align: 'center',
      width: 120,
      render: (text, record) => {
        return <AnalysisModal num={record.person} />
      },
    },
    {
      title: f('increaseAmountNumber'),
      dataIndex: 'amount',
      key: 'amount',
      align: 'center',
      width: 120,
      render: (text, record) => {
        return <span>{Global.formatBigNum(record.amount)}</span>
      },
    },
    {
      title: f('increaseRater'),
      dataIndex: 'rate',
      key: 'rate',
      align: 'right',
      width: 120,
      render: (text, record) => {
        return <span>{`${record.rate}%`}</span>
      },
    },
  ]
  const columnsRow4: ColumnType<IncreaseAndDecreaseItem>[] = [
    {
      title: f('analysisDistributeInterval'),
      dataIndex: 'range',
      key: 'range',
      align: 'left',
      width: 105,
    },
    {
      title: f('increasePersonNumber'),
      dataIndex: 'person',
      key: 'person',
      align: 'center',
      width: 120,
      render: (text, record) => {
        return <AnalysisModal num={record.person} />
      },
    },
    {
      title: f('increaseAmountNumber'),
      dataIndex: 'amount',
      key: 'amount',
      align: 'center',
      width: 120,
      render: (text, record) => {
        return <span>{Global.formatBigNum(record.amount)}</span>
      },
    },
    {
      title: f('increaseRater'),
      dataIndex: 'rate',
      key: 'rate',
      align: 'right',
      width: 120,
      render: (text, record) => {
        return <span>{`${record.rate}%`}</span>
      },
    },
  ]

  return (
    <>
      {symbolAddr == '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' ? <div className="item-ETH-desc">{f('marketIncreaseEthDesc')}</div> : null}
      <div className="analysis-users-box">
        <div className="analysis-users-item">{params.increaseUsersList &&
          params.increaseUsersList.holdSymbolList &&
          params.increaseUsersList.holdSymbolList.length > 0 ? (
          <>
            <div>
              <AnalysisDetail
                tableClass="blue-head"
                hasDesc={true}
                localText={{
                  des1: f('increasePieLabelDes1'),
                  des2: f('analysisBuyPeoPieLabelDes2'),
                  comPeo: f('increaseComPeople'),
                  comBum: f('increaseComNumber'),
                }}
                params={{
                  symbol: symbol,
                  num: params.increaseUsersList.netPerson,
                  quantity: Global.formatNum(params.increaseUsersList.netAmount),
                }}
                pieData={params.increaseUsersList.holdSymbolList}
                tableData={params.increaseUsersList.holdSymbolList}
                columns={columnsRow3}
                type="increase"
                symbolAddr={symbolAddr}
                analysisType={1}
                dateType={params.decreaseListCondition.dateType}
              />
              <AnalysisDetail
                tableClass="pink-head"
                hasDesc={false}
                localText={{
                  des1: f('increasePieLabelDes1'),
                  des2: f('analysisBuyDisPieLabelDes2'),
                }}
                params={{ symbol: symbol }}
                pieData={params.increaseUsersList.holdAssetList}
                tableData={params.increaseUsersList.holdAssetList}
                columns={columnsRow4}
                type="increase"
                symbolAddr={symbolAddr}
                analysisType={2}
                dateType={params.decreaseListCondition.dateType}
              />
            </div>
            <div>
              <div style={{ margin: '20px 0' }}>
                <span>{f('increaseRank')}</span>
              </div>
              <IncreaseAndDecreaseRank
                symbolAddr={symbolAddr}
                pageSize={3}
                showMore={true}
                symbol={symbol}
                radioType={radioType}
                typeRank="increaseRank"
              />
            </div>
          </>
        ) : (
          <div className="table-empty">
            <DefinEmpty />
          </div>
        )}</div>
        <div className="analysis-users-item">{params.decreaseUsersList &&
          params.decreaseUsersList.holdSymbolList &&
          params.decreaseUsersList.holdSymbolList.length > 0 ? (
          <>
            <div>
              <AnalysisDetail
                tableClass="blue-head"
                hasDesc={true}
                localText={{
                  des1: f('decreasePieLabelDes1'),
                  des2: f('analysisSellPeoPieLabelDes2'),
                  comPeo: f('decreaseComPeople'),
                  comBum: f('decreaseComNumber'),
                }}
                params={{
                  symbol: symbol,
                  num: params.decreaseUsersList.netPerson,
                  quantity: Global.formatNum(params.decreaseUsersList.netAmount),
                }}
                pieData={params.decreaseUsersList.holdSymbolList}
                tableData={params.decreaseUsersList.holdSymbolList}
                columns={columnsRow1}
                type="decrease"
                symbolAddr={symbolAddr}
                analysisType={1}
                dateType={params.increaseListCondition.dateType}
              />
              <AnalysisDetail
                tableClass="pink-head"
                hasDesc={false}
                localText={{
                  des1: f('decreasePieLabelDes1'),
                  des2: f('analysisSellDisPieLabelDes2'),
                }}
                params={{ symbol: symbol }}
                pieData={params.decreaseUsersList.holdAssetList}
                tableData={params.decreaseUsersList.holdAssetList}
                columns={columnsRow2}
                type="decrease"
                symbolAddr={symbolAddr}
                analysisType={2}
                dateType={params.increaseListCondition.dateType}
              />
            </div>
            <div>
              <div style={{ margin: '20px 0' }}>
                <span>{f('decreaseRank')}</span>
              </div>
              <IncreaseAndDecreaseRank
                symbolAddr={symbolAddr}
                pageSize={3}
                showMore={true}
                symbol={symbol}
                radioType={radioType}
                typeRank="decreaseRank"
              />
            </div>
          </>
        ) : (
          <div className="table-empty">
            <DefinEmpty />
          </div>
        )}
        </div>
      </div>
    </>
  )
}