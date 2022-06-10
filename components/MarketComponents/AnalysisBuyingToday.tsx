import { useIntl } from 'react-intl'
import Global from 'utils/Global'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { Empty } from 'antd'
import React, { useEffect, useState } from 'react'
import { getAnalysisBuyingToday } from 'redux/actions/MarketPage/AnalysisBuyingTodayAction'
import AnalysisDetail from 'components/MarketComponents/AnalysisDetail'
import AnalysisModal from 'components/MarketComponents/AnalysisModal'
import type { AppState } from 'redux/reducers'
import { AnalysisBuyingTodayItem } from 'redux/types/AnalysisBuyingTodayTypes'
import type { ColumnType } from 'antd/lib/table/interface'
import DefinEmpty from 'components/Header/definEmpty'

interface AnalysisBuyingTodayProps {
    symbolAddr: string,
    symbol: string,
}
export default function AnalysisBuyingToday({ symbolAddr, symbol }: AnalysisBuyingTodayProps) {
    const router = useRouter()
    const { locale } = router
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id })
    const dispatch = useDispatch()
    const [
        analysisBuyingTodayListCondition,
        setAnalysisBuyingTodayListCondition,
    ] = useState({
        symbolAddr: symbolAddr,
        field: '',
        sort: '',
        pageNo: 1,
        pageSize: 6,
    })
    useEffect(() => {
        setAnalysisBuyingTodayListCondition({
            ...analysisBuyingTodayListCondition,
            symbolAddr,
        })
        dispatch(
            getAnalysisBuyingToday({
                ...analysisBuyingTodayListCondition,
                symbolAddr,
            })
        )
    }, [dispatch, symbolAddr, locale])
    const analysisBuyingTodayList = useSelector(
        (state: AppState) => state.analysisBuyingTodayReducer.analysisBuyingTodayList
    )

    const columnsRow: ColumnType<AnalysisBuyingTodayItem>[] = [
        {
            title: f('analysisBuyTodayDistributeNumber'),
            dataIndex: 'range',
            key: 'range',
            align: 'left',
            width: 105,
        },
        {
            title: f('analysisBuyTodayPeopleNumber'),
            dataIndex: 'person',
            key: 'person',
            align: 'center',
            width: 120,
            render: (text, record) => {
                return <AnalysisModal num={record.person} />
            },
        },
        {
            title: f('analysisBuyTodayAmountNumber'),
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
        <div>
            {analysisBuyingTodayList &&
                analysisBuyingTodayList.holdAssetList &&
                analysisBuyingTodayList.holdAssetList.length > 0 ? (
                <AnalysisDetail
                    tableClass="pink-head"
                    hasDesc={false}
                    localText={{
                        des1: f('analysisSellTodayDes'),
                    }}
                    params={{ symbol: symbol }}
                    pieData={analysisBuyingTodayList.holdAssetList}
                    tableData={analysisBuyingTodayList.holdAssetList}
                    columns={columnsRow}
                    type="today"
                    analysisType={3}
                    symbolAddr={symbolAddr}
                />
            ) : (
                <div className="table-empty">
                    <DefinEmpty />
                </div>
            )}
        </div>
    )
}
