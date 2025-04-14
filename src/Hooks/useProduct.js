import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { userAtom } from '../Utils'
import { useAtom } from "jotai";

const getProduct = async (user) => {
  const { data } = await axios.get(`https://suitback.onrender.com/product?email=${user.email}`);
  return data;
};

const arr = [];

const useProduct = () => {
  const [user] = useAtom(userAtom)

  const { data, isLoading: productLoading, error: productError, refetch } = useQuery({
    queryKey: ["useProduct", user],  // משתמשים במידע שהבאנו על היוזר
    queryFn: () => getProduct(user),
    enabled: !!user, // רק אם יש יוזר, הבקשה תתבצע
  });

  if (productLoading) return { data: arr, isLoading: true, error: null };

  if (productError) return { data: arr, isLoading: false };

  return { data: data || arr, isLoading: false, error: null, refetch };
};

export default useProduct;
