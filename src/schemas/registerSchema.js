import { z } from "zod";

const registerSchema = z.object({
  username: z
  .string().min(3, "Username must be at least 6 characters"),
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Must be a valid email" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export default registerSchema;
