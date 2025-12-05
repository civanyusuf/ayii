export enum BearMood {
  IDLE = 'idle',
  HAPPY = 'happy',
  SLEEPY = 'sleepy',
}

export interface BearState {
  mood: BearMood;
  eyeScaleY: number;
  mouthShape: 'flat' | 'smile' | 'open';
  headRotation: [number, number, number];
  armRotation: number;
}
