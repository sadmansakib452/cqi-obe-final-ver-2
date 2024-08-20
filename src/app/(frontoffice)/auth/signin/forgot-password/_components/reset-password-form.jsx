"use client";

import { resetPasswordAction } from "@/actions/reset-password-action";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ResetPasswordSchema } from "@/validators/reset-password-validator";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";

export default function ResetPasswordForm({email, token}) {
  const router = useRouter();

  const form = useForm({
    resolver: valibotResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { handleSubmit, control, formState, setError } = form;

  const submit = async (values) => {
    const res = await resetPasswordAction(email, token, values);

    if (res.success) {
      router.push("/auth/signin/reset-password/success");
    } else {
      switch (res.statusCode) {
        case 400:
          const nestedErrors = res.error.nested;

          for (const key in nestedErrors) {
            setError(key, {
              message: nestedErrors[key]?.[0],
            });
          }
          break;

        case 401:
          setError("confirmPassword", { message: res.error });
          break;

        case 500:
        default:
          const error = res.error || "Internal Server Error";
          setError("confirmPassword", { message: error });
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(submit)} className="max-w-[400px] space-y-6">
        <FormField
          control={control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={formState.isSubmitting}
          className="w-full"
        >
          Reset password
        </Button>
      </form>
    </Form>
  );
}
