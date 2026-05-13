import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  type?: 'user' | 'task' | 'project' | 'notify';
}

export const GlowCard: React.FC<GlowCardProps> = ({ children, className, type }) => {
  return (
    <div 
      className={cn(
        "glow-card", 
        type === 'user' && "card-user",
        type === 'task' && "card-task",
        type === 'project' && "card-project",
        type === 'notify' && "card-notify",
        className
      )}
    >
      {children}
    </div>
  );
};
