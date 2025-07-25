"use client"

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import { TailSpin } from 'react-loader-spinner';
import { useRouter } from 'next/navigation';
import { add_new_category } from '@/Services/Admin/category';
import Cookies from 'js-cookie';




type Inputs = {
    name: string,
    description: string,
    slug: string,
    image: Array<File>,
}

interface loaderType {
    loader: Boolean
}

const uploadImageToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ztqnpcmt');
  
    const res = await fetch('https://api.cloudinary.com/v1_1/dtr4nxsdu/image/upload', {
      method: 'POST',
      body: formData,
    });
  
    if (!res.ok) throw new Error('Image upload failed');
    const data = await res.json();
    return data.secure_url;
  };

const maxSize = (value: File) => {
    const fileSize = value.size / 1024 / 1024;
    return fileSize < 1 ? false : true
}



interface userData {
    email: String,
    role: String,
    _id: String,
    name: String
  }
  

export default function AddCategory() {

    const [loader, setLoader] = useState(false)
    const Router = useRouter();
    


    useEffect(() => {
        const user: userData | null = JSON.parse(localStorage.getItem('user') || '{}');
        if (!Cookies.get('token') || user?.role !== 'admin') {
            Router.push('/')
        }
        
    }, [  Router])


    


    const { register, formState: { errors }, handleSubmit } = useForm<Inputs>({
        criteriaMode: "all"
    });

    const onSubmit: SubmitHandler<Inputs> = async data => {
        setLoader(true)
        const CheckFileSize = maxSize(data.image[0]);
        if (CheckFileSize) return toast.error('Image size must be less then 1MB')
        const uploadImageToFirebase = await uploadImageToCloudinary(data.image[0]);

        const finalData = { categoryName: data.name, categoryDescription: data.description, categoryImage: uploadImageToFirebase, categorySlug: data.slug }

        const res = await add_new_category(finalData)
        if (res.success) {
            toast.success(res?.message);
            setTimeout(() => {
                Router.push('/Dashboard')
            }, 2000);
            setLoader(false)
        } else {
            toast.error(res?.message)
            setLoader(false)
        }
    }






    return (
        <div className='w-full  p-4 min-h-screen  bg-gray-50 flex flex-col '>
            <div className="text-sm breadcrumbs  border-b-2 border-b-orange-600">
                <ul className='dark:text-black'>
                    <li>
                        <Link href={'/Dashboard'}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 mr-2 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                            Home
                        </Link>
                    </li>
                    <li>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 mr-2 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        Add Category
                    </li>
                </ul>
            </div>
            <div className='w-full h-20 my-2 text-center'>
                <h1 className='text-2xl py-2 dark:text-black'>Add Category</h1>
            </div>
            {
                loader ? (
                    <div className='w-full  flex-col h-96 flex items-center justify-center '>
                        <TailSpin
                            height="50"
                            width="50"
                            color="orange"
                            ariaLabel="tail-spin-loading"
                            radius="1"
                            wrapperStyle={{}}
                            wrapperClass=""
                            visible={true}
                        />
                        <p className='text-sm mt-2 font-semibold text-orange-500'>Adding Category Hold Tight ....</p>
                    </div>
                ) : (

                    <div className='w-full h-full flex items-start justify-center'>
                        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg  py-2 flex-col ">
                            <div className="form-control w-full mb-2">
                                <label className="label">
                                    <span className="label-text">Category Name</span>
                                </label >
                                <input {...register("name", { required: true })} type="text" placeholder="Type here" className="input input-bordered w-full" />
                                {errors.name && <span className='text-red-500 text-xs mt-2'>This field is required</span>}
                            </div >
                            <div className="form-control w-full mb-2">
                                <label className="label">
                                    <span className="label-text">Category Slug</span>
                                </label>
                                <input  {...register("slug", { required: true })} type="text" placeholder="Type here" className="input input-bordered w-full" />
                                {errors.slug && <span className='text-red-500 text-xs mt-2'>This field is required</span>}

                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Category Description</span>
                                </label>
                                <textarea  {...register("description", { required: true })} className="textarea textarea-bordered h-24" placeholder="Description"></textarea>
                                {errors.description && <span className='text-red-500 text-xs mt-2'>This field is required</span>}

                            </div>
                            <div className="form-control w-full ">
                                <label className="label">
                                    <span className="label-text">Add Category Image</span>
                                </label>
                                <input accept="image/*" max="1000000"  {...register("image", { required: true })} type="file" className="file-input file-input-bordered w-full " />
                                {errors.image && <span className='text-red-500 text-xs mt-2'>This field is required and the image must be less than or equal to 1MB.</span>}

                            </div>

                            <button className='btn btn-block mt-3'>Done !</button>

                        </form >
                    </div >

                )
            }

            <ToastContainer />
        </div >
    )
}

