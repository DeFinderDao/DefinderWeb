import { useIntl } from 'react-intl'
import Global from 'utils/Global'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { Tooltip, Radio, Empty } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import { getAnalysisBuyingUsers } from 'redux/actions/MarketPage/AnalysisSellBuyUsersAction'
import AnalysisDetail from 'components/MarketComponents/AnalysisDetail'
import AnalysisModal from 'components/MarketComponents/AnalysisModal'
import BuyRank from 'components/MarketComponents/BuyRank'
import type { AppState } from 'redux/reducers'
import { AnalysisSellBuyUsersParams, AnalysisSellBuyUsersItem } from 'redux/types/AnalysisSellBuyUsersTypes'
import type { ColumnType } from 'antd/lib/table/interface'
import type { RadioChangeEvent } from 'antd/lib/radio/interface'
import DefinEmpty from 'components/Header/definEmpty'

interface AnalysisBuyingUsersProps {
    symbolAddr: string,
    symbol: string,
}
export default function AnalysisBuyingUsers({ symbolAddr, symbol }: AnalysisBuyingUsersProps) {
    const router = useRouter()
    const { locale } = router
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id })
    const dispatch = useDispatch()
    const [
        analysisBuyingUsersListCondition,
        setAnalysisBuyingUsersListCondition,
    ] = useState<AnalysisSellBuyUsersParams>({
        dateType: '1',
        symbolAddr: symbolAddr,
    })
    useEffect(() => {
        setAnalysisBuyingUsersListCondition({
            ...analysisBuyingUsersListCondition,
            symbolAddr,
        })
        dispatch(
            getAnalysisBuyingUsers({
                ...analysisBuyingUsersListCondition,
                symbolAddr,
            })
        )
    }, [dispatch, symbolAddr, locale])
    const analysisBuyingUsersList = useSelector(
        (state: AppState) => state.analysisSellingUsersReducer.analysisBuyingUsersList
    )
    const columnsRow1: ColumnType<AnalysisSellBuyUsersItem>[] = [
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
    const columnsRow2: ColumnType<AnalysisSellBuyUsersItem>[] = [
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
    const [radioType, setRadioType] = useState('2')
    const radioChange = (e: RadioChangeEvent) => {
        setRadioType(e.target.value)
        setAnalysisBuyingUsersListCondition({
            ...analysisBuyingUsersListCondition,
            dateType: e.target.value,
        })
        dispatch(
            getAnalysisBuyingUsers({
                ...analysisBuyingUsersListCondition,
                dateType: e.target.value,
            })
        )
    }
    return (
        <div className="block-item item-small">
            <div className="item-title">
                <span>
                    {f('analysisBuyUser')}
                    <Tooltip
                        placement="right"
                        title={<div>{f('marketDetailAnalysisBuyTips')}</div>}
                    >
                        <QuestionCircleOutlined
                            style={{
                                fontSize: '16px',
                                marginLeft: '10px',
                            }}
                        />
                    </Tooltip>
                </span>
                <div className="defi-radio-group-time">
                    <Radio.Group
                        defaultValue={radioType}
                        buttonStyle="solid"
                        onChange={radioChange}
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
            {analysisBuyingUsersList &&
                analysisBuyingUsersList.holdSymbolList &&
                analysisBuyingUsersList.holdSymbolList.length > 0 ? (
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
                                num: analysisBuyingUsersList.netPerson,
                                quantity: Global.formatNum(analysisBuyingUsersList.netAmount),
                            }}
                            pieData={analysisBuyingUsersList.holdSymbolList}
                            tableData={analysisBuyingUsersList.holdSymbolList}
                            columns={columnsRow1}
                            type="in"
                            symbolAddr={symbolAddr}
                            analysisType={1}
                            dateType={analysisBuyingUsersListCondition.dateType}
                        />
                        <AnalysisDetail
                            tableClass="pink-head"
                            hasDesc={false}
                            localText={{
                                des1: f('analysisBuyPieLabelDes1'),
                                des2: f('analysisBuyDisPieLabelDes2'),
                            }}
                            params={{ symbol: symbol }}
                            pieData={analysisBuyingUsersList.holdAssetList}
                            tableData={analysisBuyingUsersList.holdAssetList}
                            columns={columnsRow2}
                            type="in"
                            symbolAddr={symbolAddr}
                            analysisType={2}
                            dateType={analysisBuyingUsersListCondition.dateType}
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
            )}
        </div>
    )
}
