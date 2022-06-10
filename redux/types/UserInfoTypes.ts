import { Action } from 'redux';

type ConnectWalletPageState = 'INIT' | 'CONNECTING' | 'CONNECT_FAIL' | 'CONNECT_NO_PLUGIN'

export type PageMode = 'light' | 'dark'

export interface QueryLog {
    isNotice: number
}

export interface UserInfoState {
    phone: string | null,
    type: string | number,
    address: string,
    currentWallet: string,
    showWalletDialog: boolean,
    connectType: string,
    connectWalletPageState: ConnectWalletPageState,
    error: Error | null,
    mail: string | null,
    pageMode: 'dark' | 'light',
    telegramId: string | null,
    languageType: number,
    browserWarn: number,
    emailWarn: number,
    telegramWarn: number,
    level: number,
    endTime: number,
    showPaySuccessDialog: boolean,
    noviceBootStatus: number,
    experienceCardStatus: number,
    levelId: number,
    inviteDetail? : InviteDetailData,
    inviteCode: string
}

export interface UserInfoResponse {
    phone: string | null;
    mail: string | null;
    token: string;
    uuid: string;
    type: string;
    address: string;
    telegramId: string | null,
    languageType: number,
    browserWarn: number,
    emailWarn: number,
    telegramWarn: number,
    level: number,
    endTime: number,
    noviceBootStatus: number,
    experienceCardStatus: number,
    levelId: number,
}

export interface InviteDetailData {
    inviteCount: number,
    inviteCode: string,
    rewardAmount: number,
    freezeAmount: number,
    rewardSymbol: string,
    rewardRatio: number,
    expireTime: string,
    enableCount: number,
    enableList: string[] | null,
    disableList: string[] | null
}

export interface GetUserInfoSuccessAction extends Action<string> {
    payload: UserInfoResponse
}

export interface GetUserInfoFailAction extends Action<string> {
    payload: Error;
}

export interface SetConnectWalletPageStateAction extends Action<string> {
    payload: ConnectWalletPageState
}

export interface SetUserAddressAction extends Action<string> {
    payload: string
}

export interface SetUserEmailAction extends Action<string> {
    payload: string
}

export interface SetUserPhoneAction extends Action<string> {
    payload: string
}

export interface SetUserTelegramAction extends Action<string> {
    payload: string
}

export interface ChangeAddressError extends Action<string> {
    payload: Error
}

export interface SetPageModeAction extends Action<string> {
    payload: PageMode
}

export interface ToggleAlertStatusAction extends Action<string> {
    payload: number
}

export interface SetPaySuccessDialogVisible extends Action<string> {
    payload: boolean
}

export interface SetUserBeginGuideStateAction extends Action<string> {
    payload: number
}

export interface SetUserConnectWalletTypeAction extends Action<string> {
    payload: string
}

export interface SetUserInviteDetailInfoAction extends Action<string> {
    payload: InviteDetailData
}

export interface SetUserInviteCodeAction extends Action<string> {
    payload: string
}

export type UserInfoActions =  GetUserInfoSuccessAction | GetUserInfoFailAction | 
SetConnectWalletPageStateAction | SetUserAddressAction | ChangeAddressError | 
SetUserEmailAction | SetUserPhoneAction | ToggleAlertStatusAction | 
SetUserTelegramAction | SetPaySuccessDialogVisible | SetUserBeginGuideStateAction | 
SetUserConnectWalletTypeAction | SetUserInviteDetailInfoAction | SetUserInviteCodeAction;
