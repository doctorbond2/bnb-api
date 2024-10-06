import Link from 'next/link';
export default function NotFound() {
  return (
    <div>
      Not Found
      <Link href={'/'}>Back to home</Link>
    </div>
  );
}
