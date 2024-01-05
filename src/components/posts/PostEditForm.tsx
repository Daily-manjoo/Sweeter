import { FiImage } from "react-icons/fi";
import { useCallback, useContext, useEffect, useState } from "react";
import { updateDoc, getDoc, doc } from "firebase/firestore";
import { db, storage } from "firebaseApp";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { PostProps } from "pages/home";
import { v4 as uuidv4 } from "uuid";
import { getDownloadURL, ref, uploadString, deleteObject } from "firebase/storage";
import AuthContext from "context/AuthContext";
import PostHeader from "./Header";

export default function PostEditForm() {
    const params = useParams(); //url에 id값을 가져와야 하기 때문
    const [hashTag, setHashTag] = useState<string>("");
    const [tags, setTags] = useState<string[]>([]);
    const [post, setPost] = useState<PostProps | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false); //image가 전송중인지(여러 파일 업로드 방지)
    const [imageFile, setImageFile] = useState<string | null>(null);
    const [content, setContent ] = useState<string>("");
    const navigate = useNavigate();
    const {user} = useContext(AuthContext)

    const handleFileUpload = (e: any) => {
        const {
            target: {files},
        } = e;

        const file = files?.[0];
        const fileReader = new FileReader();
        fileReader?.readAsDataURL(file);

        fileReader.onloadend = (e: any) => {
            const {result} = e?.currentTarget;
            setImageFile(result);
        }
    }


    const getPost = useCallback(async() => {
        if(params.id){
            const docRef = doc(db, "posts", params.id);
            const docSnap = await getDoc(docRef);
            console.log(docSnap?.data(),docSnap.id)
            setPost({...(docSnap?.data() as PostProps), id: docSnap.id})
            setContent(docSnap?.data()?.content);
            setTags(docSnap?.data()?.hashTags);
            setImageFile(docSnap?.data()?.imageUrl);
        }
    }, [params.id])

    const onSubmit = async(e:any) => {
        setIsSubmitting(true);
        const key = `${user?.uid}/${uuidv4()}`;
        const storageRef = ref(storage, key)
        e.preventDefault();

        try {
         if(post){
            //기존 사진을 지우고 새로운 사진 업로드하기
            if(post?.imageUrl){
                let imageRef = ref(storage, post?.imageUrl)
                await deleteObject(imageRef).catch((error)=> {
                    console.log(error);
                });
            }

            //새로운 파일이 있다면 업로드
            let imageUrl = "";
            if(imageFile){
                const data = await uploadString(storageRef, imageFile, 'data_url');
                imageUrl = await getDownloadURL(data?.ref);
            }
            
            const postRef = doc(db, "posts", post?.id);
            await updateDoc(postRef, {
                content: content,
                hashTags: tags,
                imageUrl: imageUrl,
            });
            navigate(`posts/${post?.id}`)
            toast.success("게시글을 수정했습니다.")
         }
         setImageFile(null);
         setIsSubmitting(false);
        } catch(e:any){
        }
    }

    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { target: {name, value},
        } = e;
        
        if(name==="content") {
            setContent(value)
        }
    }

    const removeTag = (tag:string) => {
        setTags(tags?.filter((val) => val !== tag)) //value가 tag가 아닌 것만 필터링
    }

    const onChangeHashTag = (e: any) => {
        setHashTag(e?.target?.value?.trim());
    }

    const handleKeyUp = (e:any) => {
        if (e.keyCode === 32 && e.target.value.trim() !==''){
            //엔터를 치고 빈 값이 없어야만 태그 생성
            //만약 같은 태그가 있다면 에러를 띄운다
            if(tags?.includes(e.target.value?.trim())) {
                toast.error("같은 태그가 있습니다.");
            } else {
                setTags((prev) => (prev?.length > 0 ? [...prev,hashTag] : [hashTag]));
                setHashTag("");
            }
        }
    }

    const handleDeleteImage = () => {
        setImageFile(null); //clear시 이미지 파일 초기화
    }

    useEffect(()=> {
        if(params?.id) getPost();
    }, [getPost, params?.id])

    return(
        <div className="post">
            <PostHeader />
            <form className="post-form" onSubmit={onSubmit}>
            <textarea className="post-form__textarea" required name="content" id="content" placeholder="What is your dessert?" onChange={onChange} value={content} />
            <div className="post-form__hashtags">
            <span className="post-form__hastags-outputs">
                {tags?.map((tag, index)=> (
                    <span className="post-form__hashtags-tag" key={index} onClick={() => removeTag(tag)}>#{tag}</span>
                ))}
            </span>
                <input type="text" className="post-form__input" name="hashtag" id="hasgtag" placeholder="해시태그 + 스페이스 바 입력" onChange={onChangeHashTag} onKeyUp={handleKeyUp} value={hashTag} />
            </div>
            <div className="post-form__submit-area">
                <div className="post-form__image-area">
                    <label htmlFor="file-input" className="post-form__file">
                        <FiImage className="post-form__file-icon" />
                    </label>
                    <input type="file" name="file-input" id="file-input" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    {imageFile && (
                        <div className="post-form__attachment">
                            <img src={imageFile} alt="attachment" width={100} height={100} />
                            <button className="post-form__clear-btn" type="button" onClick={handleDeleteImage}>Clear</button>
                        </div>
                    )}
                </div>
                <input type="submit" value="등록" className="post-form__submit-btn" disabled={isSubmitting} />
            </div>
            </form>
        </div>
        
    )
}