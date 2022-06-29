import type { NextPage } from "next";
import { useState } from "react";
import SignUp from "../utils/pages/SignUp";
import SignIn from "../utils/pages/SingIn";

const Home: NextPage = () => {
  const [toggleLogin, setToggleLogin] = useState(true);

  let formBxClasses = "formBx absolute top-0 left-0 w-1/2 h-full flex justify-center items-center";
  let bodyClasses = "w-screen h-4/5 flex items-center justify-center body";
  let SignInFormClasses = "w-full absolute left-0 form";
  let SignUpFormClasses = "w-full absolute left-0 form hideRight";

  if (!toggleLogin) {
    formBxClasses = "formBx absolute top-0 left-1/2 w-1/2 h-full flex justify-center items-center";
    bodyClasses = "w-screen h-4/5 flex items-center justify-center activeBody";
    SignInFormClasses = "w-full absolute left-0 form hideLeft";
    SignUpFormClasses = "w-full absolute left-0 form";
  }

  return (
    <div className="w-screen h-screen">
      <div className="grid w-screen h-1/5 bg-red-300 place-items-center .body">
        <h1 className="align-middle text-7xl font-sans">Moodly</h1>
      </div>
      <div className={bodyClasses}>
        <p className="align-middle font-sans text-center">
          This Webapp aspires to make it possible to record your daily activities in a simple and organized way.
          <br />
          It can help you track your habits and enhance your lifestyle.
        </p>
        <div className="relative m-20 container">
          <div className="absolute blueBg w-full">
            <div className="box SignIn w-1/2 h-full flex flex-col items-center justify-center relative">
              <h2 className="text-white mb-2.5">Already have an account?</h2>
              <button className="signinBtn" onClick={() => { setToggleLogin(true) }}>Sign in</button>
            </div>
            <div className="box SignUp w-1/2 h-full flex flex-col items-center justify-center relative">
              <h2 className="text-white mb-2.5">Don't have an account?</h2>
              <button className="signUpBtn" onClick={() => { setToggleLogin(false) }}>Sign up</button>
            </div>
          </div>
          <div className={formBxClasses}>
            <div className={SignInFormClasses}>
              <SignIn />
            </div>
            <div className={SignUpFormClasses}>
              <SignUp />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
