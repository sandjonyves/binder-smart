export interface Course {
  id: string;
  name: string;
  units: Unit[];
}

export interface Unit {
  id: string;
  name: string;
  files: File[];
}

export interface File {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'image';
  size: string;
  date: string;
  course: string;
}

export interface Theme {
  isDarkMode: boolean;
  isSystemTheme: boolean;
}

export interface NotificationSettings {
  pushNotifications: boolean;
  emailNotifications: boolean;
}

export interface SearchResult {
  title: string;
  subtitle: string;
  date: string;
  id: string;
} 