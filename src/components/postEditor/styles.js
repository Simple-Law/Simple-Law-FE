import styled from "styled-components";

export const FormDiv = styled.div`
  p:not(.toastui-editor-defaultUI p) {
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 20px; /* 125% */
    letter-spacing: -0.32px;
    margin-bottom: 8px;
    span {
      color: #94a3b8;
      margin-left: 6px;
    }
  }
  .left-side {
    width: 461px; /* 너비를 고정 */
    height: calc(100vh - 100px);
    padding-bottom: 185px;
    overflow-y: auto; /* 세로 스크롤만 추가 */
    position: relative; /* 필요에 따라 위치 설정 */
  }
  .right-side {
    width: calc(100% - 461px); /* 전체 너비에서 left-side 너비를 뺀 나머지 */
    height: calc(100vh - 100px);
    padding: 97px 0 20px 0;
    overflow-y: auto;
    position: relative; /* 필요에 따라 위치 설정 */
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* Internet Explorer 10+ */
  }
`;

export const StyledList = styled.ul`
  counter-reset: list-number;

  & > li {
    position: relative;
    padding-left: 15px; /* 공간 확보를 위해 왼쪽에 패딩을 추가 */
    line-height: 24px;

    &:before {
      content: counter(list-number) ".";
      counter-increment: list-number;
      position: absolute; /* 숫자를 절대 위치로 고정 */
      left: 0; /* 왼쪽에 고정 */
      top: 0; /* 위쪽에 고정 */
      width: 15px; /* 숫자가 들어갈 공간의 폭 지정 */
      text-align: left; /* 숫자를 오른쪽 정렬 */
    }
  }
  & ul {
    list-style: disc;

    & li {
      line-height: 24px;
      &:before {
        content: "";
      }
    }
  }
`;
