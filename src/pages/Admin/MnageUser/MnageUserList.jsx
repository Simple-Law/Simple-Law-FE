import styled from "styled-components";

const MnageUserList = () => {
  const [pageTitle] = useState("회원 관리");
  const paginationConfig = {
    pageSize: 10,
    position: ["bottomCenter"],
  };

  const columns = [
    {
      title: "이메일",
      key: "email",
      dataIndex: "email",
      className: "email-column",
    },
  ];

  return (
    <>
      <BoardDiv className='mt-6 mx-8 grow overflow-hidden'>
        <div className='flex justify-between items-end mb-3'>
          <h2 className=' font-bold text-[20px]'>{pageTitle}</h2>
          <AuthButton text='계정 추가' size='large' clickHandler={showModal} authRoles={["SUPER_ADMIN"]} />
        </div>
        <Table />
      </BoardDiv>
    </>
  );
};

const BoardDiv = styled.div`
  .ant-spin-container {
    height: 80vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .ant-pagination .ant-pagination-item-active {
    border-color: transparent;
  }
`;

export default MnageUserList;
