"use client";
import { AssetsNFT, AssetsToken } from "@/types/pagetypes";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { useSolanaAccount } from "./contexts/SolanaAccountContext";

type SliderProps = {
  tokenAssets?: AssetsToken[];
  nftAssets?: AssetsNFT[];
};

const SwiperData = ({ tokenAssets, nftAssets }: SliderProps) => {
  const { setSolanaAccount } = useSolanaAccount();

  const [slidesPerView, setSlidesPerView] = useState(3);
  const router = useRouter();

  const onClick = (route: string) => {
    setSolanaAccount(null);
    router.push(route);
  };

  useEffect(() => {
    if (tokenAssets && tokenAssets.length > 0) {
      if (tokenAssets.length < 3) {
        setSlidesPerView(tokenAssets.length);
      }
    }
    if (nftAssets && nftAssets.length > 0) {
      if (nftAssets.length < 3) {
        setSlidesPerView(nftAssets.length);
      }
    }
  }, []);

  return (
    <Swiper
      modules={[Pagination, Navigation]}
      spaceBetween={50}
      slidesPerView={slidesPerView}
      navigation
    >
      {tokenAssets &&
        tokenAssets.length > 0 &&
        tokenAssets.map((token, index) => (
          <SwiperSlide key={token.pubkey}>
            <div className="flex flex-col gap-4 text-white">
              <img
                src={token.img}
                alt={`Slide ${index + 1}`}
                className="max-w-28 cursor-pointer"
                onClick={() => onClick(`/token/${token.pubkey}`)}
              />
              <p>{token.name}</p>
              <p>{token.balance}</p>
            </div>
          </SwiperSlide>
        ))}
      {nftAssets &&
        nftAssets.length > 0 &&
        nftAssets.map((nft, index) => (
          <SwiperSlide key={nft.pubkey}>
            <div className="flex flex-col gap-4 text-white">
              {nft.mime.includes("image") ? (
                <img
                  src={nft.img}
                  alt={`Slide ${index + 1}`}
                  className="max-w-96  cursor-pointer"
                  onClick={() => onClick(`/nft/${nft.pubkey}`)}
                />
              ) : (
                <video
                  width="384"
                  autoPlay
                  loop
                  muted
                  playsInline
                  onClick={() => onClick(`/nft/${nft.pubkey}`)}
                  className="cursor-pointer"
                >
                  <source src={nft.img} type="video/mp4" />
                </video>
              )}
              <p>{nft.name}</p>
            </div>
          </SwiperSlide>
        ))}
    </Swiper>
  );
};

export default SwiperData;
