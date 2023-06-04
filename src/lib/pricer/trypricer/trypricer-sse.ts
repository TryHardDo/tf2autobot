import ReconnectingEventSource from 'reconnecting-eventsource';
import { GetItemPriceResponse, PricerOptions } from 'src/classes/IPricer';
import log from '../../../lib/logger';

export type EventBasedPriceUpdate = GetItemPriceResponse;

export default class EventSourceHandler {
    private sse?: ReconnectingEventSource;

    private options: PricerOptions;

    constructor(options: PricerOptions) {
        this.options = options;
    }

    connect(): void {
        this.sse = new ReconnectingEventSource(
            this.options.pricerUrl + '?token=' + encodeURIComponent(this.options.pricerApiToken)
        );
    }

    bindEvents(): void {
        this.sse.addEventListener('error', () => {
            log.error(`Failed to open SSE tunnel to the pricer!`);
        });

        this.sse.addEventListener('open', () => {
            log.debug('SSE tunnel opened! Ready to receive price updates!');
        });
    }

    get isConnecting(): boolean {
        return this.sse.readyState === this.sse.CONNECTING;
    }

    getSSE(): ReconnectingEventSource {
        return this.sse;
    }

    shutDown(): void {
        if (this.sse) {
            this.sse.close();
            this.sse = undefined;
        }
    }
}
