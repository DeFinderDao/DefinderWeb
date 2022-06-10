import { useIntl } from "react-intl";
import BottomCharts from "./BottomCharts";
import HoldTable from "./HoldTable";
import HoldTop10Rank from "./HoldTop10Rank";
import TokenHoldRankTop10 from "./TokenHoldRankTop10";
import {
    QuestionCircleOutlined
} from '@ant-design/icons'
import { Tooltip } from "antd";

export default function HoldInfo() {
    const { formatMessage } = useIntl();
    const f = (id: string) => formatMessage({ id });
    return (
    <div className="hold-info">
        <p className="title">
            {f('holdInfo')}
            <Tooltip
            placement="right"
            title={
                <>
                    <div>{f('holdTips')}</div>
                </>}
            >
                <QuestionCircleOutlined
                    style={{
                        color: '#BEC4CC',
                        fontSize: '16px',
                        marginLeft: '10px',
                    }}
                />
            </Tooltip>
        </p>
        <HoldTable />
        <HoldTop10Rank />
        <TokenHoldRankTop10 />
        <BottomCharts />
    </div>);
}

