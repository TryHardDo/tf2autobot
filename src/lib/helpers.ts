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

/**
 * Utility method for generating quick buy and sell string for listing notes
 * on backpack.tf.
 * @param itemName The item's extracted name
 * @param intent The intent of the listing in our side
 * @returns A quick buy string
 */
export function generateQuickActionString(itemName: string, intent: 'buy' | 'sell'): string {
    const formattedName = itemName.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('_');
    return `${intent === 'buy' ? 'sell' : 'buy'}_${formattedName}`;
}
