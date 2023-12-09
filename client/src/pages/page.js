"use client";
import Image from "next/image";
import "bootstrap/dist/css/bootstrap.min.css";
import firstpage from "../app/public/firstpage.png"
import Link from "next/link";
import { useState } from 'react';
// import Modal from '../components/Modal';
import Mymodal from "../components/Mymodal";
// import useModal from "./context/useModal";
// import { GlobalContextProvider, useGlobalContext } from "./context/store";

export default function Home() {
  // const { isOpen, openModal, closeModal } = useModal();
  return (
    <div className="container text-center">
  <div className="row">
    <div className="col-4">
    <Image src= {firstpage} alt=" " height="50%" width="50%"  />

    <Mymodal />
    </div>
    <div className="col-8">
    view existing baskets
    <br />
    <Link href="/buckets" classNameName="hover:text-blue-200">
    <button type="button" className="btn btn-primary">view</button>
    </Link>
    </div>
  </div>
</div>
  );
}
