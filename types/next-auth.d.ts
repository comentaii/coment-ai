import 'next-auth';
import 'next-auth/jwt';
import { UserRole } from '@/lib/constants';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      company: {
        _id: string;
        name: string;
      } | null;
    } & DefaultSession['user'];
  }

  interface User {
    role: UserRole;
    company: {
      _id: string;
      name: string;
    } | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: UserRole;
    company: {
      _id: string;
      name: string;
    } | null;
  }
}
