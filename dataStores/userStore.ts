import create from "zustand";
import { persist } from "zustand/middleware";

interface userDataState {
    name: string,
    email: string,
    setName: (name: string) => void,
    setEmail: (email: string) => void
}

const userData = create<userDataState>(
    (set) => ({
        name: "NotGerold",
        email: "",

        setName: (params: string) => {
            set((state) => ({
                name: params
            }));
            console.log(params);
        },
        setEmail: (params: string) => {
            set((state) => ({
                email: params
            }))
        }
    }),
);

export default userData;