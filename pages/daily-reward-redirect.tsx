// pages/daily-reward-redirect.tsx
import { useEffect } from 'react';
import Head from 'next/head';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/router';


const DAILY_REWARD_TARGET_URL = `${process.env.NEXT_PUBLIC_APP_URL}/reward?linkvertise_success=true`;
const LINKVERTISE_USER_ID = 345156; // Seu user_id do Linkvertise

export default function DailyRewardRedirect() {
  const router = useRouter();

  useEffect(() => {
    const redirectLinkvertise = () => {
    
      const encodedTargetUrl = btoa(DAILY_REWARD_TARGET_URL);

      const linkvertiseUrl = `https://link-to.net/${LINKVERTISE_USER_ID}/${Math.random() * 1000}/dynamic/?r=${encodedTargetUrl}`;

    
      window.location.href = linkvertiseUrl;
    };
  
    redirectLinkvertise();

   
    return () => {
     
    };
  }, [router]); 

  return (
    <>
      <Head>
        <title>Redirecionando para Recompensa...</title>
      </Head>
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white text-xl flex-col">
        <Loader2 size={32} className="animate-spin mr-2" />
        <p className="mt-4 text-center">
          Você será redirecionado para o Linkvertise para resgatar sua recompensa.
          <br />
          Por favor, complete a tarefa para continuar.
        </p>
        <p className="mt-2 text-sm text-gray-400">
          Se o redirecionamento não acontecer automaticamente,
          <a href="#" onClick={() => window.location.reload()} className="text-blue-400 hover:underline ml-1">clique aqui</a> para tentar novamente.
        </p>
      </div>
    </>
  );
}