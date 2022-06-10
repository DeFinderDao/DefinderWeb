import { Button, notification } from 'antd'
import Router from 'next/router'
import Storage, { KEY_USER_TOKEN } from 'utils/storage'
import { CODE_SUCCESS } from 'utils/ApiServerError'

declare function postMessage(message: any, options?: PostMessageOptions): void;

var defi_worker: Worker | undefined;
var webNotification: Notification | undefined;
var webUrl: string;

export function startWorker(local = 'en') {
      
    const getDataWorker = function () {
          
        onmessage = (e) => {
              
            setInterval(() => {
                const message = e.data
                  
                var xmlhttp = new XMLHttpRequest()
                xmlhttp.open(message.method, message.url, true)
                  
                  
                  
                  
                  
                xmlhttp.setRequestHeader('Content-Type', 'application/json')
                xmlhttp.setRequestHeader('Authorization', message.token)
                xmlhttp.send(null)
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                          
                        postMessage(xmlhttp.responseText)
                    }
                }
            }, 5000)
        }
    }
    const notificationLabel = local == 'zh' ? {
        notificationMessage: '预警提示',
        notificationDescription: '您有新的预警信息',
        notificationUnit: '条',
        notificationBtn: '查看',
        notificationTips: '提示',
        notificationDesc: '抱歉，你的浏览器不支持预警提示！',
        notificationClose: '关闭',
    } : {
        notificationMessage: 'Alerts Reminde',
        notificationDescription: 'You have a new  Alert',
        notificationUnit: '',
        notificationBtn: 'Check',
        notificationTips: 'Alerts Reminder',
        notificationDesc: 'Sorry, your browser does not support any alerts',
        notificationClose: 'Close',
    }

      
      
    if (typeof Worker !== 'undefined') {
          
        if (typeof defi_worker == 'undefined') {
            const blob = new Blob(['(' + getDataWorker + ')()'])
            defi_worker = new Worker(URL.createObjectURL(blob))
        }
        const storage = new Storage()
          
        defi_worker.postMessage({
            method: 'GET',   
            url: `${location.origin}/api/warn/message/log`,   
            token: storage.get(KEY_USER_TOKEN),   
        })
          
          
        defi_worker.onmessage = function (event) {
            let dataCode = JSON.parse(event.data).code
            let dataLog = JSON.parse(event.data).data.list || []
            let dataLogLen = dataLog.length
            if (dataCode != CODE_SUCCESS) {
                return
            }
            if (dataLogLen == 0) {
                return
            }
              
            if (!('Notification' in window)) {
                notification.open({
                    message: notificationLabel.notificationMessage,
                    description: (
                        <span>
                            {notificationLabel.notificationDescription}(
                            <span style={{ color: 'red' }}>{dataLogLen}{notificationLabel.notificationUnit}</span>
                            )
                        </span>
                    ),
                    btn: (
                        <Button
                            type="primary"
                            size="small"
                            onClick={() => {
                                Router.push(`/chance-warning?refresh=true`)
                                notification.close('warningTips')
                            }}
                        >
                            {notificationLabel.notificationBtn}
                        </Button>
                    ),
                    key: 'warningTips',
                    duration: 3,
                })
            }
              
            else if (Notification.permission === 'granted') {
                  
                webNotification = new Notification(notificationLabel.notificationMessage, {
                    body: `${notificationLabel.notificationDescription}(${dataLogLen}${notificationLabel.notificationUnit})`,
                    icon: '/favicon.ico',
                    data: {
                        url: '/chance-warning?refresh=true',
                    },
                      
                })
                webUrl = '/chance-warning?refresh=true'
            }
              
            else if (Notification.permission !== 'denied') {
                Notification.requestPermission().then(function (permission) {
                      
                    if (permission === 'granted') {
                        webNotification = new Notification(notificationLabel.notificationMessage, {
                            body: `${notificationLabel.notificationDescription}(${dataLogLen}${notificationLabel.notificationUnit})`,
                            icon: '/favicon.ico',
                            data: {
                                url: '/chance-warning?refresh=true',
                            },
                        })
                        webUrl = '/chance-warning?refresh=true'
                    }
                })
            }
              
              
            else {
                notification.open({
                    message: notificationLabel.notificationMessage,
                    description: (
                        <span>
                            {notificationLabel.notificationDescription}(
                            <span style={{ color: 'red' }}>{dataLogLen}{notificationLabel.notificationUnit}</span>
                            )
                        </span>
                    ),
                    btn: (
                        <Button
                            type="primary"
                            size="small"
                            onClick={() => {
                                Router.push(`/chance-warning?refresh=true`)
                                notification.close('warningTips')
                            }}
                        >
                            {notificationLabel.notificationBtn}
                        </Button>
                    ),
                    key: 'warningTips',
                    duration: 3,
                })
            }
            if (typeof webNotification !== 'undefined') {
                webNotification.onshow = function () {
                      
                }
                webNotification.onerror = function () {
                      
                }
                webNotification.onclose = function () {
                      
                }
                webNotification.onclick = function () {
                      
                      
                      
                    if (webNotification!.data && webNotification!.data.url) {
                          
                        window.open(webNotification!.data.url, '_blank');
                    } else {
                          
                        window.open(webUrl, '_blank');

                    }
                    webNotification!.close()
                }
            }
        }
    } else {
        notification.open({
            message: notificationLabel.notificationTips,
            description: notificationLabel.notificationDesc,
            btn: (
                <Button
                    type="primary"
                    size="small"
                    onClick={() => {
                        notification.close('warningWarnTips')
                    }}
                >
                    {notificationLabel.notificationClose}
                </Button>
            ),
            key: 'warningWarnTips',
            duration: null,
        })
    }
}

export function stopWorker() {
    if (typeof defi_worker !== 'undefined') {
          
        defi_worker.terminate()
        defi_worker = undefined
          
        notification.close('warningTips')
    }
}
