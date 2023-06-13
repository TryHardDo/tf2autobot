import IPricer, {
    GetItemPriceResponse,
    GetPricelistResponse,
    PricerOptions,
    RequestCheckResponse
} from 'src/classes/IPricer';
import TryPricerApi, { PriceRequestPayload } from './trypricer-api';
import EventSourceHandler from './trypricer-sse';
import log from '../../../lib/logger';

export default class TryPricer implements IPricer {
    private readonly apiManager: TryPricerApi;

    private readonly pricerOptions: PricerOptions;

    private readonly sse: EventSourceHandler;

    public constructor(options: PricerOptions) {
        this.pricerOptions = options;

        this.apiManager = new TryPricerApi(this.pricerOptions);
        this.sse = new EventSourceHandler(this.pricerOptions);
    }

    requestCheck(sku: string, itemName: string): Promise<RequestCheckResponse> {
        return this.apiManager.requestPriceCheck({
            sku: sku,
            item: itemName
        } as PriceRequestPayload);
    }

    getPrice(sku: string, itemName: string): Promise<GetItemPriceResponse> {
        return this.apiManager.getPriceForItem({
            sku: sku,
            item: itemName
        } as PriceRequestPayload);
    }

    getPricelist(): Promise<GetPricelistResponse> {
        return this.apiManager.getPricedItems();
    }

    get isPricerConnecting(): boolean {
        return this.sse.isConnecting;
    }

    connect(enabled: boolean): void {}

    shutdown(enabled: boolean): void {
        if (enabled) {
            this.sse.shutDown();
        }
    }

    init(enabled: boolean): void {
        if (enabled) {
            this.sse.connect();
            this.sse.bindEvents();
        }
    }

    bindHandlePriceEvent(onPriceChange: (item: GetItemPriceResponse) => void): void {
        this.sse.getSSE().addEventListener('priceUpdate', (msg: MessageEvent) => {
            const item = JSON.parse(msg.data as string) as GetItemPriceResponse;

            log.debug(`Price update received from SSE service! Item: ${item.sku}`);

            onPriceChange(item);
        });
    }

    getOptions(): PricerOptions {
        return this.pricerOptions;
    }
}
