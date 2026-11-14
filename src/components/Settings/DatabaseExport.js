import { useState } from "react";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import StorageRoundedIcon from "@mui/icons-material/StorageRounded";
import DatabaseExportService from "./DatabaseExportService";
import "./DatabaseExport.css";

const DEFAULT_FILE_NAME = "database-export.sql";

const getDownloadFileName = (contentDisposition) => {
  if (!contentDisposition) return DEFAULT_FILE_NAME;

  const encodedName = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (encodedName?.[1]) {
    try {
      return decodeURIComponent(encodedName[1].replace(/^['"]|['"]$/g, ""));
    } catch (error) {
      // Fall through to the standard filename format.
    }
  }

  const standardName = contentDisposition.match(/filename\s*=\s*["']?([^;"']+)/i);
  return standardName?.[1]?.trim() || DEFAULT_FILE_NAME;
};

const getErrorMessage = async (error) => {
  const responseData = error.response?.data;

  if (responseData instanceof Blob) {
    try {
      const payload = JSON.parse(await responseData.text());
      return payload.message;
    } catch (parseError) {
      return null;
    }
  }

  return responseData?.message;
};

const DatabaseExport = () => {
  const canExport = [2, 3].includes(Number(localStorage.getItem("role_as")));
  const [isExporting, setIsExporting] = useState(false);
  const [notice, setNotice] = useState(null);

  const handleExport = async () => {
    if (!canExport) return;

    setIsExporting(true);
    setNotice(null);

    try {
      const response = await DatabaseExportService.exportDatabase();
      const contentType = response.headers["content-type"] || "application/sql";
      const fileName = getDownloadFileName(response.headers["content-disposition"]);
      const downloadUrl = window.URL.createObjectURL(
        new Blob([response.data], { type: contentType })
      );
      const link = document.createElement("a");

      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      setNotice({ severity: "success", message: `${fileName} was downloaded successfully.` });
    } catch (error) {
      const serverMessage = await getErrorMessage(error);
      let message = serverMessage || "The database could not be exported. Please try again.";

      if (error.response?.status === 429) {
        message = "Too many export requests. Please wait a minute, then try again.";
      } else if ([401, 403].includes(error.response?.status)) {
        message = "Your account is not authorized to export the database.";
      }

      setNotice({ severity: "error", message });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <main className="database-export-page">
      <header className="database-export-header">
        <div>
          <span>SETTINGS</span>
          <h1>Export Database</h1>
          <p>Create a downloadable SQL backup of the current database.</p>
        </div>
        <div className="database-export-header-icon" aria-hidden="true"><StorageRoundedIcon /></div>
      </header>

      {notice && <Alert className="database-export-alert" severity={notice.severity}>{notice.message}</Alert>}

      <section className="database-export-card" aria-labelledby="database-export-card-title">
        <div className="database-export-card-icon" aria-hidden="true"><StorageRoundedIcon /></div>
        <div className="database-export-card-content">
          <h2 id="database-export-card-title">Download a database backup</h2>
          <p>The server will prepare a timestamped <strong>.sql</strong> file and your browser will save it to its configured Downloads location.</p>

          <div className="database-export-note">
            <LockRoundedIcon aria-hidden="true" />
            <div>
              <strong>{canExport ? "Authorized database export" : "Role 2 or 3 access required"}</strong>
              <span>{canExport ? "The temporary server copy is removed after the download." : "You can view this page, but your account cannot download a database backup."}</span>
            </div>
          </div>

          <button
            className="database-export-button"
            type="button"
            onClick={handleExport}
            disabled={isExporting || !canExport}
            title={canExport ? undefined : "Only role 2 and role 3 accounts can export the database"}
          >
            {isExporting ? <><CircularProgress size={20} color="inherit" />Preparing export…</> : <><DownloadRoundedIcon />Export and download</>}
          </button>

          <small className="database-export-wait-message">Large databases can take several minutes. Keep this page open until the download starts.</small>
        </div>
      </section>
    </main>
  );
};

export default DatabaseExport;
