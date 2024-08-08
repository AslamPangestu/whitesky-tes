import { z } from "zod";

const News = z.object({
  id: z.number().min(1),
  image: z.string().min(1),
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  body: z.string().min(1),
  author: z.string().min(1),
  created_at: z.string().date(),
  updated_at: z.string().date(),
});

export type NewsType = z.infer<typeof News>;

export default News;
