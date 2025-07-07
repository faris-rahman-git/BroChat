export type EventEmitType = {
  event: string;
  data: any;
  retryCount?: number;
  failed?: boolean;
};
