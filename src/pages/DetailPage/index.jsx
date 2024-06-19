import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchMails, getMailById, updateMail } from "apis/mailsApi";
import moment from "moment";
import "moment/locale/ko";
import { FaStar, FaRegStar } from "react-icons/fa";
import { Button, Modal, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setData, setMails, updateCounts } from "actions/mailActions";
import styled from "styled-components";
import StatusTag from "components/Tags";
import SvgSearch from "components/Icons/Search";
import SvgArrowDown from "components/Icons/ArrowDown";

const { Search } = Input;
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

const DetailPage = () => {
  const { id } = useParams();
  const [mail, setMail] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const mails = useSelector(state => state.mail.mails);

  useEffect(() => {
    moment.locale("ko");
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
      const { data: mailData } = await fetchMails();

      dispatch(setData(mailData));
      dispatch(updateCounts(mailData));
    } catch (error) {
      console.error("Error updating important status:", error);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    setIsModalVisible(false);
    try {
      await updateMail(id, { status: "휴지통" });
      const { data: mailData } = await fetchMails();
      dispatch(setData(mailData));
      dispatch(setMails(mailData.filter(mail => mail.status !== "휴지통")));
      dispatch(updateCounts(mailData));
      navigate("/board");
    } catch (error) {
      console.error("Error moving mail to trash:", error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  if (!mail) {
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
            <span>해결 진행 중 의뢰</span>
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
            <span onClick={e => toggleImportant(mail.id, e)}>
              {mail.isImportant ? <FaStar style={{ color: "gold" }} /> : <FaRegStar style={{ color: "#CDD8E2" }} />}
            </span>
            <div className='text-zinc-800 text-base font-medium  leading-normal'>{mail.title}</div>
            <StatusTag status={mail.status} />
          </div>

          <div className='justify-start items-center gap-2 flex pl-[20px] mb-[18px] mt-2'>
            <div className='text-gray-500 text-sm font-normal leading-tight'>
              {mail.anytime} ∙ {mail.category}
            </div>
            <div className='w-px h-2.5 bg-zinc-300'></div>
            <div className='justify-start items-center gap-1.5 flex'>
              <div className='text-gray-500 text-sm font-normal '>의뢰자 :</div>
              <div className='text-gray-500 text-sm font-semibold '>홍길동</div>
            </div>
            <p onClick={showModal}>삭제</p>
          </div>

          <div className='border-b'>
            <div className='px-4 py-3 bg-slate-100 bg-opacity-30 rounded-md border border-solid border-slate-200 inline-block ml-[20px] mb-[20px]'>
              <div className='text-gray-500 text-sm font-normal leading-tight'>
                의뢰 요청 시간
                <span className='text-gray-500 text-sm font-normal px-1'>:</span>
                <span className='text-gray-500 text-sm font-semibold leading-tight'>
                  {moment(mail.sentAt).format("YYYY년 MM월 DD일 (dd)")}
                  {moment(mail.sentAt).format("A h:mm").replace("AM", "오전").replace("PM", "오후")}
                </span>
              </div>
              <div className='text-gray-500 text-sm font-normal  leading-tight'>
                배정 완료 후 작업 기한
                <span className='text-gray-500 text-sm font-normal px-1'>:</span>
                <span className='text-gray-500 text-sm font-semibold leading-tight'>
                  {moment(mail.sentAt)
                    .add(mail.time, "hours")
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
            <div dangerouslySetInnerHTML={{ __html: mail.content }} />
          </div>

          <div>
            {mail.replies && mail.replies.length > 0 ? (
              mail.replies.map((reply, index) => (
                <div key={index} className='w-full h-[12.5rem] relative  mt-4'>
                  <div className='mt-2 p-2 bg-gray-100 rounded-md'>
                    <div className='text-gray-700'>{reply.content}</div>
                    <div className='text-gray-500 text-sm'>
                      {moment(reply.createdAt).format("YYYY년 MM월 DD일 A h:mm")}
                    </div>
                    <Link to={`/requestion/${mail.id}`}>
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
      <Modal title='삭제 확인' open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <p>진짜로 삭제하시겠습니까?</p>
      </Modal>
    </>
  );
};

export default DetailPage;
