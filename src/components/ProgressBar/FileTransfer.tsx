import { useState, useRef } from "react";
import "./FileTransfer.css";
import axios from "axios";

const FileTransfer = () => {
    // ================= DOWNLOAD STATES =================
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [downloadStatus, setDownloadStatus] = useState("");
    const [downloadUrl, setDownloadUrl] = useState(null);
    // AbortController ref to manage download cancellation
    const downloadController = useRef(null);

    // ================= UPLOAD STATES =================
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState("");
    const [uploadSpeed, setUploadSpeed] = useState(0);
    const [uploadTimeLeft, setUploadTimeLeft] = useState(null);
    const xhrRef = useRef(null);

    // ==================================================
    // DOWNLOAD FUNCTION (10MB)
    // ==================================================
    const downloadFile = async () => {
        setDownloadProgress(0);
        setDownloadStatus("Downloading...");
        setDownloadUrl(null);

        // AbortController to cancel download if needed
        downloadController.current = new AbortController();

        try {
            const response = await fetch(
                "https://speed.hetzner.de/10MB.bin",
                // Pass the signal for cancellation
                { signal: downloadController.current.signal }
            );

            const contentLength = response.headers.get("Content-Length");
            if (!contentLength) throw new Error("Missing Content-Length");

            const total = parseInt(contentLength, 10);
            let loaded = 0;

            const reader = response.body.getReader();
            const chunks = [];

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                chunks.push(value);
                loaded += value.length;

                const percent = (loaded / total) * 100;
                setDownloadProgress(percent.toFixed(2));
            }

            // Create a blob URL for the downloaded file
            const blob = new Blob(chunks);
            // Create a URL for the blob and set it for download
            const url = URL.createObjectURL(blob);
            setDownloadUrl(url);
            setDownloadStatus("Download Completed ✅");

        } catch (err) {
            if (err.name !== "AbortError") {
                setDownloadStatus("Download Failed ❌");
            }
        }
    };

    const cancelDownload = () => {
        // Abort the ongoing download
        downloadController.current?.abort();
        setDownloadStatus("Download Cancelled ❌");
    };

    // ==================================================
    // REAL-TIME UPLOAD FUNCTION
    // ==================================================
    const uploadFileUsinAxiosXHR = (file) => {
        if (!file) return;

        setSelectedFile(file);
        setUploadProgress(0);
        setUploadStatus("Uploading...");
        setUploadSpeed(0);
        setUploadTimeLeft(null);

        const xhr = new XMLHttpRequest();
        xhrRef.current = xhr;

        xhr.open("POST", "https://httpbin.org/post");

        const startTime = Date.now();

        // 🔥 Real-time upload progress
        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percent = (event.loaded / event.total) * 100;
                setUploadProgress(percent.toFixed(2));

                const elapsed = (Date.now() - startTime) / 1000;
                const speed = event.loaded / 1024 / elapsed;
                setUploadSpeed(speed.toFixed(2));

                const remainingBytes = event.total - event.loaded;
                const remainingTime =
                    remainingBytes / (event.loaded / elapsed);

                setUploadTimeLeft(remainingTime.toFixed(1));
            }
        };

        // When file finished sending
        xhr.upload.onload = () => {
            setUploadStatus("Processing...");
        };

        // When server responds
        xhr.onload = () => {
            if (xhr.status === 200) {
                setUploadStatus("Upload Completed ✅");
            } else {
                setUploadStatus("Upload Failed ❌");
            }
        };

        xhr.onerror = () => {
            setUploadStatus("Upload Error ❌");
        };

        const formData = new FormData();
        formData.append("file", file);

        xhr.send(formData);
    };

    const uploadFileUsinAxios = async (file) => {
        if (!file) return;

        setSelectedFile(file);
        setUploadProgress(0);
        setUploadStatus("Uploading...");
        setUploadSpeed(0);
        setUploadTimeLeft(null);

        const formData = new FormData();
        formData.append("file", file);

        const startTime = Date.now();

        try {
            await axios.post("https://httpbin.org/post", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },

                onUploadProgress: (progressEvent) => {
                    const { loaded, total } = progressEvent;

                    const percent = (loaded / total) * 100;
                    setUploadProgress(percent.toFixed(2));

                    const elapsed = (Date.now() - startTime) / 1000;
                    const speed = loaded / 1024 / elapsed; // KB/s
                    setUploadSpeed(speed.toFixed(2));

                    const remainingBytes = total - loaded;
                    const remainingTime =
                        remainingBytes / (loaded / elapsed);

                    setUploadTimeLeft(remainingTime.toFixed(1));
                },
            });

            setUploadStatus("Upload Completed ✅");
        } catch (error) {
            setUploadStatus("Upload Failed ❌");
        }
    };

    const cancelUpload = () => {
        xhrRef.current?.abort();
        setUploadStatus("Upload Cancelled ❌");
    };

    // ==================================================
    return (
        <div className="container">
            <h1>File Transfer System</h1>

            {/* ================= DOWNLOAD SECTION ================= */}
            <div className="download-section">
                <h2>Download 10MB File</h2>

                <button onClick={downloadFile}>Start Download</button>
                <button onClick={cancelDownload}>Cancel</button>

                <progress value={downloadProgress} max="100" />
                <p>{downloadProgress}%</p>

                <p>{downloadStatus}</p>

                {downloadUrl && (
                    <a href={downloadUrl} download="10mb-file.bin">
                        Save File
                    </a>
                )}
            </div>

            <hr />

            {/* ================= UPLOAD SECTION ================= */}
            <div className="upload-section">
                <h2>Upload File</h2>

                <input
                    type="file"
                    onChange={(e) => uploadFileUsinAxios(e.target.files[0])}
                />

                {selectedFile && (
                    <p>Selected: {selectedFile.name}</p>
                )}

                <progress value={uploadProgress} max="100" />
                <p>{uploadProgress}%</p>

                {uploadSpeed > 0 && (
                    <p>Speed: {uploadSpeed} KB/s</p>
                )}

                {uploadTimeLeft &&
                    uploadProgress < 100 && (
                        <p>
                            Time left: {uploadTimeLeft} sec
                        </p>
                    )}

                <p>{uploadStatus}</p>

                <button onClick={cancelUpload}>
                    Cancel Upload
                </button>
            </div>
        </div>
    );
};

export default FileTransfer;