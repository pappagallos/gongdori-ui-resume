import '../styles/globals.scss';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';

// components
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

// styles
import 'react-toastify/dist/ReactToastify.min.css';

function MyApp({ Component, pageProps }) {
  // 채널톡 연동
  useEffect(() => {
    (function() {
      const w = window;
      if (w.ChannelIO) {
        return (window.console.error || window.console.log || function(){})('ChannelIO script included twice.');
      }
      const ch = function() {
        ch.c(arguments);
      };
      ch.q = [];
      ch.c = function(args) {
        ch.q.push(args);
      };
      w.ChannelIO = ch;
      function l() {
        if (w.ChannelIOInitialized) {
          return;
        }
        w.ChannelIOInitialized = true;
        const s = document.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = 'https://cdn.channel.io/plugin/ch-plugin-web.js';
        s.charset = 'UTF-8';
        const x = document.getElementsByTagName('script')[0];
        x.parentNode.insertBefore(s, x);
      }
      if (document.readyState === 'complete') {
        l();
      } else if (window.attachEvent) {
        window.attachEvent('onload', l);
      } else {
        window.addEventListener('DOMContentLoaded', l, false);
        window.addEventListener('load', l, false);
      }
    })();
    ChannelIO('boot', {
      "pluginKey": "03c6b644-a0e3-4d8e-87fd-21c0b17e3af8"
    });
  }, []);

  return (
    <>
      <Header />
      <Component {...pageProps} />
      <Footer />
      <ToastContainer hideProgressBar={true} autoClose={2000} />
    </>
  );
}

export default MyApp;