import { UnknownDictionaryKnownValues } from 'src/types/common';
import Bot from '../Bot';
import InventoryApi from './InventoryApi';

export default class TryInventories extends InventoryApi {
    constructor(bot: Bot) {
        super(bot, 'tryInventories');
    }

    protected getURLAndParams(
        steamId: string,
        appId: number,
        contextId: string
    ): [string, UnknownDictionaryKnownValues] {
        return [`http://localhost:3000/inventory/${steamId}/${appId}/${contextId}`, { apiKey: this.getApiKey() }];
    }
}
