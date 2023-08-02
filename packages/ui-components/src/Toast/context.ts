import { createContext, useContext } from 'react';
import type { group } from '@zag-js/toast';
import { type RenderOptions } from './index';

type ToastContextPropsBase = ReturnType<(typeof group)['connect']>;
type ToastCreateProps = Omit<ToastContextPropsBase['create'], 'render'> & Required<{ render: (props: RenderOptions) => JSX.Element }>;
export type ToastContextProps = ToastContextPropsBase & ToastCreateProps;

export const ToastContext = createContext<ToastContextProps>(null!);
export const useToast = () => useContext(ToastContext);
