import { supabase } from './supabase';

export async function generateSSOLink(targetUrl: string): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return targetUrl;
  }

  const url = new URL(targetUrl);
  url.searchParams.set('access_token', session.access_token);
  url.searchParams.set('refresh_token', session.refresh_token);

  return url.toString();
}

export async function navigateWithSSO(targetUrl: string): Promise<void> {
  const ssoUrl = await generateSSOLink(targetUrl);
  window.location.href = ssoUrl;
}
