import React, { useEffect, useState } from 'react';
import { getUserFiles } from '../services/apiClient';

const UserFiles: React.FC<{ token: string }> = ({ token }) => {
  const [files, setFiles] = useState<{ id: string; name: string }[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFiles = async () => {
      const result = await getUserFiles(token);
      if (result.error) {
        setError(result.error);
      } else {
        setFiles(result);
      }
    };
    fetchFiles();
  }, [token]);

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">הקבצים שלך</h2>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <ul className="list-disc pl-4">
          {files.map((file) => (
            <li key={file.id} className="text-gray-700">{file.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserFiles;
