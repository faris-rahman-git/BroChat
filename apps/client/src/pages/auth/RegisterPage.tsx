import Register from "@client/components/features/auth/Register";
import AuthLayout from "@client/layouts/AuthLayout";

function RegisterPage() {
  return (
    <AuthLayout>
      <Register />
    </AuthLayout>
  );
}

export default RegisterPage;
