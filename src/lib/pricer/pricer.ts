import IPricer, { PricerOptions } from '../../classes/IPricer';
import PricesTfPricer from './pricestf/prices-tf-pricer';
import PricesTfApi from './pricestf/prices-tf-api';
import TryPricer from './trypricer/trypricer-pricer';

export function getPricer(options: PricerOptions): IPricer {
    if (options.pricerUrl !== '') {
        console.log('Pricer options: ' + JSON.stringify(options));
        return new TryPricer(options);
    } else {
        const api = new PricesTfApi();
        return new PricesTfPricer(api);
    }
}
