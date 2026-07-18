import { useEffect } from "react";
import Home from "./Pages/Home";
import getCurrentUser from "./Features/getCurrent.User";
import { useDispatch } from "react-redux";
import { setUserdata } from "./Redux/userSlice";

function App() {

  const dispatch = useDispatch();

  
  useEffect(() => {
    const getUser = async () => {
      const data = await getCurrentUser();
      dispatch(setUserdata(data?.userId ? { ...data, _id: data.userId } : data));
    };

    getUser();
  }, [dispatch]);

  return (
    <>
      <Home />
    </>
  );
}

export default App;
