import Login_signup from "./Login_Signup";

const LoginBg = () => {
  return (
    <div className="flex">
      <div className="bg-slate-100/0 w-[48vw] absolute top-0 left-0 z-10 flex items-center justify-center">
        <Login_signup />
      </div>

      <div className="w-full bg-slate-100">
        <video
          className="h-[100vh] w-full object-cover"
          autoPlay
          loop
          muted
          src="src/assets/original-4cb23b9f23e3541a69e1ffb09bc0dbc5.mp4"
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default LoginBg;
