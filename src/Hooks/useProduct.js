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
    queryKey: ["useProduct", user?.email], // רק email במקום כל user object
    queryFn: () => getProduct(user),
    enabled: !!user?.email, // בדיקה מדויקת יותר
    staleTime: 5 * 60 * 1000, // 5 דקות
    cacheTime: 10 * 60 * 1000, // 10 דקות
    refetchOnWindowFocus: false, // לא לרענן כשהחלון מקבל focus
    refetchOnMount: false, // לא לרענן בכל mount
    retry: 2, // רק 2 ניסיונות
  });

  if (productLoading) return { data: arr, isLoading: true, error: null };

  if (productError) return { data: arr, isLoading: false, error: productError };

  return { data: data || arr, isLoading: false, error: null, refetch };
};

export default useProduct;
