// import {get} from './http';
// import {URLS} from '../lib/const/url';
// import {ContractSymbols} from '../interface/phemex';
// import {PhemexAccount} from '../lib/config';
// import {PhemexAccount} from '../lib/config';


// export const loadMarkets = (account: PhemexAccount) => get(account, URLS.MARKETS);
// export const loadOrderbook = (account: PhemexAccount, symbol: ContractSymbols) => get(account, URLS.ORDERBOOK, {query: {symbol, id: 1}});
// export const getAccountPositions = (account: PhemexAccount, symbol: ContractSymbols) => get(account, URLS.ACCOUNT_POSITIONS, {query: {symbol, id: 1}});
// export const getSpotAccountPositions = (account: PhemexAccount, symbol: ContractSymbols) => get(account, URLS.SPOT_ORDER_LIST, {query: {symbol, id: 1}});
// export const loadTrades = (account: PhemexAccount, symbol: ContractSymbols) => get(account, URLS.TRADES, {query: {symbol}});
