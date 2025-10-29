import Link from "next/link";
import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <nav className="h-15 p-2 flex flex-row">
        <div className="w-full relative">
          <Link href="/">
            <Image src="/easy-financer.svg" alt="Easy Financer logo" fill />
          </Link>
        </div>
      </nav>
      {children}
    </>
  );
}
