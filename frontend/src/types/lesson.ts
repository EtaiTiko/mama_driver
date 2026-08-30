// Type definitions for lessons and availability

export enum LessonStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  CANCELLED_BY_STUDENT = 'CANCELLED_BY_STUDENT',
  CANCELLED_BY_TEACHER = 'CANCELLED_BY_TEACHER',
  COMPLETED = 'COMPLETED',
  NO_SHOW = 'NO_SHOW',
}

export interface Teacher {
  id: string;
  name: string;
  phone: string;
  rating?: number;
  lessonsCompleted?: number;
  profilePicture?: string;
}

export interface Lesson {
  id: string;
  studentId?: string;
  teacherId: string;
  teacher?: Teacher;
  startTime: Date;
  endTime: Date;
  status: LessonStatus;
  lessonType?: string;
  notes?: string;
  price?: number;
  location?: string;
}

export interface AvailableSlot {
  id: string;
  teacherId: string;
  teacher: Teacher;
  startTime: Date;
  endTime: Date;
  dayOfWeek?: number;
  price?: number;
}

export interface LessonRequest {
  lessonId: string;
  requestedStartTime: Date;
  requestedEndTime: Date;
  lessonType?: string;
  notes?: string;
  preferredTeacherId?: string;
}
