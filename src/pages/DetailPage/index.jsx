import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMailById, updateMail } from "components/apis/mailsApi"; // updateMail을 가져옵니다
import moment from "moment";
import { FaStar, FaRegStar } from "react-icons/fa"; // 아이콘 가져오기

const DetailPage = ({ updateCounts, mails }) => {
  const { id } = useParams();
  const [mail, setMail] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMail = async () => {
      try {
        const data = await getMailById(id);
        setMail(data);
      } catch (error) {
        console.error("Error fetching mail:", error);
      }
    };

    fetchMail();
  }, [id]);

  const toggleImportant = async (id, event) => {
    event.stopPropagation();
    const updatedMail = { ...mail, isImportant: !mail.isImportant };
    setMail(updatedMail);

    try {
      await updateMail(id, { isImportant: updatedMail.isImportant });

      // 메일 데이터를 업데이트하여 최신 카운트 계산
      const updatedMails = mails.map((m) =>
        m.id === id ? { ...m, isImportant: updatedMail.isImportant } : m
      );

      // 카운트 업데이트
      const counts = {
        total: updatedMails.length,
        preparing: updatedMails.filter((mail) => mail.statue === "preparing")
          .length,
        pending: updatedMails.filter((mail) => mail.statue === "pending")
          .length,
        completed: updatedMails.filter((mail) => mail.statue === "completed")
          .length,
        refuse: updatedMails.filter((mail) => mail.statue === "refuse").length,
        important: updatedMails.filter((mail) => mail.isImportant).length,
        trash: updatedMails.filter((mail) => mail.statue === "휴지통").length,
      };
      updateCounts(counts);
    } catch (error) {
      console.error("Error updating important status:", error);
    }
  };

  if (!mail) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col lowDesktop:min-w-[91.875rem] max-lg:w-[71rem]">
      <div className="lowDesktop:min-w-[91.875rem] max-lg:w-[69rem] h-[3.75rem] pt-[24px] pb-2 justify-between items-center inline-flex mb-[0.625rem] ml-[2rem] pr-[2.625rem] max-lg:pr-[0px]">
        <div className="w-[37.5rem] text-zinc-800 text-lg font-bold font-['Pretendard'] leading-[1.875rem]">
          <div
            onClick={() => navigate(-1)}
            className="w-[37.5rem] flex items-center text-zinc-800 text-lg font-bold font-['Pretendard'] leading-[1.875rem]"
          >
            <span>
              <svg
                className="cursor-pointer mr-[5px]"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <g id="Icon">
                  <path
                    id="Vector 2176 (Stroke)"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M14.7803 6.21967C15.0732 6.51256 15.0732 6.98744 14.7803 7.28033L10.4357 11.625L14.7803 15.9697C15.0732 16.2626 15.0732 16.7374 14.7803 17.0303C14.4874 17.3232 14.0126 17.3232 13.7197 17.0303L8.84467 12.1553C8.55178 11.8624 8.55178 11.3876 8.84467 11.0947L13.7197 6.21967C14.0126 5.92678 14.4874 5.92678 14.7803 6.21967Z"
                    fill="#121826"
                  ></path>
                </g>
              </svg>
            </span>
            <span>해결 진행 중 의뢰</span>
          </div>
        </div>
        <div className="w-60 h-8 relative">
          <div className="w-60 pl-4 pr-3 py-1.5 left-0 top-0 absolute rounded border-solid border border-slate-200 justify-between items-center inline-flex">
            <input
              placeholder="Placeholder"
              className="focus:outline-none text-zinc-800 text-sm font-normal font-['Pretendard'] leading-tight"
            />
          </div>
        </div>
      </div>
      <div className="border-solid bg-white border-b border-slate-200 ml-[2rem]"></div>
      <div className="flex items-center mt-[1.25rem] ml-[2rem] min-w-[1000px]">
        <div className="flex min-w-[500px]">
          <div className="text-zinc-800 text-base font-medium font-['Pretendard'] leading-normal">
            {mail.title}
          </div>
        </div>
        <div className="lowDesktop:ml-[55rem] max-lg:ml-[25rem] flex"></div>
      </div>
      <div>
        <div className="w-[34.6875rem] h-[1.0625rem] ml-[3.75rem] mt-[0.5rem] justify-start items-center gap-2 inline-flex">
          <div className="text-gray-500 text-sm font-normal font-['Pretendard'] leading-tight">
            <span onClick={(e) => toggleImportant(mail.id, e)}>
              {mail.isImportant ? (
                <FaStar style={{ color: "gold" }} />
              ) : (
                <FaRegStar style={{ color: "#CDD8E2" }} />
              )}
            </span>
            {mail.anytime} ∙ {mail.category}
          </div>
          <div className="w-px h-2.5 bg-zinc-300"></div>
          <div className="justify-start items-center gap-1.5 flex">
            <div className="text-gray-500 text-sm font-normal font-['Pretendard']">
              의뢰자 :
            </div>
            <div className="text-gray-500 text-sm font-semibold font-['Pretendard']">
              홍길동
            </div>
          </div>
        </div>
      </div>
      <div className="w-[32.0625rem] ml-[3.75rem] mt-[1.25rem] h-[4.125rem] px-4 py-3 bg-slate-100 bg-opacity-30 rounded-md border border-solid border-slate-200 flex-col justify-start items-start gap-0.5 inline-flex">
        <div className="justify-start items-start gap-1 inline-flex">
          <div className="text-gray-500 text-sm font-normal font-['Pretendard'] leading-tight">
            의뢰 요청 시간 :
          </div>
          <div className="justify-start items-start gap-1 flex">
            <div className="text-gray-500 text-sm font-semibold font-['Pretendard'] leading-tight">
              {moment(mail.sentAt).format("YYYY년 MM월 DD일 (dd)")}
            </div>
            <div className="text-gray-500 text-sm font-semibold font-['Pretendard'] leading-tight">
              {moment(mail.sentAt).format("LT")}
            </div>
          </div>
        </div>
        <div className="justify-start items-start gap-1 inline-flex">
          <div className="text-gray-500 text-sm font-normal font-['Pretendard'] leading-tight">
            제한 시간 :
          </div>
          <div className="justify-start items-start gap-1 flex">
            <div className="text-gray-500 text-sm font-semibold font-['Pretendard'] leading-tight">
              {moment(mail.sentAt)
                .add(mail.time, "hours")
                .format("YYYY년 MM월 DD일 (dd) LT")}
            </div>
          </div>
        </div>
      </div>
      <div className="min-w-[50rem] h-[6.375rem] relative border-solid ml-[2rem] border-t border-slate-200 mt-[20px]">
        <div className="left-[1.125rem] top-[2.875rem] absolute justify-start items-start gap-2 inline-flex">
          <div className="px-2 py-1 bg-slate-100 bg-opacity-80 rounded justify-start items-start gap-1 flex">
            <div className="text-neutral-600 text-[0.8125rem] font-normal font-['Pretendard'] leading-normal">
              파일_1.pdf
            </div>
            <div className="text-slate-400 text-[0.8125rem] font-normal font-['Pretendard'] leading-normal">
              (35.2MB)
            </div>
          </div>
          <div className="px-2 py-1 bg-slate-100 bg-opacity-80 rounded justify-start items-start gap-1 flex">
            <div className="w-6 h-6 relative"></div>
            <div className="text-neutral-600 text-[0.8125rem] font-normal font-['Pretendard'] leading-normal">
              파일_1.pdf
            </div>
            <div className="text-slate-400 text-[0.8125rem] font-normal font-['Pretendard'] leading-normal">
              (35.2MB)
            </div>
          </div>
          <div className="px-2 py-1 bg-slate-100 bg-opacity-80 rounded justify-start items-start gap-1 flex">
            <div className="w-6 h-6 relative"></div>
            <div className="text-neutral-600 text-[0.8125rem] font-normal font-['Pretendard'] leading-normal">
              파일_1.pdf
            </div>
            <div className="text-slate-400 text-[0.8125rem] font-normal font-['Pretendard'] leading-normal">
              (35.2MB)
            </div>
          </div>
        </div>
        <div className="left-0 top-[1rem] absolute justify-start items-center gap-1 inline-flex">
          <div className="justify-start items-center gap-0.5 flex">
            <div className="text-neutral-600 text-sm font-semibold font-['Pretendard'] leading-normal">
              첨부파일 3개
            </div>
          </div>
          <div className="text-slate-400 text-sm font-normal font-['Pretendard'] leading-normal">
            (35.2MB)
          </div>
        </div>
        <div className="left-[10.125rem] top-[1.125rem] absolute text-blue-500 text-sm font-medium font-['Pretendard'] leading-tight">
          모두 저장
        </div>
      </div>
      <div className="ml-[2.125rem] w-full h-[12.5rem] relative border-t border-solid border-slate-100">
        <div className="text-zinc-800 text-base font-normal font-['Pretendard'] mt-[24px]">
          {mail.content}
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
