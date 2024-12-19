import React from 'react'

const  Search : React.FC =() =>{
  const [practioner, setPractitioner] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [care, setCare] = useState<string>('');
  const handleFindPractitionerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setPractitioner(value)
  }
  return (
    <div className="w-full">
      <input
        type="text"
        placeholder="Find practitioner..."
        value={practioner}
        onChange={handleFindPractitionerChange}
        className="w-full border border-gray-300 rounded p-2"
      />
    </div>
  )
}

export default Search