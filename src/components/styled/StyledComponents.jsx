import styled from "styled-components";

/**
 * 테이블 컬럼 중 사용자 ID 표기용 DIv
 */
const TableColumnId = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: -0.02em;
  color: #94a3b8;
`;

/**
 * 테이블 datasource가 비어있을 때 표시할 Div
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

export { TableColumnId, TableEmptyDiv };
