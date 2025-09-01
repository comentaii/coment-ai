import { USER_ROLES } from "@/lib/constants";

// Projedeki tüm rolleri UserRole tipi olarak tanımlıyoruz.
export type UserRole = keyof typeof USER_ROLES;

// Rol-izin eşlemesini tanımlayan nesne. Bu, projenin yetki matrisidir.
export const ROLES_PERMISSIONS: Record<UserRole, Permission[]> = {
  super_admin: [
    'manage_companies', 'manage_users', 'view_all_statistics', 'manage_settings'
  ],
  hr_manager: [
    'manage_candidates', 'manage_interviews', 'view_company_statistics', 'manage_challenges'
  ],
  technical_interviewer: [
    'conduct_interview', 'view_assigned_interviews'
  ],
  candidate: [
    'attend_interview'
  ],
  guest: [],
};

// Tüm izinleri tek bir tipte birleştiriyoruz.
export type Permission = 
  | 'manage_companies'
  | 'manage_users'
  | 'view_all_statistics'
  | 'manage_settings'
  | 'manage_candidates'
  | 'manage_interviews'
  | 'view_company_statistics'
  | 'manage_challenges'
  | 'conduct_interview'
  | 'view_assigned_interviews'
  | 'attend_interview';
