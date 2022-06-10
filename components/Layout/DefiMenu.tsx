import { useRouter } from "next/router";
import { useIntl } from "react-intl";
import { KEY_LOCALE } from "utils/storage";
import type { MenuInfo } from 'rc-menu/lib/interface';
import { Layout, Menu, Tooltip } from 'antd'
import { useDispatch, useSelector } from "react-redux";
import type { AppState } from "redux/reducers";
import type { MenuItem } from 'redux/types/MenuTypes'
import { useEffect, useState } from "react";
const { Header } = Layout
import { setMenuOpen, setMenuOpenName } from 'redux/actions/MenuAction'
import React from "react";

export const MENU_OPEN_FLAG = 'key_open_flag';

type DefiMenuProps = {
    isOpen: boolean
}

const getKeyByPathname = (asPath: string, menuData: MenuItem[]) => {
    let selectedKey: MenuItem[] = []
    selectedKey = menuData.filter((item) => {
        return asPath.includes(item.pathName)
    })
    /*if (str.length == 2) {
        selectedKey = menuData.filter((item) => {
            return item.pathName == str[1]
        })
    } else if (str.length > 2) {
        selectedKey = menuData.filter((item) => {
            return item.pathName == str[1]
        })
    }*/
    if (selectedKey.length !== 0) {
        return selectedKey[0]
    } else {
        return null;
    }
}

const MenuItems = ({ isOpen }: DefiMenuProps) => {
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id })
    const dispatch = useDispatch()
    const router = useRouter()
    const asPath = router.asPath
    const locale = router.locale;
    const menuData = useSelector((state: AppState) => state.menuList.menuList)
    const menuItem = getKeyByPathname(asPath, menuData);
    let selectedKey = menuItem ? menuItem.key : "";
    useEffect(() => {
        dispatch(setMenuOpenName(selectedKey))
    }, [selectedKey])
    const menuClick = ({ key }: MenuInfo) => {
        const menu = menuData.find((menu) => menu.key == key)
        if (menu) {
            router.push(menu.route)
        }
    }

    return (
        <Menu
            onClick={menuClick}
            mode="inline"
            selectedKeys={[selectedKey]}
            className="defi-menu"
            inlineCollapsed={isOpen ? false : true}
        >
            {menuData.map((menu) => {
                const selected = selectedKey === menu.key;
                return (
                    <React.Fragment key={menu.key}>
                        <Menu.Item
                            key={menu.key}
                            className="defi-menu-item"
                            icon={
                                menu.key === 'NFTDiscover' ? 
                                <img className="icon wallet-icon" style={{
                                    float: 'left',
                                    margin: '9px 10px 9px 0'
                                }} src={selected ? '/images/DiscoverNFT_hover.svg' : '/images/DiscoverNFT.svg'}/> :
                                (<svg className="icon wallet-icon" aria-hidden="true" style={{
                                    float: 'left',
                                    margin: '9px 10px 9px 0'
                                }}>
                                    <use xlinkHref={`#${selected ? menu.icon : menu.iconGray}`}></use>
                                </svg>)
                            }
                        >
                            {f(menu.name)}
                        </Menu.Item>
                        {/**|| menu.key === 'analyse' */}
                        {menu.key === 'marketDiscover' || menu.key === 'NFTDiscover' ? (
                            <div className="defi-menu-item-border"></div>
                        ) : null}
                    </React.Fragment>
                )
            })}
        </Menu>
    )
}


const DefiLeft = ({ isOpen }: DefiMenuProps) => {
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id })
    const router = useRouter()
    const locale = router.locale;
    const menuClick = ({ key }: MenuInfo) => {
        if (key === 'switchLanguage') {
            let currentLocale = '';
            if (!locale || locale === 'en') {
                currentLocale = 'zh';
            } else {
                currentLocale = 'en';
            }
            router.replace(router.asPath, undefined, {
                locale: currentLocale
            });
              
            localStorage.setItem(KEY_LOCALE, currentLocale);
        }
    }
    const menuDivClick = (key: string) => {
        if (key === 'Discord') {
            window.open('https://discord.gg/64fTstCRfN');
        } else if (key === 'twitter') {
            window.open('https://twitter.com/DefinderGlobal');
        }
    }

    const menuWidth = isOpen ? (locale === 'zh' ? '200px' : '210px') : '80px';
    return (
        <div>
            <div className="placeholder"></div>
            <Header id="defi-sidebar" style={{ width: menuWidth }}>
                <div id="nav">
                    <MenuItems isOpen={isOpen} />

                    <div>
                        <Menu
                            onClick={menuClick}
                            selectedKeys={['']}
                            mode="inline"
                            className="defi-menu defi-menu-border"
                            inlineCollapsed={isOpen ? false : true}
                        >
                            <Menu.Item
                                key='switchLanguage'
                                className="defi-menu-item"
                                icon={
                                    <svg className="icon" aria-hidden="true" style={{
                                        float: 'left',
                                        margin: '9px 10px 9px 0'
                                    }}>
                                        <use xlinkHref='#icon-switch_language_gray'></use>
                                    </svg>
                                }
                            >
                                {f('switchLanguage')}
                            </Menu.Item>
                        </Menu>
                        <div style={{ display: 'flex', flexDirection: isOpen ? 'row' : 'column', justifyContent: isOpen ? 'start' : 'space-around', alignItems: 'center', paddingLeft: isOpen ? 24 : 0, marginTop: 10 }}>
                            <div onClick={() => { menuDivClick('twitter') }} style={{ display: 'flex', marginBottom: isOpen ? 0 : 20, marginRight: isOpen ? 20 : 0, cursor: 'pointer' }}>
                                <Tooltip placement={isOpen ? 'top' : "right"} title="Twitter">
                                    <svg className="icon" aria-hidden="true" style={{
                                        float: 'left',
                                        fill: '#8C979B',
                                        width: 28,
                                        height: 28
                                    }}>
                                        <use xlinkHref='#icon-twitter1'></use>
                                    </svg>
                                </Tooltip>
                            </div>
                            <div onClick={() => { menuDivClick('Discord') }} style={{ display: 'flex', cursor: 'pointer' }}>
                                <Tooltip placement={isOpen ? 'top' : "right"} title="Discord">
                                    <svg className="icon" aria-hidden="true" style={{
                                        float: 'left',
                                        fill: '#8C979B',
                                        width: 28,
                                        height: 28
                                    }}>
                                        <use xlinkHref='#icon-discord2'></use>
                                    </svg>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                </div>
            </Header>
        </div>
    )
}

interface TroggleProps {
    onClick: () => void;
    className: string;
}

const Troggle = ({ onClick, className }: TroggleProps) => {
    return <div id="troggle" onClick={onClick} className={className}></div>
}

export default function DefiMenu() {
    const { isOpen } = useSelector((state: AppState) => state.menuList)
    const dispatch = useDispatch();
    useEffect(() => {
        const isOpenInClient = !!!localStorage.getItem(MENU_OPEN_FLAG);
        dispatch(setMenuOpen(isOpenInClient));
    }, []);

    const onTroggleClick = () => {
        if (isOpen) {
            localStorage.setItem(MENU_OPEN_FLAG, '1');
        } else {
            localStorage.removeItem(MENU_OPEN_FLAG);
        }
        dispatch(setMenuOpen(!isOpen));
    }

    return (
        <>
            <DefiLeft isOpen={isOpen} />
            <Troggle onClick={onTroggleClick} className={isOpen ? "inline" : "collapsed"} />
        </>);
}