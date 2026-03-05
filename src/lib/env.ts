const requiredPublicEnv = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabasePublishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
};

const requiredServerEnv = {
  supabaseDbUrl: process.env.SUPABASE_DB_URL,
};

function assertEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const env = {
  supabaseUrl: assertEnv(
    "NEXT_PUBLIC_SUPABASE_URL",
    requiredPublicEnv.supabaseUrl,
  ),
  supabasePublishableKey: assertEnv(
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    requiredPublicEnv.supabasePublishableKey,
  ),
};

export const serverEnv = {
  supabaseDbUrl: assertEnv("SUPABASE_DB_URL", requiredServerEnv.supabaseDbUrl),
};
