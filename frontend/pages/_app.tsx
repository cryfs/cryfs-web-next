import type { AppProps } from 'next/app';
import '../assets/styles/bootstrap.scss';

// Make react-fontawesome work with next.js (see https://fontawesome.com/v5/docs/web/use-with/react#getting-font-awesome-css-to-work )
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

function CryfsWebApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default CryfsWebApp;
