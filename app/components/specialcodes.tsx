import React, { useEffect, useState } from 'react';

const SpecialCodes = () => {
  const [codes, setCodes] = useState([]);
  const [fetchAll, setFetchAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCodes = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/create/special-code?all=${fetchAll}`);
        const data = await response.json();
        setCodes(data);
      } catch (err:any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCodes();
  }, [fetchAll]);

  const toggleFetchAll = () => {
    setFetchAll(!fetchAll);
  };

  return (
    <div>
      <h1>Special Codes</h1>
      <button onClick={toggleFetchAll}>
        {fetchAll ? 'Show Active Codes' : 'Show All Codes'}
      </button>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && (
        <ul>
          {codes.map((code: any) => (
            <li key={code.id}>
              <p>Code: {code.code}</p>
              <p>Amount: {code.amount}</p>
              <p>Expires At: {new Date(code.expiresAt).toLocaleString()}</p>
              <p>Redeemed By: {code.userId || 'Not Redeemed'}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SpecialCodes;
