import 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipRedirect?: boolean;
  }
}