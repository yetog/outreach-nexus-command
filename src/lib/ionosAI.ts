// IONOS AI Model Hub Integration

const IONOS_CONFIG = {
  API_KEY: "eyJ0eXAiOiJKV1QiLCJraWQiOiJkZDZkNWExYS00NDY0LTQ0MGEtYjJhMC05NjY0Y2IzNDZiNDYiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJpb25vc2Nsb3VkIiwiaWF0IjoxNzQ4NDgwMjk5LCJjbGllbnQiOiJVU0VSIiwiaWRlbnRpdHkiOnsiaXNQYXJlbnQiOmZhbHNlLCJjb250cmFjdE51bWJlciI6MzM5NzEwMzMsInJvbGUiOiJvd25lciIsInJlZ0RvbWFpbiI6Imlvbm9zLmNvbSIsInJlc2VsbGVySWQiOjEsInV1aWQiOiI3YmNiNzg4MS1hZDMxLTQxMDgtOGI3Zi0wOGIyNjdiYTI0ZWUiLCJwcml2aWxlZ2VzIjpbIkRBVEFfQ0VOVEVSX0NSRUFURSIsIlNOQVBTSE9UX0NSRUFURSIsIklQX0JMT0NLX1JFU0VSVkUiLCJNQU5BR0VfREFUQVBMQVRGT1JNIiwiQUNDRVNTX0FDVElWSVRZX0xPRyIsIlBDQ19DUkVBVEUiLCJBQ0NFU1NfUzNfT0JKRUNUX1NUT1JBR0UiLCJCQUNLVVBfVU5JVF9DUkVBVEUiLCJDUkVBVEVfSU5URVJORVRfQUNDRVNTIiwiSzhTX0NMVVNURVJfQ1JFQVRFIiwiRkxPV19MT0dfQ1JFQVRFIiwiQUNDRVNTX0FORF9NQU5BR0VfTU9OSVRPUklORyIsIkFDQ0VTU19BTkRfTUFOQUdFX0NFUlRJRklDQVRFUyIsIkFDQ0VTU19BTkRfTUFOQUdFX0xPR0dJTkciLCJNQU5BR0VfREJBQVMiLCJBQ0NFU1NfQU5EX01BTkFHRV9ETlMiLCJNQU5BR0VfUkVHSVNUUlkiLCJBQ0NFU1NfQU5EX01BTkFHRV9DRE4iLCJBQ0NFU1NfQU5EX01BTkFHRV9WUE4iLCJBQ0NFU1NfQU5EX01BTkFHRV9BUElfR0FURVdBWSIsIkFDQ0VTU19BTkRfTUFOQUdFX05HUyIsIkFDQ0VTU19BTkRfTUFOQUdFX0tBQVMiLCJBQ0NFU1NfQU5EX01BTkFHRV9ORVRXT1JLX0ZJTEVfU1RPUkFHRSIsIkFDQ0VTU19BTkRfTUFOQUdFX0FJX01PREVMX0hVQiIsIkNSRUFURV9ORVRXT1JLX1NFQ1VSSVRZX0dST1VQUyIsIkFDQ0VTU19BTkRfTUFOQUdFX0lBTV9SRVNPVVJDRVMIXSWIWIBN0cCI6MTc1NjI1NjI5OX0.MWVvOpvWZFsqQSegbv2IowICHBug2IJODqMk9qSKLRkbzBpLf63JtXwhC8jLDzSFUBgg40mXvMMo0s0-AAcalDeCAKDMccWZYzsKuKVfalTAsh0EGhc8aegs53zXX75MYx02pBddAb2pXrQ96sOknoyffekiM0vufIkD39Rj92gXAUStt7BPjTor1eCqs48BPvHjVojdE_tVJZg5kYAq5f_nAKTT3yDj1_2CQQdtrUZVI_FY8yl5Q_0DyN4oASNDsALhIv2wr49V2dvb9EB-AqIO1TndgkyZxH66Isnz2zJ2BA1tWgSMGTnXAQXNQ5O8qXq0gq97xDoqMjVEk9TahA",
  CHAT_MODEL_ID: "meta-llama/llama-3.1-8b-instruct",
  CHAT_COMPLETION_URL: "https://openai.inference.de-txl.ionos.com/v1/chat/completions",
};

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
}

