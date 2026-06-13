import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';

import App from './App';
import reportWebVitals from './reportWebVitals';

import { Provider } from 'react-redux';
import { store } from './redux/store';

import { Toaster } from 'react-hot-toast';

const root = ReactDOM.createRoot(
    document.getElementById('root'),
);

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />

            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,

                    style: {
                        background: '#101624',
                        color: '#fff',
                        border:
                            '1px solid rgba(255,255,255,0.1)',
                    },

                    success: {
                        style: {
                            border:
                                '1px solid #00E676',
                        },
                    },

                    error: {
                        style: {
                            border:
                                '1px solid #FF5252',
                        },
                    },
                }}
            />
        </Provider>
    </React.StrictMode>,
);

reportWebVitals();