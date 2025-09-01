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


export type UserSignupFormData = yup.InferType<typeof userSignupSchema>;
export type UserLoginFormData = yup.InferType<typeof userLoginSchema>;
export type CompanySignupFormData = yup.InferType<typeof companySignupSchema>;
export type CreateJobPostingDto = yup.InferType<typeof createJobPostingSchema>;
export type UpdateJobPostingDto = yup.InferType<typeof updateJobPostingSchema>; 