import { useIntl } from 'react-intl'
import { Radio } from 'antd'
import { RadioChangeEvent } from 'antd/lib/radio/interface'

type TimeChooseProps = (e: RadioChangeEvent) => void;

export default function TiemChoose({ timeChange, name = 'marketDetail' }: { timeChange: TimeChooseProps, name?: string}) {
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id })
    return (
        <div>
            <div className="time-choose">
                <Radio.Group
                    defaultValue="2"
                    buttonStyle="solid"
                    onChange={(e) => {
                        timeChange(e)
                    }}
                >
                    <Radio.Button value="4" style={{ marginRight: '30px' }}>
                        {f(`${name}TimeChoose30Days`)}
                    </Radio.Button>
                    <Radio.Button value="3" style={{ marginRight: '30px' }}>
                        {f(`${name}TimeChoose7Days`)}
                    </Radio.Button>
                    <Radio.Button value="2" style={{ marginRight: '30px' }}>
                        {f(`${name}TimeChoose3Days`)}
                    </Radio.Button>
                    <Radio.Button value="1" style={{ marginRight: '30px' }}>
                        {f(`${name}TimeChoose24Hours`)}
                    </Radio.Button>
                    <Radio.Button value="5">
                        {f(`${name}TimeChoose4Hours`)}
                    </Radio.Button>
                </Radio.Group>
            </div>
        </div>
    )
}
