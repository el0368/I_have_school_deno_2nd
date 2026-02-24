// ============================================================================
// Curriculum & Content Types
// ============================================================================

export type GradeLevel =
  | "grade_1"
  | "grade_2"
  | "grade_3"
  | "grade_4"
  | "grade_5"
  | "grade_6"
  | "grade_7"
  | "grade_8"
  | "grade_9"
  | "grade_10"
  | "grade_11"
  | "grade_12"
  | "college"
  | "phd";

export type Subject = "math" | "physics" | "chemistry" | "biology";

export interface Lesson {
  id: string;
  title: string;
  subject: Subject;
  grade: GradeLevel;
  slug: string;
  description: string;
  prerequisites: string[]; // lesson ids
  estimatedMinutes: number;
}

export interface Course {
  id: string;
  title: string;
  subject: Subject;
  grade: GradeLevel;
  lessons: Lesson[];
}

export interface StudentProgress {
  userId: string;
  lessonId: string;
  completed: boolean;
  score: number;
  lastAccessedAt: Date;
}
