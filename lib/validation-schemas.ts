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

export type UserSignupFormData = yup.InferType<typeof userSignupSchema>;
export type UserLoginFormData = yup.InferType<typeof userLoginSchema>;
export type CompanySignupFormData = yup.InferType<typeof companySignupSchema>; 