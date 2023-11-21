export interface IHttpClient {
  get: <Data>(url: string, params?: Record<string, string>) => Promise<Data>;
  post: <Data>(url: string, body?: BodyInit) => Promise<Data>;
  delete: <Data>(url: string, body?: BodyInit) => Promise<Data>;
}
