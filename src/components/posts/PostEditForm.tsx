import { FiImage } from "react-icons/fi";
import { useCallback, useEffect, useState } from "react";
import { updateDoc, getDoc, doc } from "firebase/firestore";
import { db } from "firebaseApp";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { PostProps } from "pages/home";

export default function PostEditForm() {
    const params = useParams(); //url에 id값을 가져와야 하기 때문
    const [hashTag, setHashTag] = useState<string>("");
    const [tags, setTags] = useState<string[]>([]);
    const [post, setPost] = useState<PostProps | null>(null);
    const [content, setContent ] = useState<string>("");
    const navigate = useNavigate();
    const handleFileUpload = () => {

    }

    const getPost = useCallback(async() => {
        if(params.id){
            const docRef = doc(db, "posts", params.id);
            const docSnap = await getDoc(docRef);
            console.log(docSnap?.data(),docSnap.id)
            setPost({...(docSnap?.data() as PostProps), id: docSnap.id})
            setContent(docSnap?.data()?.content);
            setTags(docSnap?.data()?.hashTags);
        }
    }, [params.id])

    const onSubmit = async(e:any) => {
        e.preventDefault();

        try {
         if(post){
            const postRef = doc(db, "posts", post?.id);
            await updateDoc(postRef, {
                content: content,
                hashTags: tags,
            });
            navigate(`posts/${post?.id}`)
            toast.success("성공적으로 수정되었습니다.")
         }
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

    useEffect(()=> {
        if(params?.id) getPost();
    }, [getPost, params?.id])
    return(
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
            <label htmlFor="file-input" className="post-form__file">
                <FiImage className="post-form__file-icon" />
            </label>
            <input type="file" name="file-input" accept="image/*" onChange={handleFileUpload} className="hidden" />
            <input type="submit" value="수정" className="post-form__submit-btn" />
        </div>
    </form>
    )
}