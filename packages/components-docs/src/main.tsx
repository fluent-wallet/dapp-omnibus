import React from 'react';
import ReactDOM from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import RecoilNexus from 'recoil-nexus';
import App from './CustomDev';
import './index.css';
import { ToastProvider } from '@cfx-kit/ui-components/src/Toast';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ToastProvider>
      <RecoilRoot>
        <RecoilNexus />
        <App />
      </RecoilRoot>
    </ToastProvider>
  </React.StrictMode>,
);
