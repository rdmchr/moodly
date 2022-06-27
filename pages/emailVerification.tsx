import type { NextPage } from "next";
import userStore from "../dataStores/userStore";

const Home: NextPage = () => {
    const { name, email, setName, setEmail } = userStore();

    return (
        <div className="w-screen h-screen">
            <div className="grid w-screen h-1/5 bg-red-300 place-items-center">
                <h1 className="align-middle text-7xl font-sans">Verification</h1>
            </div>
            <div>
                {name}
                <br/>
                {email}
            </div>
        </div>
    );
};

export default Home;