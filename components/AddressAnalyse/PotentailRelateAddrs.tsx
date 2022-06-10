import { useIntl } from "react-intl";
import { Table, Tooltip } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "redux/reducers";
import type { TablePaginationConfig } from 'antd/lib/table'
import type { Key, SorterResult, TableCurrentDataSource } from 'antd/lib/table/interface'
import { RelatedAddressItem } from "redux/types/AddressAnalyseTypes";
import { setRelatedAddressListPageNo, requestRelatedAddressList } from 'redux/actions/AddressAnalyseAction';
import { useEffect } from "react";
import Global from "utils/Global";
import { useRouter } from "next/router";
import { DefaultLocale, NOT_A_NUMBER } from "utils/env";
import Identicon from 'identicon.js/identicon.js';
import { QuestionCircleOutlined } from '@ant-design/icons';
import GlobalLabel from "components/GlobalLabel";
import WaterMarkContent from "components/WaterMarkContent";

const PAGESIZE = 10;

function scrollTop() {
    const element = document.getElementsByClassName('defi-content')[0];
    element.scrollTop = 0;
}

export default function PotentailRelateAddrs({ addrName, groupId }: { addrName: string | undefined, groupId: string | undefined }) {
    const { formatMessage } = useIntl();
    const f = (id: string) => formatMessage({ id });
    const router = useRouter();
    const { locale = DefaultLocale } = router;
    const dispatch = useDispatch();
    const { relatedAddressLoading, relatedAddressListTotal, relatedAddressList, relatedAddressListPageNo, addressBaseInfo } = useSelector((state: AppState) => state.addressAnalyse);
    const onTokenClick = (e: any, address: string) => {
        scrollTop();
        Global.openNewTag(e, router, address, 'replace')
    }
    const columns = [{
        title: f('addr'),
        dataIndex: 'address',
        width: '18%',
        align: 'left' as const,
        render: (text: string, record: RelatedAddressItem) => {
            return (
                <span className="token" onClick={e => onTokenClick(e, text)}>
                    <img style={{ borderRadius: 40, marginRight: 10, width: 10 }} src={`data:image/png;base64,${new Identicon(text, 24).toString()}`} />
                    <GlobalLabel addr={record.address} label={record.addressLabel} />
                </span>
            )
        }
    }, {
        title: f('addrValue'),
        dataIndex: 'addrValue',
        width: '18%',
        align: 'center' as const,
        render: (text: string) => {
            return <span className="table-item-color">$&nbsp;{Global.formatBigNum(text, 0)}</span>
        }
    }, {
        title: f('addrTime'),
        dataIndex: 'addrTime',
        width: '18%',
        align: 'center' as const,
        render: (text: string) => {
            return <span className="table-item-color">{text === null ? NOT_A_NUMBER : `${text}${f('unit4')}`}</span>
        }
    }, {
        title: f('addrToPotential'),
        dataIndex: 'addrToPotential',
        width: '18%',
        align: 'center' as const,
        render: (text: string, record: RelatedAddressItem) => {
            return <span className="table-item-color">${`${Global.formatBigNum(record.transferInValue, 0)}`}&nbsp;{`(${record.transferInCount}${f('unit3').trim()})`}</span>
        }
    }, {
        title: f('potentialToAddr'),
        dataIndex: 'potentialToAddr',
        width: '18%',
        align: 'center' as const,
        render: (text: string, record: RelatedAddressItem) => {
            return <span className="table-item-color">${`${Global.formatBigNum(record.transferOutValue, 0)}`}&nbsp;{`(${record.transferOutCount}${f('unit3').trim()})`}</span>
        }
    }, {
        title: f('linkInfo'),
        dataIndex: 'txHashUrl',
        width: '10%',
        align: 'right' as const,
        render: (text: string) => {
            return (
                <svg
                    className="icon"
                    aria-hidden="true"
                    style={{ width: 16, height: 16, marginRight: 25, cursor: 'pointer' }}
                    onClick={() => {
                        window.open(text)
                    }}>
                    <use xlinkHref='#icon-etherscan'></use>
                </svg>
            )
        },
    },
    ];

    useEffect(() => {
        if (addrName && addrName !== addressBaseInfo.addrName) {
            dispatch(requestRelatedAddressList(addrName, groupId, relatedAddressListPageNo, PAGESIZE));
        }
    }, [addrName, groupId, addressBaseInfo]);

    const handleTableChange = (pagination: TablePaginationConfig, filters: Record<string, (Key | boolean)[] | null>, sorter: SorterResult<RelatedAddressItem> | SorterResult<RelatedAddressItem>[], extra: TableCurrentDataSource<any>) => {
        if (pagination) {
            dispatch(setRelatedAddressListPageNo(pagination.current!));
            dispatch(requestRelatedAddressList(addrName!, groupId, pagination.current!, PAGESIZE));
        }
    }

    return (
        <div className="potentialRelateAddr address-assets">
            <div className="assets-header" style={{ justifyContent: 'left' }}>
                <span className="title">{f('potentialRelateAddr')}</span>
                <Tooltip
                    placement="right"
                    title={
                        <div>
                            {f('potentialRelateAddrTip')}
                        </div>
                    }
                >
                    <QuestionCircleOutlined
                        style={{
                            fontSize: '16px',
                            marginLeft: '10px',
                            color: '#fff'
                        }}
                    />
                </Tooltip>
            </div>

            <div className="common-table" style={{ margin: 0 }}>
                <Table
                    columns={columns}
                    rowKey={(record: RelatedAddressItem) => {
                        return `${record.address}${encodeURI(record.txHashUrl)}`;
                    }}
                    dataSource={relatedAddressList}
                    loading={relatedAddressLoading}
                    pagination={{
                        showQuickJumper: true,
                        showSizeChanger: false,
                        current: relatedAddressListPageNo,
                        pageSize: PAGESIZE,
                        total: relatedAddressListTotal,
                        position: ['bottomCenter'],
                    }}
                    onChange={handleTableChange}
                    style={{ marginTop: '20px' }} />
                <WaterMarkContent />
            </div>
        </div>
    );
}