export interface ChatCompletionResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export const ionosAI = {
  async chatCompletion(messages: ChatMessage[], options?: { temperature?: number; max_tokens?: number }): Promise<string> {
    const request: ChatCompletionRequest = {
      model: IONOS_CONFIG.CHAT_MODEL_ID,
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.max_tokens ?? 1000,
    };

    try {
      const response = await fetch(IONOS_CONFIG.CHAT_COMPLETION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${IONOS_CONFIG.API_KEY}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`IONOS AI API error: ${response.status} - ${error}`);
      }

      const data: ChatCompletionResponse = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('IONOS AI error:', error);
      throw error;
    }
  },

  // Helper: Generate email CTA (subject + body)
  async generateEmailCTA(context: { recipientName?: string; company?: string; goal: string }): Promise<{ subject: string; body: string }> {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: 'You are an expert sales copywriter. Generate compelling email subject lines and body copy for cold outreach.',
      },
      {
        role: 'user',
        content: `Generate a professional cold email with:
Recipient: ${context.recipientName || 'prospect'}
Company: ${context.company || 'their company'}
Goal: ${context.goal}

Return ONLY in this exact format:
SUBJECT: [subject line]
BODY: [email body]`,
      },
    ];

    const result = await this.chatCompletion(messages, { temperature: 0.8 });
    
    const subjectMatch = result.match(/SUBJECT:\s*(.+?)(?=\nBODY:)/s);
    const bodyMatch = result.match(/BODY:\s*(.+)/s);
    
    return {
      subject: subjectMatch?.[1]?.trim() || 'Quick question',
      body: bodyMatch?.[1]?.trim() || result,
    };
  },

  // Helper: Summarize call transcript
  async summarizeCallTranscript(transcript: string): Promise<{ summary: string; actionItems: string[] }> {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: 'You are an expert at analyzing sales calls. Provide concise summaries and actionable next steps.',
      },
      {
        role: 'user',
        content: `Analyze this call transcript and provide:
1. A brief summary (2-3 sentences)
2. Action items (3-5 bullet points)

Transcript:
${transcript}

Return in format:
SUMMARY: [summary]
ACTIONS:
- [action 1]
- [action 2]`,
      },
    ];

    const result = await this.chatCompletion(messages, { max_tokens: 500 });
    
    const summaryMatch = result.match(/SUMMARY:\s*(.+?)(?=\nACTIONS:)/s);
    const actionsMatch = result.match(/ACTIONS:\s*(.+)/s);
    
    const summary = summaryMatch?.[1]?.trim() || result;
    const actionItems = actionsMatch?.[1]
      ?.split('\n')
      ?.filter(line => line.trim().startsWith('-'))
      ?.map(line => line.replace(/^-\s*/, '').trim()) || [];

    return { summary, actionItems };
  },

  // Helper: Generate insights/nudges
  async generateInsights(context: { recentActivity: string; goals: string }): Promise<string[]> {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: 'You are a sales coach providing actionable insights and nudges based on activity data.',
      },
      {
        role: 'user',
        content: `Based on this activity data, provide 3-5 specific, actionable nudges:

Recent Activity:
${context.recentActivity}

Goals:
${context.goals}

Return as numbered list.`,
      },
    ];

    const result = await this.chatCompletion(messages, { temperature: 0.7, max_tokens: 300 });
    
    return result
      .split('\n')
      .filter(line => /^\d+\./.test(line.trim()))
      .map(line => line.replace(/^\d+\.\s*/, '').trim());
  },
};
