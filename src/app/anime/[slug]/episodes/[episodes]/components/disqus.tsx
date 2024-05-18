"use client";

import {
  DiscussionEmbed,
  CommentCount,
  CommentEmbed,
  Recommendations,
} from "disqus-react";
import { useEffect } from "react";
import { useTheme } from "next-themes";

const DisqusComments = ({ post }: { post: any }) => {
  const disqusShortname = "otakudesu-4";
  const disqusConfig = {
    url:
      "https://otakudesu.natee.my.id/anime/" +
      post.slug +
      "/episodes/" +
      post.episodes,
    identifier: post.slug,
    title: post.title,
    language: "id_ID",
    sso: {
      name: "Otakudesu",
      icon: "https://otakudesu.natee.my.id/favicon.ico",
      url: "https://otakudesu.natee.my.id",
      width: "500",
      height: "400",
    },
  };

  const { theme } = useTheme();

  // reload the disqus script when the component is mounted
  useEffect(() => {
    if (theme === "dark") {
      const disqusThread = document.getElementById("disqus_thread");
      const body = document.getElementsByClassName("contenteditable");
      if (disqusThread) {
        disqusThread.style.setProperty(
          "background-color",
          "#1a1a1a",
          "important",
        );
        disqusThread.style.setProperty("color", "#fff", "important");
      }
    }
  });

  return (
    <div className="mt-10">
      <p>Comments Section</p>
      <CommentCount shortname={disqusShortname} config={disqusConfig} />
      <div className="flex flex-col gap-2">
        <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
        <div className="flex h-full w-full">
          <CommentEmbed
            showMedia={true}
            showParentComment={true}
            width={400}
            height={320}
            commentId={post.title}
          />
          <Recommendations shortname={disqusShortname} config={disqusConfig} />
        </div>
      </div>
    </div>
  );
};
export default DisqusComments;
