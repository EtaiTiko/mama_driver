import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLessons } from '../hooks/useLessons';
import {
  Container,
  Card,
  CardHeader,
  CardBody,
  Button,
  Spacer,
  LoadingSpinner,
  EmptyState,
  StudentBottomNav,
} from '../components';

export default function BrowseLessonsPage() {
  const navigate = useNavigate();
  const { availableSlots, loading } = useLessons();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('he-IL', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('he-IL', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Get unique dates
  const uniqueDates = Array.from(
    new Set(availableSlots.map(s => s.startTime.toDateString()))
  ).sort();

  // Filter slots based on selected date
  let filteredSlots = availableSlots;
  if (selectedDate) {
    filteredSlots = filteredSlots.filter(
      s => s.startTime.toDateString() === selectedDate
    );
  }

  if (loading) {
    return (
      <div className="pb-24">
        <Container>
          <div className="pt-6">
            <LoadingSpinner message="טוען שיעורים זמינים..." />
          </div>
        </Container>
        <StudentBottomNav />
      </div>
    );
  }

  return (
    <div className="pb-24">
      <Container>
        <div className="pt-6">
          <h1 className="font-serif text-2xl font-bold text-stone-900 mb-2">שיעורים זמינים</h1>
          <p className="text-stone-500 mb-2">בחרו שיעור עם {availableSlots[0]?.teacher.name}</p>
          <p className="text-sm text-primary-600 font-medium mb-6">מחיר קבוע: ₪{availableSlots[0]?.price}</p>

          {/* Date Filter */}
          <Card>
            <CardHeader title="בחרו תאריך" />
            <CardBody>
              <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto">
                <button
                  onClick={() => setSelectedDate(null)}
                  className={`py-2 px-3 rounded-lg text-sm transition-colors ${
                    selectedDate === null
                      ? 'bg-brand text-white font-semibold shadow-soft'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  הכל
                </button>
                {uniqueDates.map(date => (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`py-2 px-3 rounded-lg text-sm transition-colors ${
                      selectedDate === date
                        ? 'bg-brand text-white font-semibold shadow-soft'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {formatDate(new Date(date))}
                  </button>
                ))}
              </div>
            </CardBody>
          </Card>

          <Spacer size="md" />

          {/* Available Slots */}
          {filteredSlots.length === 0 ? (
            <EmptyState
              icon="📅"
              title="אין שיעורים זמינים"
              message="אנא שנו את התאריך וחפשו שוב"
            />
          ) : (
            <div className="space-y-3">
              {filteredSlots.map(slot => (
                <Card key={slot.id} interactive>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-stone-900">
                          {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                        </h3>
                        <p className="text-sm text-stone-500">
                          {formatDate(slot.startTime)}
                        </p>
                      </div>
                    </div>

                    <div className="bg-primary-50 p-3 rounded-xl mb-4">
                      <p className="text-sm text-stone-500 mb-1">מחיר קבוע לשיעור</p>
                      <p className="font-bold text-lg text-primary-600">₪{slot.price}</p>
                    </div>

                    <Button
                      variant="primary"
                      size="md"
                      fullWidth
                      onClick={() => navigate(`/student/lessons/book/${slot.id}`)}
                    >
                      בקש שיעור זה
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <Spacer size="lg" />
        </div>
      </Container>
      <StudentBottomNav />
    </div>
  );
}
