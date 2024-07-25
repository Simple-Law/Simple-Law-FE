import styled from "styled-components";

/**
 * 관리자 페이지 전체 Wrapper
 */
const AdminPageWrap = styled.div`
  width: 100%;
  background-color: #f1f5f9;
`;

/**
 *  공통 목록 페이지 스타일 컴포넌트
 */
const BoardDiv = styled.div`
  flex-grow: 1
  overflow: hidden;  
  margin: 24px 32px;

  .ant-table-thead {
    border: 1px solid red;
  }
  .ant-table-tbody {
    cursor: pointer;
  }
  .ant-spin-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    min-height: 76vh;
  }
  .ant-pagination .ant-pagination-item-active {
    border-color: transparent;
  }
`;

/**
 * 관리자 목록 페이지 스타일 컴포넌트
 */
const AdminBoard = styled(BoardDiv)`
  padding: 24px;
  border-radius: 8px;
  background-color: #ffffff;
`;

/**
 * 테이블 datasource가 비어있을 때 표기용 Div
 */
const TableEmptyDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
  height: 100px;
`;

export { AdminPageWrap, AdminBoard, TableEmptyDiv };
