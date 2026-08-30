import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Button } from "../components";
import { Card, CardHeader, CardBody } from "../components";
import { Input } from "../components";
import { Container, Spacer } from "../components";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError("שגיאה בהתחברות. נסו שוב.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
      <Container>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">בית ספר לנהיגה</h1>
          <p className="text-gray-600">התחברו לחשבונכם</p>
        </div>

        <Card>
          <CardHeader title="כניסה" />
          <CardBody>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="email"
                label="דוא״ל"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
              />

              <Input
                type="password"
                label="סיסמה"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
              />

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <Spacer size="sm" />

              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={loading}
              >
                {loading ? "טוען..." : "כניסה"}
              </Button>
            </form>
          </CardBody>
        </Card>

        <div className="text-center mt-6 text-gray-600 text-sm">
          <p>משתמש חדש? צרו קשר עם המנהל</p>
        </div>
      </Container>
    </div>
  );
}
