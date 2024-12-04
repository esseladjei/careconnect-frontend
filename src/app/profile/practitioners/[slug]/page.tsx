import PractitionerProfile from "@/components/PractitionerProfile";
import { redirect } from 'next/navigation'
import Cookies from 'js-cookie';
type Params = Promise<{ slug: string }>;

async function fetchPractitioner(id: string) {
  const token = Cookies.get('token')

  if (!token) {
    redirect('/') // If no token is found, redirect to login page
  }
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}/api/practitioners/${id}`, {
    headers: {
      "Content-Type": "application/json",
      "authorization": `Bearer ${token}`,
    },
    cache: "no-store", // Disable caching for dynamic data
  });
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await res.json();
  return data.careconnect
}

export default async function ProfilePage({ params }: { params: Params }) {
  const { slug } = await params;
  const practitioner = await fetchPractitioner(slug);
  return (
    <>
      <PractitionerProfile practitioner={practitioner} />
    </>
  )
}
