import { Link, useParams } from "react-router-dom";
import Image from "../components/Image";
import PostMenuActions from "../components/PostMenuActions";
import Search from "../components/Search";
import Comments from "../components/Comments";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { format } from "timeago.js";
import { Helmet } from "react-helmet-async";

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

  if (isPending) return "loading...";
  if (error) return "Something went wrong!" + error.message;
  if (!data) return "Post not found!";

  const pageTitle = `${data.title} | NeedForSoftwares`;
  const pageDescription =
    data.desc ||
    "NeedForSoftwares blog post about the Hender Xender social networking app and Nigeria tech innovation.";
  const pageUrl = `https://need-for-softwares-v2.vercel.app/${data.slug}`;
  const pageImage = data.img
    ? `https://ik.imagekit.io/cu7rwsp4u/${data.img.replace(/^\/+/, "")}`
    : "https://need-for-softwares-v2.vercel.app/logo.png";

  return (
    <div className="flex flex-col gap-8">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={pageImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageImage} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: data.title,
            description: pageDescription,
            image: pageImage,
            datePublished: data.createdAt,
            dateModified: data.updatedAt || data.createdAt,
            author: {
              "@type": "Person",
              name: data.user?.username || "NeedForSoftwares",
            },
            publisher: {
              "@type": "Organization",
              name: "NeedForSoftwares",
              logo: {
                "@type": "ImageObject",
                url: "https://need-for-softwares-v2.vercel.app/logo.png",
              },
            },
            mainEntityOfPage: pageUrl,
          })}
        </script>
      </Helmet>
      {/* detail */}
      <div className="flex gap-8">
        <div className="lg:w-3/5 flex flex-col gap-6">
          <h1 className="text-2xl md:text-3xl xl:text-4xl 2xl:text-5xl font-semibold text-slate-900">
            {data.title}
          </h1>
          <div className="flex items-center gap-2 text-slate-500 text-sm">
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
          <p className="text-slate-600 font-medium">{data.desc}</p>
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
        <div className="lg:text-lg flex flex-col gap-6 text-justify text-slate-700">
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: data.content }}
          />
        </div>
        {/* menu */}
        <div className="px-4 h-max sticky top-8 bg-white/80 border border-slate-200/70 rounded-3xl p-4 shadow-card">
          <h1 className="mb-4 text-sm font-semibold text-slate-700">Author</h1>
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
            <p className="text-sm text-slate-500">
              Lorem ipsum dolor sit amet consectetur
            </p>
            <div className="flex gap-2">
              <Link>
                <Image src="facebook.svg" />
              </Link>
              <Link>
                <Image src="instagram.svg" />
              </Link>
            </div>
          </div>
          <PostMenuActions post={data}/>
          <h1 className="mt-8 mb-4 text-sm font-semibold text-slate-700">Categories</h1>
          <div className="flex flex-col gap-2 text-sm text-slate-600">
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
          <h1 className="mt-8 mb-4 text-sm font-semibold text-slate-700">Search</h1>
          <Search />
        </div>
      </div>
      <Comments postId={data._id}/>
    </div>
  );
};

export default SinglePostPage;
