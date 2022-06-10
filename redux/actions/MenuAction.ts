  
export const SET_MENU_ADDRESS = 'set_menu_address'
export const SET_MENU_OPEN_NAME = 'set_menu_open_name'
export const SET_MENU_OPEN = 'set_menu_open';

  
export const setMenuAddress = (url: string) => ({
    type: SET_MENU_ADDRESS,
    payload: url,
})

  
export const setMenuOpenName = (name: string | null) => ({
    type: SET_MENU_OPEN_NAME,
    payload: name,
})

  
export const setMenuOpen = (isOpen: boolean) => ({
    type: SET_MENU_OPEN,
    payload: isOpen
})
