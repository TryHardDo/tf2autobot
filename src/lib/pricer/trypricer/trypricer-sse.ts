import { GetItemPriceResponse, PricerOptions } from 'src/classes/IPricer';
import log from '../../../lib/logger';
import EventSource from 'eventsource';

export type EventBasedPriceUpdate = GetItemPriceResponse;

export default class EventSourceHandler {
    private sse?: EventSource;

    private options: PricerOptions;

    constructor(options: PricerOptions) {
        this.options = options;
    }

    connect(): void {
        this.sse = new EventSource(
            this.options.pricerUrl + '/items/sse?token=' + encodeURIComponent(this.options.pricerApiToken)
        );
    }

    bindEvents(): void {
        this.sse.addEventListener('error', () => {
            log.error(`Failed to connect to the pricer with SSE protocoll!`);
        });

        this.sse.addEventListener('open', () => {
            log.debug('SSE stream is opened! Ready to receive price updates!');
        });
    }

    get isConnecting(): boolean {
        return this.sse.readyState === this.sse.CONNECTING;
    }

    getSSE(): EventSource {
        return this.sse;
    }

    shutDown(): void {
        if (this.sse) {
            this.sse.close();
            this.sse = undefined;
        }
    }
}
