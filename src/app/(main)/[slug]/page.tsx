import { Metadata, ResolvingMetadata } from "next";

interface Props {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export const generateStaticParams = async () => {
  // const posts = await fetch("https://.../posts").then((res) => res.json());

  return [];
};

export const generateMetadata = async (
  { params, searchParams }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> => {
  // const id = params.id;
  // const product = await fetch(`https://.../${id}`).then((res) => res.json());
  // const previousImages = (await parent).openGraph?.images || [];

  return {
    title: "Testing Dynamic",
    description: "Testing dynamic",
  };
};

const DetailPage = () => {
  return (
    <section>
      <h1>Title</h1>
      <div>
        <span>Created At</span>
        <span>Author</span>
      </div>
      <div>image</div>
      <p>Description</p>
    </section>
  );
};

export default DetailPage;
