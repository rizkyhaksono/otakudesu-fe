"use client";

import { DiscussionEmbed } from "disqus-react";

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

  return (
    <div className="mt-10">
      <div className="flex flex-col gap-2 bg-white text-muted/20 dark:bg-muted/20 dark:text-muted/80">
        <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
      </div>
    </div>
  );
};
export default DisqusComments;
