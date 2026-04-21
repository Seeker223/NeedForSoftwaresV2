import { useAuth, useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import Upload from "../components/Upload";

const fetchPostById = async (id) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts/id/${id}`);
  return res.data;
};

const fetchCategories = async () => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/categories`);
  return res.data;
};

const EditPost = () => {
  const { id } = useParams();
  const { isLoaded, isSignedIn, user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("general");
  const [desc, setDesc] = useState("");
  const [value, setValue] = useState("");
  const [imgPath, setImgPath] = useState("");
  const [progress, setProgress] = useState(0);

  const { isPending, error, data } = useQuery({
    queryKey: ["postById", id],
    queryFn: () => fetchPostById(id),
    enabled: !!id && isAdmin,
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  useEffect(() => {
    if (!data) return;
    setTitle(data.title || "");
    setCategory(data.category || "general");
    setDesc(data.desc || "");
    setValue(data.content || "");
    setImgPath(data.img || "");
  }, [data]);

  const categoryOptions = useMemo(() => {
    if (Array.isArray(categories) && categories.length) {
      return categories.map((c) => ({
        value: c.slug,
        label: c.name,
      }));
    }
    return [
      { value: "general", label: "General" },
      { value: "web-design", label: "Web Design" },
      { value: "development", label: "Development" },
      { value: "databases", label: "Databases" },
      { value: "seo", label: "Search Engines" },
      { value: "marketing", label: "Marketing" },
    ];
  }, [categories]);

  const mutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return axios.put(
        `${import.meta.env.VITE_API_URL}/posts/${id}`,
        {
          img: imgPath || "",
          title,
          category,
          desc,
          content: value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: (res) => {
      toast.success("Post updated");
      navigate(`/${res.data.slug}`);
    },
    onError: (error) => {
      toast.error(error.response?.data || "Failed to update post");
    },
  });

  if (!isLoaded) {
    return <div className="text-slate-600 dark:text-slate-300">Loading...</div>;
  }

  if (!isSignedIn) {
    return (
      <div className="text-slate-600 dark:text-slate-300">
        You should login!
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="text-slate-600 dark:text-slate-300">
        Only admins can edit posts.
      </div>
    );
  }

  if (isPending) return "loading...";
  if (error) return "Something went wrong!" + error.message;
  if (!data) return "Post not found!";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title is required.");
      return;
    }
    if (!value || !value.trim()) {
      toast.error("Content is required.");
      return;
    }
    mutation.mutate();
  };

  return (
    <div className="h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
        Edit Post
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1 mb-6">
        <Upload
          type="image"
          setProgress={setProgress}
          setData={(res) => setImgPath(res.filePath)}
        >
          <button
            type="button"
            className="w-max p-2 shadow-card rounded-xl text-sm text-slate-600 dark:text-slate-200 bg-white/80 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800 hover:bg-brand-50 dark:hover:bg-slate-800 transition"
          >
            {imgPath ? "Change cover image" : "Add a cover image"}
          </button>
        </Upload>
        <input
          className="text-3xl md:text-4xl font-semibold bg-transparent outline-none text-slate-900 dark:text-slate-100"
          type="text"
          placeholder="My Awesome Story"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <div className="flex items-center gap-4">
          <label className="text-sm text-slate-700 dark:text-slate-300">
            Choose a category:
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-2 rounded-xl bg-white/80 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800 shadow-card"
          >
            {categoryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <textarea
          className="p-4 rounded-xl bg-white/80 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800 shadow-card text-slate-800 dark:text-slate-100"
          placeholder="A Short Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <div className="flex flex-1 ">
          <ReactQuill
            theme="snow"
            className="flex-1 rounded-xl bg-white/80 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800 shadow-card"
            value={value}
            onChange={setValue}
            readOnly={0 < progress && progress < 100}
          />
        </div>
        <button
          disabled={mutation.isPending || (0 < progress && progress < 100)}
          className="bg-brand-700 text-white font-medium rounded-xl mt-4 p-3 w-full sm:w-44 sm:self-start shadow-soft hover:bg-brand-800 disabled:bg-brand-300 disabled:cursor-not-allowed"
        >
          {mutation.isPending ? "Saving..." : "Save"}
        </button>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {"Progress:" + progress}
        </span>
      </form>
    </div>
  );
};

export default EditPost;

