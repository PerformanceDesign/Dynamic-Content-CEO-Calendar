
export enum Phase {
  TRAFFIC = 'Traffic (Hook)',
  HOLDING = 'Holding Pattern (Nurture)',
  SELLING = 'Selling Event (Conversion)',
  OUTCOMES = 'Outcomes (Result)'
}

export type TaskType = 'Organic' | 'Paid' | 'Social' | 'Newsletter' | 'Podcast' | 'Ad' | 'Webinar';
export type Priority = 'High' | 'Medium' | 'Low';

export interface Task {
  id: string;
  title: string;
  phase: Phase;
  type: TaskType;
  isAIEnabled: boolean;
  nurtureType?: 'Value' | 'Promotion';
  newHook?: string;
  status?: 'Pending' | 'Success' | 'Failure';
  aiSuggestion?: string;
  lastUpdated: number;
}

export interface ReputationTask {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
}
