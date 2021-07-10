// import {URLS} from '../lib/const/url';
// import {get, post, del} from './http';
// import {generateUUID} from '../lib/uuid';
// import {UUID} from '../interface/types/uuid.type';
// import {Currency, Order, ContractSymbols} from '../interface/phemex';
// import {PhemexAccount} from '../lib/config';
// import {SpotSymbol} from '../interface/phemex/spot/spot.symbol';
//
// // TODO : Restrict symbols to valid phemex inputs
//
// export function loadActiveOrders(account: PhemexAccount, symbol: string) {
//   return get(account, URLS.ORDER_ACTIVE_LIST, {query: {symbol}});
// }
//
// export function getActivePositions(account: PhemexAccount, currency: Currency) {
//   return get(account, URLS.ACCOUNT_POSITIONS, {query: {currency}});
// }
//
// export function getSpotOrders(account: PhemexAccount, symbol: SpotSymbol) {
//   return get(account, URLS.SPOT_ORDER_LIST, {query: {symbol: symbol.symbol}});
// }
//
// export function loadPastOrders(account: PhemexAccount, symbol: string) {
//   return get(account, URLS.ORDER_PAST_LIST, {query: {symbol}});
// }
//
// export function placeOrder(
//   account: PhemexAccount,
//   {
//     symbol,
//     side,
//     priceEp,
//     orderQty,
//     ordType,
//     postOnly = false,
//     reduceOnly = false,
//     timeInForce = 'GoodTillCancel',
//   }: Order) {
//   const params: Order = {
//     clOrdID: generateUUID(),
//     symbol,
//     side,
//     priceEp,
//     orderQty,
//     ordType,
//     postOnly,
//     reduceOnly,
//     timeInForce,
//   };
//   return post(account, URLS.ORDER_PLACE, {params});
// }
//
// export function cancelOrder(account: PhemexAccount, symbol: ContractSymbols, orderID: UUID) {
//   return del(account, URLS.ORDER_CANCEL, {query: {symbol, orderID}});
// }
