import { useEffect } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { getNFTHoldTimePie } from "redux/actions/NFTAnalyseHoldAction";
import { AppState } from "redux/reducers";
import NFTHolderPie from "./NFTHolderPie";

export default function NFTHolderTime({ symbolAddr }: { symbolAddr: string }) {
  const { formatMessage } = useIntl();
  const f = (id: string) => formatMessage({ id });
  const dispatch = useDispatch()

  const { address } = useSelector((state: AppState) => state.userInfo);
  const timeList = useSelector((state: AppState) => state.NFTAnalyseHoldReducer.timeList)
  const timeUpdateTime = useSelector((state: AppState) => state.NFTAnalyseHoldReducer.timeUpdateTime)

  useEffect(() => {
    dispatch(
      getNFTHoldTimePie({ symbolAddr: symbolAddr })
    )
  }, [symbolAddr])

  return (
    <>
      <NFTHolderPie title={f('NFTHolderTimeTitle')} desc={f('NFTHolderTimeDesc')} num={1} data={timeList} updateTime={timeUpdateTime} />
    </>
  )
}