import { UnknownDictionaryKnownValues } from 'src/types/common';
import Bot from '../Bot';
import InventoryApi from './InventoryApi';

export default class TryInventories extends InventoryApi {
    constructor(bot: Bot) {
        super(bot, 'tryInventories');
    }

    protected getURLAndParams(
        steamID64: string,
        appID: number,
        contextID: string
    ): [string, UnknownDictionaryKnownValues] {
        return [`http://localhost:5000/inventory/${this.getApiKey()}`, { steamID64, appID, contextID }];
    }
}
