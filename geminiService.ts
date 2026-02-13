
import { Task, Category, Priority, TaskStatus } from "./types";

// Mock Gemini Service - AI features disabled
export const geminiService = {
  async getDailyQuote(): Promise<string> {
    console.log("Mocking getDailyQuote");
    return "Believe you can and you're halfway there. - Theodore Roosevelt";
  },

  async breakdownTask(task: string): Promise<string[]> {
    console.log("Mocking breakdownTask for:", task);
    return ["Start initial research", "Outline key points", "Execute first draft", "Review and refine", "Complete final task"];
  },

  async summarizeJournal(content: string, learnings: string): Promise<string> {
    console.log("Mocking summarizeJournal");
    return "A productive day of growth and reflection!";
  },

  async getYouTubeSuggestions(tasks: Task[]): Promise<any[]> {
    console.log("Mocking getYouTubeSuggestions");
    return [
      {
        title: "Productivity Hacks for Developers",
        channelName: "Tech Productivity",
        duration: "10:05",
        searchUrl: "https://www.youtube.com/results?search_query=productivity+hacks"
      },
      {
        title: "lofi hip hop radio - beats to relax/study to",
        channelName: "Lofi Girl",
        duration: "LIVE",
        searchUrl: "https://www.youtube.com/results?search_query=lofi+girl"
      },
      {
        title: "Understanding TypeScript Generics",
        channelName: "Code Academy",
        duration: "15:30",
        searchUrl: "https://www.youtube.com/results?search_query=typescript+generics"
      },
      {
        title: "Morning Yoga for Focus",
        channelName: "Yoga With Adriene",
        duration: "20:00",
        searchUrl: "https://www.youtube.com/results?search_query=yoga+for+focus"
      }
    ];
  },

  async optimizeDay(date: string, tasks: Task[]): Promise<string> {
    console.log("Mocking optimizeDay for:", date);
    return "Tackle your high-priority items first while your energy is peak.";
  },

  /**
   * Suggests a new task for an empty day based on user context.
   */
  async suggestTask(existingTasks: Task[]): Promise<{ title: string; category: Category; priority: Priority }> {
    console.log("Mocking suggestTask");
    return { title: "Plan upcoming week", category: Category.PERSONAL, priority: Priority.MEDIUM };
  },

  /**
   * Generates a daily schedule/workflow for a project based on the due date.
   */
  async generateSchedule(taskTitle: string, startDate: Date, dueDate: Date): Promise<any[]> {
    console.log(`Mocking generateSchedule for: ${taskTitle}`);

    // Generate a simple mock schedule
    const days = Math.ceil((dueDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const schedule = [];

    for (let i = 0; i < Math.min(days, 5); i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      schedule.push({
        title: `Work on ${taskTitle} - Phase ${i + 1}`,
        date: date.toISOString(),
        category: Category.WORK,
        priority: Priority.MEDIUM
      });
    }

    return schedule;
  }
};
