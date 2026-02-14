
import { GoogleGenAI } from "@google/genai";
import { Task, Phase, TaskType, ReputationTask, Priority } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const BUSINESS_CONTEXT = `Ești un strateg de elită pentru brandul personal al unui expert în marketing local care ajută saloanele de beauty, spa-urile și studiourile de tattoo să crească cu cel puțin 20% în 90 de zile prin: 
- Design de landing page-uri de conversie.
- Optimizare GBP (Google Business Profile) și SEO local.
- Carduri NFC personalizate pentru colectarea review-urilor.
- Strategie social media și postări statice.
- Comunicate de presă (1-3 per campanie).
- Reclame plătite (Paid Ads).

INSTRUCȚIUNI DE LIMBAJ ȘI TON:
- Răspunde exclusiv în limba română.
- Folosește jargon local românesc autentic.
- Fii direct, strategic și pragmatic.`;

export const getAISuggestion = async (task: Task): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `${BUSINESS_CONTEXT}
      Analizează acest task: "${task.title}". Oferă o sugestie scurtă de conținut educațional (max 25 cuvinte).`,
      config: {
        temperature: 0.75,
        maxOutputTokens: 200,
        thinkingConfig: { thinkingBudget: 100 }
      }
    });
    return response.text?.trim() || "Nu s-a putut genera sugestia.";
  } catch (error) {
    return "Eroare AI.";
  }
};

export const generateNewTaskIdea = async (phase: Phase): Promise<{ title: string; type: TaskType }> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `${BUSINESS_CONTEXT} Generează o idee nouă de task pentru faza "${phase}". Răspunde JSON: {"title": "...", "type": "..."}`,
      config: { responseMimeType: "application/json", temperature: 0.9 }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    return { title: "Postare nouă", type: "Social" };
  }
};

export const generateReputationPulse = async (): Promise<ReputationTask[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `${BUSINESS_CONTEXT}
      Simulează o scanare a calendarului de azi și generează 4 micro-task-uri zilnice pentru reputație.
      Atribuie fiecăruia o prioritate (High, Medium, Low).
      Răspunde DOAR cu un array JSON: [{"title": "...", "priority": "High|Medium|Low"}]`,
      config: { responseMimeType: "application/json", temperature: 0.8 }
    });
    const data = JSON.parse(response.text || "[]");
    return data.map((d: any, i: number) => ({
      id: `rep-${Date.now()}-${i}`,
      title: d.title,
      priority: d.priority || 'Medium',
      completed: false
    }));
  } catch (error) {
    return [];
  }
};

export const editTaskWithAI = async (currentTitle: string, userPrompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `${BUSINESS_CONTEXT}
      Titlu curent: "${currentTitle}".
      Instrucțiune utilizator: "${userPrompt}".
      Rescrie titlul task-ului bazat pe instrucțiune, păstrând focusul pe brand personal și nișa de beauty/tattoo.
      Răspunde DOAR cu noul titlu, scurt și clar.`,
      config: { temperature: 0.7 }
    });
    return response.text?.trim() || currentTitle;
  } catch (error) {
    return currentTitle;
  }
};
