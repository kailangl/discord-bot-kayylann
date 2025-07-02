
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import ServerSelector from '../../components/ServerSelector';

export default function ServerDashboard() {
  const { status } = useSession();
  const router = useRouter();

  if (status === 'unauthenticated') {
    router.push('/');
    return null;
  }

  if (status === 'loading') return <div>Carregando...</div>;

  return (
    <div>
      <ServerSelector />
    </div>
  );
}