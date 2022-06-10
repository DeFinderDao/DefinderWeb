import { useEffect } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { getNFTHoldNumPie } from "redux/actions/NFTAnalyseHoldAction";
import { AppState } from "redux/reducers";
import NFTHolderPie from "./NFTHolderPie";

export default function NFTHolderNumber({ symbolAddr }: { symbolAddr: string }) {
  const { formatMessage } = useIntl();
  const f = (id: string) => formatMessage({ id });
  const dispatch = useDispatch()

  const { address } = useSelector((state: AppState) => state.userInfo);
  const numList = useSelector((state: AppState) => state.NFTAnalyseHoldReducer.numList)
  const numUpdateTime = useSelector((state: AppState) => state.NFTAnalyseHoldReducer.numUpdateTime)

  useEffect(() => {
    dispatch(
      getNFTHoldNumPie({ symbolAddr: symbolAddr })
    )
  }, [symbolAddr])
  
  return (
    <>
      <NFTHolderPie title={f('NFTHolderNumberTitle')} desc={f('NFTHolderNumberDesc')} num={0} data={numList} updateTime={numUpdateTime} />
    </>
  )
}