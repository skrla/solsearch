import Image from "next/image";
import { FaGithub, FaDiscord, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="flex items-center justify-between p-5 border-t border-border">
      <a href="/">
        <Image
          width={140}
          height={40}
          src="/images/solsearchLogo.svg"
          alt="Solsearch Logo"
        />
      </a>
      <div className="flex gap-4">
        <a href="https://github.com/skrla" target="_blank">
          <FaGithub className="text-placeholder size-6" />
        </a>
        <a href="https://discord.com/users/265607151244804119" target="_blank">
          <FaDiscord className="text-placeholder size-6" />
        </a>
        <a href="https://www.linkedin.com/in/skrlama/" target="_blank">
          <FaLinkedin className="text-placeholder size-6" />
        </a>
      </div>
      <div>
        <p className="font-open text-placeholder text-sm">Solsearch © 2024</p>
      </div>
    </footer>
  );
}
