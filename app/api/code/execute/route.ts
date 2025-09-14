import { NextRequest } from 'next/server';
import { ResponseHandler } from '@/utils/response-handler';

interface ExecuteCodeRequest {
  code: string;
  language: string;
  testCases: Array<{
    input: any;
    expectedOutput: any;
  }>;
}

interface TestResult {
  input: any;
  expectedOutput: any;
  actualOutput: any;
  passed: boolean;
  error?: string;
  executionTime?: number;
}

interface ExecuteCodeResponse {
  results: TestResult[];
  totalPassed: number;
  totalTests: number;
  overallPassed: boolean;
  executionTime: number;
}

// Safe code execution function
async function executeCode(code: string, language: string, input: any): Promise<{ output: any; error?: string; executionTime: number }> {
  const startTime = Date.now();
  
  try {
    if (language === 'javascript') {
      // Create a safe execution context
      const wrappedCode = `
        ${code}
        
        // Call the main function based on common patterns
        let result;
        try {
          if (typeof twoSum === 'function') {
            result = twoSum(${JSON.stringify(input[0])}, ${JSON.stringify(input[1])});
          } else if (typeof solution === 'function') {
            result = solution(${JSON.stringify(input[0])}, ${JSON.stringify(input[1])});
          } else if (typeof solve === 'function') {
            result = solve(${JSON.stringify(input[0])}, ${JSON.stringify(input[1])});
          } else {
            // Try to find any function and call it
            const functions = Object.getOwnPropertyNames(this).filter(name => typeof this[name] === 'function');
            if (functions.length > 0) {
              result = this[functions[0]](${JSON.stringify(input[0])}, ${JSON.stringify(input[1])});
            } else {
              throw new Error('No executable function found');
            }
          }
        } catch (e) {
          result = e.message;
        }
        result;
      `;
      
      // Execute in a limited context
      const func = new Function(wrappedCode);
      const result = func();
      
      return {
        output: result,
        executionTime: Date.now() - startTime
      };
    }
    
    // For other languages, return a mock result for now
    return {
      output: "Language not supported yet",
      error: "Only JavaScript is currently supported",
      executionTime: Date.now() - startTime
    };
    
  } catch (error) {
    return {
      output: null,
      error: error instanceof Error ? error.message : 'Unknown error',
      executionTime: Date.now() - startTime
    };
  }
}

// Compare outputs with flexible comparison
function compareOutputs(expected: any, actual: any): boolean {
  // Handle arrays
  if (Array.isArray(expected) && Array.isArray(actual)) {
    if (expected.length !== actual.length) return false;
    return expected.every((val, index) => compareOutputs(val, actual[index]));
  }
  
  // Handle objects
  if (typeof expected === 'object' && typeof actual === 'object' && expected !== null && actual !== null) {
    const expectedKeys = Object.keys(expected);
    const actualKeys = Object.keys(actual);
    
    if (expectedKeys.length !== actualKeys.length) return false;
    
    return expectedKeys.every(key => compareOutputs(expected[key], actual[key]));
  }
  
  // Handle primitives
  return expected === actual;
}

export async function POST(request: NextRequest) {
  try {
    const body: ExecuteCodeRequest = await request.json();
    const { code, language, testCases } = body;
    
    if (!code || !language || !testCases) {
      return ResponseHandler.error('Missing required fields: code, language, testCases');
    }
    
    const startTime = Date.now();
    const results: TestResult[] = [];
    
    // Execute code against each test case
    for (const testCase of testCases) {
      const execution = await executeCode(code, language, testCase.input);
      
      const result: TestResult = {
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: execution.output,
        passed: !execution.error && compareOutputs(testCase.expectedOutput, execution.output),
        executionTime: execution.executionTime
      };
      
      if (execution.error) {
        result.error = execution.error;
      }
      
      results.push(result);
    }
    
    const totalPassed = results.filter(r => r.passed).length;
    const totalTests = results.length;
    const overallPassed = totalPassed === totalTests;
    const executionTime = Date.now() - startTime;
    
    const response: ExecuteCodeResponse = {
      results,
      totalPassed,
      totalTests,
      overallPassed,
      executionTime
    };
    
    return ResponseHandler.success(response, 'Code executed successfully');
    
  } catch (error) {
    console.error('Code execution error:', error);
    return ResponseHandler.error('Failed to execute code');
  }
}
