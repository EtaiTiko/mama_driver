import { TeacherBottomNav, Container, Card, CardHeader, CardBody, Badge, Button, Spacer } from "../components";

export default function TeacherDashboard() {
  return (
    <div className="pb-24">
      <div className="bg-brand pt-10 pb-14 px-4 mb-[-2rem]">
        <div className="max-w-md mx-auto">
          <h1 className="font-serif text-2xl font-bold text-white mb-1">שלום, מדריך!</h1>
          <p className="text-white/80">יום עמוס בשיעורים</p>
        </div>
      </div>
      <Container>
        <div>
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
                  <div key={i} className="flex justify-between items-center p-3 bg-stone-50 rounded-xl">
                    <div>
                      <p className="font-semibold">{lesson.student}</p>
                      <p className="text-sm text-stone-500">{lesson.time}</p>
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
                  <span className="text-stone-500">שיעורים היום</span>
                  <span className="font-bold text-stone-900">5/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">תלמידים פעילים</span>
                  <span className="font-bold text-stone-900">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">הערות שלא נקראו</span>
                  <span className="font-bold text-stone-900">3</span>
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
