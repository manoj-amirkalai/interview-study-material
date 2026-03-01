import React, { useState } from "react";
import "./ProgressBar.css";

// path to the static asset placed in public/ or copied by the bundler
const ZIP_URL = "/compress.zip";

const ProgressBar: React.FC = () => {
    const [downloadProgess, setDownloadProgress] = useState<number>(0);
    const [downloading, setDownloading] = useState<boolean>(false);

    const handleDownload = async (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setDownloading(true);
        try {
            const response = await fetch('https://drive.google.com/file/d/14uLlcyUjOHwKepIS2noa_MxrXdTQb33a/view?usp=drive_link');
            if (!response.ok) throw new Error("Network response was not ok");
            const contentLength = response.headers.get("Content-Length");
            const total = contentLength ? parseInt(contentLength, 10) : 0;
            if (!response.body) throw new Error("Response body is empty");
            const reader = response.body.getReader();
            let received = 0;
            const chunks = [];

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                chunks.push(value);
                received += value.length;
                if (total) {
                    setDownloadProgress(Math.round((received / total) * 100));
                }
            }

            const blob = new Blob(chunks);
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "compress.zip";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            setDownloadProgress(0);
        } catch (err) {
            console.error("Download failed", err);
            setDownloadProgress(0);
        }
    };

    return (
        <div className="download-container">
            <button onClick={handleDownload} disabled={downloading}>
                {downloading ? "Downloading..." : "Download File"}
            </button>

            {downloading && (
                <div className="progress-wrapper">
                    <div
                        className="progress-bar"
                        style={{ width: `${downloadProgess}%` }}
                    />
                    <span className="downloadProgess-text">{downloadProgess}%</span>
                </div>
            )}
        </div>
    );
};

export default ProgressBar;