import { Action } from 'redux';


export interface MenuAction extends Action<string> {
    payload: string;
}

export interface SetMenuOpenAction extends Action<string> {
    payload: boolean
}

export interface MenuItem {
    name: string;
    pathName: string;
    key: string;
    route: string;
    icon: string;
    tipIcon? : string;
    iconGray: string;
}

export interface MenuState {
    menuList: MenuItem[]; 
    selectKey: string,
    isOpen: boolean
}

export type MenuActions = MenuAction | SetMenuOpenAction