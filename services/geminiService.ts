
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateMirthScript = async (inputText: string): Promise<string> => {
  const model = 'gemini-3-pro-preview';

  const prompt = `
    Act as a Lead Health Integration Architect specializing in Mirth Connect.

    Your goal is to write a universal Mirth Connect JavaScript Transformer (Rhino-compatible) that can parse various medical prescription text formats.

    **REQUIREMENTS FOR THE GENERATED SCRIPT:**

    1.  **Input Source**: The script MUST get its input data from Mirth Connect's inbound message using \`var rawData = connectorMessage.getRawData();\`. Do not hardcode the input data.

    2.  **Hospital Agnostic**: The script should treat the first non-empty line of \`rawData\` as the hospital name.

    3.  **Pattern-Based Extraction (Regex)**: The script must use Regular Expressions to robustly extract information. Create helper functions for this.
        *   **Patient ID**: Search for lines containing "Patient ID", "ID", or "MRN". Extract the value that follows.
        *   **Patient Name**: Search for lines containing "Name" or "Patient". Exclude lines that also contain "ID" or "MRN". Extract the value.
        *   **Diagnosis**: Search for lines containing "Rx" or "Diagnosis". Extract the value.
        *   **Demographics**: Search for lines containing "Age" and "Sex" or "Demographics". Parse out the age and gender.

    4.  **Medication Parsing**:
        *   Identify a "Medications" section or lines that start with "Tab.", "Inj.", or a number/bullet point (e.g., "1.", "* ").
        *   For each medication line, parse it into \`name\`, \`dosage\`, \`route\`, and \`frequency\`.
        *   Create a mapping for common frequency shorthands:
            *   OD -> Once a day
            *   BD -> Twice a day
            *   TDS -> Three times a day
            *   QID -> Four times a day
            *   HS -> At bedtime
        *   The final medication list should be an array of objects.

    5.  **Output Structure**:
        *   Create a single JavaScript object named \`fhirResource\` that is inspired by the FHIR \`MedicationRequest\` resource structure.
        *   The patient information should be in a \`subject\` block.
        *   The extracted medications should be in a top-level array property named \`containedMedications\`.
        *   Include other extracted data like \`requester\` (for the Physician) and \`reasonCode\` (for the Diagnosis).

    6.  **Mirth Connect Integration**:
        *   The script must be pure JavaScript compatible with Mirth's Rhino engine (use \`var\`, no \`let\`/\`const\`/arrow functions).
        *   The script MUST conclude with \`channelMap.put('fhirMedicationRequest', JSON.stringify(fhirResource, null, 2));\` to place the final JSON into the channel map.

    **DATA TO USE AS A PARSING EXAMPLE:**
    Use the following text to guide the logic and regex creation. The final script should be generic enough to handle variations but correct for this specific example.
    ---
    ${inputText}
    ---

    **FINAL DELIVERABLE:**
    Provide only the complete, ready-to-use JavaScript code block. Do not include any explanations, comments about the code, or markdown formatting like \`\`\`javascript.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    
    if (!response.text) {
        throw new Error("Received an empty response from the API.");
    }
    
    // Clean up potential markdown code block fences
    let script = response.text.trim();
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
