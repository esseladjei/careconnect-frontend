'use server'
import { cookies } from 'next/headers';
import { FilteredPractitioners, SpecialisationsProps } from '../../types/typesdefinitions';
export default async function getToken() { 
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value;
  return token;
}
export const  generateQueryString = async (params: Record<string, any>):Promise<string> => {
  return (
    '?' +
    Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null && value !== '')
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          if (value.every((item) => typeof item === 'string')) {
            // Handle array of strings
            return `${encodeURIComponent(key)}=${encodeURIComponent(value.join('-'))}`;
          } else if (value.every((item) => typeof item === 'object' && 'specialisationId' in item && 'name' in item)) {
            // Handle array of objects with { specialisationId, name }
            const combinedValues = value.map((obj) => `${obj.specialisationId}`).join(',');
            return `${encodeURIComponent(key)}=${encodeURIComponent(combinedValues)}`;
          }
        }
        // Handle other cases
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      }).join('&')     
  );
}
export const fetchSuggestions = async (queriesObject:  Record<string, any>, token: string | undefined):Promise<string> => {
  try {
    const filterQuery = await generateQueryString(queriesObject);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}/api/practitionerlocations${filterQuery}`, {
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const failedResponse = await response.json();
      throw new Error(`Fetching location suggestions failed, ${failedResponse.careconnect.message}`);
    }
    const data = await response.json();
    return data.careconnect;
  } catch (error) {
    throw new Error(`${error}Error fetching suggestions:`);
  }
};
export const fetchPractitioners = async (queriesObject: Record<string, any>, token: string | undefined):Promise<FilteredPractitioners> => {
  try {
    // Replace with your actual API endpoint
    const queryString = await generateQueryString(queriesObject)
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}/api/practitionerfilters${queryString}`, {
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const failedResponse = await response.json();
      throw new Error(`Filter error, ${failedResponse.careconnect?.message}`);
    }
    const data = await response.json();
    return data.careconnect;
  } catch (error) {
    throw new Error(`fetch practitioners failed ${error}`);
  }

}
export const fetchSpecialisations = async (token:string |undefined):Promise<SpecialisationsProps[]> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}/api/specialisations`, {
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const failedResponse = await response.json();
      throw new Error(`Fetching specialisations failed, ${failedResponse.careconnect.message}`);
    }
    const data = await response.json();
    return data.careconnect;
  } catch (error : any) {
    throw new Error(error)
  }
}