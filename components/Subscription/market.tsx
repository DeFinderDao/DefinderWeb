import 'styles/subscription.less'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import Global from 'utils/Global'
import { MouseEvent } from 'react'

export function SubscriptionMarket() {
  const { formatMessage } = useIntl()
  const f = (id: string) => formatMessage({ id })
  const router = useRouter()
  const subscriptionClick = (event: MouseEvent) => {
    Global.openNewTag(event, router, `/member`)
  }
  return (
    <div className="subscription-market">
      <span>{f('subscriptionMarket')}</span>
      <span className='subscription-btn' onClick={subscriptionClick}>{f('subscriptionBtn')}</span>
    </div>
  )
}

export function SubscriptionMarketDetail() {
  const { formatMessage } = useIntl()
  const f = (id: string) => formatMessage({ id })
  const router = useRouter()
  const subscriptionClick = (event: MouseEvent) => {
    Global.openNewTag(event, router, `/member`)
  }
  return (
    <div className="subscription-market-detail">
      <span className='subscription-market-detail-desc'>{f('subscriptionDiscover')}</span>
      <span className='subscription-btn' onClick={subscriptionClick}>{f('subscriptionBtn')}</span>
    </div>
  )
}