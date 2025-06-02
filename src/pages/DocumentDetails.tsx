import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDocumentById } from "../services/fileService";
import { CircularProgress, Button, Paper, Typography } from "@mui/material";

interface Document {
  id: number;
  fileName: string;
  categoryId: number;
  uploadDate: string;
  content: string;
}

const DocumentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        if (id) {
          const token = localStorage.getItem("token"); 
          if (!token) throw new Error("User not authenticated");

          const doc = await getDocumentById(id, token);
          setDocument(doc);
        }
      } catch (err) {
        setError("Failed to load document. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  if (loading) return <div className="flex justify-center mt-10"><CircularProgress /></div>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="flex justify-center mt-6">
      <Paper elevation={3} className="p-6 w-full max-w-2xl">
        <Typography variant="h4" gutterBottom>
          {document?.fileName}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Uploaded on: {document ? new Date(document.uploadDate).toLocaleDateString() : ""}
        </Typography>
        <Typography variant="body1" className="mt-4">
          {document?.content}
        </Typography>
        <Button variant="contained" color="primary" className="mt-4" onClick={() => navigate(-1)}>
          Back
        </Button>
      </Paper>
    </div>
  );
};

export default DocumentDetails;
