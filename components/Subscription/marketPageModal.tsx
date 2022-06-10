import 'styles/subscription.less'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import Global from 'utils/Global'
import { MouseEvent } from 'react'

export function SubscriptionMarketPageModal() {
  const { formatMessage } = useIntl()
  const f = (id: string) => formatMessage({ id })
  const router = useRouter()
  const subscriptionClick = (event: MouseEvent) => {
    Global.openNewTag(event, router, `/member`)
  }
  return (
    <div className="subscription-market" style={{ border: 0, textAlign: 'center' }}>
      <span>{f('subscriptionMarketPageModal')}</span>
      <span className='subscription-btn' onClick={subscriptionClick}>{f('subscriptionBtn')}</span>
    </div>
  )
}