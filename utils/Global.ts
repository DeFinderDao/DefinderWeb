import { ColumnsType } from 'antd/lib/table/interface'
import BigNumber from 'bignumber.js'
import moment from 'moment'
import { NextRouter } from 'next/router'
import React from 'react'
import { UserInfoState } from 'redux/types/UserInfoTypes'
import { NOT_A_NUMBER } from './env'

export default {
      
    formatNum(num: BigNumber.Value | null | undefined) {
        if (num) {
            if ((num as string + '').toLowerCase().includes('e')) {
                return num as string
            } else {
                num = new BigNumber(num).toFixed()
                let parts = num.toString().split('.')
                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                return parts.join('.')
            }
        } else {
            if (num === 0) {
                return '0'
            } else {
                return NOT_A_NUMBER
            }
        }
    },
      
    formatBigNum(num: BigNumber.Value | null | undefined, dp?: number) {
        if (num) {
            if ((num as string + '').toLowerCase().includes('e')) {
                return num as string
            } else {
                let str = ''
                num = new BigNumber(num)
                if (Math.abs(num as unknown as number) > 1000000000000000000) {
                    return num.toExponential(2)
                } else if (Math.abs(num as unknown as number) > 1000000000000) {
                    num = num.div(1000000000000).toFixed(1)
                    str = ' T'
                } else if (Math.abs(num as unknown as number) > 1000000000) {
                    num = num.div(1000000000).toFixed(1)
                    str = ' B'
                } else if (Math.abs(num as unknown as number) > 1000000) {
                    num = num.dividedBy(1000000).toFixed(1)
                    str = ' M'
                } else {
                    if (typeof dp !== 'undefined') {
                        num = num.toFixed(dp)
                    } else {
                        num = num.toFixed()
                    }
                }
                let parts = num!.toString().split('.')
                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                return parts.join('.') + str
            }
        } else {
            if (num === 0) {
                return '0'
            } else {
                return NOT_A_NUMBER
            }
        }
    },
      
    abbrSymbolAddress(str: string) {
        if (str && str.includes('0x')) {
            return str.substr(0, 6) + '....' + str.substr(-4)
        } else {
            return str
        }
    },
      
    distanceFromCurrent(el: moment.MomentInput, locale: string, yyyy = false) {
        let current = new Date()
        let hoursAgo;
        let minutesAgo;
        let rightNow;
        let yesterday;
        if (locale === 'zh') {
            hoursAgo = '小时前';
            minutesAgo = '分钟前';
            rightNow = '刚刚';
            yesterday = '昨天 ';
        } else {
            hoursAgo = 'hours ago';
            minutesAgo = 'minutes ago';
            rightNow = 'right now';
            yesterday = 'yesterday ';
        }
        if (moment(el).isSame(moment(current), 'day')) {
            if (
                moment(el).isBefore(
                    moment(current).add(-60, 'minutes'),
                    'minutes'
                )
            ) {
                return moment(current).diff(moment(el), 'hours') + hoursAgo
            } else if (
                moment(el).isBefore(
                    moment(current).add(-60, 'seconds'),
                    'seconds'
                )
            ) {
                return moment(current).diff(moment(el), 'minutes') + minutesAgo
            } else {
                return rightNow
            }
        } else if (moment(el).isSame(moment(current).add(-1, 'days'), 'day')) {
            return yesterday + moment(el).format('HH:mm')
        } else {
            if (yyyy) {
                return moment(el).format('yyyy-MM-DD HH:mm')
            }
            return moment(el).format('MM-DD HH:mm')
        }
    },
      
    formatYAxis(text: string, f: (id: string) => string) {
          
        text = text.replace(/[^-0-9.eE+]/g, '');

        const number: number = new BigNumber(text) as any as number;
        const absNumber = Math.abs(number);
        if (absNumber >= 1000000000000) {
            const num = number / 1000000000000
            return `${Number(num.toFixed(2))}${f(
                'marketDetailThousandBillion'
            )}`
        } else if (absNumber >= 1000000000) {
            const num = number / 1000000000
            return `${Number(num.toFixed(2))}${f(
                'marketDetailBillion'
            )}`
        } else if (absNumber >= 1000000) {
            const num = number / 1000000
            return `${Number(num.toFixed(2))}${f(
                'marketDetailMillion'
            )}`
        } else if (absNumber >= 1000) {
            const num = number / 1000
            return `${Number(num.toFixed(2))}${f(
                'marketDetailTenThousand'
            )}`
        } else {
            return text
        }
    },

      
    formatFluctuationRange(num: BigNumber.Value | null | undefined, dp?: number) {
        const flag = Number(num);
        if (flag) {
            if (flag > 0) {
                return React.createElement('span', { className: 'defi-color-Increase' }, `+$ ${this.formatBigNum(num, dp)}`)
            } else {
                return React.createElement('span', { className: 'defi-color-reduce' }, `-$ ${this.formatBigNum(num?.toString().substring(1), dp)}`)
            }
        } else {
            if (!isNaN(parseFloat(num + ''))) {
                return React.createElement('span', { className: 'defi-color2' }, '$ 0')
            } else {
                return React.createElement('span', { className: 'defi-color2' }, NOT_A_NUMBER)
            }
        }
    },
    formatIncreaseNumber(num: number | string) {
        if (Number(num) == 0) {
            if (num === null) {
                return React.createElement('span', { className: 'defi-color2' }, NOT_A_NUMBER)
            } else {
                return React.createElement('span', { className: 'defi-color2' }, '0%')
            }
        } else {
            if (Number(num) < 0) {
                return React.createElement('span', { className: 'defi-color-reduce' }, `-${num.toString().substring(1)}%`)
            } else {
                return React.createElement('span', { className: 'defi-color-Increase' }, `+${num}%`)
            }
        }
    },
    findMinAndMax(numbers: number[]) {
        const sorted = numbers.sort();
        if (sorted[0] === sorted[sorted.length - 1]) {
              
            return {
                min: sorted[0] / 2,
                max: sorted[0] + sorted[0] / 2
            }
        } else {
            return {
                min: null,
                max: null
            }
        }
    },
    getDayStart(time: number | null, millisecond: number) {
        if (time) {
            return parseInt((moment(time).startOf('day').valueOf() / millisecond) as unknown as string)
        } else {
            return time
        }
    },
    getDayEnd(time: number | null, millisecond: number) {
        if (time) {
            return parseInt((moment(time).endOf('day').valueOf() / millisecond) as unknown as string)
        } else {
            return time
        }
    },
    /**
     * 
     * @param e 
     * @param url 
     * @param type 【push】【replace】
     */
    openNewTag(e: React.MouseEvent, router: NextRouter, url: string, type = 'push') {
          
        if (e && (e.metaKey || e.ctrlKey || e.button === 1)) {
            window.open(url);
        } else {
            if (type == 'push') {
                router.push(url);
            } else if (type == 'replace') {
                router.replace(url);
            }
        }
    },

    /**
     *
     * doc: https://help.aliyun.com/document_detail/44688.htm?spm=a2c4g.11186623.0.0.7f4d1e4fhwxS6N#concept-hxj-c4n-vdb
     * @param ossImgUrl  阿里云oss url
     * @param destWidth 
     * @param destHeight 
     * @returns 
     */
    ossImageScale(ossImgUrl: string, destWidth: number, destHeight: number): string {
        if (ossImgUrl.includes('x-oss-process')) {
            return `${ossImgUrl},x-oss-process=image/resize,w_${destWidth},h_${destHeight}`;
        } else
            return `${ossImgUrl}?x-oss-process=image/resize,w_${destWidth},h_${destHeight}`;
    },
    
    mapLevelId2Days(levelId: number) {
        switch (levelId) {
            case 0:
                return 3;
            case 1:
                return 5;
            case 2:
                return 90;
            case 3:
                return 365;
        }
    },

    
    mapLevelId2ExcardNum(levelId: number) {
        switch (levelId) {
            case 0:
                return 0;
            case 1:
                return 1;
            case 2:
                return 5;
            case 3:
                return 10;
        }
    },

    
    isExpVip(userInfo: UserInfoState) {
        return userInfo.levelId === 0 && userInfo.level === 1;
    },

    
    getCurrentEnvHost() {
        if (typeof window === 'undefined') {
            return '/'
        } else {
            return `${window.location.protocol}//${window.location.host}`;
        }
    },

    getSkeletonData(data: any, num: number) {
        let copy = []
        for (let i = 0; i < num; i++) {
            copy.push({ ...data, key: i })
        }
        return copy
    },

    setDiscoverWaterMarkBottom({ windowH, rowH = 36.85, dataL }: { windowH: number, rowH?: number, dataL: number }) {
        if (windowH / rowH < dataL) {
            return 100
        }
        return windowH - 365 - (dataL * rowH) < 100 ? 100 : windowH - 365 - (dataL * rowH)
    }
}
