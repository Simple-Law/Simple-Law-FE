// src/pages/Admin/Read.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMailById, updateMail, fetchMails } from "apis/mailsApi";
import moment from "moment";
import "moment/locale/ko";
import { Button, Modal, Input } from "antd";
import { useMailContext } from "contexts/MailContexts";
import StatusTag from "components/Tags";

const { TextArea } = Input;

const Read = () => {
  const { id } = useParams();
  const [mail, setMail] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [actionType, setActionType] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const navigate = useNavigate();
  const { dispatch } = useMailContext();

  useEffect(() => {
    moment.locale("ko");
    const fetchMail = async () => {
      try {
        const data = await getMailById(id);
        console.log(data);
        // replies가 정의되지 않은 경우 빈 배열로 초기화
        setMail({ ...data, replies: data.replies || [] });
      } catch (error) {
        console.error("Error fetching mail:", error);
      }
    };
    fetchMail();
  }, [id]);

  const showModal = type => {
    setActionType(type);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    setIsModalVisible(false);
    try {
      let updatedMail = { ...mail };
      if (actionType === "승인") {
        updatedMail.status = "pending";
      } else if (actionType === "거절") {
        updatedMail.status = "refuse";
      } else if (actionType === "답변") {
        updatedMail = {
          ...mail,
          replies: [...(mail.replies || []), { content: replyContent, createdAt: new Date().toISOString() }],
        };
      }
      await updateMail(id, updatedMail);
      setMail(updatedMail);
      const { data: mailData } = await fetchMails();
      dispatch({ type: "SET_DATA", payload: mailData });
      dispatch({
        type: "SET_MAILS",
        payload: mailData.filter(mail => mail.status !== "휴지통"),
      });
      dispatch({ type: "UPDATE_COUNTS", payload: mailData });
      navigate("/admin/board");
    } catch (error) {
      console.error(`Error updating mail with ${actionType}:`, error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  if (!mail) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full">
      <div className="flex items-center mt-[1.25rem] ml-[2rem] min-w-[1000px]">
        <div className="flex items-center">
          <div className="text-zinc-800 text-base font-medium leading-normal">{mail.title}</div>
          <StatusTag status={mail.status} />
        </div>
      </div>
      <div>
        <div className="w-[34.6875rem] h-[1.0625rem] ml-[3.75rem] mt-[0.5rem] justify-start items-center gap-2 inline-flex">
          <div className="text-gray-500 text-sm font-normal leading-tight">
            {mail.anytime} ∙ {mail.category}
          </div>
          <div className="w-px h-2.5 bg-zinc-300"></div>
          <div className="justify-start items-center gap-1.5 flex">
            <div className="text-gray-500 text-sm font-normal">의뢰자 :</div>
            <div className="text-gray-500 text-sm font-semibold">홍길동</div>
          </div>
        </div>
      </div>
      <div className="w-[32.0625rem] ml-[3.75rem] mt-[1.25rem] h-[4.125rem] px-4 py-3 bg-slate-100 bg-opacity-30 rounded-md border border-solid border-slate-200 flex-col justify-start items-start gap-0.5 inline-flex">
        <div className="justify-start items-start gap-1 inline-flex">
          <div className="text-gray-500 text-sm font-normal leading-tight">의뢰 요청 시간 :</div>
          <div className="justify-start items-start gap-1 flex">
            <div className="text-gray-500 text-sm font-semibold leading-tight">
              {moment(mail.sentAt).format("YYYY년 MM월 DD일 (dd)")}
            </div>
            <div className="text-gray-500 text-sm font-semibold leading-tight">
              {moment(mail.sentAt).format("A h:mm").replace("AM", "오전").replace("PM", "오후")}
            </div>
          </div>
        </div>
        <div className="justify-start items-start gap-1 inline-flex">
          <div className="text-gray-500 text-sm font-normal leading-tight">제한 시간 :</div>
          <div className="justify-start items-start gap-1 flex">
            <div className="text-gray-500 text-sm font-semibold leading-tight">
              {moment(mail.sentAt)
                .add(mail.time, "hours")
                .format("YYYY년 MM월 DD일 (dd) A h:mm")
                .replace("AM", "오전")
                .replace("PM", "오후")}
            </div>
          </div>
        </div>
      </div>

      <div className="ml-[2.125rem] w-full h-[12.5rem] relative border-t border-solid border-slate-100">
        <div className="text-zinc-800 text-base font-normal mt-[24px]">
          <div dangerouslySetInnerHTML={{ __html: mail.content }} />
        </div>
      </div>

      {mail.status === "preparing" && (
        <div className="flex space-x-2 mt-4">
          <Button type="primary" onClick={() => showModal("승인")}>
            승인
          </Button>
          <Button type="danger" onClick={() => showModal("거절")}>
            거절
          </Button>
        </div>
      )}
      <div className="flex space-x-2 mt-4">
        <Button type="default" onClick={() => showModal("답변")}>
          답변
        </Button>
      </div>

      <Modal title={`${actionType} 확인`} open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <p>{`${actionType}하시겠습니까?`}</p>
        {actionType === "답변" && (
          <TextArea rows={4} value={replyContent} onChange={e => setReplyContent(e.target.value)} />
        )}
      </Modal>
    </div>
  );
};
export default Read;
