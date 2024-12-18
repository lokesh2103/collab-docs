import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  TextField,
  Snackbar,
  Alert,
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase-config';

const LandingPage = () => {
  const navigate = useNavigate();
  const [docIdInput, setDocIdInput] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error',
  });

  const createNewDocument = () => {
    const docId = uuidv4();
    const initialContent = { content: [] }; // Default empty content

    // Save the new document to Firestore
    setDoc(doc(db, 'documents', docId), initialContent)
      .then(() => {
        console.log('New document created with ID:', docId);
        navigate(`/editor/${docId}`); // Navigate to the editor with the new document
      })
      .catch((error) => console.error('Error creating document:', error));
  };

  const navigateToDocument = async () => {
    if (!docIdInput.trim()) {
      setSnackbar({
        open: true,
        message: 'Please enter a valid Document ID.',
        severity: 'error',
      });
      return;
    }

    const docId = docIdInput.trim();

    try {
      // Check if the document exists in Firestore
      const documentRef = doc(db, 'documents', `${docId}`);
      const docSnap = await getDoc(documentRef);

      if (docSnap.exists()) {
        navigate(`/editor/${docId}`);
      } else {
        setSnackbar({
          open: true,
          message: 'Document not found. Please check the ID or link.',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('Error fetching document:', error);
      setSnackbar({
        open: true,
        message:
          'An error occurred while fetching the document. Please try again.',
        severity: 'error',
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        backgroundColor: 'background.default',
        color: 'text.primary',
      }}
    >
      <Typography variant="h1" gutterBottom>
        Welcome to CollabDocs
      </Typography>
      <Typography variant="body1" gutterBottom>
        Collaborate on documents in real-time. Start editing now!
      </Typography>
      <Button
        variant="contained"
        onClick={createNewDocument}
        sx={{
          mt: 2,
          backgroundColor: 'background.paper',
        }}
      >
        Start a New Document
      </Button>

      <Box
        sx={{
          mt: 4,
          width: '100%',
          maxWidth: 400,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="body1" gutterBottom>
          Or enter a shared Document ID:
        </Typography>
        <TextField
          label="Document ID"
          variant="outlined"
          value={docIdInput}
          onChange={(e) => setDocIdInput(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Button
          variant="outlined"
          onClick={navigateToDocument}
          sx={{
            width: '100%',
          }}
        >
          Open Document
        </Button>
      </Box>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={
            snackbar.severity as 'success' | 'info' | 'warning' | 'error'
          }
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LandingPage;
