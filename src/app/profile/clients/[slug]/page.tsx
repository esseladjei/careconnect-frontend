import ClientProfile from "@/components/ClientProfile";
type Params = Promise<{ slug: string }>;
async function fetchClient(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}/clients/${id}`, {
    cache: "no-store", // Disable caching for dynamic data
  });
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await res.json();
  return data.careconnect
}

export default async function ProfilePage({ params }: { params: Params}) {
  const { slug } = await params;
  const client = await fetchClient(slug);
  return (
    <>
      <ClientProfile client={client} />
    </>
  )
}
