"use client";
import Image from "next/image";
import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
import { useState } from 'react';

export default function Subscribe() {
  return (
    <div className="container text-center">
  <div className="row">
    <div className="col-2">
    </div>
    <div className="col-8">
    <form>
  <div className="mb-3">
    <label for="sip-amount" className="form-label">Regular Contribution</label>
    <input type="number" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
  </div>
  <label for="sip-amount" className="form-label">Compounded</label>
  <select class="form-select" aria-label="Default select example">
  <option selected>Open this select menu</option>
  <option value="1">Monthly</option>
  <option value="2">Half Month</option>
  <option value="3">Weekly</option>
  </select>
  <br></br>
  <label for="customRange1" class="form-label">Monthly Contribution</label>
  <input type="range" class="form-range" min="0" max="100000" id="customRange2" />
</form>
    </div>
    <div className="col-2">
    </div>
  </div>
</div>
  );
}
