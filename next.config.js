const withLess = require('@zeit/next-less')
const withCss = require('@zeit/next-css')
const lessToJS = require('less-vars-to-js')
const withPlugins = require('next-compose-plugins')

const fs = require('fs')
const path = require('path')

function formatDate(date,fmt) {   
  var o = {   
    "M+" : date.getMonth()+1,                   
    "d+" : date.getDate(),                      
    "h+" : date.getHours(),                     
    "m+" : date.getMinutes(),                   
    "s+" : date.getSeconds(),                   
    "q+" : Math.floor((date.getMonth()+3)/3),   
    "S"  : date.getMilliseconds()               
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}

  
/*
const themeVariables = lessToJS(
  fs.readFileSync(path.resolve(__dirname, './styles/antd-custom.less'), 'utf8')
)
*/

const plugins = [withCss({
  cssModules: true,
  ...withLess({
    lessLoaderOptions: {
      javascriptEnabled: true,
        
    },
    webpack: (config, { isServer, dev }) => {
      if (isServer) {
        const antStyles = /antd\/.*?\/style.*?/
        const origExternals = [...config.externals]
        config.externals = [
          (context, request, callback) => {
            if (request.match(antStyles)) return callback()
            if (typeof origExternals[0] === 'function') {
              origExternals[0](context, request, callback)
            } else {
              callback()
            }
          },
          ...(typeof origExternals[0] === 'function' ? [] : origExternals)
        ]

        config.module.rules.unshift({
          test: antStyles,
          use: 'null-loader'
        })
      }
      config.resolve.alias['@'] = path.resolve(__dirname)
      return config
    }
  })
})]

require('dotenv').config({ path: `environments/.env.${process.env.SERVICES_ENV || 'development'}` });

  
const HOME_PAGE = "/market-page";

const nextConfig = {
      
    env: {
      SERVICES_ENV: process.env.SERVICES_ENV,
      HOME_PAGE,
    },
    i18n: {
        locales: ['zh','en'],
        defaultLocale: 'en',
        localeDetection: false,
    },
    images: {
      domains: ['static.definder.info'],
    },
    /*async headers() {
      return [
        {
          source: '/(.png+})',
          headers: [
            {
              key: 'Content-Type',
              value: 'image/png',
            },
          ],
        },
      ]
    },*/
    async rewrites() {
        const array =
            process.env.SERVICES_ENV !== 'production'
                ? [
                      {
                          source: '/api/:slug*',
                          destination: `${process.env.HTTP_PROTOCAL}://${process.env.HTTP_HOSTNAME}/api/:slug*`,
                      },
                  ]
                : []
        return array;
    },
    async generateBuildId() {
        return Buffer.from(formatDate(new Date(), 'yyyy-MM-dd hh')).toString(
            'base64'
        )
    },
}

module.exports = withPlugins(plugins, nextConfig)