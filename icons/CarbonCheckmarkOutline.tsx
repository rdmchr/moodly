import React, { SVGProps } from 'react'

export function CarbonCheckmarkOutline(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 32 32"
      {...props}
    >
      <path
        d="m14 21.414l-5-5.001L10.413 15L14 18.586L21.585 11L23 12.415l-9 8.999z"
      ></path>
      <path
        d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2Zm0 26a12 12 0 1 1 12-12a12 12 0 0 1-12 12Z"
      ></path>
    </svg>
  );
}
export default CarbonCheckmarkOutline
