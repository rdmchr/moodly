import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import CarbonCheckmarkOutline from "../icons/CarbonCheckmarkOutline";
import CarbonCloseOutline from "../icons/CarbonCloseOutline";

interface Props {
  error: string;
}

const Verify: NextPage<Props> = ({error}) => {
  const router = useRouter();
  const token = router.query.token as string;
  const userId = router.query.userId as string;

  return (
    <div className="w-screen h-screen">
      {error ? (
        <div className="w-screen h-screen flex items-center justify-center">
          <div className="w-max h-max">
            <CarbonCloseOutline className="mx-auto text-5xl mb-3" />
            <p className="text-lg">{error}</p>
          </div>
        </div>
      ) : (
        <div className="w-screen h-screen flex items-center justify-center">
          <div className="w-max h-max flex flex-col items-center">
            <CarbonCheckmarkOutline className="mx-auto text-5xl mb-3" />
            <p className="text-lg">Successfully verified your email.</p>
            <Link href="/login" replace={true} passHref>
              <span className="text-lg text-blue-400 w-max cursor-pointer">
                Click here to login
              </span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

Verify.getInitialProps = async (ctx) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL as string;
  const { token, userId } = ctx.query;
  const data = await fetch(`${baseUrl}/api/verify`, {
    method: "POST",
    body: JSON.stringify({
      token,
      userId,
    }),
  });
  const json = await data.json();
  if (!data.ok) {
    if (json.error) {
      return { error: json.error };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
  return { error: "" };
};

export default Verify;
