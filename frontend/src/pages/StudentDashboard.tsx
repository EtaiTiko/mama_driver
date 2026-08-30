import { StudentBottomNav, Container, Card, CardHeader, CardBody, Button, Spacer, Badge } from "../components";

export default function StudentDashboard() {
  return (
    <div className="pb-24">
      <Container>
        <div className="pt-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">שלום, תלמיד!</h1>
          <p className="text-gray-600">ממתינים לשיעור הבא שלך</p>

          <Spacer size="lg" />

          {/* Next Lesson Card */}
          <Card interactive>
            <CardHeader title="השיעור הבא" subtitle="יום שני, 15:00" />
            <CardBody>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">מדריך</p>
                  <p className="font-semibold">דוד כהן</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">סוג שיעור</p>
                  <Badge variant="success">נסיעה בעיר</Badge>
                </div>
              </div>
            </CardBody>
          </Card>

          <Spacer size="md" />

          {/* Quick Actions */}
          <div className="space-y-3">
            <Button variant="primary" fullWidth>
              ביטול שיעור
            </Button>
            <Button variant="secondary" fullWidth>
              צור שיעור חדש
            </Button>
          </div>

          <Spacer size="lg" />

          {/* Stats */}
          <Card>
            <CardHeader title="התקדמות" />
            <CardBody>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">12</p>
                  <p className="text-sm text-gray-600">שיעורים בוצעו</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">8</p>
                  <p className="text-sm text-gray-600">שיעורים נותרו</p>
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
