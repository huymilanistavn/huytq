import axios, { AxiosRequestConfig, AxiosPromise } from 'axios';
import Config from 'react-native-config';
import base64 from 'react-native-base64'

const VERSION_API = 'api/v1';

{/** Have to get from config or from server */ }

Config.URL_HOST_IMG = 'https://a3.lk-static.com/imglk/';
Config.URL_HOST_IMG1 = 'https://s1.sin88.win/';
//let SERVER_API = Config.API_ENTRY_POINT + VERSION_API;

const config_app = 'https://raw.githubusercontent.com/jamesgreenmango/configs/master/sin/config_app.json'

let _responseJson: {
  native_games_domain: string,
  api_domain: string
};

// export const getUrlImage = async () => {
//   _responseJson = (await (await fetch(config_app)).json());
//   Config.API_ENTRY_POINT = base64.decode(_responseJson?.api_domain);
//   Config.NATIVE_LINK = base64.decode(_responseJson?.native_games_domain);

//   Config.URL_HOST_IMG1 = 'https://s1.' + Config.API_ENTRY_POINT.substring(8);
//   return base64.decode(_responseJson?.api_domain);
// }

async function api_domain() {
  if (!_responseJson) {
    _responseJson = (await (await fetch(config_app)).json());
    Config.API_ENTRY_POINT = base64.decode(_responseJson?.api_domain);
    Config.NATIVE_LINK = base64.decode(_responseJson?.native_games_domain);

    Config.URL_HOST_IMG1 = 'https://s1.' + Config.API_ENTRY_POINT.substring(8);
    Config.URL_HOST_IMG2 = 'https://s2.' + Config.API_ENTRY_POINT.substring(8);
    Config.API_ENTRY_POINT = 'https://preview.gowithdev.net/';//'https://dev05.sin88.biz';
  }
  //return Config.API_ENTRY_POINT + VERSION_API;
  return Config.API_ENTRY_POINT;
}

async function api_domain_new() {
  if (!_responseJson) {
    _responseJson = (await (await fetch(config_app)).json());
    Config.API_ENTRY_POINT = base64.decode(_responseJson?.api_domain);
    Config.NATIVE_LINK = base64.decode(_responseJson?.native_games_domain);

    Config.URL_HOST_IMG1 = 'https://s1.' + Config.API_ENTRY_POINT.substring(8);
    Config.URL_HOST_IMG2 = 'https://s2.' + Config.API_ENTRY_POINT.substring(8);
    Config.API_ENTRY_POINT = 'https://preview.gowithdev.net/';//'https://win79.gowithdev.net'
  }
  return Config.API_ENTRY_POINT;
}

/**
 * Delete ajax function
 * @param path : api path
 * @param _API_VERSION : default version 1
 *
 * @return new promise to delete data from API
 */

export const get = async (request: any) => {
  const req: AxiosRequestConfig = {
    url: await api_domain() + request.path,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    responseType: 'json',
  };
  //console.log(req);
  const fetchData: AxiosPromise<any> = axios(req);
  return fetchData
    .then((res) => {
      return Promise.resolve(res);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

export const post = async (request: any) => {
  const req: AxiosRequestConfig = {
    url: await api_domain() + request.path,
    method: 'POST',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Content-Type': 'application/json; charset=utf-8',
      'app-os': 'ios',
      'app-device': 'iphone',
    },
    data: JSON.stringify(request.data),
    responseType: 'json',
    withCredentials: true,
  };
  const postData: AxiosPromise<any> = axios(req);
  return postData
    .then((res) => {
      return Promise.resolve(res);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

//using direct link or special API
export const getData = async (request: any) => {
  const req: AxiosRequestConfig = {
    url: await api_domain_new() + request.path,
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Content-Type': 'application/json; charset=utf-8',
    },
    responseType: 'json',
  };
  const fetchData: AxiosPromise<any> = axios(req);
  //console.log(req);
  return fetchData
    .then((res) => {
      return Promise.resolve(res);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

// using for new post bank and card withdraw
export const postData = async (url = '', data = {}) => {
  const response = await fetch(await api_domain() + url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      'app-os': 'ios',
      'app-device': 'iphone',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

export const deleteMethod = async (request: any) => {
  const req: AxiosRequestConfig = {
    url: await api_domain() + request.path,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    responseType: 'json',
  };
  const fetchData: AxiosPromise<any> = axios(req);
  return fetchData
    .then((res) => {
      return Promise.resolve(res);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

export const putMethod = async (request: any) => {
  const req: AxiosRequestConfig = {
    url: await api_domain() + request.path,
    method: 'PUT',
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Content-Type': 'application/json; charset=utf-8',
      token: '',
    },
    data: JSON.stringify(request.data),
    responseType: 'json',
  };
  //return (console.log(req));
  const putData: AxiosPromise<any> = axios(req);
  return putData
    .then((res) => {
      return Promise.resolve(res);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};
