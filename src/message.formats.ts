// import {Configuration} from './lib/config';
// import {getActivePositions, getSpotOrders} from './controllers/rest.controller';
// import {ContractPosition} from './interface/phemex/contract/contract.position';
// import {Currency} from './interface/phemex/base.types';
// import {SpotSymbol, SpotSymbols} from './interface/phemex/spot/spot.symbol';
// import {SpotActivePosition} from './interface/phemex/spot/spot.positions';
// import {indent} from './lib/functions';

// export async function formatActiveContractCurrencyPositions(phemexAccount: PhemexAccount, currency: Currency) {
//   const {account, positions} = await getActivePositions(phemexAccount, currency);
//
//   // TODO : This may be useful elsewhere, consider extracting to global scope for accessibility.
//   const precision = currency == 'USD' ? 4 : currency == 'BTC' ? 8 : 0;
//
//   // NOTE : Don't actually need it in this case as we'll be passing currency explicitly
//   if (!precision) {
//     // TODO : Means they have some new currency that we haven't accounted for.
//     throw new Error(`Unknown precision for currency ${currency}`);
//   }
//
//   /*
//   * Account: Group Trade 15465
//   * Trade: L-BTC 10X @$55,351 0.913 BTC
//   * Pos Size: $500,000
//   * TP/SL: $56200 / $54640
//   * Status: Open 05/06 19:21 UTC
//   * */
//
//   const balance = account.accountBalanceEv / (10 ** precision);
//   const responseHeader = `${account.currency} Contract Account: ${balance} ${account.currency}\n`;
//   let response = '';
//   let activePositions = positions.filter(({side}: ContractPosition) => side != 'None');
//
//
//   // TODO : Going to need to account for precision for each currency type.
//   if (activePositions.length > 0)
//     activePositions
//       .forEach(({
//                   side,
//                   symbol,
//                   leverage,
//                   stopLoss,
//                   takeProfit,
//                   avgEntryPrice,
//                   value,
//                   size,
//                   avgEntryPriceEp,
//                   markPriceEp,
//                   markPrice,
//                   liquidationPrice,
//                 }: ContractPosition) => response += `Trade: ${symbol} - ${side} ${leverage}x\n`
//         + `Pos Size: ${value} ${account.currency}\n`
//         + `Entry / Market: $${avgEntryPrice} / $${markPrice}\n`
//         + `UPnL: ${(size * leverage * ((1 / avgEntryPriceEp) - (1 / markPriceEp)) * (10 ** 3)).toPrecision(8)} ${currency}\n`
//         + `Liquidation price: $${liquidationPrice}\n`
//         + `TP/SL: ${takeProfit} / ${stopLoss}`);
//   else {
//     console.log(`No active positions for ${phemexAccount.name} ${account.currency} contract account`);
//     response += `-- No active trades --`;
//   }
//
//   return responseHeader + indent(response, Configuration.indent);
// }
//
// export async function formatActiveContractPositions(phemexAccount: PhemexAccount) {
//
//   // TODO : Currency should be abstracted along with precision.
//   const currencies: Currency[] = ['USD', 'BTC'];
//
//   const responses = await Promise
//     .all(currencies
//       .map<Promise<string>>(cur => formatActiveContractCurrencyPositions(phemexAccount, cur)));
//
//   return `Active Contract Positions:\n`
//     + responses
//       .map(res => `${indent(res, Configuration.indent)}`)
//       .join('\n');
// }
//
// export async function formatActiveSpotSymbolPositions(phemexAccount: PhemexAccount, spotSymbol: SpotSymbol): Promise<[string, boolean]> {
//   const activePositions = await getSpotOrders(phemexAccount, spotSymbol);
//
//   // const balance = account.accountBalanceEv / (10 ** spotSymbol.pricePrecision);
//   const responseHeader = `${spotSymbol.symbol} Spot Trading\n`;
//   // const responseHeader = `${spotSymbol.symbol} Spot Trading: ${balance} ${account.currency}\n`;
//   let response = '';
//   // let activePositions = positions.filter(({side}: ContractPosition) => side != 'None');
//
//   if (activePositions.length > 0)
//     activePositions
//       .forEach((
//         {
//           side,
//           symbol,
//           avgPriceEp,
//         }: SpotActivePosition) => response += `Trade: ${symbol} - ${side}\n`
//         + `Entry: ${avgPriceEp}\n`);
//     // + `Pos Size: ${value} ${currency}\n`;
//     // + `UPnL: ${(size * ((1 / avgEntryPriceEp) - (1 / markPriceEp)) * (10 ** 3)).toPrecision(8)} ${symbol}\n`
//   // + `TP/SL: ${takeProfit} / ${stopLoss}`);
//   else {
//     console.log(`No active positions for ${phemexAccount.name} ${spotSymbol.symbol} spot account`);
//     response += `-- No active trades --`;
//   }
//
//   return [responseHeader + indent(response, Configuration.indent), activePositions.length > 0];
// }
//
// export async function formatActiveSpotPositions(phemexAccount: PhemexAccount) {
//   const responses = await Promise
//     .all(SpotSymbols
//       .map<Promise<[string, boolean]>>(spotSymbol => formatActiveSpotSymbolPositions(phemexAccount, spotSymbol)),
//     );
//
//   const activePositions = responses.filter(res => res[1]);
//
//   // console.log(`active positions are ${JSON.stringify(activePositions)}`);
//
//   return `Active Spot positions:\n`
//     + (activePositions.length > 0 ? activePositions
//         .map(res => `${indent(res[0], Configuration.indent)}`)
//         .join('\n')
//       : indent('-- No active trades --', Configuration.indent));
// }
