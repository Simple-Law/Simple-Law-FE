import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";

const DetailPage = () => {
  const { id } = useParams(); // URL에서 글번호를 가져옵니다
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/mails");
        const allData = response.data;
        const selectedDetail = allData.find((item) => item.id === id);
        setDetail(selectedDetail);
      } catch (error) {
        console.error("Error fetching detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.patch(`http://localhost:4000/mails/${id}`, {
        statue: "휴지통",
      });
      navigate("/board"); // 목록 페이지로 이동
    } catch (error) {
      console.error("Error moving to trash:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!detail) {
    return <div>No data available</div>;
  }

  return (
    <div className="pt-16">
      {/* <h1>{detail.title}</h1>
      <p>{detail.content}</p>
      <p>
        <strong>분야:</strong> {detail.category}
      </p>
      <p>
        <strong>상태:</strong> {detail.statue}
      </p>
      <p>
        <strong>의뢰 요청시간:</strong>{" "}
        {moment(detail.sentAt).format("YYYY. MM. DD")}
      </p>
      <button onClick={handleDelete}>글 삭제</button> */}
      <div class="ml-[260px] mt-[60px] flex flex-col lowDesktop:min-w-[91.875rem] max-lg:w-[71rem]">
        <div class="lowDesktop:min-w-[91.875rem] max-lg:w-[69rem] h-[3.75rem] pt-[24px] pb-2 justify-between items-center inline-flex mb-[0.625rem] ml-[2rem] pr-[2.625rem] max-lg:pr-[0px]">
          <div class="w-[37.5rem] text-zinc-800 text-lg font-bold font-['Pretendard'] leading-[1.875rem]">
            <div class="w-[37.5rem] flex items-center text-zinc-800 text-lg font-bold font-['Pretendard'] leading-[1.875rem]">
              <span>
                <svg
                  class="cursor-pointer mr-[5px]"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <g id="Icon">
                    <path
                      id="Vector 2176 (Stroke)"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M14.7803 6.21967C15.0732 6.51256 15.0732 6.98744 14.7803 7.28033L10.4357 11.625L14.7803 15.9697C15.0732 16.2626 15.0732 16.7374 14.7803 17.0303C14.4874 17.3232 14.0126 17.3232 13.7197 17.0303L8.84467 12.1553C8.55178 11.8624 8.55178 11.3876 8.84467 11.0947L13.7197 6.21967C14.0126 5.92678 14.4874 5.92678 14.7803 6.21967Z"
                      fill="#121826"
                    ></path>
                  </g>
                </svg>
              </span>
              <span>해결 진행 중 의뢰</span>
            </div>
          </div>
          <div class="w-60 h-8 relative">
            <div class="w-60 pl-4 pr-3 py-1.5 left-0 top-0 absolute rounded border-solid border border-slate-200 justify-between items-center inline-flex">
              <input
                placeholder="Placeholder"
                class="focus:outline-none text-zinc-800 text-sm font-normal font-['Pretendard'] leading-tight"
              />
            </div>
          </div>
        </div>
        <div class="border-solid bg-white border-b border-slate-200 ml-[2rem]"></div>
        <div class="flex items-center mt-[1.25rem] ml-[2rem] min-w-[1000px]">
          <div class="flex min-w-[500px]">
            <div class="text-zinc-800 text-base font-medium font-['Pretendard'] leading-normal">
              직원 고용에 따른 근로 계약서 초안 검토 요청
            </div>
          </div>
          <div class="lowDesktop:ml-[55rem] max-lg:ml-[25rem] flex"></div>
        </div>
        <div>
          <div class="w-[34.6875rem] h-[1.0625rem] ml-[3.75rem] mt-[0.5rem] justify-start items-center gap-2 inline-flex">
            <div class="text-gray-500 text-sm font-normal font-['Pretendard'] leading-tight">
              약관 검토/작성 ∙ 이용약관 검토/작성
            </div>
            <div class="w-px h-2.5 bg-zinc-300"></div>
            <div class="justify-start items-center gap-1.5 flex">
              <div class="text-gray-500 text-sm font-normal font-['Pretendard']">
                의뢰자 :
              </div>
              <div class="text-gray-500 text-sm font-semibold font-['Pretendard']">
                홍길동
              </div>
            </div>
          </div>
        </div>
        <div class="w-[32.0625rem] ml-[3.75rem] mt-[1.25rem] h-[4.125rem] px-4 py-3 bg-slate-100 bg-opacity-30 rounded-md border border-solid border-slate-200 flex-col justify-start items-start gap-0.5 inline-flex">
          <div class="justify-start items-start gap-1 inline-flex">
            <div class="text-gray-500 text-sm font-normal font-['Pretendard'] leading-tight">
              의뢰 요청 시간 :
            </div>
            <div class="justify-start items-start gap-1 flex">
              <div class="text-gray-500 text-sm font-semibold font-['Pretendard'] leading-tight">
                2023년 12월 7일 (목)
              </div>
              <div class="text-gray-500 text-sm font-semibold font-['Pretendard'] leading-tight">
                오후 04:06
              </div>
            </div>
          </div>
          <div class="justify-start items-start gap-1 inline-flex">
            <div class="text-gray-500 text-sm font-normal font-['Pretendard'] leading-tight">
              제한 시간 :
            </div>
            <div class="justify-start items-start gap-1 flex">
              <div class="text-gray-500 text-sm font-semibold font-['Pretendard'] leading-tight">
                2023년 12월 9일 (토) 오후 04:06
              </div>
            </div>
          </div>
        </div>
        <div class="min-w-[50rem] h-[6.375rem] relative border-solid ml-[2rem] border-t border-slate-200 mt-[20px]">
          <div class="left-[1.125rem] top-[2.875rem] absolute justify-start items-start gap-2 inline-flex">
            <div class="px-2 py-1 bg-slate-100 bg-opacity-80 rounded justify-start items-start gap-1 flex">
              <div class="text-neutral-600 text-[0.8125rem] font-normal font-['Pretendard'] leading-normal">
                파일_1.pdf
              </div>
              <div class="text-slate-400 text-[0.8125rem] font-normal font-['Pretendard'] leading-normal">
                (35.2MB)
              </div>
            </div>
            <div class="px-2 py-1 bg-slate-100 bg-opacity-80 rounded justify-start items-start gap-1 flex">
              <div class="w-6 h-6 relative"></div>
              <div class="text-neutral-600 text-[0.8125rem] font-normal font-['Pretendard'] leading-normal">
                파일_1.pdf
              </div>
              <div class="text-slate-400 text-[0.8125rem] font-normal font-['Pretendard'] leading-normal">
                (35.2MB)
              </div>
            </div>
            <div class="px-2 py-1 bg-slate-100 bg-opacity-80 rounded justify-start items-start gap-1 flex">
              <div class="w-6 h-6 relative"></div>
              <div class="text-neutral-600 text-[0.8125rem] font-normal font-['Pretendard'] leading-normal">
                파일_1.pdf
              </div>
              <div class="text-slate-400 text-[0.8125rem] font-normal font-['Pretendard'] leading-normal">
                (35.2MB)
              </div>
            </div>
          </div>
          <div class="left-0 top-[1rem] absolute justify-start items-center gap-1 inline-flex">
            <div class="justify-start items-center gap-0.5 flex">
              <div class="text-neutral-600 text-sm font-semibold font-['Pretendard'] leading-normal">
                첨부파일 3개
              </div>
            </div>
            <div class="text-slate-400 text-sm font-normal font-['Pretendard'] leading-normal">
              (35.2MB)
            </div>
          </div>
          <div class="left-[10.125rem] top-[1.125rem] absolute text-blue-500 text-sm font-medium font-['Pretendard'] leading-tight">
            모두 저장
          </div>
        </div>
        <div class="ml-[2.125rem] w-full h-[12.5rem] relative border-t border-solid border-slate-100">
          <div class="text-zinc-800 text-base font-normal font-['Pretendard'] mt-[24px]">
            의뢰내용영역
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
