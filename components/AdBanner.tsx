// components/AdsterraAdFixed.tsx
import { useEffect, useState } from 'react';
import Script from 'next/script';

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

export default function AdsterraAdFixed() {
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    // Verifica se o anúncio foi injetado
    const checkAd = () => {
      const adContainer = document.getElementById('adsterra-ad-container');
      if (adContainer && adContainer.children.length > 1) {
        setAdLoaded(true);
      }
    };

    // Força recarregamento se necessário
    const reloadAd = () => {
      if (window.atOptions) {
        const container = document.getElementById('adsterra-ad-container');
        if (container) {
          container.innerHTML = '';
          const script = document.createElement('script');
          script.src = `https://www.highperformanceformat.com/${window.atOptions.key}/invoke.js`;
          script.async = true;
          container.appendChild(script);
        }
      }
    };

    // Configura observers e listeners
    const observer = new MutationObserver(checkAd);
    const container = document.getElementById('adsterra-ad-container');
    if (container) {
      observer.observe(container, { childList: true });
    }

    const timer = setTimeout(checkAd, 3000);
    window.addEventListener('focus', reloadAd);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
      window.removeEventListener('focus', reloadAd);
    };
  }, []);

  return (
    <div style={{
      minHeight: '250px',
      width: '100%',
      position: 'relative',
      border: adLoaded ? 'none' : '1px dashed #ccc',
      backgroundColor: adLoaded ? 'transparent' : '#f5f5f5',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: '20px 0'
    }}>
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
      
      {/* Container principal */}
      <div id="adsterra-ad-container" style={{
        width: '100%',
        height: '100%',
        display: adLoaded ? 'block' : 'none'
      }}>
        {/* Fallback que some quando o anúncio carrega */}
        {!adLoaded && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#666',
            fontSize: '14px'
          }}>
            Carregando anúncio...
          </div>
        )}
      </div>

      {/* Script de carregamento */}
      <Script
        id="adsterra-load"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var container = document.getElementById('adsterra-ad-container');
              if (container && window.atOptions) {
                var script = document.createElement('script');
                script.src = 'https://www.highperformanceformat.com/' + window.atOptions.key + '/invoke.js';
                script.async = true;
                
                // Verificação adicional de carregamento
                script.onload = function() {
                  if (container) {
                    container.style.display = 'block';
                  }
                };
                
                container.appendChild(script);
              }
            })();
          `,
        }}
      />
    </div>
  );
}