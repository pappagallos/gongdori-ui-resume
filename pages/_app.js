import '../styles/globals.scss';

// components
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </>
  )
    
}

export default MyApp
