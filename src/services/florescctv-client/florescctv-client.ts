import { httpClient } from 'src/services/http-client';
import type { IFloresCCTVClient, IFloresCCTVClientOptions } from './interfaces';

function createFloresCCTVClient ({
  apiUrl,
  httpClient
}: IFloresCCTVClientOptions): IFloresCCTVClient {
  const baseUrl = `${apiUrl}/recordings`;

  return {
    recordings: {
      getAll ({
        pageSize,
        sortKey,
        sortOrder
      }) {
        const params = {
          'page-size': pageSize.toString(),
          'sort-key': sortKey,
          'sort-order': sortOrder
        };
        return httpClient.get(baseUrl, params);
      },
      delete (id) {
        return httpClient.delete(`${baseUrl}/${id}`);
      }
    }
  };
}

export const florescctvClient = createFloresCCTVClient({
  apiUrl: FLORES_CCTV_API_URL,
  httpClient
});
