import AuthContext from "context/AuthContext";
import { arrayRemove, doc, updateDoc } from "firebase/firestore";
import { db } from "firebaseApp";
import { PostProps } from "pages/home";
import { useContext } from "react";
import {toast} from "react-toastify"

export interface CommentProps {
    comment: string;
    uid: string;
    email: string;
    createdAt: string;
  }
  
  interface CommentBoxProps {
    data: CommentProps;
    post: PostProps;
  }
  

  export default function CommentBox({ data, post }: CommentBoxProps) {
    const { user } = useContext(AuthContext);

    const handleDeleteComment = async () => {
      if (post) {
        try {
          const postRef = doc(db, "posts", post?.id);
          await updateDoc(postRef, {
            comments: arrayRemove(data),
          });
          toast.success("댓글을 삭제했습니다");
        } catch (e) {
          console.log(e);
        }
      }
    };

    return <div key={data?.createdAt} className="comment">
        <div className="comment__border-box">
            <div className="comment__img-box">
                <div className="comment__flex-box">
                    <img src={`/logo192.png`} alt="profile" />
                    <div className="comment__email">{data?.email}</div>
                    <div className="comment__createdAt">{data?.createdAt}</div>
                </div>
            </div>
            <div className="comment__content">{data?.comment}</div>
        </div>
        <div className="comment__submit-div">
            {data?.uid === user?.uid && (
                <button type="button" className="comment__delete-btn" onClick={handleDeleteComment}>
                삭제
                </button>
            )}
        </div>
    </div>
}