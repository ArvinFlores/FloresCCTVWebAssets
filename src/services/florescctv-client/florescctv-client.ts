import { httpClient } from 'src/services/http-client';
import type { IFloresCCTVClient, IFloresCCTVClientOptions } from './interfaces';

function createFloresCCTVClient ({
  apiUrl,
  httpClient
}: IFloresCCTVClientOptions): IFloresCCTVClient {
  const recordingsUrl = `${apiUrl}/recordings`;
  const camerasUrl = `${apiUrl}/cameras`;

  return {
    recordings: {
      async getAll (
        {
          pageSize,
          pageToken,
          sortKey,
          sortOrder
        },
        opts
      ) {
        const params = {
          'page-size': pageSize.toString(),
          'page-token': pageToken ?? '',
          'sort-key': sortKey,
          'sort-order': sortOrder
        };
        return await httpClient.get(recordingsUrl, params, opts);
      },
      async delete (id, opts) {
        return await httpClient.delete(`${recordingsUrl}/${id}`, undefined, opts);
      }
    },
    cameras: {
      async getAllHealth (opts) {
        return await httpClient.get(`${camerasUrl}/health`, undefined, opts);
      }
    }
  };
}

export const florescctvClient = createFloresCCTVClient({
  apiUrl: FLORES_CCTV_API_URL,
  httpClient
});
