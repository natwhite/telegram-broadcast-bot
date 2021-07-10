import qs, {ParsedUrlQueryInput} from 'querystring';
import axios from 'axios';
// import {URLS} from '../lib/const/url';
import {buildSignature} from './sign';
// import {PhemexAccount} from '../lib/config';

// axios.defaults.baseURL = URLS.API_URL;

// function createHeaders(account: PhemexAccount, urlPath: string, querystring = '', body = '') {
//   const expiry = Math.floor(Date.now() / 1000) + 2 * 60;
//   const content = urlPath + querystring + expiry + body;
//   const signature = buildSignature(content, account.secret);
//   return {
//     'Content-Type': 'application/json',
//     'x-phemex-access-token': account.api_key,
//     'x-phemex-request-expiry': expiry,
//     'x-phemex-request-signature': signature,
//   };
// }
//
// export async function get(account: PhemexAccount, url: string, {query: query}: {query?: ParsedUrlQueryInput} = {}) {
//   try {
//     const querystring = query ? qs.stringify(query) : '';
//     const headers = createHeaders(account, url, querystring);
//     const response = await axios({
//       url,
//       method: 'get',
//       headers,
//       params: query,
//       paramsSerializer() {
//         return querystring;
//       },
//     });
//     if (response.status === 200) {
//       const {code, msg, data, error, result} = response.data;
//       if (code === 0) return {data};
//       if (result) return {data: result};
//       if (error) return {error};
//
//       return {error: {code, msg}};
//     }
//     return {error: {}, response};
//   } catch (e) {
//     console.error(e);
//     return {error: e};
//   }
// }
//
// // TODO : Add type to params.
//
// export async function post(account: PhemexAccount, url: string, {
//   query: query,
//   params: params,
// }: {query?: ParsedUrlQueryInput, params: any}) {
//   try {
//     const querystring = query ? qs.stringify(query) : '';
//     const body = JSON.stringify(params);
//     const headers = createHeaders(account, url, querystring, body);
//     const response = await axios({
//       url,
//       method: 'post',
//       headers: headers,
//       params: query,
//       paramsSerializer() {
//         return querystring;
//       },
//       data: body,
//     });
//     if (response.status === 200) {
//       const {code, msg, data, error, result} = response.data;
//       if (code === 0) {
//         return {data};
//       }
//
//       if (result) {
//         return {data: result};
//       }
//
//       if (error) {
//         return {error};
//       }
//
//       return {error: {code, msg}};
//     }
//     return {error: {}, response};
//   } catch (e) {
//     console.error(e);
//     return {error: e};
//   }
// }
//
// export async function del(account: PhemexAccount, url: string, {query: query}: {query?: ParsedUrlQueryInput} = {}) {
//   try {
//     const querystring = query ? qs.stringify(query) : '';
//     const headers = createHeaders(account, url, querystring);
//     const response = await axios({
//       url,
//       method: 'delete',
//       headers,
//       params: query,
//       paramsSerializer() {
//         return querystring;
//       },
//     });
//     if (response.status === 200) {
//       const {code, msg, data, error, result} = response.data;
//       if (code === 0) {
//         return {data};
//       }
//
//       if (result) {
//         return {data: result};
//       }
//
//       if (error) {
//         return {error};
//       }
//
//       return {error: {code, msg}};
//     }
//     return {error: {}, response};
//   } catch (e) {
//     console.error(e);
//     return {error: e};
//   }
// }
