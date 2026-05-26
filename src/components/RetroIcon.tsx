import { 
  Terminal, 
  Brain, 
  Shield, 
  Cpu, 
  Database, 
  Globe, 
  Sparkles, 
  Briefcase, 
  Radio, 
  Zap, 
  Settings, 
  Building, 
  Activity, 
  FlaskConical, 
  TrendingUp, 
  HardDrive,
  Scissors,
  LucideIcon
} from 'lucide-react';

interface RetroIconProps {
  name: string;
  className?: string;
  size?: number;
  color?: string;
}

const iconMap: Record<string, LucideIcon> = {
  'terminal': Terminal,
  'brain': Brain,
  'shield': Shield,
  'cpu': Cpu,
  'database': Database,
  'globe': Globe,
  'sparkles': Sparkles,
  'briefcase': Briefcase,
  'radio': Radio,
  'zap': Zap,
  'settings': Settings,
  'building': Building,
  'activity': Activity,
  'flask': FlaskConical,
  'trending-up': TrendingUp,
  'hard-drive': HardDrive,
  'scissors': Scissors
};

export default function RetroIcon({ name, className = '', size = 24, color = 'currentColor' }: RetroIconProps) {
  const IconComponent = iconMap[name] || Terminal;
  return (
    <div className={`p-2 bg-neutral-900 border-2 border-current rounded-sm flex items-center justify-center shadow-[2px_2px_0px_0px_currentColor] select-none ${className}`}>
      <IconComponent size={size} color={color} className="stroke-[2.5]" />
    </div>
  );
}
