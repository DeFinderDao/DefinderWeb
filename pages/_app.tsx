import '../styles/globals.css'
import '../styles/common.less'
import { Button, ConfigProvider, Modal } from 'antd'
import zhCN from 'antd/lib/locale/zh_CN'
import enUS from 'antd/lib/locale/en_US'
import { Provider } from 'react-redux'
import { useStore } from '../redux/store'
import { IntlProvider, useIntl } from 'react-intl'
import { useEffect,useState } from 'react'
import { useRouter,NextRouter } from 'next/router'
import locales from '../locales'
import Head from 'next/head'
import { setMenuAddress } from 'redux/actions/MenuAction'
import { startWorker } from 'utils/webWorker/worker'
import { isUserLogined, KEY_LOCALE } from 'utils/storage'
import Layout from 'components/Layout/layout'
import {withoutTemplateRoute} from 'utils/WithoutTemplatePageRoute'
import * as localeTypes from 'locales/types';
import { AppProps } from 'next/app';
import { Actions } from 'redux/types'
import { Store } from 'redux'
import { AppState } from 'redux/reducers'
import moment from 'moment'
import { Locale } from 'antd/lib/locale-provider'
import { DefaultLocale, SupportLanguages } from 'utils/env'
import DefinEmpty from 'components/Header/definEmpty'
import ApiClient from 'utils/ApiClient'
import { getUserInfoSuccess } from 'redux/actions/UserInfoAction'
import { UserInfoResponse } from 'redux/types/UserInfoTypes'

function MyApp({ Component, pageProps }: AppProps) {
    const store : Store<AppState,Actions> = useStore(pageProps.initialReduxState)
    const router = useRouter()
    //
    const { locale = DefaultLocale, defaultLocale, pathname, asPath,query } : NextRouter = router
    //const localeCopy : localeTypes.LocaleData = locales[DefaultLocale];
    const localeCopy : localeTypes.LocaleData = locales[locale];
    //const localeCopy : localeTypes.LocaleData = locales[DefaultLocale];
    const messages = { ...localeCopy[pathname], ...localeCopy['share'] }
    useEffect(() => {
        const apiClient = new ApiClient<UserInfoResponse>();
        const handleRouteChange = () => {
            store.dispatch(setMenuAddress(router.asPath))
        }

        router.events.on('routeChangeStart', handleRouteChange)

        return () => {
            router.events.off('routeChangeStart', handleRouteChange)
        }
    }, [asPath])
    useEffect(() => {
        /*const isLogin = isUserLogined()
        if (isLogin) {
            startWorker()
        }*/
        
        if(typeof navigator !== 'undefined' && navigator.cookieEnabled) {
            const currentLocale = localStorage.getItem(KEY_LOCALE);
            if(!!currentLocale && currentLocale !== locale && SupportLanguages.includes(currentLocale) && router.asPath !== router.route) {
                router.replace({ pathname, query }, asPath, { locale: currentLocale })
            }
        }
    }, [router])

    
    //moment.locale('en')
    
    const [antLocale,setAntLocale] = useState<Locale>(enUS);
    useEffect(() => {
        switch (locale) {
            case 'en':
                moment.locale('en')
                break
            case 'zh':
                moment.locale('zh-cn')
                break
        }
        setAntLocale(locale === 'zh' ? zhCN : enUS);
    }, [locale])

    //
    const [withoutTemplate,setWithoutTemplate] = useState(false);
    useEffect(() => {
        //
        const result = withoutTemplateRoute.find(route => (asPath && asPath == route) || Component.name.indexOf("404") > -1);
        setWithoutTemplate(!!result);
    },[asPath]);

    const customizeRenderEmpty = () => (
        <div className="empty-container" style={{ height: 250, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <DefinEmpty />
        </div>
    );

    return (
        <Provider store={store}>
            <ConfigProvider locale={antLocale} renderEmpty={customizeRenderEmpty}>
                <IntlProvider
                    locale={locale}
                    defaultLocale={defaultLocale}
                    messages={messages}
                >
                    <>
                        <Head>
                            <title>Definder</title>
                            <meta name="keywords" content="Definder,cryptocurrency investing,defi,blockchain data,smart money,token"></meta>
                            <meta name="Description" content="Focus on defi data analysis and discover investment opportunities."></meta>
                        </Head>
                        {!withoutTemplate ? (
                            <Layout>
                                <Component {...pageProps} />
                            </Layout>
                        ) : (
                            <Component {...pageProps} />
                        )}
                    </>
                </IntlProvider>
            </ConfigProvider>
        </Provider>
    )
}

export default MyApp
