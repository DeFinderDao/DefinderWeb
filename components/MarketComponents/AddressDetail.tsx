import { useIntl } from 'react-intl'
import React, { useState } from 'react'
import ApiClient from 'utils/ApiClient'
import { Popover, Spin, message, Tooltip } from 'antd'
import Global from 'utils/Global'
import { CODE_SUCCESS } from 'utils/ApiServerError'
import moment from 'moment'
import { useRouter } from 'next/router'
import { getAddressInfo } from 'utils/AddressInfoLruCache'
import { ADMIN_ADDRESS } from 'utils/env'
import Link from 'next/link'

interface AddressDetailProps {
    address: string,
    symbolAddr: string,
    symbol: string,
    isContract?: boolean,
    titles?: string[],
    label: string,
    link?: boolean,
    addrShow?: boolean,
}

export interface InfoResponse {
    balance: number,
    balance3d: number,
    balance24h: number,
    balanceValue: number,
    firstTime: number,
    isContract: boolean,
    orders: number,
    ordersType: number,
    address: string,
    titles: string[],
    addrUserTagList: string[],
    addrSystemTagList: string[],
}

export default function AddressDetail({
    address,
    symbolAddr,
    symbol,
    isContract = false,
    titles,
    label,
    link = true,
    addrShow = true
}: AddressDetailProps) {
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id })
    const [addrData, setAddrData] = useState<InfoResponse | null>(null)
    const [loading, setLoading] = useState(false)
    const [visible, setVisible] = useState(false);
    const [time, setTime] = useState<number>(0)
    const router = useRouter()
    const { locale } = router

    const getAddressDetaill = async () => {
        try {
            const data = await getAddressInfo(address, symbolAddr);
            if (data.code === CODE_SUCCESS) {
                setAddrData(data.data)
                setLoading(false)
            } else {
                setAddrData(null)
                setLoading(false)
                message.error(data.message)
            }
        } catch (e) {
            setAddrData(null)
            setLoading(false)
            message.error((e as unknown as Error).message)
        }
    }
    const onMouseEnter = () => {
        if (!loading) {
            setLoading(true)
            setAddrData(null)
            getAddressDetaill();
        }
    }
    const onMouseLeave = () => {
        if (time) {
            clearTimeout(time)
            setLoading(false)
            setTime(0)
            setTimeout(() => {
                setAddrData(null)
            }, 10)
        }
    }
    return (
        <div>
            <Popover
                placement="bottom"
                content={() => {
                    if (loading) {
                        return (
                            <div
                                style={{
                                    width: 340,
                                    height: 150,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Spin />
                            </div>
                        )
                    } else {
                        return (
                            <div
                                style={{
                                    width: 340,
                                    minHeight: 160,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-around',
                                }}
                            >
                                {addrShow ?
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            color: '#fff',
                                        }}
                                    >
                                        {addrData && addrData.address}
                                    </div>
                                    :
                                    null
                                }
                                <div className="address-detail-tags" style={{ display: 'flex' }}>
                                    <Marks userTagList={addrData ? addrData.addrUserTagList : []} systemTagList={addrData ? addrData.addrSystemTagList : []} />
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <span>
                                        {f('balanceValue')}
                                        {addrData && addrData.isContract ? (
                                            <span style={{ color: '#ef6d59' }}>
                                                ({f('contractAddress')})
                                            </span>
                                        ) : (
                                            ''
                                        )}
                                    </span>
                                    <span>
                                        ${' '}
                                        {Global.formatBigNum(
                                            addrData ? addrData.balanceValue : null
                                        )}
                                    </span>
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <span>
                                        {locale == 'zh' ? <>
                                            {f('ordersDes1')}
                                            {symbol}
                                            {f('ordersDes2')}
                                        </> : <>
                                            {f('ordersDes1')}
                                            {f('ordersDes2')}
                                            {symbol}
                                        </>}
                                    </span>
                                    <span>
                                        {addrData && addrData.ordersType == 1
                                            ? (locale == 'zh' ? `${addrData.orders}${f(
                                                'ordersDes3'
                                            )}` : `${f(
                                                'ordersDes3'
                                            )}${addrData.orders}`)
                                            : addrData && addrData.ordersType == 2
                                                ? f('ordersDes31')
                                                : f('ordersDes32')}
                                    </span>
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <span>{f('firstTime')}</span>
                                    <span>
                                        {addrData && addrData.firstTime
                                            ? moment(addrData.firstTime).format(
                                                'YYYY-MM-DD HH:mm'
                                            )
                                            : '--:--'}
                                    </span>
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <span>
                                        {locale == 'zh' ? <>{f('balanceName')}
                                            {symbol}
                                            {f('balanceNum')}</> : <>{symbol}{' '}
                                            {f('balanceName')}{' '}
                                            {f('balanceNum')}</>}

                                    </span>
                                    <span>
                                        {Global.formatBigNum(
                                            addrData ? addrData.balance : null
                                        )}
                                    </span>
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <span>{f('AccountCount24h')}</span>
                                    <span>
                                        {addrData && addrData.balance24h > 0
                                            ? `+ ${Global.formatBigNum(
                                                addrData.balance24h
                                            )} `
                                            : addrData && addrData.balance24h < 0
                                                ? `- ${Global.formatBigNum(
                                                    Math.abs(addrData.balance24h)
                                                )} `
                                                : '0 '}
                                        {symbol}
                                    </span>
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <span>{f('AccountCount3d')}</span>
                                    <span>
                                        {
                                            addrData ? (addrData.balance3d > 0
                                                ? `+ ${Global.formatBigNum(
                                                    addrData.balance3d
                                                )} `
                                                : addrData.balance3d < 0
                                                    ? `- ${Global.formatBigNum(
                                                        Math.abs(addrData.balance3d)
                                                    )} `
                                                    : `${Global.formatBigNum(
                                                        Math.abs(
                                                            addrData.balance3d
                                                        )
                                                    )} `) : '0 '}
                                        {symbol}
                                    </span>
                                </div>
                            </div>
                        )
                    }
                }}
                trigger="hover"
                onVisibleChange={(visible) => {
                    if (visible) {
                        onMouseEnter()
                    } else {
                        onMouseLeave()
                    }
                }}
                overlayClassName="popover-grey"
            >
                <span style={{ position: 'relative' }}>
                    {link ?
                        <Link href={`/address-analyse/${address}`} >
                            <a className="url-link" style={{ position: 'relative' }}>
                                {label ? <span>{label.length > 12 ? label.slice(0, 12) + '...' : label}</span> : Global.abbrSymbolAddress(address)}
                            </a>
                        </Link>
                        :
                        <> {label ? <span>{label.length > 12 ? label.slice(0, 12) + '...' : label}</span> : Global.abbrSymbolAddress(address)} </>
                    }
                    {isContract ? (
                        <svg
                            className="icon"
                            aria-hidden="true"
                            style={{
                                width: 10,
                                height: 10,
                                position: 'absolute',
                                right: -15,
                                top: -5,
                                zIndex: 2
                            }}>
                            <title>{f('contractAddress')}</title>
                            <use xlinkHref='#icon-contract'></use>
                        </svg>
                    ) : null}
                </span>
            </Popover>
        </div>
    )
}

