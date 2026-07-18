import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../Utils/firebase.js";
import api from "../../Utils/axios.js";
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { setUserdata } from "../Redux/userSlice.js";
import SideBar from "../Components/SideBar.jsx";
import Artifacts from "../Components/Artifacts.jsx";
import ChatArea from "../Components/ChatArea.jsx";

function Home() {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleLogin = async (token) => {
    try {
      const { data } = await api.post("/api/v1/auth/login", { token });

      dispatch(setUserdata(data));
    } catch (err) {
      console.log(`error : ${err}`);
    }
  };

  const googleLogin = async () => {
    const data = await signInWithPopup(auth, googleProvider);
    const token = await data.user.getIdToken();
    console.log(token);
    await handleLogin(token);
  };

  return (
    <>
      <div className="relative flex h-dvh overflow-hidden bg-[#0d0f14] text-white">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(20,184,166,0.06),transparent_26%),linear-gradient(135deg,rgba(99,102,241,0.09),transparent_42%),linear-gradient(315deg,rgba(244,63,94,0.045),transparent_40%)]" />
        <SideBar
          mobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />
        <ChatArea onMenuClick={() => setMobileSidebarOpen(true)} />
        <Artifacts />

        {!userData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-md">
            <div className="surface-pop flex w-full max-w-[370px] flex-col gap-5 rounded-2xl border border-white/[0.1] bg-[#13151c]/95 p-7 shadow-2xl shadow-black/50">
              <div className="flex flex-col gap-1">
                <h2 className="text-[18px] font-semibold tracking-tight text-slate-100">
                  Welcome to AgentForge
                </h2>
                <p className="text-[13px] text-slate-500">
                  Please login to continue using the app.
                </p>
              </div>

              <button
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-white py-[11px] text-sm font-medium text-black/90 shadow-lg shadow-black/20 transition-all duration-150 hover:-translate-y-0.5 hover:bg-gray-200 active:translate-y-0"
                onClick={googleLogin}
              >
                <FcGoogle size={18} />
                Continue With Google
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Home;
