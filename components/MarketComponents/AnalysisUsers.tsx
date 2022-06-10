import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { Tooltip, Radio, Menu } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import { getAnalysisBuyingUsers, getAnalysisSellingUsers } from 'redux/actions/MarketPage/AnalysisSellBuyUsersAction'
import { getIncrease, getDecrease } from 'redux/actions/MarketPage/IncreaseAndDecreaseAction'
import { AnalysisSellBuyUsersParams } from 'redux/types/AnalysisSellBuyUsersTypes'
import { IncreaseAndDecreaseParams } from 'redux/types/IncreaseAndDecreaseTypes'
import BuyAndSell from 'components/MarketComponents/AnalysisUsersCom/BuyAndSell'
import IncreaseAndDecrease from 'components/MarketComponents/AnalysisUsersCom/IncreaseAndDecrease'
import type { AppState } from 'redux/reducers'
import type { RadioChangeEvent } from 'antd/lib/radio/interface'
import type { MenuInfo } from 'rc-menu/lib/interface'
import DefinEmpty from 'components/Header/definEmpty'

interface AnalysisSellingUsersProps {
    symbolAddr: string,
    symbol: string,
}
export default function AnalysisUsers({ symbolAddr, symbol }: AnalysisSellingUsersProps) {
    const router = useRouter()
    const { locale } = router
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id })
    const dispatch = useDispatch()
    const [analysisSellingUsersListCondition, setAnalysisSellingUsersListCondition] =
        useState<AnalysisSellBuyUsersParams>({
            dateType: '2',
            symbolAddr: symbolAddr,
        })
    const [analysisBuyingUsersListCondition, setAnalysisBuyingUsersListCondition] =
        useState<AnalysisSellBuyUsersParams>({
            dateType: '2',
            symbolAddr: symbolAddr,
        })
    const [increaseListCondition, setIncreaseListCondition] =
        useState<IncreaseAndDecreaseParams>({
            dateType: '2',
            symbolAddr: symbolAddr,
        })
    const [decreaseListCondition, setDecreaseListCondition] =
        useState<IncreaseAndDecreaseParams>({
            dateType: '2',
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
        setIncreaseListCondition({
            ...increaseListCondition,
            symbolAddr,
        })
        dispatch(
            getIncrease({
                ...increaseListCondition,
                symbolAddr,
            })
        )
        setDecreaseListCondition({
            ...decreaseListCondition,
            symbolAddr,
        })
        dispatch(
            getDecrease({
                ...decreaseListCondition,
                symbolAddr,
            })
        )
    }, [dispatch, symbolAddr, locale])

    const analysisSellingUsersList = useSelector(
        (state: AppState) => state.analysisSellingUsersReducer.analysisSellingUsersList
    )
    const analysisBuyingUsersList = useSelector(
        (state: AppState) => state.analysisSellingUsersReducer.analysisBuyingUsersList
    )
    const increaseUsersList = useSelector(
        (state: AppState) => state.increaseAndDecreaseReducer.increaseUsersList
    )
    const decreaseUsersList = useSelector(
        (state: AppState) => state.increaseAndDecreaseReducer.decreaseUsersList
    )

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
        setIncreaseListCondition({
            ...increaseListCondition,
            dateType: e.target.value,
        })
        dispatch(
            getIncrease({
                ...increaseListCondition,
                dateType: e.target.value,
            })
        )
        setDecreaseListCondition({
            ...decreaseListCondition,
            dateType: e.target.value,
        })
        dispatch(
            getDecrease({
                ...decreaseListCondition,
                dateType: e.target.value,
            })
        )
    }

    const [current, setCurrent] = useState('mail')
    const handleClick = (e: MenuInfo) => {
        //console.log('click ', e);
        setCurrent(e.key as string);
    };
    return (
        <div className="block-item item-small analysis-users">
            <div className="item-title">
                <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal" style={{ background: 'transparent', borderBottom: 0, color: '#fff', width: 900, fontSize: 20, marginLeft: '-20px' }}>
                    <Menu.Item key="mail">
                        <span>
                            {f('analysisUser')}
                            <Tooltip
                                placement="right"
                                title={<><div>{f('marketDetailAnalysisBuyTips')}</div><div>{f('marketDetailAnalysisSellTips')}</div></>}
                            >
                                <QuestionCircleOutlined
                                    style={{
                                        fontSize: '16px',
                                        marginLeft: '10px',
                                    }}
                                />
                            </Tooltip>
                        </span>
                    </Menu.Item>
                    <Menu.Item key="app">
                        <span>
                            {f('increaseAndDecrease')}
                            <Tooltip
                                placement="right"
                                title={<><div>{f('increaseDesc')}</div><div>{f('decreaseDesc')}</div></>}
                            >
                                <QuestionCircleOutlined
                                    style={{
                                        fontSize: '16px',
                                        marginLeft: '10px',
                                    }}
                                />
                            </Tooltip>
                        </span>
                    </Menu.Item>
                </Menu>
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
            <div style={{ display: current == 'app' ? 'none' : 'block' }}>
                {
                    (
                        (analysisBuyingUsersList && analysisBuyingUsersList.holdSymbolList && analysisBuyingUsersList.holdSymbolList.length > 0)
                        ||
                        (analysisSellingUsersList && analysisSellingUsersList.holdSymbolList && analysisSellingUsersList.holdSymbolList.length > 0)
                    )
                        ?
                        <BuyAndSell
                            symbolAddr={symbolAddr}
                            symbol={symbol}
                            radioType={radioType}
                            params={
                                {
                                    analysisBuyingUsersList: analysisBuyingUsersList,
                                    analysisBuyingUsersListCondition: analysisBuyingUsersListCondition,
                                    analysisSellingUsersList: analysisSellingUsersList,
                                    analysisSellingUsersListCondition: analysisSellingUsersListCondition,
                                }
                            }
                        />
                        :
                        <div className="table-empty">
                            <DefinEmpty />
                        </div>
                }
            </div>
            <div style={{ display: current == 'mail' ? 'none' : 'block' }}>
                {
                    (
                        (decreaseUsersList && decreaseUsersList.holdSymbolList && decreaseUsersList.holdSymbolList.length > 0)
                        ||
                        (increaseUsersList && increaseUsersList.holdSymbolList && increaseUsersList.holdSymbolList.length > 0)
                    )
                        ?
                        <IncreaseAndDecrease
                            symbolAddr={symbolAddr}
                            symbol={symbol}
                            radioType={radioType}
                            params={
                                {
                                    decreaseUsersList: decreaseUsersList,
                                    decreaseListCondition: decreaseListCondition,
                                    increaseUsersList: increaseUsersList,
                                    increaseListCondition: increaseListCondition,
                                }
                            }
                        />
                        :
                        <div className="table-empty">
                            <DefinEmpty />
                        </div>
                }
            </div>
        </div >
    )
}
