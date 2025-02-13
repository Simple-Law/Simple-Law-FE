import { useEffect } from "react";

const useKakao = () => {
  useEffect(() => {
    const loadKakaoSDK = () => {
      if (!document.getElementById("kakao-sdk")) {
        const script = document.createElement("script");
        script.id = "kakao-sdk";
        script.src = "https://developers.kakao.com/sdk/js/kakao.js";
        script.onload = () => {
          if (!window.Kakao.isInitialized()) {
            window.Kakao.init("YOUR_JAVASCRIPT_KEY");
            console.log("Kakao SDK initialized:", window.Kakao.isInitialized());
          }
        };
        document.body.appendChild(script);
      }
    };
    loadKakaoSDK();
  }, []);
};

export default useKakao;
