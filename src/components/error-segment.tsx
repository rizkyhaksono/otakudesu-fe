import { Metadata } from "next/types"
import BaseLayout from "./base-layout"

export const metadata: Metadata = {
  title: "Error Segment | Otakudesu",
  description: "Otakudesu Page. Build by Rizky Haksono",
}

export default function ErrorSegment() {
  return (
    <BaseLayout>
      <div className="flex justify-center h-screen items-center font-medium text-xl">You have to put page number!</div>
    </BaseLayout>
  )
}
