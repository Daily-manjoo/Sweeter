import AuthContext from "context/AuthContext";
import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { db } from "firebaseApp";
import { PostProps } from "pages/home"
import { useCallback, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface FollowingProps {
    post: PostProps;
}

interface UserProps {
    id: string;
}

export default function FollowingBox({post}:FollowingProps){
    const { user } = useContext(AuthContext);
    const [postFollowers, setPostFollowers] = useState<any>([]);

    const onClickFollow = async (e: any) => {
        e.preventDefault();

        try {
            if (user?.uid) {
                //내가 주체가 되어 '팔로잉' 커렉션 생성 or 업데이트
                const followingRef = doc(db, "following", user?.uid);
                
                await setDoc(
                    followingRef,
                    { users: arrayUnion({ id: post?.uid }) },
                    { merge: true }
                );
                //팔로우 당하는 사람이 주체가 되어 '팔로우' 컬렉션 생성 or 업데이트
                const followerRef = doc(db, "follower", post?.uid);
                await setDoc(
                    followerRef,
                    { users: arrayUnion({ id: user?.uid }) },
                    { merge: true }
                ); 
                toast.success("팔로우를 했습니다.")
            }

            //팔로잉 알림 생성
            await addDoc(collection(db, 'notifications'), {
              createdAt : new Date()?.toLocaleDateString("ko", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              }),
              content: `${user?.email || user?.displayName}가 팔로우를 했습니다.`,
              url: "#",
              isRead: false,
              uid: post?.uid, //팔로우를 누른 사람에게 알림을 보내야 하기 때문에 내 아이디가 아니라 post.uid
            })
        } catch (e) {
            console.log(e);
        }
    };

    const onClickDeleteFollow = async (e: any) => {
        e.preventDefault();
      
        try {
          if (user?.uid) {
            const followingRef = doc(db, "following", user?.uid);
            await updateDoc(followingRef, {
              users: arrayRemove({ id: post?.uid }),
            });
            const followerRef = doc(db, "follower", post?.uid);
            await updateDoc(followerRef, {
              users: arrayRemove({ id: user?.uid }),
            });
      
            setPostFollowers(postFollowers.filter((userId:any) => userId !== post?.uid));
            toast.success("팔로우를 취소했습니다.");
          }
        } catch (e) {
          console.log(e);
        }
      };

    //해당 게시글의 팔로워 보여주기
    const getFollowers = useCallback(async()=> {
        if(post.uid){
            const ref = doc(db, 'follower', post.uid)
            onSnapshot(ref, (doc)=> {
                setPostFollowers([]);
                doc?.data()?.users?.map((user: UserProps) => setPostFollowers((prev: UserProps[]) => (prev ? [...prev, user?.id] : []))
                );
            });
        }
    }, [post.uid]);

    useEffect(()=> {
        if(post.uid) getFollowers();
    }, [getFollowers, post.uid]);

    return(
        <>
        {user?.uid !== post?.uid && (
          postFollowers?.includes(user?.uid) ? (
            <button type="button" className="post__following-btn" onClick={onClickDeleteFollow}>
              Following
            </button>
          ) : (
            <button type="button" className="post__follow-btn" onClick={onClickFollow}>
              Follower
            </button>
          )
        )}
      </>
        
    )
}