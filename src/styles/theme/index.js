const theme = {
  token: {
    colorPrimary: "#287fff",
    colorInfo: "#287fff",
    wireframe: false,
    colorError: "#fe3240",
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
    },
  },
};
export default theme;
