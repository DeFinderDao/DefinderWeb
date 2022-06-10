import { Spin } from "antd";
import React from "react";

export default function DefinderLoading() {
  return (
    <div style={{ textAlign: 'center', margin: '200px 0' }}>
      <Spin size="large"/>
    </div>
  )
}