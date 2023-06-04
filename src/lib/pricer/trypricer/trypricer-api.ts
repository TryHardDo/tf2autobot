import axios, { AxiosError, AxiosRequestConfig, Method } from 'axios';
import { GetItemPriceResponse, GetPricelistResponse, PricerOptions, RequestCheckResponse } from 'src/classes/IPricer';

export interface PriceRequestPayload {
    item: string;
    sku: string;
}

export interface PricerResponse {
    itemName: string;
    sku: string;
    buyMetal: number;
    buyKeys: number;
    keyBuyPriceMetal: number;
    sellMetal: number;
    sellKeys: number;
    keySellPriceMetal: number;
}

export default class TryPricerApi {
    private readonly pricerDetails: PricerOptions;

    public constructor(pricerOptions: PricerOptions) {
        this.pricerDetails = pricerOptions;
    }

    private async callApi<T>(
        httpMethod: string,
        path: string,
        params?: Record<string, any>,
        content?: Record<string, any>,
        headers?: Record<string, unknown>
    ): Promise<T> {
        if (!headers) {
            headers = {
                'Pricer-Auth-Key': this.pricerDetails.pricerApiToken
            };
        }

        const reqOptions: AxiosRequestConfig = {
            method: httpMethod as Method,
            url: path,
            baseURL: this.pricerDetails.pricerUrl,
            headers: {
                'User-Agent': 'TryTrading@' + process.env.BOT_VERSION,
                ...headers
            },
            timeout: 30000
        };

        if (params) {
            reqOptions.params = params;
        }

        if (content) {
            reqOptions.data = content;
        }

        return new Promise((resolve, reject) => {
            void axios(reqOptions)
                .then(rsp => {
                    resolve(rsp.data as T);
                })
                .catch((err: AxiosError) => {
                    if (err) {
                        reject('Failed to call API for TryPricer! ' + err.message);
                    }
                });
        });
    }

    async requestPriceCheck(reqPayload: PriceRequestPayload): Promise<RequestCheckResponse> {
        return this.callApi('POST', `api/prices/${reqPayload.item}`);
    }

    async getPriceForItem(reqPayload: PriceRequestPayload): Promise<GetItemPriceResponse> {
        return this.callApi('GET', `api/prices/${reqPayload.item}`);
    }

    async getPricedItems(): Promise<GetPricelistResponse> {
        return this.callApi('GET', `api/prices`);
    }
}
