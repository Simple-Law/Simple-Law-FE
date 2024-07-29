import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchMails, getMailById, updateMail } from "apis/mailsApi";
import moment from "moment";
import "moment/locale/ko";
import { FaStar, FaRegStar } from "react-icons/fa";
import { Button, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setData, setMails, updateCounts, toggleImportant } from "../../redux/actions/mailActions";
import styled from "styled-components";
import { DetailStatusTag } from "components/tags/StatusTag";
import SvgSearch from "components/Icons/Search";
import SvgArrowDown from "components/Icons/ArrowDown";
import ConfirmModal from "components/modal/ConfirmModal";

const { Search } = Input;

const DetailPage = () => {
  const { id } = useParams();

  const [modalInfo, setModalInfo] = useState({ isVisible: false, title: "", onOk: () => {} });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector(state => state.auth.user) || {};
  const userType = user.type || "guest";
  const [mailData, setMailData] = useState();

  useEffect(() => {
    moment.locale("ko");
    if (!mailData) {
      const fetchMail = async () => {
        try {
          const fetchedMail = await getMailById(userType, id);
          console.log("fetchedMail", fetchedMail);
          setMailData(fetchedMail);
        } catch (error) {
          console.error("Error fetching mail by id:", error);
        }
      };
      fetchMail();
    }
  }, [id, mailData, userType]);
  console.log("mailData", mailData);

  const handleToggleImportant = (id, event) => {
    event.stopPropagation();
    dispatch(toggleImportant(id));
  };
  const handleReject = async () => {
    setModalInfo({ ...modalInfo, isVisible: false });
    try {
      await updateMail(id, { status: "trash" });
      const { data: mailData } = await fetchMails();
      dispatch(setData(mailData));
      dispatch(setMails(mailData.filter(mail => mail.status !== "trash")));
      dispatch(updateCounts(mailData));
      navigate("/board");
    } catch (error) {
      console.error("Error moving mail to trash:", error);
    }
  };

  const handleApprove = async () => {
    setModalInfo({ ...modalInfo, isVisible: false });
    try {
      await updateMail(id, { isApproved: true, detailStatus: "approved" });
      const { data: mailData } = await fetchMails();
      dispatch(setData(mailData));
      dispatch(setMails(mailData));
      dispatch(updateCounts(mailData));
    } catch (error) {
      console.error("Error updating mail status:", error);
    }
  };

  const handleReplyClick = () => {
    navigate(`/mail/quest/${id}/reply`);
  };

  const sortedReplies = useMemo(() => {
    return mailData
      ? (mailData.replies || []).slice().sort((a, b) => moment(b.requestAtDesc).diff(moment(a.requestAtDesc)))
      : [];
  }, [mailData]);

  if (!mailData) {
    return <div>Loading...</div>;
  }

  const onSearch = (value, _e, info) => console.log(info?.source, value);

  return (
    <>
      <div className='w-full'>
        <div className='border-solid bg-white border-b border-slate-200 text-zinc-800 text-lg font-bold  flex items-end justify-between px-8 pt-6 pb-3'>
          <div
            onClick={() => navigate(-1)}
            className='cursor-pointer flex items-center text-zinc-800 text-lg font-bold  leading-[1.875rem]'
          >
            <SvgArrowDown className='rotate-90' />
            <span></span>
          </div>
          <PageSearch
            placeholder='Placeholder'
            onSearch={onSearch}
            enterButton={<SvgSearch />}
            style={{
              width: 268,
            }}
          />
        </div>
        <div className='mx-8 mt-[20px]'>
          <div className='flex items-center gap-1'>
            <span onClick={e => handleToggleImportant(mailData.caseKey, e)} className='cursor-pointer'>
              {mailData.isImportant ? <FaStar style={{ color: "gold" }} /> : <FaRegStar style={{ color: "#CDD8E2" }} />}
            </span>
            <div className='text-zinc-800 text-base font-medium  leading-normal'>{mailData.title}</div>
            {mailData.detailStatus && <DetailStatusTag status={mailData.detailStatus} />}
          </div>

          <div className='justify-start items-center gap-2 flex pl-[20px] mb-[18px] mt-2'>
            <div className='text-gray-500 text-sm font-normal leading-tight'>
              {mailData.anytime} ∙ {mailData.category}
            </div>
            <div className='w-px h-2.5 bg-zinc-300'></div>
            <div className='justify-start items-center gap-1.5 flex'>
              <div className='text-gray-500 text-sm font-normal '>의뢰자 :</div>
              <div className='text-gray-500 text-sm font-semibold '>홍길동</div>
            </div>
            {mailData.status === "contactRequest" && !mailData.isApproved && (
              // TODO: DY - 답변 달리면 해결 완료로 이동 -> 추가질문 버튼 생성 :: 의뢰자가 의뢰에대한 종료 처리해야만 종료된 의뢰
              // TODO: DY - 변호사 승인하면 승인완료 뱃지 달리기 거절하면 휴지통으로
              <div className='flex gap-2'>
                <p
                  className='cursor-pointer text-red-500'
                  onClick={() => setModalInfo({ isVisible: true, title: "거절 확인", onOk: handleReject })}
                >
                  거절
                </p>
                <p
                  className='cursor-pointer text-green-500'
                  onClick={() => setModalInfo({ isVisible: true, title: "승인 확인", onOk: handleApprove })}
                >
                  승인
                </p>
              </div>
            )}
            {userType === "LAWYER" && mailData.status === "resolving" && (
              <div>
                <Button type='primary' onClick={handleReplyClick}>
                  답변
                </Button>
              </div>
            )}
          </div>

          <div className='border-b'>
            <div className='px-4 py-3 bg-slate-100 bg-opacity-30 rounded-md border border-solid border-slate-200 inline-block ml-[20px] mb-[20px]'>
              <div className='text-gray-500 text-sm font-normal leading-tight'>
                의뢰 요청 시간
                <span className='text-gray-500 text-sm font-normal px-1'>:</span>
                <span className='text-gray-500 text-sm font-semibold leading-tight'>
                  {moment(mailData.sentAt).format("YYYY년 MM월 DD일 (dd)")}
                  {moment(mailData.sentAt).format("A h:mm").replace("AM", "오전").replace("PM", "오후")}
                </span>
              </div>
              <div className='text-gray-500 text-sm font-normal  leading-tight'>
                배정 완료 후 작업 기한
                <span className='text-gray-500 text-sm font-normal px-1'>:</span>
                <span className='text-gray-500 text-sm font-semibold leading-tight'>
                  {moment(mailData.sentAt)
                    .add(mailData.time, "hours")
                    .format("YYYY년 MM월 DD일 (dd) A h:mm")
                    .replace("AM", "오전")
                    .replace("PM", "오후")}
                </span>
              </div>
            </div>
          </div>

          <div className='mt-4 mb-6 pl-[20px]'>
            <div className='justify-start items-center gap-3 flex mb-[10px]'>
              <div className='text-gray-500 text-sm font-semibold  leading-normal'>
                첨부파일 3개
                <span className='text-slate-400 text-sm font-normal  leading-normal'>(35.2MB)</span>
              </div>
              <div className='text-blue-500 text-sm font-medium  leading-tight'>모두 저장</div>
            </div>
            <div className='justify-start items-start gap-2 inline-flex'>
              <div className='px-2 py-1 bg-slate-100 bg-opacity-80 rounded justify-start items-start gap-1 flex'>
                <div className='text-gray-500 text-[0.8125rem] font-normal  leading-normal'>파일_1.pdf</div>
                <div className='text-slate-400 text-[0.8125rem] font-normal  leading-normal'>(35.2MB)</div>
              </div>
              <div className='px-2 py-1 bg-slate-100 bg-opacity-80 rounded justify-start items-start gap-1 flex'>
                <div className='text-gray-500 text-[0.8125rem] font-normal  leading-normal'>파일_1.pdf</div>
                <div className='text-slate-400 text-[0.8125rem] font-normal  leading-normal'>(35.2MB)</div>
              </div>
              <div className='px-2 py-1 bg-slate-100 bg-opacity-80 rounded justify-start items-start gap-1 flex'>
                <div className='text-gray-500 text-[0.8125rem] font-normal  leading-normal'>파일_1.pdf</div>
                <div className='text-slate-400 text-[0.8125rem] font-normal  leading-normal'>(35.2MB)</div>
              </div>
            </div>
          </div>

          <div className='text-zinc-800 text-base font-normal pt-[24px] pl-[20px]  mt-[24px] border-t border-solid border-slate-100'>
            <div dangerouslySetInnerHTML={{ __html: mailData.content }} />
          </div>

          <div>
            {sortedReplies.length > 0 ? (
              sortedReplies.map((reply, index) => (
                <div key={index} className='w-full h-[12.5rem] relative mt-4'>
                  <div className='mt-2 p-2 bg-gray-100 rounded-md'>
                    <div className='text-gray-700' dangerouslySetInnerHTML={{ __html: reply.content }} />
                    <div className='text-gray-500 text-sm'>
                      {moment(reply.sentAt).format("YYYY년 MM월 DD일 A h:mm")}
                    </div>
                    <Link to={`/requestion/${mailData.id}`}>
                      <Button type='link'>재질문하기</Button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className='text-gray-500'></div>
            )}
          </div>
        </div>
      </div>
      <ConfirmModal
        title={modalInfo.title}
        visible={modalInfo.isVisible}
        onOk={modalInfo.onOk}
        onCancel={() => setModalInfo({ ...modalInfo, isVisible: false })}
      >
        <p>{modalInfo.title}하시겠습니까?</p>
      </ConfirmModal>
    </>
  );
};

const PageSearch = styled(Search)`
  width: 268px;
  & .ant-input {
    height: 40px;
    border-radius: 4px 0 0 4px;
    &:hover {
      border-color: rgb(228, 233, 241);
    }
    &:focus {
      border-color: rgb(228, 233, 241);
    }
  }
  &:hover {
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
  }
  & .ant-btn-primary {
    height: 40px;
    border-radius: 0 4px 4px 0;
    border-width: 1px;
    border-style: solid;
    border-color: rgb(228, 233, 241);
    border-left: none;
    background: #fff;
    &:hover {
      background: #fff !important;
    }
    & svg {
      width: 16px;
      height: 16px;
    }
  }
  &.ant-input-search {
    .ant-input-group-addon {
      background: none;
      border: none;
    }
    .ant-input-wrapper {
      background: #ffffff;
      border: 1px solid rgb(228, 233, 241);
      border-radius: 4px;
    }
  }
`;

export default DetailPage;
