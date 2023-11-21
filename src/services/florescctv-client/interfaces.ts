import { httpClient } from 'src/services/http-client';

interface RecordingsActionsGetAllOptions {
  sortOrder: 'asc' | 'desc';
  sortKey: 'create_date';
  pageSize: number;
}

interface RecordingsActions {
  getAll: (options: RecordingsActionsGetAllOptions) => Promise<void>;
  delete: (id: string) => Promise<void>;
}

export interface IFloresCCTVClientOptions {
  apiUrl: string;
  httpClient: typeof httpClient;
}

export interface IFloresCCTVClient {
  recordings: RecordingsActions;
}