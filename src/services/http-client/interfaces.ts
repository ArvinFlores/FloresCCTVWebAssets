export type HttpClientOpts = Pick<RequestInit, 'signal'>;

export interface IHttpClient {
  get: <Data>(url: string, params?: Record<string, string>, opts?: HttpClientOpts) => Promise<Data>;
  post: <Data>(url: string, body?: BodyInit, opts?: HttpClientOpts) => Promise<Data>;
  delete: <Data>(url: string, body?: BodyInit, opts?: HttpClientOpts) => Promise<Data>;
}
