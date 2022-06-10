import { useRouter } from "next/router"
import { useIntl } from "react-intl"
import { Select } from 'antd';
const { Option } = Select;
import React, {useState} from 'react';

export default function IndexPage() {
  const router = useRouter()
  const { locale, locales, defaultLocale } = router
  const { formatMessage } = useIntl()
  const f = (id:string) => formatMessage({ id })

  const [loc,setLoc] = useState("zh");
  const handleChange = (e:string) => {
      setLoc(e);
      switch(e) {
         case 'en':
           window.location.href = '/en/locale';
         break;
         case 'zh':
          window.location.href = '/locale';
         break;
      }
  }

  return (
    <div>
      <h1>{f("hello")}</h1>
      <p>{f("welcomeMessage")}</p>
      <br />
      <p>Current locale: {locale}</p>
      <p>Default locale: {defaultLocale}</p>
      <p>Configured locales: {JSON.stringify(locales)}</p>
      <Select onChange={handleChange} value={loc}>
        <Option value="zh">中文</Option>
        <Option value="en">英文</Option>
      </Select>
    </div>
  )
}