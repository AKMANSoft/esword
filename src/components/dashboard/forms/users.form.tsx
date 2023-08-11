'use client'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/dashboard/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from "@/components/dashboard/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/dashboard/ui/card";
import { Button } from "@/components/dashboard/ui/button";
import clientApiHandlers from "@/client/handlers";
import definedMessages from "@/shared/constants/messages";
import { User, UserRole } from "@prisma/client";
import Spinner from "@/components/spinner";
import { useEffect } from "react";
import { z } from 'zod'
import { SelectEl } from "../ui/select";


export const userFormSchema = z.object({
    info: z.string().nullable().default(""),
    name: z.string({ required_error: "This field is required." }),
    email: z.string({ required_error: "This field is required." }).email({ message: "Please enter a valid email." }),
    password: z.string({ required_error: "This field is required." }).optional(),
    role: z.string({ required_error: "This field is required." }),
})


export type UserFormSchema = z.infer<typeof userFormSchema>



type Props = {
    user?: User | null;
    onReset?: () => void;
}


export default function UsersForm({ user, onReset }: Props) {
    const form = useForm<UserFormSchema>({
        resolver: zodResolver(userFormSchema),
        mode: "all",
        defaultValues: {

        }
    })
    const { formState } = form



    useEffect(() => {
        if (!user) return;
        form.reset({
            name: user.name,
            email: user.email,
            role: user.role,
            password: ""
        })
    }, [user, form])


    const resetFormValues = () => {
        form.reset({
            name: "",
            email: "",
            password: "",
            role: "",
        })
    }


    const resetForm = () => {
        if (user && onReset) onReset()
        resetFormValues()
    }


    const handleAddNew = async (data: UserFormSchema) => {
        const res = await clientApiHandlers.users.create(data)
        if (res.succeed && res.data) {
            return window.location.reload()
        }
        if (res.code === "EMAIL_ALREADY_EXISTS") {
            form.setError("email", {
                message: definedMessages.EMAIL_ALREADY_EXISTS
            })
        }
        if (res.code === "UNKOWN_ERROR") {
            form.setError("info", {
                message: definedMessages.UNKNOWN_ERROR
            })
        }
    }


    const handleUpdate = async (data: UserFormSchema) => {
        if (!user) return;
        const res = await clientApiHandlers.users.update(user.id, data)
        if (res.succeed && res.data) {
            return window.location.reload()
        }
        if (res.code === "EMAIL_ALREADY_EXISTS") {
            form.setError("email", {
                message: definedMessages.EMAIL_ALREADY_EXISTS
            })
        }
        if (res.code === "UNKOWN_ERROR") {
            form.setError("info", {
                message: definedMessages.UNKNOWN_ERROR
            })
        }
    }

    return (
        <Card className="w-full rounded-md">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(user ? handleUpdate : handleAddNew)}>
                    <CardHeader>
                        <CardTitle>
                            {user ? "Update User" : "Add New User"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input type="text" {...field} />
                                    </FormControl>
                                    {
                                        fieldState.error &&
                                        <FormMessage />
                                    }
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <FormControl>
                                        <SelectEl
                                            placeholder="Select Role"
                                            onChange={(opt) => {
                                                if (opt?.value) {
                                                    console.log(opt.value)
                                                    field.onChange(opt.value)
                                                }
                                            }}
                                            options={[UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER].map((type) => ({
                                                label: type,
                                                value: type,
                                                rawValue: type
                                            }))}
                                            value={field.value}
                                        />
                                    </FormControl>
                                    {
                                        fieldState.error &&
                                        <FormMessage />
                                    }
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" {...field} />
                                    </FormControl>
                                    {
                                        fieldState.error &&
                                        <FormMessage />
                                    }
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" required={!user} {...field} />
                                    </FormControl>
                                    {
                                        fieldState.error &&
                                        <FormMessage />
                                    }
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="info"
                            render={({ fieldState }) => (
                                <FormItem className="mt-5">
                                    {
                                        fieldState.error &&
                                        <FormMessage />
                                    }
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        {
                            formState.isDirty || user ?
                                <Button variant="outline" type="button" onClick={resetForm}>Cancel</Button>
                                :
                                <span></span>
                        }
                        <Button
                            type="submit"
                            disabled={!formState.isDirty || formState.isSubmitting}>
                            {
                                formState.isSubmitting ?
                                    <Spinner className="border-white" />
                                    :
                                    user ? "Update" : "Add"
                            }
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card >
    )
}