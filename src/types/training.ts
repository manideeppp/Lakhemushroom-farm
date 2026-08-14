export type TrainingFormat = 'online' | 'offline' | 'hybrid';

export interface TrainingModule {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  video_url?: string;
  duration_minutes?: number;
  order: number;
}

export interface TrainingCourse {
  id: string;
  slug: string;
  title: string;
  format: TrainingFormat;
  price: number;
  duration: string;
  image: string;
  short_description: string;
  description: string;
  features: string[];
  outcomes?: string[];
  modules?: TrainingModule[];
  created_at?: string;
}

export interface TrainingProgress {
  user_id: string;
  course_id: string;
  module_id: string;
  completed_at: string;
}
