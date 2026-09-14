import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import LoginPage from "./pages/LoginPage";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import ComponentShowcase from "./pages/ComponentShowcase";
import BrowseLessonsPage from "./pages/BrowseLessonsPage";
import BookLessonPage from "./pages/BookLessonPage";
import MyLessonsPage from "./pages/MyLessonsPage";
import { AppShell } from "./components";

export default function App() {
  const { session } = useAuth();

  if (!session) {
    return <LoginPage />;
  }

  return (
    <Router>
      <AppShell>
        <Routes>
        <Route path="/" element={<StudentDashboard />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/lessons" element={<MyLessonsPage />} />
        <Route path="/student/lessons/browse" element={<BrowseLessonsPage />} />
        <Route path="/student/lessons/book/:slotId" element={<BookLessonPage />} />
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/showcase" element={<ComponentShowcase />} />
        </Routes>
      </AppShell>
    </Router>
  );
}
