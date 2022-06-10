import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {

  render() {
    return (
      <Html>
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <script
            dangerouslySetInnerHTML={{
              __html: `
              var _czc = _czc || [];_czc.push(["_setAccount", ""]);
              `,
            }}
          />  

          <script async src="https://www.googletagmanager.com/gtag/js?id="></script>
          <script dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments)}
                gtag('js', new Date());
                gtag('config', '');
              `,
            }} />
          <script src="/Iconfont/iconfont.js"></script>
          <script src="/static/datafeeds/udf/dist/polyfills.js" />
					<script src="/static/datafeeds/udf/dist/bundle.js" />
        </Head>
        <body>
          <Main />
          <script type="text/javascript" src="https://v1.cnzz.com/z_stat.php?id=&web_id=" async></script>
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument