'use client'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/frontend/ui/form";
import { Input } from "@/components/frontend/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/frontend/ui/button";
import { Checkbox } from "@/components/frontend/ui/checkbox";
import { z } from "zod";
import { getSession, signIn } from 'next-auth/react'
import { ApiResCode, ApiResponse } from "@/shared/types/api.types";
import definedMessages from "@/shared/constants/messages";
import Spinner from "@/components/spinner";
import { useRouter, useSearchParams } from "next/navigation";


export const loginFormSchema = z.object(
    {
        email: z.string({ required_error: "This field is required." }).email({ message: "please enter a valid email address" }),
        password: z.string({ required_error: "This field is required." }).min(8, { message: "Password must contain at-least 8 characterisctics" })

    }
)
export type LoginFormSchema = z.infer<typeof loginFormSchema>


export default function LoginForm() {
    const router = useRouter();
    const form = useForm<LoginFormSchema>({
        resolver: zodResolver(loginFormSchema),
        mode: "all"
    })
    const handleFormSubmit = async (data: LoginFormSchema) => {
        const res = await signIn("credentials", {
            redirect: false,
            email: data.email,
            password: data.password
        })
        if (res?.error) {
            const error = res.error as ApiResCode
            if (error === "NOT_FOUND") {
                form.setError("email", {
                    message: definedMessages.USER_NOT_FOUND
                })
            }
            if (error === "WRONG_PASSWORD") {
                form.setError("password", {
                    message: definedMessages.WRONG_PASSWORD
                })
            }
            return;
        }
        const sesssion = await getSession();
        if (sesssion?.user?.role === "ADMIN" || sesssion?.user?.role === "EDITOR") {
            // router.push(params.get("callbackUrl") ?? "/dashboard")
            router.push("/dashboard")
        }
        else {
            router.push("/")
        }
    }


    return (
        <div>
            <Form {...form}>
                <form method="post" onSubmit={form.handleSubmit(handleFormSubmit)}>
                    <div className="space-y-2">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-semibold">Email <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input type="email" autoComplete="email" placeholder="Enter your Email here" {...field} />
                                    </FormControl>
                                    {
                                        fieldState.error && (
                                            <FormMessage>
                                                {fieldState.error?.message}
                                            </FormMessage>
                                        )
                                    }
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-semibold">Password <span className="text-red-500">*</span> </FormLabel>
                                    <FormControl>
                                        <Input type="password" autoComplete="password" placeholder="Enter your Password here" {...field} />
                                    </FormControl>
                                    {
                                        fieldState.error && (
                                            <FormMessage>
                                                {fieldState.error?.message}
                                            </FormMessage>
                                        )
                                    }
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex justify-between py-5 items-center text-xs md:text-sm">
                        <div className="flex gap-1">
                            <Checkbox />
                            <p className=" text-primary-dark font-semibold font-inter">
                                <span>Remember me</span>
                            </p>
                        </div>
                        <div>
                            <a className="text-primary-dark font-semibold font-inter" href="/forgotpassowrd">
                                Forgot Password?
                            </a>
                        </div>
                    </div>
                    <div className="mt-5 mb-5">
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {
                                form.formState.isSubmitting ?
                                    <Spinner className="border-white" />
                                    :
                                    <span>Login</span>
                            }
                        </Button>
                    </div>
                </form>

            </Form>
            <div
                className="flex gap-2 justify-center items-center font-normal text-sm  text-primary-dark md:pt-3 md:text-base  md:pb-8 pb-5 pt-0 px-1">
                <p>Don’t have an account?</p>
                <a className="font-bold" href="/signup">Sign up here</a>
            </div>
        </div>
    )
}
