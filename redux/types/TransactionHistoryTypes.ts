import { Action } from "redux";
import { Response } from ".";

export interface TransactionHistoryState {
    loadingBus: boolean,
    loadingLp: boolean,
    loadingTransfer: boolean,
    e: Error | null,
    transactionHistoryBusList: TransactionHistoryResponse | null,
    transactionHistoryLpList: TransactionHistoryResponse | null,
    transactionHistoryTransferList: TransactionHistoryResponse | null,
}

export interface TransactionHistoryParams {
    contract?: string,
    pageNo: number | undefined,
    pageSize: number | undefined,
    symbol0Addr?: string,
    symbolAddr?: string,
    symbol1Addr?: string,
    type?: number | null,
    startTime: number | null,
    endTime: number | null,
    direction?: number | null,
    address: string | null,
    fromAddr?: string | null,
    toAddr?: string | null,
    minAmount: string | number | null,
}

export interface TransactionHistoryResponse {
    endDate: null | number,
    startDate: null | number,
    totalSize: number,
    list: TransactionHistoryItem[]
}

export interface TransactionHistoryItem {
    address: string,
    addressLabel: string,
    description: null | number,
    index: number,
    logoUrl: null | string,
    price0: string,
    price1: string,
    symbol0: string,
    symbol0Addr: string,
    symbol1: string,
    tradeTime: number,
    txHash: string,
    type: number,
    volume0: number,
    volume1: number,
    titles?: string[],
    from?: {
        address: string,
        titles: string[],
        logoUrl: string,
        description: number,
    },
    fromAddr: string,
    fromAddrLabel: string,
    to?: {
        address: string,
        titles: string[],
        logoUrl: string,
        description: number,
    },
    toAddr: string,
    toAddrLabel: string,
    amount?: string,
    value?: string,
    price?: string,
    symbolAddr?: string,
}

export interface ChangeLoadingAction extends Action<string> {
    payload: boolean
}

export interface GetTransactionHistoryFail extends Action<string> {
    payload: Error
}

export interface GetTransactionHistorySuccess extends Action<string> {
    payload: Response<TransactionHistoryResponse>
}

export type TransactionHistoryActions = ChangeLoadingAction | GetTransactionHistoryFail | GetTransactionHistorySuccess;