import { AppState } from '../core.state';

export const NIGHT_MODE_THEME = 'BLACK-THEME';

export type Language = 'ar' | 'de' | 'en' | 'es' | 'fr' | 'hi' | 'id' | 'pt' | 'pt-br' | 'ru' | 'sw' | 'zh_CN';

export interface SettingsState {
  language: string;
  theme: string;
  autoNightMode: boolean;
  nightTheme: string;
  stickyHeader: boolean;
  pageAnimations: boolean;
  pageAnimationsDisabled: boolean;
  elementsAnimations: boolean;
  hour: number;
}

export interface State extends AppState {
  settings: SettingsState;
}
