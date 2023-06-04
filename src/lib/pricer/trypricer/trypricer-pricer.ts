import IPricer, {
    GetItemPriceResponse,
    GetPricelistResponse,
    PricerOptions,
    RequestCheckResponse
} from 'src/classes/IPricer';
import TryPricerApi, { PriceRequestPayload } from './trypricer-api';
import EventSourceHandler from './trypricer-sse';

export default class TryPricer implements IPricer {
    private readonly apiManager: TryPricerApi;

    private readonly pricerOptions: PricerOptions;

    private readonly sse: EventSourceHandler;

    public constructor() {
        this.pricerOptions = {
            pricerUrl: '',
            pricerApiToken: ''
        };

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

    connect(enabled: boolean): void {
        if (enabled) {
            this.sse.connect();
        }
    }

    shutdown(enabled: boolean): void {
        if (enabled) {
            this.sse.shutDown();
        }
    }

    init(enabled: boolean): void {
        if (enabled) {
            this.sse.bindEvents();
        }
    }

    bindHandlePriceEvent(onPriceChange: (item: GetItemPriceResponse) => void): void {
        this.sse.getSSE().addEventListener('message', (msg: MessageEvent) => {
            const parsed = JSON.parse(msg.data as string) as GetItemPriceResponse;

            if (parsed) {
                onPriceChange(parsed);
            }
        });
    }

    getOptions(): PricerOptions {
        return this.pricerOptions;
    }
}
