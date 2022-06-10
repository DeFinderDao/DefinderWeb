import NFTAssetsDistribution from "./NFTAssetsDistribution";
import NFTHistoryProjectsDetail from "./NFTHistoryProjectsDetail";

export default function AddressData({ groupId, addr }: { groupId: string | undefined, addr: string | undefined}) {
    return (
        <>
            <NFTAssetsDistribution addrName={addr} groupId={groupId} />
            <NFTHistoryProjectsDetail addrName={addr} groupId={groupId} />
        </>
    );
}