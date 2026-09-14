import { useNavigate } from "react-router-dom";
import { useLessons } from "../hooks/useLessons";
import { StudentBottomNav, Container, Card, Button, Spacer, Badge } from "../components";

const formatDateTime = (date: Date) =>
  new Intl.DateTimeFormat("he-IL", {
    weekday: "long", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
  }).format(date);

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { getNextLesson, getLessonStats, loading } = useLessons();
  const nextLesson = getNextLesson();
  const stats = getLessonStats();

  if (loading) return <Container><div className="py-16 text-center text-stone-500">טוען את המסלול שלך...</div></Container>;

  return (
    <div className="pb-24">
      <Container>
        <section className="flex flex-col justify-between gap-6 py-8 sm:flex-row sm:items-end">
          <div><p className="eyebrow">יום חמישי · 11 בספטמבר</p><h1 className="display-title mt-3">בוקר טוב, <span className="text-primary-600">יאיר.</span></h1><p className="mt-3 max-w-md text-base leading-7 text-stone-500">המסלול שלך מתקדם יפה. הנה מה שמחכה לך השבוע.</p></div>
          <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3 shadow-soft"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-100 text-lg">◒</div><div><p className="text-xs text-stone-500">התקדמות כללית</p><p className="font-bold text-stone-950">שיעור 12 מתוך 20</p></div></div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.45fr_0.85fr]">
          <div className="relative overflow-hidden rounded-[1.75rem] bg-stone-950 p-6 text-white shadow-lifted sm:p-8"><div className="absolute -left-10 -top-12 h-48 w-48 rounded-full border-[24px] border-accent-500/20" /><div className="relative"><div className="flex items-center justify-between"><span className="eyebrow text-accent-300">השיעור הבא</span><Badge variant="success">מאושר</Badge></div>{nextLesson ? <><p className="mt-10 font-serif text-4xl font-semibold">{formatDateTime(nextLesson.startTime)}</p><div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-stone-300"><span>◷ 60 דקות</span><span>⌖ אזור תל אביב</span><span>₪{nextLesson.price}</span></div><div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button onClick={() => navigate("/student/lessons")} variant="secondary">לפרטי השיעור</Button><Button onClick={() => navigate("/student/lessons/browse")} variant="ghost" className="text-white hover:bg-white/10">קביעת שיעור נוסף</Button></div></> : <><p className="mt-8 font-serif text-3xl font-semibold">אין שיעור מתוכנן</p><p className="mt-3 text-stone-300">בחרו משבצת פנויה והמשיכו את הקצב.</p><Button className="mt-8" onClick={() => navigate("/student/lessons/browse")}>מציאת זמן פנוי</Button></>}</div></div>
          <Card className="flex flex-col justify-between"><div><p className="eyebrow">המסלול שלך</p><h2 className="mt-3 font-serif text-2xl font-semibold">מתקדמים בביטחון</h2><p className="mt-2 text-sm leading-6 text-stone-500">עוד 8 שיעורים עד לשלב הבא. כל שיעור הוא צעד קטן בדרך לעצמאות.</p></div><div className="mt-8"><div className="mb-2 flex justify-between text-xs font-bold text-stone-500"><span>60%</span><span>יעד קרוב</span></div><div className="h-3 overflow-hidden rounded-full bg-stone-100"><div className="h-full w-3/5 rounded-full bg-accent-500" /></div><p className="mt-4 text-sm font-semibold text-stone-800">4 שיעורים הושלמו החודש</p></div></Card>
        </section>

        <section className="mt-8 grid gap-5 sm:grid-cols-3"><Card><p className="text-sm text-stone-500">שיעורים שהושלמו</p><p className="mt-3 font-serif text-4xl font-semibold text-stone-950">{stats.completed}</p><p className="mt-2 text-xs font-semibold text-success-600">↑ ממשיכים בקצב טוב</p></Card><Card><p className="text-sm text-stone-500">שיעורים קרובים</p><p className="mt-3 font-serif text-4xl font-semibold text-stone-950">{stats.pending + stats.accepted}</p><p className="mt-2 text-xs font-semibold text-primary-600">בלוח הזמנים שלך</p></Card><Card><p className="text-sm text-stone-500">בקשות לאישור</p><p className="mt-3 font-serif text-4xl font-semibold text-stone-950">{stats.pending}</p><p className="mt-2 text-xs font-semibold text-warning-600">נבדקות על ידי המורה</p></Card></section>

        <section className="mt-10 flex items-end justify-between"><div><p className="eyebrow">קיצור דרך</p><h2 className="mt-2 font-serif text-2xl font-semibold">מה תרצו לעשות?</h2></div><button className="hidden text-sm font-bold text-primary-600 sm:block" onClick={() => navigate("/student/lessons")}>לכל השיעורים ←</button></section>
        <section className="mt-4 grid gap-4 sm:grid-cols-2"><button onClick={() => navigate("/student/lessons/browse")} className="group flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-5 text-right shadow-soft transition hover:-translate-y-1 hover:border-primary-200"><span><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-100 text-xl">+</span><span className="mt-4 block font-bold text-stone-950">קביעת שיעור חדש</span><span className="mt-1 block text-sm text-stone-500">בחירת יום ושעה שמתאימים לך</span></span><span className="text-2xl text-accent-500 transition group-hover:-translate-x-1">←</span></button><button onClick={() => navigate("/student/lessons")} className="group flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-5 text-right shadow-soft transition hover:-translate-y-1 hover:border-primary-200"><span><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-xl text-primary-700">◷</span><span className="mt-4 block font-bold text-stone-950">ניהול השיעורים שלי</span><span className="mt-1 block text-sm text-stone-500">צפייה, ביטול ומעקב</span></span><span className="text-2xl text-primary-600 transition group-hover:-translate-x-1">←</span></button></section>
        <Spacer size="lg" />
      </Container>
      <StudentBottomNav />
    </div>
  );
}
