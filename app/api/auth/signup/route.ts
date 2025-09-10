import { NextRequest } from 'next/server';
import { userSignupSchema } from '@/lib/validation-schemas';
import { userService, companyService } from '@/services/db';
import { connectToDatabase } from '@/lib/db';
import { ResponseHandler } from '@/utils/response-handler';
import { toastMessages } from '@/lib/utils/toast';
import { USER_ROLES } from '@/lib/constants/roles';

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

    // If user has HR Manager or Technical Interviewer role and provided company info, create/check company
    if ((body.roles.includes(USER_ROLES.HR_MANAGER) || body.roles.includes(USER_ROLES.TECHNICAL_INTERVIEWER)) && 
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
      roles: body.roles,
    };

    // Only add companyId if it exists
    if (companyId) {
      userData.companyId = companyId;
    }

    // Create user
    const user = await userService.createUser(userData);

    return ResponseHandler.success({
      message: toastMessages.createSuccess,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        companyId: user.companyId,
      },
    });

  } catch (error: any) {
    console.error('Signup error:', error);
    
    if (error.name === 'ValidationError') {
      return ResponseHandler.error(toastMessages.validationError, 400);
    }

    return ResponseHandler.error(toastMessages.createError, 500);
  }
} 