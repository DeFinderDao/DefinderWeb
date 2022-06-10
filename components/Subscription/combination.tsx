import 'styles/subscription.less'
import { Modal } from 'antd'
import { useRouter } from 'next/router'
import Global from 'utils/Global'
import { MouseEvent } from 'react'

interface Props {
  visible: boolean,
  onCancel?: () => void,
  text: TextProps,
  zIndex?: number,
}
interface TextProps {
  title: string,
  desc: React.ReactNode | string,
  okText: string
}
export default function SubscriptionCombination({ visible, text, onCancel = () => { }, zIndex }: Props) {
  const router = useRouter()
  const subscriptionClick = (event: MouseEvent) => {
    Global.openNewTag(event, router, `/member`)
    onCancel();
  }
  return (
    <Modal
      centered
      footer={null}
      visible={visible}
      zIndex={zIndex}
      onCancel={(e) => {
        onCancel()
      }}
      className="subscription-combination"
    >
      <div className="subscription-combination-box">
        <div className='subscription-combination-title'>{text.title}</div>
        <div className='subscription-combination-desc'>{text.desc}</div>
        {text.okText ? <div className='subscription-btn' onClick={subscriptionClick}>{text.okText}</div> : null}
      </div>
    </Modal>
  )
}