export class HistoryPushStateModel {
  state: string;
  url?: string;
  callback?: () => void;
}
