import { useIntl } from 'react-intl'
import { Radio } from 'antd'
import { RadioChangeEvent } from 'antd/lib/radio/interface'

type TimeChooseProps = (e: RadioChangeEvent) => void;

export default function TimeChoose({ timeChange }: { timeChange: TimeChooseProps }) {
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id })
    return (
        <div className="title-right defi-flex defi-align-center" style={{ paddingTop: 0 }}>
            <div className="time-choose">
                <Radio.Group
                    defaultValue="1"
                    buttonStyle="solid"
                    onChange={(e) => {
                        timeChange(e)
                    }}
                >
                    <Radio.Button value="1">
                        {f('TimeChoose1H')}
                    </Radio.Button>
                    <Radio.Button value="4">
                        {f('TimeChoose4H')}
                    </Radio.Button>
                    <Radio.Button value="24">
                        {f('TimeChoose24H')}
                    </Radio.Button>
                </Radio.Group>
            </div>
        </div>
    )
}
