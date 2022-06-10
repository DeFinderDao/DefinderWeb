import React, { useState } from 'react'
import { Empty, Spin } from 'antd'

interface Props {
  image?: string,
  spinning?: boolean
}

export default function DefinEmpty({ image = '/images/empty.svg', spinning = false }: Props) {
  return (<>
    {
      spinning
        ?
        <Spin spinning={spinning}>
          <div style={{ height: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center', color: "rgba(255, 255, 255, 0.85)" }}></div>
        </Spin>
        :
        <Empty image={image} style={{ height: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center', color: "rgba(255, 255, 255, 0.85)" }} />
    }
  </>)
}
