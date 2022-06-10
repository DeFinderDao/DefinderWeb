import NFTHolderNumber from "./NFTHolderNumber";
import NFTHolderTime from "./NFTHolderTime";

export default function NFTHolderIndex({ symbolAddr }: { symbolAddr: string }) {

  return (
    <>
      <NFTHolderNumber symbolAddr={symbolAddr} />
      <NFTHolderTime symbolAddr={symbolAddr} />
    </>
  )
}