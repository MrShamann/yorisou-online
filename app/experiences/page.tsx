import type { Metadata } from "next";
import ExperienceHub from "./view";
export const metadata:Metadata={title:"体験カード | Yorisou",description:"自分の体験を整理し、範囲を選んで共有する場所です。"};
export default function ExperiencePage(){return <ExperienceHub/>;}
