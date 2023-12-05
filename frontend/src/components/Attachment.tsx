import React, { useEffect, useRef, useState } from "react";
import { getFileData, getLinkData } from "../functions";
import { FaEllipsisH, FaFile } from "react-icons/fa";
import { MdOutlineFileOpen, MdDeleteOutline } from "react-icons/md";
import { LuDownload } from "react-icons/lu";
import "../styles/attachment.scss";
import axios from "axios";

interface Attachments {
  id: number;
  file: string;
  link: string;
  user: string;
}

interface AttachmentProps {
  attachment: Attachments;
  setAttachments: React.Dispatch<React.SetStateAction<any[]>>;
}

interface Data {
  url: string;
  target_url: string;
  title: string;
  favicon: string;
}

function Attachment({ attachment, setAttachments }: AttachmentProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [data, setData] = useState<Data>();
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (attachment.file === null) {
      getLinkData(attachment.link).then((res) => setData(res));
    } else {
      setData(getFileData(attachment.file));
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [attachment.file, attachment.link]);

  const openLink = (url: string) => {
    window.open(url, "_blank");
  };

  const downloadFile = async (url: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("File download failed");

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", data?.title || "file.txt");
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const deleteAttachment = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/attachments/${attachment.id}/`);
      setAttachments((prevAttachments: Attachments[]) => {
        return prevAttachments.filter(
          (currAttachment) => currAttachment.id !== attachment.id
        );
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAttachment = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    deleteAttachment();
  };

  const handleOpenLink = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (attachment.file === null) openLink(attachment.link);
    else downloadFile(`http://127.0.0.1:8000${attachment.file}`);
  };

  return (
    <div
      className={`attachment ${attachment.file === null ? "link" : ""}`}
      onClick={handleOpenLink}
    >
      <div className="left">
        <div>
          {attachment.file === null ? (
            <img src={data?.favicon} alt="icon" width={25} height={25} />
          ) : (
            <FaFile size={20} />
          )}
        </div>
        <div className="url-link">
          <div className="title">{data?.title}</div>
          <div className="url">{data?.url}</div>
        </div>
      </div>
      <div className="menu" onClick={toggleMenu} ref={menuRef}>
        <FaEllipsisH />
        {showMenu && (
          <div className="menu-dropdown">
            <ul>
              <li onClick={handleOpenLink}>
                {attachment.file === null ? (
                  <MdOutlineFileOpen size={16} />
                ) : (
                  <LuDownload size={16} />
                )}
                {attachment.file === null ? "Open" : "Download"}
              </li>
              <li onClick={handleDeleteAttachment}>
                <MdDeleteOutline size={16} /> Delete
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Attachment;