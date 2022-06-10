import 'styles/error.less'
import Image from 'next/image'
import { Button } from 'antd'
import { useRouter } from 'next/router'
import type { NextPageContext } from 'next'
import { useIntl } from 'react-intl'

function Error({ statusCode } : {statusCode: number}) {
    const router = useRouter()
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id })
    return (
        <div className="error">
            <Image src="/images/500.png" alt="500" width={344} height={344} />
            <p>{f('sysErr')}</p>
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

Error.getInitialProps = ({ res, err } : NextPageContext) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404
    return { statusCode }
}

export default Error
