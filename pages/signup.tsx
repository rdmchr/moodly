import type { NextPage } from "next";
import { ErrorMessage, Field, Form, Formik, isObject } from "Formik";
import { stringify, stringifyUrl } from "query-string";

type LoginResponse = {
    error: string;
}

const Login: NextPage = () => {
    return (
        <div className="w-screen h-screen">
            <div className="grid w-screen h-1/5 bg-red-300 place-items-center">
                <h1 className="align-middle text-7xl font-sans">Signup</h1>
            </div>
            <div className="grid w-screen h-4/5 place-items-center grid-rows-2">
                <Formik
                    initialValues={{ name: '', email: '', password: '', check: ''}}
                    validate={values => {
                        const errors: { email?: any, password?: any, name?:any, check?:any } = {};
                        if (!values.email) {
                            errors.email = 'Required'
                        } else if (
                            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                        ) {
                            errors.email = 'Invalid email address';
                        }
                        if(values.password !== values.check) {
                            errors.check = 'The passwords do not match';
                         }
                        return errors;
                    }}
                    onSubmit={ async (values, { setSubmitting }) => {
                        try {
                            const response : Response = await fetch('/api/signup', {
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

                            if(!response.ok) {
                                console.log( await response.json());
                                throw new Error(`Error! status: ${response.status}`);
                            }

                            const result: LoginResponse = (await response.json()) as LoginResponse;
                            console.log('result is: ', JSON.stringify(result, null, 4));
                        } catch (error) {
                            if(error instanceof Error) {
                                console.log('error message: ', error.message);
                            } else {
                                console.log('unexpected error: ', error);
                            }
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
                            <br/>
                            <button type="submit" disabled={isSubmitting} className="text border-2 border-black p-1 px-2 rounded-lg mt-3 float-right">
                                Signup
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default Login;