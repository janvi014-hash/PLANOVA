
import { GoogleGenAI, Type } from "@google/genai";
import { Task, Category, Priority, TaskStatus } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  async getDailyQuote(): Promise<string> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Generate a short, powerful motivational quote for a person starting their day. Return just the quote and the author.",
    });
    return response.text || "Believe you can and you're halfway there. - Theodore Roosevelt";
  },

  async breakdownTask(task: string): Promise<string[]> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Break down the following task into 5-7 clear, actionable sub-tasks: "${task}". Return as a simple JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    try {
      return JSON.parse(response.text || '[]');
    } catch (e) {
      return ["Start initial research", "Outline key points", "Execute first draft", "Review and refine", "Complete final task"];
    }
  },

  async summarizeJournal(content: string, learnings: string): Promise<string> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Summarize the following daily reflection and learnings into a concise, encouraging paragraph: 
      Reflection: ${content}
      Learnings: ${learnings}`,
    });
    return response.text || "A productive day of growth and reflection!";
  },

  async getYouTubeSuggestions(tasks: Task[]): Promise<any[]> {
    const activeTasks = tasks.filter(t => t.status !== TaskStatus.COMPLETED).slice(0, 5);
    const taskContext = activeTasks.map(t => `${t.title} (${t.category})`).join(", ");
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on these active tasks: [${taskContext}], suggest exactly 4 high-quality YouTube video titles and channels. Return as a JSON array of objects with title, channelName, duration, and searchUrl.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              channelName: { type: Type.STRING },
              duration: { type: Type.STRING },
              searchUrl: { type: Type.STRING }
            },
            required: ["title", "channelName", "duration", "searchUrl"]
          }
        }
      }
    });
    try {
      return JSON.parse(response.text || '[]');
    } catch (e) {
      return [];
    }
  },

  async optimizeDay(date: string, tasks: Task[]): Promise<string> {
    const taskList = tasks.map(t => `- ${t.title} (${t.priority}, ${t.category})`).join('\n');
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `For the date ${date}, here are the tasks:
      ${taskList}
      Give a very brief "AI Strategy" (max 2 sentences) on how to tackle this day effectively.`,
    });
    return response.text || "Tackle your high-priority items first while your energy is peak.";
  },

  /**
   * Suggests a new task for an empty day based on user context.
   */
  async suggestTask(existingTasks: Task[]): Promise<{ title: string; category: Category; priority: Priority }> {
    const taskContext = existingTasks.map(t => t.title).join(", ");
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on a user's previous tasks: [${taskContext}], suggest ONE highly relevant, productive new task they should do on an empty day. Return as a JSON object with title, category (one of: Work, Study, Personal, Health), and priority (one of: Low, Medium, High).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            category: { type: Type.STRING },
            priority: { type: Type.STRING }
          },
          required: ["title", "category", "priority"]
        }
      }
    });
    try {
      return JSON.parse(response.text || '{}');
    } catch (e) {
      return { title: "Plan upcoming week", category: Category.PERSONAL, priority: Priority.MEDIUM };
    }
  }
};
