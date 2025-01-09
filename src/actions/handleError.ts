export default function handleError(error: unknown) {
  if (error instanceof Error) {
    console.error('Error:', error.message);
  } else {
    console.error('An unknown error occurred:', error);
  }
  // Optionally, you can add more error handling logic here, such as logging to an external service
  throw error; // Re-throw the error after logging it
}