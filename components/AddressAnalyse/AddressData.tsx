import ProjectsDistribution from 'components/AddressAnalyse/ProjectsDistribution';
import ProfitLossDistribution from 'components/AddressAnalyse/ProfitLossDistribution';
import AssetsDistribution from 'components/AddressAnalyse/AssetsDistribution';
import HistoryProjectsDetail from 'components/AddressAnalyse/HistoryProjectsDetail';
import SubscriptionAnalyse from 'components/Subscription/analyse';
import PotentailRelateAddrs from 'components/AddressAnalyse/PotentailRelateAddrs';
import CreateAddress from 'components/AddressAnalyse/CreateAddress';

export default function AddressData({ groupId, addr, level }: { groupId: string | undefined, addr: string | undefined, level: number }) {
    return (
        <>
            <div style={{ display: 'flex' }}>
                <ProjectsDistribution key="profit" type="profit" addrName={addr} groupId={groupId} />
                <ProjectsDistribution key="loss" type="loss" addrName={addr} groupId={groupId} />
            </div>
            <ProfitLossDistribution addrName={addr} groupId={groupId} />
            <AssetsDistribution addrName={addr} groupId={groupId} />
            {
                level == 1 ?
                    <>
                        <HistoryProjectsDetail addrName={addr} groupId={groupId} />
                        <PotentailRelateAddrs addrName={addr} groupId={groupId} />
                        <CreateAddress addrName={addr} groupId={groupId} />
                    </>
                    :
                    <SubscriptionAnalyse />}
        </>
    );
}