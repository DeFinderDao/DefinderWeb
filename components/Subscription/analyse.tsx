import { useRouter } from 'next/router'
import { MouseEvent } from 'react'
import { useIntl } from 'react-intl'
import 'styles/subscription.less'
import Global from 'utils/Global'
export default function SubscriptionAnalyse() {
  const { formatMessage } = useIntl()
  const f = (id: string) => formatMessage({ id })
  const router = useRouter()
  const subscriptionClick = (event: MouseEvent) => {
    Global.openNewTag(event, router, `/member`)
  }
  return (
    <div className='subscription'>
      <div className="subscription-analyse">
        <div className='subscription-analyse-head'>{f('subscriptionAnalyseTitle')}</div>
        <div className='subscription-analyse-body'>
          <div><span className='subscription-analyse-point'>●</span>{f('subscriptionAnalyseDesc1')}</div>
          <div><span className='subscription-analyse-point'>●</span>{f('subscriptionAnalyseDesc2')}</div>
          <div><span className='subscription-analyse-point'>●</span>{f('subscriptionAnalyseDesc3')}</div>
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