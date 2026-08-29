import { TeacherBottomNav, Container, Card, CardHeader, CardBody, Badge, Button, Spacer } from "../components";

export default function TeacherDashboard() {
  return (
    <div className="pb-24">
      <Container>
        <div className="pt-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">שלום, מדריך!</h1>
          <p className="text-gray-600">יום עמוס בשיעורים</p>

          <Spacer size="lg" />

          {/* Today's Schedule */}
          <Card>
            <CardHeader title="שיעורים היום" subtitle="5 שיעורים" />
            <CardBody>
              <div className="space-y-3">
                {[
                  { time: "09:00", student: "יאיר לוי", status: "accepted" },
                  { time: "10:30", student: "מירי דהן", status: "pending" },
                  { time: "12:00", student: "רן פרי", status: "accepted" },
                ].map((lesson, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-semibold">{lesson.student}</p>
                      <p className="text-sm text-gray-600">{lesson.time}</p>
                    </div>
                    <Badge
                      variant={lesson.status === "accepted" ? "success" : "warning"}
                    >
                      {lesson.status === "accepted" ? "אושר" : "ממתין"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          <Spacer size="md" />

          {/* Pending Requests */}
          <Card>
            <CardHeader title="בקשות ממתינות" subtitle="2 בקשות חדשות" />
            <CardBody>
              <div className="space-y-2">
                <Button variant="ghost" fullWidth>
                  ✓ אשר הבקשה
                </Button>
                <Button variant="danger" fullWidth>
                  ✕ דחה בקשה
                </Button>
              </div>
            </CardBody>
          </Card>

          <Spacer size="lg" />

          {/* Stats */}
          <Card>
            <CardHeader title="סטטיסטיקות" />
            <CardBody>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">שיעורים היום</span>
                  <span className="font-bold">5/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">תלמידים פעילים</span>
                  <span className="font-bold">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">הערות שלא נקראו</span>
                  <span className="font-bold">3</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </Container>

      <TeacherBottomNav />
    </div>
  );
}
