import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.jsx";
import Homepage from "./routes/Homepage.jsx";
import PostListPage from "./routes/PostListPage.jsx";
import SinglePostPage from "./routes/SinglePostPage.jsx";
import LoginPage from "./routes/LoginPage.jsx";
import RegisterPage from "./routes/RegisterPage.jsx";
import Cpanel from "./routes/Cpanel.jsx";

const ClientOnlyWrite = () => {
  const [WriteComponent, setWriteComponent] = useState(null);

  useEffect(() => {
    let mounted = true;
    import("./routes/Write.jsx").then((module) => {
      if (mounted) {
        setWriteComponent(() => module.default);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (!WriteComponent) {
    return <div className="py-10 text-slate-600">Loading editor...</div>;
  }

  return <WriteComponent />;
};

const ClientOnlyEditPost = () => {
  const [EditPostComponent, setEditPostComponent] = useState(null);

  useEffect(() => {
    let mounted = true;
    import("./routes/EditPost.jsx").then((module) => {
      if (mounted) {
        setEditPostComponent(() => module.default);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (!EditPostComponent) {
    return <div className="py-10 text-slate-600">Loading editor...</div>;
  }

  return <EditPostComponent />;
};

const App = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Homepage />} />
        <Route path="/posts" element={<PostListPage />} />
        <Route path="/:slug" element={<SinglePostPage />} />
        <Route
          path="/write"
          element={<ClientOnlyWrite />}
        />
        <Route path="/cpanel" element={<Cpanel />} />
        <Route path="/cpanel/posts/:id/edit" element={<ClientOnlyEditPost />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
    </Routes>
  );
};

export default App;
