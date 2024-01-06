import PostHeader from "components/posts/Header";
import AuthContext from "context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { FiImage } from "react-icons/fi";
import { updateProfile } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { storage } from "firebaseApp";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function ProfileEdit(){
    const [displayName, setDisplayName] = useState<string>("");
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const {user} = useContext(AuthContext);
    const navigate = useNavigate();

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {target: { value },
        } = e;

        setDisplayName(value);
    };

    const handleFileUpload = (e: any) => {
        const { target : {files},
    } = e;

        const file = files?.[0];
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onloadend = (e:any) => {
            const { result } = e?.currentTarget;
            setImageUrl(result);
        };
    };

    const handleDeleteImage = () => {
        setImageUrl(null);
    };

    const onSubmit = async (e:any) => {
        let key = `{user?.uid}/${uuidv4()}`
        const storageRef = ref(storage, key);
        let newImageUrl = null;

        e.preventDefault();

        try {
            //기존 이미지 삭제
            // if(user?.photoURL){
            //     const imageRef = ref(storage, user?.photoURL);
            //     await deleteObject(imageRef).catch((error) => {
            //         console.log(error);
            //     })
            // }
            //새 이미지 업로드
            if(imageUrl){
                const data = await uploadString(storageRef, imageUrl, "data_url");
                newImageUrl = await getDownloadURL(data?.ref);
            }
            //updateProfile 호출하기
            if(user){
                await updateProfile(user, {
                    displayName: displayName || "",
                    photoURL: newImageUrl || "",
                }).then(()=> {
                    toast.success("프로필이 업데이트 되었습니다.")
                    navigate('/profile');
                }).catch((error) => {
                    console.log(error);
                })
            }
        } catch (e:any) {
            console.log(e);
        }
    };

    useEffect(() => {
        if(user?.photoURL){
            setImageUrl(user?.photoURL)
        }
        if(user?.displayName){
        setDisplayName(user?.displayName);
        }
    }, [user?.displayName, user?.photoURL]);

    return (
        <div className="post">
            <PostHeader />
            <form className="post-form" onSubmit={onSubmit}>
                <div className="post-form__profile">
                    <input type="text" name="displayName" className="post-form__input" placeholder="이름" onChange={onChange} value={displayName} />
                    {imageUrl && (
                        <div className="post-form__attachment">
                            <img src={imageUrl} alt="attachment" width={100} height={100}/>
                            <button type="button" onClick={handleDeleteImage} className="post-form__clear-btn">
                                삭제
                            </button>
                        </div>
                    )}
                    <div className="post-form__submit-area">
                        <div className="post-form__image-area">
                            <label className="post-form__file" htmlFor="file-input">
                                <FiImage className="post-form__file-icon"/>
                            </label>
                            <input type="file" name="file-input"  id="file-input" className="hidden"accept="image/*"  onChange={handleFileUpload} />
                            <input type="submit" value="프로필 수정" className="post-form__submit-btn" />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}