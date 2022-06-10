import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import 'styles/subscription.less'
import Global from 'utils/Global'
export default function SubscriptionSmartMoney() {
  const { formatMessage } = useIntl()
  const f = (id: string) => formatMessage({ id })
  const router = useRouter()
  const subscriptionClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    Global.openNewTag(e, router, '/member');
  }
  return (
    <div className='subscription'>
      <div className="subscription-analyse">
        <div className='subscription-analyse-head'>{f('subscriptionSmartMoneyTitle')}</div>
        <div className='subscription-analyse-body'>
          <div><span className='subscription-analyse-point'>●</span>{f('subscriptionSmartMoneyDesc1')}</div>
          <div><span className='subscription-analyse-point'>●</span>{f('subscriptionSmartMoneyDesc2')}</div>
          <div><span className='subscription-analyse-point'>●</span>{f('subscriptionSmartMoneyDesc3')}</div>
        </div>
        <div className='subscription-analyse-foot'>
          <div className='subscription-btn' onClick={subscriptionClick}>
            {f('subscriptionBtn')}
          </div>
        </div>
      </div>
    </div>
  )
}