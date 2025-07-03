// components/AdsterraAd.tsx
import { useEffect } from 'react';
import Script from 'next/script';

// 1. Declaração de tipos para o objeto window
declare global {
  interface Window {
    atOptions?: {
      key: string;
      format: string;
      height: number;
      width: number;
      params: Record<string, any>;
    };
  }
}

export default function AdsterraAd() {
  useEffect(() => {
    const reloadAd = () => {
      if (typeof window !== 'undefined' && window.atOptions) {
        try {
          const existingAd = document.getElementById('adsterra-ad-container');
          if (existingAd) existingAd.innerHTML = '';
          
          const script = document.createElement('script');
          script.src = `https://www.highperformanceformat.com/${window.atOptions.key}/invoke.js`;
          script.async = true;
          document.getElementById('adsterra-ad-container')?.appendChild(script);
        } catch (error) {
          console.error('Adsterra reload error:', error);
        }
      }
    };

    window.addEventListener('focus', reloadAd);
    
    return () => {
      window.removeEventListener('focus', reloadAd);
    };
  }, []);

  return (
    <div className="adsterra-ad-wrapper" style={{ minHeight: '250px', margin: '20px 0' }}>
      {/* Configuração do Adsterra */}
      <Script
        id="adsterra-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.atOptions = {
              key: 'd1366c3317f2fefca44c0aeadbefa23c',
              format: 'iframe',
              height: 250,
              width: 300,
              params: {}
            };
          `,
        }}
      />
      
      {/* Container do anúncio */}
      <div id="adsterra-ad-container">
        <div style={{
          backgroundColor: '#f0f0f0',
          color: '#333',
          padding: '20px',
          textAlign: 'center',
          borderRadius: '4px'
        }}>
          Carregando anúncio...
        </div>
      </div>
      
      {/* Script de carregamento */}
      <Script
        id="adsterra-load"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const container = document.getElementById('adsterra-ad-container');
              if (container && window.atOptions) {
                const script = document.createElement('script');
                script.src = 'https://www.highperformanceformat.com/' + window.atOptions.key + '/invoke.js';
                script.async = true;
                container.appendChild(script);
              }
            })();
          `,
        }}
      />
    </div>
  );
}