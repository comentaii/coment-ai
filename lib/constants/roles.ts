export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  HR_MANAGER: 'hr_manager',
  TECHNICAL_INTERVIEWER: 'technical_interviewer',
  CANDIDATE: 'candidate',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export const ROLE_LABELS: Record<UserRole, string> = {
  [USER_ROLES.SUPER_ADMIN]: 'Süper Admin',
  [USER_ROLES.HR_MANAGER]: 'İK Yetkilisi',
  [USER_ROLES.TECHNICAL_INTERVIEWER]: 'Teknik Mülakatçı',
  [USER_ROLES.CANDIDATE]: 'Aday',
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  [USER_ROLES.SUPER_ADMIN]: 'Platform yöneticisi',
  [USER_ROLES.HR_MANAGER]: 'İnsan kaynakları yöneticisi',
  [USER_ROLES.TECHNICAL_INTERVIEWER]: 'Teknik mülakat yürütücüsü',
  [USER_ROLES.CANDIDATE]: 'Mülakat adayı',
};
