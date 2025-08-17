import { NextRequest } from 'next/server';
import { userSignupSchema } from '@/lib/validation-schemas';
import { UserService } from '@/services/db/user.service';
import { CompanyService } from '@/services/db/company.service';
import { connectToDatabase } from '@/lib/db';
import { ResponseHandler } from '@/utils/response-handler';

const userService = new UserService();
const companyService = new CompanyService();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    await userSignupSchema.validate(body);

    await connectToDatabase();

    // Check if user already exists
    const existingUser = await userService.findByEmail(body.email);
    if (existingUser) {
      return ResponseHandler.error('Bu email adresi zaten kullanımda', 400);
    }

    let companyId: string | undefined = undefined;

    // If user is HR Manager or Technical Interviewer and provided company info, create/check company
    if ((body.role === 'hr_manager' || body.role === 'technical_interviewer') && 
        body.companyName && body.companyEmail) {
      
      // Check if company exists
      let company = await companyService.findByEmail(body.companyEmail);
      
      if (!company) {
        // Create new company
        company = await companyService.createCompany({
          name: body.companyName,
          email: body.companyEmail,
          subscriptionPlan: 'basic',
        });
      }

      companyId = company._id?.toString();
    }

    // Prepare user data
    const userData: any = {
      name: body.name,
      email: body.email,
      password: body.password,
      role: body.role,
    };

    // Only add companyId if it exists
    if (companyId) {
      userData.companyId = companyId;
    }

    // Create user
    const user = await userService.createUser(userData);

    return ResponseHandler.success({
      message: 'Kullanıcı başarıyla oluşturuldu',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
      },
    });

  } catch (error: any) {
    console.error('Signup error:', error);
    
    if (error.name === 'ValidationError') {
      return ResponseHandler.error(error.message, 400);
    }

    return ResponseHandler.error('Kayıt işlemi başarısız', 500);
  }
} 