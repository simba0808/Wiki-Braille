<<<<<<< HEAD
import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

export const useUploadForm = (endpoint) => {
  const { userInfo } = useSelector((state) => state.auth);
  const [isSuccess, setIsSuccess] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedUri, setUploadedUri] = useState("");

  const uploadForm = async (formData) => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${userInfo.token}`;
    const response = await axios.post(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      onUploadProgress: (progressEvent) => {
        const progress = (progressEvent.loaded / progressEvent.total) * 100;
        setProgress(progress);
      }
    });
    if(response.data.data) {
      setUploadedUri(response.data.data);
    }
    setIsSuccess(true);
  };

  return { uploadForm, progress, isSuccess, uploadedUri };
=======
import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

export const useUploadForm = (endpoint) => {
  const { userInfo } = useSelector((state) => state.auth);
  const [isSuccess, setIsSuccess] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedUri, setUploadedUri] = useState("");

  const uploadForm = async (formData) => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${userInfo.token}`;
    const response = await axios.post(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      onUploadProgress: (progressEvent) => {
        const progress = (progressEvent.loaded / progressEvent.total) * 100;
        setProgress(progress);
      }
    });
    if(response.data.data) {
      setUploadedUri(response.data.data);
    }
    setIsSuccess(true);
  };

  return { uploadForm, progress, isSuccess, uploadedUri };
>>>>>>> 85823ee (Upgrade to version 1)
};