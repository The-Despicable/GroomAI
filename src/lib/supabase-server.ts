import { createSupabaseContext, type SupabaseContext, type WithSupabaseConfig } from '@supabase/server'

export type { SupabaseContext }

function getSupabaseEnv(): Partial<import('@supabase/server').SupabaseEnv> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY
  const secretKey = process.env.SUPABASE_SECRET_KEY
  const jwksUrl = process.env.SUPABASE_JWKS_URL

  if (!url || !publishableKey) return {}

  return {
    url,
    publishableKeys: { default: publishableKey },
    ...(secretKey ? { secretKeys: { default: secretKey } } : {}),
    ...(jwksUrl ? { jwksUrl } : {}),
  }
}

export async function createServerClient(
  request: Request,
  options?: Partial<WithSupabaseConfig>
): Promise<{ data: SupabaseContext<any>; error: null } | { data: null; error: Error | null }> {
  const env = getSupabaseEnv()
  if (!env.url || !env.publishableKeys) {
    return { data: null, error: null }
  }

  try {
    const result = await createSupabaseContext<any>(request, {
      auth: 'publishable',
      env,
      cors: false,
      ...options,
    })
    return result
  } catch (e) {
    return { data: null, error: e as Error }
  }
}

export async function createAdminClient(
  request: Request,
): Promise<{ data: SupabaseContext<any>; error: null } | { data: null; error: Error | null }> {
  const env = getSupabaseEnv()
  if (!env.url || !env.secretKeys) {
    return { data: null, error: null }
  }

  try {
    const result = await createSupabaseContext<any>(request, {
      auth: 'secret',
      env,
      cors: false,
    })
    return result
  } catch (e) {
    return { data: null, error: e as Error }
  }
}
