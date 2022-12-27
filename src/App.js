import { Button, Typography, Modal, Input, Checkbox } from "antd";
import {
  UserAddOutlined,
  RightCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { FaDog } from "react-icons/fa";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import React, { useState, useEffect } from "react";

const App = () => {
  const [guestName, setGuestName] = useState("");
  const [petName, setPetName] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [list, setList] = useState({
    now: { guest: "", pet: "" },
    one: [],
    two: [],
    other: [],
  });

  const [checkList, setCheckList] = useState([
    [false, false, false, false, false],
    [false, false, false, false, false],
  ]);

  const [deleteList, setDeleteList] = useState({ one: [], two: [] });

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

  const callApiWait = async () => {
    await axios
      .get("https://port-0-fastapi-ngsnp25lbt6bmuh.gksl2.cloudtype.app/wait")
      .then((res) => setList(res.data));
  };

  const callApiDelete = async () => {
    await axios
      .post(
        "https://port-0-fastapi-ngsnp25lbt6bmuh.gksl2.cloudtype.app/delete",
        {
          one: deleteList["one"],
          two: deleteList["two"],
        }
      )
      .then((res) => {
        setDeleteList({ one: [], two: [] });
        setCheckList([
          [false, false, false, false, false],
          [false, false, false, false, false],
        ]);
        notifySuccess(res.data.message);
      });
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      callApiWait();
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const checkDelete = (e, listNum, id) => {
    let temp = [...list[listNum]];
    temp = temp[id - 1];
    let temp2 = { ...deleteList };

    if (e.target.checked === true) {
      temp2[listNum].push(temp.id);
      setDeleteList(temp2);
    } else {
      temp2[listNum] = temp2[listNum].filter((item) => item !== temp.id);
      setDeleteList(temp2);
    }
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
          width: "90%",
          height: "70%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <section className="titleZone">
          <p className="subTitle">관리자 페이지</p>
          <h1 className="title">덕소동물병원</h1>
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

        <section className="listZone">
          <div className="list">
            <DeleteOutlined
              className="deleteIcon"
              onClick={() => callApiDelete()}
            />
            <p className="name1">반려명</p>
            <p className="name2">보호자명</p>
          </div>
          <div className="nowList">
            <p className="listIcon">
              <FaDog className="now" />
            </p>
            <p className="name1">{list.now.pet}</p>
            <p className="name2">{list.now.guest}</p>
          </div>
          {list.one.map((item) => (
            <div className="list" key={item.id}>
              <Checkbox
                checked={checkList[0][item.id - 1]}
                onClick={() => {
                  let temp = [...checkList];
                  temp[0][item.id - 1] = !temp[0][item.id - 1];
                  setCheckList(temp);
                }}
                className="listIcon"
                onChange={(e) => {
                  checkDelete(e, "one", item.id);
                }}
              />
              <p className="name1">{item.pet}</p>
              <p className="name2">{item.guest}</p>
            </div>
          ))}
          {list.two.map((item) => (
            <div className="list" key={item.id - 1}>
              <Checkbox
                checked={checkList[1][item.id - 1]}
                onClick={() => {
                  let temp = [...checkList];
                  temp[1][item.id - 1] = !temp[1][item.id - 1];
                  setCheckList(temp);
                }}
                className="listIcon"
                onChange={(e) => {
                  checkDelete(e, "two", item.id);
                }}
              />
              <p className="name1">{item.pet}</p>
              <p className="name2">{item.guest}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default App;
