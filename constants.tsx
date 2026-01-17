
import { TimerTheme } from './types';

export const THEMES: Record<string, TimerTheme> = {
  focus: {
    idle: {
      bg: 'bg-sky-50',
      border: 'border-sky-200',
      text: 'text-sky-700',
      divider: 'bg-sky-200',
      icon: 'text-sky-500'
    },
    active: {
      bg: 'bg-sky-500',
      border: 'border-sky-600',
      text: 'text-white',
      divider: 'bg-white/30',
      icon: 'text-white'
    }
  },
  shortBreak: {
    idle: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-700',
      divider: 'bg-emerald-200',
      icon: 'text-emerald-500'
    },
    active: {
      bg: 'bg-emerald-500',
      border: 'border-emerald-600',
      text: 'text-white',
      divider: 'bg-white/30',
      icon: 'text-white'
    }
  },
  longBreak: {
    idle: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-700',
      divider: 'bg-amber-200',
      icon: 'text-amber-500'
    },
    active: {
      bg: 'bg-amber-500',
      border: 'border-amber-600',
      text: 'text-white',
      divider: 'bg-white/30',
      icon: 'text-white'
    }
  }
};
