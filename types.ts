
export interface ThemeStyle {
  bg: string;
  border: string;
  text: string;
  divider: string;
  icon: string;
}

export interface TimerTheme {
  idle: ThemeStyle;
  active: ThemeStyle;
}

export type TimerState = 'IDLE' | 'RUNNING' | 'PAUSED' | 'FINISHED';

export interface TimerProps {
  label?: string;
  initialMinutes: number;
  theme: TimerTheme;
  isMuted: boolean;
}
