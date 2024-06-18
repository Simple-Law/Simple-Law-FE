import React from "react";
const SvgKakao = props => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 20 20'
    width={props.width || 20}
    height={props.height || 20}
    fill='none'
    {...props}
  >
    <g clipPath='url(#kakao_svg__a)'>
      <mask
        id='kakao_svg__b'
        width={170}
        height={120}
        x={-73}
        y={-72}
        maskUnits='userSpaceOnUse'
        style={{
          maskType: "luminance",
        }}
      >
        <path fill='#fff' d='M-72.73-71.026H96.292V47.409H-72.73z' />
      </mask>
      <g mask='url(#kakao_svg__b)'>
        <path
          fill='#3C1E1E'
          d='M10 1.032C4.59 1.032.201 4.466.201 8.703c0 2.722 1.818 5.112 4.547 6.476l-.924 3.415a.28.28 0 0 0 .071.292.28.28 0 0 0 .2.082.3.3 0 0 0 .17-.064l3.97-2.658c.577.081 1.166.128 1.765.128 5.412 0 9.8-3.433 9.8-7.67 0-4.238-4.389-7.672-9.8-7.672'
        />
      </g>
    </g>
    <defs>
      <clipPath id='kakao_svg__a'>
        <path fill='#fff' d='M0 0h20v20H0z' />
      </clipPath>
    </defs>
  </svg>
);

export default SvgKakao;
