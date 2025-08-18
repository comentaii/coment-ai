import { GoogleGenerativeAI } from '@google/generative-ai';
import { readFile } from 'fs/promises';

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
// Use the model specified in the environment variables
const modelId = process.env.GEMINI_MODEL_ID || 'gemini-1.5-flash-latest';
const model = genAI.getGenerativeModel({ model: modelId });

// Define the structure for the CV analysis result
interface CVAnalysisResult {
  summary: string;
  skills: string[];
  experienceLevel: 'Junior' | 'Mid-level' | 'Senior' | 'Lead' | 'Unknown';
  fullName?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
  };
}

// Helper function to convert file to base64
async function fileToGenerativePart(path: string, mimeType: string) {
    const data = await readFile(path, { encoding: "base64" });
    return {
      inlineData: {
        data,
        mimeType
      },
    };
  }

class GeminiService {
  /**
   * Analyzes a CV PDF file directly using the Gemini API.
   * @param filePath The absolute path to the CV PDF file.
   * @returns A structured JSON object with the analysis results.
   */
  public async analyzeCV(filePath: string): Promise<CVAnalysisResult> {
    try {
      console.log(`[GeminiService] Step 1: Converting PDF to base64 for file: ${filePath}`);
      const imageParts = [
        await fileToGenerativePart(filePath, "application/pdf"),
      ];
      console.log(`[GeminiService] Step 2: PDF converted successfully. Sending to Gemini.`);

      const prompt = `
        You are an expert HR recruitment assistant specializing in technology roles. 
        Analyze the content of the following CV PDF file and extract the information in a structured JSON format.

        Based on the file content, provide the following details:
        1.  "fullName": The full name of the candidate.
        2.  "contactInfo": An object with "email" and "phone" number if available.
        3.  "summary": A concise 2-3 sentence summary of the candidate's professional profile.
        4.  "skills": An array of the top 10 most relevant technical skills.
        5.  "experienceLevel": Categorize the experience level as "Junior", "Mid-level", "Senior", "Lead", or "Unknown".

        Respond ONLY with a valid JSON object without any markdown formatting (e.g., no \`\`\`json).
      `;

      const result = await model.generateContent([prompt, ...imageParts]);
      const response = await result.response;
      const jsonResponse = response.text().trim();
      
      console.log(`[GeminiService] Step 3: Received response from Gemini.`);
      const cleanedJson = jsonResponse.replace(/```json/g, '').replace(/```/g, '');
      
      const parsedResult: CVAnalysisResult = JSON.parse(cleanedJson);
      console.log(`[GeminiService] Step 4: Parsed Gemini response successfully.`);
      
      return parsedResult;

    } catch (error) {
      console.error(`[GeminiService] Error analyzing CV with Gemini for file ${filePath}:`, error);
      throw new Error('Failed to analyze CV using AI.');
    }
  }
}

// Export a singleton instance of the service
export const geminiService = new GeminiService();
