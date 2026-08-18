import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Props = {
  children: React.ReactNode;
};

export const ADMIN_EMAILS = [
  "akhildevshali@gmail.com",
  "hemant2182@gmail.com",
];

export default function AdminRoute({ children }: Props) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user?.email) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const email = session.user.email.toLowerCase().trim();

      setIsAdmin(ADMIN_EMAILS.includes(email));
      setLoading(false);
    };

    checkAdmin();
  }, []);

  if (loading) {
    return null;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}