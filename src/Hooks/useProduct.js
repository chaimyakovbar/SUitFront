import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from '../config/api.js';
import { authUserAtom } from '../Utils'
import { useAtom } from "jotai";

const getProduct = async (user) => {
  const { data } = await axiosInstance.get(`/product?email=${user.email}`);
  return data;
};

const arr = [];

const useProduct = () => {
  const [user] = useAtom(authUserAtom)

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
