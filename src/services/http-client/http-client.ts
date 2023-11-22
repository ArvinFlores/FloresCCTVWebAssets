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
    async get (url, params) {
      const q = new URLSearchParams(params).toString();

      return await baseFetch(`${url}?${q}`, { method: 'GET' });
    },
    async post (url, body) {
      return await baseFetch(url, {
        body,
        method: 'POST'
      });
    },
    async delete (url, body) {
      return await baseFetch(url, {
        body,
        method: 'DELETE'
      });
    }
  };
}

export const httpClient = createHttpClient();
