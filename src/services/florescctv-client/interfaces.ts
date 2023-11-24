import type { FileStorage } from 'florescctvwebservice-types';
import type { httpClient } from 'src/services/http-client';
import type { HttpClientOpts } from 'src/services/http-client/interfaces';

interface RecordingsActions {
  getAll: (opts: FileStorage.GetAllOptions, clientOpts?: HttpClientOpts) => Promise<FileStorage.GetAllSuccess>;
  delete: (fileId: string, clientOpts?: HttpClientOpts) => Promise<FileStorage.DeleteSuccess>;
}

export interface IFloresCCTVClientOptions {
  apiUrl: string;
  httpClient: typeof httpClient;
}

export interface IFloresCCTVClient {
  recordings: RecordingsActions;
}
