import { FiImage } from "react-icons/fi";

export interface PostProps {
    id: string;
    email: string;
    content: string;
    createAt: string;
    uid: string;
}

const posts: PostProps[] = [
    {
        id: "1",
        email: "test@test.com",
        content: "내용1입니다",
        createAt: "2023-12-19",
        uid: '123123',
    },
    {
        id: "2",
        email: "test@test.com",
        content: "내용2입니다",
        createAt: "2023-12-19",
        uid: '123123',
    },
    {
        id: "3",
        email: "test@test.com",
        content: "내용3입니다",
        createAt: "2023-12-19",
        uid: '123123',
    },
]

export default function HomePage(){
    const handleFileUpload = () => {

    }
    return (
        <div className="home">
            <div className="home__title">Home</div>
            <div className="home__tabs">
                <div className="home__tab home__tab--active">For you</div>
                <div className="home__tab">Following</div>
            </div>
            {/* Post Form */}
            <form className="post-form">
                <textarea className="post-form__textarea" required name="content" id="content" placeholder="What is your dessert?" />
                <div className="post-form__submit-area">
                    <label htmlFor="file-input" className="post-form__file">
                        <FiImage className="post-form__file-icon" />
                    </label>
                    <input type="file" name="file-input" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    <input type="submit" value="등록" className="post-form__submit-btn" />
                </div>
            </form>
            {/* Tweet Post Form */}
            <div className="post">
                {posts?.map((post)=> (
                    <div className="post__box" key={post?.id}>
                        {post?.content}
                    </div>
                ))}
            </div>
        </div>
    );
}