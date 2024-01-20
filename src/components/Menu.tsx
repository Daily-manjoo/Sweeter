import { useNavigate } from "react-router-dom"
import { BsHouse } from "react-icons/bs"; //뒤에 세트이름을 넣어주는 이유(트리쉐이킹 때문)
import { BiUserCircle } from "react-icons/bi";
import { MdLogout, MdLogin } from "react-icons/md";
import { useContext } from "react";
import AuthContext from "context/AuthContext";
import { getAuth, signOut } from "firebase/auth";
import { app } from "firebaseApp";
import { toast } from "react-toastify";
import { MdOutlineSearch } from "react-icons/md";
import { IoMdNotifications } from "react-icons/io";
import useTranslation from "hooks/useTranslation";

export default function MenuList(){
    const {user} = useContext(AuthContext)
    console.log(user);
    const navigate = useNavigate();
    const translate = useTranslation();

    return <div className="footer">
        <div className="footer__grid">
            <button type="button" onClick={() => navigate("/")}>
                <BsHouse />
                <span className="footer__grid--text">{translate("MENU_HOME")}</span>
            </button>
            <button type="button" onClick={() => navigate("/profile")}>
                <BiUserCircle />
                <span className="footer__grid--text">{translate("MENU_PROFILE")}</span>
            </button>
            <button type="button" onClick={() => navigate("/search")}>
                <MdOutlineSearch />
                <span className="footer__grid--text">{translate("MENU_SEARCH")}</span>
            </button>
            <button type="button" onClick={() => navigate("/notifications")}>
                <IoMdNotifications />
                <span className="footer__grid--text">{translate("MENU_NOTI")}</span>
            </button>
            {user === null ? (
            <button type="button" onClick={() => navigate("/users/login")}>
            <MdLogin />
            <span className="footer__grid--text">{translate("MENU_LOGIN")}</span>
            </button>
            ) : (
            <button type="button" onClick={async() => {
                const auth = getAuth(app);
                await signOut(auth);
                toast.success("로그아웃이 되었습니다.")
            }}>
            <MdLogout />
            <span className="footer__grid--text">{translate("MENU_LOGOUT")}</span>
            </button>
            ) }
            
        </div>
    </div>
}
