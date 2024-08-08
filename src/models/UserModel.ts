import { z } from "zod";

const User = z.object({
  id: z.number().min(1),
  name: z.string().min(1),
  phone_number: z.string().min(8).max(16),
  email: z.string().min(1).email(),
  password: z.string().min(1),
  created_at: z.string().date(),
  updated_at: z.string().date(),
});

export type UserType = z.infer<typeof User>;

export default User;
