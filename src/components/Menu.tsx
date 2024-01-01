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

export default function MenuList(){
    const {user} = useContext(AuthContext)
    console.log(user);
    const navigate = useNavigate();

    return <div className="footer">
        <div className="footer__grid">
            <button type="button" onClick={() => navigate("/")}>
                <BsHouse />
                Home
            </button>
            <button type="button" onClick={() => navigate("/profile")}>
                <BiUserCircle />
                Profile
            </button>
            <button type="button" onClick={() => navigate("/search")}>
                <MdOutlineSearch />
                search
            </button>
            {user === null ? (
            <button type="button" onClick={() => navigate("/users/login")}>
            <MdLogin />
            Login
            </button>
            ) : (
            <button type="button" onClick={async() => {
                const auth = getAuth(app);
                await signOut(auth);
                toast.success("로그아웃이 되었습니다.")
            }}>
            <MdLogout />
            Logout
            </button>
            ) }
            
        </div>
    </div>
}
