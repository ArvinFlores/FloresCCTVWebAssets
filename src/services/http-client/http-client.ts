import type { IHttpClient } from './interfaces';

function createHttpClient (): IHttpClient {
  const baseFetch = (url: string, options: RequestInit) => fetch(url, options).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  });

  return {
    get (url, params) {
      const q = new URLSearchParams(params).toString();

      return baseFetch(`${url}?${q}`, { method: 'GET' });
    },
    post (url, body) {
      return baseFetch(url, {
        body,
        method: 'POST',
      });
    },
    delete (url, body) {
      return baseFetch(url, {
        body,
        method: 'DELETE',
      });
    }
  };
}

export const httpClient = createHttpClient();
