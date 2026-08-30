import { useState, useEffect } from 'react';
import { Lesson, AvailableSlot, LessonStatus, Teacher } from '../types/lesson';

// Single teacher mock data - will be replaced with real API calls
const MOCK_TEACHER: Teacher = {
  id: '1',
  name: 'דוד כהן',
  phone: '+972-50-1234567',
  rating: 4.8,
  lessonsCompleted: 156,
};

const LESSON_PRICE = 150; // Constant price for all lessons

const generateMockAvailableSlots = (): AvailableSlot[] => {
  const slots: AvailableSlot[] = [];
  const today = new Date();

  for (let daysAhead = 1; daysAhead <= 30; daysAhead++) {
    const slotDate = new Date(today);
    slotDate.setDate(slotDate.getDate() + daysAhead);

    // Morning slot (09:00-10:00)
    const morningSlot: AvailableSlot = {
      id: `slot-${daysAhead}-morning`,
      teacherId: MOCK_TEACHER.id,
      teacher: MOCK_TEACHER,
      startTime: new Date(slotDate.getFullYear(), slotDate.getMonth(), slotDate.getDate(), 9, 0, 0),
      endTime: new Date(slotDate.getFullYear(), slotDate.getMonth(), slotDate.getDate(), 10, 0, 0),
      price: LESSON_PRICE,
    };
    slots.push(morningSlot);

    // Afternoon slot (15:00-16:00)
    const afternoonSlot: AvailableSlot = {
      id: `slot-${daysAhead}-afternoon`,
      teacherId: MOCK_TEACHER.id,
      teacher: MOCK_TEACHER,
      startTime: new Date(slotDate.getFullYear(), slotDate.getMonth(), slotDate.getDate(), 15, 0, 0),
      endTime: new Date(slotDate.getFullYear(), slotDate.getMonth(), slotDate.getDate(), 16, 0, 0),
      price: LESSON_PRICE,
    };
    slots.push(afternoonSlot);
  }

  return slots;
};

const generateMockStudentLessons = (): Lesson[] => {
  const today = new Date();
  return [
    {
      id: 'lesson-1',
      studentId: 'current-student',
      teacherId: MOCK_TEACHER.id,
      teacher: MOCK_TEACHER,
      startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 9, 0, 0),
      endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 10, 0, 0),
      status: LessonStatus.ACCEPTED,
      lessonType: 'נסיעה בעיר',
      price: LESSON_PRICE,
    },
    {
      id: 'lesson-2',
      studentId: 'current-student',
      teacherId: MOCK_TEACHER.id,
      teacher: MOCK_TEACHER,
      startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5, 15, 0, 0),
      endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5, 16, 0, 0),
      status: LessonStatus.PENDING,
      lessonType: 'נסיעה בכביש מהיר',
      price: LESSON_PRICE,
    },
  ];
};

export const useLessons = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch student's lessons
  const fetchMyLessons = async () => {
    setLoading(true);
    try {
      // TODO: Replace with real API call
      // const response = await fetch('/api/lessons/my-lessons');
      // const data = await response.json();
      // setLessons(data);
      
      setLessons(generateMockStudentLessons());
      setError(null);
    } catch (err) {
      setError('Failed to fetch lessons');
    } finally {
      setLoading(false);
    }
  };

  // Fetch available slots for booking
  const fetchAvailableSlots = async () => {
    setLoading(true);
    try {
      // TODO: Replace with real API call
      // const response = await fetch('/api/lessons/available-slots');
      // const data = await response.json();
      // setAvailableSlots(data);
      
      setAvailableSlots(generateMockAvailableSlots());
      setError(null);
    } catch (err) {
      setError('Failed to fetch available slots');
    } finally {
      setLoading(false);
    }
  };

  // Request a lesson
  const requestLesson = async (slotId: string, notes?: string) => {
    try {
      // TODO: Replace with real API call
      // const response = await fetch('/api/lessons/request', {
      //   method: 'POST',
      //   body: JSON.stringify({ slotId, notes }),
      // });
      // if (!response.ok) throw new Error('Failed to request lesson');
      // const newLesson = await response.json();
      // setLessons([...lessons, newLesson]);
      
      const slot = availableSlots.find(s => s.id === slotId);
      if (!slot) throw new Error('Slot not found');

      // Remove the slot from available slots (mark as booked)
      setAvailableSlots(availableSlots.filter(s => s.id !== slotId));

      const newLesson: Lesson = {
        id: `lesson-${Date.now()}`,
        studentId: 'current-student',
        teacherId: slot.teacherId,
        teacher: slot.teacher,
        startTime: slot.startTime,
        endTime: slot.endTime,
        status: LessonStatus.PENDING,
        notes,
        price: LESSON_PRICE,
      };
      setLessons([...lessons, newLesson]);
      return newLesson;
    } catch (err) {
      throw err;
    }
  };

  // Cancel a lesson
  const cancelLesson = async (lessonId: string, reason?: string) => {
    try {
      // TODO: Replace with real API call
      // const response = await fetch(`/api/lessons/${lessonId}/cancel`, {
      //   method: 'POST',
      //   body: JSON.stringify({ reason }),
      // });
      // if (!response.ok) throw new Error('Failed to cancel lesson');
      
      setLessons(
        lessons.map(l =>
          l.id === lessonId
            ? { ...l, status: LessonStatus.CANCELLED_BY_STUDENT, notes: reason }
            : l
        )
      );
    } catch (err) {
      throw err;
    }
  };

  // Get next upcoming lesson
  const getNextLesson = (): Lesson | undefined => {
    const now = new Date();
    return lessons
      .filter(l => l.startTime > now && l.status !== LessonStatus.CANCELLED_BY_STUDENT)
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())[0];
  };

  // Get stats
  const getLessonStats = () => {
    const completed = lessons.filter(l => l.status === LessonStatus.COMPLETED).length;
    const pending = lessons.filter(l => l.status === LessonStatus.PENDING).length;
    const accepted = lessons.filter(l => l.status === LessonStatus.ACCEPTED).length;
    const cancelled = lessons.filter(
      l =>
        l.status === LessonStatus.CANCELLED_BY_STUDENT ||
        l.status === LessonStatus.CANCELLED_BY_TEACHER
    ).length;

    return { completed, pending, accepted, cancelled };
  };

  useEffect(() => {
    fetchMyLessons();
    fetchAvailableSlots();
  }, []);

  return {
    lessons,
    availableSlots,
    loading,
    error,
    fetchMyLessons,
    fetchAvailableSlots,
    requestLesson,
    cancelLesson,
    getNextLesson,
    getLessonStats,
  };
};
