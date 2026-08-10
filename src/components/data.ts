import { Fingerprint, Shield, Target } from 'lucide-react';

export interface ServiceIcon {
  icon: typeof Shield;
}

export const serviceIcons: ServiceIcon[] = [
  { icon: Target },
  { icon: Shield },
  { icon: Fingerprint },
];
