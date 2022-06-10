import { combineReducers } from 'redux'
import addressAnalyseReducer from './AddressAnalyseReducer'
import AddressCombinationReducer from './AddressCombinationReducer'
import addressDynamicReducer from './AddressDynamicReducer'
import applicationReducer from './ApplicationReducer'
import AppDetailReducer from './AppDetailReducer'
import userInfoReducer from './UserInfoReducer'
import AssetBoardReducer from './AssetBoardReducer'
import MenuReducer from './MenuReducer'
import chanceWarningReducer from './ChanceWarningReducer'
import setWarningReducer from './SetWarningReducer'
import marketPage from './MarketPageReducer'
import currencyAddrLineReducer from './MarketPage/CurrencyAddrLineReducer'
import currencyAddrRankReducer from './MarketPage/CurrencyAddrRankReducer'
import SMAddrRankReducer from './MarketPage/SMAddrRankReducer'
import transactionHistoryReducer from './MarketPage/TransactionHistoryReducer'
import comparisonReducer from './MarketComponents/MarketComponentsReducer'
import connectWalletDialogReducer from './ConnectWalletDialogReducer';
import analysisSellingUsersReducer from './MarketPage/AnalysisSellBuyUsersReducer'
import analysisBuyingTodayReducer from './MarketPage/AnalysisBuyingTodayReducer'
import positionIncomeReducer from './InvestmentDetails/PositionIncomeReducer'
import investmentPriceReducer from './InvestmentDetails/InvestmentPriceReducer'
import investmentNumberReducer from './InvestmentDetails/InvestmentNumberReducer'
import investmentLpHistoryReducer from './InvestmentDetails/InvestmentLpHistoryReducer'
import investmentSwapHistoryReducer from './InvestmentDetails/InvestmentSwapHistoryReducer'
import increaseAndDecreaseReducer from './MarketPage/IncreaseAndDecreaseReducer'
import increaseAndDecreaseRankReducer from './MarketComponents/IncreaseAndDecreaseRankReducer'
import investmentDetailsReducer from './InvestmentDetails/InvestmentDetailsReducer'
import NftDetailsReducer from './NftDetails/NftDetailsReducer'
import NftPlotsHistoryReducer from './NftDetails/NftPlotsHistoryReducer'
import NftSwapHistoryReducer from './NftDetails/NftSwapHistoryReducer'
import smBuySellRankReducer from './SmartMoney/TransactionData/BuySellRankReducer'
import smTransactionRecordReducer from './SmartMoney/TransactionData/TransactionRecordReducer'
import CEXInteractiveRankReducer from './SmartMoney/TransferData/CEXInteractiveRankReducer'
import HotContractAddRankReducer from './SmartMoney/TransferData/HotContractAddRankReducer'
import TransferRecordReducer from './SmartMoney/TransferData/TransferRecordReducer'
import CEXLineReducer from './SmartMoney/TransferData/CEXLineReducer'
import smartMoneyReducer from './SmartMoneyReducer'
import NFTAnalyseReducer from './NFTAnalyseReducer'
import NFTAnalyseHoldReducer from './NFTAnalyseHoldReducer'
import smartMoneyInfoReducer from './SmartMoneyInfoReducer'


// COMBINED REDUCERS
const reducers = {
    addressAnalyse: addressAnalyseReducer,
    addressCombination: AddressCombinationReducer,
    addressDynamic: addressDynamicReducer,
    application: applicationReducer,
    appDetail: AppDetailReducer,
    userInfo: userInfoReducer,
    assetBoard: AssetBoardReducer,
    chanceWarning: chanceWarningReducer,
    setWarning: setWarningReducer,
    menuList: MenuReducer,
    marketPage: marketPage,
    currencyAddrLineReducer: currencyAddrLineReducer,
    currencyAddrRankReducer: currencyAddrRankReducer,
    SMAddrRankReducer,
    transactionHistoryReducer: transactionHistoryReducer,
    comparisonReducer: comparisonReducer,
    connectWalletDialog: connectWalletDialogReducer,
    analysisSellingUsersReducer: analysisSellingUsersReducer,
    analysisBuyingTodayReducer: analysisBuyingTodayReducer,
    positionIncomeReducer: positionIncomeReducer,
    investmentPriceReducer: investmentPriceReducer,
    investmentNumberReducer: investmentNumberReducer,
    investmentLpHistoryReducer: investmentLpHistoryReducer,
    investmentSwapHistoryReducer: investmentSwapHistoryReducer,
    increaseAndDecreaseReducer: increaseAndDecreaseReducer,
    increaseAndDecreaseRankReducer: increaseAndDecreaseRankReducer,
    investmentDetailsReducer: investmentDetailsReducer,
    NftDetailsReducer,
    NftPlotsHistoryReducer,
    NftSwapHistoryReducer,
    smBuySellRankReducer: smBuySellRankReducer,
    smTransactionRecordReducer,
    CEXInteractiveRankReducer,
    HotContractAddRankReducer,
    TransferRecordReducer,
    CEXLineReducer,
    smartMoneyReducer,
    NFTAnalyseReducer,
    NFTAnalyseHoldReducer,
    smartMoneyInfoReducer
}

const rootReducer = combineReducers(reducers);

export type AppState = ReturnType<typeof rootReducer>;

export default rootReducer;
