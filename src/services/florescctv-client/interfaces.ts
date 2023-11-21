import { FileStorage } from 'florescctvwebservice-types';
import { httpClient } from 'src/services/http-client';

export interface IFloresCCTVClientOptions {
  apiUrl: string;
  httpClient: typeof httpClient;
}

export interface IFloresCCTVClient {
  recordings: Pick<FileStorage.Actions, 'getAll' | 'delete'>;
}