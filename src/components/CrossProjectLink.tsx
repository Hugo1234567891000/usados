import React from 'react';
import { supabase } from '../lib/supabase';

interface CrossProjectLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function CrossProjectLink({ href, children, className }: CrossProjectLinkProps) {
  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();

    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
      const url = new URL(href);
      url.searchParams.set('access_token', session.access_token);
      url.searchParams.set('refresh_token', session.refresh_token || '');
      window.location.href = url.toString();
    } else {
      window.location.href = href;
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
}
