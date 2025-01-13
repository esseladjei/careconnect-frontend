'use client';
import useAutoLogout from '../hooks/autoLogout';
export default function AutoLogoutWrapper({ children }: Readonly<{ children: React.ReactNode; }>) {
  useAutoLogout();
  return <>{children}</>;
}
