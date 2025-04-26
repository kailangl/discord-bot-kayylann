declare module 'discord-api-types' {
    interface APIGuild {
      id: string;
      name: string;
      icon: string | null;
      owner: boolean;
      permissions: string;
    }
  
    interface APIUser {
      id: string;
      username: string;
      discriminator: string;
      avatar: string | null;
    }
  
  }

