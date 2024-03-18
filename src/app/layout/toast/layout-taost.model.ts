export interface ToastParams {
  id: symbol;
  isShow: boolean;
  data?: any;
  component?: any;
  callback?: () => void;
}

export const TOAST_ANIMATION_TIME = 300;

