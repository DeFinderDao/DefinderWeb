import { useSelector } from "react-redux";
import { AppState } from "redux/reducers";
import CEXInteractiveRank from "./CEXInteractiveRank";
import CEXLine from "./CEXLine";
import HotContractAddRank from "./HotContractAddRank";
import TransferRecord from "./TransferRecord";


interface SMTransferDataProps {
  addressType: string,
}
export default function SMTransferData() {
  return (
    <>
      <div className="transaction-data">
        <CEXInteractiveRank />
      </div>
      <div className="transaction-data">
        <CEXLine />
      </div>
      <div className="transaction-data">
        <HotContractAddRank showMore={true} />
      </div>
      <div className="transaction-data">
        <TransferRecord />
      </div>
    </>
  )
}