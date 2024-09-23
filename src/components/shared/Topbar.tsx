import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations";
import { useEffect } from "react";
import { useUserContext } from "@/context/AuthContext";

const Topbar = () => {
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const navigate = useNavigate();
  const { user } = useUserContext();

  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess]);

  return (
    <section className="topbar">
      <div className="flex-between py-4 px-5">
        <Link to={"/"} className="flex gap-3 items-center">
          <img
            src="/public/assets/images/logo.svg"
            width={130}
            height={325}
            alt="logo"
          />
        </Link>
        <div className="flex gap-4">
          <Button
            variant="ghost"
            className="shad-button_ghost"
            onClick={() => signOut()}
          >
            <img src="/public/assets/icons/logout.svg" alt="" />
          </Button>
          <Link to={`/profile/${user.id}`} className="flex-center gap-3">
            <img
              src={`${
                user.imageUrl || "/public/assets/icons/profile-placeholder.svg"
              }`}
              alt={`${user.username}-profile`}
              className="w-8 h-8 rounded-full "
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Topbar;
