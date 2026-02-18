import { Link, useParams } from "react-router-dom";
import Image from "../components/Image";
import PostMenuActions from "../components/PostMenuActions";
import Search from "../components/Search";
import Comments from "../components/Comments";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { format } from "timeago.js";

const fetchPost = async (slug) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${slug}`);
  return res.data;
};

const SinglePostPage = () => {
  const { slug } = useParams();

  const { isPending, error, data } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => fetchPost(slug),
  });

  const pageTitle = data ? `${data.title} | NeedForSoftwares` : "NeedForSoftwares";
  const pageDescription = data?.desc
    ? data.desc
    : "NeedForSoftwares blog post about software engineering and Nigeria tech innovation.";
  const pageUrl = data
    ? `https://need-for-softwares-v2.vercel.app/${data.slug}`
    : "https://need-for-softwares-v2.vercel.app";
  const pageImage = data?.img
    ? `https://ik.imagekit.io/cu7rwsp4u/${data.img.replace(/^\/+/, "")}`
    : "https://need-for-softwares-v2.vercel.app/logo.png";

  useEffect(() => {
    if (!data) return;

    document.title = pageTitle;

    const setMetaByName = (name, content) => {
      let tag = document.head.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    const setMetaByProperty = (property, content) => {
      let tag = document.head.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", pageUrl);

    setMetaByName("description", pageDescription);
    setMetaByProperty("og:type", "article");
    setMetaByProperty("og:title", pageTitle);
    setMetaByProperty("og:description", pageDescription);
    setMetaByProperty("og:url", pageUrl);
    setMetaByProperty("og:image", pageImage);
    setMetaByName("twitter:card", "summary_large_image");
    setMetaByName("twitter:title", pageTitle);
    setMetaByName("twitter:description", pageDescription);
    setMetaByName("twitter:image", pageImage);
  }, [data, pageDescription, pageImage, pageTitle, pageUrl]);

  if (isPending) return "loading...";
  if (error) return "Something went wrong!" + error.message;
  if (!data) return "Post not found!";

  return (
    <div className="flex flex-col gap-8">
      {/* detail */}
      <div className="flex gap-8">
        <div className="lg:w-3/5 flex flex-col gap-6">
          <h1 className="text-2xl md:text-3xl xl:text-4xl 2xl:text-5xl font-semibold text-slate-900 dark:text-slate-100">
            {data.title}
          </h1>
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
            <span>Written by</span>
            <Link
              className="text-brand-700"
              to={`/posts?author=${data.user.username}`}
            >
              {data.user.username}
            </Link>
            <span>on</span>
            <Link className="text-brand-700" to={`/posts?cat=${data.category}`}>
              {data.category}
            </Link>
            <span>{format(data.createdAt)}</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 font-medium">{data.desc}</p>
        </div>
        {data.img && (
          <div className="hidden lg:block w-2/5">
            <Image src={data.img} w="600" className="rounded-3xl shadow-card" />
          </div>
        )}
      </div>
      {/* content */}
      <div className="flex flex-col md:flex-row gap-12 justify-between">
        {/* text */}
        <div className="lg:text-lg flex flex-col gap-6 text-justify text-slate-700 dark:text-slate-300">
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: data.content }}
          />
        </div>
        {/* menu */}
        <div className="px-4 h-max sticky top-8 bg-white/80 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800 rounded-3xl p-4 shadow-card">
          <h1 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-200">Author</h1>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              {data.user.img && (
                <Image
                  src={data.user.img}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-brand-100"
                  w="48"
                  h="48"
                />
              )}
              <Link
                className="text-brand-700 font-medium"
                to={`/posts?author=${data.user.username}`}
              >
                {data.user.username}
              </Link>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Lorem ipsum dolor sit amet consectetur
            </p>
            <div className="flex gap-2">
              <Link>
                <img src="/facebook.svg" alt="Facebook" className="w-5 h-5" />
              </Link>
              <Link>
                <img src="/instagram.svg" alt="Instagram" className="w-5 h-5" />
              </Link>
            </div>
          </div>
          <PostMenuActions post={data}/>
          <h1 className="mt-8 mb-4 text-sm font-semibold text-slate-700 dark:text-slate-200">Categories</h1>
          <div className="flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-300">
            <Link className="hover:text-brand-700 transition">All</Link>
            <Link className="hover:text-brand-700 transition" to="/">
              Web Design
            </Link>
            <Link className="hover:text-brand-700 transition" to="/">
              Development
            </Link>
            <Link className="hover:text-brand-700 transition" to="/">
              Databases
            </Link>
            <Link className="hover:text-brand-700 transition" to="/">
              Search Engines
            </Link>
            <Link className="hover:text-brand-700 transition" to="/">
              Marketing
            </Link>
          </div>
          <h1 className="mt-8 mb-4 text-sm font-semibold text-slate-700 dark:text-slate-200">Search</h1>
          <Search />
        </div>
      </div>
      <Comments postId={data._id}/>
    </div>
  );
};

export default SinglePostPage;
