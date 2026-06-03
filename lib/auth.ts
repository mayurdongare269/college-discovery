import { getServerSession } from 'next-auth';
import { authOptions as authOpts } from '@/app/api/auth/[...nextauth]/route';

// Re-export authOptions for use in other files
export const authOptions = authOpts;

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}
