// app/api/autumn/[...all]/route.ts
import { api } from '@/convex/_generated/api';
import { getToken } from '@/lib/auth-server';
import { autumnHandler } from 'autumn-js/next';
import { fetchQuery } from 'convex/nextjs';
import { cookies } from 'next/headers';

export const { GET, POST } = autumnHandler({
  identify: async () => {
    const convexToken = await getToken();

    if (!convexToken) {
      console.log('No convex token found, returning null');
      return null;
    }

    const user = await fetchQuery(
      api.auth.getCurrentUser,
      {},
      { token: convexToken }
    );

    if (!user) {
      console.log('No user found');
      return null;
    }

    return {
      customerId: user._id,
      customerData: {
        name: user.name,
        email: user.email,
      },
    };
  },
});
