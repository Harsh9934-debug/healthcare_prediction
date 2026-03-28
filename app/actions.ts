"use server";

import bcrypt from "bcryptjs";
import {
  MedicationLogStatus,
  type AppointmentStatus,
  type DocumentType,
  type LabFlag,
  type MedicationStatus,
  type SymptomSeverity,
} from "@prisma/client";
import { endOfDay, startOfDay } from "date-fns";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth, signIn } from "@/lib/auth";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { signupSchema } from "@/lib/validations";

export type AuthActionState = {
  error: string | null;
  success: string | null;
};

function safeCallbackUrl(raw: unknown) {
  const value = typeof raw === "string" ? raw.trim() : "";
  if (!value) return "/dashboard";
  if (!value.startsWith("/")) return "/dashboard";
  if (value.startsWith("//")) return "/dashboard";
  return value;
}

export async function signupAction(
  _: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid input.",
      success: null,
    };
  }

  const email = parsed.data.email.trim().toLowerCase();
  const password = parsed.data.password;
  const callbackUrl = safeCallbackUrl(formData.get("callbackUrl"));

  const exists = await db.user.findUnique({ where: { email } });
  if (exists) {
    return { error: "An account with that email already exists.", success: null };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await db.user.create({
    data: {
      name: parsed.data.name.trim(),
      email,
      passwordHash,
      healthProfile: {
        create: {
          fullName: parsed.data.name.trim(),
        },
      },
    },
  });

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch {
    return {
      error: "Account created, but automatic sign-in failed. Please log in manually.",
      success: null,
    };
  }

  redirect(callbackUrl);
}

export async function loginAction(
  _: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const callbackUrl = safeCallbackUrl(formData.get("callbackUrl"));

  if (!email || !password) {
    return { error: "Email and password are required.", success: null };
  }

  const user = await db.user.findUnique({
    where: { email },
    select: {
      id: true,
      passwordHash: true,
    },
  });

  if (!user?.passwordHash) {
    return { error: "Invalid email or password.", success: null };
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return { error: "Invalid email or password.", success: null };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch {
    return { error: "Unable to start session. Please try again.", success: null };
  }

  redirect(callbackUrl);
}

// Removed medical feature actions.