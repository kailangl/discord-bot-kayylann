import type { NextApiRequest, NextApiResponse } from 'next';
import { REST } from '@discordjs/rest';

// Configuração de URLs permitidas
const ALLOWED_REDIRECT_URIS = [
  'http://localhost:3000/api/auth/callback',
  'https://9000-idx-discord-bot-kayylann-1745448333240.cluster-kc2r6y3mtba5mswcmol45orivs.cloudworkstations.dev/api/auth/callback',
  // Adicione sua URL de produção aqui
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { code } = req.query;

  // Verificação robusta do código
  if (typeof code !== 'string') {
    return res.redirect('/?error=invalid_code&message=Código de autorização inválido ou ausente');
  }

  try {
    // Determina a redirect_uri correta baseada no ambiente
    let redirectUri = `${req.headers.origin}/api/auth/callback`;
    
    // Verifica se a redirect_uri é permitida
    if (!ALLOWED_REDIRECT_URIS.some(allowedUri => redirectUri.startsWith(allowedUri))) {
      console.error('Redirect URI não permitido:', redirectUri);
      return res.redirect('/?error=invalid_redirect_uri');
    }

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_CLIENT_SECRET!);
    
    // Troca o código por um token de acesso
    const response = await rest.post(
      '/oauth2/token',
      {
        body: new URLSearchParams({
          client_id: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!,
          client_secret: process.env.DISCORD_CLIENT_SECRET!,
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri,
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    ) as { access_token: string, expires_in: number, refresh_token: string };

    // Armazenamento seguro do token (HTTP-only cookie)
    res.setHeader('Set-Cookie', [
      `discord_access_token=${response.access_token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${response.expires_in}`,
      `discord_refresh_token=${response.refresh_token}; Path=/; HttpOnly; Secure; SameSite=Lax`
    ]);

    // Redirecionamento seguro
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Erro no OAuth do Discord:', error);
    
    // Tratamento de erros específicos
    let errorMessage = 'auth_failed';
    if (error instanceof Error) {
      if (error.message.includes('invalid redirect_uri')) {
        errorMessage = 'invalid_redirect_uri';
      } else if (error.message.includes('invalid code')) {
        errorMessage = 'invalid_code';
      }
    }
    
    res.redirect(`/?error=${errorMessage}`);
  }
}