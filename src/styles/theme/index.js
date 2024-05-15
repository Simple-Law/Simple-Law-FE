const theme = {
  token: {
    colorPrimary: "#287fff",
    colorInfo: "#287fff",
    wireframe: false,
    colorError: "#fe3240",
    fontFamily: "Pretendard",
    colorTextBase: "#171717",
  },
  components: {
    Button: {
      borderColorDisabled: "rgba(255, 255, 255, 0)",
      colorBgContainerDisabled: "#F1F5F9",
      colorTextDisabled: "#B8C7D5",
      controlHeight: 48,
    },
    Checkbox: {
      controlInteractiveSize: 24,
    },
    Tag: {
      borderRadiusSM: 100,
      fontSize: 13,
    },
    Table: {
      cellPaddingBlock: 13,
      headerColor: "rgb(110, 119, 128)",
      headerBorderRadius: 0,
      borderRadius: 0,
      headerBg: "rgb(241, 245, 249)",
      colorText: "rgb(23, 23, 23)",
      rowHoverBg: "rgb(241, 245, 249)",
      padding: 10,
    },
    Input: {
      controlHeight: 48,
      fontSize: 16,
      colorBorder: "rgb(228, 233, 241)",
      colorTextPlaceholder: "rgb(184, 199, 213)",
    },
    Radio: {
      controlHeight: 48,
      colorText: "rgb(148, 163, 184)",
      colorBorder: "rgb(228, 233, 241)",
      borderRadius: 0,
      buttonPaddingInline: 0,
    },
    Select: {
      optionPadding: "12px 16px",
      paddingSM: 16,
      fontSize: 16,
      controlHeight: 48,
      colorBorder: "rgb(228, 233, 241)",
      colorTextPlaceholder: "rgb(184, 199, 213)",
    },
    Form: {
      itemMarginBottom: 0,
    },
    Menu: {
      itemSelectedBg: "rgb(241, 245, 249)",
      itemSelectedColor: "rgb(110, 119, 128)",
      itemHoverColor: "rgb(110, 119, 128)",
      subMenuItemBg: "rgba(0, 0, 0, 0)",
      itemColor: "rgb(110, 119, 128)",
      itemHoverBg: "rgb(241, 245, 249)",
      groupTitleColor: "rgb(23, 23, 23)",
      colorSplit: "rgba(0, 0, 0, 0)",
      padding: 8,
    },
    Layout: {
      siderBg: "rgb(241, 245, 249)",
    },
    Pagination: {
      fontSize: 15,
      colorPrimaryBorder: "rgba(255, 145, 145, 0)",
      colorPrimary: "rgb(40, 127, 255)",
      colorBgContainer: "#e9f2ff",
    },
  },
};
export default theme;
