import React from "react";
import Image from "next/image";

import LoginForm from "@/components/auth/LoginForm";

import doctorImage from "../../../../public/Image/doctor-login.svg";

const page = () => {
  return (
    <main className="min-h-screen bg-gray-300 flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-sm p-3 grid lg:grid-cols-2">
        {/* Left side - form */}
        <div className="flex items-center justify-center px-6 py-10 sm:px-12">
          <LoginForm />
        </div>

        {/* Right side - doctor image */}
        <div className="hidden lg:block">
          <div className="relative h-full min-h-145 rounded-xl overflow-hidden">
            <Image
              src={doctorImage}
              alt="doctor"
              fill
              priority
              sizes="50vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default page;
