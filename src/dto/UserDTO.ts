import { z } from "zod";

import UserModel from "src/models/UserModel";

export const CreateUserDTO = UserModel.omit({
  id: true,
  created_at: true,
  updated_at: true,
})
  .extend({ confirm_password: z.string().min(1) })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });
export type CreateUserDTOType = z.infer<typeof CreateUserDTO>;

export const LoginDTO = UserModel.pick({
  email: true,
  password: true,
});
export type LoginDTOType = z.infer<typeof LoginDTO>;

export const UserDTO = UserModel.pick({
  email: true,
  name: true,
  phone_number: true,
});
export type UserDTOType = z.infer<typeof UserDTO>;

export const JWTPayload = UserModel.pick({
  id: true,
  email: true,
  name: true,
  phone_number: true,
});
export type JWTPayloadType = z.infer<typeof JWTPayload>;

export const ChangePasswordDTO = z
  .object({
    old_password: z.string().min(1),
    new_password: z.string().min(1),
    confirm_password: z.string().min(1),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

export type ChangePasswordDTOType = z.infer<typeof ChangePasswordDTO>;
