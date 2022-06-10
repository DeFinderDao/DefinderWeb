import 'styles/subscription.less'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import Global from 'utils/Global'

export default function SubscriptionWarning() {
  const { formatMessage } = useIntl()
  const f = (id: string) => formatMessage({ id })
  const router = useRouter()
  const subscriptionClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    Global.openNewTag(e,router,'/member');
  }
  return (
    <div className="subscription-warning">
      <span>{f('subscriptionWarning')}</span>
      <span className='subscription-btn' onClick={subscriptionClick}>{f('subscriptionBtn')}</span>
    </div>
  )
}