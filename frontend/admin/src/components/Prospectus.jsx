import React, { useState, useEffect } from "react";
import { Button, Input, Alert, AlertTitle } from "@mui/material";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  listAll,
  deleteObject,
} from "firebase/storage";
import { useParams } from "react-router-dom";
import NetworkStatusWarning from "../helpers/NetworkStatusWarning";
import { useLocationIP, getPlatform } from "../helpers/utils";
import { storage } from "../helpers/firebase"; // Make sure to import your Firebase storage instance

const Prospectus = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [prospectusURL, setProspectusURL] = useState(null);
  const locationIP = useLocationIP();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const resetSuccessMessage = () => {
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  };

  const deleteAllProspectusFiles = async () => {
    const prospectusRef = ref(storage, "prospectus");
    try {
      const fileList = await listAll(prospectusRef);
      const deletePromises = fileList.items.map((fileRef) =>
        deleteObject(fileRef)
      );
      await Promise.all(deletePromises);
      console.log("All existing prospectus files deleted successfully");
    } catch (error) {
      console.error("Error deleting existing prospectus files:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchProspectusURL = async () => {
      setFetchingURL(true);
      try {
        const storageRef = ref(storage, "prospectus/Houses.pdf");
        const url = await getDownloadURL(storageRef);
        setProspectusURL(url);
      } catch (error) {
        console.error("Error fetching prospectus URL:", error);
        setUploadError("Error fetching prospectus URL");
      } finally {
        setFetchingURL(false);
      }
    };

    fetchProspectusURL();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type !== "application/pdf") {
      setUploadError("Please select a PDF file.");
      setSelectedFile(null);
    } else {
      setUploadError(null);
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError("Please select a file.");
      return;
    }

    setLoading(true);
    setUploadError(null);

    try {
      // Delete all existing files in the prospectus folder
      await deleteAllProspectusFiles();

      const storageRef = ref(storage, `prospectus/${selectedFile.name}`);

      // Upload the new file to Firebase Storage
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.error("Upload error:", error);
          setUploadError("Error uploading file. Please try again.");
          setLoading(false);
        },
        async () => {
          // Upload completed successfully, now we can get the download URL
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setProspectusURL(downloadURL);
          setSuccessMessage("Prospectus uploaded successfully!");
          resetSuccessMessage();
          setLoading(false);
          setSelectedFile(null);
        }
      );
    } catch (error) {
      console.error("Error during upload process:", error);
      setUploadError("Error during upload process. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="file">
      {prospectusURL && (
        <a
          href={prospectusURL}
          target="_blank"
          rel="noopener noreferrer"
          download
        >
          Download Prospectus
        </a>
      )}
      <p className="newFile">Upload New Prospectus File</p>
      <Input type="file" onChange={handleFileChange} sx={{ my: 1, mr: 1 }} />
      <Button
        variant="contained"
        onClick={handleUpload}
        size="small"
        sx={{ mb: 2 }}
        disabled={!selectedFile || loading}
      >
        {loading ? "Uploading..." : "Save"}
      </Button>
      <br />
      {uploadError && <Alert severity="error">{uploadError}</Alert>}
      {successMessage && (
        <Alert severity="success">
          <AlertTitle>Success</AlertTitle>
          {successMessage}
        </Alert>
      )}
      <NetworkStatusWarning />
    </div>
  );
};

export default Prospectus;
