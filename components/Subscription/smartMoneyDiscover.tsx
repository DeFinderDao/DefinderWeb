import { Table } from 'antd'
import { ColumnsType } from 'antd/lib/table/interface'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import 'styles/subscription.less'
import Global from 'utils/Global'

interface SubscriptionSmartMoneyDiscoverProps {
  columns: ColumnsType<any>,
  data: any,
  row: number,
  totalSize?: number
}
export default function SubscriptionSmartMoneyDiscover({ columns, row, totalSize = 5, data }: SubscriptionSmartMoneyDiscoverProps) {
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
        <div className='subscription-analyse-foot' style={{ marginTop: 20 }}>
          <div className='subscription-btn' onClick={subscriptionClick}>
            {f('subscriptionBtn')}
          </div>
        </div>
      </div>
      <Table style={{ width: '100%', filter: 'blur(8px)' }} showHeader={false} pagination={false} columns={columns} dataSource={Global.getSkeletonData(data, totalSize - row)} />
    </div>
  )
}