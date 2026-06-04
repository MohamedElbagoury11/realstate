import { SellerShell } from '@/components/shells/SellerShell';

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return <SellerShell>{children}</SellerShell>;
}
