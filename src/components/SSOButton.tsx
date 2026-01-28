import { navigateWithSSO } from '../lib/sso';

interface SSOButtonProps {
  targetUrl: string;
  children: React.ReactNode;
  className?: string;
}

export function SSOButton({ targetUrl, children, className = '' }: SSOButtonProps) {
  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    await navigateWithSSO(targetUrl);
  };

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
}

interface SSOLinkProps {
  targetUrl: string;
  children: React.ReactNode;
  className?: string;
}

export function SSOLink({ targetUrl, children, className = '' }: SSOLinkProps) {
  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    await navigateWithSSO(targetUrl);
  };

  return (
    <a href={targetUrl} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
