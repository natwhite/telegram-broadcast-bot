// import {ApiResponseType} from '../interface/phemex/api.response.type';
// import * as marketApi from '../api/market';
// import * as tradeApi from '../api/trade';
// import {ContractActivePositionData, Currency, ContractSymbols} from '../interface/phemex';
// import {PhemexAccount} from '../lib/config';
// import {SpotSymbol} from '../interface/phemex/spot/spot.symbol';
// import {SpotActivePosition, SpotActivePositionData} from '../interface/phemex/spot/spot.positions';

// async function apiResponseHandler(apiResponse: ApiResponseType) {
//   let response = await apiResponse;
//   const {data, error} = response;
//
//   // console.log(JSON.stringify(response));
//
//   if (data) return data;
//   else throw new Error(error); // TODO : Handle this error upstream or use reject()
// }

// export const loadMarkets = async (account: PhemexAccount) => apiResponseHandler(marketApi.loadMarkets(account));
// export const loadOrderbook = async (account: PhemexAccount, symbol: ContractSymbols) => apiResponseHandler(marketApi.loadOrderbook(account, symbol));
// export const loadTrades = async (account: PhemexAccount, symbol: ContractSymbols) => apiResponseHandler(marketApi.loadTrades(account, symbol));
// export const loadActiveOrders = async (account: PhemexAccount, symbol: ContractSymbols) => apiResponseHandler(tradeApi.loadActiveOrders(account, symbol));
// export const getActivePositions = async (account: PhemexAccount, currency: Currency): Promise<ContractActivePositionData> => apiResponseHandler(tradeApi.getActivePositions(account, currency));
// export const getSpotOrders = async (account: PhemexAccount, spotSymbol: SpotSymbol): Promise<SpotActivePosition[]> => apiResponseHandler(tradeApi.getSpotOrders(account, spotSymbol));
// export const loadPastOrders = async (account: PhemexAccount, symbol: ContractSymbols) => apiResponseHandler(tradeApi.loadPastOrders(account, symbol));


// export async function placeOrder() {
//   const {placeOrder} = require('../api/trade');
//   const {data, error} = await placeOrder({
//     symbol: 'BTCUSD',
//     side: 'Buy',
//     priceEp: 100000000,
//     orderQty: 11,
//     ordType: 'Limit',
//   });
//   if (data) {
//     console.log(data);
//   }
//   if (error) {
//     console.log(error);
//   }
// }

// export async function cancelOrder() {
//   const {cancelOrder} = require('../api/trade');
//   const {data, error} = await cancelOrder('BTCUSD', '5a10df22-2152-459f-8d57-5392e97c047f');
//   if (data) {
//     console.log(data);
//   }
//   if (error) {
//     console.log(error);
//   }
// }
