import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLessons } from '../hooks/useLessons';
import {
  Container,
  Card,
  CardHeader,
  CardBody,
  Button,
  Textarea,
  Alert,
  Spacer,
  StudentBottomNav,
} from '../components';

export default function BookLessonPage() {
  const { slotId } = useParams<{ slotId: string }>();
  const navigate = useNavigate();
  const { availableSlots, requestLesson } = useLessons();
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const slot = availableSlots.find(s => s.id === slotId);

  if (!slot) {
    return (
      <div className="pb-24">
        <Container>
          <div className="pt-6 text-center">
            <p className="text-stone-500">לא נמצא שיעור</p>
            <Button
              variant="primary"
              onClick={() => navigate('/student/lessons')}
              className="mt-4"
            >
              חזור לרשימת השיעורים
            </Button>
          </div>
        </Container>
        <StudentBottomNav />
      </div>
    );
  }

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('he-IL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await requestLesson(slot.id, notes || undefined);
      setSuccess(true);
      setTimeout(() => {
        navigate('/student/lessons');
      }, 2000);
    } catch (err) {
      setError('שגיאה בהגשת בקשה. נסו שוב.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="pb-24">
        <Container>
          <div className="pt-16 text-center">
            <div className="w-24 h-24 rounded-full bg-success-100 flex items-center justify-center text-5xl mx-auto mb-6">
              ✓
            </div>
            <h2 className="font-serif text-2xl font-bold text-success-700 mb-2">
              בקשה הוגשה בהצלחה!
            </h2>
            <p className="text-stone-500 mb-6">
              המדריך יבדוק את הבקשה שלכם ויחזור אליכם בהקדם
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/student/lessons')}
              fullWidth
            >
              חזור לשיעורים שלי
            </Button>
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
          <h1 className="font-serif text-2xl font-bold text-stone-900 mb-2">בקשת שיעור</h1>
          <p className="text-stone-500 mb-6">אישור פרטי השיעור</p>

          {/* Lesson Details */}
          <Card>
            <CardHeader title="פרטי השיעור" />
            <CardBody>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-stone-500">תאריך ושעה</p>
                  <p className="font-semibold text-lg text-stone-900">
                    {formatDateTime(slot.startTime)}
                  </p>
                </div>

                <div className="border-t border-stone-200 pt-4">
                  <p className="text-sm text-stone-500">משך</p>
                  <p className="font-semibold text-stone-900">60 דקות</p>
                </div>

                <div className="border-t border-stone-200 pt-4 bg-primary-50 p-3 rounded-xl">
                  <p className="text-sm text-stone-500">מחיר</p>
                  <p className="font-bold text-2xl text-primary-600">₪{slot.price}</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Spacer size="md" />

          {/* Booking Form */}
          <Card>
            <CardHeader title="הערות (אופציונלי)" />
            <CardBody>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Textarea
                  label="הערות או בקשות מיוחדות"
                  placeholder="לדוגמה: רצוני להתמקד בנסיעה בכביש מהיר"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  fullWidth
                />

                {error && (
                  <Alert type="error" title="שגיאה">
                    {error}
                  </Alert>
                )}

                <Spacer size="md" />

                <div className="space-y-2">
                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    loading={submitting}
                    disabled={submitting}
                  >
                    {submitting ? 'טוען...' : 'הגש בקשה'}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    fullWidth
                    disabled={submitting}
                    onClick={() => navigate('/student/lessons')}
                  >
                    ביטול
                  </Button>
                </div>

                <Alert type="info">
                  <strong>שימו לב:</strong> יהיה עליכם להמתין להסכמת המדריך לפני
                  אישור הזמנתו. תקבלו הודעה כשהמדריך יחזור אליכם.
                </Alert>
              </form>
            </CardBody>
          </Card>

          <Spacer size="lg" />
        </div>
      </Container>
      <StudentBottomNav />
    </div>
  );
}

