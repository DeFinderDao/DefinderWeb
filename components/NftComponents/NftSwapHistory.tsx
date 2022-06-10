import { BackTop, Divider, message, Table, Image } from 'antd';
import { ColumnsType, SorterResult, TableCurrentDataSource, TablePaginationConfig } from 'antd/lib/table/interface';
import { NextRouter, useRouter } from 'next/router';
import { UpCircleOutlined, EyeOutlined } from '@ant-design/icons'
import React, { useState, Key, useEffect } from 'react'
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { getNftSwapList, nftSwapListLoading, nftSwapListNoMore } from 'redux/actions/NftDetails/NftSwapHistoryAction';
import { AppState } from 'redux/reducers';
import { DefaultLocale } from 'utils/env';
import Global from 'utils/Global';
import Identicon from 'identicon.js/identicon.js'
import { NftSwapHistoryItem, NftSwapHistoryParams, ResponseNftSwapHistory } from 'redux/types/NftSwapHistoryTypes';
import ApiClient from 'utils/ApiClient';
import WaterMarkContent from 'components/WaterMarkContent';
import GlobalLabel from 'components/GlobalLabel';

export default function NftSwapHistory(props: NftSwapHistoryParams) {
  const {
    type,
    startTime,
    endTime,
    addressList,
    symbolAddrList,
  } = props;
  const { formatMessage } = useIntl()
  const f = (id: string) => formatMessage({ id })
  const dispatch = useDispatch()
  const router = useRouter()
  const { locale = DefaultLocale }: NextRouter = router;

  const [swapCondition, setSwapCondition] = useState<NftSwapHistoryParams>({
    pageNo: 1,
    pageSize: 50,
    type: type, 
    startTime: startTime,
    endTime: endTime,
    addressList: addressList,
    symbolAddrList: symbolAddrList, 
  })
  const nftSwapLoading = useSelector(
    (state: AppState) => state.NftSwapHistoryReducer.nftSwapLoading
  )
  const nftSwap = useSelector(
    (state: AppState) => state.NftSwapHistoryReducer.nftSwap
  )
  const nftSwapTotalSize = useSelector(
    (state: AppState) => state.NftSwapHistoryReducer.nftSwapTotalSize
  )
  const nftSwapNoMore = useSelector(
    (state: AppState) => state.NftSwapHistoryReducer.nftSwapNoMore
  )

  const dispatchType = (info: NftSwapHistoryParams) => {
    setSwapCondition(info)
    dispatch(
      getNftSwapList(info)
    )
  }

  useEffect(() => {
    const element = document.getElementsByClassName('currency-addr-rank-scroll')[0] as unknown as HTMLElement;
    element.scrollTop = 0;
    dispatchType({
      pageNo: 1,
      pageSize: 50,
      type: type,
      startTime: startTime,
      endTime: endTime,
      addressList: addressList,
      symbolAddrList: symbolAddrList, 
    })
  }, [type, startTime, endTime, addressList?.toString(), symbolAddrList?.toString()])

  const handleTableChange = (pagination: TablePaginationConfig, filters: Record<string, (Key | boolean)[] | null>, sorter: SorterResult<any> | SorterResult<any>[], extra: TableCurrentDataSource<any>) => {
    dispatchType({
      ...swapCondition,
      pageNo: pagination.current,
      pageSize: pagination.pageSize,
    })
  }

  const typeFilters = (type: number) => {
    switch (type) {
      case 0:
        return f('nftHistoryType0')
      case 1:
        return f('nftHistoryType1')
      case 2:
        return f('nftHistoryType2')
      case 3:
        return f('nftHistoryType3')
      case 4:
        return f('nftHistoryType4')
      case 5:
        return f('nftHistoryType5')
      default:
        return f('nftHistoryType0')
    }
  }

  const handleNftAnalyseClick = (symbolAddr: string,e: any) => {
    Global.openNewTag(e, router, `/nft-analyse-detail/nft-analyse/${symbolAddr}`);
  }

  const groupSwapColumns: ColumnsType<NftSwapHistoryItem> = [
    {
      title: f('nftTableDate'),
      dataIndex: 'date',
      key: 'date',
      width: 150,
      render: (text, record) => {
        return Global.distanceFromCurrent(record.date, locale, true)
      },
    },
    {
      title: f('nftTableType'),
      dataIndex: 'type',
      key: 'type',
      align: 'center',
      width: 100,
      render: (text, record) => {
        return (
          <span style={{ color: record.type == 1 || record.type == 3 || record.type == 5 ? '#00A700' : '#F25959' }}> {typeFilters(record.type)}</span>
        )
      },
    },
    {
      title: f('nftTableSymbol'),
      dataIndex: 'symbol',
      key: 'symbol',
      render: (text, record) => {
        return (
          <div className='defi-flex defi-align-center' style={{cursor: 'pointer'}} onClick={handleNftAnalyseClick.bind(null,record.symbolAddr)}>
            {record.logo !== null ?
              (
                <>
                  <Image
                    style={{ borderRadius: 5, cursor: 'pointer' }}
                    preview={{
                      src: record.logo,
                      mask: <EyeOutlined style={{ fontSize: 14 }} />
                    }}
                    width={30}
                    src={Global.ossImageScale(record.logo, 30, 30)} />
                  &nbsp;&nbsp;
                </>
              ) : ''}
            <GlobalLabel addr="" label={record.symbol} />
            <GlobalLabel label={`#${record.tokenId}`} />
          </div>
        )
      },
    },
    // {
    //   title: f('nftTableTokenId'),
    //   dataIndex: 'tokenId',
    //   key: 'tokenId',
    //   render: (text, record) => {
    //     return <GlobalLabel label={`#${record.tokenId}`}/>
    //   },
    // },
    {
      title: f('nftTablePrice'),
      dataIndex: 'price',
      key: 'price',
      render: (text, record) => {
        if (record.price === null) {
          return ''
        }
        return <span>{Global.formatNum(record.price)} <span style={{ color: '#999' }}>{record.unit}</span></span>
      },
    },
    {
      title: f('nftTableGas'),
      dataIndex: 'gas',
      key: 'gas',
      render: (text, record) => {
        return <span>{Global.formatNum(record.gas)}<span style={{ color: '#999' }}>{record.unit}</span></span>
      },
    },
    {
      title: f('nftTableContractAddress'),
      dataIndex: 'contractAddress',
      key: 'contractAddress',
      align: 'center',
      width: 250,
      render: (text, record) => {
        if (record.contractAddress) {
          return (
            <div style={{ cursor: 'pointer' }} onClick={() => {
              let addr = record.contractAddress;
              const copyUrlBtn = document.createElement('input');
              copyUrlBtn.value = addr;
              document.body.appendChild(copyUrlBtn);
              copyUrlBtn.select();
              document.execCommand('Copy');
              document.body.removeChild(copyUrlBtn);
              message.success(f('copySuccess'))
            }}>
              <img style={{ borderRadius: 40, marginRight: 10 }} src={`data:image/png;base64,${new Identicon(record.contractAddress, 24).toString()}`} />
              {`${Global.abbrSymbolAddress(record.contractAddress)}${record.isContract ? `(${f('contractAddresses')})` : ''}`}
            </div>
          )
        } else {
          return null
        }
      },
    },
    {
      title: f('nftTableTxHashUrl'),
      dataIndex: 'txHashUrl',
      key: 'txHashUrl',
      align: 'right',
      width: 100,
      render: (text, record) => {
        return (
          <svg
            className="icon"
            aria-hidden="true"
            style={{ width: 16, height: 16, cursor: 'pointer' }}
            onClick={() => {
              window.open(record.txHashUrl)
            }}>
            <use xlinkHref='#icon-etherscan'></use>
          </svg>
        )
      },
    },
  ]


  const [dataMore, setDataMore] = useState<NftSwapHistoryItem[]>()
  useEffect(() => {
    setDataMore(nftSwap as NftSwapHistoryItem[])
  }, [nftSwap])

  useEffect(() => {
    if (nftSwapLoading) {
      setTimeout(() => {
        const bodyTop = (document.getElementsByClassName('currency-addr-rank-scroll')[0] as HTMLDivElement).scrollTop
        const dom = (document.querySelector('.currency-addr-rank-scroll .ant-spin') as HTMLDivElement)
        if (dom) {
          dom.style.top = `${bodyTop}px`
        }
      }, 100);
    }
  }, [nftSwapLoading])
  const smTransactionRankScroll = () => {
    const fatherHeight = (document.getElementsByClassName('currency-addr-rank-scroll')[0] as HTMLDivElement).offsetHeight
    const bodyHeight = (document.getElementsByClassName('ant-table-wrapper')[0] as HTMLDivElement).offsetHeight
    const bodyTop = (document.getElementsByClassName('currency-addr-rank-scroll')[0] as HTMLDivElement).scrollTop
    const dom = (document.querySelector('.currency-addr-rank-scroll .ant-spin') as HTMLDivElement)
    if (dom) {
      dom.style.top = `${bodyTop}px`
    }
    if (bodyHeight - bodyTop < fatherHeight + 100) {
      if (bodyTop != 0 && nftSwapLoading === false) {
        if (dataMore && dataMore.length > 0 && !nftSwapLoading && !nftSwapNoMore) {
          if (dom) {
            dom.style.top = `${bodyTop}px`
          }
          getMoreData();
        }
      }
    }
  }
  const getMoreData = async () => {
    dispatch(nftSwapListLoading(true))
    try {
      const apiClient = new ApiClient<ResponseNftSwapHistory>()
      const data = await apiClient.post(
        `/addr/nft/trade/record`,
        {
          data: {
            pageNo: swapCondition.pageNo as number + 1,
            pageSize: swapCondition.pageSize,
            type: swapCondition.type, 
            startTime: Global.getDayStart(swapCondition.startTime, 1000),
            endTime: Global.getDayEnd(swapCondition.endTime, 1000),
            addressList: swapCondition.addressList,
            symbolAddrList: swapCondition.symbolAddrList, 
          }
        }
      )
      if (data.data.list && data.data.list.length > 0) {
        const arr = dataMore?.concat(data.data.list)
        setDataMore(arr)
        setSwapCondition({
          ...swapCondition as NftSwapHistoryParams,
          pageNo: swapCondition?.pageNo as number + 1,
        })
        if (swapCondition.pageSize && data.data.list.length < swapCondition.pageSize) {
          dispatch(nftSwapListNoMore(true))
        }
        dispatch(nftSwapListLoading(false))
      } else {
        dispatch(nftSwapListNoMore(true))
        dispatch(nftSwapListLoading(false))
      }
    } catch (e) {
      dispatch(nftSwapListLoading(false))
    }
  }
  return (
    <div
      className="common-table"
      style={{ boxShadow: 'none', padding: '0 0 20px', margin: 0, position: 'relative' }}
    >
      <WaterMarkContent />
      <div className="currency-addr-rank-scroll" style={dataMore?.length == 0 ? {} : {
        position: 'relative', maxHeight: window.innerHeight < 850
          ? window.innerHeight - 180
          : window.innerHeight - 250, overflow: 'auto'
      }} onScroll={smTransactionRankScroll}>
        <Table
          rowKey={(record: NftSwapHistoryItem) => {
            return JSON.stringify(record);
          }}
          columns={groupSwapColumns}
          pagination={false}
          dataSource={swapCondition.pageNo == 1 ? nftSwap : dataMore}
          loading={nftSwapLoading}
          onChange={handleTableChange}
          sticky
        />
        <BackTop target={() => {
          return document.getElementsByClassName('currency-addr-rank-scroll')[0] as unknown as HTMLElement
        }}>
          <div style={{
            height: 40,
            width: 40,
            borderRadius: 4,
            backgroundColor: 'rgba(16, 136, 233, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}><UpCircleOutlined style={{ fontSize: 27 }} /></div>
        </BackTop>
      </div>
      {!nftSwapLoading && nftSwapNoMore && (nftSwap &&
        nftSwap.length > 0) ? (
        <div className="btnBox">
          <Divider className="no-more">
            {f('noMore')}
          </Divider>
        </div>
      ) : null}
    </div>
  );
}
