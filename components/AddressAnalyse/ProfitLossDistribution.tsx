import loadable from '@loadable/component';
import { message, Tooltip } from 'antd';
import { QuestionCircleOutlined, CaretUpOutlined, CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';
import { useIntl } from 'react-intl';
import moment from 'moment';
const Column = loadable(() => import('@ant-design/plots/lib/components/column'))
import type {Datum} from '@antv/g2plot'
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from 'redux/reducers';
import { useEffect, useState } from 'react';
import { getProjectsNumberProfitDistributionSuccess } from 'redux/actions/AddressAnalyseAction';
import ApiClient from 'utils/ApiClient';
import { ProjectNumber, ProjectProfitNumberDistributionResponse } from 'redux/types/AddressAnalyseTypes';
import DefinEmpty from 'components/Header/definEmpty';
import React from 'react';
import BigNumber from 'bignumber.js'
import WaterMarkContent from 'components/WaterMarkContent';
import UpdateTimeCom from 'components/UpdateTimeCom';

const axises = ['-1M', '-500k', '-100k', '-50k', '-10k', '-5k', '-1k', '0', '1k', '5k', '10k', '50k', '100k', '500k', '1M'];
const paletteSemanticRed = '#EF5F81';
const brandColor = '#44BE90';

export default function ProfitLossDistribution({ addrName, groupId }: { addrName: string | undefined, groupId: string | undefined }) {
    const { formatMessage } = useIntl();
    const f = (id: string) => formatMessage({ id });

    const { addressBaseInfo, projectNumberDistribution } = useSelector((state: AppState) => state.addressAnalyse);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState<boolean>(false);
    useEffect(() => {
        if (addressBaseInfo.addrName !== addrName || projectNumberDistribution === null) {
            const apiClient = new ApiClient<any>();
            setLoading(true);
            apiClient.post(`/addr/symbol/profit/distribution`, {
                data: {
                    addrName,
                    groupId,
                }
            }).then(success => {
                dispatch(getProjectsNumberProfitDistributionSuccess(success as ProjectProfitNumberDistributionResponse));
            }, e => {
                dispatch(getProjectsNumberProfitDistributionSuccess(null));
                message.error(f('sysErr'));
            }).finally(() => {
                setLoading(false);
            });
        }
    }, [addrName, groupId, addressBaseInfo]);

    let columnData: ProjectNumber[] = [];
    if (projectNumberDistribution && projectNumberDistribution.data.length > 0) {
        projectNumberDistribution.data.forEach((item: ProjectNumber, index: number) => {
            columnData.push({
                type: columnData.length.toString(),
                value: null,
                amount: 0,
                profit: ''
            })
            columnData.push({
                type: columnData.length.toString(),
                value: item.amount === 0 ? null : item.value,
                amount: item.amount,
                profit: item.profit
            });
        });
        columnData.push({
            type: columnData.length.toString(),
            value: null,
            amount: 0,
            profit: ''
        })
    }

    return (
        <div className='profit-loss-box'>
            <div className="header" style={{ marginRight: '40px' }}>
                <div className="title">
                    {f('investProjectsNumberDistribution')}
                    <Tooltip
                        placement="right"
                        title={
                            <div>
                                {f('investProjectsNumberDistributionTips')}
                            </div>
                        }
                    >
                        <QuestionCircleOutlined
                            style={{
                                fontSize: '16px',
                                marginLeft: '10px',
                                display: 'inline-flex',
                                alignItems: 'center',
                            }}
                        />
                    </Tooltip>
                </div>
                <UpdateTimeCom updateTime={projectNumberDistribution?.updateTime} />
            </div>
            <div style={{ height: 400 }}>
                {
                    projectNumberDistribution && projectNumberDistribution.data.length > 0 && !loading ?
                        <MemoColumns columnData={columnData} />
                        :
                        (<div className="table-empty" style={{ height: 200, marginTop: 50 }}>
                            <DefinEmpty spinning={loading} />
                        </div>)
                }
            </div>
        </div>);
}

interface ColumnsProps {
    columnData: ProjectNumber[]
}

const MemoColumns = React.memo(Columns, (prevProps: ColumnsProps, nextProps: ColumnsProps) => {
    if (JSON.stringify(prevProps.columnData) === JSON.stringify(nextProps.columnData)) {
        return true;
    } else {
        return false;
    }
});

function formatProfit(profit: string): string {
    let num = new BigNumber(profit)
    let content = '';
    let suffix = '';
    if (num.absoluteValue().comparedTo(1000000000) > 0) {
        content = Math.ceil(num.div(1000000000).toNumber()).toString();
        suffix = 'B'
    } else if (num.absoluteValue().comparedTo(1000000) > 0) {
        content = Math.ceil(num.dividedBy(1000000).toNumber()).toString();
        suffix = 'M'
    } else if (num.absoluteValue().comparedTo(1000) > 0) {
        content = Math.ceil(num.dividedBy(1000).toNumber()).toString();
        suffix = 'K'
    } else {
        content = Math.ceil(num.toNumber()).toString();
    }
    return content + suffix
}

function Columns({ columnData }: ColumnsProps) {
    const { formatMessage } = useIntl();
    const f = (id: string) => formatMessage({ id });
    const config = {
        data: columnData,
        xField: 'type',
        yField: 'value',
        maxColumnWidth: 15,
        minColumnWidth: 15,
        color: (data: Datum) => {
            if (parseInt(data.type) <= 16) {
                return paletteSemanticRed;
            }
            return brandColor;
        },
        label: {
            content: (originData: Datum) => {
                if (parseInt(originData.type) % 2 === 0) {
                    return '';
                } else if (originData.amount === 0) {
                    return '';
                }
                return `${formatProfit(originData.profit)}/${originData.amount}${f('unit2')}`;
            },
            offset: 10,
            position: 'top' as const,
            style: {
                fontSize: 10,
                fill: '#ffffff'
            },
        },
        tooltip: {
            showNil: false,
            customContent: (title: string, data: Datum) => {
                if (parseInt(title) % 2 === 0) {
                    return '';
                } else {
                    let project: ProjectNumber | null = null;
                    for (let item of columnData) {
                        if (item.type === title && item.value !== null) {
                            project = item;
                            break;
                        }
                    }
                    if (project) {
                        return `<div style="padding: 10px 5px;">
                                    ${f('investProjectAreaTotalProfit')}${formatProfit(project.profit)}
                                </div>
                                <div style="padding: 0px 5px 10px 5px">
                                    ${f('investProjectAreaTotalNumber')}${project.amount}${f('unit2')}
                                </div>`;
                    } else {
                        return '';
                    }
                }
            }
        },
        legend: false as const,
        xAxis: {
            line: null,
            grid: null,
            label: null
        },
        yAxis: {
            line: null,
            grid: null,
            label: null
        },
        padding: [40, 80, 40, 80]
    };

    return (
        <div className="column-box" style={{ height: '100%' }}>
            <WaterMarkContent />
            <Column
                {...config}
            />
            <div className='center-axis'>
                <div className='center-arrow'><CaretUpOutlined style={{ color: '#2C353F' }} /></div>
                <div className='center-line'></div>
            </div>
            <div className='bottom-axis'>
                <div className='left-arrow'><CaretLeftOutlined style={{ color: '#2C353F' }} /></div>
                <div className='right-arrow'><CaretRightOutlined style={{ color: '#2C353F' }} /></div>
                <div className='axis-head axis-text'>{f('lossMoney')}</div>
                <div className='axis-box'>
                    <div className='axis-column-margin'></div>
                    {
                        axises.map((item: string) => {
                            return (
                                <div key={item} className='axis-text axis-column'>{item}</div>
                            )
                        })
                    }
                    <div className='axis-column-margin'></div>
                </div>
                <div className="axis-head axis-text">{f('profitMoney')}</div>
            </div>
        </div>
    );
}