import BaseLayout from "@/components/base-layout";

import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Anime | Otakudesu",
  description: "Anime Page Otakudesu. Build by Rizky Haksono",
};

export default function AnimePage() {
  return (
    <>
      <BaseLayout>
        <div>Hai</div>
      </BaseLayout>
    </>
  );
}
