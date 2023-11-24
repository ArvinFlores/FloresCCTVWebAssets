import type { IHttpClient } from './interfaces';

function createHttpClient (): IHttpClient {
  const baseFetch = async <Data>(url: string, options: RequestInit): Promise<Data> => await fetch(
    url,
    options
  ).then(async (response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return await response.json();
  });

  return {
    async get (url, params, opts) {
      const q = new URLSearchParams(params).toString();

      return await baseFetch(`${url}?${q}`, { ...opts, method: 'GET' });
    },
    async post (url, body, opts) {
      return await baseFetch(url, {
        ...opts,
        body,
        method: 'POST'
      });
    },
    async delete (url, body, opts) {
      return await baseFetch(url, {
        ...opts,
        body,
        method: 'DELETE'
      });
    }
  };
}

export const httpClient = createHttpClient();
