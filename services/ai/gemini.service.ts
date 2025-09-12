import { GoogleGenerativeAI } from '@google/generative-ai';
import { readFile } from 'fs/promises';
import { cvAnalysisResultSchema, CVAnalysisResultDto } from '@/lib/validation-schemas';

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
// Use the model specified in the environment variables
const modelId = process.env.GEMINI_MODEL_ID || 'gemini-1.5-flash-latest';
const model = genAI.getGenerativeModel({ model: modelId });

// Define the structure for the CV analysis result - REMOVED, will use DTO from validation-schemas
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
  public async analyzeCV(filePath: string): Promise<CVAnalysisResultDto> {
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
        4.  "skills": An array of the top 10 most relevant technical skills (e.g., programming languages, frameworks, databases). If no relevant skills are found, return an empty array [].
        5.  "experienceLevel": Categorize the experience level as "Junior", "Mid-level", "Senior", "Lead", or "Unknown".

        Respond ONLY with a valid JSON object without any markdown formatting (e.g., no \`\`\`json). The "skills" field must always be an array.
      `;

      const result = await model.generateContent([prompt, ...imageParts]);
      const response = await result.response;
      const jsonResponse = response.text().trim();
      
      console.log(`[GeminiService] Step 3: Received response from Gemini.`);
      const cleanedJson = jsonResponse.replace(/```json/g, '').replace(/```/g, '');
      
      const parsedResult = JSON.parse(cleanedJson);
      console.log('[GeminiService] Step 4: Parsed Gemini response.');

      // Validate the parsed result against our canonical schema
      const validatedResult = await cvAnalysisResultSchema.validate(parsedResult, {
        abortEarly: false,
        stripUnknown: true,
      });
      console.log('[GeminiService] Step 5: Validated response against schema successfully.');

      return validatedResult as CVAnalysisResultDto;

    } catch (error) {
      console.error(`[GeminiService] Error analyzing CV with Gemini for file ${filePath}:`, error);
      if (error instanceof Error && error.name === 'ValidationError') {
        throw new Error('AI returned data in an invalid format.');
      }
      throw new Error('Failed to analyze CV using AI.');
    }
  }

  /**
   * Analyzes a raw text of a job posting using the Gemini API.
   * @param text The raw job posting text.
   * @returns A structured JSON object with title, description, and skills.
   */
  public async analyzeJobPostingText(text: string): Promise<{ title: string; description: string; skills: string[] }> {
    try {
      console.log(`[GeminiService] Step 1: Starting job posting text analysis.`);
      
      const prompt = `
        You are an expert HR recruitment assistant specializing in technology roles.
        Analyze the following job posting text and return the result ONLY in a valid JSON format.
        The JSON object must contain these exact keys: "title" (string), "description" (string), and "skills" (an array of strings).

        - For the "title", extract the main job title from the beginning of the text.
        - For the "description", extract the main body of the job posting. Clean it up by removing unnecessary newlines and keeping basic HTML formatting like <p>, <ul>, <li>, and <strong> for readability. The output should be a clean, well-formatted HTML string.
        - For the "skills", extract a list of the most relevant technical skills, technologies, and qualifications mentioned.
        
        If any field cannot be extracted, return it as an empty string or an empty array.
        Do not include any markdown formatting like \`\`\`json in your response.

        Text:
        ---
        ${text}
        ---
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const jsonResponse = response.text().trim();
      
      console.log(`[GeminiService] Step 2: Received response from Gemini.`);
      const cleanedJson = jsonResponse.replace(/```json/g, '').replace(/```/g, '');
      
      const parsedResult = JSON.parse(cleanedJson);
      console.log(`[GeminiService] Step 3: Parsed Gemini response successfully.`);
      
      return parsedResult;

    } catch (error) {
      console.error(`[GeminiService] Error analyzing job posting text:`, error);
      throw new Error('Failed to analyze job posting using AI.');
    }
  }

  /**
   * Performs a semantic analysis to determine the match between a candidate's profile data and a job posting.
   * @param candidateProfileText A string containing a summary of the candidate's profile (summary, skills, etc.).
   * @param jobPostingText The full text content of the job posting.
   * @returns A structured JSON object with the match score and a detailed explanation.
   */
  public async calculateSemanticMatch(
    candidateProfileText: string,
    jobPostingText: string
  ): Promise<{ matchScore: number; matchExplanation: string }> {
    try {
      console.log(`[GeminiService] Starting semantic match calculation.`);

      const prompt = `
        You are an expert HR recruitment assistant specializing in technology roles. Your task is to perform a detailed semantic analysis to determine the compatibility between a candidate's pre-analyzed profile and a job posting.

        Analyze the provided Candidate Profile Summary and the Job Posting Text. Based on your analysis, return a JSON object with two keys:
        1. "matchScore": An integer between 0 and 100 representing the percentage of how well the candidate's experience, skills, and qualifications match the job requirements. Consider factors like years of experience, relevance of technical skills (e.g., Spring Boot is a strong match for a "Java Spring" requirement), and overall profile alignment.
        2. "matchExplanation": A concise, professional paragraph (3-4 sentences) written in Turkish, explaining the rationale behind your score. Highlight the key strengths of the candidate for this role and any potential gaps.

        Do not include any markdown formatting like \`\`\`json in your response. Respond ONLY with the valid JSON object.

        ---
        CANDIDATE PROFILE SUMMARY:
        ${candidateProfileText}
        ---
        JOB POSTING TEXT:
        ${jobPostingText}
        ---
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const jsonResponse = response.text().trim();
      
      const cleanedJson = jsonResponse.replace(/```json/g, '').replace(/```/g, '');
      const parsedResult = JSON.parse(cleanedJson);
      
      // Ensure the correct property names are returned
      if ('explanation' in parsedResult) {
        parsedResult.matchExplanation = parsedResult.explanation;
        delete parsedResult.explanation;
      }

      console.log(`[GeminiService] Semantic match calculated successfully.`);
      return parsedResult;

    } catch (error) {
      console.error(`[GeminiService] Error in semantic match calculation:`, error);
      throw new Error('Failed to calculate semantic match using AI.');
    }
  }
}

// Export a singleton instance of the service
export const geminiService = new GeminiService();
