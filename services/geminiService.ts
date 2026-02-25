
import Groq from "groq-sdk";

const API_KEY = process.env.GROQ_API_KEY;

if (!API_KEY) {
  throw new Error("GROQ_API_KEY environment variable not set");
}

const groq = new Groq({ apiKey: API_KEY, dangerouslyAllowBrowser: true });

export const generateMirthScript = async (inputText: string): Promise<string> => {
  const model = 'llama-3.3-70b-versatile';

  const prompt = `
    Context: You are a medical data generator for a Mirth Connect integration.

    Task: Generate ${inputText || '10'} unique synthetic prescriptions.

    Output Requirements (CRITICAL):

    Format: Provide the output as a single minified JSON array. Do not include markdown code blocks (\`\`\`json), preamble, or explanations.

    Structure: Each object must contain: patient_name, dob, medication, dosage, frequency, and icd_10_code.

    Validation: Ensure all dates are in YYYY-MM-DD format.

    Efficiency: Combine all prescriptions into this single response to minimize API calls.

    Error Prevention: If you cannot fulfill a specific field, use "N/A" rather than leaving it null to prevent 404/mapping errors in the Mirth "brain" transformer.
  `;

  try {
    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: model,
    });

    let script = response.choices[0]?.message?.content || "";
    if (!script) {
      throw new Error("Received an empty response from the API.");
    }

    // Clean up potential markdown code block fences
    script = script.trim();
    if (script.startsWith('```javascript')) {
      script = script.substring('```javascript'.length);
    } else if (script.startsWith('```')) {
      script = script.substring(3);
    }
    if (script.endsWith('```')) {
      script = script.substring(0, script.length - 3);
    }

    return script.trim();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate script. Please check the console for more details.");
  }
};
