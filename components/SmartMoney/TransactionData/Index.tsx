import BuySellRank from "./BuySellRank";
import 'styles/smart-money.less'
import TransactionRecord from "./TransactionRecord";
import { useSelector } from "react-redux";
import { AppState } from "redux/reducers";

interface TransactionDataProps {
  addressType: string,
}
export default function TransactionData() {
  return (
    <>
      <div className="transaction-data">
        <BuySellRank type="Buy" showMore={true} />
      </div>
      <div className="transaction-data">
        <BuySellRank type="Sell" showMore={true} />
      </div>
      <div className="transaction-data">
        <TransactionRecord />
      </div>
    </>
  )
}