import { useQuery } from "@tanstack/react-query";
import axios from "axios";


const getUserProfile = async () => {
    try {
      const { data } = await axios.get("http://localhost:3020/user/profile", {
        withCredentials: true, // כדי לוודא שאתה שולח את הקוקיז
      });
      return data.user; // הנתונים יכילו את פרטי המשתמש
    } catch (error) {
      console.error("Not authenticated", error);
      return null;
    }
  };
  

const useAuth = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user"], // Use an array for the query key
    queryFn: getUserProfile,
  });

  return { data, isLoading, error };
};

export default useAuth;
