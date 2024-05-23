// import React, { useState } from "react";
// import { Upload, Button, Form, Input } from "antd";
// import { UploadOutlined } from "@ant-design/icons";
// import axios from "axios";

// function QuestPost() {
//   const uploadButton = <Button icon={<UploadOutlined />}>Upload</Button>;

//   const [fileList, setFileList] = useState([]);
//   const onChange = ({ fileList: newFileList }) => {
//     setFileList(newFileList);
//   };

//   const onPreview = async file => {
//     let src = file.url;
//     if (!src) {
//       src = await new Promise(resolve => {
//         const reader = new FileReader();
//         reader.readAsDataURL(file.originFileObj);
//         reader.onload = () => resolve(reader.result);
//       });
//     }
//     const image = new Image();
//     image.src = src;
//     const imgWindow = window.open(src);
//     imgWindow.document.write(image.outerHTML);
//   };
//   const customRequest = async ({ file, onProgress, onSuccess, onError }) => {
//     console.log("이거 걍 실행이 안되는듯?");
//     try {
//       // 서버에서 pre-signed URL을 요청
//       const response = await axios.get(`http://localhost:8080/s3-presigned-url?filename=${file.name}`);
//       const { url } = response.data;

//       // pre-signed URL을 이용해 S3에 파일 업로드
//       const result = await axios.put(url, file, {
//         onUploadProgress: ({ total, loaded }) => {
//           onProgress({ percent: Math.round((loaded / total) * 100) });
//         },
//         headers: {
//           "Content-Type": "image/jpeg",
//         },
//       });

//       if (result.status === 200) {
//         onSuccess(null, file);
//         // 성공 시 URL 저장 (Query string 제거)
//         const imageUrl = url.split("?")[0];
//         setFileList([{ uid: file.uid, name: file.name, status: "done", url: imageUrl }]);
//         // message.success("File uploaded successfully!");
//       } else {
//         onError("Upload failed");
//       }
//     } catch (error) {
//       onError(error);
//       // message.error("Failed to upload file");
//     }
//   };

//   const onFinish = async values => {
//     console.log(fileList);
//     const postData = {
//       title: values.title,
//       description: values.description,
//       imageUrl: fileList.length > 0 ? fileList[0].url : null, // S3에 업로드된 이미지 URL 사용
//     };

//     try {
//       const response = await axios.post("http://localhost:3001/mails", postData);
//       // message.success("Post submitted successfully!");
//       console.log(response.data);
//       setFileList([]); // 파일 리스트 초기화
//     } catch (error) {
//       // message.error("Failed to submit post");
//       console.error(error);
//     }
//   };

//   return (
//     <Form onFinish={onFinish} layout="vertical" style={{ width: 400, margin: "100px auto" }}>
//       <Form.Item name="title" label="Title" rules={[{ required: true, message: "Please input a title!" }]}>
//         <Input placeholder="Enter the title of the post" />
//       </Form.Item>
//       <Form.Item name="description" label="Description">
//         <Input.TextArea rows={4} placeholder="Enter a description" />
//       </Form.Item>
//       <Form.Item label="Upload Image">
//         <Upload
//           listType="picture-card"
//           fileList={fileList}
//           customRequest={customRequest}
//           onPreview={onPreview}
//           onChange={onChange}
//           beforeUpload={() => false} // Do not automatically upload
//         >
//           {fileList.length < 1 && uploadButton}
//         </Upload>
//       </Form.Item>
//       <Form.Item>
//         <Button type="primary" htmlType="submit">
//           Submit Post
//         </Button>
//       </Form.Item>
//     </Form>
//   );
// }

// export default QuestPost;

import React, { useState } from "react";
import AWS from "aws-sdk";

function QuestPost() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = e => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    // AWS S3 설정
    AWS.config.update({
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID, // IAM 사용자 엑세스 키 변경
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY, // IAM 엑세스 시크릿키 변경
      sessionToken: process.env.REACT_APP_AWS_SESSION_TOKEN, //임시 세션 토큰
      region: process.env.REACT_APP_AWS_REGION, // 리전 변경
    });

    const s3 = new AWS.S3();

    // 업로드할 파일 정보 설정
    const uploadParams = {
      Bucket: process.env.REACT_APP_S3_BUCKET_NAME, // 버킷 이름 변경
      Key: `${selectedFile.name}`, // S3에 저장될 경로와 파일명
      Body: selectedFile,
    };

    // S3에 파일 업로드
    s3.upload(uploadParams, (err, data) => {
      if (err) {
        console.error("Error uploading file:", err);
      } else {
        console.log("File uploaded successfully. ETag:", data.ETag);
        // 업로드 성공 후 필요한 작업 수행
      }
    });
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default QuestPost;
