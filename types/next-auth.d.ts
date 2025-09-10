import 'next-auth';
import 'next-auth/jwt';
import { UserRole } from '@/lib/constants/roles';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      roles: UserRole[];
      companyId?: string | null;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    roles: UserRole[];
    companyId?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    userId: string;
    roles: UserRole[];
    companyId?: string | null;
  }
}
