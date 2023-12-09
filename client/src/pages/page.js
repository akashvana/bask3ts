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
    You don’t have to be a digital marketing pro to know how important a website is to modern business. As both a digital interface for delivering products and services and a vehicle for generating leads, your website needs to look good. If you want to deliver a smooth customer experience and look good while doing it, a web designer can help.
    <br />
    <Link href="/buckets" classNameName="hover:text-blue-200">
    <button type="button" className="btn btn-primary">Launch</button>
    </Link>
    </div>
  </div>
</div>
  );
}
