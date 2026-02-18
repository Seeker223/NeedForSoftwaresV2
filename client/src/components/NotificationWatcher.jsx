import { useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-toastify";

const fetchLatestPost = async () => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
    params: { page: 1, limit: 1, sort: "newest" },
  });
  return res.data?.posts?.[0] || null;
};

const NotificationWatcher = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const queryClient = useQueryClient();
  const prevSignedIn = useRef(false);
  const authInitialized = useRef(false);

  const { data: latestPost } = useQuery({
    queryKey: ["latestPostNotification"],
    queryFn: fetchLatestPost,
    refetchInterval: 90000,
    staleTime: 60000,
  });

  useEffect(() => {
    if (!isLoaded) return;

    if (!authInitialized.current) {
      authInitialized.current = true;
      prevSignedIn.current = isSignedIn;
      return;
    }

    if (!prevSignedIn.current && isSignedIn) {
      const name = user?.firstName || user?.username || "there";
      toast.success(`Login successful. Welcome, ${name}.`);
    }

    prevSignedIn.current = isSignedIn;
  }, [isLoaded, isSignedIn, user]);

  useEffect(() => {
    if (!latestPost) return;

    const storageKey = "nfs_last_seen_post_date";
    const lastSeen = localStorage.getItem(storageKey);

    if (!lastSeen) {
      localStorage.setItem(storageKey, latestPost.createdAt);
      return;
    }

    if (new Date(latestPost.createdAt) > new Date(lastSeen)) {
      toast.info(`New blog released: ${latestPost.title}`);
      localStorage.setItem(storageKey, latestPost.createdAt);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["featuredPosts"] });
    }
  }, [latestPost, queryClient]);

  return null;
};

export default NotificationWatcher;
