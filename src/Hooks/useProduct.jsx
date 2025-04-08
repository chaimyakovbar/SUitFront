import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useAuth  from "./useAuth";  // תוודא שאתה משתמש ב-hook שהכנת ל-fetch פרטי המשתמש

const getProduct = async (user) => {
  const { data } = await axios.get(`http://localhost:3020/product?email=${user.email}`);
  return data;
};

const arr = [];

const useProduct = () => {
  const { data: user, isLoading, error } = useAuth();  // עכשיו משתמשים ב-hook של profile

  const { data, isLoading: productLoading, error: productError, refetch } = useQuery({
    queryKey: ["useProduct", user],  // משתמשים במידע שהבאנו על היוזר
    queryFn: () => getProduct(user),
    enabled: !!user, // רק אם יש יוזר, הבקשה תתבצע
  });

  if (isLoading || productLoading) return { data: arr, isLoading: true, error: null };

  if (error || productError) return { data: arr, isLoading: false, error };

  return { data: data || arr, isLoading: false, error: null, refetch };
};

export default useProduct;
