import React, { useState, useEffect } from "react";
import { Button, Input, Alert, AlertTitle, Box } from "@mui/material";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  listAll,
  deleteObject,
} from "firebase/storage";
import NetworkStatusWarning from "../helpers/NetworkStatusWarning";
import { useLocationIP, getPlatform, useCreateLog } from "../helpers/utils";
import { storage } from "../helpers/firebase"; // Make sure to import your Firebase storage instance
import {
  useGetSchoolItemsQuery,
  useUpdateSchoolItemMutation,
} from "../slices/schoolApiSlice";

const Undertaking = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [undertakingURL, setUndertakingURL] = useState(null);
  const createLog = useCreateLog();
  const { locationIP, loading: ipLoading } = useLocationIP();
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const { data: schoolItems, isLoading, error } = useGetSchoolItemsQuery();
  const [updateSchoolItem] = useUpdateSchoolItemMutation();

  const resetSuccessMessage = () => {
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  };

  const deleteAllUndertakingFiles = async () => {
    const undertakingRef = ref(storage, "undertaking");
    try {
      const fileList = await listAll(undertakingRef);
      const deletePromises = fileList.items.map((fileRef) =>
        deleteObject(fileRef)
      );
      await Promise.all(deletePromises);
      console.log("All existing undertaking files deleted successfully");
    } catch (error) {
      console.error("Error deleting existing undertaking files:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchUndertakingURL = async () => {
      setFetchingURL(true);
      try {
        const storageRef = ref(storage, "undertaking/Houses.pdf");
        const url = await getDownloadURL(storageRef);
        setUndertakingURL(url);
      } catch (error) {
        console.error("Error fetching undertaking URL:", error);
        setUploadError("Error fetching undertaking URL");
      } finally {
        setFetchingURL(false);
      }
    };

    fetchUndertakingURL();
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
      await deleteAllUndertakingFiles();

      const storageRef = ref(storage, `undertaking/${selectedFile.name}`);
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
                undertaking: downloadURL,
              });

              if (result.error) {
                throw new Error("Failed to update school record");
              }

              setUndertakingURL(downloadURL);
              setSuccessMessage(
                "Undertaking uploaded and school record updated successfully!"
              );

              // Add log entry
              if (!ipLoading) {
                await createLog("Undertaking updated", schoolId, locationIP);
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
      setUndertakingURL(schoolItems[0].undertaking);
    }
  }, [schoolItems]);

  return (
    <Box sx={{ mt: 2 }} className="file">
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <Alert severity="error">Error loading school data</Alert>
      ) : (
        <>
          {undertakingURL && (
            <>
              <a
                href={undertakingURL}
                target="_blank"
                rel="noopener noreferrer"
                download
              >
                Download Undertaking
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
          <p className="newFile">Upload New Undertaking File</p>
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

          {showPreview && undertakingURL && (
            <div style={{ width: "100%", height: "500px", marginTop: "20px" }}>
              <iframe
                src={`${undertakingURL}#view=FitH`}
                width="100%"
                height="100%"
                style={{ border: "none" }}
                title="Undertaking Preview"
              />
            </div>
          )}
        </>
      )}

      <NetworkStatusWarning />
    </Box>
  );
};

export default Undertaking;
