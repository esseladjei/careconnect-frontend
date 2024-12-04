import ClientProfile from "@/components/ClientProfile";
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

type Params = Promise<{ slug: string }>;

async function fetchClient(id: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) {
    redirect('/') // If no token is found, redirect to login page
  }
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}/api/clients/${id}`, {
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
  const client = await fetchClient(slug);
  return (
    <>
      <ClientProfile client={client} />
    </>
  )
}
