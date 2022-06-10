import 'styles/error.less'
import Image from 'next/image'
import { Button } from 'antd'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'

export default function Custom404() {
    const router = useRouter()
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id })

    return (
        <div className="error">
            <Image
                src="/images/404.png"
                alt="404"
                width={344}
                height={344}
            />
            <p>{f('pageNotExists')}</p>
            <Button
                type="primary"
                size="large"
                shape="round"
                onClick={() => {
                    router.push(`/`)
                }}
            >
                {f('backHome')}
            </Button>
        </div>
    )
}
