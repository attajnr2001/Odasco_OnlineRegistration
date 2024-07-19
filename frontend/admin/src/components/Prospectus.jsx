import React, { useState, useEffect } from "react";
import { Button, Input, Alert, AlertTitle, Box } from "@mui/material";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  listAll,
  deleteObject,
} from "firebase/storage";
import { useParams } from "react-router-dom";
import NetworkStatusWarning from "../helpers/NetworkStatusWarning";
import { useLocationIP, getPlatform, useCreateLog } from "../helpers/utils";
import { storage } from "../helpers/firebase";
import {
  useGetSchoolItemsQuery,
  useUpdateSchoolItemMutation,
} from "../slices/schoolApiSlice";

const Prospectus = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [prospectusURL, setProspectusURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const { data: schoolItems, isLoading, error } = useGetSchoolItemsQuery();
  const [updateSchoolItem] = useUpdateSchoolItemMutation();
  const createLog = useCreateLog();
  const { locationIP, loading: ipLoading } = useLocationIP();

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
      await deleteAllProspectusFiles();

      const storageRef = ref(storage, `prospectus/${selectedFile.name}`);
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
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            if (schoolItems && schoolItems.length > 0) {
              const schoolId = schoolItems[0]._id;
              const result = await updateSchoolItem({
                id: schoolId,
                prospectus: downloadURL,
              });

              if (result.error) {
                throw new Error("Failed to update school record");
              }

              setProspectusURL(downloadURL);
              setSuccessMessage(
                "Prospectus uploaded and school record updated successfully!"
              );

              // Add log entry
              if (!ipLoading) {
                await createLog("Prospectus updated", schoolId, locationIP);
              } else {
                console.log("IP address not available yet");
              }
            } else {
              throw new Error("No school found to update");
            }
          } catch (error) {
            console.error("Error updating school record:", error);
            setUploadError("Error updating school record. Please try again.");
          } finally {
            setLoading(false);
            setSelectedFile(null);
            resetSuccessMessage();
          }
        }
      );
    } catch (error) {
      console.error("Error during upload process:", error);
      setUploadError("Error during upload process. Please try again.");
      setLoading(false);
    }
  };

  
  useEffect(() => {
    if (schoolItems && schoolItems.length > 0) {
      setProspectusURL(schoolItems[0].prospectus);
    }
  }, [schoolItems]);

  return (
    <Box sx={{ mb: 2 }} className="file">
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <Alert severity="error">Error loading school data</Alert>
      ) : (
        <>
          {prospectusURL && (
            <>
              <a
                href={prospectusURL}
                target="_blank"
                rel="noopener noreferrer"
                download
              >
                Download Prospectus
              </a>
              <Button
                variant="outlined"
                onClick={() => setShowPreview(!showPreview)}
                sx={{ ml: 2 }}
                size="small"
              >
                {showPreview ? "Hide Preview" : "Show Preview"}
              </Button>
            </>
          )}
          <p className="newFile">Upload New Prospectus File</p>
          <Input
            type="file"
            onChange={handleFileChange}
            sx={{ my: 1, mr: 1 }}
          />
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

          {showPreview && prospectusURL && (
            <div style={{ width: "100%", height: "500px", marginTop: "20px" }}>
              <iframe
                src={`${prospectusURL}#view=FitH`}
                width="100%"
                height="100%"
                style={{ border: "none" }}
                title="Prospectus Preview"
              />
            </div>
          )}
        </>
      )}

      <NetworkStatusWarning />
    </Box>
  );
};

export default Prospectus;
