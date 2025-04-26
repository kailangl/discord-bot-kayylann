
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  db: { schema: 'public' }
});


export const testConnection = async (): Promise<{
  success: boolean;
  data?: { guild_id: string }[];
  error?: Error;
}> => {
  try {
    const { data, error } = await supabase
      .from('bot_config')
      .select('guild_id')
      .limit(1);

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error('Erro desconhecido') 
    };
  }
};