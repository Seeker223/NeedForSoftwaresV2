import { Link } from "react-router-dom";
import Image from "./Image";
import { format } from "timeago.js";

const PostListItem = ({ post }) => {

  return (
    <div className="flex flex-col xl:flex-row gap-8 mb-12 bg-white/80 border border-slate-200/70 rounded-3xl p-5 shadow-card">
      {/* image */}
      {post.img && (
        <div className="md:hidden xl:block xl:w-1/3">
          <Image src={post.img} className="rounded-2xl object-cover" w="735" />
        </div>
      )}
      {/* details */}
      <div className="flex flex-col gap-4 xl:w-2/3">
        <Link to={`/${post.slug}`} className="text-2xl md:text-3xl font-semibold text-slate-900 hover:text-brand-700 transition">
          {post.title}
        </Link>
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <span>Written by</span>
          <Link className="text-brand-700" to={`/posts?author=${post.user.username}`}>{post.user.username}</Link>
          <span>on</span>
          <Link className="text-brand-700" to={`/posts?cat=${post.category}`}>
            {post.category}
          </Link>
          <span>{format(post.createdAt)}</span>
        </div>
        <p className="text-slate-600">{post.desc}</p>
        <Link to={`/${post.slug}`} className="text-brand-700 text-sm font-medium hover:text-brand-800 transition">
          Read More
        </Link>
      </div>
    </div>
  );
};

export default PostListItem;