function Marks({ systemTagList, userTagList }: { systemTagList: string[] | null, userTagList: string[] | null }) {
    const tagsData: { text: string, hasOverflowWidth: boolean, isSystem: boolean }[] = [];

    if (userTagList && userTagList.length > 0) {
        userTagList.forEach((tag) => {
            tagsData.push({
                text: tag,
                hasOverflowWidth: false,
                isSystem: false
            });
        });
    }

    if (systemTagList && systemTagList.length > 0) {
        systemTagList.forEach((tag) => {
            if (tag.startsWith(ADMIN_ADDRESS)) {
                tag = tag.substring(ADMIN_ADDRESS.length, tag.length);
            }
            tagsData.push({
                text: tag,
                hasOverflowWidth: false,
                isSystem: true
            });
        });
    }

    if (tagsData.length === 0) {
        return <></>;
    } else {
        const holderWidth = 340;
        let tempWidth = 0;
        const padding = 8 * 2;
        const margin = 5;
        let lastShowTagIndex = -1;
        let hasOverflow = tagsData.some((item, index) => {
            let tagWidth = getTextWidth(item.text, getCanvasFontSize());
            item.hasOverflowWidth = tagWidth + padding > 90;
            tagWidth = tagWidth > 90 ? 90 : tagWidth;
            tempWidth += (tagWidth + padding + margin);
            if (tempWidth > holderWidth) {
                lastShowTagIndex = index;
                return true;
            } else {
                return false;
            }
        });
        if (!hasOverflow) {
            lastShowTagIndex = tagsData.length;
        }
        let tagsComponent = [];
        for (let i = 0; i < lastShowTagIndex; i++) {
            const tagData = tagsData[i];
            const className = tagData.isSystem ? 'mark system-mark' : 'mark user-mark';
            if (tagData.hasOverflowWidth) {
                tagsComponent.push(
                    <span className={className} key={`tag${i}`}>
                        <Tooltip placement="top" title={tagData.text}>
                            {tagData.text}
                        </Tooltip>
                    </span>);
            } else {
                tagsComponent.push(<span className={className} key={`tag${i}`}>{tagData.text}</span>);
            }
        }
        return <>{tagsComponent}{lastShowTagIndex < tagsData.length ? '....' : ''}</>;
    }
}

const canvasHolder: { canvas: HTMLCanvasElement | null } = {
    canvas: null
};

function getCanvasFontSize() {
    const fontWeight = 'normal';
    const fontSize = '14px';
    const fontFamily = '-apple-system, "system-ui", "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
    return `${fontWeight} ${fontSize} ${fontFamily}`;
}

function getTextWidth(text: string, font: string): number {
    // re-use canvas object for better performance
    const canvas = canvasHolder.canvas || (canvasHolder.canvas = document.createElement("canvas"));
    const context = canvas.getContext("2d");
    if (context != null) {
        context.font = font;
        const metrics = context.measureText(text);
        return metrics.width;
    } else {
        return 0;
    }
}