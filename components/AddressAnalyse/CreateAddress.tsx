import { useIntl } from "react-intl";
import { Table, Tooltip } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "redux/reducers";
import type { TablePaginationConfig } from 'antd/lib/table'
import type { Key, SorterResult, TableCurrentDataSource } from 'antd/lib/table/interface'
import { CreateAddressItem, RelatedAddressItem } from "redux/types/AddressAnalyseTypes";
import { setCreateAddressListPageNo, requestCreateAddressList } from 'redux/actions/AddressAnalyseAction';
import { MouseEvent, useEffect } from "react";
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

export default function CreateAddress({ addrName, groupId }: { addrName: string | undefined, groupId: string | undefined }) {
    const { formatMessage } = useIntl();
    const f = (id: string) => formatMessage({ id });
    const router = useRouter();
    const { locale = DefaultLocale } = router;
    const dispatch = useDispatch();
    const { createAddressLoading, createAddressListTotal, createAddressList, createAddressListPageNo, addressBaseInfo } = useSelector((state: AppState) => state.addressAnalyse);
    const onTokenClick = (e: MouseEvent, address: string) => {
        scrollTop();
        Global.openNewTag(e, router, address, 'replace')
    }
    const columns = [{
        title: f('creator'),
        dataIndex: 'address',
        width: '25%',
        align: 'left' as const,
        render: (text: string, record: CreateAddressItem) => {
            return (
                <span className="token" onClick={e => onTokenClick(e, text)}>
                    <img style={{ borderRadius: 40, marginRight: 10, width: 10 }} src={`data:image/png;base64,${new Identicon(text, 24).toString()}`} />
                    <GlobalLabel addr={record.address} label={record.addressLabel} />
                </span>)
        }
    }, {
        title: f('newAddress'),
        dataIndex: 'newAddress',
        width: '25%',
        align: 'center' as const,
        render: (text: string, record: CreateAddressItem) => {
            return (
                <span className="token" onClick={e => onTokenClick(e, text)}>
                    <img style={{ borderRadius: 40, marginRight: 10, width: 10 }} src={`data:image/png;base64,${new Identicon(text, 24).toString()}`} />
                    <GlobalLabel addr={record.newAddress} label={record.newAddressLabel} />
                </span>)
        }
    }, {
        title: f('newAddressTime'),
        dataIndex: 'newDays',
        width: '25%',
        align: 'center' as const,
        render: (text: string) => {
            return <span className="table-item-color">{`${text}${f('unit4')}`}</span>
        }
    }, {
        title: f('newAddressValue'),
        dataIndex: 'newTotalValue',
        width: '25%',
        align: 'center' as const,
        render: (text: string) => {
            return <span className="table-item-color">${Global.formatBigNum(text) === NOT_A_NUMBER ? NOT_A_NUMBER : `${Global.formatBigNum(text)}`}</span>
        }
    }
    ];

    useEffect(() => {
        if (addrName && addrName !== addressBaseInfo.addrName) {
            dispatch(requestCreateAddressList(addrName, groupId, createAddressListPageNo, PAGESIZE));
        }
    }, [addrName, groupId, addressBaseInfo.addrName]);

    const handleTableChange = (pagination: TablePaginationConfig, filters: Record<string, (Key | boolean)[] | null>, sorter: SorterResult<CreateAddressItem> | SorterResult<CreateAddressItem>[], extra: TableCurrentDataSource<any>) => {
        if (pagination) {
              
            dispatch(setCreateAddressListPageNo(pagination.current!));
            dispatch(requestCreateAddressList(addrName!, groupId, pagination.current!, PAGESIZE));
        }
    }

    return (
        <div className="potentialRelateAddr address-assets" style={{ borderBottom: 'none' }}>
            <div className="assets-header" style={{ justifyContent: 'left' }}>
                <span className="title">{f('createAddress')}</span>
                <Tooltip
                    placement="right"
                    title={
                        <div>
                            {f('createAddressTip')}
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
                    rowKey={(record: CreateAddressItem) => {
                        return `${record.address}${record.newAddress}`;
                    }}
                    dataSource={createAddressList}
                    loading={createAddressLoading}
                    pagination={{
                        showQuickJumper: true,
                        showSizeChanger: false,
                        current: createAddressListPageNo,
                        pageSize: PAGESIZE,
                        total: createAddressListTotal,
                        position: ['bottomCenter'],
                    }}
                    onChange={handleTableChange}
                    style={{ marginTop: '20px' }} />
                <WaterMarkContent />
            </div>
        </div>
    );
}