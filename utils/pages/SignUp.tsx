import type { NextPage } from "next";
import { ErrorMessage, Field, Form, Formik, isObject } from "Formik";
import { stringify, stringifyUrl } from "query-string";
import { useState } from "react";
import userStore from "../../dataStores/userStore";
import router, { NextRouter, useRouter } from 'next/router';
import CarbonClose from "../../icons/CarbonClose";

export type LoginResponse = {
    error?: string;
    user?: {
        id: string,
        email: string,
        name: string,
        verified: boolean
    }
}

type Props = {
    message: string,
    alter: (param: string) => void
}

type SignUpProps = {
    setName: (name: string) => void,
    setEmail: (email: string) => void,
    router: NextRouter,
    setServerError: (param: string) => void
}

function SignUp() {
    const { name, setName, email, setEmail } = userStore();
    const router = useRouter();
    const [serverError, setServerError] = useState("");

    function alterServerError(param: string) {
        setServerError(param);
    }

    return (
        <div>
            {serverError ? <ServerErrorPopUp message={serverError} alter={alterServerError} /> :
                <SignUpFormInternal setName={setName} setEmail={setEmail} router={router} setServerError={setServerError} />}
        </div>
    );
};

export function ServerErrorPopUp({ message, alter }: Props) {
    return (
        <div className="relative w-full h-full">
            <CarbonClose className="icon text-3xl bg-red-300" onClick={() => alter("")} />
            <h1 className="text text-center text-xl mt-2">The following error occured</h1>
            <p className="text clear-both text-center text-m mt-2">
                {message}
            </p>
        </div>
    )
}

function SignUpFormInternal({ setName, setEmail, router, setServerError }: SignUpProps) {
    return (
        <div>
            <Formik
                initialValues={{ name: '', email: '', password: '', check: '' }}
                validate={values => {
                    const errors: { email?: any, password?: any, name?: any, check?: any } = {};
                    if (!values.email) {
                        errors.email = 'Required'
                    } else if (
                        // !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                        errors.email = ''
                    ) {
                        errors.email = 'Invalid email address';
                    }
                    if (values.password !== values.check) {
                        errors.check = 'The passwords do not match';
                    }
                    return errors;
                }}
                onSubmit={async (values, { setSubmitting }) => {
                    let err: boolean = false;

                    try {
                        const response: Response = await fetch('/api/v1/signup', {
                            method: 'POST',
                            body: stringify({
                                name: values.name,
                                email: values.email,
                                password: values.password
                            }),
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                                Accept: '*/*'
                            }
                        })

                        const result: LoginResponse = (await response.json()) as LoginResponse;


                        if (result.error) {
                            setServerError(result.error);
                            err = true;
                        }
                        if (result.user) {
                            setName(result.user.name);
                            setEmail(result.user.email);
                            err = false;
                        }

                    } catch (error) {
                        setServerError("Something went wrong, check the db connection");
                        err = true;
                    }

                    if (!err) {
                        router.push('/emailVerification');
                    }
                }}
            >
                {({
                    isSubmitting,
                    /* and other goodies */
                }) => (
                    <Form>
                        <label className="font-semibold text">
                            <div>Name</div>
                            <Field type="text" name="name" className="input" />
                        </label>
                        <ErrorMessage name="name" component="div" className="text-red-400" />
                        <label className="font-semibold text">
                            <div>Email</div>
                            <Field type="email" name="email" className="input" />
                        </label>
                        <ErrorMessage name="email" component="div" className="text-red-400" />
                        <label className="font-semibold text">
                            <div>Password</div>
                            <Field type="password" name="password" className="input" />
                        </label>
                        <ErrorMessage name="password" component="div" className="text-red-400" />
                        <label className="font-semibold text">
                            <div>repeat password</div>
                            <Field type="password" name="check" className="input" />
                        </label>
                        <ErrorMessage name="check" component="div" className="text-red-400" />
                        <br />
                        <button type="submit" disabled={isSubmitting} className="text border-2 border-black p-1 px-2 rounded-lg mt-3 float-right">
                            Signup
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default SignUp;