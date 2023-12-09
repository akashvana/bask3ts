import Image from "next/image";
import "bootstrap/dist/css/bootstrap.min.css";
// import firstpage from "../app/public/firstpage.png"
import Card from "../../components/Card";
import Link from "next/link";

export const metadata = {
  title: "Home : Work Manager",
};

export default function Home() {
    const items = ["hello", "hi","hey"]
  return (
    <div className="container text-center">
  <ul>
     {items.map((item,index)=>{
         return <li><Card title={item} description="sx"/></li>
     })}
 </ul>
</div>
  );
}