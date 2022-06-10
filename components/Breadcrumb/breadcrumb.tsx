import { Breadcrumb } from 'antd'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import Global from 'utils/Global'
import { DefaultLocale } from 'utils/env'

export default function breadcrumbBar({ lastItem, borderBottom = false }: { lastItem: string, borderBottom?: boolean }) {
    const router = useRouter()
    const { locale = DefaultLocale } = useRouter();
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id })
    const paths = router.query.detail as string[];
    const subPaths = paths.slice(0, paths.length - 1);
    return (
        <div className="defi-breadcrumb" style={borderBottom ? { borderBottom: 0 } : {}}>
            <Breadcrumb separator=">">
                {subPaths.map((item, index) => {
                    let page = paths[index]
                    let url = ''
                    for (let i = 0; i < index; i++) {
                        let itemUrl = paths[i]
                        url += '/' + itemUrl
                    }
                    const route = `/${locale}/${page}/${url}`;
                    return (
                        <Breadcrumb.Item
                            key={item}
                            onClick={(event) => {
                                Global.openNewTag(event, router, route)
                            }}
                        >
                            {!item.includes('detail') ? f(item) : ''}
                        </Breadcrumb.Item>
                    )
                })}
                <Breadcrumb.Item key={lastItem}>{lastItem}</Breadcrumb.Item>
            </Breadcrumb>
        </div>
    )
}
