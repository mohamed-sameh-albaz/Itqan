import * as express from "express";

express().get("test", ()=>{
    console.log("Hello World");
})