import axios from 'axios';

const DISCORD_API_BASE_URL = 'https://discord.com/api/v10';

interface CommandOptionChoice {
  name: string;
  value: string | number;
  name_localizations?: Record<string, string>;
}

interface CommandOption {
  type: number;
  name: string;
  description: string;
  required?: boolean;
  category?: string; // Adicionando a categoria como opcional
  choices?: CommandOptionChoice[];
  options?: CommandOption[]; // Para subcomandos/grupos
  name_localizations?: Record<string, string>;
  description_localizations?: Record<string, string>;
}

export interface DiscordCommand {
  id: string;
  application_id: string;
  name: string;
  description: string;
  options?: CommandOption[];
  type: number; // 1 for CHAT_INPUT (Slash Command)
  version: string;
   category?: string;
  dm_permission?: boolean;
  default_member_permissions?: string | null;
  nsfw?: boolean;
  name_localizations?: Record<string, string>;
  description_localizations?: Record<string, string>;
}

/**
 * Busca os comandos globais do seu bot no Discord API.
 * @param applicationId O ID do seu aplicativo/bot Discord.
 * @param botToken O token do seu bot Discord.
 * @returns Uma Promise que resolve para um array de DiscordCommand.
 */

export async function getGlobalApplicationCommands(
  applicationId: string,
  botToken: string // Este botToken é o valor puro da variável de ambiente
): Promise<DiscordCommand[]> {
  console.log(`[Discord API Debug] Tentando buscar comandos para Application ID: ${applicationId}`);
  // CUIDADO: Não logue o botToken completo em produção! Apenas para depuração.
  // console.log(`[Discord API Debug] Usando Bot Token (parcial): ${botToken.substring(0, 5)}...`);

  try {
    const response = await axios.get<DiscordCommand[]>(
      `${DISCORD_API_BASE_URL}/applications/${applicationId}/commands`,
      {
        headers: {
          Authorization: `Bot ${botToken}`, // O "Bot " é adicionado aqui
          'Content-Type': 'application/json', // Boa prática
        },
      }
    );
    console.log(`[Discord API Debug] Requisição bem-sucedida. Status: ${response.status}`);
    return response.data;
  } catch (error: any) { // Use 'any' para capturar todos os tipos de erro com axios
    if (axios.isAxiosError(error)) {
      console.error(`[Discord API Debug] Erro do Axios ao buscar comandos:`);
      console.error(`  Status: ${error.response?.status}`);
      console.error(`  Dados do Erro:`, error.response?.data); // Isso é crucial!
      console.error(`  Headers:`, error.response?.headers);
      console.error(`  Config da Requisição:`, error.config);
    } else {
      console.error(`[Discord API Debug] Erro desconhecido ao buscar comandos:`, error);
    }
    throw new Error('Não foi possível buscar os comandos do Discord.'); // Re-throw para a API Route capturar
  }
}