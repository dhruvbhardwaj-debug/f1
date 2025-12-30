"use client"

import { UploadDropzone } from "@/lib/uploadthing";

import "@uploadthing/react/styles.css"

interface FileUploadProps{
    onChange:(url?:string)=>void;
    value:string;
    endpoint:"serverImage" | "messageFile";
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const FileUpload = ({onChange,value,endpoint}:FileUploadProps)=>{
    return(
        <div>
            <UploadDropzone
            endpoint = {endpoint}
            onClientUploadComplete={(res)=>{
                onChange(res?.[0].url);
            }}
            onUploadError={(error:Error)=>{
                console.log(error);
            }}
            />
        </div>
    ) 
}