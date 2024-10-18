import { useEffect, useState } from "react";
import "./App.css";
import { API, getImageUrl } from "./utils";
import { UrlInfoType, UrlType } from "@shorturl/types";

function SendUrl({ addUrl }: { addUrl: (data: UrlType) => void }) {
  const [url, setUrl] = useState<string>("");
  async function handleUrlSave() {
    const response = (await API.post("/", { url: url })).data;
    addUrl(response as UrlType);
    setUrl("");
  }
  return (
    <div className="inputBox">
      <div>
        <input type="text" id="url" placeholder="Enter the url" value={url} onChange={e => setUrl(e.target.value)} />
        <img
          src={getImageUrl("send.png")}
          alt="send"
          style={{ height: "24px", width: "24px" }}
          onClick={handleUrlSave}
        />
      </div>
    </div>
  );
}

function createShortTextFromUrl(url: string): string {
  try {
    const urlObject = new URL(url);
    const domain = urlObject.hostname.replace("www.", "");
    const path = urlObject.pathname;
    const pathParts = path.split("/").filter(Boolean);
    const shortText = `${domain}-${pathParts.join("-")}`;

    return shortText.length > 20 ? shortText.slice(0, 20) + "..." : shortText;
  } catch (error) {
    console.error("Invalid URL provided:", error);
    return "invalid-url";
  }
}

const CustomModal = ({
  isOpen,
  onClose,
  onConfirm
}: {
  isOpen: string;
  onClose: () => void;
  onConfirm: (data: Record<string, string>) => void;
}) => {
  const [name, setName] = useState("");

  const handleConfirm = () => {
    if (name) {
      onConfirm({ name, isOpen });

      setName("");
      onClose();
    } else {
      alert("Please fill in all fields");
    }
  };

  if (isOpen === "") return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Please Enter Your Information</h2>
        <input
          type="text"
          placeholder="Enter Url"
          className="modalInput"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <button onClick={handleConfirm}>Confirm</button>
      </div>
    </div>
  );
};

function App() {
  const [urls, setUrls] = useState<UrlInfoType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<string>("");
  useEffect(() => {
    async function getUrls() {
      try {
        const response = await API.get("/");
        setUrls(response.data);
      } catch (error) {
        console.log("==error while fetching all urls==>", error);
      }
    }
    getUrls();
  }, []);

  function addUrls(data: UrlType) {
    const newUrl: UrlInfoType = { id: data.id, url: data.url, shortCode: data.shortCode };
    setUrls(prev => [...prev, newUrl]);
  }

  async function redirect(shortCode: string) {
    const response = await (await API.get(`/${shortCode}`)).data;
    window.location.href = response.url;
  }

  async function deleteUrl(shortCode: string) {
    await API.delete(`/${shortCode}`);
    setUrls(prev => prev.filter(obj => obj.shortCode !== shortCode));
  }

  async function getInfo(shortCode: string) {
    const response = await API.get(`/${shortCode}/stats`);
    alert(response.data.accessCount);
  }

  const handleOpenModal = (shortCode: string) => {
    setIsModalOpen(shortCode);
  };

  const handleCloseModal = () => {
    setIsModalOpen("");
  };

  const handleConfirm = async (data: Record<string, string>) => {
    try {
      await API.put(`/${data.isOpen}`, { url: data.name });
      setUrls(prev =>
        prev.map(obj => {
          if (obj.shortCode === data.isOpen) {
            obj.url = data.name;
          }

          return obj;
        })
      );
    } catch (error) {
      console.log("===error===", error);
    }
  };

  return (
    <div className="mainBox">
      <SendUrl addUrl={addUrls} />
      <CustomModal isOpen={isModalOpen} onClose={handleCloseModal} onConfirm={handleConfirm} />
      <div className="listBox">
        {urls.length ? (
          urls.map(obj => {
            return (
              <div key={obj.id}>
                <div className="heading">
                  {obj.shortCode} - {createShortTextFromUrl(obj.url)}
                </div>
                <div className="options">
                  <img src={getImageUrl("redirect.png")} onClick={() => redirect(obj.shortCode)} />
                  <img src={getImageUrl("info.png")} onClick={() => getInfo(obj.shortCode)} />
                  <img src={getImageUrl("edit.png")} onClick={() => handleOpenModal(obj.shortCode)} />
                  <img src={getImageUrl("delete.png")} onClick={() => deleteUrl(obj.shortCode)} />
                </div>
              </div>
            );
          })
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default App;
