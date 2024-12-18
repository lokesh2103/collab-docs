/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import ReactQuill from 'react-quill';
import {
  setDoc,
  doc,
  getDoc,
  onSnapshot,
  collection,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../firebase-config';
import { v4 as uuidv4 } from 'uuid';
import { throttle } from 'lodash';
import 'react-quill/dist/quill.snow.css';
import './editor-styles.css';
import { useParams } from 'react-router-dom';

const EditorPage = () => {
  const { id: docId } = useParams();
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const quillRef = useRef<any>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [toastOpen, setToastOpen] = useState(false);
  const userId = uuidv4(); // Unique ID for the user
  const username = `User-${userId.slice(0, 4)}`; // Generate simple username

  const isLocalChange = useRef<boolean>(false);

  const documentRef = doc(db, 'documents', `${docId}`);
  const collaboratorsRef = collection(documentRef, 'collaborators');

  const saveContent = throttle(() => {
    // Save content logic here (e.g., Firebase sync)
    if (quillRef.current && isLocalChange.current) {
      const content = quillRef.current.getEditor().getContents();
      console.log(`Saving content: `, content);

      // Save content to Firestore DB
      setDoc(documentRef, { content: content.ops }, { merge: true })
        .then(() => console.log('Content saved!'))
        .catch(() => console.error);

      isLocalChange.current = false;
    }
  }, 1000);

  const copySharableId = () => {
    if (docId) {
      navigator.clipboard.writeText(docId).then(
        () => setToastOpen(true),
        (error) => console.error('Error copying link:', error)
      );
    } else {
      console.error('Error: Document ID is undefined');
    }
  };

  const handleToastClose = () => setToastOpen(false);

  // Add current user to collaborators list
  const joinDocument = async () => {
    await setDoc(doc(collaboratorsRef, userId), {
      username,
      // lastActive: serverTimestamp(),
    });
  };

  // Remove user from collaborators list when they leave
  const leaveDocument = async () => {
    await deleteDoc(doc(collaboratorsRef, userId));
  };

  useEffect(() => {
    // Join the document when the component mounts
    joinDocument();

    if (quillRef.current) {
      // Load initial content from Firestore DB
      getDoc(documentRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            const savedContent = docSnap.data().content;
            if (savedContent) {
              quillRef.current.getEditor().setContents(savedContent);
            }
          } else {
            console.log('No document found! Starting with an empty editor.');
          }
        })
        .catch(console.error);

      // Listen to Firestore DB for any updates and update locally in realtime
      const unsubscribe = onSnapshot(documentRef, (docSnap) => {
        if (docSnap.exists()) {
          const newContent = docSnap.data().content;
          if (!isEditing) {
            const editor = quillRef.current.getEditor();
            const currentCursorPosition = editor.getSelection()?.index || 0;

            editor.setContents(newContent, 'silent');
            editor.setSelection(currentCursorPosition);
          }
        }
      });

      // Listen for changes in the collaborators sub-collection
      const unsubscribeCollaborators = onSnapshot(
        collection(documentRef, 'collaborators'),
        (snapshot) => {
          const activeCollaborators = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setCollaborators(activeCollaborators);
        }
      );

      // Listen for local changes and save it to Firestore DB
      const editor = quillRef.current.getEditor();

      editor.on('text-change', (_delta: any, _oldDelta: any, source: any) => {
        // to make sure local user is editing something and not coming from the database
        if (source === 'user') {
          isLocalChange.current = true;
          setIsEditing(true);

          saveContent();

          // we want to reset the editing state after 5 seconds of inactivity
          setTimeout(() => setIsEditing(false), 5000); // this is varaiable
        }
      });

      // Add beforeunload event to clean up collaborator on tab close
      const handleBeforeUnload = () => {
        leaveDocument();
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      // Cleanup function to unsubscribe from Firestore DB listener
      return () => {
        unsubscribe();
        unsubscribeCollaborators();
        editor.off('text-change'); // Remove the listener
        leaveDocument(); // Remove the collaborator on unmount
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docId]);

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation Bar */}
      <AppBar position="static" sx={{ backgroundColor: 'background.default' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, color: 'text.primary' }}>
            CollabDocs - Editor
          </Typography>
          <Button
            variant="outlined"
            size="small"
            sx={{
              fontSize: '0.75rem',
              padding: '4px 8px',
              minWidth: 'auto',
            }}
            onClick={copySharableId}
          >
            Copy Document ID
          </Button>
        </Toolbar>
      </AppBar>

      {/* Editor Section */}
      <Box
        sx={{
          flexGrow: 1,
          backgroundColor: 'background.paper',
          color: 'text.primary',
          padding: 2,
          borderRadius: '8px',
          margin: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        }}
      >
        <ReactQuill
          ref={quillRef}
          style={{
            flexGrow: 1, // Fill remaining height
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            color: 'inherit',
            backgroundColor: 'inherit',
            borderRadius: '8px',
          }}
        />
      </Box>

      {/* Collaborator Status */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <PeopleIcon fontSize="small" sx={{ mr: 1 }} />
        <Typography variant="body2">
          {collaborators.length} collaborators active
        </Typography>
      </Box>

      {/* Snackbar for Toast Notification */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={1000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleToastClose}
          severity="success"
          sx={{ width: '100%' }}
        >
          Document ID copied to clipboard!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditorPage;
