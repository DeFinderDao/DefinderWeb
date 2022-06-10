
  
export const ACTION_OPEN_CONNECT_WALLET_DIALOG = "action_open_wallet_dialog";

  
export const ACTION_CLOSE_CONNECT_WALLET_DIALOG = "action_close_wallet_dialog";

  
export const openConnectWalletDialog = () => {
    return { 
        type: ACTION_OPEN_CONNECT_WALLET_DIALOG 
    }
};

  
export const closeConnectWalletDialog = () => {
    return { 
        type : ACTION_CLOSE_CONNECT_WALLET_DIALOG 
    }
};
