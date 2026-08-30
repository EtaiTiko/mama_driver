import { useNavigate } from 'react-router-dom';
import { useLessons } from '../hooks/useLessons';
import { StudentBottomNav, Container, Card, CardHeader, CardBody, Button, Spacer, Badge } from '../components';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { getNextLesson, getLessonStats, loading } = useLessons();

  const nextLesson = getNextLesson();
  const stats = getLessonStats();

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('he-IL', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (loading) {
    return (
      <div className="pb-24">
        <Container>
          <div className="pt-6">
            <p className="text-center text-stone-500">טוען...</p>
          </div>
        </Container>
        <StudentBottomNav />
      </div>
    );
  }

  return (
    <div className="pb-24">
      <div className="bg-brand pt-10 pb-14 px-4 mb-[-2rem]">
        <div className="max-w-md mx-auto">
          <h1 className="font-serif text-2xl font-bold text-white mb-1">שלום, תלמיד!</h1>
          <p className="text-white/80">הממתינים לשיעור הבא שלך</p>
        </div>
      </div>
      <Container>
        <div>
          {/* Next Lesson Card */}
          {nextLesson ? (
            <Card interactive>
              <CardHeader title="השיעור הבא" subtitle={formatDateTime(nextLesson.startTime)} />
              <CardBody>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-stone-500">מדריך</p>
                    <p className="font-semibold">{nextLesson.teacher?.name || 'מדריך לא ידוע'}</p>
                  </div>
                  {nextLesson.lessonType && (
                    <div>
                      <p className="text-sm text-stone-500">סוג שיעור</p>
                      <Badge variant="success">{nextLesson.lessonType}</Badge>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-stone-500">מחיר</p>
                    <p className="font-bold text-lg text-primary-600">₪{nextLesson.price}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          ) : (
            <Card>
              <CardHeader title="אין שיעורים קרובים" />
              <CardBody>
                <p className="text-stone-500 mb-4">בקשו שיעור חדש כדי להתחיל</p>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => navigate('/student/lessons/browse')}
                >
                  בקשו שיעור
                </Button>
              </CardBody>
            </Card>
          )}

          <Spacer size="md" />

          {/* Quick Actions */}
          <div className="space-y-3">
            <Button
              variant="primary"
              fullWidth
              onClick={() => navigate('/student/lessons')}
            >
              צפו בשיעורים שלי
            </Button>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => navigate('/student/lessons/browse')}
            >
              בקשו שיעור חדש
            </Button>
          </div>

          <Spacer size="lg" />

          {/* Stats */}
          <Card>
            <CardHeader title="התקדמות" />
            <CardBody>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary-600">{stats.completed}</p>
                  <p className="text-sm text-stone-500">שיעורים בוצעו</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-success-600">{stats.pending + stats.accepted}</p>
                  <p className="text-sm text-stone-500">שיעורים קרובים</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-warning-600">{stats.pending}</p>
                  <p className="text-sm text-stone-500">ממתינות לאישור</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-danger-600">{stats.cancelled}</p>
                  <p className="text-sm text-stone-500">מבוטלים</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </Container>

      <StudentBottomNav />
    </div>
  );
}
