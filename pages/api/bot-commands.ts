import { NextApiRequest, NextApiResponse } from 'next';
import { getGlobalApplicationCommands, DiscordCommand } from '../../utils/discord-api';


import commandCategoryMapData from '../../utils/commandCategoryMap.json';
interface DiscordCommandOption {
    type: number;
    name: string;
    name_localizations?: Record<string, string>;
    description: string;
    description_localizations?: Record<string, string>;
    required?: boolean;
    choices?: Array<{
        name: string;
        name_localizations?: Record<string, string>;
        value: string | number;
    }>;
    options?: DiscordCommandOption[];
}

interface FormattedCommandOption {
    name: string;
    description: string;
    type: string;
    required: boolean;
    choices?: Array<{ name: string; value: string | number }>;
    options?: FormattedCommandOption[];
}

interface FormattedCommand {
    name: string;
    description: string;
    usage: string;
    category: string; 
    options?: FormattedCommandOption[];
}

enum CommandOptionType {}
const OptionTypeMap: Record<CommandOptionType, string> = { };

function formatOptions(
    options: DiscordCommandOption[] | undefined,
    locale: string
): FormattedCommandOption[] | undefined {

    if (!options) return undefined;

    return options.map((option) => {
        const name = option.name_localizations?.[locale] || option.name;
        const description = option.description_localizations?.[locale] || option.description;

        const formattedOption: FormattedCommandOption = {
            name,
            description,
            type: OptionTypeMap[option.type as CommandOptionType] || `UNKNOWN_TYPE (${option.type})`,
            required: option.required || false,
        };

        if (option.choices) {
            formattedOption.choices = option.choices.map((choice) => ({
                name: choice.name_localizations?.[locale] || choice.name,
                value: choice.value,
            }));
        }

        if (option.options) {
            formattedOption.options = formatOptions(option.options, locale);
        }
        return formattedOption;
    });
}

function generateOptionsUsage(options: FormattedCommandOption[] | undefined): string {

    if (!options || options.length === 0) {
        return '';
    }
    return options.map(opt => {
        let part = '';
        if (opt.type === 'SUB_COMMAND' || opt.type === 'SUB_COMMAND_GROUP') {
            part = ` ${opt.name}`;
            part += generateOptionsUsage(opt.options);
        } else {
            const argName = opt.name;
            part = opt.required ? ` <${argName}>` : ` [${argName}]`;
        }
        return part;
    }).join('');
}

function generateUsageString(
    commandName: string,
    options: FormattedCommandOption[] | undefined
): string {
  
    return `/${commandName}` + generateOptionsUsage(options);
}


const categoryMap: Record<string, string> = commandCategoryMapData;

const DEFAULT_API_CATEGORY_KEY = 'utility'; 

function getCommandCategory(originalCommandName: string): string {
   
    const mappedCategory = categoryMap[originalCommandName.toLowerCase()];
    if (mappedCategory) {
        return mappedCategory;
    }
     console.warn(`Comando "${originalCommandName}" não encontrado no commandCategoryMap.json. Usando categoria padrão: ${DEFAULT_API_CATEGORY_KEY}`);
    return DEFAULT_API_CATEGORY_KEY;
}


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<FormattedCommand[] | { message: string }>
) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const acceptLanguage = req.headers['accept-language'] || '';
    const userLocale = (typeof req.query.locale === 'string' ? req.query.locale : acceptLanguage.split(',')[0]) || 'en-US';

    const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
    const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

    if (!DISCORD_CLIENT_ID || !DISCORD_TOKEN) {
        console.error('Variáveis de ambiente não configuradas.');
        return res.status(500).json({ message: 'Configuração do servidor incompleta.' });
    }

    try {
        const discordCommands: DiscordCommand[] = await getGlobalApplicationCommands(
            DISCORD_CLIENT_ID,
            DISCORD_TOKEN
        );

        const formattedCommands: FormattedCommand[] = discordCommands
            .filter((cmd): cmd is DiscordCommand & { type?: 1 | unknown, description: string, name: string } =>
                (cmd.type === undefined || cmd.type === 1) && typeof cmd.description === 'string' && typeof cmd.name === 'string'
            )
            .map((command) => {
                const originalName = command.name; 
                const category = getCommandCategory(originalName); 

                const displayName = command.name_localizations?.[userLocale] || originalName;
                const description = command.description_localizations?.[userLocale] || command.description;

                const formattedOptions = formatOptions(command.options, userLocale);
                const usage = generateUsageString(displayName, formattedOptions);

                return {
                    name: displayName,
                    description,
                    usage,
                    category, 
                    options: formattedOptions,
                };
            });

        res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
        return res.status(200).json(formattedCommands);
    } catch (error: any) {
        console.error('Erro na API /api/bot-commands:', error);
        const errorMessage = process.env.NODE_ENV === 'development' && error.stack
            ? error.stack
            : 'Erro ao buscar comandos do bot.';
        return res.status(500).json({ message: errorMessage });
    }
}