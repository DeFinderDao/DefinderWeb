import { ColumnType } from "antd/lib/table"
import React from "react"
import { useIntl } from "react-intl"
import { AnalysisSellBuyUsersItem, AnalysisSellBuyUsersParams, AnalysisSellBuyUsersResponse } from "redux/types/AnalysisSellBuyUsersTypes"
import Global from "utils/Global"
import AnalysisDetail from "components/MarketComponents/AnalysisDetail"
import AnalysisModal from "components/MarketComponents/AnalysisModal"
import BuyRank from "components/MarketComponents/BuyRank"
import DefinEmpty from "components/Header/definEmpty"

interface BuyAndSellProps {
  symbolAddr: string,
  symbol: string,
  radioType: string,
  params: {
    analysisBuyingUsersList: AnalysisSellBuyUsersResponse,
    analysisBuyingUsersListCondition: AnalysisSellBuyUsersParams,
    analysisSellingUsersList: AnalysisSellBuyUsersResponse,
    analysisSellingUsersListCondition: AnalysisSellBuyUsersParams
  },
}
export default function BuyAndSell({ symbolAddr, symbol, radioType, params }: BuyAndSellProps) {
  const { formatMessage } = useIntl()
  const f = (id: string) => formatMessage({ id })

  const columnsRow1: ColumnType<AnalysisSellBuyUsersItem>[] = [
    {
      title: f('analysisRank'),
      dataIndex: 'range',
      key: 'range',
      align: 'left',
      width: 115,
    },
    {
      title: f('analysisRateNumber'),
      dataIndex: 'person',
      key: 'person',
      align: 'center',
      width: 120,
      render: (text, record) => {
        return <AnalysisModal num={record.person} />
      },
    },
    {
      title: f('analysisRateSurplusNumber'),
      dataIndex: 'amount',
      key: 'amount',
      align: 'center',
      width: 120,
      render: (text, record) => {
        return <span>{Global.formatBigNum(record.amount)}</span>
      },
    },
    {
      title: f('analysisRateQuantity'),
      dataIndex: 'rate',
      key: 'rate',
      align: 'right',
      width: 120,
      render: (text, record) => {
        return <span>{`${record.rate}%`}</span>
      },
    },
  ]
  const columnsRow2: ColumnType<AnalysisSellBuyUsersItem>[] = [
    {
      title: f('analysisDistributeInterval'),
      dataIndex: 'range',
      key: 'range',
      align: 'left',
      width: 105,
    },
    {
      title: f('analysisPeopleNumber'),
      dataIndex: 'person',
      key: 'person',
      align: 'center',
      width: 120,
      render: (text, record) => {
        return <AnalysisModal num={record.person} />
      },
    },
    {
      title: f('analysisPeopleSurplusNumber'),
      dataIndex: 'amount',
      key: 'amount',
      align: 'center',
      width: 120,
      render: (text, record) => {
        return <span>{Global.formatBigNum(record.amount)}</span>
      },
    },
    {
      title: f('analysisRateQuantity'),
      dataIndex: 'rate',
      key: 'rate',
      align: 'right',
      width: 120,
      render: (text, record) => {
        return <span>{`${record.rate}%`}</span>
      },
    },
  ]
  const columnsRow3: ColumnType<AnalysisSellBuyUsersItem>[] = [
    {
      title: f('analysisRank'),
      dataIndex: 'range',
      key: 'range',
      align: 'left',
      width: 115,
    },
    {
      title: f('analysisBuyRateNumber'),
      dataIndex: 'person',
      key: 'person',
      align: 'center',
      width: 120,
      render: (text, record) => {
        return <AnalysisModal num={record.person} />
      },
    },
    {
      title: f('analysisBuyRateSurplusNumber'),
      dataIndex: 'amount',
      key: 'amount',
      align: 'center',
      width: 120,
      render: (text, record) => {
        return <span>{Global.formatBigNum(record.amount)}</span>
      },
    },
    {
      title: f('analysisBuyRateQuantity'),
      dataIndex: 'rate',
      key: 'rate',
      align: 'right',
      width: 120,
      render: (text, record) => {
        return <span>{`${record.rate}%`}</span>
      },
    },
  ]
  const columnsRow4: ColumnType<AnalysisSellBuyUsersItem>[] = [
    {
      title: f('analysisDistributeInterval'),
      dataIndex: 'range',
      key: 'range',
      align: 'left',
      width: 105,
    },
    {
      title: f('analysisBuyPeopleNumber'),
      dataIndex: 'person',
      key: 'person',
      align: 'center',
      width: 120,
      render: (text, record) => {
        return <AnalysisModal num={record.person} />
      },
    },
    {
      title: f('analysisBuyPeopleSurplusNumber'),
      dataIndex: 'amount',
      key: 'amount',
      align: 'center',
      width: 120,
      render: (text, record) => {
        return <span>{Global.formatBigNum(record.amount)}</span>
      },
    },
    {
      title: f('analysisBuyRateQuantity'),
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
      <div className="analysis-users-box">
        <div className="analysis-users-item">{params.analysisBuyingUsersList &&
          params.analysisBuyingUsersList.holdSymbolList &&
          params.analysisBuyingUsersList.holdSymbolList.length > 0 ? (
          <>
            <div>
              <AnalysisDetail
                tableClass="blue-head"
                hasDesc={true}
                localText={{
                  des1: f('analysisBuyPieLabelDes1'),
                  des2: f('analysisBuyPeoPieLabelDes2'),
                  comPeo: f('analysisBuyComPeople'),
                  comBum: f('analysisBuyComNumber'),
                }}
                params={{
                  symbol: symbol,
                  num: params.analysisBuyingUsersList.netPerson,
                  quantity: Global.formatNum(params.analysisBuyingUsersList.netAmount),
                }}
                pieData={params.analysisBuyingUsersList.holdSymbolList}
                tableData={params.analysisBuyingUsersList.holdSymbolList}
                columns={columnsRow3}
                type="in"
                symbolAddr={symbolAddr}
                analysisType={1}
                dateType={params.analysisBuyingUsersListCondition.dateType}
              />
              <AnalysisDetail
                tableClass="pink-head"
                hasDesc={false}
                localText={{
                  des1: f('analysisBuyPieLabelDes1'),
                  des2: f('analysisBuyDisPieLabelDes2'),
                }}
                params={{ symbol: symbol }}
                pieData={params.analysisBuyingUsersList.holdAssetList}
                tableData={params.analysisBuyingUsersList.holdAssetList}
                columns={columnsRow4}
                type="in"
                symbolAddr={symbolAddr}
                analysisType={2}
                dateType={params.analysisBuyingUsersListCondition.dateType}
              />
            </div>
            <div>
              <div style={{ margin: '20px 0' }}>
                <span>{f('buyRank')}</span>
              </div>
              <BuyRank
                symbolAddr={symbolAddr}
                pageSize={3}
                showMore={true}
                symbol={symbol}
                radioType={radioType}
                typeRank="buyRank"
              />
            </div>
          </>
        ) : (
          <div className="table-empty">
            <DefinEmpty />
          </div>
        )}</div>
        <div className="analysis-users-item">{params.analysisSellingUsersList &&
          params.analysisSellingUsersList.holdSymbolList &&
          params.analysisSellingUsersList.holdSymbolList.length > 0 ? (
          <>
            <div>
              <AnalysisDetail
                tableClass="blue-head"
                hasDesc={true}
                localText={{
                  des1: f('analysisSellPieLabelDes1'),
                  des2: f('analysisSellPeoPieLabelDes2'),
                  comPeo: f('analysisSellComPeople'),
                  comBum: f('analysisSellComNumber'),
                }}
                params={{
                  symbol: symbol,
                  num: params.analysisSellingUsersList.netPerson,
                  quantity: Global.formatNum(params.analysisSellingUsersList.netAmount),
                }}
                pieData={params.analysisSellingUsersList.holdSymbolList}
                tableData={params.analysisSellingUsersList.holdSymbolList}
                columns={columnsRow1}
                type="out"
                symbolAddr={symbolAddr}
                analysisType={1}
                dateType={params.analysisSellingUsersListCondition.dateType}
              />
              <AnalysisDetail
                tableClass="pink-head"
                hasDesc={false}
                localText={{
                  des1: f('analysisSellPieLabelDes1'),
                  des2: f('analysisSellDisPieLabelDes2'),
                }}
                params={{ symbol: symbol }}
                pieData={params.analysisSellingUsersList.holdAssetList}
                tableData={params.analysisSellingUsersList.holdAssetList}
                columns={columnsRow2}
                type="out"
                symbolAddr={symbolAddr}
                analysisType={2}
                dateType={params.analysisSellingUsersListCondition.dateType}
              />
            </div>
            <div>
              <div style={{ margin: '20px 0' }}>
                <span>{f('sellRank')}</span>
              </div>
              <BuyRank
                symbolAddr={symbolAddr}
                pageSize={3}
                showMore={true}
                symbol={symbol}
                radioType={radioType}
                typeRank="sellRank"
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