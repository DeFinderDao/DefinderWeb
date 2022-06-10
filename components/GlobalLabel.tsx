import { Tooltip } from "antd"
import Link from "next/link"
import Global from "utils/Global"

interface GlobalLabelProps {
  label?: string,
  addr?: string,
  link?: string,
  maxLength?: number
}
export default function GlobalLabel({ addr="", label, maxLength=12,link }: GlobalLabelProps) {
  const getMore = (label: string) => {
    if (label.length > maxLength) {
      return (
        <Tooltip placement="topLeft" title={label}>
          {label.slice(0, maxLength) + '...'}
        </Tooltip>
      )
    }
    return (
      <>
        {label}
      </>
    )
  }
  if (label) {
    return (
      <>
        {link ?
          <Link href={`${link}${addr}`} >
            <a className="url-link">
              {getMore(label)}
            </a>
          </Link>
          :
          <span>{getMore(label)} </span>
        }
      </>
    )
  } else {
    return (
      <>
        {
          link ?
            <Link href={`${link}${addr}`} >
              <a className="url-link">
                <Tooltip placement="topLeft" title={addr}>
                  {Global.abbrSymbolAddress(addr)}
                </Tooltip>
              </a>
            </Link >
            :
            <span>
              <Tooltip placement="topLeft" title={addr}>
                {Global.abbrSymbolAddress(addr)}
              </Tooltip>
            </span>
        }
      </>
    )
  }
}