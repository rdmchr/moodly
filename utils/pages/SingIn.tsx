import type { NextPage } from "next";
import { ErrorMessage, Field, Form, Formik, FormikProps, FormikValues } from "Formik";
import { stringify, stringifyUrl } from "query-string";
import userStore from "../../dataStores/userStore";
import { LoginResponse, ServerErrorPopUp } from "./SignUp";
import { NextRouter, useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

type Props = {
    setName: (name: string) => void,
    setEmail: (email: string) => void,
    router: NextRouter,
    setServerError: (param: string) => void,
}
type FormValues = {
    email: string,
    password: string
}

function SignIn() {
    const { name, email, setName, setEmail } = userStore();
    const router = useRouter();
    const [serverError, setServerError] = useState("");

    function alterServerError(param: string) {
        useEffect(() => {
            setServerError(param);
        }, []);
    }

    return (
        <div>
            {serverError ? <ServerErrorPopUp message={serverError} alter={alterServerError} /> :
                <SignInFormInternal setName={setName} setEmail={setEmail} router={router} setServerError={setServerError} />}
        </div>
    );
};

function SignInFormInternal({ setName, setEmail, router, setServerError }: Props) {

    const signInFormRef = useRef<FormikProps<FormValues>>(null);
    useEffect(() => {
        signInFormRef.current?.resetForm();
    });

    return (
        <div>
            <Formik
                initialValues={{ email: '', password: '' }}
                innerRef={signInFormRef}
                validate={values => {
                    const errors: { email?: any, password?: any } = {};
                    if (!values.email) {
                        errors.email = 'Required'
                    } else if (
                        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email as string)
                    ) {
                        errors.email = 'invalid email address';
                    }
                    return errors;
                }}
                onSubmit={async (values, { setSubmitting }) => {
                    let err = false;
                    let verified = false;

                    try {
                        const response: Response = await fetch('/api/v1/login', {
                            method: 'POST',
                            body: stringify({
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
                            setServerError(result.error as string);
                            err = true;
                        }
                        if (result.user) {
                            setName(result.user.name);
                            setEmail(result.user.email);
                            verified = result.user.verified;
                            err = false;
                        }

                    } catch (error) {
                        setServerError("Something went wrong, check the db connection");
                        err = true;
                    }

                    if (!err) {
                        if (verified) {
                            router.push('/home');
                            return;
                        }
                        router.push('/emailVerification');
                        return;
                    }
                }}
            >
                {({
                    isSubmitting,
                    /* and other goodies */
                }) => (
                    <Form>
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
                        <br />
                        <button type="submit" disabled={isSubmitting} className="text border-2 border-black p-1 px-2 rounded-lg mt-3 float-right">
                            Login
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default SignIn;