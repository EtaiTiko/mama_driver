import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLessons } from '../hooks/useLessons';
import { LessonStatus } from '../types/lesson';
import {
  Container,
  Card,
  CardHeader,
  CardBody,
  Button,
  Badge,
  Spacer,
  LoadingSpinner,
  EmptyState,
} from '../components';

export default function MyLessonsPage() {
  const navigate = useNavigate();
  const { lessons, loading, cancelLesson } = useLessons();
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'past' | 'cancelled'>(
    'upcoming'
  );
  const [cancelingId, setCancelingId] = useState<string | null>(null);

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('he-IL', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getStatusColor = (status: LessonStatus) => {
    switch (status) {
      case LessonStatus.ACCEPTED:
        return 'success';
      case LessonStatus.PENDING:
        return 'warning';
      case LessonStatus.DECLINED:
      case LessonStatus.CANCELLED_BY_STUDENT:
      case LessonStatus.CANCELLED_BY_TEACHER:
        return 'danger';
      case LessonStatus.COMPLETED:
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: LessonStatus) => {
    const labels: Record<LessonStatus, string> = {
      [LessonStatus.PENDING]: 'ממתין לאישור',
      [LessonStatus.ACCEPTED]: 'אושר',
      [LessonStatus.DECLINED]: 'נדחה',
      [LessonStatus.CANCELLED_BY_STUDENT]: 'בוטל על ידי תלמיד',
      [LessonStatus.CANCELLED_BY_TEACHER]: 'בוטל על ידי מדריך',
      [LessonStatus.COMPLETED]: 'הושלם',
      [LessonStatus.NO_SHOW]: 'לא הופיע',
    };
    return labels[status] || status;
  };

  const now = new Date();

  let filteredLessons = lessons;
  if (selectedTab === 'upcoming') {
    filteredLessons = lessons.filter(
      l =>
        l.startTime > now &&
        [LessonStatus.ACCEPTED, LessonStatus.PENDING].includes(l.status)
    );
  } else if (selectedTab === 'past') {
    filteredLessons = lessons.filter(
      l =>
        l.startTime <= now ||
        [LessonStatus.COMPLETED, LessonStatus.NO_SHOW].includes(l.status)
    );
  } else if (selectedTab === 'cancelled') {
    filteredLessons = lessons.filter(
      l =>
        [
          LessonStatus.CANCELLED_BY_STUDENT,
          LessonStatus.CANCELLED_BY_TEACHER,
          LessonStatus.DECLINED,
        ].includes(l.status)
    );
  }

  const handleCancel = async (lessonId: string) => {
    setCancelingId(lessonId);
    try {
      await cancelLesson(lessonId, 'ביטול על ידי תלמיד');
    } catch (error) {
      console.error('Failed to cancel lesson:', error);
    } finally {
      setCancelingId(null);
    }
  };

  return (
    <div className="pb-24">
      <Container>
        <div className="pt-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">שיעורים שלי</h1>
          <p className="text-gray-600 mb-6">ניהול השיעורים שלכם</p>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {(['upcoming', 'past', 'cancelled'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab === 'upcoming' && 'קרובים'}
                {tab === 'past' && 'עבר'}
                {tab === 'cancelled' && 'מבוטלים'}
              </button>
            ))}
          </div>

          {/* Lessons List */}
          {loading ? (
            <LoadingSpinner message="טוען שיעורים..." />
          ) : filteredLessons.length === 0 ? (
            <EmptyState
              icon={
                selectedTab === 'upcoming'
                  ? '📭'
                  : selectedTab === 'past'
                    ? '✓'
                    : '✕'
              }
              title={
                selectedTab === 'upcoming'
                  ? 'אין שיעורים קרובים'
                  : selectedTab === 'past'
                    ? 'אין שיעורים שהושלמו'
                    : 'אין שיעורים מבוטלים'
              }
              message={
                selectedTab === 'upcoming'
                  ? 'בקשו שיעור חדש כדי להתחיל'
                  : 'כל השיעורים בעבר הושלמו בהצלחה'
              }
            />
          ) : (
            <div className="space-y-3">
              {filteredLessons.map(lesson => (
                <Card key={lesson.id} interactive>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {lesson.teacher?.name || 'מדריך לא ידוע'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {formatDateTime(lesson.startTime)}
                        </p>
                      </div>
                      <Badge variant={getStatusColor(lesson.status) as any}>
                        {getStatusLabel(lesson.status)}
                      </Badge>
                    </div>

                    {lesson.lessonType && (
                      <p className="text-sm text-gray-600 mb-3">
                        סוג: {lesson.lessonType}
                      </p>
                    )}

                    {lesson.notes && (
                      <p className="text-sm text-gray-600 mb-3 bg-gray-50 p-2 rounded">
                        הערות: {lesson.notes}
                      </p>
                    )}

                    <div className="flex justify-between items-center mb-3">
                      <span className="text-lg font-bold text-blue-600">
                        ₪{lesson.price}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      {lesson.status === 'PENDING' && (
                        <>
                          <Button
                            variant="secondary"
                            size="sm"
                            fullWidth
                            loading={cancelingId === lesson.id}
                            disabled={cancelingId === lesson.id}
                            onClick={() => handleCancel(lesson.id)}
                          >
                            {cancelingId === lesson.id ? 'מבטל...' : 'בטל'}
                          </Button>
                        </>
                      )}
                      {lesson.status === 'ACCEPTED' && lesson.startTime > new Date() && (
                        <>
                          <Button
                            variant="secondary"
                            size="sm"
                            fullWidth
                            loading={cancelingId === lesson.id}
                            disabled={cancelingId === lesson.id}
                            onClick={() => handleCancel(lesson.id)}
                          >
                            {cancelingId === lesson.id ? 'מבטל...' : 'בטל שיעור'}
                          </Button>
                        </>
                      )}
                      {lesson.status === 'COMPLETED' && (
                        <Button
                          variant="secondary"
                          size="sm"
                          fullWidth
                          onClick={() =>
                            navigate(`/student/lessons/${lesson.id}/details`)
                          }
                        >
                          צפה בפרטים
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <Spacer size="md" />

          {/* Browse More Button */}
          {selectedTab === 'upcoming' && (
            <Button
              variant="primary"
              fullWidth
              onClick={() => navigate('/student/lessons/browse')}
            >
              ✚ בקש שיעור חדש
            </Button>
          )}

          <Spacer size="lg" />
        </div>
      </Container>
    </div>
  );
}
