import EasyCopyPaste from 'easycopypaste';
import { UnknownDictionaryKnownValues } from '../types/common';

export function exponentialBackoff(n: number, base = 1000): number {
    return Math.pow(2, n) * base + Math.floor(Math.random() * base);
}

export function parseJSON(json: string): UnknownDictionaryKnownValues | null {
    try {
        return JSON.parse(json) as UnknownDictionaryKnownValues;
    } catch (err) {
        return null;
    }
}
export default class Helper {
    private readonly ecp = new EasyCopyPaste('mapped_item_names.json', '../files');

    public getEasyCopyPasteStr(itemName: string, intent: 'buy' | 'sell'): string {
        let intentStr = '';
        if (intent === 'buy') {
            intentStr = 'sell_';
        } else {
            intentStr = 'buy_';
        }

        const easyCopyPasteString = this.ecp.toEasyCopyPasteString(itemName);

        return `${intentStr}${easyCopyPasteString}`;
    }

    public getNormalizedItemName(easyCopyPasteString: string): string {
        return this.ecp.fromEasyCopyPasteString(easyCopyPasteString);
    }
}
