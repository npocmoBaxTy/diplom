import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { loggedIn, setCurEmail } from "../../Store/Slices/LoginSlice";

export const useAuthLogic = () => {
  const url = process.env.REACT_APP_SERVER_URL;
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isReturningUser, setIsReturningUser] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    const savedPassword = localStorage.getItem("savedPassword");
    if (savedEmail && savedPassword) {
      setFormData({ email: savedEmail, password: savedPassword });
      setIsReturningUser(true);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return toast.error("Пожалуйста, заполните все поля");
    }
    setIsLoading(true);
    try {
      const response = await axios.post(`${url}/login`, formData);
      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("savedEmail", formData.email);
        localStorage.setItem("savedPassword", formData.password);
        dispatch(loggedIn(response.data));
        dispatch(setCurEmail(formData.email));
        navigate("/main");
      }
    } catch (err) {
      toast.error(`${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  return { formData, isLoading, handleChange, handleSubmit, isReturningUser };
};
