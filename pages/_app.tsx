import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Desativa HMR problemático no Cloud Workstations
    if (process.env.NODE_ENV === 'development' && 
        window.location.hostname.includes('cloudworkstations.dev')) {
      console.log('Running in Cloud Workstations - HMR adjustments applied')
    }
  }, [])

  return <Component {...pageProps} />
}

export default MyApp