import * as React from 'react'
import { PageMode } from 'redux/types/UserInfoTypes'
import { ChartingLibraryWidgetOptions, IChartingLibraryWidget, LanguageCode, ResolutionString, StudyOverrides, TimeFrameType, Timezone, widget } from '../../public/static/charting_library/charting_library'
var hostUrl = ''
switch (process.env.SERVICES_ENV) {
    case 'development':
        hostUrl = ''
        break
    case 'test':
        hostUrl = ''
        break
    case 'production':
        hostUrl = ''
        break
    default:
        hostUrl = ''
        break
}
var datafeedUrl = `${hostUrl}/market/kline`

export interface TVChartContainerProps {
    symbol: string,
    datafeedUrl: string,
    interval: ResolutionString,
    containerId: string,
    libraryPath: string,
    locale: LanguageCode,
    fullscreen: boolean,
    autosize: boolean,
    studiesOverrides:StudyOverrides,
    mode: PageMode,
    onKlineLoaded: () => void
}

declare global {
    interface Window { Datafeeds: any; }
}

window.Datafeeds = window.Datafeeds || {};

export class TVChartContainer extends React.PureComponent<TVChartContainerProps> {

    tvWidget : null | IChartingLibraryWidget;

    static defaultProps = {
        symbol: 'AAPL',
        interval: '60',
        containerId: 'tv_chart_container',
        datafeedUrl: datafeedUrl,
        libraryPath: '/static/charting_library/',
        //chartsStorageUrl: 'https://saveload.tradingview.com',
        //chartsStorageApiVersion: '1.1',
        fullscreen: false,
        autosize: true,
        studiesOverrides: {},
    }

    constructor(props: TVChartContainerProps) {
        super(props);
        this.tvWidget = null;
    }

    componentDidMount() {
        this.initChart();
    }

    componentDidUpdate(prevProps:TVChartContainerProps) {
        const prevSymbol = prevProps.symbol;
        const symbol = this.props.symbol;
        const locale = this.props.locale;
        const mode = this.props.mode;
        const preMode = prevProps.mode;
        const prevLocale = prevProps.locale;
        if((locale !== prevLocale || prevSymbol !== symbol || mode !== preMode) && this.tvWidget) {
            this.tvWidget!.remove();   
            this.initChart();
        }
    }

    componentWillUnmount() {
        if (this.tvWidget) {
            
            this.tvWidget!.remove()
            this.tvWidget = null
        }
    }

    render() {
        return (
            <div
                id={this.props.containerId}
                style={{ height: "100%"}}
            />
        )
    }

    initChart() {
        const supportTimezones : Array<Timezone> = [
            'Etc/UTC',
            'Africa/Cairo',
            'Africa/Johannesburg',
            'Africa/Lagos',
            'America/Argentina/Buenos_Aires',
            'America/Bogota',
            'America/Caracas',
            'America/Chicago',
            'America/El_Salvador',
            'America/Juneau',
            'America/Lima',
            'America/Los_Angeles',
            'America/Mexico_City',
            'America/New_York',
            'America/Phoenix',
            'America/Santiago',
            'America/Sao_Paulo',
            'America/Toronto',
            'America/Vancouver',
            'Asia/Almaty',
            'Asia/Ashkhabad',
            'Asia/Bahrain',
            'Asia/Bangkok',
            'Asia/Chongqing',
            'Asia/Dubai',
            'Asia/Ho_Chi_Minh',
            'Asia/Hong_Kong',
            'Asia/Jakarta',
            'Asia/Jerusalem',
            'Asia/Kathmandu',
            'Asia/Kolkata',
            'Asia/Kuwait',
            'Asia/Muscat',
            'Asia/Qatar',
            'Asia/Riyadh',
            'Asia/Seoul',
            'Asia/Shanghai',
            'Asia/Singapore',
            'Asia/Taipei',
            'Asia/Tehran',
            'Asia/Tokyo',
            'Atlantic/Reykjavik',
            'Australia/ACT',
            'Australia/Adelaide',
            'Australia/Brisbane',
            'Australia/Sydney',
            'Europe/Athens',
            'Europe/Belgrade',
            'Europe/Berlin',
            'Europe/Copenhagen',
            'Europe/Helsinki',
            'Europe/Istanbul',
            'Europe/London',
            'Europe/Luxembourg',
            'Europe/Madrid',
            'Europe/Moscow',
            'Europe/Paris',
            'Europe/Riga',
            'Europe/Rome',
            'Europe/Stockholm',
            'Europe/Tallinn',
            'Europe/Vilnius',
            'Europe/Warsaw',
            'Europe/Zurich',
            'Pacific/Auckland',
            'Pacific/Chatham',
            'Pacific/Fakaofo',
            'Pacific/Honolulu',
            'Pacific/Norfolk',
            'US/Mountain',
        ]

        var timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone as Timezone;
        timeZone = supportTimezones.includes(timeZone)
            ? timeZone
            : 'Asia/Shanghai'
        const widgetOptions : ChartingLibraryWidgetOptions = {
            symbol: this.props.symbol,
            // BEWARE: no trailing slash is expected in feed URL
            datafeed: new window.Datafeeds.UDFCompatibleDatafeed(
                this.props.datafeedUrl
            ),
            interval: this.props.interval,
            container: this.props.containerId,
            library_path: this.props.libraryPath,
            timezone: timeZone,
            favorites: {
                intervals: ['60' as ResolutionString, '240' as ResolutionString, '1D' as ResolutionString, '1W' as ResolutionString, '1M' as ResolutionString],
                chartTypes: []
            },
            locale: this.props.locale,
            theme: this.props.mode  === 'dark' ? "Dark" : "Light",
            disabled_features: [
                'study_templates',
                'header_symbol_search',
                'symbol_info',
                'header_compare',
                'display_market_status',
                'left_toolbar',
                'timeframes_toolbar',
                'header_chart_type',
                'header_screenshot',
                'header_settings',
                'header_undo_redo',
                'header_indicators',
                'save_chart_properties_to_local_storage'
            ],
            time_frames: [],
            enabled_features: [],
            fullscreen: this.props.fullscreen,
            autosize: this.props.autosize,
            studies_overrides: this.props.studiesOverrides,
            overrides: {
                'paneProperties.legendProperties.showSeriesTitle': false,
                'paneProperties.backgroundType': 'solid',
                'paneProperties.background': '#000',
                'paneProperties.vertGridProperties.color': '#000',
                'paneProperties.horzGridProperties.color': '#000',
                'mainSeriesProperties.areaStyle.color1': "#000",
                'mainSeriesProperties.areaStyle.color2': "#000",
                'mainSeriesProperties.areaStyle.linecolor': "#000",
            },
            loading_screen: { 
                backgroundColor: "#000000" 
            },
            toolbar_bg: '#000000',
            custom_css_url: '/static/charting_library/css/style.css'
        }

        const tvWidget : IChartingLibraryWidget = new widget(widgetOptions)
        this.tvWidget  = tvWidget
        

        tvWidget.onChartReady(() => {
            tvWidget.headerReady().then(() => {})
            tvWidget.activeChart().onIntervalChanged().subscribe(null, 
                (interval, timeframeObj) => {
                    
                });

            tvWidget.activeChart().dataReady(() => {
                /* draw shapes */
                this.props.onKlineLoaded();
            });    
        })
    }
}
