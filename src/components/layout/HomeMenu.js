'use client';
import SectionHeaders from "@/components/layout/SectionHeaders";
import MenuItem from "@/components/menu/MenuItem";
import Image from "next/image";
import {useEffect, useState} from "react";

export default function HomeMenu() {
  const [bestSellers, setBestSellers] = useState([]);
  useEffect(() => {
    fetch('/api/menu-items').then(res => {
      res.json().then(menuItems => {
        setBestSellers(menuItems.slice(-3));
      });
    });
  }, []);
  return (
    <section className="">
      <div className="absolute left-0 right-0 w-full justify-start">
        <div className="absolute left-0 -top-[70px] text-left -z-10">
<Image
  src={'/sallad1.png'}
  width={200}
  height={300}
  alt={'sallad'}
  style={{ transform: 'rotate(37deg)' }}
/>
        </div>
        <div className="absolute -top-[100px] right-0 -z-10">
        <Image
  src={'/sallad2.png'}
  width={250}
  height={350}
  alt={'sallad'}
  style={{ transform: 'rotate( - 37deg)' }}
/>
        </div>
      </div>
      <div className="text-center mb-4">
        <SectionHeaders
          subHeader={'Göz Atın!'}
          mainHeader={'Çok Satanlar'} />
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        {bestSellers?.length > 0 && bestSellers.map(item => (
          <MenuItem key={item._id} {...item} />
        ))}
      </div>
    </section>
  );
}