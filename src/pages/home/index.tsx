import PostForm from "components/posts/PostFrom";
import PostBox from "components/posts/PostBox";

export interface PostProps {
    id: string;
    email: string;
    content: string;
    createdAt: string;
    uid: string;
    profileUrl?: string; //선택사항(옵셔널)
    likes?: string[];
    likeCount?: number;
    comments?: any;
}

export const posts: PostProps[] = [
    {
        id: "1",
        email: "test@test.com",
        content: "내용1입니다",
        createdAt: "2023-12-19",
        uid: '123123',
    },
    {
        id: "2",
        email: "test@test.com",
        content: "내용2입니다",
        createdAt: "2023-12-19",
        uid: '123123',
    },
    {
        id: "3",
        email: "test@test.com",
        content: "내용3입니다",
        createdAt: "2023-12-19",
        uid: '123123',
    },
    {
        id: "4",
        email: "test@test.com",
        content: "내용4입니다",
        createdAt: "2023-12-22",
        uid: '123123',
    },
]

export default function HomePage(){
    
    return (
        <div className="home">
            <div className="home__title">Home</div>
            <div className="home__tabs">
                <div className="home__tab home__tab--active">For you</div>
                <div className="home__tab">Following</div>
            </div>
            <PostForm />
            <div className="post">
                {posts?.map((post)=> (
                    <PostBox post={post} key={post.id} />
            ))}
            </div>
         </div>
    );
}