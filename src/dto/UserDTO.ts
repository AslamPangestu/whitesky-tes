import { z } from "zod";

import UserModel from "src/models/UserModel";

export const CreateUserDTO = UserModel.omit({
  id: true,
  created_at: true,
  updated_at: true,
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
