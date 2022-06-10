import { SET_MENU_ADDRESS, SET_MENU_OPEN_NAME, SET_MENU_OPEN } from '../actions/MenuAction'
import * as menuTypes from '../types/MenuTypes';

const initialState : menuTypes.MenuState = {
    menuList: [
        {
            name: 'marketPage',
            pathName: 'market-page',
            key: 'market',
            route: '/market-page',
            icon: 'icon-hangqing-selected',
            iconGray: 'icon-hangqing'
        },
        {
            name: 'marketDiscover',
            pathName: 'market-discover',
            key: 'marketDiscover',
            route: '/market-discover',
            icon: 'icon-market-discover-selected',
            iconGray: 'icon-market-discover'
        },
        {
            name: 'NFTAnalyse',
            pathName: 'nft-analyse',
            key: 'NFTAnalyse',
            route: '/nft-analyse',
            icon: 'icon-nft-analyse-selected',
            iconGray: 'icon-nft-analyse'
        },
        {
            name: 'NFTDiscover',
            pathName: 'nft-discover',
            key: 'NFTDiscover',
            route: '/nft-discover',
            icon: 'icon-market-discover-selected',
            iconGray: 'icon-market-discover'
        },
        {
            name: 'smPage',
            pathName: 'smart-money',
            key: 'smartMoney',
            route: '/smart-money',
            icon: 'icon-icon-sm-selected',
            iconGray: 'icon-icon-sm'
        },
        {
            name: 'chanceWarning',
            pathName: 'chance-warning',
            key: 'warning',
            route: '/chance-warning',
            icon: 'icon-warning-selected',
            iconGray: 'icon-warning',
        },
        {
            name: 'addressCombination',
            pathName: 'address-combination',
            key: 'combination',
            route: '/address-combination',
            icon: 'icon-focus-address-selected',
            iconGray: 'icon-focus-address',
        },
        {
            name: 'addressAnalyse',
            pathName: 'address-analyse',
            key: 'analyse',
            route: '/address-analyse',
            icon: 'icon-address-analysis-selected',
            iconGray: 'icon-address-analysis',
        },
        // {
        //     name: 'addressDynamic',
        //     pathName: 'address-dynamic',
        //     key: 'dynamic',
        //     route: '/address-dynamic',
        //     icon: 'icon-address-dynamic-selected',
        //     iconGray: 'icon-address-dynamic',
        // },
        // {
        //     name: 'projectOverview',
        //     pathName: 'project-overview',
        //     key: 'application',
        //     route: '/project-overview',
        //     icon: 'icon-projects-selected',
        //     iconGray: 'icon-projects',
        // },
        // {
        //     name: 'assetBoard',
        //     pathName: 'asset-board',
        //     key: 'kanban',
        //     route: '/asset-board',
        //     icon: 'icon-board',
        //     iconGray: 'icon-board_gray',
        // },
    ],
    selectKey: '',
    isOpen: true,
}

const reducer = (state = initialState, action: menuTypes.MenuActions) => {
    // return
    const {type} = action;
    switch (type) {
        case SET_MENU_ADDRESS: {
            const {payload} = action as menuTypes.MenuAction;
            const whiteUrl = [
                '/_error',
                '/404',
                '/user-agreement',
            ]
            if (whiteUrl.includes(payload.split('?')[0])) {
                return {
                    ...state,
                }
            } else {
                let selectedKey = []
                selectedKey = state.menuList.map((item) => {
                    if (item.key == state.selectKey) {
                        item.route = payload
                    }
                    return item
                })
                return {
                    ...state,
                    menuList: selectedKey,
                }
            }
        }
        case SET_MENU_OPEN_NAME: {
            const {payload} = action as menuTypes.MenuAction;
            return {
                ...state,
                selectKey: payload,
            }
        }
        case SET_MENU_OPEN: { 
            const {payload} = action as menuTypes.SetMenuOpenAction;
            return {
                ...state,
                isOpen: payload
            }
        }    
        default:
            return state
    }
}

export default reducer
