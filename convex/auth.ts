import { createClient, type GenericCtx } from '@convex-dev/better-auth';
import { convex } from '@convex-dev/better-auth/plugins';
import { components } from './_generated/api';
import { DataModel } from './_generated/dataModel';
import { query, QueryCtx } from './_generated/server';
import { betterAuth, BetterAuthOptions } from 'better-auth';
import { headers } from 'next/headers';
import authSchema from './betterAuth/schema';
import { sendResetPassword } from './email';
import { requireActionCtx } from '@convex-dev/better-auth/utils';

const siteUrl = process.env.SITE_URL!;

// The component client has methods needed for integrating Convex with Better Auth,
// as well as helper methods for general use.
export const authComponent = createClient<DataModel, typeof authSchema>(
  components.betterAuth,
  {
    local: {
      schema: authSchema,
    },
    verbose: false,
  }
);

export const createAuth = (
  ctx: GenericCtx<DataModel>,
  { optionsOnly = false }: { optionsOnly?: boolean } = {}
) => {
  return betterAuth({
    // disable logging when createAuth is called just to generate options.
    // this is not required, but there's a lot of noise in logs without it.
    logger: {
      disabled: optionsOnly,
    },
    trustedOrigins: [siteUrl],
    baseURL: siteUrl,
    database: authComponent.adapter(ctx),
    // Configure simple, non-verified email/password to get started
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
      sendResetPassword: async ({ user, url }) => {
        await sendResetPassword(requireActionCtx(ctx), {
          firstName: user.name,
          email: user.email,
          resetUrl: url,
        });
      },
    },
    plugins: [
      // The Convex plugin is required for Convex compatibility
      convex(),
    ],
  } satisfies BetterAuthOptions);
};

// Example function for getting the current user
// Feel free to edit, omit, etc.
export const safeGetUser = async (ctx: QueryCtx) => {
  return authComponent.safeGetAuthUser(ctx);
};

export const getUser = async (ctx: QueryCtx) => {
  return authComponent.getAuthUser(ctx);
};

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return safeGetUser(ctx);
  },
});

export const getUserSession = query({
  args: {},
  handler: async (ctx) => {
    return await createAuth(ctx).api.getSession({
      headers: await headers(),
    });
  },
});
