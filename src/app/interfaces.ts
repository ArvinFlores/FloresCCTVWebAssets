export interface AppError {
  message: string;
  dismissable: boolean;
  details?: Record<string, any>;
}
