import { useRouter } from "next/router";
import { CSSProperties } from "react"
import { useIntl } from "react-intl";
import { DefaultLocale } from "utils/env";
import Global from "utils/Global"

interface UpdateTimeComProps {
  style?: CSSProperties,
  updateTime: number | null | undefined,
}
export default function UpdateTimeCom({ style, updateTime }: UpdateTimeComProps) {
  const { formatMessage } = useIntl();
  const f = (id: string) => formatMessage({ id });
  const router = useRouter();
  const { locale = DefaultLocale } = router;
  return (
    <>
      {updateTime ? <span className="title-right" style={style}>
        <svg
          className="icon"
          aria-hidden="true"
          style={{
            width: 16,
            height: 16,
            marginRight: 8,
            verticalAlign: 'middle',
          }}>
          <use xlinkHref='#icon-update_time'></use>
        </svg>
        {f('updateTime')}
        {Global.distanceFromCurrent(updateTime, locale)}
      </span> : null}
    </>
  )
}