import { useIntl } from 'react-intl'
import Global from 'utils/Global'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { Tooltip, Radio, Empty } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import { getAnalysisSellingUsers } from 'redux/actions/MarketPage/AnalysisSellBuyUsersAction'
import AnalysisDetail from 'components/MarketComponents/AnalysisDetail'
import AnalysisModal from 'components/MarketComponents/AnalysisModal'
import BuyRank from 'components/MarketComponents/BuyRank'
import type { AppState } from 'redux/reducers'
import { AnalysisSellBuyUsersParams, AnalysisSellBuyUsersItem } from 'redux/types/AnalysisSellBuyUsersTypes'
import type { ColumnType } from 'antd/lib/table/interface'
import type { RadioChangeEvent } from 'antd/lib/radio/interface'
import DefinEmpty from 'components/Header/definEmpty'

interface AnalysisSellingUsersProps {
    symbolAddr: string,
    symbol: string,
}
export default function AnalysisSellingUsers({ symbolAddr, symbol }: AnalysisSellingUsersProps) {
    const router = useRouter()
    const { locale } = router
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id })
    const dispatch = useDispatch()
    const [analysisSellingUsersListCondition, setAnalysisSellingUsersListCondition] =
        useState<AnalysisSellBuyUsersParams>({
            dateType: '1',
            symbolAddr: symbolAddr,
        })
    useEffect(() => {
        setAnalysisSellingUsersListCondition({
            ...analysisSellingUsersListCondition,
            symbolAddr,
        })
        dispatch(
            getAnalysisSellingUsers({
                ...analysisSellingUsersListCondition,
                symbolAddr,
            })
        )
    }, [dispatch, symbolAddr, locale])
    const analysisSellingUsersList = useSelector(
        (state: AppState) => state.analysisSellingUsersReducer.analysisSellingUsersList
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
    const [radioType, setRadioType] = useState('2')
    const radioChange = (e: RadioChangeEvent) => {
        setRadioType(e.target.value)
        setAnalysisSellingUsersListCondition({
            ...analysisSellingUsersListCondition,
            dateType: e.target.value,
        })
        dispatch(
            getAnalysisSellingUsers({
                ...analysisSellingUsersListCondition,
                dateType: e.target.value,
            })
        )
    }
    return (
        <div className="block-item item-small">
            <div className="item-title">
                <span>
                    {f('analysisSellUser')}
                    <Tooltip
                        placement="right"
                        title={<div>{f('marketDetailAnalysisSellTips')}</div>}
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
            {analysisSellingUsersList &&
                analysisSellingUsersList.holdSymbolList &&
                analysisSellingUsersList.holdSymbolList.length > 0 ? (
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
                                num: analysisSellingUsersList.netPerson,
                                quantity: Global.formatNum(analysisSellingUsersList.netAmount),
                            }}
                            pieData={analysisSellingUsersList.holdSymbolList}
                            tableData={analysisSellingUsersList.holdSymbolList}
                            columns={columnsRow1}
                            type="out"
                            symbolAddr={symbolAddr}
                            analysisType={1}
                            dateType={analysisSellingUsersListCondition.dateType}
                        />
                        <AnalysisDetail
                            tableClass="pink-head"
                            hasDesc={false}
                            localText={{
                                des1: f('analysisSellPieLabelDes1'),
                                des2: f('analysisSellDisPieLabelDes2'),
                            }}
                            params={{ symbol: symbol }}
                            pieData={analysisSellingUsersList.holdAssetList}
                            tableData={analysisSellingUsersList.holdAssetList}
                            columns={columnsRow2}
                            type="out"
                            symbolAddr={symbolAddr}
                            analysisType={2}
                            dateType={analysisSellingUsersListCondition.dateType}
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
    )
}
