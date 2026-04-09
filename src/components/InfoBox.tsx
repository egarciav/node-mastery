import { Info, AlertTriangle, Lightbulb, Hexagon, Leaf } from 'lucide-react';

interface InfoBoxProps {
  type?: 'info' | 'warning' | 'tip' | 'express' | 'nest';
  title?: string;
  children: React.ReactNode;
}

const config = {
  info: {
    icon: Info,
    bg: 'bg-accent/10',
    border: 'border-accent/30',
    iconColor: 'text-accent',
    defaultTitle: 'Nota',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-warning/10',
    border: 'border-warning/30',
    iconColor: 'text-warning',
    defaultTitle: 'Importante',
  },
  tip: {
    icon: Lightbulb,
    bg: 'bg-success/10',
    border: 'border-success/30',
    iconColor: 'text-success',
    defaultTitle: 'Tip',
  },
  express: {
    icon: Hexagon,
    bg: 'bg-express/10',
    border: 'border-express/30',
    iconColor: 'text-express',
    defaultTitle: 'Express.js',
  },
  nest: {
    icon: Leaf,
    bg: 'bg-nest/10',
    border: 'border-nest/30',
    iconColor: 'text-nest',
    defaultTitle: 'NestJS',
  },
};

export default function InfoBox({ type = 'info', title, children }: InfoBoxProps) {
  const c = config[type];
  const Icon = c.icon;

  return (
    <div className={`${c.bg} ${c.border} border rounded-xl p-4 my-4`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon size={18} className={c.iconColor} />
        <span className={`font-semibold text-sm ${c.iconColor}`}>
          {title || c.defaultTitle}
        </span>
      </div>
      <div className="text-text-muted text-sm leading-relaxed">{children}</div>
    </div>
  );
}
