import { Provider } from 'next-auth/client'

import '../styles/globals.css'
import Layout from '../comps/Layout'

export default function MyApp({ Component, pageProps }) {
  return (
    <Provider
      session={pageProps.session}
      options={{
        clientMaxAge: 40,
        keepAlive: 60 * 5,
      }}
    >
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  )
}
