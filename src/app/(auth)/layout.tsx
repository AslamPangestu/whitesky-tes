import Layout from "src/components/Layouts/AuthLayout";

interface Props {
  children: React.ReactNode;
}

const RegisterLayout = ({ children }: Props) => {
  return (
    <html lang="en">
      <Layout>{children}</Layout>
    </html>
  );
};

export default RegisterLayout;
