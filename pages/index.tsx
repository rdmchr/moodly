import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div className="w-screen h-screen">
      <div className="grid w-screen h-1/5 bg-red-300 place-items-center">
        <h1 className="align-middle text-7xl font-sans">Moodly</h1>
      </div>
      <div className="grid w-screen h-1/5 place-items-center">
        <p className="align-middle font-sans text-center">
          This Webapp aspires to make it possible to record your daily activities in a simple and organized way.
          <br/>
          It can help you track your habits and enhance your lifestyle.
        </p>
      </div>
      <div className="grid grid-cols-2 w-screen h-3/5 place-items-center">
        <a className=" grid place-items-center w-1/2 h-2/4 border-2 bg-slate-200 hover:bg-red-300 text-center rounded-3xl" href="login">
          Already have an account?
          <br/>
          Log in
        </a>
        <a className="grid w-1/2 h-2/4 border-2 bg-slate-200 hover:bg-red-300 rounded-3xl place-items-center text-center" href="signup">
          First Time here? 
          <br/>
          Sign Up
        </a>
      </div>
    </div>
  );
};

export default Home;
