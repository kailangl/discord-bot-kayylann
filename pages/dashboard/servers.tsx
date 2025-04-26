
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
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <ServerSelector />
    </div>
  );
}