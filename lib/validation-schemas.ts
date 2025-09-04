import * as yup from 'yup';

export const userSignupSchema = yup.object({
  name: yup.string().required('İsim gereklidir').min(2, 'İsim en az 2 karakter olmalıdır'),
  email: yup.string().email('Geçerli email giriniz').required('Email gereklidir'),
  password: yup.string().min(6, 'En az 6 karakter').required('Şifre gereklidir'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Şifreler eşleşmiyor')
    .required('Şifre tekrarı gereklidir'),
  role: yup.string()
    .oneOf(['hr_manager', 'technical_interviewer', 'candidate'], 'Geçerli bir rol seçiniz')
    .required('Rol gereklidir'),
  companyName: yup.string().optional(),
  companyEmail: yup.string().email('Geçerli şirket email giriniz').optional(),
});

export const userLoginSchema = yup.object({
  email: yup.string().email('Geçerli email giriniz').required('Email gereklidir'),
  password: yup.string().required('Şifre gereklidir'),
});

export const userSigninSchema = yup.object({
  email: yup.string().email('Geçerli email giriniz').required('Email gereklidir'),
  password: yup.string().required('Şifre gereklidir'),
});

export const companySignupSchema = yup.object({
  name: yup.string().required('Şirket adı gereklidir').min(2, 'Şirket adı en az 2 karakter olmalıdır'),
  email: yup.string().email('Geçerli email giriniz').required('Email gereklidir'),
  domain: yup.string().optional(),
  subscriptionPlan: yup.string()
    .oneOf(['basic', 'premium', 'enterprise'], 'Geçerli bir plan seçiniz')
    .default('basic'),
});

export const createJobPostingSchema = yup.object({
  title: yup.string().required('İlan başlığı zorunludur.').min(5, 'Başlık en az 5 karakter olmalıdır.'),
  description: yup.string().required('İlan açıklaması zorunludur.').min(20, 'Açıklama en az 20 karakter olmalıdır.'),
  skills: yup.array().of(yup.string().required()).min(1, 'En az bir yetenek gereklidir.'),
  linkedinUrl: yup.string().url('Geçerli bir LinkedIn URL\'i giriniz.').optional(),
});

export const updateJobPostingSchema = yup.object({
  title: yup.string().min(5, 'Başlık en az 5 karakter olmalıdır.'),
  description: yup.string().min(20, 'Açıklama en az 20 karakter olmalıdır.'),
  skills: yup.array().of(yup.string().required()).min(1, 'En az bir yetenek gereklidir.'),
  status: yup.string().oneOf(['open', 'closed', 'archived'], 'Geçersiz durum değeri.'),
  linkedinUrl: yup.string().url('Geçerli bir LinkedIn URL\'i giriniz.').optional(),
});


// Interview schemas
export const createInterviewSchema = yup.object({
  candidateId: yup.string().required('Aday seçimi gereklidir'),
  interviewerId: yup.string().required('Mülakatçı seçimi gereklidir'),
  challengeId: yup.string().required('Soru seçimi gereklidir'),
  companyId: yup.string().required('Şirket ID gereklidir'),
  scheduledAt: yup.date().required('Mülakat tarihi gereklidir'),
  notes: yup.string().optional(),
});

export const createInterviewSessionSchema = yup.object({
  jobPostingId: yup.string().required('İş ilanı ID gereklidir'),
  interviewerId: yup.string().required('Mülakatçı ID gereklidir'),
  scheduledDate: yup.string().required('Mülakat tarihi gereklidir'),
  candidateIds: yup.array().of(yup.string().required()).min(1, 'En az bir aday seçilmelidir'),
  notes: yup.string().optional(),
});

export const updateInterviewSchema = yup.object({
  scheduledDate: yup.string().optional(),
  status: yup.string().oneOf(['scheduled', 'active', 'completed', 'cancelled']).optional(),
  notes: yup.string().optional(),
});

// User management schemas
export const loginSchema = yup.object({
  email: yup.string().email('Geçerli email giriniz').required('Email gereklidir'),
  password: yup.string().required('Şifre gereklidir'),
});

export const inviteUserSchema = yup.object({
  email: yup.string().email('Geçerli email giriniz').required('Email gereklidir'),
  name: yup.string().required('İsim gereklidir').min(2, 'İsim en az 2 karakter olmalıdır'),
  role: yup.string()
    .oneOf(['hr_manager', 'technical_interviewer'], 'Geçerli bir rol seçiniz')
    .required('Rol gereklidir'),
});

export const updateUserRolesSchema = yup.object({
  roles: yup.array().of(yup.string().required()).min(1, 'En az bir rol seçilmelidir'),
});

// Interview session schemas (already defined above)

export const updateInterviewSessionSchema = yup.object({
  scheduledDate: yup.string().optional(),
  status: yup.string().oneOf(['scheduled', 'active', 'completed', 'cancelled']).optional(),
  notes: yup.string().optional(),
});

// Type exports
export type UserSignupFormData = yup.InferType<typeof userSignupSchema>;
export type UserLoginFormData = yup.InferType<typeof userLoginSchema>;
export type CompanySignupFormData = yup.InferType<typeof companySignupSchema>;
export type CreateJobPostingDto = yup.InferType<typeof createJobPostingSchema>;
export type UpdateJobPostingDto = yup.InferType<typeof updateJobPostingSchema>;
export type UserSigninFormData = yup.InferType<typeof userSigninSchema>;
export type CreateInterviewDto = yup.InferType<typeof createInterviewSchema>;
export type UpdateInterviewDto = yup.InferType<typeof updateInterviewSchema>;
export type LoginFormData = yup.InferType<typeof loginSchema>;
export type InviteUserDto = yup.InferType<typeof inviteUserSchema>;
export type UpdateUserRolesDto = yup.InferType<typeof updateUserRolesSchema>;
export type CreateInterviewSessionDto = yup.InferType<typeof createInterviewSessionSchema>;
export type UpdateInterviewSessionDto = yup.InferType<typeof updateInterviewSessionSchema>;

// Additional type aliases for backward compatibility
export type InviteUserFormData = InviteUserDto;
export type UpdateUserRolesFormData = UpdateUserRolesDto; 