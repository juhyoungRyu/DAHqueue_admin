import { Button, Typography, Modal, Input, Space } from "antd";
import { UserAddOutlined, RightCircleOutlined } from "@ant-design/icons";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import React, { useState } from "react";

const App = () => {
  const [guestName, setGuestName] = useState("");
  const [petName, setPetName] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    await axios
      .post("https://port-0-fastapi-ngsnp25lbt6bmuh.gksl2.cloudtype.app/new", {
        guest: guestName,
        pet: petName,
      })
      .then((res) => notifySuccess(res.data.message))
      .catch((e) => notifyError(e.message));
    setGuestName("");
    setPetName("");
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const { Title } = Typography;

  const notifySuccess = (message) =>
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  const notifyError = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const callApiNext = async () => {
    await axios
      .get("https://port-0-fastapi-ngsnp25lbt6bmuh.gksl2.cloudtype.app/next")
      .then((res) => notifySuccess(res.data.message))
      .catch((e) => notifyError(e.message));
  };

  return (
    <div className="App">
      <Modal
        title="신규 대기자 정보 입력"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        style={{ width: "100%" }}
      >
        <div className="modalInputZone">
          <Input
            className="modalInput"
            placeholder="반려동물 이름"
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
          />
          <Input
            className="modalInput"
            placeholder="보호자 성함"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
          />
        </div>
      </Modal>

      <ToastContainer className="toast" />
      <div
        style={{
          width: "80%",
          height: "70%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <section className="titleZone">
          <p className="subTitle">관리자 페이지</p>
          <Title className="title">덕소동물병원</Title>
        </section>

        <section className="mainZone">
          <Button
            icon={<RightCircleOutlined />}
            className="btn"
            type="default"
            onClick={() => callApiNext()}
          >
            다음
          </Button>
          <Button
            icon={<UserAddOutlined />}
            className="btn"
            type="primary"
            onClick={() => showModal()}
          >
            신규
          </Button>
        </section>
      </div>
    </div>
  );
};

export default App;
