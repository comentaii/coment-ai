import { NextRequest } from 'next/server';
import { ResponseHandler } from '@/utils/response-handler';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Check if API key is available
if (!process.env.GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY environment variable is not set');
}

interface QuestionRequest {
  difficulty?: 'easy' | 'medium' | 'hard';
  topic?: string;
  programmingLanguage?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: QuestionRequest = await request.json();
    const { difficulty = 'medium', topic = 'algorithms', programmingLanguage = 'javascript' } = body;

    // Check if API key is available - if not, return a fallback question
    if (!process.env.GEMINI_API_KEY) {
      console.warn('GEMINI_API_KEY is not set, returning fallback question');
      
      const fallbackQuestion = {
        title: "Two Sum",
        description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
        difficulty: difficulty,
        topic: topic,
        constraints: [
          "2 <= nums.length <= 10^4",
          "-10^9 <= nums[i] <= 10^9",
          "-10^9 <= target <= 10^9",
          "Only one valid answer exists."
        ],
        examples: [
          {
            input: [2,7,11,15],
            output: [0,1],
            explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
          },
          {
            input: [3,2,4],
            output: [1,2],
            explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
          }
        ],
        hints: [
          "Try using a hash map to store the values you've seen.",
          "For each number, check if target - number exists in your hash map."
        ],
        starterCode: {
          javascript: "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    // Your code here\n};",
          python: "def twoSum(nums, target):\n    \"\"\"\n    :type nums: List[int]\n    :type target: int\n    :rtype: List[int]\n    \"\"\"\n    # Your code here\n    pass",
          java: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Your code here\n        return new int[0];\n    }\n}"
        },
        testCases: [
          {
            input: [2,7,11,15],
            expectedOutput: [0,1]
          },
          {
            input: [3,2,4],
            expectedOutput: [1,2]
          },
          {
            input: [3,3],
            expectedOutput: [0,1]
          }
        ]
      };
      
      return ResponseHandler.success({
        question: fallbackQuestion
      });
    }
    
    console.log('API: Received request:', { difficulty, topic, programmingLanguage });

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Generate diverse question types based on topic and difficulty
    const questionTypes = {
      algorithms: [
        'array manipulation', 'string processing', 'tree traversal', 'graph algorithms', 
        'dynamic programming', 'sorting and searching', 'two pointers', 'sliding window',
        'backtracking', 'greedy algorithms', 'bit manipulation', 'mathematical problems'
      ],
      'data-structures': [
        'linked lists', 'stacks and queues', 'hash tables', 'binary trees', 'heaps',
        'tries', 'graphs', 'union-find', 'segment trees', 'binary indexed trees'
      ],
      'system-design': [
        'rate limiting', 'caching strategies', 'database design', 'API design',
        'load balancing', 'message queues', 'microservices', 'scalability patterns'
      ]
    };

    const currentTypes = questionTypes[topic as keyof typeof questionTypes] || questionTypes.algorithms;
    const randomType = currentTypes[Math.floor(Math.random() * currentTypes.length)];

    const prompt = `
      You are an expert technical interviewer at a top tech company. Generate a unique, creative, and engaging coding interview question.

      Requirements:
      - Difficulty: ${difficulty}
      - Topic: ${topic}
      - Focus Area: ${randomType}
      - Programming Language: ${programmingLanguage}
      
      Create a question that:
      1. Is DIFFERENT from common leetcode problems (avoid Two Sum, Palindrome, etc.)
      2. Has a real-world application or interesting story
      3. Tests problem-solving skills, not just memorization
      4. Has multiple approaches (brute force, optimized)
      5. Is appropriate for ${difficulty} level interviews

      Difficulty Guidelines:
      - Easy: Basic logic, simple loops, straightforward approach
      - Medium: Requires some algorithmic thinking, optimization, or data structure knowledge
      - Hard: Complex algorithms, multiple concepts combined, advanced optimization

      Please provide ONLY a valid JSON response in this exact format:
      {
        "title": "Creative and descriptive title",
        "description": "Engaging problem description with real-world context. Make it interesting and clear. Include what the function should return.",
        "difficulty": "${difficulty}",
        "topic": "${topic}",
        "constraints": ["realistic constraint 1", "realistic constraint 2", "realistic constraint 3"],
        "examples": [
          {
            "input": "clear example input (use arrays, strings, or objects as appropriate)",
            "output": "expected output",
            "explanation": "step-by-step explanation of why this output is correct"
          },
          {
            "input": "different example showing edge case or different scenario",
            "output": "expected output",
            "explanation": "explanation for this case"
          }
        ],
        "hints": [
          "Strategic hint that guides toward solution without giving it away",
          "Another hint about optimization or alternative approach"
        ],
        "starterCode": {
          "javascript": "function solutionName(param1, param2) {\\n    // Your code here\\n    return result;\\n}",
          "python": "def solution_name(param1, param2):\\n    # Your code here\\n    return result",
          "java": "public class Solution {\\n    public ReturnType solutionName(ParamType param1, ParamType param2) {\\n        // Your code here\\n        return result;\\n    }\\n}"
        },
        "testCases": [
          {
            "input": "test case 1 input",
            "expectedOutput": "expected output 1"
          },
          {
            "input": "test case 2 input",
            "expectedOutput": "expected output 2"
          },
          {
            "input": "edge case input",
            "expectedOutput": "edge case output"
          }
        ]
      }

      IMPORTANT: 
      - Return ONLY valid JSON, no markdown formatting
      - Make the problem unique and interesting
      - Ensure all examples and test cases are correct
      - Use realistic parameter names in starter code
      - Make sure the problem is solvable and well-defined
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to parse the JSON response
    let questionData;
    try {
      // Clean the response text to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        questionData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      // If JSON parsing fails, create a fallback question
      questionData = {
        title: "Two Sum",
        description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
        difficulty: difficulty,
        topic: topic,
        constraints: [
          "2 <= nums.length <= 10^4",
          "-10^9 <= nums[i] <= 10^9",
          "-10^9 <= target <= 10^9",
          "Only one valid answer exists."
        ],
        examples: [
          {
            input: "nums = [2,7,11,15], target = 9",
            output: "[0,1]",
            explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
          }
        ],
        hints: [
          "Try using a hash map to store the values you've seen.",
          "For each number, check if target - number exists in your hash map."
        ],
        starterCode: {
          javascript: "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    // Your code here\n};",
          python: "def twoSum(nums, target):\n    \"\"\"\n    :type nums: List[int]\n    :type target: int\n    :rtype: List[int]\n    \"\"\"\n    # Your code here\n    pass",
          java: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Your code here\n        return new int[0];\n    }\n}"
        },
        testCases: [
          {
            input: "nums = [2,7,11,15], target = 9",
            expectedOutput: "[0,1]"
          },
          {
            input: "nums = [3,2,4], target = 6",
            expectedOutput: "[1,2]"
          }
        ]
      };
    }

    console.log('API: Returning question data:', questionData);
    
    return ResponseHandler.success({
      question: questionData
    });

  } catch (error) {
    console.error('Error generating question:', error);
    return ResponseHandler.error('Failed to generate question');
  }
}
