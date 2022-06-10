import { Row, Col } from 'antd';
import HolderAddressIncrease from './HolderAddressIncrease';
import NewTokenIncreaseRapidly from './NewTokenIncreaseRapidly';
import ConvergenceRateIncrease from './ConvergenceRateIncrease';
import WhaleContinueIn from './WhaleContinueIn';
import { useIntl } from 'react-intl';
import SMAdmission from './SMAdmission';

interface DiscoverProp {
    showMore: boolean
}
export default function Discover({ showMore }: DiscoverProp) {

    const { formatMessage } = useIntl();
    const f = (id: string) => formatMessage({ id });

    return (
        <>
            <Row>
                <Col span={12} >
                    <HolderAddressIncrease showMore={showMore} />
                </Col>
                <Col span={12}>
                    <NewTokenIncreaseRapidly showMore={showMore} />
                </Col>
                <Col span={12}>
                    <ConvergenceRateIncrease showMore={showMore} />
                </Col>
                <Col span={12}>
                    <WhaleContinueIn showMore={showMore} />
                </Col>
                <Col span={12} >
                    <SMAdmission showMore={showMore} />
                </Col>
                <Col span={12}>
                </Col>
            </Row>
            <div className="more-to-discover">
                {f('moreToDiscover')}
            </div>
        </>
    );
}

