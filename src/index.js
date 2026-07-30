import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './css/theme.css';
import './css/custom.css';
import App from './App';

// Chrome fires this the moment a ResizeObserver callback can't finish
// processing every pending notification within one animation frame — it's
// informational, not a crash, but the webpack-dev-server overlay (and some
// third-party error trackers) treats any window "error" event as fatal and
// shows a full-screen red overlay for it. Recharts' ResponsiveContainer
// (used throughout the WIP dashboards) uses ResizeObserver internally, and
// abrupt layout changes like exiting fullscreen reliably trigger it, so it
// gets silenced here rather than swallowed ad hoc in every chart.
const RESIZE_OBSERVER_LOOP_ERROR_RE = /^ResizeObserver loop (limit exceeded|completed with undelivered notifications)/;
window.addEventListener('error', (e) => {
  if (RESIZE_OBSERVER_LOOP_ERROR_RE.test(e.message)) {
    e.stopImmediatePropagation();
    const overlay = document.getElementById('webpack-dev-server-client-overlay');
    if (overlay) overlay.setAttribute('style', 'display: none');
  }
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
