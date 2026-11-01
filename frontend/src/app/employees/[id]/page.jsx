
import { Suspense } from "react";
import EditEmployeeForm from "./EditEmployeeForm";

export default function EditEmployeePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-100 p-8">
          <p className="text-slate-600">
            Loading edit page...
          </p>
        </div>
      }
    >
      <EditEmployeeForm />
    </Suspense>
  );
}
