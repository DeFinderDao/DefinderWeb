import { Switch, Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons"
import { SwitchChangeEventHandler } from "antd/lib/switch";
import { useIntl } from "react-intl";

interface Props {
  disabled: boolean,
  onChange: SwitchChangeEventHandler
}
export default function OnlyNewProject({ disabled, onChange }: Props) {
  const { formatMessage } = useIntl();
  const f = (id: string) => formatMessage({ id });
  return (
    <div className="title-right defi-flex defi-align-center" style={{paddingTop: 0}}>
      <Tooltip
        placement="top"
        title={f('onlyNewProjectDesc')}
      >
        <QuestionCircleOutlined
          style={{
            fontSize: '16px',
            marginLeft: '10px',
            cursor: 'pointer'
          }}
        />
      </Tooltip>
      <span style={{margin: '0 5px'}}>{f('onlyNewProject')}</span>
      <Switch disabled={disabled} defaultChecked={false} onChange={onChange} />
    </div>
  )
}