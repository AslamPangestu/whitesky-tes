import Layout from "src/components/Layouts/MainLayout";

interface Props {
  children: React.ReactNode;
}

const HomeLayout = ({ children }: Props) => {
  return (
    <html lang="en">
      <Layout>{children}</Layout>
    </html>
  );
};

export default HomeLayout;
