export type UserRole = 'super_admin' | 'hr_manager' | 'technical_interviewer' | 'candidate';

// İzinler (Permissions) şimdilik rollerle aynı olabilir veya daha detaylı olabilir.
// Örnek olarak birkaç detaylı izin ekleyelim.
export type Permission = 
  // Company Management
  | 'manage_companies'
  | 'view_company_dashboard'
  
  // User Management
  | 'manage_users'
  | 'view_users'

  // Candidate Management
  | 'upload_cv'
  | 'view_candidate_list'
  | 'analyze_cv'

  // Interview Management
  | 'schedule_interview'
  | 'conduct_interview'
  | 'view_interview_reports';

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  HR_MANAGER: 'hr_manager',
  TECHNICAL_INTERVIEWER: 'technical_interviewer',
  CANDIDATE: 'candidate',
} as const;

// Rollerin sahip olduğu izinleri tanımlayan bir harita.
export const rolePermissions: Record<UserRole, Permission[]> = {
  super_admin: [
    'manage_companies',
    'view_company_dashboard',
    'manage_users',
    'view_users',
    'upload_cv',
    'view_candidate_list',
    'analyze_cv',
    'schedule_interview',
    'conduct_interview',
    'view_interview_reports',
  ],
  hr_manager: [
    'view_company_dashboard',
    'manage_users', // Sadece kendi şirketindeki kullanıcılar
    'view_users',   // Sadece kendi şirketindeki kullanıcılar
    'upload_cv',
    'view_candidate_list',
    'analyze_cv',
    'schedule_interview',
    'view_interview_reports',
  ],
  technical_interviewer: [
    'view_candidate_list', // Sadece atanmış olanlar
    'conduct_interview',
    'view_interview_reports',
  ],
  candidate: [
    'conduct_interview', // Sadece kendi mülakatı
  ],
};

// Backward compatibility için alias
export const ROLES_PERMISSIONS = rolePermissions;
