
export enum AppPhase {
  COUNTDOWN = 'COUNTDOWN',
  CONFETTI = 'CONFETTI',
  REVEAL = 'REVEAL'
}

export interface MessageProps {
  onComplete: () => void;
}
