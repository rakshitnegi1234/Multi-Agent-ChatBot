import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../Utils/firebase";

function App() {
  const googleLogin = async () => {
    const data = await signInWithPopup(auth, googleProvider);

    console.log(data);
  };
  return (
    <>
      <div className="w-full h-screen bg-black">
        <button className="w-50 h-24 bg-amber-400" onClick={googleLogin}>
          Continue with Google
        </button>
      </div>
    </>
  );
}

export default App;
