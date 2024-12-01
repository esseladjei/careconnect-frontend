import PractitionerProfile from "@/components/PractitionerProfile";
type Params = Promise<{ slug: string }>;
async function fetchPractitioner(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}/practitioners/${id}`, {
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
