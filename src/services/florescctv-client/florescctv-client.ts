import { httpClient } from 'src/services/http-client';
import type { IFloresCCTVClient, IFloresCCTVClientOptions } from './interfaces';

function createFloresCCTVClient ({
  apiUrl,
  httpClient
}: IFloresCCTVClientOptions): IFloresCCTVClient {
  const baseUrl = `${apiUrl}/recordings`;

  return {
    recordings: {
      async getAll (
        {
          pageSize,
          sortKey,
          sortOrder
        },
        opts
      ) {
        const params = {
          'page-size': pageSize.toString(),
          'sort-key': sortKey,
          'sort-order': sortOrder
        };
        return await httpClient.get(baseUrl, params, opts);
      },
      async delete (id, opts) {
        return await httpClient.delete(`${baseUrl}/${id}`, undefined, opts);
      }
    }
  };
}

export const florescctvClient = createFloresCCTVClient({
  apiUrl: FLORES_CCTV_API_URL,
  httpClient
});
