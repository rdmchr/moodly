import type { NextPage } from "next";
import Navbar from "../components/navbar";
import { ErrorMessage, Field, Form, Formik } from "Formik";
import userStore from "../dataStores/userStore";
import Link from "next/link";


const Home: NextPage = () => {

  const { name, email, setName, setEmail } = userStore();

  return (
    <Navbar>
      <div className="w-screen h-screen">
            <div className="grid w-screen h-4/5 place-items-center grid-rows-3">
                <Formik
                    initialValues={{ test: '' }}
                    onSubmit={ (values, { setSubmitting }) => {
                      setName(values.test);
                      setSubmitting(false);
                    }}
                >
                    {({
                        isSubmitting,
                        /* and other goodies */
                    }) => (
                        <Form>
                            <label className="font-semibold text">
                                <div>Test</div>
                                <Field type="text" name="test" className="input" />
                            </label>
                            <br/>
                            <button type="submit" disabled={isSubmitting} className="text border-2 border-black p-1 px-2 rounded-lg mt-3 float-right">
                                Launch Bomb
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
            <div>
              {name}
              <br/>
              <Link href="/signup">Free Cookies</Link>
            </div>
        </div>
    </Navbar>
  );
};

export default Home;
