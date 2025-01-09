'use server'
import { cookies } from 'next/headers';
import handleError from './handleError';
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
      .filter(([, value]) => value !== undefined && value !== null && value !== '')
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          if (value.every((item) => typeof item === 'string' || typeof item === 'number')) {
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
export const fetchSuggestions = async (queriesObject:  Record<string, any>, token: string | undefined):Promise<string |undefined> => {
  try {
    const filterQuery = await generateQueryString(queriesObject);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}/api/practitionerlocations${filterQuery}`, {
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${token}`,
      },
      cache:'force-cache'
    });
    if (!response.ok) {
      const failedResponse = await response.json();
      const { message } = failedResponse.careconnect
      console.error(message)
      throw new Error(`Fetching location suggestions failed, ${message}`);
    }
    const data = await response.json();
    return data.careconnect;
  } catch (error) {
    handleError(error);
  }
};
export const fetchPractitioners = async (queriesObject: Record<string, any>, token: string | undefined): Promise<FilteredPractitioners | undefined> => {
  try {
    // Replace with your actual API endpoint
    const queryString = await generateQueryString(queriesObject)
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}/api/practitionerfilters${queryString}`, {
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${token}`,
      },
      cache:'force-cache'
    });
    if (!response.ok) {
      const failedResponse = await response.json();
      const { message } = failedResponse.careconnect
      console.error(message)
      throw new Error(`Fetching practitioner failed, ${message}`);
    }
    const data = await response.json();
    return data.careconnect;
  } catch (error) {
     handleError(error);
  }

}
export const fetchSpecialisations = async (token:string |undefined):Promise<SpecialisationsProps[] | undefined> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}/api/specialisations`, {
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const failedResponse = await response.json();
      const { message } = failedResponse.careconnect
      console.error(message)
      throw new Error(`Fetching specialisations failed, ${message}`);
    }
    const data = await response.json();
    return data.careconnect;
  } catch (error) {
    handleError(error)
  }
}

