const SvgUpload = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={60}
    height={60}
    fill="none"
    {...props}
  >
    <path
      fill="#E2E3E5"
      fillRule="evenodd"
      d="M12.5 18.5h8.75c.69 0 1.25.661 1.25 1.477s-.56 1.477-1.25 1.477H15V30h32.5L50 40V25.25H38.75a1.25 1.25 0 1 1 0-2.5H52.5V49h-.25l.25 1h-40l-5-20h5z"
      clipRule="evenodd"
    />
    <path
      fill="#E2E3E5"
      fillRule="evenodd"
      d="m30 6-7.5 10h3.75v10h7.5V16h3.75z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgUpload;
