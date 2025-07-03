// components/AdComponent.tsx
import Script from 'next/script';

const AdComponent = () => {
  return (
    <div className="w-full flex justify-center my-8">
      {/* Container para o primeiro anúncio */}
      <div className="max-w-md mx-auto">
        <Script
          id="ad-script-config"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              atOptions = {
                'key': 'd1366c3317f2fefca44c0aeadbefa23c',
                'format': 'iframe',
                'height': 300,
                'width': 160,
                'params': {}
              };
            `,
          }}
        />
        <Script
          id="ad-script-load"
          strategy="lazyOnload"
          src="https://www.highperformanceformat.com/d1366c3317f2fefca44c0aeadbefa23c/invoke.js"
        />
      </div>

      {/* Container para o segundo anúncio */}
      <div className="max-w-md mx-auto">
        <Script
          id="profitablerate-script"
          strategy="lazyOnload"
          src="https://pl27067393.profitableratecpm.com/1c/b7/fc/1cb7fc5ba67e8e053770f85be1494141.js"
        />
      </div>
    </div>
  );
};

export default AdComponent;