
import "./globals.css";
import DashboardLayout from "@/components/DashboardLayout";

export const metadata = {
  title: "StaffFlow - Employee Management",
  description: "Employee Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <DashboardLayout>
          {children}
        </DashboardLayout>
      </body>
    </html>
  );
}
