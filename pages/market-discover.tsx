import 'styles/market-page.less'
import Discover from 'components/MarketComponents/Discover'

export default function marketDiscover() {
  return (
    <div className="market-page">
      <div className="discover-container">
        <Discover showMore={true} />
      </div>
    </div>
  )
}